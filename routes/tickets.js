import { Router } from 'express';
import { Auth as mdAuth } from '../middlewares/auth.js';
import multipart from 'connect-multiparty';
import ticketsController from '../controllers/tickets.js';

const router   = Router();
const mdUpload = multipart({ uploadDir: 'uploads/qr' });

router.post('/tickets', mdAuth, mdUpload, ticketsController.save);
router.put('/tickets', mdAuth, ticketsController.update);
router.get('/tickets', mdAuth, ticketsController.getAll);
router.get('/ticket', mdAuth, ticketsController.getOne);
router.get('/total-sales', mdAuth, ticketsController.getTotalSales);
router.delete('/tickets', mdAuth, ticketsController.delete);

export default router;

