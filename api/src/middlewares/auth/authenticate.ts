import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../../config/jwt';
import { ApiError } from '../ApiError';
/**
 * Custom Request interface to include the decoded user.
 * This prevents TypeScript errors when accessing req.user.
 */
export interface Authenticate extends Request {
    user?: {
        id: any;
        email: string;
        userType: string;
    };
}

/**
 * Express middleware to authenticate a user using a JWT access token.
 */
const authenticate = (req: Authenticate, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(ApiError.unauthorized('Missing or invalid Authorization header'));
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = verifyAccessToken(token);
        
        req.user = {
            id: decoded.id,
            email: decoded.email,
            userType: decoded.userType,
        };
        
        next();
    } catch (err: any) {
        if (err.name === 'TokenExpiredError') {
            return next(ApiError.unauthorized('Token has expired'));
        }
        next(ApiError.unauthorized('Invalid token'));
    }
};

export default authenticate;