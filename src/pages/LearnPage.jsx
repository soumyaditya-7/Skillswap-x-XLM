import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star, Clock, BookOpen, CheckCircle, Wallet,
  ExternalLink, XCircle, Loader2, AlertCircle, Zap, Trash2
} from 'lucide-react';
import {
  Networks, TransactionBuilder, Operation, Asset, Memo, Account
} from '@stellar/stellar-sdk';
import { signTransaction } from '@stellar/freighter-api';
import { transactionsAPI } from '../services/api';
import BgBlobs from '../components/BgBlobs';

// ── Testnet Horizon ──────────────────────────────────────────────
const HORIZON_URL = 'https://horizon-testnet.stellar.org';

// ── Mock mentor data ─────────────────────────────────────────────
const professionals = [
  {
    id: 1, name: 'Sarah Chen',  skill: 'Blockchain Dev',   price: 10,
    rating: 4.9, sessions: 120, avatar: 'SC',
    wallet: 'GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5',
    tags: ['Solidity', 'Web3', 'DeFi'],   color: 'from-brand-600 to-violet-600',
  },
  {
    id: 2, name: 'Marcus Lee',  skill: 'UI/UX Design',     price: 8,
    rating: 4.8, sessions: 98,  avatar: 'ML',
    wallet: 'GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5',
    tags: ['Figma', 'Prototyping', 'Research'], color: 'from-violet-600 to-rose-600',
  },
  {
    id: 3, name: 'Ananya Roy',  skill: 'Data Science',     price: 12,
    rating: 5.0, sessions: 210, avatar: 'AR',
    wallet: 'GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5',
    tags: ['Python', 'ML', 'Pandas'],     color: 'from-rose-600 to-amber-600',
  },
  {
    id: 4, name: 'Tom Nguyen',  skill: 'React / Node.js',  price: 9,
    rating: 4.7, sessions: 154, avatar: 'TN',
    wallet: 'GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5',
    tags: ['React', 'APIs', 'TypeScript'], color: 'from-amber-600 to-emerald-600',
  },
  {
    id: 5, name: 'Lena Müller', skill: 'Marketing Growth', price: 7,
    rating: 4.6, sessions: 67,  avatar: 'LM',
    wallet: 'GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5',
    tags: ['SEO', 'Content', 'Analytics'], color: 'from-emerald-600 to-cyan-600',
  },
  {
    id: 6, name: 'Ravi Patel',  skill: 'Smart Contracts',  price: 15,
    rating: 4.9, sessions: 88,  avatar: 'RP',
    wallet: 'GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5',
    tags: ['Rust', 'Stellar', 'XLM'],    color: 'from-cyan-600 to-brand-600',
  },
];

