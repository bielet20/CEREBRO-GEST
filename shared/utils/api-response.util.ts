import { APIResponse, APIMetadata, ErrorCode } from '../contracts/api-response.contract';

const APP_VERSION = '1.0.0';

/**
 * Crea una respuesta API exitosa estandarizada
 * 
 * @param data - Datos de la respuesta
 * @param tenantId - ID del tenant
 * @param dbType - Tipo de base de datos utilizada
 * @returns Respuesta API formateada
 */
export function createSuccessResponse<T>(
    data: T,
    tenantId: string,
    dbType: 'postgresql' | 'mongodb' | 'mysql'
): APIResponse<T> {
    return {
        status: 'success',
        data,
        meta: createMetadata(tenantId, dbType),
    };
}

/**
 * Crea una respuesta API de error estandarizada
 * 
 * @param code - Código de error del enum ErrorCode
 * @param message - Mensaje descriptivo del error
 * @param tenantId - ID del tenant
 * @param dbType - Tipo de base de datos
 * @param details - Detalles adicionales opcionales
 * @returns Respuesta API de error formateada
 */
export function createErrorResponse(
    code: ErrorCode,
    message: string,
    tenantId: string,
    dbType: 'postgresql' | 'mongodb' | 'mysql',
    details?: Record<string, any>
): APIResponse {
    return {
        status: 'error',
        meta: createMetadata(tenantId, dbType),
        error: {
            code,
            message,
            details,
        },
    };
}

/**
 * Crea los metadatos estándar para respuestas API
 */
function createMetadata(
    tenantId: string,
    dbType: 'postgresql' | 'mongodb' | 'mysql'
): APIMetadata {
    return {
        tenantId,
        dbType,
        version: APP_VERSION,
        timestamp: new Date().toISOString(),
    };
}
