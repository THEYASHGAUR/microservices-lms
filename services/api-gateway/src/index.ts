import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { SERVICE_PORTS, setupExpressMiddleware, setupHealthCheck } from '../../../shared/constants';
// Startup logging will use console to avoid interop issues

const app = express();
const PORT = SERVICE_PORTS.API_GATEWAY;

// Setup common middleware
setupExpressMiddleware(app);

// Setup standard endpoints
setupHealthCheck(app, 'api-gateway');

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
