const router  = require('express').Router();
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const db      = require('../db');

// ── Helper: sign a token ──────────────────────────────────────
const signToken = (user) =>
  jwt.sign(
    { id: user.id, username: user.username, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

// ── POST /api/auth/register ───────────────────────────────────
router.post('/register', async (req, res) => {
  const { username, email, password, wallet_address } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'username, email and password are required' });
  }

  // Check duplicates
  const existing = db.prepare(
    'SELECT id FROM users WHERE email = ? OR username = ?'
  ).get(email, username);

  if (existing) {
    return res.status(409).json({ error: 'Email or username already in use' });
  }

  const password_hash = await bcrypt.hash(password, 12);

  const { lastInsertRowid } = db.prepare(
    `INSERT INTO users (username, email, password_hash, wallet_address)
     VALUES (?, ?, ?, ?)`
  ).run(username, email, password_hash, wallet_address || null);

  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(lastInsertRowid);
  const token = signToken(user);

  return res.status(201).json({
    message: 'Account created successfully',
    token,
    user: {
      id:             user.id,
      username:       user.username,
      email:          user.email,
      wallet_address: user.wallet_address,
      created_at:     user.created_at,
    },
  });
});

// ── POST /api/auth/login ──────────────────────────────────────
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'email and password are required' });
  }

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = signToken(user);

  return res.json({
    message: 'Login successful',
    token,
    user: {
      id:             user.id,
      username:       user.username,
      email:          user.email,
      wallet_address: user.wallet_address,
      avatar_url:     user.avatar_url,
      bio:            user.bio,
    },
  });
});

module.exports = router;
