import { Router } from 'express';
import * as userController from '../users/controller';
import authMiddleware from '../middlewares/auth';

const router = Router();

router
    .route('/')
    .get(authMiddleware, userController.user);

router
    .route('/edit')
    .put(authMiddleware, userController.editUser);


router
    .route('/posted')
    .get(authMiddleware, userController.getPostedBusinesses);

router
    .route('/liked')
    .get(authMiddleware, userController.getLikedBusinesses);

router
    .route('/saved')
    .get(authMiddleware, userController.getSavedBusinesses);

export default router;