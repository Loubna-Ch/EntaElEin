import { Router } from 'express';
import { FeedbackController } from '../controllers/feedbackController';
import { feedbackValidators } from '../validators/feedbackValidator';

const router = Router();

router.get('/', FeedbackController.getAll);
router.get('/:id', FeedbackController.getById);
router.post('/', feedbackValidators, FeedbackController.create);
router.put('/:id', feedbackValidators, FeedbackController.update);
router.delete('/:id', FeedbackController.remove);

export default router;