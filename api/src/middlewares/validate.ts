import { Request, Response, NextFunction } from 'express';
import { ApiError } from './ApiError';
import { validationResult } from 'express-validator/lib/validation-result';

const validate = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        const details: Record<string, string> = {};
        
        errors.array().forEach((err: any) => {
            details[err.path] = err.msg;
        });

        throw ApiError.badRequest('Validation failed', details);
    }
    
    next();
};

export default validate;