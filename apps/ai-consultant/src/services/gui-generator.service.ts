import { GUIConfig, UIComponent } from '../models/ai-advanced.model.js';

/**
 * Servicio generador de configuración de GUI por industria
 * 
 * Genera configuraciones de interfaz optimizadas según la industria del cliente
 */
export class GUIGeneratorService {
    /**
     * Genera una configuración de GUI personalizada por industria
     * 
     * @param industry - Tipo de industria del cliente
     * @returns Configuración completa de UI
     */
    static generateGUIConfig(industry: string): GUIConfig {
        const normalizedIndustry = industry.toLowerCase();

        switch (normalizedIndustry) {
            case 'restaurante':
            case 'restaurant':
                return this.generateRestaurantGUI();

            case 'retail':
            case 'tienda':
                return this.generateRetailGUI();

            case 'salud':
            case 'healthcare':
                return this.generateHealthcareGUI();

            case 'educacion':
            case 'education':
                return this.generateEducationGUI();

            case 'logistica':
            case 'logistics':
                return this.generateLogisticsGUI();

            default:
                return this.generateGenericGUI();
        }
    }

    /**
     * GUI para restaurantes
     */
    private static generateRestaurantGUI(): GUIConfig {
        return {
            industry: 'restaurant',
            theme: {
                primaryColor: '#FF6B35',
                secondaryColor: '#F7931E',
                fontFamily: 'Poppins, sans-serif',
            },
            layout: 'dashboard',
            components: [
                {
                    type: 'card',
                    title: 'Mesas Activas',
                    dataSource: 'tables',
                    fields: ['tableNumber', 'status', 'waiter', 'orderTotal'],
                    actions: ['view', 'close'],
                },
                {
                    type: 'table',
                    title: 'Pedidos Pendientes',
                    dataSource: 'orders',
                    fields: ['orderNumber', 'table', 'items', 'status', 'time'],
                    actions: ['complete', 'cancel'],
                },
                {
                    type: 'chart',
                    title: 'Ventas del Día',
                    dataSource: 'sales',
                    fields: ['hour', 'amount'],
                },
                {
                    type: 'list',
                    title: 'Inventario Bajo',
                    dataSource: 'inventory',
                    fields: ['item', 'quantity', 'unit'],
                    actions: ['reorder'],
                },
            ],
        };
    }

    /**
     * GUI para retail/tiendas
     */
    private static generateRetailGUI(): GUIConfig {
        return {
            industry: 'retail',
            theme: {
                primaryColor: '#4A90E2',
                secondaryColor: '#7B68EE',
                fontFamily: 'Inter, sans-serif',
            },
            layout: 'sidebar',
            components: [
                {
                    type: 'table',
                    title: 'Productos',
                    dataSource: 'products',
                    fields: ['sku', 'name', 'price', 'stock', 'category'],
                    actions: ['edit', 'delete', 'restock'],
                },
                {
                    type: 'chart',
                    title: 'Ventas por Categoría',
                    dataSource: 'sales',
                    fields: ['category', 'revenue'],
                },
                {
                    type: 'form',
                    title: 'Nueva Venta',
                    dataSource: 'sales',
                    fields: ['customer', 'products', 'paymentMethod', 'discount'],
                    actions: ['save', 'print'],
                },
                {
                    type: 'card',
                    title: 'Clientes Frecuentes',
                    dataSource: 'customers',
                    fields: ['name', 'totalPurchases', 'lastVisit'],
                    actions: ['view'],
                },
            ],
        };
    }

