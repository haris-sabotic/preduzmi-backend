import { Router } from 'express';
import authMiddleware from '../middlewares/auth';
import { NextFunction, Request, Response } from 'express';
import catchAsync from "../util/catchAsync";
import { createResponse } from '../util/createResponse';
import prisma from '../util/db';
import CustomError from '../util/customError';
import { businessModelFromPrisma } from '../businesses/model';
import { userModelFromPrisma } from '../users/model';

const router = Router();

const search = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const query = req.query.query;

        if (!query) {
            return next(
                new CustomError('Please add a query parameter called "query"', 400)
            );
        }

        if (typeof query != "string") {
            return next(
                new CustomError('query must be a string', 400)
            );
        }

        const usersPrisma = await prisma.user.findMany({
            where: {
                name: {
                    contains: query
                }
            }
        });

        const businessesPrisma = await prisma.business.findMany({
            where: {
                name: {
                    contains: query
                }
            }
        });


        const businessModels = await Promise.all(businessesPrisma.map(businessModelFromPrisma));
        const userModels = await Promise.all(usersPrisma.map(userModelFromPrisma));

        return res.status(200).json(createResponse({ users: userModels, businesses: businessModels }, 200));
    }
);

router
    .route('/')
    .get(authMiddleware, search);

export default router;