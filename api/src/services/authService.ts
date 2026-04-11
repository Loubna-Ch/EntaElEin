import bcrypt from "bcryptjs";
import { UserRepository } from "../repositories/userRepository";
import { ApiError } from "../middlewares/ApiError";
import jwt from "jsonwebtoken";

const SALT_ROUNDS = 10;
const ALLOWED_ROLES = new Set(["Admin", "Officer", "Citizen"]);

class AuthService {
    static async register(
        {
            username,
            email,
            password,
            role,
            phonenumber,
            address,
            dateofbirth,
            regionid,
        }: any,
    ) {
        const existing = await UserRepository.findByEmail(email);
        if (existing) {
            throw ApiError.conflict("Email already registered", {
                email: "Email is already in use",
            });
        }

        const normalizedRole = (role || "Citizen").toLowerCase();
        if (!ALLOWED_ROLES.has(normalizedRole)) {
            throw ApiError.badRequest(
                "Role must be admin, officer, or citizen",
            );
        }

        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        return await UserRepository.create({
            username,
            email,
            password: hashedPassword,
            phonenumber,
            address,
            dateofbirth,
            role: normalizedRole,
            regionid,
        });
    }

    static async login({ email, password }: any) {
        const user = await UserRepository.findByEmail(email);
        if (!user) {
            throw ApiError.unauthorized("Invalid email or password.");
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            throw ApiError.unauthorized("Invalid email or password.");
        }

        const payload = { id: user.id, role: user.role };

        const accessToken = jwt.sign(
            payload,
            process.env.JWT_ACCESS_SECRET!,
            { expiresIn: process.env.JWT_ACCESS_EXPIRATION as any},
        );

        // 3. Generate Refresh Token
        const refreshToken = jwt.sign(
            payload,
            process.env.JWT_REFRESH_SECRET!,
            { expiresIn: process.env.JWT_REFRESH_EXPIRATION as any},
        );

        const { password: _, ...safeUser } = user;

        return { user: safeUser, accessToken, refreshToken };
    }
}

export default AuthService;
