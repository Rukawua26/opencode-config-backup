# Changelog — opencode-config-backup

## 2026-07-17

### Configuración OpenCode
- **MCP Playwright**: desactivado a nivel global (`"enabled": false` en `opencode.jsonc`).
  Ahora solo se activa por proyecto mediante `opencode.json` local con
  `"mcp": { "playwright": { "enabled": true } }`. Contexto más limpio por defecto.
- `cheap-llm`, `context7`, `diagram-generator` permanecen igual (context7 y diagram-generator en `false`).

### Plugin de memoria (`plugins/memory-v2.js`) — inspirado en Gentleman-Programming/engram
Mejoras aplicadas sin romper filosofía cero-deps / local / ahorro de RAM (8 GB).
Verificado: 14/14 pruebas de funcionalidad pasan; migración de `memory.db` real sin pérdida.

- **M1 — Detección de proyecto robusta**: algoritmo de 5 casos
  (`.engram/config.json` para monorepos, `git remote`, raíz git, auto-promoción de hijo,
  `ambiguous` con `availableProjects`). Nueva tool `memory_current_project`.
- **M2 — Scope**: `project` / `personal` / `global`. Upsert `topic_key` por `project+scope+topic_key`.
- **M3 — Higiene**:
  - Soft-delete (`memory_delete`, soft por defecto; `--hard` borra fila). Búsquedas lo ignoran.
  - Dedupe en rolling window por `normalized_hash` (mismo contenido+tipo no crea fila nueva).
  - `review_after` bajo demanda (`memory_review` list/mark_reviewed).
  - Detección lexical de conflict candidates + `memory_judge` (sin LLM automático).
- **M4 — Nudge automático**: recordatorio de 1 línea en system prompt si >15 min sin guardar
  (debounce por sesión, sesión >5 min). Coste de token despreciable.
- **M5 — Redacción `<private>`**: se elimina antes de persistir/buscar.
- **M6 — `memory_suggest_topic_key`**: clave kebab-case 2 niveles (`family/desc`).

### Decisiones de arquitectura
- **NO se migró a Engram MCP (binario Go)**: en máquina con 8 GB (2,4 GiB libres, OpenCode ~1,5 GiB)
  añadiría proceso permanente + round-trips HTTP, rompiendo el límite de RAM. El plugin ya hacía
  inyección selectiva top-N, por lo que la ventaja de tokens de Engram no aplicaba.
- Se incorporó lo útil de la investigación externa (DCP, resumen progresivo, parámetros cortos,
  modo cavernícola) y se rechazó lo que costaba RAM/tokens (binario Go, LLM semántico automático).

### Herramientas del plugin (12)
`memory_current_project`, `memory_signal`, `memory_search_v2`, `memory_context`,
`memory_timeline`, `memory_get`, `memory_update`, `memory_delete`, `memory_review`,
`memory_judge`, `memory_suggest_topic_key`, `memory_summarize_session`.

### Backup
- `memory.db` respaldado en
  `~/.local/share/opencode/plugins-data/memory.db.bak-20260717-165724` antes de migrar el schema.

### Pendiente / fuera de alcance
- Portabilidad entre agentes (requiere backend compartido: Engram binario o servir plugin como MCP).
- Engram Cloud / git-sync / dashboard / TUI / LLM semántico automático para conflict judging.
