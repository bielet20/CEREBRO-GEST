# Master Orchestrator

Sistema central de gestión multi-tenant con bases de datos dinámicas.

## 🏗️ Arquitectura

### Componentes Principales

1. **Tenant Model** - Modelo de datos con configuración cifrada
2. **Scope Provider** - Aislamiento de seguridad por tenant usando AsyncLocalStorage
3. **Database Adapters** - Strategy Pattern para PostgreSQL y MongoDB
4. **Connection Manager** - Gestión dinámica de conexiones con cifrado AES-256
5. **Tenant Resolver** - Middleware para identificar tenant (subdomain/header/query)

## 🚀 Uso

### 1. Provisionar un Nuevo Tenant

```bash
curl -X POST http://localhost:3000/api/admin/tenants/provision \
  -H "Content-Type: application/json" \
  -d '{
    "companyName": "Restaurante La Paella",
    "tier": "gold",
    "driverType": "postgresql",
    "dbHost": "localhost",
    "dbPort": 5432,
    "dbName": "lapaella_db",
    "dbUsername": "admin",
    "dbPassword": "secret123"
  }'
```

**Respuesta:**
```json
{
  "message": "Tenant provisioned successfully",
  "tenant": {
    "id": "uuid-here",
    "companyName": "Restaurante La Paella",
    "subdomain": "restaurante-la-paella",
    "tier": "gold"
  }
}
```

### 2. Listar Todos los Tenants

```bash
curl http://localhost:3000/api/admin/tenants
```

### 3. Activar Features de un Tenant

```bash
curl -X PATCH http://localhost:3000/api/admin/tenants/{id}/features \
  -H "Content-Type: application/json" \
  -d '{
    "features": ["ventas", "crm", "inventario"]
  }'
```

### 4. Acceder a la API del Tenant

**Opción 1: Via Subdomain**
```bash
curl http://restaurante-la-paella.localhost:3000/api/tenant/info
```

**Opción 2: Via Header**
```bash
curl http://localhost:3000/api/tenant/info \
  -H "X-Tenant-ID: uuid-here"
```

**Opción 3: Via Query Param**
```bash
curl "http://localhost:3000/api/tenant/info?tenantId=uuid-here"
```

## 🔐 Seguridad

- **Cifrado AES-256** de credenciales de base de datos
- **Scope Provider** garantiza aislamiento total entre tenants
- **Validación** de tenant activo en cada request

## 📊 Endpoints

### Admin API (`/api/admin`)
- `POST /tenants/provision` - Crear nuevo tenant
- `GET /tenants` - Listar todos los tenants
- `PATCH /tenants/:id/features` - Actualizar features

### Tenant API (`/api/tenant`)
- `GET /info` - Información del tenant
- `GET /data` - Query a la DB del tenant

## 🛠️ Variables de Entorno

```env
PORT=3000
DB_ENCRYPTION_KEY=super-secret-key-change-in-production-min-32-chars
NODE_ENV=development
```

## 🏃 Ejecutar

```bash
npm run dev
```
