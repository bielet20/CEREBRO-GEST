#!/bin/bash

# Script para hacer commit de los cambios de testing
# Creado: 2026-02-10

echo "🚀 Iniciando commit de documentación de testing..."
echo ""

# Navegar al directorio del proyecto
cd "/Users/bielrivero/CEREBRO GEST" || exit 1

# Mostrar el estado actual
echo "📊 Estado actual del repositorio:"
git status --short
echo ""

# Añadir los archivos de testing
echo "➕ Añadiendo archivos..."
git add apps/ai-consultant/TEST_SUMMARY.md
git add apps/ai-consultant/TESTING_GUIDE.md

# Verificar qué se va a commitear
echo ""
echo "📝 Archivos preparados para commit:"
git status --short
echo ""

# Hacer el commit
echo "💾 Creando commit..."
git commit -m "docs: add AI Consultant testing documentation

- Added TEST_SUMMARY.md with overview of 28 unit tests
  - LogAuditorService: 9 tests
  - MigrationAdvisorService: 9 tests  
  - GUIGeneratorService: 10 tests
- Added TESTING_GUIDE.md with testing instructions
- Includes test commands and coverage expectations"

# Verificar el commit
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Commit creado exitosamente!"
    echo ""
    echo "📤 ¿Deseas hacer push ahora? (s/n)"
    read -r response
    
    if [[ "$response" =~ ^[Ss]$ ]]; then
        echo "📤 Haciendo push a origin main..."
        git push origin main
        
        if [ $? -eq 0 ]; then
            echo ""
            echo "🎉 ¡Push completado exitosamente!"
        else
            echo ""
            echo "❌ Error al hacer push. Verifica tu conexión y credenciales."
        fi
    else
        echo ""
        echo "⏸️  Push cancelado. Puedes hacerlo más tarde con: git push origin main"
    fi
else
    echo ""
    echo "❌ Error al crear el commit."
    exit 1
fi
