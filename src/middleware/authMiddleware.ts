import 'express';
declare module 'express-serve-static-core' {
  interface Request {
  
    user: { userId: number; email: string };
  }
}

import type { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();


export const authenticateToken: RequestHandler = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; 

  if (!token) {
    res.status(401).json({ error: 'Token is invalid or missing' });
    return;
  }

  jwt.verify(token, process.env.JWT_SECRET as string, (err, user) => {
    if (err) {
      res.status(401).json({ error: 'Token is invalid' });
      return;
    }

  
    req.user = user as { userId: number; email: string };
    next();
  });
};
