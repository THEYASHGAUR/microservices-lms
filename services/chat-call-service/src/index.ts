import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { SERVICE_PORTS, CORS_CONFIG } from '../../../shared/constants';
import { setupExpressMiddleware, setupHealthCheck, setupTestEndpoint } from '../../../shared/middlewares/express-setup';
import logger from '../../../shared/logger';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: CORS_CONFIG
});

const PORT = SERVICE_PORTS.CHAT_CALL_SERVICE;

// Setup common middleware
setupExpressMiddleware(app);

// Setup standard endpoints
setupHealthCheck(app, 'chat-call-service');
setupTestEndpoint(app, 'Chat & Call service');

// Socket.io connection handling
io.on('connection', (socket) => {
  logger.info(`User connected: ${socket.id}`);
  
  socket.on('disconnect', () => {
    logger.info(`User disconnected: ${socket.id}`);
  });
});

server.listen(PORT, () => {
  logger.info(`Chat & Call service running on port ${PORT}`);
});
