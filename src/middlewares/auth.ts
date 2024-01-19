import jwt from 'jsonwebtoken';
import catchAsync from '../util/catchAsync';
import CustomError from '../util/customError';
import prisma from '../util/db';

const authMiddleware = catchAsync(async (req, res, next) => {
    const authorization = req.headers.authorization;

    if (!authorization) {
        return next(new CustomError('Missing token', 401));
    }

    const authorizationParts = authorization.split(' ');
    if (authorizationParts.length < 2) {
        return next(new CustomError('Token must be of format "Bearer $token"', 401));
    }

    const token = authorizationParts[1];

    const secret = process.env.JWT_SECRET as string;
    const { id } = jwt.verify(token, secret) as { id: number; };

    const user = await prisma.user.findUnique({
        where: { id },
    });

    if (!user) {
        return next(
            new CustomError(
                'The user belonging to this token does not exist',
                401,
            )
        );
    }

    req.user = user;
    next();
});

export default authMiddleware;