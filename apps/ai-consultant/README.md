# AI Consultant Service 🤖

Servicio de inteligencia artificial para análisis, auditoría y recomendaciones en el ecosistema Master Orchestrator.

## 🎯 Funcionalidades

### 1. **Análisis de Requerimientos** (`/api/analyze`)
Analiza requerimientos de negocio y recomienda el stack tecnológico óptimo usando GPT-4.

**Entrada:**
```json
{
  "requirements": "Necesito una app para gestionar 10,000 usuarios concurrentes..."
}
```

**Salida:**
```json
{
  "recommendedStack": {
    "database": "postgresql",
    "backend": "node.js",
    "frontend": "react"
  },
  "reasoning": "PostgreSQL es ideal para...",
  "alternatives": ["MongoDB + Express + Vue"],
  "estimatedCost": "$200-300/mes"
}
```

---

### 2. **Auditoría de Logs** (`/api/audit-logs`)
Analiza logs de queries de base de datos y detecta problemas de rendimiento.

**Características:**
- ✅ Detección de queries lentas (>500ms)
- ✅ Identificación de patrones N+1
- ✅ Sugerencias de índices faltantes
- ✅ Score de salud (0-100)

**Entrada:**
```json
{
  "logs": [
    {
      "timestamp": "2026-02-10T18:00:00Z",
      "query": "SELECT * FROM users WHERE id = 123",
      "executionTime": 850,
      "rowsAffected": 1,
      "tenantId": "tenant-abc"
    }
  ]
}
```

**Salida:**
```json
{
  "tenantId": "tenant-abc",
  "totalQueries": 1,
  "avgExecutionTime": 850,
  "slowQueries": [...],
  "recommendations": [
    "⚠️ Tiempo promedio de ejecución alto (850ms). Considera añadir índices..."
  ],
  "healthScore": 45
}
```

---

### 3. **Recomendaciones de Migración** (`/api/migration-advice`)
Analiza métricas del tenant y recomienda migración de base de datos si es necesario.

**Entrada:**
```json
{
  "currentDB": "postgresql",
  "metrics": {
    "dataVolume": 150,
    "readWriteRatio": 0.8,
    "schemaFlexibility": "flexible",
    "queryComplexity": "simple",
    "transactionRequirements": "medium"
  }
}
```

**Salida:**
```json
{
  "currentDB": "postgresql",
  "recommendedDB": "mongodb",
  "reason": "MongoDB es ideal para esquemas flexibles...",
  "benefits": [
    "Escalabilidad horizontal nativa",
    "Esquema flexible sin migraciones complejas"
  ],
  "risks": [
    "Tiempo de inactividad durante la migración",
    "Necesidad de reescribir queries específicas"
  ],
  "confidence": 75
}
```

---

### 4. **Generador de GUI** (`/api/generate-gui`)
Genera configuración de interfaz personalizada según la industria del cliente.

**Industrias Soportadas:**
- 🍽️ **Restaurante** - Gestión de mesas, pedidos, inventario
- 🛒 **Retail** - Productos, ventas, clientes frecuentes
- 🏥 **Salud** - Pacientes, citas, historias clínicas
- 📚 **Educación** - Estudiantes, cursos, tareas
- 🚚 **Logística** - Envíos, vehículos, entregas
- 🔧 **Genérico** - Configuración base

**Entrada:**
```json
{
  "industry": "restaurante"
}
```

**Salida:**
```json
{
  "industry": "restaurant",
  "theme": {
    "primaryColor": "#FF6B35",
    "secondaryColor": "#F7931E",
    "fontFamily": "Poppins, sans-serif"
  },
  "layout": "dashboard",
  "components": [
    {
      "type": "card",
      "title": "Mesas Activas",
      "dataSource": "tables",
      "fields": ["tableNumber", "status", "waiter"],
      "actions": ["view", "close"]
    }
  ]
}
```

---

## 🚀 Instalación y Uso

### 1. Instalar dependencias
```bash
cd apps/ai-consultant
npm install
```

### 2. Configurar variables de entorno
```bash
# .env
PORT=3002
OPENAI_API_KEY=sk-...
```

### 3. Ejecutar el servicio
```bash
npm run dev
```

El servicio estará disponible en `http://localhost:3002`

---

## 📊 Arquitectura

```
ai-consultant/
├── src/
│   ├── index.ts                          # Servidor Express
│   ├── models/
│   │   └── ai-advanced.model.ts          # Interfaces TypeScript
│   └── services/
│       ├── log-auditor.service.ts        # Auditoría de logs
│       ├── migration-advisor.service.ts  # Recomendaciones de migración
│       └── gui-generator.service.ts      # Generador de GUI
├── package.json
└── README.md
```

---

## 🧪 Ejemplos de Uso

### Auditar logs de un tenant
```bash
curl -X POST http://localhost:3002/api/audit-logs \
  -H "Content-Type: application/json" \
  -d '{
    "logs": [
      {
        "timestamp": "2026-02-10T18:00:00Z",
        "query": "SELECT * FROM orders",
        "executionTime": 1200,
        "rowsAffected": 5000,
        "tenantId": "tenant-123"
      }
    ]
  }'
```

### Obtener recomendación de migración
```bash
curl -X POST http://localhost:3002/api/migration-advice \
  -H "Content-Type: application/json" \
  -d '{
    "currentDB": "mysql",
    "metrics": {
      "dataVolume": 200,
      "readWriteRatio": 0.9,
      "schemaFlexibility": "flexible",
      "queryComplexity": "simple",
      "transactionRequirements": "low"
    }
  }'
```

### Generar GUI para restaurante
```bash
curl -X POST http://localhost:3002/api/generate-gui \
  -H "Content-Type: application/json" \
  -d '{"industry": "restaurante"}'
```

---

## 🔗 Integración con Master Orchestrator

El AI Consultant se integra con el Master Orchestrator para:
1. Analizar logs de cada tenant automáticamente
2. Recomendar migraciones cuando sea necesario
3. Generar UIs personalizadas al provisionar nuevos tenants

---

## 📝 Notas Técnicas

- **OpenAI API**: Requiere clave API válida
- **Modelos**: Usa GPT-4 para análisis de requerimientos
- **Servicios locales**: Log Auditor, Migration Advisor y GUI Generator funcionan sin API externa
- **Performance**: Los servicios locales son instantáneos, OpenAI puede tardar 2-5 segundos

---

## 🛠️ Stack Tecnológico

- **Runtime**: Node.js + TypeScript
- **Framework**: Express
- **IA**: OpenAI GPT-4
- **Análisis**: Algoritmos propios para logs y migración  "frontend": "React o Vue.js",
    "infrastructure": "Kubernetes para alta disponibilidad"
  },
  "reasoning": "PostgreSQL ofrece ACID y cumplimiento normativo, MongoDB para flexibilidad en historiales médicos variables",
  "scaling_strategy": "Load balancer + réplicas de lectura para 500 usuarios concurrentes, cache Redis para sesiones",
  "compliance_notes": "Encriptación end-to-end, auditoría completa, hosting en región con certificación HIPAA"
```
