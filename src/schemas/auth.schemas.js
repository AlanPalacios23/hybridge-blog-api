const { z } = require('zod');

const registerSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2, 'El nombre debe tener al menos 2 caracteres.').max(80),
    email: z.email('Escribe un correo electrónico válido.').trim().toLowerCase().max(160),
    password: z
      .string()
      .min(8, 'La contraseña debe tener al menos 8 caracteres.')
      .max(72, 'La contraseña no puede superar 72 caracteres.')
      .regex(/[A-Z]/, 'La contraseña debe incluir una mayúscula.')
      .regex(/[a-z]/, 'La contraseña debe incluir una minúscula.')
      .regex(/[0-9]/, 'La contraseña debe incluir un número.'),
  }),
  params: z.object({}).passthrough(),
  query: z.object({}).passthrough(),
});

const loginSchema = z.object({
  body: z.object({
    email: z.email('Escribe un correo electrónico válido.').trim().toLowerCase().max(160),
    password: z.string().min(1, 'La contraseña es obligatoria.').max(72),
  }),
  params: z.object({}).passthrough(),
  query: z.object({}).passthrough(),
});

module.exports = { registerSchema, loginSchema };
