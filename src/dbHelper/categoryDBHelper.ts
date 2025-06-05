import { pool } from '../models/db.ts';

import { insertCategoryQuery,getUserCategoriesQuery,checkCategoryExistsQuery} from '../queries/categoryQueries.ts';

export const insertCategory = (userId: number, name: string, type: string) => {
  return pool.query(insertCategoryQuery, [userId, name, type]);
};

export const getUserCategories = (userId: number)=>{
  return pool.query(getUserCategoriesQuery,[userId])
}

export const categoryExists = async (userId: number, name: string, type: string): Promise<boolean> => {
  const result = await pool.query(checkCategoryExistsQuery, [userId, name, type]);
  if (result.rowCount === 0) {
    return false;
  }
  return true;
};