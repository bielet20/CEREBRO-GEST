#!/bin/bash

# Script de instalación de dependencias para el Dashboard Maestro
# Este script instala todas las dependencias necesarias para el proyecto

echo "🚀 Instalando dependencias del Dashboard Maestro..."

cd /Users/bielrivero/CEREBRO\ GEST/apps/admin-dashboard

# Instalar dependencias usando el cache temporal para evitar problemas de permisos
npm install --cache /tmp/npm-cache --legacy-peer-deps

echo "✅ Dependencias instaladas correctamente"
echo ""
echo "Para ejecutar el dashboard:"
echo "  cd apps/admin-dashboard"
echo "  npm run dev"
echo ""
echo "El dashboard estará disponible en http://localhost:5173"
