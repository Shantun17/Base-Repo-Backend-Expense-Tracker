export const insertTransactionQuery = 'INSERT INTO transactions (user_id, category_id, amount, description, transaction_type) VALUES ($1,$2,$3,$4,$5)' ;
export const getCategoryType = "select category_type from categories where id = $1"
export const checkCategoryExistsQuery = `SELECT 1 FROM categories WHERE id = $1`

export const buildFilteredTransactionsQuery = (
    filters: {
      type?: string;
      categories?: number[];
      month?: string;
      sort?: string;
    },
    userId: number
  ): { query: string; values: any[] } => {
    let baseQuery = `SELECT t.id AS _id, t.amount, t.description, t.transaction_type AS type, t.created_at AS date, c.category_name AS category, t.user_id AS user FROM transactions t JOIN categories c ON t.category_id = c.id WHERE t.user_id = $1`;
    const values: any[] = [userId];
    let paramIndex = 2;
  
    if (filters.type) {
      baseQuery += ` AND t.transaction_type = $${paramIndex++}`;
      values.push(filters.type);
    }
  
    if (filters.categories) {
      const placeholders = filters.categories.map((_, i) => `$${paramIndex + i}`).join(', ');
      baseQuery += ` AND t.category_id IN (${placeholders})`;
      values.push(...filters.categories);
      paramIndex += filters.categories.length;
    }
  
    if (filters.month) {
      baseQuery += ` AND TO_CHAR(t.created_at, 'YYYY-MM') = $${paramIndex++}`;
      values.push(filters.month);
    }
  
    switch (filters.sort) {
      case 'amount':
        baseQuery += ` ORDER BY t.amount ASC`;
        break;
      case 'amount_desc':
        baseQuery += ` ORDER BY t.amount DESC`;
        break;
      case 'date_desc':
        baseQuery += ` ORDER BY t.created_at DESC`;
        break;
      default:
        baseQuery += ` ORDER BY t.created_at ASC`;
        break;
    }
  
    return { query: baseQuery, values };
  };
  
  