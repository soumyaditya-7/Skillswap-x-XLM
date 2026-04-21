const router  = require('express').Router();
const db      = require('../db');
const auth    = require('../middleware/auth');

// ── Helper: attach poster info to an exchange row ─────────────
const withPoster = (ex) => {
  const user = db.prepare(
    'SELECT id, username, avatar_url, wallet_address FROM users WHERE id = ?'
  ).get(ex.user_id);
  return { ...ex, poster: user };
};

// ────────────────────────────────────────────────────────────────
// GET /api/exchanges  — list open posts (with optional search)
// ────────────────────────────────────────────────────────────────
router.get('/', (req, res) => {
  const { q, offer, want } = req.query;

  let rows;

  if (q) {
    // Full-text search across both skill fields and description
    rows = db.prepare(`
      SELECT * FROM exchanges
      WHERE status = 'open'
        AND (
          LOWER(skill_offer)   LIKE LOWER(?)
          OR LOWER(skill_want) LIKE LOWER(?)
          OR LOWER(description) LIKE LOWER(?)
        )
      ORDER BY created_at DESC
    `).all(`%${q}%`, `%${q}%`, `%${q}%`);
  } else if (offer) {
    rows = db.prepare(
      "SELECT * FROM exchanges WHERE status='open' AND LOWER(skill_offer) LIKE LOWER(?) ORDER BY created_at DESC"
    ).all(`%${offer}%`);
  } else if (want) {
    rows = db.prepare(
      "SELECT * FROM exchanges WHERE status='open' AND LOWER(skill_want) LIKE LOWER(?) ORDER BY created_at DESC"
    ).all(`%${want}%`);
  } else {
    rows = db.prepare(
      "SELECT * FROM exchanges WHERE status='open' ORDER BY created_at DESC"
    ).all();
  }

  const exchanges = rows.map(withPoster);
  res.json({ exchanges });
});

