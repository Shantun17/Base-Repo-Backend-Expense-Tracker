import type { Request, Response, NextFunction, RequestHandler } from 'express';
import bcrypt from 'bcrypt';
import { pool } from '../models/db.ts';
import { checkUserExistsQuery, insertUserQuery } from '../queries/authQueries.ts';

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
    res.status(400).json({ error: 'Password is too weak. It must contain at least 8 characters, a number, an uppercase letter, and a special character.' });
    return;
  }

  if (password !== confirmPassword) {
    res.status(400).json({ error: 'Passwords do not match' });
    return;
  }

  try {
    const userCheck = await pool.query(checkUserExistsQuery, [email]);
    if (userCheck.rows.length > 0) {
      res.status(409).json({ error: 'User already exists' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(insertUserQuery, [email, hashedPassword]);
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
