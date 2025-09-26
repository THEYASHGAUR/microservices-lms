import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { createProxyMiddleware } from 'http-proxy-middleware';
const SERVICE_PORTS = {
  API_GATEWAY: 3000,
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
// Startup logging will use console to avoid interop issues

const app = express();
const PORT = SERVICE_PORTS.API_GATEWAY;

// Middleware
app.use(helmet());
app.use(cors(CORS_CONFIG));
app.use(morgan('combined'));

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
  },
  onProxyReq: (proxyReq, req, res) => {
    console.log('Proxying request to:', proxyReq.path);
  },
  onError: (err, req, res) => {
    console.error('Proxy error:', err);
    res.status(500).json({ error: 'Proxy error', message: err.message });
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
