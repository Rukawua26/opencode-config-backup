# SDD Implement

Implementa una feature siguiendo `spec.md`, `plan.md` y `tasks.md` como ancla de verdad.

## Cuando Usar

- Cuando existan `spec.md`, `plan.md` y `tasks.md`.
- Cuando el usuario pida implementar una feature SDD.

## Trigger

Activa esta skill cuando:

- El usuario pida implementar una feature con spec existente.
- Existan `spec/features/<feature>/spec.md`, `plan.md` y `tasks.md`.
- El usuario mencione `/implement-spec`, `SDD implement`, `implementar spec` o `feature SDD`.

## Regla Principal

La spec manda. Si el alcance cambia, actualiza primero `spec.md` o `plan.md` antes de modificar codigo.

## Prompt Engineering Obligatorio

Antes de implementar, estructura el trabajo con los 5 ejes:

- Rol: actua como especialista del stack del proyecto actual.
- Contexto: usa solo la constitucion minima, la feature solicitada y los archivos listados en `plan.md`.
- Tarea: completa las tareas de `tasks.md` una por una.
- Restricciones: no amplíes alcance, no refactorices fuera del plan, no leas archivos no necesarios, no inventes comportamiento no especificado.
- Formato: actualiza progreso relevante en `tasks.md`, registra verificacion en `verify.md` y reporta archivos/comandos al final.

## Contexto Permitido

Lee solo:

- `spec/constitution/working-agreement.md`
- `spec/constitution/tech-stack.md`
- `spec/features/<feature>/spec.md`
- `spec/features/<feature>/plan.md`
- `spec/features/<feature>/tasks.md`
- Archivos de codigo directamente necesarios para las tareas actuales

No cargues otras features salvo dependencia explicita.

## Flujo

### 0. Entender

- Lee `spec.md` completo una vez para entender el objetivo global.
- Identifica el por que de la feature: que problema resuelve y que no debe cambiar.
- Lee solo los archivos de codigo que `spec.md`, `plan.md` o `tasks.md` referencian como necesarios.
- Si algo no esta claro, pregunta antes de implementar.
- No escribas codigo en esta fase; solo entiende y valida el alcance.

### 1. Preparar

- Confirma criterios de aceptacion.
- Carga tareas y marca progreso con la herramienta de tareas de sesion si el trabajo tiene varios pasos.

### 2. Implementar Por Tarea

- Ejecuta una tarea a la vez.
- Haz el cambio minimo correcto.
- No refactorices fuera del plan.
- Actualiza `tasks.md` al completar tareas si es util para persistir progreso.

### 2.4 TDD Opcional

Si el plan lo especifica o el usuario lo pide:

- Antes de implementar cada tarea, escribe el test que describe el comportamiento esperado.
- Verifica que el test falla por la razon esperada (RED).
- Implementa el codigo minimo para que pase (GREEN).
- Refactoriza solo si mantiene tests verdes y no amplia alcance.
- Usa la skill `tdd-workflow` como guia del ciclo RED/GREEN/REFACTOR.

### 2.5 Loop Auto-Correctivo

- Implementa la tarea actual.
- Ejecuta la verificacion minima definida en `plan.md`.
- Si falla, corrige dentro del alcance y repite la verificacion.
- Solo avanza a la siguiente tarea cuando la verificacion relevante pase o el fallo quede documentado como bloqueante.
- Limite de 3 iteraciones por tarea; si no pasa despues de 3 intentos, documentar como bloqueante en `verify.md` y detenerse.
- Si el error es de tests, corregir solo lo que falla. No refactorizar para hacer pasar.
- Si el error es de types/lint/build, corregir y re-verificar hasta que pase.

### 2.6 Paso Anti-Alucinacion Obligatorio

Antes de marcar una tarea como completa:

- Lee los archivos modificados o las secciones relevantes para confirmar que el cambio existe.
- Compara el cambio con `spec.md`, `plan.md` y `tasks.md`.
- Verifica que no agregaste comportamiento fuera de los criterios de aceptacion.
- Verifica que los tipos, imports, nombres de archivos y APIs usadas existen en el codigo real.
- Si algo fue inventado o excede el alcance, corrige antes de continuar.

### 3. Verificar

- Ejecuta checks definidos en `plan.md`.
- Usa la skill `verification-loop` para verificacion completa cuando aplique.
- Registra resultado en `spec/features/<feature>/verify.md`.
- Incluye una seccion `Verificacion Anti-Alucinacion` en `verify.md` con evidencia de que los cambios coinciden con archivos reales y criterios de aceptacion.

### 4. Cerrar

- Resume archivos modificados.
- Indica criterios de aceptacion validados.
- Lista pruebas/comandos ejecutados.

## Restricciones

- No implementes features que no esten en la spec.
- No ignores criterios de aceptacion fallidos.
- No ocultes fallos de tests; reportalos y corrige si esta dentro del alcance.

## Output Esperado

```txt
SDD IMPLEMENTATION COMPLETE

Feature: spec/features/NNN-name/
Tasks completed: X/Y
Verification: PASS/FAIL
Comandos ejecutados: ...
Archivos modificados: ...
```
