const database = require('../config/database');
const { AppError } = require('../middlewares/errorHandler');

const postSelect = `
  SELECT
    p.id,
    p.title,
    p.content,
    p.created_at,
    p.updated_at,
    json_build_object('id', u.id, 'name', u.name) AS author
  FROM posts p
  INNER JOIN users u ON u.id = p.author_id
`;

async function listPosts(req, res) {
  const { page, limit, search } = req.validated.query;
  const offset = (page - 1) * limit;
  const values = [];
  let whereClause = '';

  if (search) {
    values.push(`%${search}%`);
    whereClause = 'WHERE p.title ILIKE $1 OR p.content ILIKE $1';
  }

  const countResult = await database.query(
    `SELECT COUNT(*)::int AS total FROM posts p ${whereClause}`,
    values,
  );

  const limitPosition = values.length + 1;
  const offsetPosition = values.length + 2;
  const postsResult = await database.query(
    `${postSelect}
     ${whereClause}
     ORDER BY p.created_at DESC
     LIMIT $${limitPosition} OFFSET $${offsetPosition}`,
    [...values, limit, offset],
  );

  const total = countResult.rows[0].total;

  return res.json({
    success: true,
    data: postsResult.rows,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}

async function getPost(req, res) {
  const result = await database.query(`${postSelect} WHERE p.id = $1`, [req.validated.params.id]);

  if (result.rowCount === 0) {
    throw new AppError('La publicación no existe.', 404, 'POST_NOT_FOUND');
  }

  return res.json({ success: true, data: result.rows[0] });
}

async function createPost(req, res) {
  const { title, content } = req.validated.body;
  const result = await database.query(
    `INSERT INTO posts (title, content, author_id)
     VALUES ($1, $2, $3)
     RETURNING id, title, content, author_id, created_at, updated_at`,
    [title, content, req.user.id],
  );

  return res.status(201).json({
    success: true,
    message: 'Publicación creada correctamente.',
    data: result.rows[0],
  });
}

async function updatePost(req, res) {
  const { id } = req.validated.params;
  const updates = req.validated.body;
  const assignments = [];
  const values = [];

  for (const [field, value] of Object.entries(updates)) {
    values.push(value);
    assignments.push(`${field} = $${values.length}`);
  }

  values.push(id, req.user.id);
  const idPosition = values.length - 1;
  const userPosition = values.length;

  const result = await database.query(
    `UPDATE posts
     SET ${assignments.join(', ')}, updated_at = NOW()
     WHERE id = $${idPosition} AND author_id = $${userPosition}
     RETURNING id, title, content, author_id, created_at, updated_at`,
    values,
  );

  if (result.rowCount === 0) {
    throw new AppError(
      'La publicación no existe o no tienes permiso para modificarla.',
      404,
      'POST_NOT_FOUND',
    );
  }

  return res.json({
    success: true,
    message: 'Publicación actualizada correctamente.',
    data: result.rows[0],
  });
}

async function deletePost(req, res) {
  const result = await database.query(
    'DELETE FROM posts WHERE id = $1 AND author_id = $2 RETURNING id',
    [req.validated.params.id, req.user.id],
  );

  if (result.rowCount === 0) {
    throw new AppError(
      'La publicación no existe o no tienes permiso para eliminarla.',
      404,
      'POST_NOT_FOUND',
    );
  }

  return res.status(204).send();
}

module.exports = { listPosts, getPost, createPost, updatePost, deletePost };
