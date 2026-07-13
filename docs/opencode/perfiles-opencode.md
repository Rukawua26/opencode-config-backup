---
titulo: "Perfiles OpenCode"
tipo: opencode
categoria: perfiles
tags: [opencode, perfiles, config, status/active, area/config]
relacionado: "[[OpenCode System]], [[OpenCode Config]]"
ultima-actualizacion: 2026-07-13
---
# Perfiles OpenCode

## Resumen
Sistema de perfiles para alternar entre configuraciones según contexto.

| Perfil | Modelo | Plugins | Uso |
|--------|--------|---------|-----|
| `work` | Completo (todos las capacidades) | Los 7 plugins + 3 MCP | Trabajo serio, features complejas |
| `personal` | Ligero (rápido y económico) | Plugins esenciales | Tareas mecánicas, rápidas |

## Ubicación
- `profiles/work/opencode.jsonc`
- `profiles/personal/opencode.jsonc`

## Cambio de perfil
```bash
opencode-profile   # menú interactivo
opencode-work      # directo al perfil work
opencode-personal  # directo al perfil personal
```

## Ver también
- [[OpenCode System]]
- [[Plugins OpenCode]]
