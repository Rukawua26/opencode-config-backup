# OpenCode Config Backup

Backup portable de mi configuracion de OpenCode para poder restaurarla rapido en otro equipo sin volver a configurar plugins, agentes, MCP ni perfiles.

## Que incluye

- `opencode.jsonc`: configuracion global principal.
- `plugins/`: plugins personalizados (`memory`, `personalities`, `guardrails`, `checkpoints`, `kanban`, `sandbox`).
- `mcp/`: servidor MCP local `cheap-llm` para tareas auxiliares baratas como resumir texto.
- `profiles/`: perfiles `work` y `personal`.
- `agents/`: agentes activos listos para usar.
- `agents-library/`: libreria completa de agentes.
- `agents-index.tsv`: indice de agentes disponibles.
- `cron-jobs.json`: tareas programadas.
- `SOUL.md`: personalidad base.
- `package.json` y `package-lock.json`: dependencias necesarias para plugins.

## Que NO incluye

- `.env`: no se sube para evitar filtrar API keys.
- `node_modules/`: se reinstala al restaurar.
- Estado local generado en `~/.local/share/opencode/plugins-data/`.
- Skills globales personalizados: no habia una carpeta `skills/` propia en esta instalacion al momento del backup.

## Por que esta configuracion ahorra tokens

- `compaction.auto` compacta el contexto cuando crece demasiado.
- `tail_turns` controla cuantos turnos recientes se conservan verbatim durante la compactacion.
- Usar `tail_turns: 4` en global y `work`, y `tail_turns: 3` en `personal`, reduce contexto crudo repetido sin perder demasiada continuidad.
- `prune: true` elimina outputs viejos de herramientas durante la compactacion y reduce ruido en sesiones largas.
- `cheap-llm` mueve tareas baratas como resumen a `gemini-2.5-flash-lite`.
- Los plugins de memoria y checkpoints ayudan a reutilizar contexto y evitar trabajo repetido.
- Los perfiles separan uso normal y uso economico.

## Estructura

```text
.
├── agents/
├── agents-library/
├── mcp/
├── plugins/
├── profiles/
├── .env.example
├── agents-index.tsv
├── cron-jobs.json
├── install.sh
├── opencode.jsonc
├── package.json
└── SOUL.md
```

## Instalacion en otro equipo

1. Clona este repo.
2. Ejecuta `./install.sh`.
3. Abre `~/.config/opencode/.env` y agrega tus claves.
4. Reinicia OpenCode.

## Instalacion manual

1. Copia el contenido del repo a `~/.config/opencode/`.
2. Reemplaza `__HOME__` por tu directorio home en `opencode.jsonc`.
3. Reemplaza `__HOME__` por tu directorio home en `profiles/work/opencode.jsonc`.
4. Reemplaza `__HOME__` por tu directorio home en `profiles/personal/opencode.jsonc`.
5. Crea `~/.config/opencode/.env` a partir de `.env.example`.
6. Ejecuta `npm ci --prefix ~/.config/opencode`.
7. Reinicia OpenCode.

## Como funciona

### Plugins

- `memory.js`: guarda memoria persistente del usuario y del proyecto.
- `personalities.js`: cambia la personalidad escribiendo en `SOUL.md`.
- `guardrails.js`: detecta loops y uso repetitivo de tools.
- `checkpoints.js`: crea backups automáticos antes de editar archivos.
- `kanban.js`: tablero simple de tareas persistentes.
- `sandbox.js`: ejecuta comandos en Docker aislado.

### MCP `cheap-llm`

- Expone la tool `summarize`.
- Usa `GOOGLE_API_KEY` o `GEMINI_API_KEY` desde `.env`.
- Sirve para delegar tareas simples a un modelo mas barato y reducir costo.

### Perfiles

- `work`: perfil principal con plugins de memoria, personalidad, guardrails, checkpoints y kanban, con `tail_turns: 4` y `prune: true`.
- `personal`: perfil ligero con menos plugins, con `tail_turns: 3` y `prune: true` para priorizar ahorro.

## Comandos utiles

```bash
./install.sh
npm ci --prefix ~/.config/opencode
opencode
```

## Notas

- Si cambias `opencode.jsonc`, agentes, plugins o MCP, reinicia OpenCode.
- Si vas a compartir este repo, revisa bien no subir tu `.env`.
