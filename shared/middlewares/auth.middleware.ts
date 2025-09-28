import { Request, Response, NextFunction } from 'express';
import logger from '../logger';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: 'student' | 'instructor' | 'admin';
  };
}

// Basic authentication middleware that can be extended by services
export const authenticateToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      res.status(401).json({ error: 'Access token required' });
      return;
    }

    // This is a placeholder - services should implement their own token validation
    // using their specific Supabase client
    logger.warn('Using placeholder authentication - services should implement proper token validation');
    
    // For now, just pass through - services will implement proper validation
    next();
  } catch (error) {
    logger.error('Authentication error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Role-based authorization middleware
export const requireAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }

  if (req.user.role !== 'admin') {
    res.status(403).json({ error: 'Admin access required' });
    return;
  }

  next();
};

export const requireInstructorOrAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }

  if (!['instructor', 'admin'].includes(req.user.role)) {
    res.status(403).json({ error: 'Instructor or admin access required' });
    return;
  }

  next();
};

export const requireStudent = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }

  if (req.user.role !== 'student') {
    res.status(403).json({ error: 'Student access required' });
    return;
  }

  next();
};
