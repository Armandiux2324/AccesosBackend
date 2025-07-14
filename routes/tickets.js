import { Router } from 'express';
import { Auth as mdAuth } from '../middlewares/auth.js';
import multipart from 'connect-multiparty';
import ticketsController from '../controllers/tickets.js';
import { validateBody } from '../middlewares/validate.js';
import {
  createTicketSchema,
  updateTicketSchema,
  idTicketSchema,
  updateStatusSchema,
} from '../validators/tickets.validator.js';

const router   = Router();
const mdUpload = multipart({ uploadDir: 'uploads/qr' });

router.post('/tickets', mdAuth, mdUpload, validateBody(createTicketSchema), ticketsController.save);
router.put('/tickets', mdAuth, validateBody(updateTicketSchema), ticketsController.update);
router.get('/tickets', mdAuth, ticketsController.getAll);
router.get('/ticket', mdAuth, validateBody(idTicketSchema), ticketsController.getOne);
router.get('/active-visitors', mdAuth, ticketsController.getActiveVisitorsCount);
router.get('/scan', mdAuth, ticketsController.scan);
router.delete('/tickets', mdAuth, validateBody(idTicketSchema), ticketsController.delete);
router.put('/ticket-status', mdAuth, validateBody(updateStatusSchema), ticketsController.updateStatus);

export default router;

