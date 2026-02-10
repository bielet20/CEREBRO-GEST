import { Pool, PoolClient } from 'pg';
import { DatabaseDriver, DBConnectionConfig } from './database-driver.interface';

/**
 * Adaptador PostgreSQL - Implementación del Strategy Pattern
 */
export class PostgreSQLAdapter implements DatabaseDriver {
    private pool: Pool | null = null;
    private config: DBConnectionConfig | null = null;

    async connect(config: DBConnectionConfig): Promise<void> {
        this.config = config;
        this.pool = new Pool({
            host: config.host,
            port: config.port,
            database: config.database,
            user: config.credentials.username,
            password: config.credentials.password,
            ssl: config.ssl ? { rejectUnauthorized: false } : false,
            max: config.poolSize || 10,
        });

        // Test connection
        const client = await this.pool.connect();
        client.release();
        console.log(`✅ PostgreSQL connected: ${config.database}@${config.host}`);
    }

    async disconnect(): Promise<void> {
        if (this.pool) {
            await this.pool.end();
            this.pool = null;
            console.log('PostgreSQL disconnected');
        }
    }

    async query(sql: string, params?: any[]): Promise<any> {
        if (!this.pool) {
            throw new Error('PostgreSQL not connected');
        }
        const result = await this.pool.query(sql, params);
        return result.rows;
    }

    async transaction<T>(callback: (client: PoolClient) => Promise<T>): Promise<T> {
        if (!this.pool) {
            throw new Error('PostgreSQL not connected');
        }

        const client = await this.pool.connect();
        try {
            await client.query('BEGIN');
            const result = await callback(client);
            await client.query('COMMIT');
            return result;
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    isConnected(): boolean {
        return this.pool !== null;
    }
}
