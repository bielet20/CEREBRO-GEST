# Central Auth Service (SSO)

Sistema de autenticación centralizado con RBAC jerárquico.

## 🔐 Características

- **SSO (Single Sign-On)** - Todas las apps delegan autenticación aquí
- **JWT con permisos en payload** - Sin consultas repetitivas a DB
- **RBAC Jerárquico** - SuperAdmin > OrgAdmin > User
- **Bcrypt** - Hash seguro de contraseñas

## 🎭 Roles y Permisos

### SuperAdmin
- Acceso total al sistema
- Gestión de todos los tenants
- Cambio de roles de usuarios

### OrgAdmin (Dueño de Empresa)
- Gestión completa de su tenant
- CRUD de usuarios, productos, facturas
- Acceso a reportes y configuración

### User (Empleado)
- Lectura de productos
- Creación y lectura de facturas
- Lectura de reportes

## 🚀 Uso

### 1. Registrar Usuario

```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@empresa.com",
    "password": "secret123",
    "tenantId": "tenant-uuid",
    "role": "orgadmin"
  }'
```

### 2. Login (SSO)

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@empresa.com",
    "password": "secret123",
    "tenantId": "tenant-uuid"
  }'
```

**Respuesta:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user-uuid",
    "email": "admin@empresa.com",
    "role": "orgadmin",
    "tenantId": "tenant-uuid"
  }
}
```

### 3. Verificar Token (Para Apps Hijas)

```bash
curl -X POST http://localhost:3001/api/auth/verify \
  -H "Authorization: Bearer {token}"
```

### 4. Obtener Info del Usuario

```bash
curl http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer {token}"
```

## 🔑 JWT Payload

```json
{
  "userId": "uuid",
  "tenantId": "uuid",
  "role": "orgadmin",
  "permissions": [
    { "resource": "users", "actions": ["read", "write", "delete"] },
    { "resource": "invoices", "actions": ["read", "write", "delete"] }
  ],
  "iat": 1234567890,
  "exp": 1234596690
}
```

## 🛡️ Middlewares

### authMiddleware
Verifica que el JWT sea válido y lo adjunta al request.

### requirePermission(resource, action)
Verifica que el usuario tenga permiso específico.

```typescript
app.delete('/api/products/:id',
  authMiddleware,
  requirePermission('products', 'delete'),
  handler
);
```

### requireRole(minRole)
Verifica que el usuario tenga un rol mínimo.

```typescript
app.get('/api/admin/users',
  authMiddleware,
  requireRole(Role.ORGADMIN),
  handler
);
```

## 🔗 Integración con Apps Hijas

Las apps hijas deben:
1. Redirigir a `/api/auth/login` para autenticación
2. Recibir JWT tras login exitoso
3. Incluir JWT en header `Authorization: Bearer {token}`
4. Validar JWT localmente o llamar a `/api/auth/verify`
5. Extraer permisos del payload (sin consultar DB)

## 🛠️ Variables de Entorno

```env
PORT=3001
JWT_SECRET=super-secret-jwt-key-change-in-production-min-64-chars
JWT_EXPIRES_IN=8h
NODE_ENV=development
```
