const { Pool } = require('pg');
const { env } = require('./env');

const isRemoteDatabase =
  env.nodeEnv === 'production' &&
  env.databaseUrl &&
  !env.databaseUrl.includes('localhost') &&
  !env.databaseUrl.includes('127.0.0.1');

const pool = new Pool({
  connectionString: env.databaseUrl || undefined,
  ssl: isRemoteDatabase ? { rejectUnauthorized: false } : false,
  connectionTimeoutMillis: 5000,
  idleTimeoutMillis: 30000,
  max: 10,
});

pool.on('error', (error) => {
  console.error('Error inesperado en el pool de PostgreSQL:', error.message);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  close: () => pool.end(),
};
