import express from 'express';
import * as dotenv from 'dotenv';
import fs from 'fs-extra';
import path from 'path';
import Docker from 'dockerode';

dotenv.config();

const app = express();
const port = process.env.PORT || 3003;
const docker = new Docker();

app.use(express.json());

const DATA_ROOT = process.env.DATA_ROOT || './tenants-data';

app.post('/provision', async (req, res) => {
    const { tenantId, companyName } = req.body;

    if (!tenantId) {
        return res.status(400).json({ error: 'tenantId is required' });
    }

    const tenantDir = path.join(DATA_ROOT, tenantId);

    try {
        // 1. Create directory structure
        await fs.ensureDir(path.join(tenantDir, 'db'));
        await fs.ensureDir(path.join(tenantDir, 'uploads'));
        await fs.ensureDir(path.join(tenantDir, 'config'));

        // 2. Mock DB creation (e.g., creating a sqlite file or a config JSON)
        await fs.writeJson(path.join(tenantDir, 'config', 'tenant.json'), { tenantId, companyName, created: new Date() });

        console.log(`Provisioned environment for ${tenantId}`);

        res.json({
            status: 'success',
            message: `Environment for ${tenantId} provisioned.`,
            path: tenantDir
        });
    } catch (error) {
        console.error('Provisioning failed:', error);
        res.status(500).json({ error: 'Failed to provision environment' });
    }
});

app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

app.listen(port, () => {
    console.log(`App-Provisioner listening on port ${port}`);
});
