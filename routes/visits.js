import { Router } from 'express';
import { Auth as mdAuth } from '../middlewares/auth.js';
import visitsController from '../controllers/visits.js';

const router = Router();

router.post('/visits', mdAuth, visitsController.save);
router.put('/visits', mdAuth, visitsController.update);
router.put('/visit', mdAuth, visitsController.updateDatetimeEnd);
router.get('/visits', mdAuth, visitsController.getAll);
router.get('/visit',  mdAuth, visitsController.getOne);
router.delete('/visits', mdAuth, visitsController.delete);

export default router;

