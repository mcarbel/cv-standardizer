import cors from 'cors';
import express from 'express';
import configRoutes from './routes/config.routes';
import healthRoutes from './routes/health.routes';
import jobsRoutes from './routes/jobs.routes';
import { errorMiddleware } from './middleware/error.middleware';

const app = express();

app.use((req, res, next) => {
  const startedAt = Date.now();
  const requestId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const origin = req.headers.origin || '-';
  const contentType = req.headers['content-type'] || '-';

  console.log(`[http] --> ${requestId} ${req.method} ${req.originalUrl} origin=${origin} content-type=${contentType}`);

  res.on('finish', () => {
    const durationMs = Date.now() - startedAt;
    console.log(`[http] <-- ${requestId} ${req.method} ${req.originalUrl} status=${res.statusCode} duration=${durationMs}ms`);
  });

  next();
});

app.use(cors({
  origin: true,
  credentials: false,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With']
}));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Vary', 'Origin');
  res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, Origin, X-Requested-With');
  res.header('Access-Control-Allow-Private-Network', 'true');

  if (req.method === 'OPTIONS') {
    res.sendStatus(204);
    return;
  }

  next();
});
app.use(express.json());
app.use('/api/health', healthRoutes);
app.use('/api/config', configRoutes);
app.use('/api/jobs', jobsRoutes);
app.use(errorMiddleware);

export default app;
