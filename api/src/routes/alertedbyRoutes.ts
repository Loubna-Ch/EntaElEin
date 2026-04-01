import { Router } from 'express';
import { AlertedByController } from 'src/controllers/alertedbController';
import { alertedByValidators } from 'src/validators/alertedbyValidator';

const router = Router();

router.get('/', AlertedByController.getAll);
router.get('/:userid/:alertid', AlertedByController.getByIds);
router.post('/', alertedByValidators, AlertedByController.create);
router.put('/:userid/:alertid', alertedByValidators, AlertedByController.update);
router.delete('/:userid/:alertid', AlertedByController.remove);

export default router;