const { Pool } = require('pg');
require('dotenv').config();

// Initialize the connection pool using the DATABASE_URL from .env or fallback
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:Soumya@6009165861@db.tyreewdkrsllxbwsrenc.supabase.co:5432/postgres';

const pool = new Pool({
  connectionString: connectionString,
  ssl: { rejectUnauthorized: false }
});

// Function to initialize the database schema
const initDB = async () => {
  try {
    const client = await pool.connect();
    
    console.log('🔄 Initializing PostgreSQL database schema...');

    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id              SERIAL PRIMARY KEY,
        username        VARCHAR(255) NOT NULL UNIQUE,
        wallet_address  VARCHAR(255) NOT NULL UNIQUE,
        avatar_url      TEXT,
        bio             TEXT DEFAULT '',
        xlm_rate        NUMERIC DEFAULT 0,
        created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS skills (
        id              SERIAL PRIMARY KEY,
        user_id         INTEGER REFERENCES users(id) ON DELETE CASCADE,
        skill_name      VARCHAR(255) NOT NULL,
        level           VARCHAR(50) CHECK (level IN ('beginner', 'intermediate', 'advanced')),
        type            VARCHAR(50) CHECK (type IN ('offer', 'want')),
        created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS ratings (
        id              SERIAL PRIMARY KEY,
        rater_id        INTEGER REFERENCES users(id) ON DELETE CASCADE,
        target_id       INTEGER REFERENCES users(id) ON DELETE CASCADE,
        score           INTEGER CHECK (score >= 1 AND score <= 5),
        comment         TEXT,
        created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS exchanges (
        id              SERIAL PRIMARY KEY,
        user_id         INTEGER REFERENCES users(id) ON DELETE CASCADE,
        skill_offer     VARCHAR(255) NOT NULL,
        level_offer     VARCHAR(50) DEFAULT 'intermediate',
        skill_want      VARCHAR(255) NOT NULL,
        level_want      VARCHAR(50) DEFAULT 'intermediate',
        description     TEXT,
        status          VARCHAR(50) DEFAULT 'open' CHECK (status IN ('open', 'closed')),
        created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS exchange_requests (
        id              SERIAL PRIMARY KEY,
        exchange_id     INTEGER REFERENCES exchanges(id) ON DELETE CASCADE,
        requester_id    INTEGER REFERENCES users(id) ON DELETE CASCADE,
        message         TEXT,
        status          VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
        created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('✅ PostgreSQL schema initialized successfully.');
    client.release();
  } catch (err) {
    console.error('❌ Database initialization error:', err.message);
    if (err.message.includes('password authentication failed') || err.message.includes('URI')) {
      console.error('⚠️ Make sure your DATABASE_URL is set correctly in .env');
    }
  }
};

// Immediately execute the initialization
initDB();

module.exports = pool;
