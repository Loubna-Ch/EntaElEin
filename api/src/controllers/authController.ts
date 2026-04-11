import { NextFunction, Request, Response } from "express";
import AuthService from "../services/authService";

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
            const { user, accessToken, refreshToken } = await AuthService.login(
                req.body,
            );

            // Set refresh token in an HTTP-only cookie (Secure Choice)
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production", // true in production
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            });

            return res.json({
                authenticated: true,
                accessToken, // Postman will grab this
                user,
            });
        } catch (err) {
            next(err);
        }
    }
}
