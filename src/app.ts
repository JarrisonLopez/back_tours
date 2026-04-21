import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import { healthRouter } from './routes/health.routes.js';
import { toursRouter } from './routes/tours.routes.js';
import { cotizarRouter } from './routes/cotizar.routes.js';
import { catalogosRouter } from './routes/catalogos.routes.js';
import { notFound } from './middleware/not-found.js';
import { errorHandler } from './middleware/error-handler.js';

export const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'https://front-tour.vercel.app',
];

if (env.FRONTEND_URL && !allowedOrigins.includes(env.FRONTEND_URL)) {
  allowedOrigins.push(env.FRONTEND_URL);
}

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`Origen no permitido por CORS: ${origin}`));
    },
    credentials: false,
  })
);

app.use(express.json());

app.get('/', (_req, res) => {
  res.json({
    ok: true,
    name: 'Tours API',
    version: '1.0.0',
  });
});

app.use('/health', healthRouter);
app.use('/api/tours', toursRouter);
app.use('/api/cotizar', cotizarRouter);
app.use('/api/catalogos', catalogosRouter);

app.use(notFound);
app.use(errorHandler);