import { Router } from 'express';
import { Auth as mdAuth } from '../middlewares/auth.js';
import usersController from '../controllers/users.js';

const router = Router();

router.post('/users', mdAuth, usersController.save);
router.put('/users', mdAuth, usersController.update);
router.put('/users-pass', mdAuth, usersController.updatePassword);
router.delete('/users', mdAuth, usersController.delete);
router.get('/users', mdAuth, usersController.getAll);
router.get('/user', mdAuth, usersController.getOne);
router.post('/login', usersController.login);

export default router;

