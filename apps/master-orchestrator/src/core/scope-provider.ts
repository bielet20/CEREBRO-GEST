import { AsyncLocalStorage } from 'async_hooks';
import { TenantContext } from './tenant.model';

/**
 * Scope Provider - Aislamiento de seguridad por tenant
 * Garantiza que cada proceso de CPU solo acceda a las credenciales del tenant correcto
 */
export class ScopeProvider {
    private static context = new AsyncLocalStorage<TenantContext>();

    /**
     * Ejecuta un callback dentro del contexto de un tenant específico
     */
    static run<T>(tenantId: string, callback: () => T): T {
        const context: TenantContext = {
            tenantId,
            timestamp: Date.now()
        };
        return this.context.run(context, callback);
    }

    /**
     * Obtiene el tenant ID del contexto actual
     * @throws Error si no hay contexto activo
     */
    static getCurrentTenant(): string {
        const ctx = this.context.getStore();
        if (!ctx) {
            throw new Error('No tenant context found. Make sure to run operations within ScopeProvider.run()');
        }
        return ctx.tenantId;
    }

    /**
     * Verifica si hay un contexto activo
     */
    static hasContext(): boolean {
        return this.context.getStore() !== undefined;
    }

    /**
     * Obtiene el contexto completo (solo para debugging)
     */
    static getContext(): TenantContext | undefined {
        return this.context.getStore();
    }
}
