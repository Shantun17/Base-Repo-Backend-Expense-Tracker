import type{Request, Response, NextFunction} from 'express';
import {pool} from '../models/db.ts';
import {insertCategoryQuery} from '../queries/categoryQueries.ts';
import type { AuthenticatedRequest } from '../middleware/authMiddleware.ts';
import { getUserCategoriesQuery } from '../queries/categoryQueries.ts';

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
    await pool.query(insertCategoryQuery, [userId, name, type]);
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

export const getCategories = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const userId = req.user?.userId;
  
    try {
      const result = await pool.query(getUserCategoriesQuery, [userId]);
      res.status(200).json({ categories: result.rows });
    } catch (err: any) {
      console.error('Error fetching categories:', err.message);
  
      if (err.code === 'ECONNREFUSED') {
        res.status(503).json({ error: 'Service temporarily unavailable. Try again later.' });
        return;
      }
  
      res.status(500).json({ error: 'An unexpected error occurred. Try again later.' });
      next(err);
    }
  };
  