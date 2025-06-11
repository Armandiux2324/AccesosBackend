import { Router } from 'express';
import { Auth as mdAuth } from '../middlewares/auth.js';
import pricesController from '../controllers/prices.js';

const router = Router();

router.post('/prices', mdAuth, pricesController.save);
router.put('/prices', mdAuth, pricesController.update);
router.get('/prices', mdAuth, pricesController.getAll);
router.get('/price', mdAuth, pricesController.getOne);
router.delete('/prices', mdAuth, pricesController.delete);

export default router;

