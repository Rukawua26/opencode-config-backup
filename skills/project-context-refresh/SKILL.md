# Project Context Refresh

Refresca y verifica el contexto del proyecto antes de empezar a trabajar.

## Cuando Usar

- Al iniciar una sesion en un proyecto.
- Si pasaron varios dias desde la ultima vez.
- Si otros developers hicieron cambios.
- Si se movieron, renombraron o eliminaron archivos importantes.

## Flujo

### 1. Verificar Contexto Existente

```python
# Usar el script de query_context si existe
python3 ~/tools/agent_context/query_context.py list
```

### 2. Revisar Agent Context

Si existe `docs/agent-context/`:
- Leer el README o indice de la carpeta.
- Identificar que documentos de contexto existen.

### 3. Revisar Repo Map

Si existe `repo-map.json`:
- Leer estructura general del proyecto.
- Identificar cambios recientes.

### 4. Revisar Summaries

Si existe `summaries/`:
- Leer resumenes relevantes.
- Evitar leer archivos completos si hay resumen.

### 5. Reconstruir Si Es Necesario

Si los archivos cambiaron significativamente:
- Reconstruir el contexto.
- Actualizar `repo-map.json` si existe herramienta para ello.

## Reglas

- No leer arboles completos de archivos si hay contexto disponible.
- Preferir `repo-map.json` y `summaries/` sobre `Read` de directorios grandes.
- Si el script `query_context.py` no existe, verificar manualmente `docs/agent-context/`.
- Despues de refrescar, cargar la informacion relevante en memoria para la sesion.

## Output Esperado

```
CONTEXT REFRESHED

Proyecto: [nombre]
Agent context: [docs/agent-context/] OK / no existe
Repo map: [repo-map.json] OK / no existe
Summaries: [N] disponibles
Cambios detectados: [resumen]
Accion: continuar / reconstruir contexto
```
