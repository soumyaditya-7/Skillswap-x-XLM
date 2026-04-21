const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'skillswap.db'));

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');

// ── Create tables ─────────────────────────────────────────────
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    username        TEXT    NOT NULL UNIQUE,
    email           TEXT    NOT NULL UNIQUE,
    password_hash   TEXT    NOT NULL,
    wallet_address  TEXT,
    avatar_url      TEXT,
    bio             TEXT    DEFAULT '',
    xlm_rate        REAL    DEFAULT 0,
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS skills (
    id      INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name    TEXT    NOT NULL,
    type    TEXT    NOT NULL CHECK(type IN ('offer','want')),
    level   TEXT    DEFAULT 'intermediate'
  );

  CREATE TABLE IF NOT EXISTS ratings (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    rater_id    INTEGER NOT NULL REFERENCES users(id),
    ratee_id    INTEGER NOT NULL REFERENCES users(id),
    score       INTEGER NOT NULL CHECK(score BETWEEN 1 AND 5),
    comment     TEXT,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(rater_id, ratee_id)
  );

  CREATE TABLE IF NOT EXISTS exchanges (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id       INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    skill_offer   TEXT    NOT NULL,
    skill_want    TEXT    NOT NULL,
    description   TEXT    DEFAULT '',
    level_offer   TEXT    DEFAULT 'intermediate',
    level_want    TEXT    DEFAULT 'intermediate',
    status        TEXT    NOT NULL DEFAULT 'open'
                          CHECK(status IN ('open','matched','closed')),
    created_at    DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS exchange_requests (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    exchange_id  INTEGER NOT NULL REFERENCES exchanges(id) ON DELETE CASCADE,
    requester_id INTEGER NOT NULL REFERENCES users(id),
    message      TEXT    DEFAULT '',
    status       TEXT    NOT NULL DEFAULT 'pending'
                         CHECK(status IN ('pending','accepted','rejected')),
    created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(exchange_id, requester_id)
  );
`);

module.exports = db;
