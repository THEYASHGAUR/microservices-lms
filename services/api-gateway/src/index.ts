import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { createProxyMiddleware } from 'http-proxy-middleware';
import constants from '../../../shared/constants/index.ts';
const { SERVICE_PORTS, CORS_CONFIG } = constants as { SERVICE_PORTS: { API_GATEWAY: number; AUTH_SERVICE: number; USER_SERVICE: number; VIDEO_SERVICE: number; CHAT_CALL_SERVICE: number; PAYMENT_SERVICE: number; NOTIFICATION_SERVICE: number }; CORS_CONFIG: { origin: string | string[]; credentials: boolean } };
// Startup logging will use console to avoid interop issues

const app = express();
const PORT = SERVICE_PORTS.API_GATEWAY;

// Middleware
app.use(helmet());
app.use(cors(CORS_CONFIG));
app.use(morgan('combined'));
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'api-gateway' });
});

// Proxy routes to microservices
app.use('/api/auth', createProxyMiddleware({
  target: `http://localhost:${SERVICE_PORTS.AUTH_SERVICE}`,
  changeOrigin: true,
  pathRewrite: {
    '^/api/auth': '/auth'
  }
}));

app.use('/api/users', createProxyMiddleware({
  target: `http://localhost:${SERVICE_PORTS.USER_SERVICE}`,
  changeOrigin: true,
  pathRewrite: {
    '^/api/users': '/api'
  }
}));

app.use('/api/videos', createProxyMiddleware({
  target: `http://localhost:${SERVICE_PORTS.VIDEO_SERVICE}`,
  changeOrigin: true,
  pathRewrite: {
    '^/api/videos': '/api'
  }
}));

app.use('/api/chat', createProxyMiddleware({
  target: `http://localhost:${SERVICE_PORTS.CHAT_CALL_SERVICE}`,
  changeOrigin: true,
  pathRewrite: {
    '^/api/chat': '/api'
  }
}));

app.use('/api/payments', createProxyMiddleware({
  target: `http://localhost:${SERVICE_PORTS.PAYMENT_SERVICE}`,
  changeOrigin: true,
  pathRewrite: {
    '^/api/payments': '/api'
  }
}));

app.use('/api/notifications', createProxyMiddleware({
  target: `http://localhost:${SERVICE_PORTS.NOTIFICATION_SERVICE}`,
  changeOrigin: true,
  pathRewrite: {
    '^/api/notifications': '/api'
  }
}));

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
