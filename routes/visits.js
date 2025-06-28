import { Router } from 'express';
import { Auth as mdAuth } from '../middlewares/auth.js';
import visitsController from '../controllers/visits.js';
import { validateBody } from '../middlewares/validate.js';
import {
  createVisitSchema,
  updateDatetimeEndSchema,
  updateVisitSchema,
} from '../validators/visits.validator.js';

const router = Router();

router.post('/visits', mdAuth, validateBody(createVisitSchema), visitsController.save);
router.put('/visits', mdAuth, validateBody(updateVisitSchema), visitsController.update);
router.put('/visit', mdAuth, validateBody(updateDatetimeEndSchema), visitsController.updateDatetimeEnd);
router.get('/search-visits',  mdAuth, visitsController.getVisitByDate);
router.get('/visits', mdAuth, visitsController.getAll);
router.get('/visit',  mdAuth, visitsController.getOne);
router.delete('/visits', mdAuth, visitsController.delete);

export default router;

