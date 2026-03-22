import cors from 'cors';
import express from 'express';
import configRoutes from './routes/config.routes';
import healthRoutes from './routes/health.routes';
import jobsRoutes from './routes/jobs.routes';
import { errorMiddleware } from './middleware/error.middleware';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/health', healthRoutes);
app.use('/api/config', configRoutes);
app.use('/api/jobs', jobsRoutes);
app.use(errorMiddleware);

export default app;
