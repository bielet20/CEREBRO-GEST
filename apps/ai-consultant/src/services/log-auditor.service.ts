import { LogEntry, AuditResult } from '../models/ai-advanced.model.js';

/**
 * Servicio de auditoría automática de logs de base de datos
 * 
 * Analiza los logs de queries para detectar:
 * - Queries lentas
 * - Patrones ineficientes
 * - Uso excesivo de recursos
 */
export class LogAuditorService {
    private static SLOW_QUERY_THRESHOLD_MS = 500;
    private static HEALTH_SCORE_WEIGHTS = {
        avgExecutionTime: 0.4,
        slowQueriesRatio: 0.3,
        totalQueries: 0.3,
    };

    /**
     * Audita los logs de un tenant y genera recomendaciones
     * 
     * @param logs - Array de entradas de log
     * @returns Resultado de la auditoría con recomendaciones
     */
    static auditLogs(logs: LogEntry[]): AuditResult {
        if (logs.length === 0) {
            return {
                tenantId: 'unknown',
                totalQueries: 0,
                avgExecutionTime: 0,
                slowQueries: [],
                recommendations: ['No hay logs disponibles para analizar'],
                healthScore: 100,
            };
        }

        const tenantId = logs[0].tenantId;
        const totalQueries = logs.length;
        const avgExecutionTime = this.calculateAvgExecutionTime(logs);
        const slowQueries = this.findSlowQueries(logs);
        const recommendations = this.generateRecommendations(logs, avgExecutionTime, slowQueries);
        const healthScore = this.calculateHealthScore(logs, avgExecutionTime, slowQueries);

        return {
            tenantId,
            totalQueries,
            avgExecutionTime,
            slowQueries,
            recommendations,
            healthScore,
        };
    }

    /**
     * Calcula el tiempo promedio de ejecución
     */
    private static calculateAvgExecutionTime(logs: LogEntry[]): number {
        const total = logs.reduce((sum, log) => sum + log.executionTime, 0);
        return Math.round(total / logs.length);
    }

    /**
     * Encuentra queries que exceden el umbral de tiempo
     */
    private static findSlowQueries(logs: LogEntry[]): LogEntry[] {
        return logs
            .filter(log => log.executionTime > this.SLOW_QUERY_THRESHOLD_MS)
            .sort((a, b) => b.executionTime - a.executionTime)
            .slice(0, 10); // Top 10 queries más lentas
    }

    /**
     * Genera recomendaciones basadas en el análisis
     */
    private static generateRecommendations(
        logs: LogEntry[],
        avgExecutionTime: number,
        slowQueries: LogEntry[]
    ): string[] {
        const recommendations: string[] = [];

        // Recomendación por tiempo promedio alto
        if (avgExecutionTime > 200) {
            recommendations.push(
                `⚠️ Tiempo promedio de ejecución alto (${avgExecutionTime}ms). Considera añadir índices a las tablas más consultadas.`
            );
        }

        // Recomendación por queries lentas
        if (slowQueries.length > 0) {
            recommendations.push(
                `🐌 Se detectaron ${slowQueries.length} queries lentas. Revisa las queries que tardan más de ${this.SLOW_QUERY_THRESHOLD_MS}ms.`
            );
        }

        // Recomendación por volumen alto
        if (logs.length > 10000) {
            recommendations.push(
                `📊 Alto volumen de queries (${logs.length}). Considera implementar caché para reducir la carga en la base de datos.`
            );
        }

        // Detección de N+1 queries
        const potentialNPlusOne = this.detectNPlusOnePattern(logs);
        if (potentialNPlusOne) {
            recommendations.push(
                `🔄 Posible patrón N+1 detectado. Considera usar JOINs o eager loading para optimizar.`
            );
        }

        // Recomendación por falta de índices
        const missingIndexes = this.detectMissingIndexes(logs);
        if (missingIndexes.length > 0) {
            recommendations.push(
                `🔍 Posibles índices faltantes en: ${missingIndexes.join(', ')}`
            );
        }

        if (recommendations.length === 0) {
            recommendations.push('✅ Todo se ve bien. No se detectaron problemas significativos.');
        }

        return recommendations;
    }

    /**
     * Detecta patrón N+1 (muchas queries similares en corto tiempo)
     */
    private static detectNPlusOnePattern(logs: LogEntry[]): boolean {
        const queryPatterns = new Map<string, number>();

        logs.forEach(log => {
            // Simplificar query para detectar patrones
            const pattern = log.query.replace(/\d+/g, '?').substring(0, 50);
            queryPatterns.set(pattern, (queryPatterns.get(pattern) || 0) + 1);
        });

        // Si algún patrón se repite más de 10 veces, es sospechoso
        return Array.from(queryPatterns.values()).some(count => count > 10);
    }

    /**
     * Detecta posibles índices faltantes basándose en queries lentas
     */
    private static detectMissingIndexes(logs: LogEntry[]): string[] {
        const slowQueries = logs.filter(log => log.executionTime > this.SLOW_QUERY_THRESHOLD_MS);
        const tables = new Set<string>();

        slowQueries.forEach(log => {
            // Extraer nombres de tablas de las queries (simplificado)
            const matches = log.query.match(/FROM\s+(\w+)/gi);
            if (matches) {
                matches.forEach((match: string) => {
                    const table = match.replace(/FROM\s+/i, '');
                    tables.add(table);
                });
            }
        });

        return Array.from(tables);
    }

    /**
     * Calcula un score de salud (0-100)
     */
    private static calculateHealthScore(
        logs: LogEntry[],
        avgExecutionTime: number,
        slowQueries: LogEntry[]
    ): number {
        // Score basado en tiempo promedio (0-100, invertido)
        const timeScore = Math.max(0, 100 - (avgExecutionTime / 10));

        // Score basado en ratio de queries lentas
        const slowQueriesRatio = slowQueries.length / logs.length;
        const slowQueriesScore = Math.max(0, 100 - (slowQueriesRatio * 200));

        // Score basado en volumen (penalizar volumen muy alto)
        const volumeScore = logs.length > 10000 ? 70 : 100;

        // Promedio ponderado
        const healthScore =
            timeScore * this.HEALTH_SCORE_WEIGHTS.avgExecutionTime +
            slowQueriesScore * this.HEALTH_SCORE_WEIGHTS.slowQueriesRatio +
            volumeScore * this.HEALTH_SCORE_WEIGHTS.totalQueries;

        return Math.round(healthScore);
    }
}
