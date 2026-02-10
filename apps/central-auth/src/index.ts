import express from 'express';
import * as dotenv from 'dotenv';
import { AuthService } from './auth/auth.service';
import { Role } from './models/user.model';
import { authMiddleware, requirePermission, requireRole } from './middleware/auth.middleware';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

// ==================== RUTAS PÚBLICAS ====================

/**
 * Registro de usuario
 */
app.post('/api/auth/register', async (req, res) => {
    try {
        const { email, password, tenantId, role } = req.body;

        const user = await AuthService.register(email, password, tenantId, role || Role.USER);

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                tenantId: user.tenantId
            }
        });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

/**
 * Login (SSO)
 */
app.post('/api/auth/login', async (req, res) => {
    try {
        const loginResponse = await AuthService.login(req.body);
        res.json(loginResponse);
    } catch (error: any) {
        res.status(401).json({ error: error.message });
    }
});

// ==================== RUTAS PROTEGIDAS ====================

/**
 * Obtener información del usuario actual
 */
app.get('/api/auth/me', authMiddleware, (req, res) => {
    const user = (req as any).user;
    res.json({ user });
});

/**
 * Verificar token (para apps hijas)
 */
app.post('/api/auth/verify', authMiddleware, (req, res) => {
    const user = (req as any).user;
    res.json({
        valid: true,
        user
    });
});

/**
 * Listar usuarios del tenant (solo OrgAdmin o superior)
 */
app.get('/api/auth/users',
    authMiddleware,
    requireRole(Role.ORGADMIN),
    (req, res) => {
        const user = (req as any).user;
        const users = AuthService.getUsersByTenant(user.tenantId);

        res.json({
            users: users.map(u => ({
                id: u.id,
                email: u.email,
                role: u.role,
                isActive: u.isActive
            }))
        });
    }
);

/**
 * Actualizar rol de usuario (solo SuperAdmin)
 */
app.patch('/api/auth/users/:id/role',
    authMiddleware,
    requireRole(Role.SUPERADMIN),
    async (req, res) => {
        try {
            const { id } = req.params;
            const { role } = req.body;

            const updatedUser = await AuthService.updateUserRole(id, role);

            res.json({
                message: 'Role updated',
                user: {
                    id: updatedUser.id,
                    email: updatedUser.email,
                    role: updatedUser.role
                }
            });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
);

/**
 * Ejemplo de endpoint con verificación de permisos específicos
 */
app.delete('/api/auth/users/:id',
    authMiddleware,
    requirePermission('users', 'delete'),
    (req, res) => {
        const { id } = req.params;
        AuthService.deactivateUser(id);
        res.json({ message: 'User deactivated' });
    }
);

// ==================== HEALTH CHECK ====================

app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        service: 'Central Auth Service (SSO)',
        timestamp: new Date()
    });
});

// ==================== START SERVER ====================

app.listen(port, () => {
    console.log(`🔐 Central Auth Service (SSO) running on port ${port}`);
    console.log(`📝 Register: POST http://localhost:${port}/api/auth/register`);
    console.log(`🔑 Login: POST http://localhost:${port}/api/auth/login`);
});
