# ADR 0001: Mejoras OpenCode inspiradas en Fugu

**Fecha:** 2026-06-24
**Contexto:** Auditoría cruzada del repo SakanaAI/fugu reveló prácticas
aplicables a nuestra configuración de OpenCode.

**Decisiones:**

1. **Truncation policy** — Agregar `truncation_policy` en perfiles
   work (48K tokens) y personal (32K) para evitar contextos desbordados.

2. **Safety constraints** — Expandir `SOUL.md` con constraints operativas
   (no kill -9 contra PIDs arbitrarios, no modificar config sin confirmación).

3. **Validación de API keys** — Plugin `validator.js` que verifica formato
   de keys en startup (regex por proveedor).

4. **Injects** — CLI `opencode-inject` + directorio `injects/` para activar
   fragmentos de config bajo demanda (providers, plugins opcionales).

5. **Backup de config** — Extender `checkpoints.js` para backup completo
   de `~/.config/opencode/` antes de cambios en archivos de config.

**Estado:** Implementado.
**Próximo:** Revisar eficacia de truncation policy tras 1 semana de uso.
