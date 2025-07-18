import { Router } from 'express';
import { Auth as mdAuth } from '../middlewares/auth.js';
import usersController from '../controllers/users.js';
import { validateAll } from '../middlewares/validate.js';
import authController from '../controllers/auth.js';
import {
  loginSchema,
  passwordSchema,
  createSchema,
  updateSchema,
  refreshSchema,
  logoutSchema,
  userIdSchema

} from '../validators/users.validator.js';

// Se crea una instancia del enrutador
const router = Router();

// Definición de las rutas para los usuarios
router.post('/users', mdAuth, validateAll(createSchema), usersController.save);
router.put('/users', mdAuth, validateAll(updateSchema), usersController.update);
router.put('/change-pass', mdAuth, validateAll(passwordSchema), usersController.updatePassword);
router.delete('/users', mdAuth, validateAll(userIdSchema, 'query'), usersController.delete);
router.get('/users', mdAuth, usersController.getAll);
router.get('/search-users', mdAuth, usersController.search);
router.get('/user', validateAll(userIdSchema, 'query'), mdAuth, usersController.getOne);
router.post('/login', validateAll(loginSchema), usersController.login);

// Rutas de autenticación
router.post('/refresh', validateAll(refreshSchema), authController.refreshToken);
router.post('/logout',  validateAll(logoutSchema),  authController.logout);


export default router;

