import cors from 'cors';
import express from 'express';

export function createApp(config = {}) {
  const app = express();
  const frontendOrigin = config.frontendOrigin ?? process.env.FRONTEND_ORIGIN;

  app.use(
    cors({
      origin: frontendOrigin || true,
    }),
  );
  app.use(express.json());

  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      service: 'retroboli-api',
    });
  });

  return app;
}
