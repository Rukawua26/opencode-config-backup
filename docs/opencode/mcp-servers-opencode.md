---
titulo: "MCP Servers OpenCode"
tipo: opencode
categoria: mcp
tags: [opencode, mcp, config, status/active, area/config]
relacionado: "[[OpenCode System]], [[OpenCode Config]]"
ultima-actualizacion: 2026-07-13
---
# MCP Servers OpenCode

## Resumen
3 MCP servers integrados en `opencode.jsonc`.

| Server | Propósito | Tools |
|--------|-----------|-------|
| cheap-llm | Resúmenes ligeros con Gemini Flash Lite | `summarize` |
| context7 | Docs actualizadas de librerías | `resolve-library-id`, `query-docs` |
| diagram-generator | Diagramas Draw.io / Mermaid / Excalidraw | `generate_diagram`, `validate_diagram_spec`, `get_config`, `init_config` |

## cheap-llm
- **Modelo**: Gemini Flash Lite
- **Uso**: Cuando un documento excede ~200 líneas y solo necesitas estructura/resumen
- **Ventaja**: No consume contexto del modelo principal

## context7
- **Uso**: Consultar docs de librerías externas antes de escribir código
- **Evita**: APIs obsoletas por datos de entrenamiento desfasados

## diagram-generator
- **Formatos**: `.drawio` (complejos editables), `.mmd` (Mermaid en docs), `.excalidraw`
- **Convención**: Diagramas de arquitectura en `/docs/architecture/`
- **Distribución**: Izquierda a derecha para flujos de datos

## Ver también
- [[OpenCode System]]
- [[Plugins OpenCode]]
