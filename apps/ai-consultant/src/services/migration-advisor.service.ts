import { MigrationRecommendation } from '../models/ai-advanced.model.js';

interface TenantMetrics {
    dataVolume: number; // GB
    readWriteRatio: number; // 0-1 (0 = solo lectura, 1 = solo escritura)
    schemaFlexibility: 'rigid' | 'flexible';
    queryComplexity: 'simple' | 'complex';
    transactionRequirements: 'high' | 'medium' | 'low';
}

/**
 * Servicio de recomendaciones de migración de bases de datos
 * 
 * Analiza las características del tenant y recomienda la mejor BD
 */
export class MigrationAdvisorService {
    /**
     * Analiza las métricas del tenant y recomienda migración si es necesario
     * 
     * @param currentDB - Base de datos actual
     * @param metrics - Métricas del tenant
     * @returns Recomendación de migración o null si no es necesario
     */
    static analyzeMigration(
        currentDB: 'postgresql' | 'mongodb' | 'mysql',
        metrics: TenantMetrics
    ): MigrationRecommendation | null {
        const recommendation = this.determineOptimalDB(metrics);

        // Si la BD actual ya es la óptima, no recomendar migración
        if (recommendation === currentDB) {
            return null;
        }

        return this.buildRecommendation(currentDB, recommendation, metrics);
    }

    /**
     * Determina la base de datos óptima basándose en las métricas
     */
    private static determineOptimalDB(
        metrics: TenantMetrics
    ): 'postgresql' | 'mongodb' | 'mysql' {
        let score = {
            postgresql: 0,
            mongodb: 0,
            mysql: 0,
        };

        // Factor 1: Volumen de datos
        if (metrics.dataVolume > 100) {
            score.mongodb += 3; // MongoDB escala mejor horizontalmente
            score.postgresql += 2;
            score.mysql += 1;
        } else {
            score.postgresql += 2;
            score.mysql += 2;
            score.mongodb += 1;
        }

        // Factor 2: Ratio lectura/escritura
        if (metrics.readWriteRatio > 0.7) {
            // Muchas escrituras
            score.mongodb += 3;
            score.postgresql += 2;
            score.mysql += 1;
        } else {
            // Más lecturas
            score.postgresql += 3;
            score.mysql += 2;
            score.mongodb += 1;
        }

        // Factor 3: Flexibilidad del esquema
        if (metrics.schemaFlexibility === 'flexible') {
            score.mongodb += 4; // MongoDB es schema-less
            score.postgresql += 1; // PostgreSQL tiene JSONB
            score.mysql += 0;
        } else {
            score.postgresql += 3;
            score.mysql += 3;
            score.mongodb += 1;
        }

        // Factor 4: Complejidad de queries
        if (metrics.queryComplexity === 'complex') {
            score.postgresql += 4; // Mejor para JOINs complejos
            score.mysql += 2;
            score.mongodb += 1;
        } else {
            score.mongodb += 3;
            score.postgresql += 2;
            score.mysql += 2;
        }

        // Factor 5: Requerimientos de transacciones
        if (metrics.transactionRequirements === 'high') {
            score.postgresql += 4; // ACID completo
            score.mysql += 3;
            score.mongodb += 2;
        } else {
            score.mongodb += 3;
            score.postgresql += 2;
            score.mysql += 2;
        }

        // Determinar ganador
        const maxScore = Math.max(score.postgresql, score.mongodb, score.mysql);
        if (score.postgresql === maxScore) return 'postgresql';
        if (score.mongodb === maxScore) return 'mongodb';
        return 'mysql';
    }

    /**
     * Construye la recomendación completa con beneficios y riesgos
     */
    private static buildRecommendation(
        currentDB: 'postgresql' | 'mongodb' | 'mysql',
        recommendedDB: 'postgresql' | 'mongodb' | 'mysql',
        metrics: TenantMetrics
    ): MigrationRecommendation {
        const benefits = this.getBenefits(currentDB, recommendedDB, metrics);
        const risks = this.getRisks(currentDB, recommendedDB);
        const reason = this.getReason(recommendedDB, metrics);
        const confidence = this.calculateConfidence(metrics);

        return {
            currentDB,
            recommendedDB,
            reason,
            benefits,
            risks,
            confidence,
        };
    }

    /**
     * Genera la razón principal de la recomendación
     */
    private static getReason(
        recommendedDB: 'postgresql' | 'mongodb' | 'mysql',
        metrics: TenantMetrics
    ): string {
        if (recommendedDB === 'mongodb') {
            if (metrics.schemaFlexibility === 'flexible') {
                return 'MongoDB es ideal para esquemas flexibles y datos no estructurados';
            }
            if (metrics.dataVolume > 100) {
                return 'MongoDB escala mejor horizontalmente para grandes volúmenes de datos';
            }
            return 'MongoDB ofrece mejor rendimiento para tu patrón de uso';
        }

        if (recommendedDB === 'postgresql') {
            if (metrics.queryComplexity === 'complex') {
                return 'PostgreSQL es superior para queries complejas con múltiples JOINs';
            }
            if (metrics.transactionRequirements === 'high') {
                return 'PostgreSQL ofrece garantías ACID completas para transacciones críticas';
            }
            return 'PostgreSQL es la mejor opción para tu caso de uso';
        }

        return 'MySQL ofrece un buen balance entre rendimiento y simplicidad';
    }

    /**
     * Lista los beneficios de migrar
     */
    private static getBenefits(
        currentDB: string,
        recommendedDB: string,
        metrics: TenantMetrics
    ): string[] {
        const benefits: string[] = [];

        if (recommendedDB === 'mongodb') {
            benefits.push('Escalabilidad horizontal nativa');
            benefits.push('Esquema flexible sin migraciones complejas');
            benefits.push('Alto rendimiento en escrituras');
            if (metrics.dataVolume > 100) {
                benefits.push('Mejor manejo de grandes volúmenes de datos');
            }
        }

        if (recommendedDB === 'postgresql') {
            benefits.push('Queries complejas más eficientes');
            benefits.push('Garantías ACID completas');
            benefits.push('Soporte avanzado para JSON (JSONB)');
            benefits.push('Mejor para análisis y reportes');
        }

        if (recommendedDB === 'mysql') {
            benefits.push('Simplicidad y facilidad de uso');
            benefits.push('Amplia compatibilidad');
            benefits.push('Buen rendimiento general');
        }

        return benefits;
    }

    /**
     * Lista los riesgos de migrar
     */
    private static getRisks(currentDB: string, recommendedDB: string): string[] {
        return [
            'Tiempo de inactividad durante la migración',
            'Posible pérdida de datos si no se hace correctamente',
            'Necesidad de reescribir queries específicas',
            'Curva de aprendizaje para el equipo',
            `Incompatibilidades entre ${currentDB} y ${recommendedDB}`,
        ];
    }

    /**
     * Calcula el nivel de confianza de la recomendación (0-100)
     */
    private static calculateConfidence(metrics: TenantMetrics): number {
        let confidence = 50; // Base

        // Aumentar confianza si hay señales claras
        if (metrics.schemaFlexibility === 'flexible') confidence += 15;
        if (metrics.dataVolume > 100) confidence += 15;
        if (metrics.queryComplexity === 'complex') confidence += 10;
        if (metrics.transactionRequirements === 'high') confidence += 10;

        return Math.min(100, confidence);
    }
}
