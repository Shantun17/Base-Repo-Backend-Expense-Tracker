import type { Request, Response, } from 'express';
import { insertTransaction,checkCategoryMatchesWithType,checkCategoryIsValid,getFilteredTransactions} from '../dbHelper/transactionDBHelper.ts';

export const addTransaction = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { categoryId, amount, description, transactionType } = req.body;
  const userId = req.user.userId;

  if(!categoryId || !Number.isInteger(categoryId) || categoryId <0)
  {
    res.status(400).json({error:'CategoryId is required, and it must be a positive integer'})
    return;
  }

  if(!amount || typeof amount !== 'number' || amount <0 )
  {
    res.status(400).json({error:'Amount is required and it must be a positive number.'})
    return;
  }
  const validTypes = ['Income', 'Expense'];

  if(!transactionType || !validTypes.includes(transactionType))
  {
   res.status(400).json({error:`Transaction Type is required and it must be either 'Expense or 'Income'`})
   return;
  }

  try 
  {
  const categoryExists = await checkCategoryIsValid(categoryId);
  if (!categoryExists) {
    res.status(400).json({ error: 'Category ID does not exist.' });
    return;
  }

  const isValidCategoryType = await checkCategoryMatchesWithType(categoryId, transactionType);

  if (!isValidCategoryType) {
    res.status(400).json({ error: 'Category does not match the transaction type.' });
    return;
  }

    await insertTransaction(userId, categoryId, amount, description, transactionType);
    res.status(201).json({ message: 'Transaction added successfully' });
    
  }
   catch (err: any) 
   {
    console.error('Error adding transaction:', err.message);

    if (err.code === 'ECONNREFUSED') {
      res.status(503).json({ error: 'Service temporarily unavailable. Try again later.' });
      return;
    }

    res.status(500).json({ error: 'An unexpected error occurred. Try again later.' });
  }
};

export const getTransactions = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.user.userId;
  const { type, categories, month, sort } = req.query;

  const filters: {
    type?: string;
    categories?: number[];
    month?: string;
    sort?: string;
  } = {};

  if (type) {
    if (typeof type !== 'string') {
      res.status(400).json({ error: `'type' must be a string` });
      return;
    }
    if (type !== 'Income' && type !== 'Expense') {
      res.status(400).json({ error: `'type' must be either 'Income' or 'Expense'` });
      return;
    }
    filters.type = type;
  }

  if (categories) {
    if (typeof categories !== 'string') {
      res.status(400).json({ error: `'categories' must be a comma-separated string of numeric IDs` });
      return;
    }
    const categoriesInInteger = categories.split(',').map((i) => parseInt(i));
    if (categoriesInInteger.some((i) => isNaN(i))) {
      res.status(400).json({ error: `'categories' must be a comma-separated list of numeric IDs` });
      return;
    }
    filters.categories = categoriesInInteger;
  }

  if (month) {
    if (typeof month !== 'string') {
      res.status(400).json({ error: `'month' must be a string in YYYY-MM format` });
      return;
    }
    if (!/^\d{4}-\d{2}$/.test(month)) {
      res.status(400).json({ error: `'month' must be in YYYY-MM format` });
      return;
    }
    filters.month = month;
  }

  const allowedSorts = ['date', 'date_desc', 'amount', 'amount_desc'];
  if (sort) {
    if (typeof sort !== 'string') {
      res.status(400).json({ error: `'sort' must be a string` });
      return;
    }
    if (!allowedSorts.includes(sort)) {
      res.status(400).json({ error: `'sort' must be one of: ${allowedSorts.join(', ')}` });
      return;
    }
    filters.sort = sort;
  }

  try {
    const result = await getFilteredTransactions(userId, filters);
    res.status(200).json({ transactions: result.rows });
  } catch (err: any) {
    console.error('Error fetching transactions:', err.message);
    if (err.code === 'ECONNREFUSED') {
      res.status(503).json({ error: 'Service temporarily unavailable. Try again later.' });
    } else {
      res.status(500).json({ error: 'An unexpected error occurred. Try again later.' });
    }
  }
};

