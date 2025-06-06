import type { Request, Response, } from 'express';
import { insertTransaction,checkCategoryMatchesWithType,checkCategoryIsValid} from '../dbHelper/transactionDBHelper.ts';


export const addTransaction = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { categoryId, amount, description, transactionType } = req.body;
  const userId = req.user.userId;

  if (categoryId == null || amount == null || transactionType == null) {
    res.status(400).json({ error: 'Category, amount, and transaction type are required.' });
    return;
  }

  if (!Number.isInteger(categoryId) || categoryId <= 0) {
    res.status(400).json({ error: 'Invalid categoryId. Must be a positive integer.' });
    return;
  }
 
  const categoryExists = await checkCategoryIsValid(categoryId);
  if (!categoryExists) {
    res.status(400).json({ error: 'Category ID does not exist.' });
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

  if (description && description.length > 100) {
    res.status(400).json({ error: 'Description too long. Maximum 100 characters allowed.' });
    return;
  }

  const isValidCategoryType = await checkCategoryMatchesWithType(categoryId, transactionType);

  if (!isValidCategoryType) {
    res.status(400).json({ error: 'Category does not match the transaction type.' });
    return;
  }
  
  try {
    await insertTransaction(userId, categoryId, amount, description, transactionType);
    res.status(201).json({ message: 'Transaction added successfully' });
  } catch (err: any) {
    console.error('Error adding transaction:', err.message);

    if (err.code === 'ECONNREFUSED') {
      res.status(503).json({ error: 'Service temporarily unavailable. Try again later.' });
      return;
    }

    res.status(500).json({ error: 'An unexpected error occurred. Try again later.' });
  }
};
