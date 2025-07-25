import { Router } from 'express';
import { Auth as mdAuth } from '../middlewares/auth.js';
import paymentsController from '../controllers/payments.js';
import { validateAll } from '../middlewares/validate.js';
import {
  createPaymentSchema,
  updatePaymentSchema,
  getPaymentByDateSchema,
  paymentIdSchema
} from '../validators/payments.validator.js';

// Se crea una instancia del enrutador
const router = Router();

// Definición de las rutas para los pagos
router.post('/payments', mdAuth,  validateAll(createPaymentSchema), paymentsController.save);
router.put('/payments', mdAuth, validateAll(updatePaymentSchema), paymentsController.update);
router.get('/payments', mdAuth, paymentsController.getAll);
router.get('/payment',  mdAuth, validateAll(paymentIdSchema), paymentsController.getOne);
router.delete('/payments', mdAuth, validateAll(paymentIdSchema, 'query'), paymentsController.delete);

// Rutas para obtener estadísticas de pagos
router.get('/total-sales', mdAuth, paymentsController.getTotalSales);
router.post('/date-range-sales', mdAuth, paymentsController.getSalesInDateRange);
router.get('/today-sales', mdAuth, paymentsController.getTodaySales);
router.get('/week-sales', mdAuth, paymentsController.getLast7DaysSales);

export default router;

