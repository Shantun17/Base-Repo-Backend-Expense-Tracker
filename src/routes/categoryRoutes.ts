import { Router } from 'express';
import { addCategory,getCategories } from '../controllers/categoryController.ts';
import { authenticateToken } from '../middleware/authMiddleware.ts';
import { getCategories } from '../controllers/categoryController.ts';

const router = Router();

router.post('/', authenticateToken, addCategory);

router.get('/', authenticateToken, getCategories);



export default router;
