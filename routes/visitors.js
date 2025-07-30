import { Router } from 'express';
import { Auth as mdAuth } from '../middlewares/auth.js';
import visitorsController from '../controllers/visitors.js';
import { validateAll } from '../middlewares/validate.js';
import {
  createVisitorSchema,
} from '../validators/visitors.validator.js';

// Se crea una instancia del enrutador
const router = Router();

// Definición de las rutas para los visitantes
router.post('/visitors', mdAuth, validateAll(createVisitorSchema), visitorsController.save);

// Rutas para estadísticas de visitantes
router.get('/visitors-by-type',  mdAuth, visitorsController.getVisitorsByPriceTypeTotal);
router.get('/visitors-by-gender',  mdAuth, visitorsController.getVisitorsByGenderTotal);
router.post('/date-range-visitors',  mdAuth, visitorsController.getDailyVisitorsInDateRange);
router.get('/visitors-by-township',  mdAuth, visitorsController.getVisitorsByTownship);
router.get('/today-visitors',  mdAuth, visitorsController.getTodayCount);

export default router;

