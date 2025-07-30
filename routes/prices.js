import { Router } from 'express';
import { Auth as mdAuth } from '../middlewares/auth.js';
import pricesController from '../controllers/prices.js';
import { validateAll } from '../middlewares/validate.js';
import {
  updatePricesSchema,
} from '../validators/prices.validator.js';

const router = Router();

// Definición de las rutas para los precios
router.put('/prices', mdAuth, validateAll(updatePricesSchema), pricesController.updateMany);
router.get('/prices', mdAuth, pricesController.getAll);

export default router;

