import express from 'express';
import * as dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import { Tenant } from './core/tenant.model';
import { ConnectionManager } from './core/connection-manager';
import { ScopeProvider } from './core/scope-provider';
import { tenantResolverMiddleware, validateTenantMiddleware } from './middleware/tenant-resolver.middleware';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Simulación de almacenamiento de tenants (en producción sería una DB maestra)
const tenants: Map<string, Tenant> = new Map();

// ==================== RUTAS ADMINISTRATIVAS ====================

/**
 * Crear un nuevo tenant (Provisioning)
 */
app.post('/api/admin/tenants/provision', async (req, res) => {
    try {
        const { companyName, tier, driverType, dbHost, dbPort, dbName, dbUsername, dbPassword } = req.body;

        const tenant: Tenant = {
            id: uuidv4(),
            companyName,
            status: 'active',
            tier: tier || 'bronze',
            subdomain: companyName.toLowerCase().replace(/\s+/g, '-'),
            features: [],
            configDB: {
                driverType,
                host: dbHost,
                port: dbPort,
                database: dbName,
                encryptedCredentials: ConnectionManager.encryptCredentials({
                    username: dbUsername,
                    password: dbPassword
                })
            },
            createdAt: new Date(),
            updatedAt: new Date()
        };

        tenants.set(tenant.id, tenant);

        // Test de conexión
        await ConnectionManager.getConnection(tenant);

        res.status(201).json({
            message: 'Tenant provisioned successfully',
            tenant: {
                id: tenant.id,
                companyName: tenant.companyName,
                subdomain: tenant.subdomain,
                tier: tenant.tier
            }
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * Listar todos los tenants
 */
app.get('/api/admin/tenants', (req, res) => {
    const tenantList = Array.from(tenants.values()).map(t => ({
        id: t.id,
        companyName: t.companyName,
        subdomain: t.subdomain,
        status: t.status,
        tier: t.tier,
        features: t.features,
        createdAt: t.createdAt
    }));

    res.json({ tenants: tenantList });
});

/**
 * Activar/Desactivar features de un tenant
 */
app.patch('/api/admin/tenants/:id/features', (req, res) => {
    const { id } = req.params;
    const { features } = req.body;

    const tenant = tenants.get(id);
    if (!tenant) {
        return res.status(404).json({ error: 'Tenant not found' });
    }

    tenant.features = features;
    tenant.updatedAt = new Date();

    res.json({ message: 'Features updated', features: tenant.features });
});

// ==================== RUTAS DE TENANT (Multi-tenant) ====================

// Aplicar middlewares de tenant
app.use('/api/tenant', tenantResolverMiddleware);
app.use('/api/tenant', validateTenantMiddleware(tenants));

/**
 * Ejemplo de endpoint multi-tenant
 */
app.get('/api/tenant/info', (req, res) => {
    const tenant = (req as any).tenant;
    res.json({
        message: `Welcome to ${tenant.companyName}`,
        tier: tenant.tier,
        features: tenant.features
    });
});

/**
 * Ejemplo de query a la DB del tenant
 */
app.get('/api/tenant/data', async (req, res) => {
    try {
        const tenant = (req as any).tenant;
        const connection = await ConnectionManager.getConnection(tenant);

        // Ejemplo de query (ajustar según el driver)
        let data;
        if (tenant.configDB.driverType === 'postgresql') {
            data = await connection.query('SELECT NOW() as current_time');
        } else {
            data = { message: 'MongoDB query example' };
        }

        res.json({ data });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// ==================== HEALTH CHECK ====================

app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        tenants: tenants.size,
        timestamp: new Date()
    });
});

// ==================== GRACEFUL SHUTDOWN ====================

process.on('SIGTERM', async () => {
    console.log('SIGTERM received, closing connections...');
    await ConnectionManager.closeAll();
    process.exit(0);
});

// ==================== START SERVER ====================

app.listen(port, () => {
    console.log(`🚀 Master Orchestrator running on port ${port}`);
    console.log(`📊 Admin API: http://localhost:${port}/api/admin`);
    console.log(`🏢 Tenant API: http://localhost:${port}/api/tenant`);
});
