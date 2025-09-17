import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { SERVICE_PORTS, CORS_CONFIG } from '../../../shared/constants';
import logger from '../../../shared/logger';

const app = express();
const PORT = SERVICE_PORTS.VIDEO_SERVICE;

// Middleware
app.use(helmet());
app.use(cors(CORS_CONFIG));
app.use(morgan('combined'));
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'video-service' });
});

// Routes
app.get('/api/test', (req, res) => {
  res.json({ message: 'Video service is running' });
});

app.listen(PORT, () => {
  logger.info(`Video service running on port ${PORT}`);
});
