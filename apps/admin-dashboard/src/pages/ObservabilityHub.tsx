import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, Database, Zap, AlertCircle } from 'lucide-react';

interface TenantMetrics {
    tenantId: string;
    companyName: string;
    apiRequests: number;
    dbLatency: number;
    status: 'healthy' | 'warning' | 'critical';
}

export default function ObservabilityHub() {
    const [metrics, setMetrics] = useState<TenantMetrics[]>([]);

    useEffect(() => {
        // Simulación de métricas (en producción vendría del backend)
        const mockMetrics: TenantMetrics[] = [
            { tenantId: '1', companyName: 'Empresa A', apiRequests: 1250, dbLatency: 45, status: 'healthy' },
            { tenantId: '2', companyName: 'Empresa B', apiRequests: 890, dbLatency: 320, status: 'warning' },
            { tenantId: '3', companyName: 'Empresa C', apiRequests: 2100, dbLatency: 650, status: 'critical' },
        ];
        setMetrics(mockMetrics);
    }, []);

    const chartData = [
        { time: '00:00', requests: 120 },
        { time: '04:00', requests: 80 },
        { time: '08:00', requests: 450 },
        { time: '12:00', requests: 890 },
        { time: '16:00', requests: 1200 },
        { time: '20:00', requests: 650 },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'healthy': return 'bg-green-500';
            case 'warning': return 'bg-yellow-500';
            case 'critical': return 'bg-red-500';
            default: return 'bg-gray-500';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'healthy': return '🟢';
            case 'warning': return '🟡';
            case 'critical': return '🔴';
            default: return '⚪';
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold mb-2">Observability Hub</h2>
                <p className="text-slate-400">Monitoreo en tiempo real de todos los tenants</p>
            </div>

            {/* System Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                    <div className="flex items-center justify-between mb-4">
                        <Activity className="w-8 h-8 text-primary-500" />
                        <span className="text-2xl font-bold">4,240</span>
                    </div>
                    <p className="text-slate-400">Requests/min</p>
                </div>

                <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                    <div className="flex items-center justify-between mb-4">
                        <Database className="w-8 h-8 text-green-500" />
                        <span className="text-2xl font-bold">125ms</span>
                    </div>
                    <p className="text-slate-400">Latencia Promedio</p>
                </div>

                <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                    <div className="flex items-center justify-between mb-4">
                        <Zap className="w-8 h-8 text-yellow-500" />
                        <span className="text-2xl font-bold">99.8%</span>
                    </div>
                    <p className="text-slate-400">Uptime</p>
                </div>
            </div>

            {/* API Traffic Chart */}
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <h3 className="text-xl font-bold mb-6">Tráfico de API (Últimas 24h)</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="time" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
                            labelStyle={{ color: '#94a3b8' }}
                        />
                        <Line type="monotone" dataKey="requests" stroke="#0ea5e9" strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Tenant Health Status */}
            <div className="bg-slate-800 rounded-xl border border-slate-700">
                <div className="p-6 border-b border-slate-700">
                    <h3 className="text-xl font-bold">Estado de Salud por Tenant</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-700/50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">
                                    Tenant
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">
                                    API Requests
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">
                                    Latencia DB (ms)
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">
                                    Estado
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                            {metrics.map((metric) => (
                                <tr key={metric.tenantId} className="hover:bg-slate-700/30">
                                    <td className="px-6 py-4 whitespace-nowrap font-medium">
                                        {metric.companyName}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-slate-400">
                                        {metric.apiRequests.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`font-semibold ${metric.dbLatency < 100 ? 'text-green-400' :
                                                metric.dbLatency < 500 ? 'text-yellow-400' :
                                                    'text-red-400'
                                            }`}>
                                            {metric.dbLatency}ms
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center space-x-2">
                                            <span className="text-xl">{getStatusIcon(metric.status)}</span>
                                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(metric.status)}`}>
                                                {metric.status}
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Alerts */}
            <div className="bg-red-600/20 border border-red-600 rounded-xl p-6">
                <div className="flex items-start">
                    <AlertCircle className="w-6 h-6 text-red-500 mr-3 mt-0.5" />
                    <div>
                        <h3 className="font-semibold text-red-400 mb-2">Alerta Crítica</h3>
                        <p className="text-sm text-slate-300">
                            Empresa C está experimentando latencia alta (650ms). Se recomienda revisar la conexión de base de datos.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
