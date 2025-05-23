import { pool } from "../models/db.ts";
import { checkUserExistsQuery, insertUserQuery, getUserByEmailQuery } from '../queries/authQueries.ts';

export const checkUserExists = async (email: string) => {
  return await pool.query(checkUserExistsQuery, [email]);
};

export const insertUser = async (email: string, hashedPassword: string) => {
  return await pool.query(insertUserQuery, [email, hashedPassword]);
};

export const getUserByEmail = async (email: string) => {
  return await pool.query(getUserByEmailQuery, [email]);
};
