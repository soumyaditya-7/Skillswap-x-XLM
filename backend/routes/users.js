const router     = require('express').Router();
const db         = require('../db');
const authMiddleware = require('../middleware/auth');

// ── GET /api/users/me  (protected) ───────────────────────────
router.get('/me', authMiddleware, (req, res) => {
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const skills = db.prepare('SELECT * FROM skills WHERE user_id = ?').all(user.id);
  const ratingsReceived = db.prepare(
    'SELECT AVG(score) as avg_score, COUNT(*) as count FROM ratings WHERE ratee_id = ?'
  ).get(user.id);

  res.json({
    id:             user.id,
    username:       user.username,
    email:          user.email,
    wallet_address: user.wallet_address,
    avatar_url:     user.avatar_url,
    bio:            user.bio,
    xlm_rate:       user.xlm_rate,
    created_at:     user.created_at,
    skills_offered: skills.filter(s => s.type === 'offer'),
    skills_wanted:  skills.filter(s => s.type === 'want'),
    rating: {
      avg:   ratingsReceived.avg_score ? parseFloat(ratingsReceived.avg_score.toFixed(1)) : null,
      count: ratingsReceived.count,
    },
  });
});

// ── PATCH /api/users/me  (protected) — update profile ────────
router.patch('/me', authMiddleware, (req, res) => {
  const { bio, wallet_address, xlm_rate, avatar_url } = req.body;

  db.prepare(
    `UPDATE users
     SET bio = COALESCE(?, bio),
         wallet_address = COALESCE(?, wallet_address),
         xlm_rate = COALESCE(?, xlm_rate),
         avatar_url = COALESCE(?, avatar_url)
     WHERE id = ?`
  ).run(bio, wallet_address, xlm_rate, avatar_url, req.user.id);

  const updated = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);
  res.json({ message: 'Profile updated', user: updated });
});

// ── POST /api/users/me/skills  — add a skill ─────────────────
router.post('/me/skills', authMiddleware, (req, res) => {
  const { name, type, level } = req.body;

  if (!name || !['offer', 'want'].includes(type)) {
    return res.status(400).json({ error: 'name and type (offer|want) are required' });
  }

  const { lastInsertRowid } = db.prepare(
    'INSERT INTO skills (user_id, name, type, level) VALUES (?, ?, ?, ?)'
  ).run(req.user.id, name.trim(), type, level || 'intermediate');

  const skill = db.prepare('SELECT * FROM skills WHERE id = ?').get(lastInsertRowid);
  res.status(201).json({ message: 'Skill added', skill });
});

// ── DELETE /api/users/me/skills/:id  — remove a skill ────────
router.delete('/me/skills/:id', authMiddleware, (req, res) => {
  const skill = db.prepare(
    'SELECT * FROM skills WHERE id = ? AND user_id = ?'
  ).get(req.params.id, req.user.id);

  if (!skill) return res.status(404).json({ error: 'Skill not found or not yours' });

  db.prepare('DELETE FROM skills WHERE id = ?').run(req.params.id);
  res.json({ message: 'Skill removed' });
});

// ── GET /api/users/:id  — public profile ─────────────────────
router.get('/:id', (req, res) => {
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const skills = db.prepare('SELECT * FROM skills WHERE user_id = ?').all(user.id);
  const ratingsReceived = db.prepare(
    'SELECT AVG(score) as avg_score, COUNT(*) as count FROM ratings WHERE ratee_id = ?'
  ).get(user.id);

  res.json({
    id:             user.id,
    username:       user.username,
    wallet_address: user.wallet_address,
    avatar_url:     user.avatar_url,
    bio:            user.bio,
    xlm_rate:       user.xlm_rate,
    created_at:     user.created_at,
    skills_offered: skills.filter(s => s.type === 'offer'),
    skills_wanted:  skills.filter(s => s.type === 'want'),
    rating: {
      avg:   ratingsReceived.avg_score ? parseFloat(ratingsReceived.avg_score.toFixed(1)) : null,
      count: ratingsReceived.count,
    },
  });
});

// ── POST /api/users/:id/rate  (protected) ────────────────────
router.post('/:id/rate', authMiddleware, (req, res) => {
  const ratee_id = parseInt(req.params.id);
  const { score, comment } = req.body;

  if (ratee_id === req.user.id) {
    return res.status(400).json({ error: 'You cannot rate yourself' });
  }
  if (!score || score < 1 || score > 5) {
    return res.status(400).json({ error: 'score must be between 1 and 5' });
  }

  try {
    db.prepare(
      `INSERT INTO ratings (rater_id, ratee_id, score, comment) VALUES (?, ?, ?, ?)
       ON CONFLICT(rater_id, ratee_id) DO UPDATE SET score = excluded.score, comment = excluded.comment`
    ).run(req.user.id, ratee_id, score, comment || null);

    res.json({ message: 'Rating submitted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit rating' });
  }
});

// ── GET /api/users  — list all users (for matching) ──────────
router.get('/', (req, res) => {
  const { skill } = req.query;

  let users;
  if (skill) {
    users = db.prepare(
      `SELECT DISTINCT u.id, u.username, u.avatar_url, u.bio, u.xlm_rate, u.wallet_address
       FROM users u
       JOIN skills s ON s.user_id = u.id
       WHERE s.type = 'offer' AND LOWER(s.name) LIKE LOWER(?)`
    ).all(`%${skill}%`);
  } else {
    users = db.prepare(
      'SELECT id, username, avatar_url, bio, xlm_rate, wallet_address FROM users'
    ).all();
  }

  res.json({ users });
});

module.exports = router;
