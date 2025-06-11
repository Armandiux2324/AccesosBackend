import { Router } from 'express';
import { Auth as mdAuth } from '../middlewares/auth.js';
import visitorsController from '../controllers/visitors.js';

const router = Router();

router.post('/visitors', mdAuth, visitorsController.save);
router.put('/visitors', mdAuth, visitorsController.update);
router.get('/visitors', mdAuth, visitorsController.getAll);
router.get('/visitor',  mdAuth, visitorsController.getOne);
router.delete('/visitors', mdAuth, visitorsController.delete);

export default router;

