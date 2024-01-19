import { NextFunction, Request, Response } from 'express';
import catchAsync from "../util/catchAsync";
import { createResponse } from '../util/createResponse';
import prisma from '../util/db';
import { Business, BusinessLegalType, BusinessType } from '@prisma/client';
import CustomError from '../util/customError';
import fileUpload from 'express-fileupload';
import { v4 as uuidv4 } from 'uuid';
import { BusinessModelLegalTypes, BusinessModelTypes, businessModelFromPrisma, legalTypeToPrisma, typeToPrisma } from './model';

export const createBusiness = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = (req.user!).id;
        const { name, type, legalType, description } = req.body;

        if (!name || !type || !legalType || !description || !(req.files && req.files.photo)) {
            return next(
                new CustomError('Please provide name, type, legalType, description and photo', 400)
            );
        }

        if (BusinessModelTypes.indexOf(type) == -1) {
            return next(
                new CustomError(`type must be one of ${BusinessModelTypes.join(", ")}`, 400)
            );
        }

        if (BusinessModelLegalTypes.indexOf(legalType) == -1) {
            return next(
                new CustomError(`legalType must be one of ${BusinessModelLegalTypes.join(", ")}`, 400)
            );
        }


        const photo = req.files.photo as fileUpload.UploadedFile;

        if (photo.mimetype.split('/')[0] != 'image') {
            return {
                success: false,
                error: new CustomError(
                    'Uploaded photo is not an image',
                    400
                ),
            };
        }

        const photoExtension = photo.name.split('.').pop();
        const photoFilename = uuidv4() + '.' + photoExtension;
        photo.mv(process.env.STORAGE_PATH + photoFilename);

        const businessPrisma = await prisma.business.create({
            data: {
                name,
                type: typeToPrisma(type),
                legal_type: legalTypeToPrisma(legalType),
                description,
                photo: photoFilename,
                posted_by_id: userId
            }
        });

        const businessModel = await businessModelFromPrisma(businessPrisma);
        return res.status(200).json(createResponse(businessModel, 200));
    }
);

export const editBusiness = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = (req.user!).id;
        const businessId = req.params.id;
        const { name, type, legalType, description } = req.body;

        const business = await prisma.business.findUnique({
            where: {
                id: parseInt(businessId)
            }
        });

        if (!business) {
            return next(
                new CustomError('No business with that id exists', 400)
            );
        }

        if (business.posted_by_id != userId) {
            return next(
                new CustomError('You were not the one to create that business', 400)
            );
        }


        let data: any = {};

        if (name) {
            data.name = name;
        }

        if (description) {
            data.description = description;
        }

        if (type) {
            if (BusinessModelTypes.indexOf(type) == -1) {
                return next(
                    new CustomError(`type must be one of ${BusinessModelTypes.join(", ")}`, 400)
                );
            }

            data.type = typeToPrisma(type);
        }

        if (legalType) {
            if (BusinessModelLegalTypes.indexOf(legalType) == -1) {
                return next(
                    new CustomError(`legalType must be one of ${BusinessModelLegalTypes.join(", ")}`, 400)
                );
            }

            data.legal_type = legalTypeToPrisma(legalType);
        }

        if (req.files && req.files.photo) {
            const photo = req.files.photo as fileUpload.UploadedFile;

            if (photo.mimetype.split('/')[0] != 'image') {
                return {
                    success: false,
                    error: new CustomError(
                        'Uploaded photo is not an image',
                        400
                    ),
                };
            }

            const photoExtension = photo.name.split('.').pop();
            const photoFilename = uuidv4() + '.' + photoExtension;
            photo.mv(process.env.STORAGE_PATH + photoFilename);

            data.photo = photoFilename;
        }

        console.log(data);
        const businessPrisma = await prisma.business.update({
            where: { id: parseInt(businessId) },
            data
        });

        const businessModel = await businessModelFromPrisma(businessPrisma);
        return res.status(200).json(createResponse(businessModel, 200));
    }
);

export const likeBusiness = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = (req.user!).id;
        const businessId = req.params.id;

        const business = await prisma.business.findUnique({
            where: {
                id: parseInt(businessId)
            }
        });

        if (!business) {
            return next(
                new CustomError('No business with that id exists', 400)
            );
        }

        await prisma.user.update({
            where: { id: userId },
            data: {
                liked_businesses: {
                    connect: {
                        id: parseInt(businessId)
                    }
                }
            }
        });

        return res.status(200).json(createResponse("success", 200));
    }
);

export const saveBusiness = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = (req.user!).id;
        const businessId = req.params.id;

        const business = await prisma.business.findUnique({
            where: {
                id: parseInt(businessId)
            }
        });

        if (!business) {
            return next(
                new CustomError('No business with that id exists', 400)
            );
        }

        await prisma.user.update({
            where: { id: userId },
            data: {
                saved_businesses: {
                    connect: {
                        id: parseInt(businessId)
                    }
                }
            }
        });

        return res.status(200).json(createResponse("success", 200));
    }
);

export const allBusinesses = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        let orParams = [];

        if (req.body.legalTypes) {
            const legalTypes = req.body.legalTypes;

            if (!Array.isArray(legalTypes)) {
                return next(
                    new CustomError('legalTypes must be an array', 400)
                );
            } else {
                let prismaLegalTypes: BusinessLegalType[] = [];
                for (let i = 0; i < legalTypes.length; i++) {
                    const element = legalTypes[i];
                    if (BusinessModelLegalTypes.indexOf(element) == -1) {
                        return next(
                            new CustomError(`All elements of legalTypes must be one of ${BusinessModelLegalTypes.join(", ")}`, 400)
                        );
                    } else {
                        prismaLegalTypes.push(legalTypeToPrisma(element));
                    }
                }

                orParams.push({
                    legal_type: {
                        in: prismaLegalTypes
                    }
                });
            }
        }

        if (req.body.types) {
            const types = req.body.types;

            if (!Array.isArray(types)) {
                return next(
                    new CustomError('types must be an array', 400)
                );
            } else {
                let prismaTypes: BusinessType[] = [];
                for (let i = 0; i < types.length; i++) {
                    const element = types[i];
                    if (BusinessModelTypes.indexOf(element) == -1) {
                        return next(
                            new CustomError(`All elements of types must be one of ${BusinessModelTypes.join(", ")}`, 400)
                        );
                    } else {
                        prismaTypes.push(typeToPrisma(element));
                    }
                }

                orParams.push({
                    type: {
                        in: prismaTypes
                    }
                });
            }
        }

        let businesses: Business[] = [];
        if (orParams.length > 0) {
            businesses = await prisma.business.findMany({
                where: {
                    OR: orParams
                }
            });
        } else {
            businesses = await prisma.business.findMany({});
        }
        const businessModels = await Promise.all(businesses.map(businessModelFromPrisma));

        return res.status(200).json(createResponse(businessModels, 200));
    }
);