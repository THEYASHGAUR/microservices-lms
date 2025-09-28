import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { authenticateToken, requireAdmin } from '../../../shared';

const router = Router();

// Public auth routes
router.post('/login', authController.login.bind(authController));
router.post('/signup', authController.signup.bind(authController));
router.post('/logout', authController.logout.bind(authController));
router.get('/verify', authController.verify.bind(authController));
router.post('/refresh', authController.refresh.bind(authController));
router.post('/request-password-reset', authController.requestPasswordReset.bind(authController));
router.post('/reset-password', authController.resetPassword.bind(authController));

// Protected user routes
router.put('/profile', authenticateToken, authController.updateProfile.bind(authController));
router.put('/change-password', authenticateToken, authController.changePassword.bind(authController));

// Admin routes
router.get('/users', authenticateToken, requireAdmin, authController.getUsers.bind(authController));

export default router;
