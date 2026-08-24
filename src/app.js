const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const { env } = require('./config/env');
const { openApiDocument } = require('./docs/openapi');
const apiRoutes = require('./routes');
const { notFound } = require('./middlewares/notFound');
const { errorHandler } = require('./middlewares/errorHandler');

const app = express();

app.set('trust proxy', 1);
app.disable('x-powered-by');

app.use(helmet());
app.use(
  cors({
    origin:
      env.corsOrigin === '*'
        ? '*'
        : env.corsOrigin.split(',').map((origin) => origin.trim()),
  }),
);
app.use(express.json({ limit: '20kb' }));
app.use(express.urlencoded({ extended: false, limit: '20kb' }));

if (env.nodeEnv !== 'test') {
  app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));
}

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
  }),
);

app.get('/', (_req, res) => {
  res.json({
    success: true,
    name: 'Hybridge Blog API',
    version: '1.0.0',
    status: 'online',
    message: 'API desplegada correctamente 🚀',
    swagger: '/docs',
    documentation: {
      health: 'GET /api/health',
      register: 'POST /api/auth/register',
      login: 'POST /api/auth/login',
      profile: 'GET /api/auth/me',
      posts: 'GET|POST /api/posts',
      post: 'GET|PATCH|DELETE /api/posts/:id',
    },
    timestamp: new Date().toISOString(),
  });
});

app.use(
  '/docs',
  swaggerUi.serve,
  swaggerUi.setup(openApiDocument, {
    customSiteTitle: 'Hybridge Blog API | Documentación',
    swaggerOptions: { persistAuthorization: true },
  }),
);
app.get('/openapi.json', (_req, res) => res.json(openApiDocument));
app.use('/api', apiRoutes);
app.use(notFound);
app.use(errorHandler);

module.exports = app;
