import { Router } from 'express';
import { Auth as mdAuth } from '../middlewares/auth.js';
import paymentsController from '../controllers/payments.js';
import { validateBody } from '../middlewares/validate.js';
import {
  createPaymentSchema,
  updatePaymentSchema,
  deletePaymentSchema,
  getOnePaymentSchema,
  getPaymentByDateSchema
} from '../validators/payments.validator.js';

const router = Router();

router.post('/payments', mdAuth,  validateBody(createPaymentSchema), paymentsController.save);
router.put('/payments', mdAuth, validateBody(updatePaymentSchema), paymentsController.update);
router.get('/payments', mdAuth, paymentsController.getAll);
router.get('/payment',  mdAuth, validateBody(getOnePaymentSchema), paymentsController.getOne);
router.delete('/payments', mdAuth, paymentsController.delete);
router.get('/total-sales', mdAuth, paymentsController.getTotalSales);
router.post('/date-range-sales', mdAuth, paymentsController.getSalesInDateRange);
router.get('/today-sales', mdAuth, paymentsController.getTodaySales);
router.get('/week-sales', mdAuth, paymentsController.getLast7DaysSales);

export default router;

