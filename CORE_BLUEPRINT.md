# The Core Blueprint - Manual de Estándares

Manual de estándares para el ecosistema Master Orchestrator.

---

## 📁 1. Estructura de Carpetas Universal

### Patrón: Monorepo Modular

```
/CEREBRO GEST
  ├── /services              # El "Cerebro" - Lógica core del sistema
  │    ├── /auth-service     # Gestión de JWT, Roles y SSO
  │    ├── /orchestrator     # Selector dinámico de bases de datos
  │    └── /ai-consultant    # Lógica de optimización y GUI Generator
  ├── /apps                  # Las "Funcionalidades" - Apps específicas
  │    ├── /client-app-1     # Micro-frontend o App específica
  │    └── /client-app-2
  ├── /shared                # EL ESTÁNDAR - Código compartido
  │    ├── /models           # Interfaces TypeScript / Esquemas
  │    ├── /utils            # Funciones de validación, logs, fechas
  │    ├── /contracts        # Definición de APIs (Swagger/OpenAPI)
  │    └── /types            # Tipos globales y enums
  ├── /infrastructure        # Configuración de infraestructura
  │    ├── /docker           # Configuración de contenedores
  │    ├── /migrations       # Scripts de bases de datos maestras
  │    └── /traefik          # Configuración del gateway
  └── README.md              # Documentación raíz
```

### Principios de Organización

- **Separación de Responsabilidades**: Services (cerebro) vs Apps (funcionalidades)
- **Código Compartido**: Todo lo reutilizable va en `/shared`
- **Infraestructura como Código**: Configuración versionada en `/infrastructure`

---

## 📝 2. Convenciones de Código

### Nomenclatura Estricta

| Elemento | Convención | Ejemplo |
|----------|------------|---------|
| Variables y funciones | camelCase | `getUserById`, `tenantConfig` |
| Clases y Componentes | PascalCase | `ConnectionManager`, `UserService` |
| Archivos | kebab-case | `user-controller.ts`, `tenant.model.ts` |
| Constantes | UPPER_SNAKE_CASE | `JWT_SECRET`, `MAX_RETRIES` |
| Interfaces | PascalCase con prefijo I | `IUser`, `ITenant` |
| Enums | PascalCase | `Role`, `TenantStatus` |

### Tipado Estricto

**❌ PROHIBIDO:**
```typescript
function processData(data: any) { ... }
```

**✅ CORRECTO:**
```typescript
interface ProcessDataInput {
  tenantId: string;
  records: Record<string, unknown>;
}

function processData(data: ProcessDataInput): ProcessDataResult { ... }
```

### Inyección de Dependencias

**❌ MAL:**
```typescript
class UserController {
  private db = new PostgreSQLAdapter(); // ❌ Acoplamiento directo
}
```

**✅ BIEN:**
```typescript
class UserController {
  constructor(private db: DatabaseDriver) {} // ✅ Inyección
}

// En el contenedor de dependencias:
const db = ConnectionManager.getConnection(tenant);
const controller = new UserController(db);
```

---

## 🔌 3. Contrato de API Estándar

### Formato de Respuesta Universal

**Todas las respuestas del servidor deben seguir este formato:**

```typescript
interface APIResponse<T = any> {
  status: 'success' | 'error';
  data?: T;
  meta: {
    tenantId: string;
    dbType: 'postgresql' | 'mongodb' | 'mysql';
    version: string;
    timestamp: string;
  };
  error?: {
    code: string;
    message: string;
    details?: Record<string, any>;
  };
}
```

### Ejemplos

**Respuesta Exitosa:**
```json
{
  "status": "success",
  "data": {
    "users": [...]
  },
  "meta": {
    "tenantId": "abc-123",
    "dbType": "postgresql",
    "version": "1.0.2",
    "timestamp": "2026-02-10T18:38:12Z"
  }
}
```

**Respuesta con Error:**
```json
{
  "status": "error",
  "meta": {
    "tenantId": "abc-123",
    "dbType": "postgresql",
    "version": "1.0.2",
    "timestamp": "2026-02-10T18:38:12Z"
  },
  "error": {
    "code": "ERR_DB_001",
    "message": "Database connection failed",
    "details": {
      "host": "localhost",
      "port": 5432
    }
  }
}
```

### Códigos de Error Estándar

| Código | Categoría | Descripción |
|--------|-----------|-------------|
| `ERR_AUTH_001` | Autenticación | Token inválido o expirado |
| `ERR_AUTH_002` | Autenticación | Credenciales incorrectas |
| `ERR_PERM_001` | Permisos | Permiso denegado |
| `ERR_DB_001` | Base de Datos | Error de conexión |
| `ERR_DB_002` | Base de Datos | Query fallida |
| `ERR_TENANT_001` | Tenant | Tenant no encontrado |
| `ERR_TENANT_002` | Tenant | Tenant inactivo |
| `ERR_VAL_001` | Validación | Datos de entrada inválidos |

