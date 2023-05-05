import { Request, Response,NextFunction } from 'express';
import User, { IUser } from '../models/User';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { sendEmail } from '../utils/mailer';


const generateToken = (user: IUser): string => {
  return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET!, {
    expiresIn: '1d',
  });
};

export const signUp = async (req: Request, res: Response,next: NextFunction) => {
    try {
  const { name, contactNumber, email, role, username, password } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.status(400).json({ message: 'Email is already in use.' });
  }

  const newUser = new User({ name, contactNumber, email, role, username, password });

  await newUser.save();

  res.status(201).json({
    message: 'User created successfully',
    token: generateToken(newUser),
  });
} catch (err) {
    next({ status: 400, message: 'Error during signup.' });
}
};

export const signIn = async (req: Request, res: Response,next: NextFunction) => {
    try {
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  if (!user) {
    return res.status(400).json({ message: 'Invalid username or password.' });
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid username or password.' });
  }

  res.json({
    message: 'Logged in successfully',
    token: generateToken(user),
  });
} catch (err) {
        next({ status: 400, message: 'Error during signin.' });
      }
};




export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return next({ status: 404, message: 'User not found.' });
    }

    const buffer = crypto.randomBytes(20);
    const token = buffer.toString('hex');

    user.passwordResetToken = token;
    user.passwordResetExpires = new Date(Date.now() + 3600000); // 1 hour

    await user.save();

    const resetURL = `http://${req.headers.host}/api/auth/reset-password/${token}`;
    const message = `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\nPlease click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n${resetURL}\n\nIf you did not request this, please ignore this email and your password will remain unchanged.\n`;

    await sendEmail(user.email, 'Password Reset', message);

    res.status(200).json({ message: 'Password reset email sent.' });
  } catch (error) {
    next({ status: 500, message: 'Error sending the password reset email.' });
  }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await User.findOne({
        passwordResetToken: req.params.token,
        passwordResetExpires: { $gt: Date.now() },
      });
  
      if (!user) {
        return next({ status: 400, message: 'Password reset token is invalid or has expired.' });
      }
  
      user.password = req.body.password;
      user.passwordResetToken = "" ;
    user.passwordResetExpires = new Date();
  
      await user.save();
  
      res.status(200).json({ message: 'Password has been reset.' });
    } catch (error) {
      next({ status: 500, message: 'Error resetting the password.' });
    }
  };