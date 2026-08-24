const jwt = require('jsonwebtoken');
const { env } = require('../config/env');
const { AppError } = require('./errorHandler');

function requireAuth(req, _res, next) {
  const authorization = req.get('authorization');

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new AppError('Se requiere un token de autenticación.', 401, 'AUTH_REQUIRED'));
  }

  const token = authorization.slice('Bearer '.length).trim();

  try {
    const payload = jwt.verify(token, env.jwtSecret);
    req.user = { id: payload.sub, email: payload.email };
    return next();
  } catch (_error) {
    return next(new AppError('El token es inválido o ya expiró.', 401, 'INVALID_TOKEN'));
  }
}

module.exports = { requireAuth };