---

## 🛠️ 4. Configuración de Linters

### ESLint + Prettier (Estándar Airbnb)

**Instalación:**
```bash
npm install --save-dev eslint prettier eslint-config-airbnb-typescript \
  eslint-plugin-import @typescript-eslint/eslint-plugin \
  @typescript-eslint/parser eslint-config-prettier
```

**`.eslintrc.json`:**
```json
{
  "extends": [
    "airbnb-typescript/base",
    "plugin:@typescript-eslint/recommended",
    "prettier"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "project": "./tsconfig.json"
  },
  "rules": {
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "import/prefer-default-export": "off",
    "class-methods-use-this": "off"
  }
}
```

**`.prettierrc.json`:**
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2
}
```

### Git Hooks con Husky

**Instalación:**
```bash
npm install --save-dev husky lint-staged
npx husky install
```

**`.husky/pre-commit`:**
```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npm run lint
npm run type-check
npx lint-staged
```

**`package.json`:**
```json
{
  "scripts": {
    "lint": "eslint . --ext .ts",
    "lint:fix": "eslint . --ext .ts --fix",
    "type-check": "tsc --noEmit",
    "format": "prettier --write \"src/**/*.ts\""
  },
  "lint-staged": {
    "*.ts": [
      "eslint --fix",
      "prettier --write"
    ]
  }
}
```

---

## 📚 5. Documentación Viva (JSDoc)

### Principio: Documenta el "Por Qué", No el "Qué"

**❌ MAL:**
```typescript
/**
 * Obtiene un usuario por ID
 */
function getUserById(id: string): User { ... }
```

**✅ BIEN:**
```typescript
/**
 * Obtiene un usuario por ID desde la base de datos del tenant actual.
 * 
 * IMPORTANTE: Esta función usa el ScopeProvider para garantizar que solo
 * se acceda a la DB del tenant correcto, evitando fugas de datos entre empresas.
 * 
 * @param id - UUID del usuario
 * @returns Usuario encontrado
 * @throws {Error} Si no hay contexto de tenant activo
 * 
 * @example
 * const user = await getUserById('abc-123');
 */
async function getUserById(id: string): Promise<User> { ... }
```

### Template de README por Módulo

Cada carpeta de módulo debe tener un `README.md`:

```markdown
# [Nombre del Módulo]

## Propósito
[Explicación clara de qué problema resuelve este módulo]

## Dependencias
- `@shared/models` - Interfaces de datos
- `pg` - Driver de PostgreSQL

## Uso
\`\`\`typescript
import { ModuleName } from './module-name';

const instance = new ModuleName();
\`\`\`

## API
### Funciones Principales
- `functionName(param)` - Descripción

## Notas Técnicas
[Decisiones de diseño importantes, limitaciones conocidas, etc.]
```

---

## 🎯 6. Checklist de Calidad

Antes de hacer commit, verifica:

- [ ] ✅ Código pasa ESLint sin errores
- [ ] ✅ TypeScript compila sin errores (`tsc --noEmit`)
- [ ] ✅ No hay uso de `any`
- [ ] ✅ Todas las funciones públicas tienen JSDoc
- [ ] ✅ Nombres siguen convenciones (camelCase, PascalCase, kebab-case)
- [ ] ✅ Respuestas de API usan el formato estándar
- [ ] ✅ Módulo tiene README.md
- [ ] ✅ Tests unitarios pasan (cuando aplique)

---

## 🚀 Aplicación Inmediata

### Migración de Estructura Actual

**Renombrar carpetas:**
```bash
mv apps/auth-master services/auth-service
mv apps/master-orchestrator services/orchestrator
mv apps/ai-consultant services/ai-consultant
mv infra infrastructure
```

**Crear `/shared`:**
```bash
mkdir -p shared/{models,utils,contracts,types}
```

**Mover modelos compartidos:**
```bash
mv services/orchestrator/src/core/tenant.model.ts shared/models/
mv services/auth-service/src/models/user.model.ts shared/models/
```

---

## 📖 Filosofía del Blueprint

> "El mejor código es el que se explica a sí mismo. La mejor arquitectura es la que crece sin romperse."

- **Consistencia > Perfección**: Mejor código consistente que código "perfecto" pero inconsistente
- **Explícito > Implícito**: Prefiere claridad sobre brevedad
- **Compartido > Duplicado**: Si lo usas 2 veces, muévelo a `/shared`
- **Documentado > Comentado**: JSDoc para APIs, comentarios para lógica compleja
