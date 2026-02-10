import { Role, Permission } from '../models/user.model';

/**
 * Servicio RBAC - Control de acceso basado en roles
 */
export class RBACService {
    /**
     * Permisos predefinidos por rol
     */
    private static rolePermissions: Record<Role, Permission[]> = {
        [Role.SUPERADMIN]: [
            { resource: '*', actions: ['*'] }  // Acceso total
        ],
        [Role.ORGADMIN]: [
            { resource: 'users', actions: ['read', 'write', 'delete'] },
            { resource: 'products', actions: ['read', 'write', 'delete'] },
            { resource: 'invoices', actions: ['read', 'write', 'delete'] },
            { resource: 'reports', actions: ['read', 'write'] },
            { resource: 'settings', actions: ['read', 'write'] }
        ],
        [Role.USER]: [
            { resource: 'products', actions: ['read'] },
            { resource: 'invoices', actions: ['read', 'write'] },
            { resource: 'reports', actions: ['read'] }
        ]
    };

    /**
     * Obtiene los permisos de un rol
     */
    static getPermissionsForRole(role: Role): Permission[] {
        return this.rolePermissions[role] || [];
    }

    /**
     * Verifica si un rol tiene permiso para una acción en un recurso
     */
    static hasPermission(
        userPermissions: Permission[],
        resource: string,
        action: string
    ): boolean {
        // SuperAdmin tiene acceso total
        if (userPermissions.some(p => p.resource === '*' && p.actions.includes('*'))) {
            return true;
        }

        // Buscar permiso específico
        return userPermissions.some(permission => {
            const resourceMatch = permission.resource === resource || permission.resource === '*';
            const actionMatch = permission.actions.includes(action) || permission.actions.includes('*');
            return resourceMatch && actionMatch;
        });
    }

    /**
     * Middleware helper para verificar permisos
     */
    static requirePermission(resource: string, action: string) {
        return (userPermissions: Permission[]) => {
            if (!this.hasPermission(userPermissions, resource, action)) {
                throw new Error(`Permission denied: ${action} on ${resource}`);
            }
        };
    }

    /**
     * Verifica si un rol es superior a otro (para jerarquía)
     */
    static isRoleHigherOrEqual(userRole: Role, requiredRole: Role): boolean {
        const hierarchy = {
            [Role.SUPERADMIN]: 3,
            [Role.ORGADMIN]: 2,
            [Role.USER]: 1
        };

        return hierarchy[userRole] >= hierarchy[requiredRole];
    }
}
