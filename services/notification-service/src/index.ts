import express from 'express';
import { SERVICE_PORTS } from '../../../shared/constants';
import { setupExpressMiddleware, setupHealthCheck, setupTestEndpoint } from '../../../shared/middlewares/express-setup';
import logger from '../../../shared/logger';

const app = express();
const PORT = SERVICE_PORTS.NOTIFICATION_SERVICE;

// Setup common middleware
setupExpressMiddleware(app);

// Setup standard endpoints
setupHealthCheck(app, 'notification-service');
setupTestEndpoint(app, 'Notification service');

app.listen(PORT, () => {
  logger.info(`Notification service running on port ${PORT}`);
});
