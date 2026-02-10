import { LogAuditorService } from '../log-auditor.service';
import type { LogEntry } from '../../models/ai-advanced.model';

describe('LogAuditorService', () => {
    describe('auditLogs', () => {
        it('should detect slow queries (>500ms)', () => {
            const logs: LogEntry[] = [
                {
                    timestamp: '2026-02-10T18:00:00Z',
                    query: 'SELECT * FROM orders WHERE customer_id = 123',
                    executionTime: 1200,
                    rowsAffected: 500,
                    tenantId: 'test-tenant-001',
                },
                {
                    timestamp: '2026-02-10T18:01:00Z',
                    query: 'SELECT * FROM products',
                    executionTime: 50,
                    rowsAffected: 100,
                    tenantId: 'test-tenant-001',
                },
            ];

            const result = LogAuditorService.auditLogs(logs);

            expect(result.slowQueries).toHaveLength(1);
            expect(result.slowQueries[0].executionTime).toBe(1200);
            expect(result.slowQueries[0].query).toContain('SELECT * FROM orders');
        });

        it('should calculate correct average execution time', () => {
            const logs: LogEntry[] = [
                {
                    timestamp: '2026-02-10T18:00:00Z',
                    query: 'SELECT * FROM users',
                    executionTime: 100,
                    rowsAffected: 10,
                    tenantId: 'test-1',
                },
                {
                    timestamp: '2026-02-10T18:01:00Z',
                    query: 'SELECT * FROM products',
                    executionTime: 200,
                    rowsAffected: 20,
                    tenantId: 'test-1',
                },
                {
                    timestamp: '2026-02-10T18:02:00Z',
                    query: 'SELECT * FROM orders',
                    executionTime: 300,
                    rowsAffected: 30,
                    tenantId: 'test-1',
                },
            ];

            const result = LogAuditorService.auditLogs(logs);

            expect(result.avgExecutionTime).toBe(200);
            expect(result.totalQueries).toBe(3);
        });

        it('should calculate health score correctly for fast queries', () => {
            const logs: LogEntry[] = [
                {
                    timestamp: '2026-02-10T18:00:00Z',
                    query: 'SELECT * FROM users WHERE id = 1',
                    executionTime: 50,
                    rowsAffected: 1,
                    tenantId: 'test-1',
                },
                {
                    timestamp: '2026-02-10T18:01:00Z',
                    query: 'SELECT * FROM products WHERE id = 2',
                    executionTime: 75,
                    rowsAffected: 1,
                    tenantId: 'test-1',
                },
                {
                    timestamp: '2026-02-10T18:02:00Z',
                    query: 'SELECT * FROM orders WHERE id = 3',
                    executionTime: 100,
                    rowsAffected: 1,
                    tenantId: 'test-1',
                },
            ];

            const result = LogAuditorService.auditLogs(logs);

            expect(result.healthScore).toBeGreaterThan(80);
            expect(result.slowQueries).toHaveLength(0);
        });

        it('should calculate health score correctly for slow queries', () => {
            const logs: LogEntry[] = [
                {
                    timestamp: '2026-02-10T18:00:00Z',
                    query: 'SELECT * FROM orders',
                    executionTime: 1500,
                    rowsAffected: 1000,
                    tenantId: 'test-1',
                },
                {
                    timestamp: '2026-02-10T18:01:00Z',
                    query: 'SELECT * FROM products',
                    executionTime: 2000,
                    rowsAffected: 2000,
                    tenantId: 'test-1',
                },
            ];

            const result = LogAuditorService.auditLogs(logs);

            expect(result.healthScore).toBeLessThan(50);
            expect(result.slowQueries).toHaveLength(2);
        });

        it('should detect N+1 query patterns', () => {
            const logs: LogEntry[] = Array(15).fill(null).map((_, i) => ({
                timestamp: `2026-02-10T18:00:${i.toString().padStart(2, '0')}Z`,
                query: 'SELECT * FROM users WHERE id = ?',
                executionTime: 50,
                rowsAffected: 1,
                tenantId: 'test-1',
            }));

            const result = LogAuditorService.auditLogs(logs);

            const hasN1Warning = result.recommendations.some(rec =>
                rec.includes('N+1') || rec.includes('repetitivas')
            );
            expect(hasN1Warning).toBe(true);
        });

        it('should generate recommendations for high average execution time', () => {
            const logs: LogEntry[] = [
                {
                    timestamp: '2026-02-10T18:00:00Z',
                    query: 'SELECT * FROM orders',
                    executionTime: 800,
                    rowsAffected: 100,
                    tenantId: 'test-1',
                },
            ];

            const result = LogAuditorService.auditLogs(logs);

            expect(result.recommendations.length).toBeGreaterThan(0);
            const hasPerformanceWarning = result.recommendations.some(rec =>
                rec.includes('Tiempo promedio') || rec.includes('índices')
            );
            expect(hasPerformanceWarning).toBe(true);
        });

        it('should handle empty logs array', () => {
            const logs: LogEntry[] = [];

            const result = LogAuditorService.auditLogs(logs);

            expect(result.totalQueries).toBe(0);
            expect(result.avgExecutionTime).toBe(0);
            expect(result.slowQueries).toHaveLength(0);
            expect(result.healthScore).toBe(100);
        });

        it('should group logs by tenant ID', () => {
            const logs: LogEntry[] = [
                {
                    timestamp: '2026-02-10T18:00:00Z',
                    query: 'SELECT * FROM users',
                    executionTime: 100,
                    rowsAffected: 10,
                    tenantId: 'tenant-A',
                },
                {
                    timestamp: '2026-02-10T18:01:00Z',
                    query: 'SELECT * FROM products',
                    executionTime: 200,
                    rowsAffected: 20,
                    tenantId: 'tenant-A',
                },
            ];

            const result = LogAuditorService.auditLogs(logs);

            expect(result.tenantId).toBe('tenant-A');
        });
    });
});
