import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';

import { env } from './config/env.js';
import { authRoutes } from './routes/authRoutes.js';
import { buildingRoutes } from './routes/buildingRoutes.js';
import { apartmentRoutes } from './routes/apartmentRoutes.js';
import { paymentRoutes } from './routes/paymentRoutes.js';
import { maintenanceRoutes } from './routes/maintenanceRoutes.js';
import { errorHandler, notFound } from './utils/errors.js';

export function createApp() {
  const app = express();

  app.disable('x-powered-by');

  app.use(helmet());

  app.use(
    cors()
  );

  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: 300,
      standardHeaders: 'draft-7',
      legacyHeaders: false
    })
  );

  app.use(express.json({ limit: '1mb' }));
  app.use(cookieParser());

  if (env.nodeEnv !== 'production') {
    app.use(morgan('dev'));
  }

  app.get('/api/health', (req, res) => {
    res.json({ ok: true, env: env.nodeEnv });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/buildings', buildingRoutes);
  app.use('/api/apartments', apartmentRoutes);
  app.use('/api/payments', paymentRoutes);
  app.use('/api/maintenance', maintenanceRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
