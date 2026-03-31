import { Response, NextFunction } from 'express';
import { ApiError } from '../ApiError';
import { Authenticate } from './authenticate'; 

/**
 * Access control middleware to permit specific user roles.
 * Must be used after the `authenticate` middleware.
 * * @param {string[]} allowedRoles - An array of user types that are permitted (e.g., ['admin', 'police']).
 */
export const authorize = (allowedRoles: string[] = []) => {
    return (req: Authenticate, _res: Response, next: NextFunction): void => {
        // Check if req.user exists (set by the authenticate middleware)
        if (!req.user) {
            return next(ApiError.unauthorized('Authentication required'));
        }

        // Check if the user's role is in the allowed list
        if (allowedRoles.length > 0 && !allowedRoles.includes(req.user.userType)) {
            return next(
                ApiError.forbidden(
                    `Access denied. Required role(s): ${allowedRoles.join(', ')}`
                )
            );
        }

        next();
    };
};

export default authorize;