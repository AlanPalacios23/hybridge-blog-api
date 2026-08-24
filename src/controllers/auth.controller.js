const bcrypt = require('bcryptjs');
const database = require('../config/database');
const { AppError } = require('../middlewares/errorHandler');
const { createAccessToken } = require('../services/token.service');

async function register(req, res) {
  const { name, email, password } = req.validated.body;

  const existingUser = await database.query('SELECT id FROM users WHERE email = $1', [email]);
  if (existingUser.rowCount > 0) {
    throw new AppError('Ya existe una cuenta con ese correo electrónico.', 409, 'EMAIL_ALREADY_EXISTS');
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const result = await database.query(
    `INSERT INTO users (name, email, password_hash)
     VALUES ($1, $2, $3)
     RETURNING id, name, email, created_at`,
    [name, email, passwordHash],
  );

  const user = result.rows[0];
  const token = createAccessToken(user);

  return res.status(201).json({
    success: true,
    message: 'Cuenta creada correctamente.',
    data: { user, token },
  });
}

async function login(req, res) {
  const { email, password } = req.validated.body;
  const result = await database.query(
    'SELECT id, name, email, password_hash, created_at FROM users WHERE email = $1',
    [email],
  );

  const user = result.rows[0];
  const passwordMatches = user ? await bcrypt.compare(password, user.password_hash) : false;

  if (!user || !passwordMatches) {
    throw new AppError('El correo o la contraseña son incorrectos.', 401, 'INVALID_CREDENTIALS');
  }

  const token = createAccessToken(user);
  delete user.password_hash;

  return res.json({
    success: true,
    message: 'Sesión iniciada correctamente.',
    data: { user, token },
  });
}

async function getProfile(req, res) {
  const result = await database.query(
    'SELECT id, name, email, created_at, updated_at FROM users WHERE id = $1',
    [req.user.id],
  );

  if (result.rowCount === 0) {
    throw new AppError('El usuario ya no existe.', 404, 'USER_NOT_FOUND');
  }

  return res.json({ success: true, data: result.rows[0] });
}

module.exports = { register, login, getProfile };
