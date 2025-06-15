import { Router } from 'express';
import { Auth as mdAuth } from '../middlewares/auth.js';
import usersController from '../controllers/users.js';
import { validateBody } from '../middlewares/validate.js';
import {
  loginSchema,
  passwordSchema,
  createSchema,
  updateSchema,
  deleteSchema
} from '../validators/users.validator.js';

const router = Router();

router.post('/users', mdAuth, validateBody(createSchema), usersController.save);
router.put('/users', mdAuth, validateBody(updateSchema), usersController.update);
router.put('/users-pass', mdAuth, validateBody(passwordSchema), usersController.updatePassword);
router.delete('/users', mdAuth, validateBody(deleteSchema), usersController.delete);
router.get('/users', mdAuth, usersController.getAll);
router.get('/user', mdAuth, validateBody(deleteSchema), usersController.getOne);
router.post('/login', validateBody(loginSchema), usersController.login);

export default router;

