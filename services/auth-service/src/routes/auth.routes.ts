import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { authenticateToken, requireAdmin } from '#shared';

const router = Router();

// Public auth routes
router.post('/login', authController.login.bind(authController));
router.post('/signup', authController.signup.bind(authController));
router.post('/logout', authController.logout.bind(authController));

// Protected routes
router.get('/verify', authenticateToken as any, authController.verify.bind(authController));
router.post('/refresh', authController.refresh.bind(authController));
router.get('/users', authenticateToken as any, requireAdmin as any, authController.getUsers.bind(authController));
router.put('/profile', authenticateToken as any, authController.updateProfile.bind(authController));
router.post('/change-password', authenticateToken as any, authController.changePassword.bind(authController));
router.post('/request-password-reset', authController.requestPasswordReset.bind(authController));
router.post('/reset-password', authController.resetPassword.bind(authController));

export default router;
