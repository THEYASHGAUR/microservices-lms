// Load environment variables from ROOT .env file (single source of truth)
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

import express from 'express';
import { SERVICE_PORTS, setupExpressMiddleware, setupHealthCheck, setupTestEndpoint } from '../../../shared';
import authRoutes from './routes/auth.routes';

const app = express();
const PORT = SERVICE_PORTS.AUTH_SERVICE;

// Setup common middleware
setupExpressMiddleware(app);

// Setup standard endpoints
setupHealthCheck(app, 'auth-service');
setupTestEndpoint(app, 'Auth service');

// Auth routes
app.use('/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`Auth service running on port ${PORT}`);
});
