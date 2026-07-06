# Spec As Source

Capacidad avanzada para generar o regenerar codigo desde una especificacion completa. No es el modo por defecto.

## Cuando Usar

- Refactors grandes donde la spec define contratos completos.
- Migraciones repetitivas con patron estable.
- Reescrituras donde el codigo actual es menos confiable que la spec.

## Cuando No Usar

- Fixes pequenos.
- Runtime critico sin aprobacion humana explicita.
- Specs incompletas, ambiguas o sin criterios verificables.

## Requisitos Previos

- `spec.md` define contratos, flujos, criterios de aceptacion y fuera de alcance.
- `plan.md` lista archivos a generar/modificar.
- `tasks.md` divide generacion por unidades verificables.
- Tests o comandos de build existen en `tech-stack.md`.

## Flujo

### 1. Validar Spec

- Confirmar que la spec es suficientemente precisa.
- Si falta informacion, detenerse y preguntar.

### 2. Generar Por Contrato

- Generar o modificar codigo solo para contratos descritos.
- No inferir comportamiento no especificado.
- Mantener cambios pequenos por tarea.

### 3. Verificar Contra Spec

- Ejecutar tests/build/typecheck.
- Leer archivos generados para confirmar nombres, imports y APIs reales.
- Registrar evidencia en `verify.md`.

## Restricciones

- Spec-as-source requiere aprobacion explicita del humano.
- No reemplaza spec-anchored como modo normal.
- No usar en Pbot REAL/runtime critico sin plan aprobado y verificacion maxima.

## Output Esperado

```txt
SPEC AS SOURCE RESULT

Spec: ...
Generated/modified files: ...
Verification: PASS/FAIL
Manual approval needed: YES/NO
```
