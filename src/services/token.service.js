const jwt = require('jsonwebtoken');
const { env } = require('../config/env');

function createAccessToken(user) {
  return jwt.sign(
    { email: user.email },
    env.jwtSecret,
    {
      subject: String(user.id),
      expiresIn: env.jwtExpiresIn,
      issuer: 'hybridge-blog-api',
      audience: 'hybridge-blog-client',
    },
  );
}

module.exports = { createAccessToken };
