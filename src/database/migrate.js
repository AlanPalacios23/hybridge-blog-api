const database = require('../config/database');

async function runMigrations() {
  await database.query(`
    CREATE TABLE IF NOT EXISTS users (
      id BIGSERIAL PRIMARY KEY,
      name VARCHAR(80) NOT NULL,
      email VARCHAR(160) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  await database.query(`
    CREATE TABLE IF NOT EXISTS posts (
      id BIGSERIAL PRIMARY KEY,
      title VARCHAR(180) NOT NULL,
      content TEXT NOT NULL,
      author_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  await database.query(`
    CREATE INDEX IF NOT EXISTS idx_posts_author_id ON posts(author_id)
  `);

  await database.query(`
    CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC)
  `);
}

module.exports = { runMigrations };
