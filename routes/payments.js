import { Router } from 'express';
import { Auth as mdAuth } from '../middlewares/auth.js';
import paymentsController from '../controllers/payments.js';
import { validateBody } from '../middlewares/validate.js';
import {
  createPaymentSchema,
  updatePaymentSchema,
  deletePaymentSchema,
  getOnePaymentSchema
} from '../validators/payments.validator.js';

const router = Router();

router.post('/payments', mdAuth,  validateBody(createPaymentSchema), paymentsController.save);
router.put('/payments', mdAuth, validateBody(updatePaymentSchema), paymentsController.update);
router.get('/payments', mdAuth, paymentsController.getAll);
router.get('/payment',  mdAuth, validateBody(getOnePaymentSchema), paymentsController.getOne);
router.delete('/payments', mdAuth, validateBody(deletePaymentSchema), paymentsController.delete);

export default router;

