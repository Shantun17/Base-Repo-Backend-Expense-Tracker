export const insertTransactionQuery = 'INSERT INTO transactions (user_id, category_id, amount, description, transaction_type) VALUES ($1,$2,$3,$4,$5)' ;
export const getCategoryType = "select category_type from categories where id = $1"
export const checkCategoryExistsQuery = `SELECT 1 FROM categories WHERE id = $1`
export const getUserTransactionsQuery = `SELECT t.id, t.amount, t.description, t.transaction_type, t.created_at, c.category_name FROM transactions t JOIN categories c ON t.category_id = c.id WHERE t.user_id = $1 ORDER BY t.created_at DESC`;

