import { Router } from 'express';
import { Auth as mdAuth } from '../middlewares/auth.js';
import visitsController from '../controllers/visits.js';
import { validateBody } from '../middlewares/validate.js';
import {
  createVisitSchema,
  updateVisitSchema,
} from '../validators/visits.validator.js';

const router = Router();

router.post('/visits', mdAuth, validateBody(createVisitSchema), visitsController.save);
router.put('/visits', mdAuth, validateBody(updateVisitSchema), visitsController.update);
router.get('/search-visits',  mdAuth, visitsController.searchVisitsPaginated);
router.get('/visits', mdAuth, visitsController.getVisitsPaginated);
router.get('/visit',  mdAuth, visitsController.getOne);
router.delete('/visits', mdAuth, visitsController.delete);

export default router;

