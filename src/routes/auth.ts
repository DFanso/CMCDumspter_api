import express from 'express';
import { signIn, signUp, forgotPassword, resetPassword } from '../controllers/authController';

const router = express.Router();

router.post('/signup', signUp);
router.post('/signin', signIn);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

export default router;
