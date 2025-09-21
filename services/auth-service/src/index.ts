import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { SERVICE_PORTS, CORS_CONFIG } from '../../../shared/constants';
import logger from '../../../shared/logger';
import authRoutes from './routes/auth.routes';

const app = express();
const PORT = SERVICE_PORTS.AUTH_SERVICE;

// Middleware
app.use(helmet());
app.use(cors(CORS_CONFIG));
app.use(morgan('combined'));
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'auth-service' });
});

// Routes
app.get('/api/test', (req, res) => {
  res.json({ message: 'Auth service is running' });
});

// Auth routes
app.use('/auth', authRoutes);

app.listen(PORT, () => {
  logger.info(`Auth service running on port ${PORT}`);
  logger.info('Default test credentials:');
  logger.info('Admin: admin@lms.com / password');
  logger.info('Instructor: instructor@lms.com / password');
  logger.info('Student: student@lms.com / password');
  logger.info('Deepanshu: deepanshu@gmail.com / password');
});
