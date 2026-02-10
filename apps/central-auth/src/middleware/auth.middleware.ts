import { Request, Response, NextFunction } from 'express';
import { JWTService } from '../auth/jwt.service';
import { RBACService } from '../auth/rbac.service';

/**
 * Middleware para verificar JWT en requests
 */
export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const token = authHeader.substring(7);
        const payload = JWTService.verifyToken(token);

        // Adjuntar payload al request
        (req as any).user = payload;
        next();
    } catch (error: any) {
        res.status(401).json({ error: error.message });
    }
}

/**
 * Middleware para verificar permisos específicos
 */
export function requirePermission(resource: string, action: string) {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = (req as any).user;

            if (!user) {
                return res.status(401).json({ error: 'Not authenticated' });
            }

            if (!RBACService.hasPermission(user.permissions, resource, action)) {
                return res.status(403).json({
                    error: 'Permission denied',
                    required: `${action} on ${resource}`
                });
            }

            next();
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };
}

/**
 * Middleware para verificar rol mínimo
 */
export function requireRole(minRole: string) {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = (req as any).user;

        if (!user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        if (!RBACService.isRoleHigherOrEqual(user.role, minRole as any)) {
            return res.status(403).json({
                error: 'Insufficient role',
                required: minRole,
                current: user.role
            });
        }

        next();
    };
}
