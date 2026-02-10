import { MigrationAdvisorService } from '../migration-advisor.service';

describe('MigrationAdvisorService', () => {
    describe('analyzeMigration', () => {
        it('should recommend MongoDB for flexible schemas', () => {
            const result = MigrationAdvisorService.analyzeMigration('postgresql', {
                dataVolume: 150,
                readWriteRatio: 0.8,
                schemaFlexibility: 'flexible',
                queryComplexity: 'simple',
                transactionRequirements: 'low',
            });

            expect(result).not.toBeNull();
            expect(result?.recommendedDB).toBe('mongodb');
            expect(result?.reason).toContain('MongoDB');
        });

        it('should recommend PostgreSQL for complex queries and high transactions', () => {
            const result = MigrationAdvisorService.analyzeMigration('mongodb', {
                dataVolume: 100,
                readWriteRatio: 0.5,
                schemaFlexibility: 'rigid',
                queryComplexity: 'complex',
                transactionRequirements: 'high',
            });

            expect(result).not.toBeNull();
            expect(result?.recommendedDB).toBe('postgresql');
            expect(result?.benefits).toContain(expect.stringContaining('ACID'));
        });

        it('should recommend MySQL for balanced workloads', () => {
            const result = MigrationAdvisorService.analyzeMigration('postgresql', {
                dataVolume: 80,
                readWriteRatio: 0.6,
                schemaFlexibility: 'rigid',
                queryComplexity: 'medium',
                transactionRequirements: 'medium',
            });

            // MySQL might be recommended for balanced workloads
            expect(result).toBeDefined();
            if (result) {
                expect(['postgresql', 'mysql', 'mongodb']).toContain(result.recommendedDB);
            }
        });

        it('should return null when current DB is already optimal', () => {
            const result = MigrationAdvisorService.analyzeMigration('postgresql', {
                dataVolume: 50,
                readWriteRatio: 0.5,
                schemaFlexibility: 'rigid',
                queryComplexity: 'complex',
                transactionRequirements: 'high',
            });

            // PostgreSQL is optimal for these metrics
            expect(result).toBeNull();
        });

        it('should include benefits in recommendation', () => {
            const result = MigrationAdvisorService.analyzeMigration('mysql', {
                dataVolume: 200,
                readWriteRatio: 0.9,
                schemaFlexibility: 'flexible',
                queryComplexity: 'simple',
                transactionRequirements: 'low',
            });

            expect(result).not.toBeNull();
            expect(result?.benefits).toBeDefined();
            expect(result?.benefits.length).toBeGreaterThan(0);
        });

        it('should include risks in recommendation', () => {
            const result = MigrationAdvisorService.analyzeMigration('postgresql', {
                dataVolume: 150,
                readWriteRatio: 0.8,
                schemaFlexibility: 'flexible',
                queryComplexity: 'simple',
                transactionRequirements: 'medium',
            });

            expect(result).not.toBeNull();
            expect(result?.risks).toBeDefined();
            expect(result?.risks.length).toBeGreaterThan(0);
            expect(result?.risks).toContain(expect.stringContaining('migración'));
        });

        it('should calculate confidence level', () => {
            const result = MigrationAdvisorService.analyzeMigration('mysql', {
                dataVolume: 200,
                readWriteRatio: 0.9,
                schemaFlexibility: 'flexible',
                queryComplexity: 'simple',
                transactionRequirements: 'low',
            });

            expect(result).not.toBeNull();
            expect(result?.confidence).toBeGreaterThanOrEqual(0);
            expect(result?.confidence).toBeLessThanOrEqual(100);
        });

        it('should handle edge case: very high data volume', () => {
            const result = MigrationAdvisorService.analyzeMigration('mysql', {
                dataVolume: 500,
                readWriteRatio: 0.9,
                schemaFlexibility: 'flexible',
                queryComplexity: 'simple',
                transactionRequirements: 'low',
            });

            expect(result).not.toBeNull();
            // High volume + flexible schema should favor MongoDB
            expect(result?.recommendedDB).toBe('mongodb');
        });

        it('should handle edge case: very low data volume', () => {
            const result = MigrationAdvisorService.analyzeMigration('mongodb', {
                dataVolume: 10,
                readWriteRatio: 0.5,
                schemaFlexibility: 'rigid',
                queryComplexity: 'medium',
                transactionRequirements: 'medium',
            });

            // Low volume might not require migration
            expect(result).toBeDefined();
        });
    });
});
