import { Request, Response, NextFunction } from 'express';
import AuthService from '../services/authService';

export class AuthController {
    /**
     * Handles User Registration.
     * Uses AuthService to hash passwords and save to the "User" table.
     */
    static async register(req: Request, res: Response, next: NextFunction) {
        try {
            // We pass the whole body to the service (it handles validation/hashing)
            const user = await AuthService.register(req.body);
            
            // Return 201 Created with the safe user data
            return res.status(201).json(user);
        } catch (err) {
            // Any errors (like Email Already Exists) go to your errorHandler.ts
            next(err);
        }
    }

    /**
     * Handles User Login.
     * Verifies credentials and returns a success status.
     */
    static async login(req: Request, res: Response, next: NextFunction) {
        try {
            const user = await AuthService.login(req.body);
            
            // Following your Dr.'s exact response format: { authenticated: true, user }
            return res.json({ 
                authenticated: true, 
                user 
            });
        } catch (err) {
            next(err);
        }
    }
}