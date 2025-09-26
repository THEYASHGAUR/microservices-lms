// Load environment variables from .env file
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
const SERVICE_PORTS = {
  AUTH_SERVICE: 3001,
  USER_SERVICE: 3002,
  VIDEO_SERVICE: 3003,
  CHAT_CALL_SERVICE: 3004,
  PAYMENT_SERVICE: 3005,
  NOTIFICATION_SERVICE: 3006
};

const CORS_CONFIG = {
  origin: 'http://localhost:4000',
  credentials: true
};
import authRoutes from './routes/auth.routes';

const app = express();
const PORT = SERVICE_PORTS.AUTH_SERVICE;

// Middleware
app.use(helmet());
app.use(cors(CORS_CONFIG));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

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
  console.log(`Auth service running on port ${PORT}`);
});
