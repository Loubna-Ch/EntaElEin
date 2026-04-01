import { Router } from 'express';
import { AlertFromAiController } from '../controllers/alertfrimaiController';
import { alertFromAiValidators } from '../validators/alertfromaiValidator';


const router = Router();

router.get('/', AlertFromAiController.getAll);
router.get('/:id', AlertFromAiController.getById);
router.post('/', alertFromAiValidators, AlertFromAiController.create);
router.put('/:id', alertFromAiValidators, AlertFromAiController.update);
router.delete('/:id', AlertFromAiController.remove);

export default router;