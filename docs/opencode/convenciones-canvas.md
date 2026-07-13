---
titulo: "Convenciones Canvas"
tipo: opencode
categoria: convenciones
tags: [opencode, canvas, convenciones, status/active, area/config]
relacionado: "[[OpenCode System]], [[Ecosistema OpenCode.canvas]]"
ultima-actualizacion: 2026-07-13
---
# Convenciones Canvas

## Regla de oro
**Canvases ≤ 30 nodos.** Si un canvas crece más, dividir en sub-canvases temáticos.

## Razón
- Obsidian se vuelve pesado renderizando canvases de 50+ nodos
- OpenCode procesa JSON canvas grande con costo de tokens alto
- Un canvas de 30 nodos ya cubre un mapa mental completo sin abrumar

## Estructura recomendada
| Canvas | Máx nodos | ¿Dividir si crece? |
|--------|----------|-------------------|
| `Ecosistema OpenCode.canvas` | 30 | `Ecosistema OpenCode - Plugins.canvas`, `Ecosistema OpenCode - Agentes.canvas`, `Ecosistema OpenCode - MCP.canvas` |
| `Mapa de Proyectos.canvas` | 30 | `Mapa VozArt.canvas`, `Mapa Pbot.canvas` |
| Nuevos canvases | 20-30 | Dividir al llegar a 35 nodos |

## Convenciones de nodos
- **Color 6 (morado):** nodos raíz / dashboard
- **Color 4 (verde):** proyectos
- **Color 1 (rojo):** riesgos / crítico
- **Color 5 (amarillo):** backups / persistencia
- **Grupos:** usar `type: group` para agrupar nodos relacionados (ej: "Plugins", "MCP Servers")
- **Labels en edges:** describir relación ("usa", "contiene", "depende de")

## Verificación
Cada weekly review: contar nodos en cada canvas activo. Si alguno ≥30, planificar división.

## Ver también
- [[Ecosistema OpenCode.canvas]]
- [[Mapa de Proyectos.canvas]]
- [[OpenCode System]]