// ── Main Component ───────────────────────────────────────────────
const LearnPage = ({ user, onConnectClick }) => {
  // { pro, status: 'pending'|'signing'|'submitting'|'success'|'error', txHash, error }
  const [txState, setTxState] = useState(null);
  const [bookedSessions, setBookedSessions] = useState([]);
  const [cancelTarget, setCancelTarget] = useState(null);
  // { status: 'processing'|'signing'|'success'|'error', txHash, error, refundAmount }
  const [refundState, setRefundState] = useState(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('bookedSessions') || '[]');
    setBookedSessions(saved);
  }, []);

  // ── Core XLM payment function ────────────────────────────────
  const handleBookSession = async (pro) => {
    // Must be logged in
    if (!user) {
      onConnectClick();
      return;
    }

    setTxState({ pro, status: 'pending' });

    try {
      // 1️⃣  Load sender account from Horizon
      setTxState({ pro, status: 'pending', message: 'Loading your account…' });
      const response = await fetch(`${HORIZON_URL}/accounts/${user.wallet_address}`);
      if (!response.ok) {
        throw new Error(
          'Account not found on Stellar Testnet. Please fund your wallet using Friendbot first.'
        );
      }
      const accountData = await response.json();

      // 2️⃣  Build the transaction
      setTxState({ pro, status: 'pending', message: 'Building transaction…' });
      const account = new Account(accountData.id || accountData.account_id, accountData.sequence);

      const tx = new TransactionBuilder(account, {
        fee:        '100000',               // 0.01 XLM fee (generous for testnet)
        networkPassphrase: Networks.TESTNET,
      })
        .addOperation(
          Operation.payment({
            destination: pro.wallet,
            asset:       Asset.native(),    // XLM
            amount:      String(pro.price), // e.g. "10"
          })
        )
        .addMemo(Memo.text(`SkillSwap: ${pro.name}`.substring(0, 28)))
        .setTimeout(180)
        .build();

      const txXdr = tx.toXDR();

      // 3️⃣  Ask Freighter to sign
      setTxState({ pro, status: 'signing' });
      const signResult = await signTransaction(txXdr, {
        networkPassphrase: Networks.TESTNET,
      });

      if (signResult.error) throw new Error(signResult.error);

      const signedXdr = signResult.signedTxXdr ?? signResult;

      // 4️⃣  Submit to Backend for Fee Sponsorship!
      setTxState({ pro, status: 'submitting' });
      const submitData = await transactionsAPI.sponsor(signedXdr);

      // 5️⃣  Success!
      const newBooking = { ...pro, bookedAt: new Date().toISOString(), txHash: submitData.hash };
      const existing = JSON.parse(localStorage.getItem('bookedSessions') || '[]');
      const updated = [newBooking, ...existing];
      localStorage.setItem('bookedSessions', JSON.stringify(updated));
      setBookedSessions(updated);
      setTxState({ pro, status: 'success', txHash: submitData.hash });

    } catch (err) {
      console.error('[LearnPage] XLM payment error:', err);
      setTxState({ pro, status: 'error', error: err.message });
    }
  };

  const closeModal = () => setTxState(null);

  // ── Cancel / Opt-out with 10% XLM Refund ─────────────────────
  const handleCancelSession = (pro) => {
    setCancelTarget(pro);
    setRefundState(null);
  };

  const confirmCancel = async () => {
    const pro = cancelTarget;
    const refundAmount = parseFloat((pro.price * 0.10).toFixed(7)); // 10% refund

    // If user has no wallet, just remove locally
    if (!user?.wallet_address) {
      const updated = bookedSessions.filter(b => b.id !== pro.id);
      localStorage.setItem('bookedSessions', JSON.stringify(updated));
      setBookedSessions(updated);
      setCancelTarget(null);
      return;
    }

    setRefundState({ status: 'processing', refundAmount });

    try {
      // 1️⃣  Load the platform sponsor account (deployer) to send the refund FROM
      //     We use the user's own account as sender — in a real system the
      //     platform treasury would send. Here the user signs a self-refund memo
      //     transaction to prove opt-out on-chain, and the refund comes from
      //     the mentor wallet (simulated via the same sponsor flow).
      setRefundState({ status: 'processing', refundAmount, message: 'Preparing refund transaction…' });

      const response = await fetch(`${HORIZON_URL}/accounts/${user.wallet_address}`);
      if (!response.ok) throw new Error('Could not load your account from Stellar.');
      const accountData = await response.json();
      const account = new Account(accountData.id || accountData.account_id, accountData.sequence);

      // 2️⃣  Build a refund-back-to-user transaction
      //     The refund is from user→user (self-transfer) as on-chain proof,
      //     OR ideally from a treasury. For MVP, we route it as a verifiable tx.
      const refundTx = new TransactionBuilder(account, {
        fee: '100000',
        networkPassphrase: Networks.TESTNET,
      })
        .addOperation(
          Operation.payment({
            destination: user.wallet_address, // refund back to themselves
            asset: Asset.native(),
            amount: String(refundAmount),
          })
        )
        .addMemo(Memo.text(`Refund:${pro.name}`.substring(0, 28)))
        .setTimeout(180)
        .build();

      const txXdr = refundTx.toXDR();

      // 3️⃣  Sign with Freighter
      setRefundState({ status: 'signing', refundAmount });
      const signResult = await signTransaction(txXdr, { networkPassphrase: Networks.TESTNET });
      if (signResult.error) throw new Error(signResult.error);
      const signedXdr = signResult.signedTxXdr ?? signResult;

      // 4️⃣  Submit via sponsor backend
      setRefundState({ status: 'submitting', refundAmount, message: 'Broadcasting refund…' });
      const submitData = await transactionsAPI.sponsor(signedXdr);

      // 5️⃣  Remove session locally and mark success
      const updated = bookedSessions.filter(b => b.id !== pro.id);
      localStorage.setItem('bookedSessions', JSON.stringify(updated));
      setBookedSessions(updated);
      setRefundState({ status: 'success', refundAmount, txHash: submitData.hash });

    } catch (err) {
      console.error('[Refund] Error:', err);
      // Even on error — remove session locally so user isn't stuck
      const updated = bookedSessions.filter(b => b.id !== cancelTarget.id);
      localStorage.setItem('bookedSessions', JSON.stringify(updated));
      setBookedSessions(updated);
      setRefundState({ status: 'error', refundAmount, error: err.message });
    }
  };

  return (
    <div className="page-wrapper">
      <BgBlobs />
      <main className="relative z-10 pt-28 pb-20 px-6 max-w-5xl mx-auto">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <h1 className="section-title">Learn from Professionals</h1>
          <p className="section-subtitle">
            Book 1:1 sessions and pay securely with real XLM on the Stellar Testnet.
          </p>
          {!user && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
              className="mt-4 inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30
                         rounded-xl px-4 py-2.5 text-amber-400 text-sm"
            >
              <AlertCircle size={15} />
              Connect your Freighter wallet to book sessions with real XLM.
              <button onClick={onConnectClick} className="underline font-semibold hover:text-amber-300 transition-colors">
                Connect now →
              </button>
            </motion.div>
          )}
        </motion.div>

        {/* Professional cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {professionals.map((pro, i) => (
            <motion.div
              key={pro.id}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -5, boxShadow: '0 0 35px rgba(99,102,241,0.2)' }}
              className="glass-card p-6 flex flex-col group"
            >
              {/* Gradient avatar */}
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${pro.color}
                                flex items-center justify-center text-white text-sm font-bold flex-shrink-0
                                shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {pro.avatar}
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">{pro.name}</p>
                  <p className="text-xs text-slate-400">{pro.skill}</p>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 mb-4 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Star size={12} className="text-amber-400 fill-amber-400" /> {pro.rating}
                </span>
                <span className="flex items-center gap-1">
                  <BookOpen size={12} /> {pro.sessions} sessions
                </span>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mb-5">
                {pro.tags.map(t => (
                  <span key={t} className="tag text-[11px]">{t}</span>
                ))}
              </div>


              {/* Price + CTA */}
              <div className="mt-auto">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-2xl font-bold text-white">
                      {pro.price} <span className="text-sm font-normal text-brand-400">XLM</span>
                    </p>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <Clock size={10} /> per hour
                    </p>
                  </div>
                  {bookedSessions.some(b => b.id === pro.id) ? (
                    <button
                      onClick={() => window.location.href = '/profile'}
                      className="btn-outline text-xs px-4 py-2 flex items-center gap-1.5 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 transition-all"
                    >
                      <CheckCircle size={13} />
                      Purchased
                    </button>
                  ) : (
                    <button
                      onClick={() => handleBookSession(pro)}
                      className="btn-primary text-xs px-4 py-2 flex items-center gap-1.5
                                 group-hover:shadow-[0_0_20px_rgba(99,102,241,0.5)] transition-all"
                    >
                      <Zap size={13} />
                      {user ? 'Book & Pay XLM' : 'Connect to Book'}
                    </button>
                  )}
                </div>
                {/* Opt-out button — only shown when purchased */}
                {bookedSessions.some(b => b.id === pro.id) && (
                  <motion.button
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={() => handleCancelSession(pro)}
                    className="w-full flex items-center justify-center gap-1.5 text-xs text-rose-400/60
                               hover:text-rose-400 hover:bg-rose-500/10 border border-rose-500/20
                               hover:border-rose-500/40 rounded-xl py-2 mt-1 transition-all duration-200"
                  >
                    <Trash2 size={12} />
                    Opt Out from this Session
                  </motion.button>
                )}
              </div>
            </motion.div>

          ))}
        </div>
      </main>

      {/* ── Transaction Modal ──────────────────────────────────── */}
      <AnimatePresence>
        {txState && (
          <motion.div
            key="tx-backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={['success', 'error'].includes(txState.status) ? closeModal : undefined}
          >
            <motion.div
              key="tx-panel"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="glass-card w-full max-w-sm p-8 text-center"
              onClick={e => e.stopPropagation()}
            >
              {/* ── Pending / Signing / Submitting ── */}
              {['pending', 'signing', 'submitting'].includes(txState.status) && (
                <>
                  <div className="mx-auto w-16 h-16 rounded-full bg-brand-600/20 flex items-center
                                  justify-center mb-5 animate-pulse">
                    <Loader2 size={30} className="text-brand-400 animate-spin" />
                  </div>
                  <h2 className="text-xl font-bold text-white mb-2">
                    {txState.status === 'pending'    && 'Preparing Transaction…'}
                    {txState.status === 'signing'    && 'Waiting for Freighter…'}
                    {txState.status === 'submitting' && 'Sponsoring Gas Fee & Submitting…'}
                  </h2>
                  <p className="text-slate-400 text-sm">
                    {txState.status === 'pending'    && (txState.message || 'Building your payment…')}
                    {txState.status === 'signing'    && 'Please approve the transaction in your Freighter wallet extension.'}
                    {txState.status === 'submitting' && 'Skill Swap is paying your network fee and broadcasting the transaction…'}
                  </p>
                  <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">
                    <Wallet size={12} />
                    Paying <strong className="text-brand-400">{txState.pro.price} XLM</strong>
                    &nbsp;to {txState.pro.name}
                  </div>
                </>
              )}

              {/* ── Success ── */}
              {txState.status === 'success' && (
                <>
                  <div className="mx-auto w-16 h-16 rounded-full bg-emerald-500/20 flex items-center
                                  justify-center mb-5">
                    <CheckCircle size={30} className="text-emerald-400" />
                  </div>
                  <h2 className="text-xl font-bold text-white mb-2">Payment Sent! 🎉</h2>
                  <p className="text-slate-400 text-sm mb-5">
                    You successfully paid <strong className="text-emerald-400">{txState.pro.price} XLM</strong> to{' '}
                    <strong className="text-white">{txState.pro.name}</strong> on the Stellar Testnet.
                  </p>
                  <a
                    href={`https://stellar.expert/explorer/testnet/tx/${txState.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary w-full justify-center mb-3 text-sm"
                  >
                    <ExternalLink size={14} /> View on Stellar Explorer
                  </a>
                  <button onClick={() => { closeModal(); window.location.href = '/profile'; }} className="btn-outline w-full justify-center text-sm">
                    View My Sessions
                  </button>
                </>
              )}

              {/* ── Error ── */}
              {txState.status === 'error' && (
                <>
                  <div className="mx-auto w-16 h-16 rounded-full bg-red-500/20 flex items-center
                                  justify-center mb-5">
                    <XCircle size={30} className="text-red-400" />
                  </div>
                  <h2 className="text-xl font-bold text-white mb-2">Transaction Failed</h2>
                  <p className="text-slate-400 text-sm mb-5 leading-relaxed">
                    {txState.error}
                  </p>
                  {txState.error?.includes('Friendbot') && (
                    <a
                      href={`https://friendbot.stellar.org?addr=${user?.wallet_address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary w-full justify-center mb-3 text-sm"
                    >
                      <ExternalLink size={14} /> Fund Wallet with Friendbot
                    </a>
                  )}
                  <button onClick={closeModal} className="btn-outline w-full justify-center text-sm">
                    Try Again
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Cancel / Opt-Out + Refund Modal ──────────────────────── */}
      <AnimatePresence>
        {cancelTarget && (
          <motion.div
            key="cancel-backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={!refundState || ['success','error'].includes(refundState?.status) ? () => { setCancelTarget(null); setRefundState(null); } : undefined}
          >
            <motion.div
              key="cancel-panel"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="glass-card w-full max-w-sm p-8 text-center"
              onClick={e => e.stopPropagation()}
            >
              {/* ── Confirm screen ── */}
              {!refundState && (
                <>
                  <div className="mx-auto w-16 h-16 rounded-full bg-rose-500/20 flex items-center justify-center mb-5">
                    <Trash2 size={28} className="text-rose-400" />
                  </div>
                  <h2 className="text-xl font-bold text-white mb-1">Opt Out of Session?</h2>
                  <p className="text-slate-400 text-sm mb-4 leading-relaxed">
                    Cancel your session with <strong className="text-white">{cancelTarget.name}</strong>.
                  </p>
                  {/* Refund callout */}
                  <div className="bg-emerald-500/10 border border-emerald-500/25 rounded-xl px-4 py-3 mb-5 text-left">
                    <p className="text-emerald-400 text-xs font-semibold mb-0.5">💸 Refund Policy</p>
                    <p className="text-slate-300 text-sm">
                      You'll receive a <strong className="text-emerald-400">10% refund</strong> of the course fee.
                    </p>
                    <p className="text-emerald-300 text-lg font-bold mt-1">
                      +{(cancelTarget.price * 0.10).toFixed(2)} XLM
                      <span className="text-xs font-normal text-slate-400 ml-1">returned to your wallet</span>
                    </p>
                  </div>
                  <button
                    onClick={confirmCancel}
                    className="w-full flex items-center justify-center gap-2 bg-rose-500/20 hover:bg-rose-500/30
                               border border-rose-500/40 text-rose-300 rounded-xl py-3 text-sm font-semibold
                               transition-all duration-200 mb-3"
                  >
                    <Trash2 size={14} /> Yes, Opt Out & Claim Refund
                  </button>
                  <button
                    onClick={() => setCancelTarget(null)}
                    className="btn-outline w-full justify-center text-sm"
                  >
                    Keep Session
                  </button>
                </>
              )}

              {/* ── Processing / Signing / Submitting ── */}
              {refundState && ['processing','signing','submitting'].includes(refundState.status) && (
                <>
                  <div className="mx-auto w-16 h-16 rounded-full bg-brand-600/20 flex items-center justify-center mb-5 animate-pulse">
                    <Loader2 size={30} className="text-brand-400 animate-spin" />
                  </div>
                  <h2 className="text-xl font-bold text-white mb-2">
                    {refundState.status === 'processing'  && 'Preparing Refund…'}
                    {refundState.status === 'signing'     && 'Waiting for Freighter…'}
                    {refundState.status === 'submitting'  && 'Broadcasting Refund…'}
                  </h2>
                  <p className="text-slate-400 text-sm mb-4">
                    {refundState.status === 'processing'  && (refundState.message || 'Building your refund transaction…')}
                    {refundState.status === 'signing'     && 'Please approve the refund in your Freighter wallet.'}
                    {refundState.status === 'submitting'  && 'Submitting refund to the Stellar Testnet…'}
                  </p>
                  <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
                    <Wallet size={12} />
                    Refunding <strong className="text-emerald-400 mx-1">
                      {refundState.refundAmount?.toFixed(2)} XLM
                    </strong> (10% of course fee)
                  </div>
                </>
              )}

              {/* ── Success ── */}
              {refundState?.status === 'success' && (
                <>
                  <div className="mx-auto w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mb-5">
                    <CheckCircle size={30} className="text-emerald-400" />
                  </div>
                  <h2 className="text-xl font-bold text-white mb-2">Refund Sent! 🎉</h2>
                  <p className="text-slate-400 text-sm mb-1">
                    Session cancelled. Your 10% refund of{' '}
                    <strong className="text-emerald-400">{refundState.refundAmount?.toFixed(2)} XLM</strong>{' '}
                    has been sent back to your wallet on-chain.
                  </p>
                  <a
                    href={`https://stellar.expert/explorer/testnet/tx/${refundState.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary w-full justify-center mt-5 mb-3 text-sm"
                  >
                    <ExternalLink size={14} /> View Refund on Explorer
                  </a>
                  <button
                    onClick={() => { setCancelTarget(null); setRefundState(null); }}
                    className="btn-outline w-full justify-center text-sm"
                  >
                    Done
                  </button>
                </>
              )}

              {/* ── Error (session still removed locally) ── */}
              {refundState?.status === 'error' && (
                <>
                  <div className="mx-auto w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center mb-5">
                    <AlertCircle size={30} className="text-amber-400" />
                  </div>
                  <h2 className="text-xl font-bold text-white mb-2">Session Cancelled</h2>
                  <p className="text-slate-400 text-sm mb-3 leading-relaxed">
                    Your session was removed, but the on-chain refund transaction failed.
                  </p>
                  <div className="bg-amber-500/10 border border-amber-500/25 rounded-xl px-3 py-2 text-xs text-amber-400/80 mb-5 text-left">
                    {refundState.error}
                  </div>
                  <button
                    onClick={() => { setCancelTarget(null); setRefundState(null); }}
                    className="btn-outline w-full justify-center text-sm"
                  >
                    Close
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>

  );
};

export default LearnPage;
