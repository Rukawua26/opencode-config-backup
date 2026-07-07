# OpenCode Config Backup

Configuración portátil de OpenCode. Clona, ejecuta `install.sh`, y tienes tu entorno completo en cualquier PC.

## Qué incluye

| Categoría | Cantidad | Ubicación |
|-----------|----------|-----------|
| Agents activos | 35 | `agents/` (symlinks a `agents-library/`) |
| Agents template | 200+ | `agents-library/` |
| Skills | 19 | `skills/` (copia a `~/opencode-custom/skills`) |
| Plugins | 8 | `plugins/` |
| MCP servers | 3 | `mcp/` (cheap-llm, context7, diagram-generator) |
| Perfiles | 2 | `profiles/work`, `profiles/personal` |
| Rules globales | 1 | `AGENTS.md` (copia a `~/AGENTS.md`) |

### Plugins

- `memory.js` — memoria persistente
- `memory-v2.js` — engramas SQLite/FTS5
- `personalities.js` — personalidades vía SOUL.md
- `guardrails.js` — anti-loop y detección de errores
- `checkpoints.js` — snapshots antes de edits
- `kanban.js` — tablero de tareas
- `sandbox.js` — ejecución aislada en Docker
- `validator.js` — validación de API keys

### Skills

`api-docs-resolver`, `audit-pbot`, `audit-vozart`, `backend-node-patterns`, `code-reviewer-v2`, `debug-bugs`, `frontend-patterns-react19`, `harness-trigger`, `loop-engineering`, `multiagent-orchestrator`, `project-context-refresh`, `sdd-implement`, `sdd-plan`, `sdd-specify`, `sdd-tasks`, `security-review`, `spec-as-source`, `tdd-workflow`, `verification-loop`

### Perfiles

| | `work` | `personal` |
|---|--------|-----------|
| Modelo | gemini-2.5-flash | gemini-2.5-flash-lite |
| Plugins | 6 | 5 (sin kanban) |
| tail_turns | 4 | 3 |
| Tokens | 48k | 32k |

## Instalación en otra PC

```bash
git clone https://github.com/Rukawua26/opencode-config-backup.git
cd opencode-config-backup
./install.sh
```

El script:
1. Crea backup de config existente
2. Copia config a `~/.config/opencode/`
3. Copia skills a `~/opencode-custom/skills/`
4. Copia reglas a `~/AGENTS.md`
5. Reemplaza `__HOME__` por tu home real
6. Reconecta symlinks de agents
7. Instala dependencias npm

Después: edita `~/.config/opencode/.env` con tus API keys y reinicia OpenCode.

## Seguridad

- `.env` nunca se sube (está en `.gitignore`)
- `node_modules/` no se sube
- `memory.json` y `kanban.json` se suben (estado portable)

## Perfiles

```bash
opencode --profile work      # Producción completa
opencode --profile personal   # Económico
```

## Archivos de estado

- `memory.json` — memoria persistente del agente
- `kanban.json` — tablero de tareas

---

*Rukawua26 | [GitHub](https://github.com/Rukawua26)*