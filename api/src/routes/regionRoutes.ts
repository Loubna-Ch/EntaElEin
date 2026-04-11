import { Router } from 'express';
import { RegionController } from '../controllers/regionController';
import { regionValidators } from '../validators/regionValidator';


const router = Router();

router.get('/', RegionController.getAll);
router.get('/:id', RegionController.getById);
router.post('/', regionValidators, RegionController.create);
router.put('/:id', regionValidators, RegionController.update);
router.delete('/:id', RegionController.remove);

export default router;