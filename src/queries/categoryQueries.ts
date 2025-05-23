export const insertCategoryQuery = 'INSERT INTO categories (user_id, category_name, category_type) VALUES ($1, $2, $3)';

export const checkCategoryExistsQuery = `SELECT 1 FROM categories WHERE user_id = $1 AND category_name = $2 AND category_type = $3`;

export const getUserCategoriesQuery = `SELECT id, category_name, category_type FROM categories WHERE user_id = $1`;