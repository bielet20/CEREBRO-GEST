import jwt from 'jsonwebtoken';
import { JWTPayload, User } from '../models/user.model';

const JWT_SECRET = process.env.JWT_SECRET || 'change-this-secret-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '8h';

/**
 * Servicio de JWT - Generación y validación de tokens
 */
export class JWTService {
    /**
     * Genera un JWT con los permisos del usuario en el payload
     */
    static generateToken(user: User): string {
        const payload: JWTPayload = {
            userId: user.id,
            tenantId: user.tenantId,
            role: user.role,
            permissions: user.permissions
        };

        return jwt.sign(payload, JWT_SECRET, {
            expiresIn: JWT_EXPIRES_IN
        });
    }

    /**
     * Verifica y decodifica un JWT
     */
    static verifyToken(token: string): JWTPayload {
        try {
            return jwt.verify(token, JWT_SECRET) as JWTPayload;
        } catch (error) {
            throw new Error('Invalid or expired token');
        }
    }

    /**
     * Decodifica un JWT sin verificar (útil para debugging)
     */
    static decodeToken(token: string): JWTPayload | null {
        return jwt.decode(token) as JWTPayload | null;
    }

    /**
     * Verifica si un token ha expirado
     */
    static isTokenExpired(token: string): boolean {
        const decoded = this.decodeToken(token);
        if (!decoded || !decoded.exp) return true;
        return Date.now() >= decoded.exp * 1000;
    }
}
