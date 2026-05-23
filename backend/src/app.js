import cors from 'cors';
import express from 'express';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

import { frontendDistDir, uploadsDir } from './config/paths.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { adminAuthRouter } from './routes/adminAuth.js';
import { adminProductsRouter } from './routes/adminProducts.js';
import { publicProductsRouter } from './routes/publicProducts.js';

export function createApp(config = {}) {
  const app = express();
  const frontendOrigin = config.frontendOrigin ?? process.env.FRONTEND_ORIGIN;

  app.use(
    cors({
      origin: frontendOrigin || true,
    }),
  );
  app.use(express.json());
  app.use('/uploads', express.static(uploadsDir));

  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      service: 'retroboli-api',
    });
  });

  app.use('/api/products', publicProductsRouter);
  app.use('/api/admin/auth', adminAuthRouter);
  app.use('/api/admin/products', adminProductsRouter);

  if (process.env.NODE_ENV === 'production' && existsSync(frontendDistDir)) {
    app.use(express.static(frontendDistDir));
    app.get(/^(?!\/api\/).*/, (_req, res) => {
      res.sendFile(join(frontendDistDir, 'index.html'));
    });
  }

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
