import { useState } from 'react';
import { Server, Database, Shield, CheckCircle } from 'lucide-react';

export default function TenantProvisioning() {
    const [formData, setFormData] = useState({
        companyName: '',
        tier: 'bronze',
        driverType: 'postgresql',
        dbHost: 'localhost',
        dbPort: '5432',
        dbName: '',
        dbUsername: '',
        dbPassword: '',
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(false);

        try {
            const response = await fetch('/api/admin/tenants/provision', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    dbPort: parseInt(formData.dbPort),
                }),
            });

            if (!response.ok) {
                throw new Error('Error al provisionar tenant');
            }

            setSuccess(true);
            setFormData({
                companyName: '',
                tier: 'bronze',
                driverType: 'postgresql',
                dbHost: 'localhost',
                dbPort: '5432',
                dbName: '',
                dbUsername: '',
                dbPassword: '',
            });
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold mb-2">Tenant Provisioning</h2>
                <p className="text-slate-400">Crear un nuevo tenant con su base de datos</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form */}
                <div className="lg:col-span-2">
                    <form onSubmit={handleSubmit} className="bg-slate-800 rounded-xl p-6 border border-slate-700 space-y-6">
                        {/* Company Info */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4 flex items-center">
                                <Server className="w-5 h-5 mr-2 text-primary-500" />
                                Información de la Empresa
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Nombre de la Empresa</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.companyName}
                                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                        className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        placeholder="Ej: Restaurante La Paella"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Tier</label>
                                    <select
                                        value={formData.tier}
                                        onChange={(e) => setFormData({ ...formData, tier: e.target.value })}
                                        className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500"
                                    >
                                        <option value="bronze">Bronze</option>
                                        <option value="silver">Silver</option>
                                        <option value="gold">Gold</option>
                                        <option value="platinum">Platinum</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Database Config */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4 flex items-center">
                                <Database className="w-5 h-5 mr-2 text-primary-500" />
                                Configuración de Base de Datos
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium mb-2">Tipo de Base de Datos</label>
                                    <select
                                        value={formData.driverType}
                                        onChange={(e) => setFormData({ ...formData, driverType: e.target.value })}
                                        className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500"
                                    >
                                        <option value="postgresql">PostgreSQL</option>
                                        <option value="mongodb">MongoDB</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Host</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.dbHost}
                                        onChange={(e) => setFormData({ ...formData, dbHost: e.target.value })}
                                        className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Puerto</label>
                                    <input
                                        type="number"
                                        required
                                        value={formData.dbPort}
                                        onChange={(e) => setFormData({ ...formData, dbPort: e.target.value })}
                                        className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium mb-2">Nombre de la Base de Datos</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.dbName}
                                        onChange={(e) => setFormData({ ...formData, dbName: e.target.value })}
                                        className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Credentials */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4 flex items-center">
                                <Shield className="w-5 h-5 mr-2 text-primary-500" />
                                Credenciales (se cifrarán con AES-256)
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Usuario</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.dbUsername}
                                        onChange={(e) => setFormData({ ...formData, dbUsername: e.target.value })}
                                        className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Contraseña</label>
                                    <input
                                        type="password"
                                        required
                                        value={formData.dbPassword}
                                        onChange={(e) => setFormData({ ...formData, dbPassword: e.target.value })}
                                        className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Messages */}
                        {success && (
                            <div className="bg-green-600/20 border border-green-600 rounded-lg p-4 flex items-center">
                                <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                                <span className="text-green-400">¡Tenant provisionado exitosamente!</span>
                            </div>
                        )}

                        {error && (
                            <div className="bg-red-600/20 border border-red-600 rounded-lg p-4">
                                <span className="text-red-400">{error}</span>
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-slate-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                        >
                            {loading ? 'Provisionando...' : 'Provisionar Tenant'}
                        </button>
                    </form>
                </div>

                {/* Info Panel */}
                <div className="space-y-4">
                    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                        <h3 className="font-semibold mb-3">¿Qué hace el Provisioning?</h3>
                        <ul className="space-y-2 text-sm text-slate-400">
                            <li className="flex items-start">
                                <span className="text-primary-500 mr-2">1.</span>
                                Crea el esquema en la base de datos seleccionada
                            </li>
                            <li className="flex items-start">
                                <span className="text-primary-500 mr-2">2.</span>
                                Ejecuta migraciones base
                            </li>
                            <li className="flex items-start">
                                <span className="text-primary-500 mr-2">3.</span>
                                Cifra las credenciales con AES-256
                            </li>
                            <li className="flex items-start">
                                <span className="text-primary-500 mr-2">4.</span>
                                Asigna un subdomain único
                            </li>
                            <li className="flex items-start">
                                <span className="text-primary-500 mr-2">5.</span>
                                Registra el tenant en el sistema
                            </li>
                        </ul>
                    </div>

                    <div className="bg-primary-600/20 border border-primary-600 rounded-xl p-6">
                        <h3 className="font-semibold mb-2 text-primary-400">💡 Tip</h3>
                        <p className="text-sm text-slate-300">
                            El subdomain se genera automáticamente a partir del nombre de la empresa.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
