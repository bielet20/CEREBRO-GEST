# 🔒 Guía de Seguridad - Claves y Credenciales

## ✅ Estado Actual de Seguridad

### Archivos Protegidos
Los siguientes archivos **NO se subirán a GitHub** gracias al `.gitignore` actualizado:

- ✅ `.env` (raíz del proyecto)
- ✅ `apps/ai-consultant/.env`
- ✅ `apps/app-provisioner/.env`
- ✅ `apps/auth-master/.env`
- ✅ `apps/central-auth/.env`
- ✅ `apps/master-orchestrator/.env`
- ✅ Archivos de base de datos (*.db, *.sqlite)
- ✅ Backups

### Archivos Eliminados del Historial de Git
Se han removido del tracking de Git (pero **permanecen en tu disco local**):
```bash
git rm --cached .env
git rm --cached apps/*/.env
```

## 🔑 Claves Sensibles Identificadas

### 1. OpenAI API Key
**Ubicación**: Archivos `.env`
```
OPENAI_API_KEY=sk-your-openai-api-key-here
```
**Estado**: ✅ Protegido (no se subirá a GitHub)

### 2. JWT Secret
**Ubicación**: Archivos `.env`
```
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long
```
**Estado**: ✅ Protegido (no se subirá a GitHub)

### 3. Database Passwords
**Ubicación**: Archivos `.env`
```
POSTGRES_PASSWORD=your-secure-postgres-password
MONGO_PASSWORD=your-secure-mongo-password
DB_ENCRYPTION_KEY=super-secret-key-change-in-production-min-32-chars
```
**Estado**: ✅ Protegido (no se subirá a GitHub)

## 📋 Próximos Pasos Requeridos

### 1. Commit de Cambios de Seguridad
```bash
cd "/Users/bielrivero/CEREBRO GEST"
git add .gitignore
git commit -m "🔒 Security: Remove .env files from tracking and update .gitignore"
git push
```

### 2. Limpiar Historial de Git (OPCIONAL pero RECOMENDADO)
Si ya subiste archivos `.env` anteriormente, están en el historial de Git. Para eliminarlos completamente:

```bash
# ⚠️ ADVERTENCIA: Esto reescribe el historial de Git
# Haz un backup antes de ejecutar esto

# Instalar BFG Repo-Cleaner (más rápido que git filter-branch)
brew install bfg

# Clonar un mirror del repositorio
git clone --mirror https://github.com/tu-usuario/CEREBRO-GEST.git

# Eliminar archivos .env del historial
cd CEREBRO-GEST.git
bfg --delete-files .env
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# Forzar push (⚠️ requiere permisos de admin)
git push --force
```

### 3. Rotar Todas las Claves (CRÍTICO si ya subiste .env)
Si los archivos `.env` ya estaban en GitHub, **DEBES cambiar todas las claves**:

- [ ] Regenerar `OPENAI_API_KEY` en https://platform.openai.com/api-keys
- [ ] Generar nuevo `JWT_SECRET`: `openssl rand -base64 64`
- [ ] Cambiar `POSTGRES_PASSWORD` y `MONGO_PASSWORD`
- [ ] Actualizar `DB_ENCRYPTION_KEY`: `openssl rand -base64 32`

## 🛡️ Buenas Prácticas

### ✅ Hacer
- Usar archivos `.env` para credenciales locales
- Mantener `.env.example` con valores de ejemplo (sin claves reales)
- Usar variables de entorno en producción
- Rotar claves regularmente

### ❌ No Hacer
- **NUNCA** hacer commit de archivos `.env`
- **NUNCA** hardcodear claves en el código
- **NUNCA** compartir claves por email/chat
- **NUNCA** usar las mismas claves en desarrollo y producción

## 📝 Verificación

Para verificar que no hay claves expuestas:
```bash
# Verificar que .env no está tracked
git ls-files | grep .env

# Buscar posibles claves hardcodeadas
grep -r "sk-" --include="*.ts" --include="*.js" .
grep -r "API_KEY.*=" --include="*.ts" --include="*.js" .
```

## 🚨 Si Ya Subiste Claves a GitHub

1. **Inmediatamente** rota todas las claves comprometidas
2. Revisa el historial de commits en GitHub
3. Considera hacer el repositorio privado temporalmente
4. Limpia el historial con BFG (ver arriba)
5. Notifica a tu equipo del cambio de claves

---

**Última actualización**: 2026-02-11
**Estado**: ✅ Archivos .env removidos del tracking de Git
