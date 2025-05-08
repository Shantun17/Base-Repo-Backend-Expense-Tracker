-- Query to create Table users to store data of user

CREATE TABLE users (
  id SERIAL PRIMARY KEY,                     
  email VARCHAR(255) UNIQUE NOT NULL,         
  password_hash VARCHAR(255) NOT NULL,        
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW() 
);

-- Query to create Table categories to store data of categories

CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    category_name VARCHAR(255) NOT NULL,
    category_type VARCHAR(10) NOT NULL CHECK (category_type IN ('Income', 'Expense')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Query to create Table transactions to store data of transactions

CREATE TYPE transaction_type_enum AS ENUM ('Income', 'Expense');

CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  category_id INT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  description TEXT,
  date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  transaction_type transaction_type_enum NOT NULL,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

