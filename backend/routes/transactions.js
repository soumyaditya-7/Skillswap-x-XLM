const express = require('express');
const { TransactionBuilder, Networks, Keypair, Server } = require('@stellar/stellar-sdk');

const router = express.Router();
const server = new Server('https://horizon-testnet.stellar.org');

router.post('/sponsor', async (req, res) => {
  try {
    const { innerTxXdr } = req.body;
    
    if (!innerTxXdr) {
      return res.status(400).json({ error: 'Missing innerTxXdr' });
    }

    if (!process.env.SPONSOR_SECRET_KEY) {
      return res.status(500).json({ error: 'Sponsor secret key not configured on server' });
    }

    // 1. Load the sponsor keypair
    const sponsorKeypair = Keypair.fromSecret(process.env.SPONSOR_SECRET_KEY);

    // 2. Parse the user's signed transaction
    const innerTx = TransactionBuilder.fromXDR(innerTxXdr, Networks.TESTNET);

    // 3. Build the FeeBumpTransaction
    // The base fee is the maximum fee per operation the sponsor is willing to pay.
    const feeBumpTx = TransactionBuilder.buildFeeBumpTransaction(
      sponsorKeypair,
      '100000', // 0.01 XLM max fee per operation
      innerTx,
      Networks.TESTNET
    );

    // 4. Sponsor signs the FeeBumpTransaction
    feeBumpTx.sign(sponsorKeypair);

    // 5. Submit to Stellar network
    const submitRes = await server.submitTransaction(feeBumpTx);
    
    res.json({
      success: true,
      hash: submitRes.hash,
      fee_charged: submitRes.fee_charged,
      sponsor_address: sponsorKeypair.publicKey()
    });
    
  } catch (error) {
    console.error('Sponsorship error:', error.response ? error.response.data : error);
    const detail = error.response?.data?.extras?.result_codes?.transaction || error.message;
    res.status(500).json({ error: `Transaction sponsorship failed: ${detail}` });
  }
});

module.exports = router;