// ────────────────────────────────────────────────────────────────
// POST /api/exchanges  — create a new exchange post (protected)
// ────────────────────────────────────────────────────────────────
router.post('/', auth, (req, res) => {
  const { skill_offer, skill_want, description, level_offer, level_want } = req.body;

  if (!skill_offer || !skill_want) {
    return res.status(400).json({ error: 'skill_offer and skill_want are required' });
  }

  const { lastInsertRowid } = db.prepare(`
    INSERT INTO exchanges (user_id, skill_offer, skill_want, description, level_offer, level_want)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(
    req.user.id,
    skill_offer.trim(),
    skill_want.trim(),
    description?.trim() || '',
    level_offer || 'intermediate',
    level_want  || 'intermediate'
  );

  const exchange = withPoster(
    db.prepare('SELECT * FROM exchanges WHERE id = ?').get(lastInsertRowid)
  );

  res.status(201).json({ message: 'Exchange post created', exchange });
});

// ────────────────────────────────────────────────────────────────
// GET /api/exchanges/:id  — single exchange with requests
// ────────────────────────────────────────────────────────────────
router.get('/:id', (req, res) => {
  const exchange = db.prepare('SELECT * FROM exchanges WHERE id = ?').get(req.params.id);
  if (!exchange) return res.status(404).json({ error: 'Exchange not found' });

  const requests = db.prepare(`
    SELECT er.*, u.username, u.avatar_url
    FROM exchange_requests er
    JOIN users u ON u.id = er.requester_id
    WHERE er.exchange_id = ?
    ORDER BY er.created_at DESC
  `).all(exchange.id);

  res.json({ exchange: withPoster(exchange), requests });
});

// ────────────────────────────────────────────────────────────────
// DELETE /api/exchanges/:id  — delete your own post (protected)
// ────────────────────────────────────────────────────────────────
router.delete('/:id', auth, (req, res) => {
  const exchange = db.prepare(
    'SELECT * FROM exchanges WHERE id = ? AND user_id = ?'
  ).get(req.params.id, req.user.id);

  if (!exchange) return res.status(404).json({ error: 'Exchange not found or not yours' });

  db.prepare('DELETE FROM exchanges WHERE id = ?').run(req.params.id);
  res.json({ message: 'Exchange deleted' });
});

// ────────────────────────────────────────────────────────────────
// PATCH /api/exchanges/:id/status  — close/reopen your post
// ────────────────────────────────────────────────────────────────
router.patch('/:id/status', auth, (req, res) => {
  const { status } = req.body;
  if (!['open', 'closed'].includes(status)) {
    return res.status(400).json({ error: 'status must be open or closed' });
  }

  const exchange = db.prepare(
    'SELECT * FROM exchanges WHERE id = ? AND user_id = ?'
  ).get(req.params.id, req.user.id);

  if (!exchange) return res.status(404).json({ error: 'Not found or not yours' });

  db.prepare('UPDATE exchanges SET status = ? WHERE id = ?').run(status, exchange.id);
  res.json({ message: `Exchange marked ${status}` });
});

// ────────────────────────────────────────────────────────────────
// POST /api/exchanges/:id/request  — send a match request
// ────────────────────────────────────────────────────────────────
router.post('/:id/request', auth, (req, res) => {
  const exchange = db.prepare('SELECT * FROM exchanges WHERE id = ?').get(req.params.id);
  if (!exchange) return res.status(404).json({ error: 'Exchange not found' });
  if (exchange.user_id === req.user.id) {
    return res.status(400).json({ error: 'You cannot request your own post' });
  }
  if (exchange.status !== 'open') {
    return res.status(400).json({ error: 'This exchange is no longer open' });
  }

  const { message } = req.body;

  try {
    const { lastInsertRowid } = db.prepare(`
      INSERT INTO exchange_requests (exchange_id, requester_id, message)
      VALUES (?, ?, ?)
    `).run(exchange.id, req.user.id, message?.trim() || '');

    const request = db.prepare('SELECT * FROM exchange_requests WHERE id = ?').get(lastInsertRowid);
    res.status(201).json({ message: 'Match request sent', request });
  } catch (err) {
    if (err.message.includes('UNIQUE')) {
      return res.status(409).json({ error: 'You already requested this exchange' });
    }
    throw err;
  }
});

// ────────────────────────────────────────────────────────────────
// PATCH /api/exchanges/:id/request/:reqId  — accept or reject
// ────────────────────────────────────────────────────────────────
router.patch('/:id/request/:reqId', auth, (req, res) => {
  const { decision } = req.body; // 'accepted' | 'rejected'
  if (!['accepted', 'rejected'].includes(decision)) {
    return res.status(400).json({ error: 'decision must be accepted or rejected' });
  }

  // Verify caller owns this exchange
  const exchange = db.prepare(
    'SELECT * FROM exchanges WHERE id = ? AND user_id = ?'
  ).get(req.params.id, req.user.id);
  if (!exchange) return res.status(403).json({ error: 'Not your exchange' });

  const request = db.prepare(
    'SELECT * FROM exchange_requests WHERE id = ? AND exchange_id = ?'
  ).get(req.params.reqId, exchange.id);
  if (!request) return res.status(404).json({ error: 'Request not found' });

  db.prepare('UPDATE exchange_requests SET status = ? WHERE id = ?').run(decision, request.id);

  // If accepted → mark exchange as matched
  if (decision === 'accepted') {
    db.prepare("UPDATE exchanges SET status = 'matched' WHERE id = ?").run(exchange.id);
  }

  res.json({ message: `Request ${decision}` });
});

// ────────────────────────────────────────────────────────────────
// GET /api/exchanges/mine  — your own posts (protected)
// ────────────────────────────────────────────────────────────────
router.get('/user/mine', auth, (req, res) => {
  const exchanges = db.prepare(
    'SELECT * FROM exchanges WHERE user_id = ? ORDER BY created_at DESC'
  ).all(req.user.id);

  res.json({ exchanges: exchanges.map(withPoster) });
});

module.exports = router;
