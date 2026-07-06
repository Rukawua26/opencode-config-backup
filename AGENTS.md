# Agent Rules (OpenCode)

- Consult `docs/agent-context/` before reading broad parts of the repo.
- Use `~/tools/agent_context/query_context.py` for targeted lookups (run `python3 ~/tools/agent_context/query_context.py list` to see projects).
- Prefer `repo-map.json` and `summaries/` over full-tree reads.
- Rebuild context when files change.

# Spec-Driven Development (SDD)

- Las specs viven dentro de cada proyecto en `spec/`; no usar una carpeta global de specs.
- Para features nuevas o cambios complejos, crear primero `spec/features/NNN-name/spec.md`, luego `plan.md`, luego `tasks.md`.
- Antes de implementar una feature SDD, leer solo la constitución mínima y la feature solicitada: `spec/constitution/working-agreement.md`, `spec/constitution/tech-stack.md`, `spec/features/<feature>/spec.md`, `plan.md` y `tasks.md`.
- No leer specs de otras features salvo dependencia explícita.
- La spec es el ancla de verdad: si cambia el alcance, actualizar `spec.md` o `plan.md` antes de tocar código.
- Implementar feature por feature y verificar contra criterios de aceptación; registrar resultados en `verify.md` cuando exista.
- Commands disponibles tras reiniciar OpenCode: `/spec`, `/plan-spec`, `/tasks-spec`, `/implement-spec`, `/verify-spec`.

# Rol Del Programador

- Yo (humano) defino alcance, apruebo planes y verifico resultados finales.
- Tu (agente) ejecutas tacticamente: implementas, verificas y registras evidencia.
- No avances a implementacion sin un plan aprobado.
- En features pequenas puedes iterar sin preguntar siempre que respetes criterios de aceptacion.
- Si una tarea escala a runtime critico o cambia contratos publicos, pausa y pregunta.

# Multiagentes (Cuando Escalar)

- Para features que cruzan 3+ capas (backend+frontend+infra), usar patron Coordinador/Implementador/Verificador.
- Coordinador: humano o agente principal. Reparte trabajo, mantiene alcance y no escribe codigo si delega.
- Implementador: subagente con contexto aislado via Task tool. Ejecuta una tarea atomica.
- Verificador: subagente que valida resultado con tests, diff y criterios de aceptacion.
- Cada subagente recibe solo spec, plan, tarea asignada, archivos concretos y comandos de verificacion.
- Al terminar, el subagente devuelve resumen al coordinador. No mantiene estado.
- Limite recomendado: maximo 3 subagentes por feature para evitar deuda cognitiva.
- No usar multiagentes para cambios simples de un archivo o fixes mecanicos.

# Knowledge Base (Mapa de Conocimiento)
- `~/docs/_MOC.md` es el Mapa de Contenido central — entry point para entender conexiones entre proyectos.
- Cada nota de proyecto en `~/docs/agent-context/summaries/` tiene YAML frontmatter con `stack`, `estado`, `tags`, `relacionado`.
- Las notas de área en `~/docs/areas/` contienen conocimiento transversal (AI Providers, React Patterns, DevOps).
- Los wikilinks `[[Nombre]]` conectan notas entre sí — consulta `_MOC.md` para ver el grafo completo.
- Para ver el grafo visual: abre `~/docs/` en Obsidian o ejecuta `~/docs/scripts/graph-viz.sh`.

# OpenCode CLI (Worker de código)
- Bin: `~/.opencode/bin/opencode`
- Config: `~/.config/opencode/opencode.jsonc`
- Env: `~/.config/opencode/.env`
- Plugins: `~/.config/opencode/plugins/`
- MCP servers: `~/.config/opencode/mcp/`
- Perfiles: `~/.config/opencode/profiles/work/` y `personal/`
- APIs keys: `~/.config/opencode/.env`
- Uso: `opencode` en terminal

## Agency-Agents (Prompts de sistema)
- Repo: `~/agency-agents/`
- Integración OpenCode: en `~/.config/opencode/agents/`
- Invocar en OpenCode: `@nombre-del-agente`

## Plugins activos (todos en ~/.config/opencode/plugins/)
- memory.js — memoria persistente (tools: memory_add/search/forget)
- memory-v2.js — engramas SQLite/FTS5 de alto valor (tools: memory_signal/memory_search_v2/memory_context)
- personalities.js — personalidades vía SOUL.md (tool: set_personality)
- guardrails.js — anti-loop y detección de errores
- checkpoints.js — snapshots automáticos antes de edit/write
- kanban.js — tablero de tareas (tools: kanban_create/list/update/delete)
- sandbox.js — ejecución aislada en Docker (tool: sandbox_exec)
- validator.js — validación de API keys en startup

## MCP servers
- cheap-llm (Gemini Flash Lite — tool: summarize)
- context7 (docs actualizadas de librerías — tools: resolve-library-id/get-library-docs)
- diagram-generator (Draw.io/Mermaid/Excalidraw — tool: generate_diagram)

# Reglas para Diagramas de Arquitectura
- Cuando se cree una funcionalidad compleja, genera un diagrama explicativo en `/docs/architecture/`.
- Utiliza formato `.drawio` para diagramas complejos editables, `.mmd` para mermaid en docs.
- Prioriza distribución limpia de izquierda a derecha para flujos de datos.

# Estrategia De Contexto Y Modelos

- Lee el minimo necesario para la tarea actual.
- Prefiere summaries y busqueda dirigida sobre archivos completos.
- Usa `summarize` del MCP cheap-llm cuando un documento exceda ~200 lineas y solo necesites su estructura/resumen.
- No cargues specs de features que no sean la activa.
- Si el contexto se satura, usa `/compact` para liberar espacio.
- Para tareas de arquitectura o cambios complejos usa el modelo completo.
- Para tareas mecanicas, resumenes o busquedas, usa cheap-llm MCP.
- Para APIs de librerias externas, usa `api-docs-resolver` y Context7 antes de escribir codigo si hay riesgo de API obsoleta.

# Code Minimalism (Pereza)
- Reutilizar > stdlib > dependencia instalada > código nuevo > no existir (YAGNI).
- Si ya existe en el proyecto, no reinventar. Si stdlib lo hace, no importar librería.
- Si cabe en 1 línea, no escribir 10. Preferir 3 líneas similares sobre 1 abstracción prematura.

## Cron
- systemd --user timer (opencode-cron.timer) cada 5 min
- Jobs config: `~/.config/opencode/cron-jobs.json`

## Perfiles
- `opencode-work` → modelo completo + todos los plugins
- `opencode-personal` → modelo ligero + plugins esenciales
- `opencode-profile` → menú interactivo
