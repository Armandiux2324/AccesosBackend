import { Router } from 'express';
import { Auth as mdAuth } from '../middlewares/auth.js';
import capacityController from '../controllers/capacity.js';

const router = Router();

router.post('/capacity', mdAuth, capacityController.save);
router.put('/capacity', mdAuth, capacityController.update);
router.get('/capacity', mdAuth, capacityController.get);

export default router;

