import { pool } from "../models/db.ts";
import { insertTransactionQuery } from "../queries/transactionQueries.ts";

export const insertTransaction = async(userId:number, category_id:number, amount:number, description:string, transaction_type:string)=>
{
    return await pool.query(insertTransactionQuery,[userId,category_id,amount,description,transaction_type]);
}


