export enum Role {
    SUPERADMIN = 'superadmin',  // Tú - acceso total al sistema
    ORGADMIN = 'orgadmin',      // Dueño de empresa/tenant
    USER = 'user'               // Empleado de la empresa
}

export interface Permission {
    resource: string;   // 'tenants', 'users', 'invoices', 'products'
    actions: string[];  // ['read', 'write', 'delete', 'admin']
}

export interface User {
    id: string;
    email: string;
    passwordHash: string;
    tenantId: string;
    role: Role;
    permissions: Permission[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface JWTPayload {
    userId: string;
    tenantId: string;
    role: Role;
    permissions: Permission[];
    iat?: number;
    exp?: number;
}

export interface LoginRequest {
    email: string;
    password: string;
    tenantId: string;
}

export interface LoginResponse {
    token: string;
    user: {
        id: string;
        email: string;
        role: Role;
        tenantId: string;
    };
}
