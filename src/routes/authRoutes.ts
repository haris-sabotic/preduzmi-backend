import { Router } from 'express';
import * as authController from '../auth/controller';

const router = Router();

router.route('/register').post(authController.register);

router.route('/login').post(authController.login);

export default router;