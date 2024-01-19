import CustomError from "../util/customError";
import { NextFunction, Request, Response } from 'express';

const errorHandlerMiddleware = (
    err: CustomError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "ERROR";

    res.status(err.statusCode).json({
        status: err.status,
        code: err.statusCode,
        message: err.message,
        stack:
            process.env.NODE_ENV === 'development'
                ? err.stack
                : 'You need to be in development mode to see the stack',
    });
};

export default errorHandlerMiddleware;