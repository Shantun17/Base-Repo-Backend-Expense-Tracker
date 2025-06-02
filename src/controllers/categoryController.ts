import type{Response, Request} from 'express';

import { insertCategory,categoryExists } from '../dbHelper/categoryDBHelper.ts';

export const addCategory = async (
    req : Request,
    res : Response,
): Promise<void> => {
    const {name, type} = req.body;
    const userId = req.user.userId;


  if (!name) {
    res.status(400).json({ error: 'Category name is required' });
    return;
  }

  if (!type) {
    res.status(400).json({ error: 'Category Type is required' });
    return;
  }

  if(type!=='Expense' && type!=='Income')
  {
    res.status(400).json({ error: `Category Type should be either 'Income' or 'Expense'` });
    return;
  }
  try {
    const doesCategoExists = await categoryExists(userId, name, type);
    if (doesCategoExists) {
      res.status(409).json({ error: 'Category already exists' });
      return;
    }
    await insertCategory(userId,name,type);
    res.status(201).json({ message: 'Category added successfully' });
  } 
  catch (error: any) {
    console.error('Error adding category:', error);

    if (error.code === 'ECONNREFUSED') {
      res.status(503).json({ error: 'Service is temporarily unavailable. Please try again later.' });
      return;
    }

    res.status(500).json({ error: 'An unexpected error occurred. Please try again later.' });
  }
};