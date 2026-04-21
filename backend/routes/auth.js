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
router.post('/wallet', async (req, res, next) => {
  const { wallet_address } = req.body;

  if (!wallet_address) {
    return res.status(400).json({ error: 'wallet_address is required' });
  }

  try {
    // Check if DATABASE_URL is just the placeholder or missing
    if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes('host:port')) {
      return res.status(500).json({ error: 'DATABASE_URL is missing or invalid. You MUST create a Supabase/Neon database and add the connection string to your Vercel Environment Variables.' });
    }

    // Check if user exists
    const result = await db.query('SELECT * FROM users WHERE wallet_address = $1', [wallet_address]);
    let user = result.rows[0];

    if (!user) {
      // Auto-create user based on wallet
      const shortAddr = wallet_address.slice(0, 5) + wallet_address.slice(-4);
      let username = `User_${shortAddr}`;

      try {
        const insertRes = await db.query(
          `INSERT INTO users (username, wallet_address) VALUES ($1, $2) RETURNING *`,
          [username, wallet_address]
        );
        user = insertRes.rows[0];
      } catch (err) {
        // 23505 is PostgreSQL unique_violation error code
        if (err.code === '23505') {
          // Fallback if username somehow collides
          const randomStr = Math.random().toString(36).substring(2, 6);
          username = `User_${randomStr}`;
          const retryRes = await db.query(
            `INSERT INTO users (username, wallet_address) VALUES ($1, $2) RETURNING *`,
            [username, wallet_address]
          );
          user = retryRes.rows[0];
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
  } catch (error) {
    next(error);
  }
});

module.exports = router;
