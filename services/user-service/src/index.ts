import express from 'express';
import { SERVICE_PORTS } from '../../../shared/constants';
import { setupExpressMiddleware, setupHealthCheck, setupTestEndpoint } from '../../../shared/middlewares/express-setup';
import logger from '../../../shared/logger';

const app = express();
const PORT = SERVICE_PORTS.USER_SERVICE;

// Setup common middleware
setupExpressMiddleware(app);

// Setup standard endpoints
setupHealthCheck(app, 'user-service');
setupTestEndpoint(app, 'User service');

app.listen(PORT, () => {
  logger.info(`User service running on port ${PORT}`);
});
