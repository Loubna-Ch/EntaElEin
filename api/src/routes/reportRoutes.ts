import { Router } from 'express';
import { ReportController } from 'src/controllers/reportController';
import { reportValidators } from 'src/validators/reportValidator';

const router = Router();

router.get('/', ReportController.getAll);
router.get('/:id', ReportController.getById);
router.post('/', reportValidators, ReportController.create);
router.put('/:id', reportValidators, ReportController.update);
router.delete('/:id', ReportController.remove);

export default router;