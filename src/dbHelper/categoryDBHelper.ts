import { pool } from '../models/db.ts';
import { insertCategoryQuery, checkCategoryExistsQuery} from '../queries/categoryQueries.ts';


export const insertCategory = async (userId: number, name: string, type: string) => {
  return await pool.query(insertCategoryQuery, [userId, name, type]);
};

export const categoryExists = async (userId: number, name: string, type: string): Promise<boolean> => {
  const result = await pool.query(checkCategoryExistsQuery, [userId, name, type]);
  if (result.rowCount === null) {
    return false;
  }
  return result.rowCount > 0;
};
