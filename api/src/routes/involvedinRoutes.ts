import { Router } from 'express';
import { InvolvedInController } from '../controllers/involvedinController';
import { involvedInValidators } from '../validators/involvedinValidator';


const router = Router();

router.get('/', InvolvedInController.getAll);
router.get('/:id', InvolvedInController.getById);
router.post('/', involvedInValidators, InvolvedInController.create);
router.put('/:id', involvedInValidators, InvolvedInController.update);
router.delete('/:id', InvolvedInController.remove);

export default router;