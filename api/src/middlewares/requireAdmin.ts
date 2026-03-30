import { Request, Response, NextFunction } from 'express';
import pool from '../config/db';
import { ApiError } from './ApiError';


interface AuthenticatedRequest extends Request {
    authenticatedUserId?: number;
}

const requireAdmin = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const headerValue = req.headers['x-user-id'] as string; 
        const userId = Number.parseInt(headerValue, 10);

        if (Number.isNaN(userId) || userId < 1) {
            throw ApiError.unauthorized('Admin authentication is required');
        }

        const result = await pool.query(
            'SELECT role FROM users WHERE user_id = $1',
            [userId]
        );

        const user = result.rows[0];

        if (!user) {
            throw ApiError.unauthorized('Invalid user context');
        }

        if (user.role !== 'Admin') {
            throw ApiError.forbidden('Admin access is required');
        }

        req.authenticatedUserId = userId;
        
        next();
    } catch (err) {
        next(err);
    }
};

export default requireAdmin;