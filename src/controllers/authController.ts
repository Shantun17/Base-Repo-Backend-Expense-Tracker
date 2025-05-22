
import type { Request, Response, NextFunction, RequestHandler } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { checkUserExists, insertUser, getUserByEmail } from '../dbHelper/authDBHelper.ts';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'];

export const signup: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { email, password, confirmPassword } = req.body;

  if (!email || !password || !confirmPassword) {
    res.status(400).json({ error: 'All fields are required' });
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ error: 'Invalid email format' });
    return;
  }

  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>\/\?]).{8,}$/;
  if (!passwordRegex.test(password)) {
    res.status(400).json({
      error:
        'Password is too weak. It must contain at least 8 characters, a number, an uppercase letter, and a special character.',
    });
    return;
  }

  if (password !== confirmPassword) {
    res.status(400).json({ error: 'Passwords do not match' });
    return;
  }

  try {

    const userCheck = await checkUserExists(email);
    if (userCheck.rows.length > 0) {
      res.status(409).json({ error: 'User already exists' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await insertUser(email, hashedPassword);

    res.status(201).json({ message: 'User registered successfully' });

  } catch (error: any) {
    console.error('Error signing up user:', error.message);

    if (error.code === 'ECONNREFUSED') {
      res.status(503).json({ error: 'Service temporarily unavailable. Please try again later.' });
      return;
    }

    res.status(500).json({ error: 'An unexpected error occurred. Please try again later.' });
    next(error);
  }
};

export const login: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: 'Email and Password are required' });
    return;
  }

  try {
    const result = await getUserByEmail(email);

    if (result.rows.length === 0) {
      res.status(401).json({ error: 'Invalid Email' });
      return;
    }

    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);

    if (!valid) {
      res.status(401).json({ error: 'Password does not match' });
      return;
    }

    const payload = { userId: user.id, email: user.email };
    const options: jwt.SignOptions = { expiresIn: JWT_EXPIRES_IN };
    const token = jwt.sign(payload, JWT_SECRET as jwt.Secret, options);

    res.status(200).json({
      message: 'Logged in successfully',
      token,
      user: { id: user.id, email: user.email },
    });

  } catch (err: any) {
    console.error('Login error:', err.message);
    res.status(500).json({ error: 'An unexpected error occurred. Please try again later.' });
    next(err);
  }
};
