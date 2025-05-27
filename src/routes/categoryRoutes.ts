import { Router } from 'express';
import { addCategory } from '../controllers/categoryController.ts';
import { authenticateToken } from '../middleware/authMiddleware.ts';

const router = Router();

router.post('/', authenticateToken, addCategory);

export default router;
