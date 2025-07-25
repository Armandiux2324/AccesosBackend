import { Router } from 'express';
import { Auth as mdAuth } from '../middlewares/auth.js';
import settingsController from '../controllers/settings.js';
import { validateAll } from '../middlewares/validate.js';
import { settingsSchema } from '../validators/settings.validator.js';

const router = Router();

// Definición de las rutas para las configuraciones
router.put('/settings', mdAuth, validateAll(settingsSchema), settingsController.update);
router.get('/settings', mdAuth, settingsController.getOne);

export default router;

