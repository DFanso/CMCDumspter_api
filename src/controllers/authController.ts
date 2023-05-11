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
  const { name, contactNumber, email, role, username, password, address } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.status(400).json({ message: 'Email is already in use.' });
  }

  const newUser = new User({ name, contactNumber, email, role, username, password,address });

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
  const { username, password ,role} = req.body;

  const user = await User.findOne({ username });

  

  if (!user) {
    return res.status(400).json({ message: 'Invalid username or password.' });
  }
  if (role !== user?.role) {
    return res.status(400).json({ message: 'Invalid role SignIn' });
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

export const getUserProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await User.findById(req.body.id).select('-password -passwordResetToken -passwordResetExpires');
  
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }
  
      res.status(200).json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching user profile.' });
    }
  };
  





export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return next({ status: 404, message: 'User not found.' });
    }

    const resetCode = crypto.randomBytes(4).toString('hex').toUpperCase();

    user.passwordResetToken = resetCode;
    user.passwordResetExpires = new Date(Date.now() + 3600000); // 1 hour

    await user.save();

    const message = `
    <h1>Password Reset</h1>
    <p>You are receiving this email because you (or someone else) have requested the reset of the password for your account.</p>
    <p>Please use the following code to reset your password within one hour of receiving it:</p>
    <h2>${resetCode}</h2>
    <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
    `;

    await sendEmail(user.email, 'Password Reset', message);

    res.status(200).json({ message: 'Password reset email sent.' });
  } catch (error) {
    console.error('Error sending the password reset email:', error);
    next({ status: 500, message: 'Error sending the password reset email.' });
  }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  const { resetCode, newPassword } = req.body;
  try {
    const user = await User.findOne({
      passwordResetToken: resetCode,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return next({ status: 400, message: 'Password reset code is invalid or has expired.' });
    }

    user.password = newPassword;
    user.passwordResetToken = "";
    user.passwordResetExpires = new Date();

    await user.save();

    res.status(200).json({ message: 'Password has been reset.' });
  } catch (error) {
    next({ status: 500, message: 'Error resetting the password.' });
  }
};
