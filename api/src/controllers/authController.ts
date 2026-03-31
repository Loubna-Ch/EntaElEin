import { Request, Response, NextFunction } from 'express';
import AuthService from '../services/authService';

export class AuthController {
 
    static async register(req: Request, res: Response, next: NextFunction) {
        try {
            const user = await AuthService.register(req.body);
            
            return res.status(201).json(user);
        } catch (err) {
            next(err);
        }
    }

   
    static async login(req: Request, res: Response, next: NextFunction) {
        try {
            const user = await AuthService.login(req.body);
            
            return res.json({ 
                authenticated: true, 
                user 
            });
        } catch (err) {
            next(err);
        }
    }
}