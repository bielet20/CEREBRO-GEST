import { MongoClient, Db } from 'mongodb';
import { DatabaseDriver, DBConnectionConfig } from './database-driver.interface';

/**
 * Adaptador MongoDB - Implementación del Strategy Pattern
 */
export class MongoDBAdapter implements DatabaseDriver {
    private client: MongoClient | null = null;
    private db: Db | null = null;
    private config: DBConnectionConfig | null = null;

    async connect(config: DBConnectionConfig): Promise<void> {
        this.config = config;

        const uri = `mongodb://${config.credentials.username}:${config.credentials.password}@${config.host}:${config.port}/${config.database}`;

        this.client = new MongoClient(uri, {
            maxPoolSize: config.poolSize || 10,
        });

        await this.client.connect();
        this.db = this.client.db(config.database);

        // Test connection
        await this.db.admin().ping();
        console.log(`✅ MongoDB connected: ${config.database}@${config.host}`);
    }

    async disconnect(): Promise<void> {
        if (this.client) {
            await this.client.close();
            this.client = null;
            this.db = null;
            console.log('MongoDB disconnected');
        }
    }

    async query(collectionName: string, filter?: any): Promise<any> {
        if (!this.db) {
            throw new Error('MongoDB not connected');
        }
        const collection = this.db.collection(collectionName);
        return await collection.find(filter || {}).toArray();
    }

    async transaction<T>(callback: (session: any) => Promise<T>): Promise<T> {
        if (!this.client) {
            throw new Error('MongoDB not connected');
        }

        const session = this.client.startSession();
        try {
            session.startTransaction();
            const result = await callback(session);
            await session.commitTransaction();
            return result;
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            await session.endSession();
        }
    }

    isConnected(): boolean {
        return this.client !== null && this.db !== null;
    }

    /**
     * Helper específico de MongoDB para obtener la instancia de DB
     */
    getDatabase(): Db {
        if (!this.db) {
            throw new Error('MongoDB not connected');
        }
        return this.db;
    }
}
