import { Router } from 'express';
import { Auth as mdAuth } from '../middlewares/auth.js';
import visitorsController from '../controllers/visitors.js';
import { validateBody } from '../middlewares/validate.js';
import {
  createVisitorSchema,
  updateVisitorSchema,
  idVisitorSchema
} from '../validators/visitors.validator.js';

const router = Router();

router.post('/visitors', mdAuth, validateBody(createVisitorSchema), visitorsController.save);
router.put('/visitors', mdAuth, validateBody(updateVisitorSchema), visitorsController.update);
router.get('/visitors', mdAuth, visitorsController.getAll);
router.get('/visitor',  mdAuth, validateBody(idVisitorSchema), visitorsController.getOne);
router.get('/visitors-by-type',  mdAuth, visitorsController.getVisitorsByPriceTypeTotal);
router.get('/visitors-by-gender',  mdAuth, visitorsController.getVisitorsByGenderTotal);
router.post('/date-range-visitors',  mdAuth, visitorsController.getDailyVisitors);
router.get('/visitors-by-township',  mdAuth, visitorsController.getVisitorsByTownship);
router.get('/today-visitors',  mdAuth, visitorsController.getTodayCount);

router.delete('/visitors', mdAuth, validateBody(idVisitorSchema), visitorsController.delete);

export default router;

