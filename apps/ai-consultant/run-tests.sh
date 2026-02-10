#!/bin/bash

# Script para ejecutar tests sin dependencias npm
# Usa ts-node directamente para ejecutar los tests

echo "🧪 Running AI Consultant Tests (Manual Mode)"
echo "============================================"
echo ""

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Contador de tests
TOTAL=0
PASSED=0
FAILED=0

# Función para ejecutar un test
run_test() {
    local test_file=$1
    local test_name=$(basename "$test_file" .test.ts)
    
    echo -e "${YELLOW}Running:${NC} $test_name"
    
    # Ejecutar el archivo de test con ts-node
    if npx ts-node --esm "$test_file" 2>/dev/null; then
        echo -e "${GREEN}✓ PASS${NC} $test_name"
        ((PASSED++))
    else
        echo -e "${RED}✗ FAIL${NC} $test_name"
        ((FAILED++))
    fi
    ((TOTAL++))
    echo ""
}

# Buscar todos los archivos de test
echo "Searching for test files..."
TEST_FILES=$(find src/services/__tests__ -name "*.test.ts" 2>/dev/null)

if [ -z "$TEST_FILES" ]; then
    echo -e "${RED}No test files found!${NC}"
    exit 1
fi

echo "Found $(echo "$TEST_FILES" | wc -l) test files"
echo ""

# Ejecutar cada test
for test_file in $TEST_FILES; do
    run_test "$test_file"
done

# Resumen
echo "============================================"
echo -e "Total: $TOTAL | ${GREEN}Passed: $PASSED${NC} | ${RED}Failed: $FAILED${NC}"

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ All tests passed!${NC}"
    exit 0
else
    echo -e "${RED}✗ Some tests failed${NC}"
    exit 1
fi
