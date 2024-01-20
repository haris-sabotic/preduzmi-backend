import { NextFunction, Request, Response } from 'express';
import catchAsync from "../util/catchAsync";
import { createResponse } from '../util/createResponse';
import prisma from '../util/db';
import { userModelFromPrisma } from '../users/model';
import { UserType } from '@prisma/client';
import CustomError from '../util/customError';
import fileUpload from 'express-fileupload';
import { v4 as uuidv4 } from 'uuid';
import { businessModelFromPrisma } from '../businesses/model';

export const user = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.user!;

        const userPrisma = await prisma.user.findUnique({
            where: { id: id },
        });

        const userModel = await userModelFromPrisma(userPrisma!);
        return res.status(200).json(createResponse(userModel, 200));
    }
);

export const editUser = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.user!;
        const { name, type, phone, photo } = req.body;

        let data: any = {};
        if (name) {
            data.name = name;
        }

        if (phone) {
            data.phone = phone;
        }

        if (type) {
            if (type == UserType.Investitor || type == UserType.Preduzetnik) {
                data.type = type;
            } else {
                return next(
                    new CustomError(`type must be either ${UserType.Investitor} or ${UserType.Preduzetnik}`, 400)
                );
            }
        }

        if (photo) {
            data.photo = photo;
        }

        const userPrisma = await prisma.user.update({
            where: { id: id },
            data
        });

        const userModel = await userModelFromPrisma(userPrisma!);
        return res.status(200).json(createResponse(userModel, 200));
    }
);

export const getPostedBusinesses = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.user!;

        const userPrisma = await prisma.user.findUnique({
            where: { id: id },
            select: {
                posted_businesses: true
            }
        });

        const businesses = userPrisma!.posted_businesses;
        const businessModels = await Promise.all(businesses.map(businessModelFromPrisma));

        return res.status(200).json(createResponse(businessModels, 200));
    }
);

export const getLikedBusinesses = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.user!;

        const userPrisma = await prisma.user.findUnique({
            where: { id: id },
            select: {
                liked_businesses: true
            }
        });

        const businesses = userPrisma!.liked_businesses;
        const businessModels = await Promise.all(businesses.map(businessModelFromPrisma));

        return res.status(200).json(createResponse(businessModels, 200));
    }
);

export const getSavedBusinesses = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.user!;

        const userPrisma = await prisma.user.findUnique({
            where: { id: id },
            select: {
                saved_businesses: true
            }
        });

        const businesses = userPrisma!.saved_businesses;
        const businessModels = await Promise.all(businesses.map(businessModelFromPrisma));

        return res.status(200).json(createResponse(businessModels, 200));
    }
);