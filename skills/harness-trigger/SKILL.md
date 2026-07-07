# Harness Trigger

Indice de activacion para cargar la skill correcta sin saturar contexto.

## Cuando Usar

- Al inicio de una sesion de trabajo tecnica.
- Cuando no estes seguro de que skill especializada aplica.
- Antes de una feature compleja o cambio que pueda cruzar capas.

## Regla Principal

No cargues todas las skills. Elige la minima skill que reduce riesgo para la tarea actual.

## Mapa De Activacion

### SDD

- Usa `sdd-specify` cuando el usuario pida una feature nueva, alcance, criterios de aceptacion o SDD.
- Usa `sdd-plan` cuando exista `spec.md` y falte plan tecnico.
- Usa `sdd-tasks` cuando exista `spec.md` + `plan.md` y falte breakdown verificable.
- Usa `sdd-implement` cuando existan `spec.md`, `plan.md` y `tasks.md` aprobados.

### Loop / TDD

- Usa `loop-engineering` cuando haya que iterar hasta pasar tests/build/lint.
- Usa `tdd-workflow` cuando el usuario pida TDD, test-first o RED/GREEN/REFACTOR.
- Usa `verification-loop` antes de cerrar una feature o PR.

### Frontend

- Usa `frontend-design` para diseño visual, dashboard, UI distintiva, accesibilidad o responsive.
- Usa `frontend-patterns-react19` para React 19, Vite, hooks o patrones frontend del stack.
- Usa `accessibility-audit` cuando el diff contenga `.tsx`, `.jsx`, `.html` o `.css` en cambios de UI.

### Backend / APIs

- Usa `backend-node-patterns` para Node/API/backend.
- Usa `api-docs-resolver` antes de usar APIs de librerias externas no verificadas.
- Usa `security-review` si se toca auth, CORS, headers, secrets, endpoints o datos sensibles.

### Debug / Review

- Usa `debug-bugs` para errores intermitentes, race conditions o tracebacks complejos.
- Usa `code-reviewer-v2` cuando el usuario pida review o el cambio toque runtime critico.
- Usa `accessibility-audit` cuando el cambio incluya componentes UI o templates.

### Multiagentes

- Usa `multiagent-orchestrator` solo si la feature cruza 3+ capas o requiere verificador independiente.
- No uses multiagentes para cambios de un archivo o fixes mecanicos.

### Proyecto

- Usa `project-context-refresh` si summaries/contexto del repo pueden estar obsoletos.
- Usa `audit-pbot` o `audit-vozart` solo para auditorias de esos proyectos.

## Output Esperado

```txt
HARNESS DECISION

Task: ...
Skill selected: ...
Why: ...
Skills not loaded: ...
```
