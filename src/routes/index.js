const express = require('express');
const database = require('../config/database');
const { asyncHandler } = require('../middlewares/asyncHandler');
const authRoutes = require('./auth.routes');
const postsRoutes = require('./posts.routes');

const router = express.Router();

router.get(
  '/health',
  asyncHandler(async (_req, res) => {
    const startedAt = process.hrtime.bigint();

    try {
      const result = await database.query('SELECT NOW() AS current_time');
      const elapsedMs = Number(process.hrtime.bigint() - startedAt) / 1_000_000;

      return res.json({
        success: true,
        status: 'healthy',
        service: 'hybridge-blog-api',
        uptimeSeconds: Math.floor(process.uptime()),
        database: {
          status: 'connected',
          responseTimeMs: Number(elapsedMs.toFixed(2)),
          serverTime: result.rows[0].current_time,
        },
        timestamp: new Date().toISOString(),
      });
    } catch (_error) {
      return res.status(503).json({
        success: false,
        status: 'unhealthy',
        service: 'hybridge-blog-api',
        database: { status: 'disconnected' },
        timestamp: new Date().toISOString(),
      });
    }
  }),
);

router.use('/auth', authRoutes);
router.use('/posts', postsRoutes);

module.exports = router;
