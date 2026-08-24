const dotenv = require('dotenv');

dotenv.config();

const parsePort = (value) => {
  const port = Number.parseInt(value, 10);
  return Number.isInteger(port) && port > 0 ? port : 3000;
};

const env = Object.freeze({
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parsePort(process.env.PORT),
  databaseUrl: process.env.DATABASE_URL || '',
  jwtSecret: process.env.JWT_SECRET || '',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  corsOrigin: process.env.CORS_ORIGIN || '*',
});

function assertRequiredEnv() {
  const missing = [];

  if (!env.databaseUrl) missing.push('DATABASE_URL');
  if (!env.jwtSecret) missing.push('JWT_SECRET');

  if (missing.length > 0) {
    throw new Error(`Faltan variables de entorno obligatorias: ${missing.join(', ')}`);
  }

  if (env.nodeEnv === 'production' && env.jwtSecret.length < 32) {
    throw new Error('JWT_SECRET debe contener al menos 32 caracteres en producción.');
  }
}

module.exports = { env, assertRequiredEnv };
