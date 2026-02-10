export interface APIResponse<T = any> {
    status: 'success' | 'error';
    data?: T;
    meta: APIMetadata;
    error?: APIError;
}

export interface APIMetadata {
    tenantId: string;
    dbType: 'postgresql' | 'mongodb' | 'mysql';
    version: string;
    timestamp: string;
}

export interface APIError {
    code: string;
    message: string;
    details?: Record<string, any>;
}

export enum ErrorCode {
    // Auth errors
    ERR_AUTH_001 = 'ERR_AUTH_001', // Token inválido o expirado
    ERR_AUTH_002 = 'ERR_AUTH_002', // Credenciales incorrectas

    // Permission errors
    ERR_PERM_001 = 'ERR_PERM_001', // Permiso denegado

    // Database errors
    ERR_DB_001 = 'ERR_DB_001', // Error de conexión
    ERR_DB_002 = 'ERR_DB_002', // Query fallida

    // Tenant errors
    ERR_TENANT_001 = 'ERR_TENANT_001', // Tenant no encontrado
    ERR_TENANT_002 = 'ERR_TENANT_002', // Tenant inactivo

    // Validation errors
    ERR_VAL_001 = 'ERR_VAL_001', // Datos de entrada inválidos
}
