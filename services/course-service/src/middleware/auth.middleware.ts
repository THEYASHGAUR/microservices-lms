import { Request, Response, NextFunction } from 'express'
import { supabase } from '../config/supabase'

interface AuthenticatedRequest extends Request {
  user?: {
    id: string
    email: string
    role: string
  }
}

// Validates JWT token and extracts user information
export const authenticateToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
      return res.status(401).json({ error: 'Access token required' })
    }

    // Verify token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token)

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid or expired token' })
    }

    // Extract user role from metadata
    const role = user.user_metadata?.role || 'student'

    req.user = {
      id: user.id,
      email: user.email || '',
      role
    }

    next()
  } catch (error) {
    res.status(401).json({ error: 'Token validation failed' })
  }
}

// Checks if user has required role
export const requireRole = (roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' })
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' })
    }

    next()
  }
}

// Checks if user is instructor or admin
export const requireInstructorOrAdmin = requireRole(['instructor', 'admin'])

// Checks if user is admin only
export const requireAdmin = requireRole(['admin'])

// Checks if user is student or higher
export const requireStudent = requireRole(['student', 'instructor', 'admin'])
