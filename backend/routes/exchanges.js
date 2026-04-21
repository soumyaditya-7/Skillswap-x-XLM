const router = require('express').Router();
const db     = require('../db');
const auth   = require('../middleware/auth');

// ── GET /api/exchanges ────────────────────────────────────────
router.get('/', async (req, res, next) => {
  const { q, offer, want } = req.query;
  let query = `
    SELECT e.*, u.username as poster_username, u.avatar_url as poster_avatar
    FROM exchanges e
    JOIN users u ON e.user_id = u.id
    WHERE e.status = 'open'
  `;
  const params = [];

  if (q) {
    params.push(`%${q}%`);
    query += ` AND (e.skill_offer ILIKE $${params.length} OR e.skill_want ILIKE $${params.length})`;
  }
  if (offer) {
    params.push(`%${offer}%`);
    query += ` AND e.skill_offer ILIKE $${params.length}`;
  }
  if (want) {
    params.push(`%${want}%`);
    query += ` AND e.skill_want ILIKE $${params.length}`;
  }

  query += ` ORDER BY e.created_at DESC LIMIT 50`;

  try {
    const result = await db.query(query, params);
    
    // Map poster details into a nested object
    const exchanges = result.rows.map(row => ({
      id: row.id,
      user_id: row.user_id,
      skill_offer: row.skill_offer,
      level_offer: row.level_offer,
      skill_want: row.skill_want,
      level_want: row.level_want,
      description: row.description,
      status: row.status,
      created_at: row.created_at,
      poster: {
        username: row.poster_username,
        avatar_url: row.poster_avatar
      }
    }));

    res.json({ exchanges });
  } catch (error) {
    next(error);
  }
});

// ── GET /api/exchanges/user/mine ──────────────────────────────
router.get('/user/mine', auth, async (req, res, next) => {
  try {
    const result = await db.query(
      `SELECT e.*, 
        (SELECT count(*) FROM exchange_requests r WHERE r.exchange_id = e.id AND r.status = 'pending') as pending_requests
       FROM exchanges e
       WHERE e.user_id = $1
       ORDER BY e.created_at DESC`,
      [req.user.id]
    );
    res.json({ exchanges: result.rows });
  } catch (error) {
    next(error);
  }
});

// ── GET /api/exchanges/:id ────────────────────────────────────
router.get('/:id', async (req, res, next) => {
  try {
    const exchangeRes = await db.query(
      `SELECT e.*, u.username as poster_username, u.avatar_url as poster_avatar
       FROM exchanges e
       JOIN users u ON e.user_id = u.id
       WHERE e.id = $1`,
      [req.params.id]
    );
    const exchange = exchangeRes.rows[0];

    if (!exchange) return res.status(404).json({ error: 'Exchange not found' });

    // Format poster
    exchange.poster = {
      username: exchange.poster_username,
      avatar_url: exchange.poster_avatar
    };
    delete exchange.poster_username;
    delete exchange.poster_avatar;

    // Get requests for this exchange
    const requestsRes = await db.query(
      `SELECT r.*, u.username as requester_username
       FROM exchange_requests r
       JOIN users u ON r.requester_id = u.id
       WHERE r.exchange_id = $1`,
      [exchange.id]
    );
    exchange.requests = requestsRes.rows;

    res.json(exchange);
  } catch (error) {
    next(error);
  }
});

// ── POST /api/exchanges ───────────────────────────────────────
router.post('/', auth, async (req, res, next) => {
  const { skill_offer, level_offer, skill_want, level_want, description } = req.body;

  if (!skill_offer || !skill_want) {
    return res.status(400).json({ error: 'skill_offer and skill_want are required' });
  }

  try {
    const result = await db.query(
      `INSERT INTO exchanges (user_id, skill_offer, level_offer, skill_want, level_want, description)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [req.user.id, skill_offer, level_offer || 'intermediate', skill_want, level_want || 'intermediate', description]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// ── DELETE /api/exchanges/:id ─────────────────────────────────
router.delete('/:id', auth, async (req, res, next) => {
  try {
    const result = await db.query(
      'DELETE FROM exchanges WHERE id = $1 AND user_id = $2 RETURNING id',
      [req.params.id, req.user.id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Exchange not found or unauthorized' });
    }
    res.json({ message: 'Exchange deleted' });
  } catch (error) {
    next(error);
  }
});

// ── PATCH /api/exchanges/:id/status ───────────────────────────
router.patch('/:id/status', auth, async (req, res, next) => {
  const { status } = req.body;
  if (!['open', 'closed'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }
  try {
    const result = await db.query(
      'UPDATE exchanges SET status = $1 WHERE id = $2 AND user_id = $3 RETURNING *',
      [status, req.params.id, req.user.id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Exchange not found or unauthorized' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// ── POST /api/exchanges/:id/request ───────────────────────────
router.post('/:id/request', auth, async (req, res, next) => {
  const exchangeId = parseInt(req.params.id, 10);
  const { message } = req.body;

  try {
    const exchangeRes = await db.query('SELECT user_id, status FROM exchanges WHERE id = $1', [exchangeId]);
    const exchange = exchangeRes.rows[0];

    if (!exchange) return res.status(404).json({ error: 'Exchange not found' });
    if (exchange.status !== 'open') return res.status(400).json({ error: 'Exchange is closed' });
    if (exchange.user_id === req.user.id) return res.status(400).json({ error: 'Cannot request your own exchange' });

    // Check existing
    const existingRes = await db.query(
      'SELECT id FROM exchange_requests WHERE exchange_id = $1 AND requester_id = $2',
      [exchangeId, req.user.id]
    );
    if (existingRes.rows.length > 0) {
      return res.status(400).json({ error: 'You already requested this exchange' });
    }

    const result = await db.query(
      `INSERT INTO exchange_requests (exchange_id, requester_id, message)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [exchangeId, req.user.id, message]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// ── PATCH /api/exchanges/:id/request/:reqId ───────────────────
router.patch('/:id/request/:reqId', auth, async (req, res, next) => {
  const exchangeId = parseInt(req.params.id, 10);
  const reqId      = parseInt(req.params.reqId, 10);
  const { decision } = req.body;

  if (!['accepted', 'rejected'].includes(decision)) {
    return res.status(400).json({ error: 'Decision must be accepted or rejected' });
  }

  try {
    // Check ownership
    const exchangeRes = await db.query('SELECT user_id FROM exchanges WHERE id = $1', [exchangeId]);
    if (!exchangeRes.rows[0] || exchangeRes.rows[0].user_id !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized to manage this exchange' });
    }

    const result = await db.query(
      'UPDATE exchange_requests SET status = $1 WHERE id = $2 AND exchange_id = $3 RETURNING *',
      [decision, reqId, exchangeId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Request not found' });
    }

    // Auto-close exchange if accepted
    if (decision === 'accepted') {
      await db.query('UPDATE exchanges SET status = $1 WHERE id = $2', ['closed', exchangeId]);
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
