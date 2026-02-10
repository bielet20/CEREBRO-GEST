import { useEffect, useState } from 'react';
import { Users, Database, Activity, TrendingUp } from 'lucide-react';

interface Tenant {
    id: string;
    companyName: string;
    subdomain: string;
    status: string;
    tier: string;
    features: string[];
}

export default function Dashboard() {
    const [tenants, setTenants] = useState<Tenant[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTenants();
    }, []);

    const fetchTenants = async () => {
        try {
            const response = await fetch('/api/admin/tenants');
            const data = await response.json();
            setTenants(data.tenants || []);
        } catch (error) {
            console.error('Error fetching tenants:', error);
        } finally {
            setLoading(false);
        }
    };

    const stats = [
        { label: 'Total Tenants', value: tenants.length, icon: Users, color: 'bg-blue-500' },
        { label: 'Active', value: tenants.filter(t => t.status === 'active').length, icon: Activity, color: 'bg-green-500' },
        { label: 'Databases', value: tenants.length, icon: Database, color: 'bg-purple-500' },
        { label: 'Growth', value: '+12%', icon: TrendingUp, color: 'bg-orange-500' },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold mb-2">Dashboard</h2>
                <p className="text-slate-400">Visión general del sistema multi-tenant</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div key={stat.label} className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`${stat.color} p-3 rounded-lg`}>
                                    <Icon className="w-6 h-6 text-white" />
                                </div>
                            </div>
                            <p className="text-slate-400 text-sm mb-1">{stat.label}</p>
                            <p className="text-3xl font-bold">{stat.value}</p>
                        </div>
                    );
                })}
            </div>

            {/* Tenants Table */}
            <div className="bg-slate-800 rounded-xl border border-slate-700">
                <div className="p-6 border-b border-slate-700">
                    <h3 className="text-xl font-bold">Tenants Activos</h3>
                </div>
                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="p-8 text-center text-slate-400">Cargando...</div>
                    ) : tenants.length === 0 ? (
                        <div className="p-8 text-center text-slate-400">
                            No hay tenants. Crea uno en la sección de Provisioning.
                        </div>
                    ) : (
                        <table className="w-full">
                            <thead className="bg-slate-700/50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">
                                        Empresa
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">
                                        Subdomain
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">
                                        Tier
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">
                                        Estado
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">
                                        Features
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700">
                                {tenants.map((tenant) => (
                                    <tr key={tenant.id} className="hover:bg-slate-700/30">
                                        <td className="px-6 py-4 whitespace-nowrap font-medium">
                                            {tenant.companyName}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-slate-400">
                                            {tenant.subdomain}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-primary-600">
                                                {tenant.tier}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${tenant.status === 'active' ? 'bg-green-600' : 'bg-red-600'
                                                }`}>
                                                {tenant.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-400">
                                            {tenant.features.length} módulos
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}
