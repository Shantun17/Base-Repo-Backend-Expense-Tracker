import authRoutes from './routes/authRoutes.ts'; 
import categoryRoutes from './routes/categoryRoutes.ts'
import express from 'express';
import { pool } from './models/db.ts';
import dotenv from 'dotenv';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use('/auth', authRoutes);
app.use('/api',categoryRoutes);
pool.connect()
  .then(client => {
    console.log('Connected to PostgreSQL!');
    client.release(); 

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Error connecting to the database:', err.message);
    process.exit(1);
  });
