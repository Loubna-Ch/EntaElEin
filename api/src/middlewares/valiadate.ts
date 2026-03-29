import { validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { ApiError } from './ApiError'; // Make sure ApiError.ts is in the same folder

const validate = (req: Request, res: Response, next: NextFunction) => {
    // 1. Extract potential errors from the request object
    const errors = validationResult(req);
    
    // 2. If there are errors, stop the request and throw a Bad Request
    if (!errors.isEmpty()) {
        const details: Record<string, string> = {};
        
        // 3. Format the errors into a clean object (e.g., { email: "Invalid format" })
        errors.array().forEach((err: any) => {
            // Using 'path' to get the field name that failed
            details[err.path] = err.msg;
        });

        // 4. Throw your Dr.'s custom error
        throw ApiError.badRequest('Validation failed', details);
    }
    
    // 5. If everything is fine, move to the next function (the Controller)
    next();
};

export default validate;