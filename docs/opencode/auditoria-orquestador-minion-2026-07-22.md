---
title: Auditoria Orquestador-Minion 2026-07-22
date: 2026-07-22
tags:
  - opencode
  - agentes
  - auditoria
  - optimizacion
status: completed
related:
  - "[[agentes-opencode]]"
  - "[[perfiles-opencode]]"
  - "[[mcp-servers-opencode]]"
---

# Auditoria Orquestador-Minion

> [!success] Resultado
> La configuracion adopta un orquestador potente, subagentes con contexto aislado, modelos por nivel de riesgo, profundidad maxima de uno y verificacion independiente. La compactacion permanece activa como mecanismo de seguridad.

## Antes y despues

| Indicador | Antes | Despues |
|---|---:|---:|
| Agentes activos | 15 | 16 |
| Agentes con modelo explicito | 0/15 | 16/16 |
| Agentes con permisos explicitos | 0/15 | 16/16 |
| Agentes con limite `steps` | 0/15 | 16/16 |
| Agentes originales movidos a modelo economico | 0/15 | 8/15 |
| Agentes que pueden anidar subagentes | No estaba explicitado | 0/16 |
| Proyectos en mapa global | 0 | 3 |
| Pruebas del router local | 21/21 | 21/21 |
| Tamano de `AI Matcher` | 2578 bytes | 820 bytes |
| Total de prompts activos | 160317 bytes | 15740 bytes |
| Promedio por prompt activo | 10688 bytes | 984 bytes |
| Pruebas automatizadas | 21 | 23 |

El total de prompts bajo 90.2% incluso despues de agregar `Verifier`. Se eliminaron biografias, ejemplos extensos, metricas inventadas y activaciones de skills inexistentes.

## Cambios

- `explore`, `scout`, titulos y resumenes usan `openai/gpt-5.4-mini`.
- La compactacion usa `openai/gpt-5.6-sol` para reducir perdida de decisiones.
- Los perfiles `personal` y `light` usan el modelo economico.
- El perfil `work` usa `openai/gpt-5.6-sol`.
- Arquitectura, seguridad, implementacion y verificacion conservan el modelo fuerte.
- Todos los subagentes tienen `task: deny` y `subagent_depth` esta fijado en `1`.
- Los agentes analiticos tienen edicion denegada.
- `Verifier` puede ejecutar validaciones, pero no editar ni delegar.
- Bash queda en `ask` por defecto para agentes operativos, con pruebas y Git de lectura permitidos explicitamente.
- Las imagenes se reducen a un maximo de 1200 por 1200 antes de enviarse al modelo.
- `compaction.auto`, `prune` y seis turnos recientes permanecen activos.
- El mapa global incluye VozArt, Pbot y OpenCode Config Backup.
- `build_repo_map.py` reconstruye el mapa desde las notas y `--check` detecta desactualizacion.
- `query_context.py search` ahora conserva los metadatos del proyecto encontrado.
- El backup preserva solo la seleccion activa de agentes y los agentes regulares como `Verifier`.
- `/handoff` conserva objetivo, decisiones, cambios, evidencia y pendientes entre sesiones.
- `session-metrics.js` registra localmente modelo, tokens, coste, duracion, herramientas y delegaciones sin contenido conversacional.
- `opencode-metrics.js` resume las metricas por periodo y modelo.
- El perfil `light` esta disponible en `opencode-profile`.
- El validador solo revisa claves de proveedores usados y ya no alerta por Gemini obsoleto.
- `memory-v2` se movio a `plugins-disabled/` porque `better-sqlite3` no carga bajo Bun.
- `better-sqlite3` se retiro de dependencias activas, reduciendo 34 paquetes instalados.
- El instalador ya no depende de `rsync` y preserva exactamente la seleccion activa.

## Evidencia

- `opencode run --model openai/gpt-5.4-mini`: `MINI_OK`.
- `opencode-work run`: inicio con `gpt-5.6-sol` y devolvio `WORK_OK`.
- Sesion hija `explore`: `3 EXPLORE_CHILD_OK`.
- Router y telemetria: 23 pruebas aprobadas.
- `python3 ~/tools/agent_context/query_context.py list`: tres proyectos.
- `build_repo_map.py --check`: mapa vigente.
- `opencode debug config`: configuracion cargada sin `ConfigInvalidError`.
- Ejecucion global con telemetria: `GLOBAL_TELEMETRY_OK` y registro agregado correcto.
- Restauracion aislada: 16 agentes, cero symlinks rotos, dependencias instaladas y `opencode debug config` aprobado.

## Limitaciones

> [!warning] Memoria persistente
> `memory-v2` no estaba cargando en OpenCode 1.18.4 porque Bun no soporta `better-sqlite3`. Queda deshabilitado hasta migrarlo a una implementacion SQLite compatible; no debe asumirse memoria persistente.

Ollama continua integrado como asesor mediante MCP, no como subagente operativo con herramientas. La prueba inicial fallo al cubrir el caso de regresion y la reevaluacion paso tras reforzar el prompt; una sola muestra no justifica otorgarle herramientas.

Los ahorros indicados son estructurales. El coste monetario real depende de la frecuencia y longitud de las tareas y debe observarse durante el uso normal.

`npm audit` reporta una vulnerabilidad moderada transitiva en `@hono/node-server` usada por `@modelcontextprotocol/sdk@1.29.0`. El advisory afecta `serve-static` en Windows y este entorno es Linux; la correccion ofrecida implica degradar el SDK a 1.24.3, por lo que se conserva la version actual hasta validar compatibilidad.
