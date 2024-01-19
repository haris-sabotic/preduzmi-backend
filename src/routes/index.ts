import { Router } from 'express';
import authRouter from './authRoutes';
import userRouter from './userRoutes';
import businessRouter from './businessRoutes';
import searchRouter from "./searchRoutes";

const router = Router();

router.use('/auth', authRouter);
router.use('/user', userRouter);
router.use('/business', businessRouter);
router.use('/search', searchRouter);

export default router;