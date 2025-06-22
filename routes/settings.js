import { Router } from 'express';
import { Auth as mdAuth } from '../middlewares/auth.js';
import settingsController from '../controllers/settings.js';
import { validateBody } from '../middlewares/validate.js';
import { settingsSchema } from '../validators/settings.validator.js';

const router = Router();

router.post('/settings', mdAuth, validateBody(settingsSchema), settingsController.save);
router.put('/settings', mdAuth, validateBody(settingsSchema), settingsController.update);
router.get('/settings', mdAuth, settingsController.get);

export default router;

