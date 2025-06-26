import { Router } from 'express';
import { Auth as mdAuth } from '../middlewares/auth.js';
import multipart from 'connect-multiparty';
import ticketsController from '../controllers/tickets.js';
import { validateBody } from '../middlewares/validate.js';
import {
  createTicketSchema,
  updateTicketSchema,
  idTicketSchema
} from '../validators/tickets.validator.js';

const router   = Router();
const mdUpload = multipart({ uploadDir: 'uploads/qr' });

router.post('/tickets', mdAuth, mdUpload, validateBody(createTicketSchema), ticketsController.save);
router.put('/tickets', mdAuth, validateBody(updateTicketSchema), ticketsController.update);
router.get('/tickets', mdAuth, ticketsController.getAll);
router.get('/ticket', mdAuth, validateBody(idTicketSchema), ticketsController.getOne);
router.get('/ticket-by-visit', mdAuth, ticketsController.getByVisitId);
router.get('/total-sales', mdAuth, ticketsController.getTotalSales);
router.get('/today-sales', mdAuth, ticketsController.getTodaySales);
router.get('/week-sales', mdAuth, ticketsController.getLast7DaysSales);
router.get('/active-visitors', mdAuth, ticketsController.getActiveVisitorsCount);
router.delete('/tickets', mdAuth, validateBody(idTicketSchema), ticketsController.delete);

export default router;

