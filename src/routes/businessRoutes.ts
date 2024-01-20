import { Router } from 'express';
import * as businessController from '../businesses/controller';
import authMiddleware from '../middlewares/auth';

const router = Router();

router
    .route('/create')
    .post(authMiddleware, businessController.createBusiness);

router
    .route('/edit/:id')
    .put(authMiddleware, businessController.editBusiness);

router
    .route('/like/:id')
    .put(authMiddleware, businessController.likeBusiness);

router
    .route('/save/:id')
    .put(authMiddleware, businessController.saveBusiness);


router
    .route('/all')
    .post(authMiddleware, businessController.allBusinesses);

export default router;
