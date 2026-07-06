# API Docs Resolver

Evita alucinaciones con APIs de librerias externas verificando versiones y documentacion antes de escribir codigo.

## Cuando Usar

- Antes de usar una API externa que no esta confirmada en el repo.
- Cuando la libreria es nueva, mayor version reciente o conocida por breaking changes.
- Cuando el error sugiere API obsoleta, import incorrecto o cambio de contrato.

## Trigger

Activa esta skill cuando:

- Se toque Next.js, React, Tauri, ccxt, FastAPI, OpenAI/Anthropic/Gemini SDKs u otra libreria externa.
- El usuario pida evitar alucinaciones de APIs.
- Exista documentacion local bajo `node_modules/`, `.venv/`, `docs/` o README de paquete.

## Flujo

### 1. Identificar Libreria Y Version

- Lee `package.json`, lockfile, `requirements*.txt`, `pyproject.toml` o comando equivalente.
- Anota version exacta.

### 2. Buscar Docs Locales Primero

- Node: README/docs bajo `node_modules/<package>/`.
- Python: `pip show`, docs del paquete si estan vendorizadas o tests existentes.
- Proyecto: `docs/`, `AGENTS.md`, tech-stack.md.

### 3. Verificar API Real

- Confirma imports, nombres, parametros y ejemplos contra codigo real o docs.
- Si no hay fuente local suficiente, usa web fetch/documentacion externa.
- No escribas codigo basado solo en memoria del modelo.

### 4. Registrar Aprendizaje

- Si detectas API no obvia o breaking change, guarda memoria de alto valor.
- Incluye version, API correcta y fuente.

## Output Esperado

```txt
API DOCS RESOLVED

Library: ...
Version: ...
Source checked: ...
API confirmed: YES/NO
Notes: ...
```
