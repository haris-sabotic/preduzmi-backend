import { Request, Response, NextFunction } from 'express';
import catchAsync from "../util/catchAsync";
import { comparePasswords, signToken } from './util';
import { createResponse } from '../util/createResponse';
import { createUser } from './service';
import prisma from '../util/db';
import CustomError from '../util/customError';
import { userModelFromPrisma } from '../users/model';

export const register = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const result = await createUser(req.body);
        if (!result.success) {
            return next(result.error!);
        }

        let user = result.data!;
        const token = signToken(user.id);
        return res.status(200).json(createResponse(token, 200));
    }
);

export const login = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const { email, password } = req.body;
        if (!email || !password) {
            return next(
                new CustomError('Please provide email and password', 400)
            );
        }

        const user = await prisma.user.findUnique({
            where: { email: email },
        });

        if (!user) {
            return next(new CustomError('Incorrect email', 401));
        }

        const isPasswordCorrect = await comparePasswords(password, user.password);
        if (!isPasswordCorrect) {
            return next(new CustomError('Incorrect password', 401));
        }

        const token = signToken(user.id);
        return res.status(200).json(createResponse(token, 200));
    }
);