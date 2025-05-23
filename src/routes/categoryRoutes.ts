import { Router } from 'express';
import { addCategory,getCategories } from '../controllers/categoryController.ts';
import { authenticateToken } from '../middleware/authMiddleware.ts';

const router = Router();

router.post('/category', authenticateToken, addCategory);
router.get('/category', authenticateToken, getCategories);

export default router;
