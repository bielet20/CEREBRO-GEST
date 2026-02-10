import CryptoJS from 'crypto-js';
import { Tenant, EncryptedDBConfig, DBCredentials } from '../core/tenant.model';
import { DatabaseDriver, DBConnectionConfig } from '../adapters/database-driver.interface';
import { PostgreSQLAdapter } from '../adapters/postgresql.adapter';
import { MongoDBAdapter } from '../adapters/mongodb.adapter';
import { ScopeProvider } from './scope-provider';

const ENCRYPTION_KEY = process.env.DB_ENCRYPTION_KEY || 'change-this-in-production';

/**
 * Connection Manager - Gestiona conexiones dinámicas por tenant
 * Implementa el Strategy Pattern para seleccionar el adaptador correcto
 */
export class ConnectionManager {
    private static connections: Map<string, DatabaseDriver> = new Map();

    /**
     * Obtiene o crea una conexión para un tenant
     */
    static async getConnection(tenant: Tenant): Promise<DatabaseDriver> {
        const cacheKey = `${tenant.id}-${tenant.configDB.driverType}`;

        // Retornar conexión existente si está activa
        if (this.connections.has(cacheKey)) {
            const existing = this.connections.get(cacheKey)!;
            if (existing.isConnected()) {
                return existing;
            }
        }

        // Crear nueva conexión
        const driver = this.createDriver(tenant.configDB.driverType);
        const config = this.buildConnectionConfig(tenant.configDB);

        await driver.connect(config);
        this.connections.set(cacheKey, driver);

        return driver;
    }

    /**
     * Obtiene la conexión del tenant actual (desde ScopeProvider)
     */
    static async getCurrentConnection(tenants: Map<string, Tenant>): Promise<DatabaseDriver> {
        const tenantId = ScopeProvider.getCurrentTenant();
        const tenant = tenants.get(tenantId);

        if (!tenant) {
            throw new Error(`Tenant ${tenantId} not found`);
        }

        return this.getConnection(tenant);
    }

    /**
     * Crea el adaptador correcto según el driver type (Strategy Pattern)
     */
    private static createDriver(driverType: string): DatabaseDriver {
        switch (driverType) {
            case 'postgresql':
                return new PostgreSQLAdapter();
            case 'mongodb':
                return new MongoDBAdapter();
            default:
                throw new Error(`Unsupported database driver: ${driverType}`);
        }
    }

    /**
     * Construye la configuración de conexión descifrando las credenciales
     */
    private static buildConnectionConfig(encryptedConfig: EncryptedDBConfig): DBConnectionConfig {
        const credentials = this.decryptCredentials(encryptedConfig.encryptedCredentials);

        return {
            host: encryptedConfig.host,
            port: encryptedConfig.port,
            database: encryptedConfig.database,
            credentials,
            ssl: true,
            poolSize: 10,
        };
    }

    /**
     * Descifra las credenciales de la base de datos (AES-256)
     */
    static decryptCredentials(encrypted: string): DBCredentials {
        const bytes = CryptoJS.AES.decrypt(encrypted, ENCRYPTION_KEY);
        const decrypted = bytes.toString(CryptoJS.enc.Utf8);
        return JSON.parse(decrypted);
    }

    /**
     * Cifra las credenciales de la base de datos (AES-256)
     */
    static encryptCredentials(credentials: DBCredentials): string {
        const json = JSON.stringify(credentials);
        return CryptoJS.AES.encrypt(json, ENCRYPTION_KEY).toString();
    }

    /**
     * Cierra todas las conexiones
     */
    static async closeAll(): Promise<void> {
        const promises = Array.from(this.connections.values()).map(conn => conn.disconnect());
        await Promise.all(promises);
        this.connections.clear();
        console.log('All database connections closed');
    }

    /**
     * Cierra la conexión de un tenant específico
     */
    static async closeTenantConnection(tenantId: string): Promise<void> {
        const keysToRemove: string[] = [];

        for (const [key, conn] of this.connections.entries()) {
            if (key.startsWith(tenantId)) {
                await conn.disconnect();
                keysToRemove.push(key);
            }
        }

        keysToRemove.forEach(key => this.connections.delete(key));
    }
}
