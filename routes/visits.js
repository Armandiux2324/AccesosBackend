import { Router } from 'express';
import { Auth as mdAuth } from '../middlewares/auth.js';
import visitsController from '../controllers/visits.js';
import { validateAll } from '../middlewares/validate.js';
import {
  createVisitSchema,
  idVisitSchema,
} from '../validators/visits.validator.js';

// Se crea una instancia del enrutador
const router = Router();

// Definición de las rutas para las visitas
router.post('/visits', mdAuth, validateAll(createVisitSchema), visitsController.save);
router.get('/search-visits',  mdAuth, visitsController.searchVisits);
router.get('/visits', mdAuth, visitsController.getAll);
router.get('/visit',  mdAuth, validateAll(idVisitSchema, 'query'), visitsController.getOne);
router.delete('/visits', mdAuth, validateAll(idVisitSchema, 'query'), visitsController.delete);

export default router;

