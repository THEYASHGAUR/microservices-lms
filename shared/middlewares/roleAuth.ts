import { Request, Response, NextFunction } from 'express';
import logger from '../logger';
import { getSupabaseClient } from '../supabase';

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: 'student' | 'instructor' | 'admin';
  };
}

// Verifies Supabase JWT token and extracts user information
export const authenticateToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;

  if (!token) {
    res.status(401).json({
      success: false,
      message: 'Access token required'
    });
    return;
  }

  try {
    const supabase = getSupabaseClient();
    
    // Verify token with Supabase
    const { data, error } = await supabase.auth.getUser(token);
    
    if (error || !data.user) {
      res.status(403).json({
        success: false,
        message: 'Invalid or expired token'
      });
      return;
    }

    // Get user profile with role
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    req.user = {
      userId: data.user.id,
      email: data.user.email!,
      role: profile?.role || data.user.user_metadata?.role || 'student'
    };
    
    next();
  } catch (error) {
    logger.error('Token verification failed:', error);
    res.status(403).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

export const requireRole = (allowedRoles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
      return;
    }

    next();
  };
};

// Convenience middleware for specific roles
export const requireAdmin = requireRole(['admin']);
export const requireInstructor = requireRole(['instructor', 'admin']);
export const requireStudent = requireRole(['student', 'instructor', 'admin']);

// Middleware to check if user can access their own resources or is admin
export const requireOwnershipOrAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
    return;
  }

  const resourceUserId = req.params.userId || req.params.id;
  
  if (req.user.role === 'admin' || req.user.userId === resourceUserId) {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Access denied: You can only access your own resources'
    });
  }
};
