const { z } = require('zod');

const idParams = z.object({
  id: z.string().regex(/^\d+$/, 'El identificador debe ser un número entero positivo.'),
});

const postBody = z.object({
  title: z.string().trim().min(3, 'El título debe tener al menos 3 caracteres.').max(180),
  content: z.string().trim().min(10, 'El contenido debe tener al menos 10 caracteres.').max(20000),
});

const createPostSchema = z.object({
  body: postBody,
  params: z.object({}).passthrough(),
  query: z.object({}).passthrough(),
});

const updatePostSchema = z.object({
  body: postBody.partial().refine((value) => Object.keys(value).length > 0, {
    message: 'Envía al menos un campo para actualizar.',
  }),
  params: idParams,
  query: z.object({}).passthrough(),
});

const postIdSchema = z.object({
  body: z.object({}).passthrough(),
  params: idParams,
  query: z.object({}).passthrough(),
});

const listPostsSchema = z.object({
  body: z.object({}).passthrough(),
  params: z.object({}).passthrough(),
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(10),
    search: z.string().trim().max(100).optional(),
  }),
});

module.exports = { createPostSchema, updatePostSchema, postIdSchema, listPostsSchema };
