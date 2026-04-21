const router  = require('express').Router();
const jwt     = require('jsonwebtoken');
const db      = require('../db');

// ── Helper: sign a token ──────────────────────────────────────
const signToken = (user) =>
  jwt.sign(
    { id: user.id, username: user.username, wallet_address: user.wallet_address },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

// ── POST /api/auth/wallet ─────────────────────────────────────
router.post('/wallet', (req, res) => {
  const { wallet_address } = req.body;

  if (!wallet_address) {
    return res.status(400).json({ error: 'wallet_address is required' });
  }

  // Check if user exists
  let user = db.prepare('SELECT * FROM users WHERE wallet_address = ?').get(wallet_address);

  if (!user) {
    // Auto-create user based on wallet
    const shortAddr = wallet_address.slice(0, 5) + wallet_address.slice(-4);
    const username = `User_${shortAddr}`;

    try {
      const { lastInsertRowid } = db.prepare(
        `INSERT INTO users (username, wallet_address) VALUES (?, ?)`
      ).run(username, wallet_address);

      user = db.prepare('SELECT * FROM users WHERE id = ?').get(lastInsertRowid);
    } catch (err) {
      if (err.message.includes('UNIQUE')) {
        // Fallback if username somehow collides
        const randomStr = Math.random().toString(36).substring(2, 6);
        const { lastInsertRowid } = db.prepare(
          `INSERT INTO users (username, wallet_address) VALUES (?, ?)`
        ).run(`User_${randomStr}`, wallet_address);
        user = db.prepare('SELECT * FROM users WHERE id = ?').get(lastInsertRowid);
      } else {
        throw err;
      }
    }
  }

  const token = signToken(user);

  return res.json({
    message: 'Wallet connected successfully',
    token,
    user: {
      id:             user.id,
      username:       user.username,
      wallet_address: user.wallet_address,
      avatar_url:     user.avatar_url,
      bio:            user.bio,
    },
  });
});

module.exports = router;
