import express from 'express';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import { LogAuditorService } from './services/log-auditor.service';
import { MigrationAdvisorService } from './services/migration-advisor.service';
import { GUIGeneratorService } from './services/gui-generator.service';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

app.use(express.json());

/**
 * Endpoint de análisis de requerimientos con OpenAI
 */
app.post('/api/analyze', async (req, res) => {
    try {
        const { requirements } = req.body;

        if (!requirements) {
            return res.status(400).json({ error: 'Requirements are required' });
        }

        const prompt = `
Eres un consultor técnico experto en arquitectura de software.

Analiza los siguientes requerimientos y recomienda el stack tecnológico óptimo:

${requirements}

Considera estos factores:
1. Volumen de datos esperado
2. Nivel de concurrencia
3. Tipo de estructura de datos
4. Nivel de compliance requerido

Responde en formato JSON con esta estructura:
{
  "recommendedStack": {
    "database": "postgresql | mongodb | mysql",
    "backend": "node.js | python | java",
    "frontend": "react | vue | angular"
  },
  "reasoning": "Explicación detallada de por qué esta combinación",
  "alternatives": ["Otras opciones viables"],
  "estimatedCost": "Estimación de costos mensuales"
}
`;

        const completion = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.7,
        });

        const analysis = JSON.parse(completion.choices[0]?.message?.content || '{}');

        res.json({
            status: 'success',
            analysis,
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * Endpoint de auditoría de logs
 */
app.post('/api/audit-logs', async (req, res) => {
    try {
        const { logs } = req.body;

        if (!logs || !Array.isArray(logs)) {
            return res.status(400).json({ error: 'Logs array is required' });
        }

        const auditResult = LogAuditorService.auditLogs(logs);

        res.json({
            status: 'success',
            audit: auditResult,
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * Endpoint de recomendaciones de migración
 */
app.post('/api/migration-advice', async (req, res) => {
    try {
        const { currentDB, metrics } = req.body;

        if (!currentDB || !metrics) {
            return res.status(400).json({ error: 'currentDB and metrics are required' });
        }

        const recommendation = MigrationAdvisorService.analyzeMigration(currentDB, metrics);

        if (!recommendation) {
            return res.json({
                status: 'success',
                message: 'Tu base de datos actual es óptima para tu caso de uso',
                recommendation: null,
            });
        }

        res.json({
            status: 'success',
            recommendation,
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * Endpoint de generador de GUI
 */
app.post('/api/generate-gui', async (req, res) => {
    try {
        const { industry } = req.body;

        if (!industry) {
            return res.status(400).json({ error: 'Industry is required' });
        }

        const guiConfig = GUIGeneratorService.generateGUIConfig(industry);

        res.json({
            status: 'success',
            guiConfig,
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * Health check
 */
app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'ai-consultant' });
});

app.listen(PORT, () => {
    console.log(`🤖 AI Consultant Service running on port ${PORT}`);
    console.log(`📊 Available endpoints:`);
    console.log(`   POST /api/analyze - Análisis de requerimientos`);
    console.log(`   POST /api/audit-logs - Auditoría de logs`);
    console.log(`   POST /api/migration-advice - Recomendaciones de migración`);
    console.log(`   POST /api/generate-gui - Generador de GUI`);
});
