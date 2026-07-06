# Verification Loop

Ejecuta verificacion completa del estado del proyecto despues de cambios.

## Cuando Usar

- Despues de completar una feature o cambio significativo
- Antes de crear un PR
- Despues de refactorizar
- Cuando quieras asegurar calidad antes de continuar

## Flujo de Verificacion

### 1. Detectar Stack
Lee `package.json`, `tsconfig.json`, `.eslintrc*`, `vitest.config.*` para saber que herramientas usa el proyecto.

### 2. Build
```
Si el proyecto tiene script "build", ejecutarlo.
Si falla: reportar errores y DETENERSE.
```

### 3. Type Check
```
Si hay tsconfig, ejecutar typecheck.
Reportar numero de errores con archivo:linea.
```

### 4. Lint
```
Si hay linter configurado, ejecutarlo.
Reportar warnings y errores.
```

### 5. Tests
```
Si hay test runner configurado, ejecutar tests.
Reportar: pasados / fallados / total / cobertura si existe.
```

### 6. Seguridad Basica
```
Buscar secretos hardcodeados en archivos fuente.
Buscar console.log en src/.
```

### 7. Diff Review
```
git diff --stat
Revisar archivos modificados buscando cambios no intencionados.
```

## Reporte

```
VERIFICATION: PASS/FAIL

Build:    OK/FAIL
Types:    OK / X errors
Lint:     OK / X issues
Tests:    X/Y passed (Z% coverage)
Secrets:  OK / X encontrados
Logs:     OK / X console.logs

Ready for PR: YES/NO
```

## Notas

- Usar las herramientas de OpenCode (Read, Grep, Glob, Bash) para cada paso.
- No usar `head`, `tail` ni `grep` de shell; preferir las herramientas nativas.
- Si hay issues criticos, listarlos con sugerencias de fix.
