import { Router } from 'express';
import { signup } from '../controllers/authController.ts';

const router = Router();

router.post('/signup', signup);

export default router;
