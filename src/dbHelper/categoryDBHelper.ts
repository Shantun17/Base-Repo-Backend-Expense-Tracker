import { pool } from '../models/db.ts';
import { insertCategoryQuery,getUserCategoriesQuery} from '../queries/categoryQueries.ts';

export const insertCategory = async (userId: number, name: string, type: string) => {
  return await pool.query(insertCategoryQuery, [userId, name, type]);
};

export const getUserCategory = async (userId: number)=>{
  return await pool.query(getUserCategoriesQuery,[userId]);
}


