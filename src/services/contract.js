/**
 * contract.js
 * -----------
 * JavaScript client for the SkillSwap Soroban smart contract.
 * Replaces direct Horizon Payment operations with on-chain contract calls.
 *
 * Usage:
 *   import { SkillSwapContract } from './contract';
 *   const contract = new SkillSwapContract(contractId, userWalletAddress);
 *   const listingId = await contract.listSkill({ ... });
 */

import {
  Contract,
  Networks,
  TransactionBuilder,
  SorobanRpc,
  nativeToScVal,
  scValToNative,
  Address,
  xdr,
} from '@stellar/stellar-sdk';
import { signTransaction } from '@stellar/freighter-api';

// ─────────────────────────────────────────────────────────────
// CONFIG — update CONTRACT_ID after deploying your contract
// ─────────────────────────────────────────────────────────────
export const SOROBAN_RPC_URL = 'https://soroban-testnet.stellar.org';
export const NETWORK_PASSPHRASE = Networks.TESTNET;

/**
 * Replace this with your actual deployed contract ID.
 * Run: soroban contract deploy ... (see contracts/README.md)
 */
export const CONTRACT_ID =
  import.meta.env.VITE_CONTRACT_ID ||
  'CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD2KM'; // placeholder

// ─────────────────────────────────────────────────────────────
// Helper: build → simulate → sign → submit
// ─────────────────────────────────────────────────────────────
async function invokeContract({ method, args, callerAddress }) {
  const server = new SorobanRpc.Server(SOROBAN_RPC_URL, { allowHttp: false });
  const contract = new Contract(CONTRACT_ID);

  // 1. Load caller account
  const account = await server.getAccount(callerAddress);

  // 2. Build the transaction
  const tx = new TransactionBuilder(account, {
    fee: '100000',
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(contract.call(method, ...args))
    .setTimeout(60)
    .build();

  // 3. Simulate to get the footprint & resource fees
  const simResult = await server.simulateTransaction(tx);
  if (SorobanRpc.Api.isSimulationError(simResult)) {
    throw new Error(`Simulation failed: ${simResult.error}`);
  }

  // 4. Assemble the final transaction (adds Soroban resource extension)
  const assembled = SorobanRpc.assembleTransaction(tx, simResult).build();

  // 5. Sign via Freighter
  const signResult = await signTransaction(assembled.toXDR(), {
    networkPassphrase: NETWORK_PASSPHRASE,
  });
  if (signResult.error) throw new Error(signResult.error);

  const signedTx = TransactionBuilder.fromXDR(
    signResult.signedTxXdr ?? signResult,
    NETWORK_PASSPHRASE
  );

  // 6. Submit
  const sendResp = await server.sendTransaction(signedTx);
  if (sendResp.status === 'ERROR') {
    throw new Error(`Submit failed: ${JSON.stringify(sendResp.errorResult)}`);
  }

  // 7. Poll for confirmation
  let getResp = await server.getTransaction(sendResp.hash);
  while (getResp.status === 'NOT_FOUND') {
    await new Promise((r) => setTimeout(r, 1500));
    getResp = await server.getTransaction(sendResp.hash);
  }

  if (getResp.status === 'FAILED') {
    throw new Error(`Transaction failed: ${JSON.stringify(getResp)}`);
  }

  return getResp; // contains .returnValue (scVal)
}

// ─────────────────────────────────────────────────────────────
// Read-only call (no signing required)
// ─────────────────────────────────────────────────────────────
async function readContract({ method, args }) {
  const server = new SorobanRpc.Server(SOROBAN_RPC_URL, { allowHttp: false });
  const contract = new Contract(CONTRACT_ID);

  // Use a dummy source account for simulation
  const dummyKey = 'GAAZI4TCR3TY5OJHCTJC2A4QSY6CJWJH5IAJTGKIN2ER7LBNVKOCCWN';
  const account = await server.getAccount(dummyKey).catch(() => ({
    accountId: () => dummyKey,
    sequenceNumber: () => '0',
    incrementSequenceNumber: () => {},
  }));

  const tx = new TransactionBuilder(account, {
    fee: '100',
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(contract.call(method, ...args))
    .setTimeout(30)
    .build();

  const simResult = await server.simulateTransaction(tx);
  if (SorobanRpc.Api.isSimulationError(simResult)) {
    throw new Error(`Read failed: ${simResult.error}`);
  }

  return scValToNative(simResult.result.retval);
}

// ─────────────────────────────────────────────────────────────
// SkillSwapContract class
// ─────────────────────────────────────────────────────────────
export class SkillSwapContract {
  /**
   * @param {string} callerAddress - the connected Freighter wallet address
   */
  constructor(callerAddress) {
    this.callerAddress = callerAddress;
  }

  // ── Skill Exchange ──────────────────────────────────────────

  /**
   * Post a new skill-exchange listing on-chain.
   * @returns {Promise<number>} new listing ID
   */
  async listSkill({ skillOffer, skillWant, levelOffer, levelWant }) {
    const args = [
      new Address(this.callerAddress).toScVal(),
      nativeToScVal(skillOffer, { type: 'string' }),
      nativeToScVal(skillWant,  { type: 'string' }),
      nativeToScVal(levelOffer, { type: 'symbol' }),
      nativeToScVal(levelWant,  { type: 'symbol' }),
    ];
    const result = await invokeContract({
      method: 'list_skill',
      args,
      callerAddress: this.callerAddress,
    });
    return Number(scValToNative(result.returnValue));
  }

  /**
   * Request to swap with an existing listing.
   */
  async requestSwap(listingId) {
    await invokeContract({
      method: 'request_swap',
      args: [
        new Address(this.callerAddress).toScVal(),
        nativeToScVal(listingId, { type: 'u64' }),
      ],
      callerAddress: this.callerAddress,
    });
  }

  /**
   * Poster accepts a swap request.
   */
  async acceptSwap(listingId) {
    await invokeContract({
      method: 'accept_swap',
      args: [
        new Address(this.callerAddress).toScVal(),
        nativeToScVal(listingId, { type: 'u64' }),
      ],
      callerAddress: this.callerAddress,
    });
  }

  /**
   * Mark a swap as completed.
   */
  async completeSwap(listingId) {
    await invokeContract({
      method: 'complete_swap',
      args: [
        new Address(this.callerAddress).toScVal(),
        nativeToScVal(listingId, { type: 'u64' }),
      ],
      callerAddress: this.callerAddress,
    });
  }

  /**
   * Cancel an open listing.
   */
  async cancelListing(listingId) {
    await invokeContract({
      method: 'cancel_listing',
      args: [
        new Address(this.callerAddress).toScVal(),
        nativeToScVal(listingId, { type: 'u64' }),
      ],
      callerAddress: this.callerAddress,
    });
  }

  /**
   * Read a listing (no signing).
   */
  async getListing(listingId) {
    return readContract({
      method: 'get_listing',
      args: [nativeToScVal(listingId, { type: 'u64' })],
    });
  }

  // ── Session Booking ─────────────────────────────────────────

  /**
   * Book a session — transfers XLM to escrow inside the contract.
   * @param {string} mentorAddress
   * @param {number} amountXlm - whole XLM units (e.g. 10)
   * @returns {Promise<number>} session ID
   */
  async bookSession(mentorAddress, amountXlm) {
    const args = [
      new Address(this.callerAddress).toScVal(),
      new Address(mentorAddress).toScVal(),
      nativeToScVal(BigInt(amountXlm), { type: 'i128' }),
    ];
    const result = await invokeContract({
      method: 'book_session',
      args,
      callerAddress: this.callerAddress,
    });
    return Number(scValToNative(result.returnValue));
  }

  /**
   * Mentor confirms session — releases escrowed XLM to mentor.
   */
  async confirmSession(sessionId) {
    await invokeContract({
      method: 'confirm_session',
      args: [
        new Address(this.callerAddress).toScVal(),
        nativeToScVal(sessionId, { type: 'u64' }),
      ],
      callerAddress: this.callerAddress,
    });
  }

  /**
   * Learner raises a dispute.
   */
  async disputeSession(sessionId) {
    await invokeContract({
      method: 'dispute_session',
      args: [
        new Address(this.callerAddress).toScVal(),
        nativeToScVal(sessionId, { type: 'u64' }),
      ],
      callerAddress: this.callerAddress,
    });
  }

  /**
   * Read a session (no signing).
   */
  async getSession(sessionId) {
    return readContract({
      method: 'get_session',
      args: [nativeToScVal(sessionId, { type: 'u64' })],
    });
  }

  // ── Team Formation ──────────────────────────────────────────

  /**
   * Create a new team.
   * @returns {Promise<number>} team ID
   */
  async createTeam({ name, requiredStakeXlm, maxMembers }) {
    const args = [
      new Address(this.callerAddress).toScVal(),
      nativeToScVal(name,            { type: 'string' }),
      nativeToScVal(BigInt(requiredStakeXlm), { type: 'i128' }),
      nativeToScVal(maxMembers,      { type: 'u32' }),
    ];
    const result = await invokeContract({
      method: 'create_team',
      args,
      callerAddress: this.callerAddress,
    });
    return Number(scValToNative(result.returnValue));
  }

  /**
   * Join a team by staking XLM.
   */
  async joinTeam(teamId) {
    await invokeContract({
      method: 'join_team',
      args: [
        new Address(this.callerAddress).toScVal(),
        nativeToScVal(teamId, { type: 'u64' }),
      ],
      callerAddress: this.callerAddress,
    });
  }

  /**
   * Leave a team and get stake refunded (only when team is "open").
   */
  async leaveTeam(teamId) {
    await invokeContract({
      method: 'leave_team',
      args: [
        new Address(this.callerAddress).toScVal(),
        nativeToScVal(teamId, { type: 'u64' }),
      ],
      callerAddress: this.callerAddress,
    });
  }

  /**
   * Creator activates a team (locks membership).
   */
  async activateTeam(teamId) {
    await invokeContract({
      method: 'activate_team',
      args: [
        new Address(this.callerAddress).toScVal(),
        nativeToScVal(teamId, { type: 'u64' }),
      ],
      callerAddress: this.callerAddress,
    });
  }

  /**
   * Creator closes a team and refunds all stakes.
   */
  async closeTeam(teamId) {
    await invokeContract({
      method: 'close_team',
      args: [
        new Address(this.callerAddress).toScVal(),
        nativeToScVal(teamId, { type: 'u64' }),
      ],
      callerAddress: this.callerAddress,
    });
  }

  /**
   * Read a team (no signing).
   */
  async getTeam(teamId) {
    return readContract({
      method: 'get_team',
      args: [nativeToScVal(teamId, { type: 'u64' })],
    });
  }

  /**
   * Get all members of a team (no signing).
   */
  async getTeamMembers(teamId) {
    return readContract({
      method: 'get_team_members',
      args: [nativeToScVal(teamId, { type: 'u64' })],
    });
  }

  // ── Reputation ──────────────────────────────────────────────

  /**
   * Rate a user 1–5 stars.
   */
  async rateUser(targetAddress, score) {
    await invokeContract({
      method: 'rate_user',
      args: [
        new Address(this.callerAddress).toScVal(),
        new Address(targetAddress).toScVal(),
        nativeToScVal(score, { type: 'u32' }),
      ],
      callerAddress: this.callerAddress,
    });
  }

  /**
   * Get on-chain reputation for any address (no signing).
   * @returns {{ total_score: number, review_count: number }}
   */
  async getReputation(userAddress) {
    return readContract({
      method: 'get_reputation',
      args: [new Address(userAddress).toScVal()],
    });
  }
}

// ─────────────────────────────────────────────────────────────
// Singleton factory
// ─────────────────────────────────────────────────────────────
/**
 * Create a contract client for the currently connected wallet.
 * @param {string} walletAddress - from Freighter
 */
export function createContractClient(walletAddress) {
  if (!walletAddress) throw new Error('Wallet not connected');
  return new SkillSwapContract(walletAddress);
}
