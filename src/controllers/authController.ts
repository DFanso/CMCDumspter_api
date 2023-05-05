import { Request, Response,NextFunction } from 'express';
import User, { IUser } from '../models/User';
import jwt from 'jsonwebtoken';


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
