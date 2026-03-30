import { Request, Response, NextFunction } from 'express';
import { ApiError } from './ApiError';

const errorHandler = (
    err: any, 
    req: Request, 
    res: Response, 
    next: NextFunction
) => {
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            code: err.code,
            message: err.message,
            details: err.details || {},
        });
    }

    console.error('Unexpected Error');
    console.error(err);

    return res.status(500).json({
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred',
        details: {},
    });
};

export default errorHandler;