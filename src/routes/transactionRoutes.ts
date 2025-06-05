import { Router } from 'express';
import { addTransaction } from '../controllers/transactionController.ts';
import { authenticateToken } from '../middleware/authMiddleware.ts';

const router = Router();

router.post('/', authenticateToken, addTransaction);

export default router;
