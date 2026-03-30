import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { registerRules, loginRules } from '../validators/authValidator';

const router = Router();

router.post('/register', registerRules, AuthController.register);
router.post('/login', loginRules, AuthController.login);

export default router;