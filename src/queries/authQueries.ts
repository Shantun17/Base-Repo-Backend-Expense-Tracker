export const checkUserExistsQuery = 'SELECT * FROM users WHERE email = $1';
export const insertUserQuery = 'INSERT INTO users (email, password_hash) VALUES ($1, $2)';
