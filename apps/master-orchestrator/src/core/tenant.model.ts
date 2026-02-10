export type TenantStatus = 'active' | 'inactive' | 'suspended';
export type TenantTier = 'bronze' | 'silver' | 'gold' | 'platinum';
export type DatabaseDriver = 'postgresql' | 'mongodb' | 'mysql';

export interface EncryptedDBConfig {
    driverType: DatabaseDriver;
    encryptedCredentials: string;  // AES-256 encrypted JSON
    host: string;
    port: number;
    database: string;
}

export interface DBCredentials {
    username: string;
    password: string;
}

export interface Tenant {
    id: string;                    // UUID
    companyName: string;
    status: TenantStatus;
    tier: TenantTier;
    configDB: EncryptedDBConfig;
    features: string[];            // Módulos activos: ['ventas', 'crm', 'inventario']
    subdomain: string;             // ej: 'empresa1'
    createdAt: Date;
    updatedAt: Date;
}

export interface TenantContext {
    tenantId: string;
    timestamp: number;
}
