import { pool } from "../models/db.ts";
import { insertTransactionQuery,getCategoryType,checkCategoryExistsQuery } from "../queries/transactionQueries.ts";

export const insertTransaction = (userId:number, category_id:number, amount:number, description:string, transaction_type:string)=>
{
    return  pool.query(insertTransactionQuery,[userId,category_id,amount,description,transaction_type]);
}

export const checkCategoryMatchesWithType = async(categoryId:number, type:string): Promise<boolean>=>
{
   const result = await pool.query(getCategoryType, [categoryId]);
   const extractedType = result.rows[0].category_type;
   return (type === extractedType)
}


export const checkCategoryIsValid = async (categoryId: number): Promise<boolean> => {
    const result = await pool.query(checkCategoryExistsQuery, [categoryId]);
    if (result.rowCount === 0) {
      return false;
    }
    return true;
  };
  