import { Router } from 'express';
import { Auth as mdAuth } from '../middlewares/auth.js';
import multipart from 'connect-multiparty';
import ticketsController from '../controllers/tickets.js';
import { validateAll } from '../middlewares/validate.js';
import {
  createTicketSchema,
  updateStatusSchema,
} from '../validators/tickets.validator.js';

// Se crea una instancia del enrutador
const router   = Router();
// Middleware para manejar la carga de archivos
const mdUpload = multipart({ uploadDir: 'uploads/qr' });

// Definición de las rutas para los tickets
router.post('/tickets', mdAuth, mdUpload, validateAll(createTicketSchema), ticketsController.save);
router.get('/scan', mdAuth, ticketsController.scan); // Ruta para escanear tickets
router.put('/ticket-status', mdAuth, validateAll(updateStatusSchema), ticketsController.updateStatus);

export default router;

