import type{Request, Response, NextFunction} from 'express';
import type { AuthenticatedRequest } from '../middleware/authMiddleware.ts';
import { insertCategory,categoryExists } from '../dbHelper/categoryDBHelper.ts';

export const addCategory = async (
    req : AuthenticatedRequest,
    res : Response,
    next : NextFunction
): Promise<void> => {
    const {name, type} = req.body;
    const userId = req.user?.userId;


  if (!name) {
    res.status(400).json({ error: 'Category name is required' });
    return;
  }

  if (!type) {
    res.status(400).json({ error: 'Category Type is required' });
    return;
  }
  try {
    const exists = await categoryExists(userId!, name, type);
    if (exists) {
      res.status(400).json({ error: 'Category already exists' });
      return;
    }
    await insertCategory(userId!,name,type);
    res.status(201).json({ message: 'Category added successfully' });
  } catch (error: any) {
    console.error('Error adding category:', error);

    if (error.code === 'ECONNREFUSED') {
      res.status(503).json({ error: 'Service is temporarily unavailable. Please try again later.' });
      return;
    }

    res.status(500).json({ error: 'An unexpected error occurred. Please try again later.' });
    next(error);
  }
};