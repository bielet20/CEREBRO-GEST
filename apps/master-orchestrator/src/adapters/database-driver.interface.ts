import { DBCredentials } from '../core/tenant.model';

/**
 * Interface para el Strategy Pattern de bases de datos
 * Cada adaptador implementa esta interfaz
 */
export interface DatabaseDriver {
    connect(config: DBConnectionConfig): Promise<void>;
    disconnect(): Promise<void>;
    query(sql: string, params?: any[]): Promise<any>;
    transaction<T>(callback: (client: any) => Promise<T>): Promise<T>;
    isConnected(): boolean;
}

export interface DBConnectionConfig {
    host: string;
    port: number;
    database: string;
    credentials: DBCredentials;
    ssl?: boolean;
    poolSize?: number;
}
