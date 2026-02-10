import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { User, Role, LoginRequest, LoginResponse } from '../models/user.model';
import { JWTService } from './jwt.service';
import { RBACService } from './rbac.service';

const SALT_ROUNDS = 10;

/**
 * Servicio de autenticación centralizado (SSO)
 */
export class AuthService {
    // Simulación de almacenamiento (en producción sería una DB)
    private static users: Map<string, User> = new Map();

    /**
     * Registra un nuevo usuario
     */
    static async register(
        email: string,
        password: string,
        tenantId: string,
        role: Role = Role.USER
    ): Promise<User> {
        // Verificar si el usuario ya existe
        const existing = Array.from(this.users.values()).find(
            u => u.email === email && u.tenantId === tenantId
        );

        if (existing) {
            throw new Error('User already exists');
        }

        // Hash de la contraseña
        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

        // Crear usuario
        const user: User = {
            id: uuidv4(),
            email,
            passwordHash,
            tenantId,
            role,
            permissions: RBACService.getPermissionsForRole(role),
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        this.users.set(user.id, user);
        return user;
    }

    /**
     * Login de usuario
     */
    static async login(request: LoginRequest): Promise<LoginResponse> {
        // Buscar usuario
        const user = Array.from(this.users.values()).find(
            u => u.email === request.email && u.tenantId === request.tenantId
        );

        if (!user) {
            throw new Error('Invalid credentials');
        }

        if (!user.isActive) {
            throw new Error('User account is inactive');
        }

        // Verificar contraseña
        const isValid = await bcrypt.compare(request.password, user.passwordHash);
        if (!isValid) {
            throw new Error('Invalid credentials');
        }

        // Generar JWT
        const token = JWTService.generateToken(user);

        return {
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                tenantId: user.tenantId
            }
        };
    }

    /**
     * Obtiene un usuario por ID
     */
    static getUserById(userId: string): User | undefined {
        return this.users.get(userId);
    }

    /**
     * Actualiza el rol de un usuario
     */
    static async updateUserRole(userId: string, newRole: Role): Promise<User> {
        const user = this.users.get(userId);
        if (!user) {
            throw new Error('User not found');
        }

        user.role = newRole;
        user.permissions = RBACService.getPermissionsForRole(newRole);
        user.updatedAt = new Date();

        return user;
    }

    /**
     * Desactiva un usuario
     */
    static deactivateUser(userId: string): void {
        const user = this.users.get(userId);
        if (user) {
            user.isActive = false;
            user.updatedAt = new Date();
        }
    }

    /**
     * Lista todos los usuarios de un tenant
     */
    static getUsersByTenant(tenantId: string): User[] {
        return Array.from(this.users.values()).filter(u => u.tenantId === tenantId);
    }
}
