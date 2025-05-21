import { Router } from 'express';
import { addCategory } from '../controllers/categoryController.ts';
import { authenticateToken } from '../middleware/authMiddleware.ts';
import { getCategories } from '../controllers/categoryController.ts';

const router = Router();

router.post('/category', authenticateToken, addCategory);
router.get('/category', authenticateToken, getCategories);

export default router;
