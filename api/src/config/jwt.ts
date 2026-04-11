import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_ACCESS_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRATION || '1h';
const JWT_ISSUER = process.env.JWT_ISSUER || 'enta-el-ein-api';

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
}

/**
 * Generates a signed JWT access token for a given user payload.
 * @param {any} payload - The user identity data.
 */
export const signAccessToken = (payload: any): string => {
    return jwt.sign(
        { id: payload.id, email: payload.email, userType: payload.userType },
        JWT_SECRET,
        { 
            expiresIn: JWT_EXPIRES_IN as any, 
            issuer: JWT_ISSUER 
        }
    );
};

/**
 * Verifies a JWT access token and decodes its payload.
 * @param {string} token - The JWT string to verify.
 */
export const verifyAccessToken = (token: string): any => {
    return jwt.verify(token, JWT_SECRET, { issuer: JWT_ISSUER });
};