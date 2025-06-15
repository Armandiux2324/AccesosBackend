import { Router } from 'express';
import { Auth as mdAuth } from '../middlewares/auth.js';
import pricesController from '../controllers/prices.js';
import { validateBody } from '../middlewares/validate.js';
import {
  createPriceSchema,
  updatePriceSchema,
  idPriceSchema
} from '../validators/prices.validator.js';

const router = Router();

router.post('/prices', mdAuth, validateBody(createPriceSchema), pricesController.save);
router.put('/prices', mdAuth, validateBody(updatePriceSchema), pricesController.update);
router.get('/prices', mdAuth, pricesController.getAll);
router.get('/price', mdAuth, validateBody(idPriceSchema), pricesController.getOne);
router.delete('/prices', mdAuth, validateBody(idPriceSchema), pricesController.delete);

export default router;

