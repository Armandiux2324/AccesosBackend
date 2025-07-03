import { Router } from 'express';
import { Auth as mdAuth } from '../middlewares/auth.js';
import visitsController from '../controllers/visits.js';
import { validateBody } from '../middlewares/validate.js';
import {
  createVisitSchema,
  updateDatetimeBeginSchema,
  updateDatetimeEndSchema,
  updateVisitSchema,
} from '../validators/visits.validator.js';

const router = Router();

router.post('/visits', mdAuth, validateBody(createVisitSchema), visitsController.save);
router.put('/visits', mdAuth, validateBody(updateVisitSchema), visitsController.update);
router.put('/visit-begin', mdAuth, validateBody(updateDatetimeBeginSchema), visitsController.updateDatetimeBegin);
router.put('/visit-end', mdAuth, validateBody(updateDatetimeEndSchema), visitsController.updateDatetimeEnd);
router.get('/search-visits',  mdAuth, visitsController.searchVisitsPaginated);
router.get('/visits', mdAuth, visitsController.getVisitsPaginated);
router.get('/visit',  mdAuth, visitsController.getOne);
router.delete('/visits', mdAuth, visitsController.delete);

export default router;

