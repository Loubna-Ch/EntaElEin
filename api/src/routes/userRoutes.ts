import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { userValidators } from '../validators/userValidators';

const router = Router();

router.get('/', UserController.getAll);
router.get('/:id', UserController.getById);
router.get('/email/:email', UserController.getByEmail);
router.post('/', userValidators, UserController.create);
router.put('/:id', userValidators, UserController.update);
router.delete('/:id', UserController.remove);

export default router;