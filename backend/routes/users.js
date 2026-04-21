const router = require('express').Router();
const db     = require('../db');
const auth   = require('../middleware/auth');

// ── GET /api/users/me ─────────────────────────────────────────
router.get('/me', auth, async (req, res, next) => {
  try {
    const result = await db.query(
      'SELECT id, username, wallet_address, avatar_url, bio, xlm_rate FROM users WHERE id = $1',
      [req.user.id]
    );
    const user = result.rows[0];

    if (!user) return res.status(404).json({ error: 'User not found' });

    const skillsRes = await db.query(
      'SELECT id, skill_name, level, type FROM skills WHERE user_id = $1',
      [user.id]
    );
    user.skills = skillsRes.rows;

    const ratingsRes = await db.query(
      `SELECT r.score, r.comment, u.username as rater_name
       FROM ratings r
       JOIN users u ON r.rater_id = u.id
       WHERE r.target_id = $1`,
      [user.id]
    );
    user.ratings = ratingsRes.rows;

    res.json(user);
  } catch (error) {
    next(error);
  }
});

// ── PATCH /api/users/me ───────────────────────────────────────
router.patch('/me', auth, async (req, res, next) => {
  const { bio, avatar_url, xlm_rate } = req.body;
  try {
    const result = await db.query(
      `UPDATE users 
       SET bio = COALESCE($1, bio),
           avatar_url = COALESCE($2, avatar_url),
           xlm_rate = COALESCE($3, xlm_rate)
       WHERE id = $4
       RETURNING id, username, wallet_address, avatar_url, bio, xlm_rate`,
      [bio, avatar_url, xlm_rate, req.user.id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// ── POST /api/users/me/skills ─────────────────────────────────
router.post('/me/skills', auth, async (req, res, next) => {
  const { skill_name, level, type } = req.body;
  if (!skill_name || !level || !type) {
    return res.status(400).json({ error: 'skill_name, level, type required' });
  }
  try {
    const result = await db.query(
      `INSERT INTO skills (user_id, skill_name, level, type)
       VALUES ($1, $2, $3, $4)
       RETURNING id, skill_name, level, type`,
      [req.user.id, skill_name, level, type]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// ── DELETE /api/users/me/skills/:id ───────────────────────────
router.delete('/me/skills/:id', auth, async (req, res, next) => {
  try {
    const result = await db.query(
      'DELETE FROM skills WHERE id = $1 AND user_id = $2 RETURNING id',
      [req.params.id, req.user.id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Skill not found or unauthorized' });
    }
    res.json({ message: 'Skill deleted' });
  } catch (error) {
    next(error);
  }
});

// ── GET /api/users/:id ────────────────────────────────────────
router.get('/:id', async (req, res, next) => {
  try {
    const result = await db.query(
      'SELECT id, username, avatar_url, bio, xlm_rate FROM users WHERE id = $1',
      [req.params.id]
    );
    const user = result.rows[0];

    if (!user) return res.status(404).json({ error: 'User not found' });

    const skillsRes = await db.query(
      'SELECT id, skill_name, level, type FROM skills WHERE user_id = $1',
      [user.id]
    );
    user.skills = skillsRes.rows;

    const ratingsRes = await db.query(
      `SELECT r.score, r.comment, u.username as rater_name
       FROM ratings r
       JOIN users u ON r.rater_id = u.id
       WHERE r.target_id = $1`,
      [user.id]
    );
    user.ratings = ratingsRes.rows;

    res.json(user);
  } catch (error) {
    next(error);
  }
});

// ── POST /api/users/:id/rate ──────────────────────────────────
router.post('/:id/rate', auth, async (req, res, next) => {
  const target_id = parseInt(req.params.id, 10);
  const { score, comment } = req.body;

  if (target_id === req.user.id) {
    return res.status(400).json({ error: "Cannot rate yourself" });
  }
  if (!score || score < 1 || score > 5) {
    return res.status(400).json({ error: "Score must be 1-5" });
  }

  try {
    const result = await db.query(
      `INSERT INTO ratings (rater_id, target_id, score, comment)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [req.user.id, target_id, score, comment]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// ── GET /api/users ────────────────────────────────────────────
router.get('/', async (req, res, next) => {
  const { skill } = req.query;
  try {
    if (skill) {
      const result = await db.query(
        `SELECT DISTINCT u.id, u.username, u.avatar_url, u.bio, u.xlm_rate
         FROM users u
         JOIN skills s ON u.id = s.user_id
         WHERE s.skill_name ILIKE $1`,
        [`%${skill}%`]
      );
      res.json(result.rows);
    } else {
      const result = await db.query(
        'SELECT id, username, avatar_url, bio, xlm_rate FROM users ORDER BY created_at DESC LIMIT 50'
      );
      res.json(result.rows);
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
