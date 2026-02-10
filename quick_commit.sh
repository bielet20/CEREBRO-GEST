#!/bin/bash

# Script simplificado para commit (sin git status que se cuelga)
# Creado: 2026-02-10

echo "🚀 Haciendo commit de documentación de testing..."

cd "/Users/bielrivero/CEREBRO GEST" || exit 1

# Añadir archivos directamente
git add apps/ai-consultant/TEST_SUMMARY.md apps/ai-consultant/TESTING_GUIDE.md

# Hacer commit
git commit -m "docs: add AI Consultant testing documentation

- Added TEST_SUMMARY.md with overview of 28 unit tests
  - LogAuditorService: 9 tests
  - MigrationAdvisorService: 9 tests  
  - GUIGeneratorService: 10 tests
- Added TESTING_GUIDE.md with testing instructions
- Includes test commands and coverage expectations"

if [ $? -eq 0 ]; then
    echo "✅ Commit creado exitosamente!"
    echo "📤 Haciendo push..."
    git push origin main
    
    if [ $? -eq 0 ]; then
        echo "🎉 ¡Push completado!"
    else
        echo "❌ Error en push. Ejecuta manualmente: git push origin main"
    fi
else
    echo "❌ Error al crear commit"
    exit 1
fi
