import { Router } from 'express';
import { authController } from '../controllers/auth.controller';

const router = Router();

// Auth routes
router.post('/login', authController.login.bind(authController));
router.post('/signup', authController.signup.bind(authController));
router.post('/logout', authController.logout.bind(authController));
router.get('/verify', authController.verify.bind(authController));
router.post('/refresh', authController.refresh.bind(authController));

// Admin routes
router.get('/users', authController.getUsers.bind(authController));

export default router;
