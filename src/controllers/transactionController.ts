import type { Request, Response, } from 'express';
import { insertTransaction,checkCategoryMatchesWithType,checkCategoryIsValid,getUserTransactions} from '../dbHelper/transactionDBHelper.ts';

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

export const getTransactions = async(
  req: Request,
  res: Response
):Promise<void>=>{
  const userId = req.user.userId
  try 
  {
  const result = await getUserTransactions(userId)
  res.status(200).json({Transactions: result.rows}); 
  }
   catch (err:any) 
  {
    console.error('Error fetching categories:', err.message);
    if (err.code === 'ECONNREFUSED') 
      {
      res.status(503).json({ error: 'Service temporarily unavailable. Try again later.' });
      return;
    }
    res.status(500).json({ error: 'An unexpected error occurred. Try again later.' });
  }  

}