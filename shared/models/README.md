# Shared Models

Modelos de datos compartidos entre todos los servicios.

## Propósito
Centralizar las definiciones de tipos e interfaces para garantizar consistencia en todo el ecosistema.

## Contenido

- `tenant.model.ts` - Modelo de Tenant
- `user.model.ts` - Modelo de Usuario
- `permission.model.ts` - Modelo de Permisos

## Uso

```typescript
import { Tenant, User, Role } from '@shared/models';

const user: User = {
  id: '123',
  email: 'user@example.com',
  role: Role.ORGADMIN,
  // ...
};
```

## Reglas

- **Tipado estricto**: No usar `any`
- **Interfaces sobre Types**: Preferir `interface` para objetos
- **Enums para constantes**: Usar `enum` para valores fijos
- **Documentación JSDoc**: Todas las interfaces públicas deben estar documentadas
