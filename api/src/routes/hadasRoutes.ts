import { Router } from 'express';
import { HadasController } from 'src/controllers/hadasController';
import { hadasValidators } from 'src/validators/hadasValidator';


const router = Router();

router.get('/', HadasController.getAll);
router.get('/:id', HadasController.getById);
router.post('/', hadasValidators, HadasController.create);
router.put('/:id', hadasValidators, HadasController.update);
router.delete('/:id', HadasController.remove);

export default router;