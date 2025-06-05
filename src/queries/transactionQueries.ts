export const insertTransactionQuery = 'INSERT INTO transactions (user_id, category_id, amount, description, transaction_type) VALUES ($1,$2,$3,$4,$5)' ;
export const getCategoryType = "select category_type from categories where id = $1"
export const checkCategoryExistsQuery = `SELECT 1 FROM categories WHERE id = $1`;
