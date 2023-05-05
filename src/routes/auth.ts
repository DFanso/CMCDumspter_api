import express from 'express';
import { signIn, signUp, forgotPassword, resetPassword } from '../controllers/authController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/signup', signUp);
router.post('/signin', signIn);
router.post('/forgot-password',authMiddleware, forgotPassword);
router.post('/reset-password/:token', resetPassword);

export default router;
