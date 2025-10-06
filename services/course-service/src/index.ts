import express from 'express'
import dotenv from 'dotenv'
import path from 'path'
import { SERVICE_PORTS } from '../../../shared/constants';
import { setupExpressMiddleware, setupHealthCheck } from '../../../shared/middlewares/express-setup'
import courseRoutes from './routes/course.routes'
import { validateSupabaseConnection } from './config/supabase'

// Load environment variables from ROOT .env file (single source of truth)
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') })

// Validate environment configuration
validateSupabaseConnection()

const app = express()
const PORT = SERVICE_PORTS.COURSE_SERVICE

// Setup common middleware
setupExpressMiddleware(app)

// Setup standard endpoints
setupHealthCheck(app, 'course-service')

// API routes
app.use('/api', courseRoutes)

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err)
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  })
})

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

app.listen(PORT, () => {
  console.log(`Course service running on port ${PORT}`)
  console.log(`Health check: http://localhost:${PORT}/health`)
})
