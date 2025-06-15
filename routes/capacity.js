import { Router } from 'express';
import { Auth as mdAuth } from '../middlewares/auth.js';
import capacityController from '../controllers/capacity.js';
import { validateBody } from '../middlewares/validate.js';
import { capacitySchema } from '../validators/capacity.validator.js';

const router = Router();

router.post('/capacity', mdAuth, validateBody(capacitySchema), capacityController.save);
router.put('/capacity', mdAuth, validateBody(capacitySchema), capacityController.update);
router.get('/capacity', mdAuth, capacityController.get);

export default router;

