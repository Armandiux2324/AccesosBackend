import { Router } from 'express';
import { Auth as mdAuth } from '../middlewares/auth.js';
import paymentsController from '../controllers/payments.js';

const router = Router();

router.post('/payments', mdAuth, paymentsController.save);
router.put('/payments', mdAuth, paymentsController.update);
router.get('/payments', mdAuth, paymentsController.getAll);
router.get('/payment',  mdAuth, paymentsController.getOne);
router.delete('/payments', mdAuth, paymentsController.delete);

export default router;

