import { Request, Response, NextFunction } from 'express';
import { ScopeProvider } from '../core/scope-provider';

/**
 * Middleware para identificar el tenant desde el request
 * Soporta múltiples métodos de identificación:
 * 1. Subdomain (ej: empresa1.tuapp.com)
 * 2. Header X-Tenant-ID
 * 3. Query param ?tenantId=xxx
 */
export function tenantResolverMiddleware(req: Request, res: Response, next: NextFunction) {
    let tenantId: string | null = null;

    // Método 1: Subdomain
    const host = req.hostname;
    const subdomain = host.split('.')[0];
    if (subdomain && subdomain !== 'localhost' && subdomain !== 'www') {
        tenantId = subdomain;
    }

    // Método 2: Header
    if (!tenantId && req.headers['x-tenant-id']) {
        tenantId = req.headers['x-tenant-id'] as string;
    }

    // Método 3: Query param
    if (!tenantId && req.query.tenantId) {
        tenantId = req.query.tenantId as string;
    }

    if (!tenantId) {
        return res.status(400).json({
            error: 'Tenant ID not found',
            message: 'Please provide tenant via subdomain, X-Tenant-ID header, or tenantId query param'
        });
    }

    // Ejecutar el resto del request dentro del contexto del tenant
    ScopeProvider.run(tenantId, () => {
        next();
    });
}

/**
 * Middleware para verificar que el tenant existe y está activo
 */
export function validateTenantMiddleware(tenants: Map<string, any>) {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const tenantId = ScopeProvider.getCurrentTenant();
            const tenant = tenants.get(tenantId);

            if (!tenant) {
                return res.status(404).json({
                    error: 'Tenant not found',
                    tenantId
                });
            }

            if (tenant.status !== 'active') {
                return res.status(403).json({
                    error: 'Tenant is not active',
                    status: tenant.status
                });
            }

            // Adjuntar tenant al request para uso posterior
            (req as any).tenant = tenant;
            next();
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };
}
