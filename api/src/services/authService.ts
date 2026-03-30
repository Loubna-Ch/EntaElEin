import bcrypt from 'bcryptjs';
import { UserRepository } from '../repositories/userRepository';
import { ApiError } from '../middlewares/ApiError';

const SALT_ROUNDS = 10;
const ALLOWED_ROLES = new Set(['admin', 'officer', 'citizen']);

class AuthService {
    static async register({ username, email, password, role, phonenumber, address, dateofbirth, regionid }: any) {
        const existing = await UserRepository.findByEmail(email);
        if (existing) {
            throw ApiError.conflict('Email already registered', { email: 'Email is already in use' });
        }

        const normalizedRole = (role || 'Citizen').toLowerCase();
        if (!ALLOWED_ROLES.has(normalizedRole)) {
            throw ApiError.badRequest('Role must be admin, officer, or citizen');
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
            regionid
        });
    }

    static async login({ email, password }: any) {
        const user = await UserRepository.findByEmail(email);
        if (!user) {
            throw ApiError.unauthorized('Invalid email or password.');
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            throw ApiError.unauthorized('Invalid email or password.');
        }

        const { password: _, ...safeUser } = user;
        return safeUser;
    }
}

export default AuthService;