import type { Request, Response, NextFunction } from 'express';
import { insertTransaction } from '../dbHelper/transactionDBHelper.ts';
import type { AuthenticatedRequest } from '../middleware/authMiddleware.ts';

export const addTransaction = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { categoryId, amount, description, transactionType } = req.body;
  const userId = req.user?.userId;

  if (categoryId === undefined || amount === undefined || !transactionType) {
    res.status(400).json({ error: 'Category, amount, and transaction type are required.' });
    return;
  }

  if (!Number.isInteger(categoryId) || categoryId <= 0) {
    res.status(400).json({ error: 'Invalid categoryId. Must be a positive integer.' });
    return;
  }

  if (typeof amount !== 'number' || amount <= 0) {
    res.status(400).json({ error: 'Amount must be a positive number.' });
    return;
  }

  const validTypes = ['Income', 'Expense'];
  if (!validTypes.includes(transactionType)) {
    res.status(400).json({ error: 'Invalid transaction type. Must be Income or Expense.' });
    return;
  }

  if (description && description.length > 500) {
    res.status(400).json({ error: 'Description too long. Maximum 500 characters allowed.' });
    return;
  }

  try {
    await insertTransaction(userId!, categoryId, amount, description, transactionType);
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
