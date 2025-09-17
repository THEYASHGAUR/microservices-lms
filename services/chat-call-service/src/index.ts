import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { SERVICE_PORTS, CORS_CONFIG } from '../../../shared/constants';
import logger from '../../../shared/logger';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: CORS_CONFIG
});

const PORT = SERVICE_PORTS.CHAT_CALL_SERVICE;

// Middleware
app.use(helmet());
app.use(cors(CORS_CONFIG));
app.use(morgan('combined'));
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'chat-call-service' });
});

// Routes
app.get('/api/test', (req, res) => {
  res.json({ message: 'Chat & Call service is running' });
});

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
