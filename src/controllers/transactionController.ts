import type{Request, Response, NextFunction} from 'express';
import {pool} from '../models/db.ts';
import { insertTransactionQuery } from '../queries/transactionQueries.ts';
import type { AuthenticatedRequest } from '../middleware/authMiddleware.ts';

export const addTransaction = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const { categoryId, amount, description, transactionType } = req.body;
    const userId = req.user?.userId;
  
    if (!categoryId || !amount || !transactionType) {
      res.status(400).json({ error: 'Category, amount, and transaction type are required.' });
      return;
    }
  
    const validTypes = ['Income', 'Expense'];
    if (!validTypes.includes(transactionType)) {
      res.status(400).json({ error: 'Invalid transaction type. Must be Income or Expense.' });
      return;
    }
  
    try {
      await pool.query(insertTransactionQuery, [
        userId,
        categoryId,
        amount,
        description || null,
        transactionType,
      ]);
  
      res.status(201).json({ message: 'Transaction added successfully' });
    } catch (err: any) {
      console.error('Error adding transaction:', err.message);
  
      if (err.code === 'ECONNREFUSED') {
        res.status(503).json({ error: 'Service temporarily unavailable. Try again later.' });
        return;
      }
  
      res.status(500).json({ error: 'An unexpected error occurred. Try again later.' });
      next(err);
    }
  };