export interface LogEntry {
    timestamp: string;
    query: string;
    executionTime: number;
    rowsAffected: number;
    tenantId: string;
}

export interface AuditResult {
    tenantId: string;
    totalQueries: number;
    avgExecutionTime: number;
    slowQueries: LogEntry[];
    recommendations: string[];
    healthScore: number; // 0-100
}

export interface MigrationRecommendation {
    currentDB: 'postgresql' | 'mongodb' | 'mysql';
    recommendedDB: 'postgresql' | 'mongodb' | 'mysql';
    reason: string;
    benefits: string[];
    risks: string[];
    confidence: number; // 0-100
}

export interface GUIConfig {
    industry: string;
    theme: {
        primaryColor: string;
        secondaryColor: string;
        fontFamily: string;
    };
    components: UIComponent[];
    layout: 'dashboard' | 'sidebar' | 'topnav';
}

export interface UIComponent {
    type: 'table' | 'form' | 'chart' | 'card' | 'list';
    title: string;
    dataSource: string;
    fields: string[];
    actions?: string[];
}
