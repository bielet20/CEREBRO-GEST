# Admin Dashboard

Dashboard administrativo para el Master Orchestrator.

## 🎯 Características

- **Dashboard Principal** - Vista general de tenants y métricas
- **Tenant Provisioning** - Formulario para crear nuevos tenants
- **Observability Hub** - Monitoreo en tiempo real con sistema de semáforo

## 🚀 Inicio Rápido

### Instalar Dependencias

```bash
npm install
```

### Ejecutar en Desarrollo

```bash
npm run dev
```

El dashboard estará disponible en `http://localhost:5173`

### Build para Producción

```bash
npm run build
```

## 📊 Páginas

### Dashboard (`/dashboard`)
- Estadísticas generales del sistema
- Tabla de tenants activos
- Métricas de crecimiento

### Provisioning (`/provisioning`)
- Formulario de creación de tenant
- Configuración de base de datos
- Cifrado automático de credenciales

### Observability (`/observability`)
- Gráfica de tráfico de API
- Estado de salud por tenant
- Sistema de semáforo (🟢 Verde / 🟡 Amarillo / 🔴 Rojo)
- Alertas críticas

## 🛠️ Stack Tecnológico

- **React 18** - Framework UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool
- **TailwindCSS** - Estilos
- **React Router** - Navegación
- **Recharts** - Gráficas
- **Lucide React** - Iconos

## 🔗 Integración con Backend

El dashboard se comunica con el Master Orchestrator a través de:

- `GET /api/admin/tenants` - Listar tenants
- `POST /api/admin/tenants/provision` - Crear tenant
- `PATCH /api/admin/tenants/:id/features` - Actualizar features

El proxy de Vite redirige `/api/*` a `http://localhost:3000`

## 🎨 Diseño

- **Dark Mode** - Tema oscuro profesional
- **Responsive** - Adaptado a móvil, tablet y desktop
- **Gradientes** - Colores vibrantes y modernos
- **Animaciones** - Transiciones suaves
