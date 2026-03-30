import { Request, Response, NextFunction } from 'express';
import { ApiError } from './ApiError';
import { validationResult } from 'express-validator/lib/validation-result';

const validate = (req: Request, res: Response, next: NextFunction) => {
    // 1. Using your Dr.'s style: calling validationResult directly
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        const details: Record<string, string> = {};
        
        errors.array().forEach((err: any) => {
            // Using 'path' to map the field name to the message
            details[err.path] = err.msg;
        });

        // 2. Throwing the ApiError just like your professor's example
        throw ApiError.badRequest('Validation failed', details);
    }
    
    // 3. Move to the next step (Controller)
    next();
};

export default validate;