import { Router } from 'express';
import { addTransaction, getTransactions } from '../controllers/transactionController.ts';
import { authenticateToken } from '../middleware/authMiddleware.ts';

const router = Router();

router.post('/', authenticateToken, addTransaction);
router.get('/', authenticateToken, getTransactions)

export default router;
