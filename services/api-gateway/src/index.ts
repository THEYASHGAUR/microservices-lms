import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

// Service ports configuration
const SERVICE_PORTS = {
  API_GATEWAY: 3000,
  AUTH_SERVICE: 3001,
  USER_SERVICE: 3002,
  VIDEO_SERVICE: 3003,
  CHAT_CALL_SERVICE: 3004,
  PAYMENT_SERVICE: 3005,
  NOTIFICATION_SERVICE: 3006,
  COURSE_SERVICE: 3007
} as const;

// Basic middleware setup
const setupExpressMiddleware = (app: express.Application) => {
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
};

// Health check endpoint
const setupHealthCheck = (app: express.Application, serviceName: string) => {
  app.get('/health', (req, res) => {
    res.json({
      status: 'OK',
      service: serviceName,
      timestamp: new Date().toISOString()
    });
  });
}; 
// Startup logging will use console to avoid interop issues

const app = express();
const PORT = SERVICE_PORTS.API_GATEWAY;

// Setup standard endpoints first
setupHealthCheck(app, 'api-gateway');

// Health endpoint proxy for auth service (must come before general auth proxy)
app.use('/api/auth/health', createProxyMiddleware({
  target: `http://localhost:${SERVICE_PORTS.AUTH_SERVICE}`,
  changeOrigin: true,
  pathRewrite: {
    '^/api/auth/health': '/health'
  },
  onError: (err, req, res) => {
    console.error('Auth health proxy error:', err);
    res.status(500).json({ error: 'Auth service health check failed', message: err.message });
  }
}));

// Proxy routes to microservices (before body parsing middleware)
app.use('/api/auth', createProxyMiddleware({
  target: `http://localhost:${SERVICE_PORTS.AUTH_SERVICE}`,
  changeOrigin: true,
  pathRewrite: {
    '^/api/auth': '/auth'
  },
  timeout: 10000, // 10 second timeout
  proxyTimeout: 10000, // 10 second proxy timeout
  onProxyReq: (proxyReq, req, res) => {
    console.log('Proxying auth request to:', proxyReq.path, 'Method:', proxyReq.method);
  },
  onProxyRes: (proxyRes, req, res) => {
    console.log('Auth service responded with status:', proxyRes.statusCode);
  },
  onError: (err, req, res) => {
    console.error('Auth proxy error:', err);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Auth service error', message: err.message });
    }
  }
}));

// Setup common middleware after proxy setup
setupExpressMiddleware(app);

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

app.use('/api/courses', createProxyMiddleware({
  target: `http://localhost:${SERVICE_PORTS.COURSE_SERVICE}`,
  changeOrigin: true,
  pathRewrite: {
    '^/api/courses': '/api'
  },
  onProxyReq: (proxyReq, req, res) => {
    console.log('Proxying course request to:', proxyReq.path);
  },
  onError: (err, req, res) => {
    console.error('Course service proxy error:', err);
    res.status(500).json({ error: 'Course service error', message: err.message });
  }
}));

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
