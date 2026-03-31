import { Router } from 'express';
import { ParticipantController } from 'src/controllers/participantController';
import { participantValidators } from 'src/validators/participantValidator';

const router = Router();

router.get('/', ParticipantController.getAll);
router.get('/:id', ParticipantController.getById);
router.post('/', participantValidators, ParticipantController.create);
router.put('/:id', participantValidators, ParticipantController.update);
router.delete('/:id', ParticipantController.remove);

export default router;