    /**
     * GUI para salud/healthcare
     */
    private static generateHealthcareGUI(): GUIConfig {
        return {
            industry: 'healthcare',
            theme: {
                primaryColor: '#00A8A8',
                secondaryColor: '#4ECDC4',
                fontFamily: 'Roboto, sans-serif',
            },
            layout: 'topnav',
            components: [
                {
                    type: 'table',
                    title: 'Pacientes',
                    dataSource: 'patients',
                    fields: ['id', 'name', 'age', 'lastVisit', 'status'],
                    actions: ['view', 'edit', 'schedule'],
                },
                {
                    type: 'list',
                    title: 'Citas de Hoy',
                    dataSource: 'appointments',
                    fields: ['time', 'patient', 'doctor', 'reason'],
                    actions: ['start', 'cancel'],
                },
                {
                    type: 'form',
                    title: 'Nueva Historia Clínica',
                    dataSource: 'medicalRecords',
                    fields: ['patient', 'diagnosis', 'treatment', 'notes'],
                    actions: ['save', 'print'],
                },
                {
                    type: 'card',
                    title: 'Alertas Médicas',
                    dataSource: 'alerts',
                    fields: ['patient', 'type', 'severity', 'date'],
                    actions: ['resolve'],
                },
            ],
        };
    }

    /**
     * GUI para educación
     */
    private static generateEducationGUI(): GUIConfig {
        return {
            industry: 'education',
            theme: {
                primaryColor: '#9B59B6',
                secondaryColor: '#8E44AD',
                fontFamily: 'Nunito, sans-serif',
            },
            layout: 'sidebar',
            components: [
                {
                    type: 'table',
                    title: 'Estudiantes',
                    dataSource: 'students',
                    fields: ['id', 'name', 'grade', 'average', 'attendance'],
                    actions: ['view', 'edit'],
                },
                {
                    type: 'table',
                    title: 'Cursos',
                    dataSource: 'courses',
                    fields: ['code', 'name', 'teacher', 'students', 'schedule'],
                    actions: ['view', 'edit'],
                },
                {
                    type: 'chart',
                    title: 'Rendimiento por Materia',
                    dataSource: 'grades',
                    fields: ['subject', 'average'],
                },
                {
                    type: 'list',
                    title: 'Tareas Pendientes',
                    dataSource: 'assignments',
                    fields: ['title', 'course', 'dueDate', 'status'],
                    actions: ['grade'],
                },
            ],
        };
    }

    /**
     * GUI para logística
     */
    private static generateLogisticsGUI(): GUIConfig {
        return {
            industry: 'logistics',
            theme: {
                primaryColor: '#E74C3C',
                secondaryColor: '#C0392B',
                fontFamily: 'Montserrat, sans-serif',
            },
            layout: 'dashboard',
            components: [
                {
                    type: 'table',
                    title: 'Envíos Activos',
                    dataSource: 'shipments',
                    fields: ['trackingNumber', 'origin', 'destination', 'status', 'eta'],
                    actions: ['track', 'update'],
                },
                {
                    type: 'card',
                    title: 'Vehículos en Ruta',
                    dataSource: 'vehicles',
                    fields: ['vehicleId', 'driver', 'location', 'cargo'],
                    actions: ['locate'],
                },
                {
                    type: 'chart',
                    title: 'Entregas por Día',
                    dataSource: 'deliveries',
                    fields: ['date', 'completed', 'pending'],
                },
                {
                    type: 'list',
                    title: 'Alertas de Retraso',
                    dataSource: 'delays',
                    fields: ['shipment', 'reason', 'newETA'],
                    actions: ['notify'],
                },
            ],
        };
    }

    /**
     * GUI genérica para industrias no especificadas
     */
    private static generateGenericGUI(): GUIConfig {
        return {
            industry: 'generic',
            theme: {
                primaryColor: '#3498DB',
                secondaryColor: '#2980B9',
                fontFamily: 'Arial, sans-serif',
            },
            layout: 'dashboard',
            components: [
                {
                    type: 'table',
                    title: 'Registros',
                    dataSource: 'records',
                    fields: ['id', 'name', 'date', 'status'],
                    actions: ['view', 'edit', 'delete'],
                },
                {
                    type: 'chart',
                    title: 'Estadísticas',
                    dataSource: 'stats',
                    fields: ['category', 'value'],
                },
                {
                    type: 'form',
                    title: 'Nuevo Registro',
                    dataSource: 'records',
                    fields: ['name', 'description', 'category'],
                    actions: ['save'],
                },
            ],
        };
    }
}
