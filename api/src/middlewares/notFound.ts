import { Request, Response, NextFunction } from 'express';
import { ApiError } from './ApiError';


const notFound = (req: Request, res: Response, next: NextFunction) => {
    next(
        ApiError.notFound(`Route ${req.method} ${req.originalUrl} not found`)
    );
};

export default notFound;