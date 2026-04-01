import { Router } from 'express';
import { InvolvedInController } from '../controllers/involvedinController';
import { involvedInValidators } from '../validators/involvedinValidator';

const router = Router();

router.get('/', InvolvedInController.getAll);
router.get('/:participantid/:reportid', InvolvedInController.getByIds);
router.post('/', involvedInValidators, InvolvedInController.create);
router.put('/:participantid/:reportid', involvedInValidators, InvolvedInController.update);
router.delete('/:participantid/:reportid', InvolvedInController.remove);

export default router;