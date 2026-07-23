---
title: Evaluacion Minion Local 2026-07-22
date: 2026-07-22
tags: [opencode, ollama, agentes, evaluacion]
status: advisory-only
related:
  - "[[mcp-servers-opencode]]"
  - "[[auditoria-orquestador-minion-2026-07-22]]"
---

# Evaluacion de minion local

## Alcance

Se evaluo `qwen2.5-coder:3b` mediante el MCP local con un ejemplo sintetico y sin acceso a archivos, secretos ni herramientas.

## Criterio

El modelo debia identificar un fallo por ausencia de resultados, proponer un arreglo minimo y crear una prueba que fallara antes del arreglo y pasara despues.

## Resultado inicial

- Identificacion del fallo: PASS.
- Arreglo minimo: PASS con una decision de retorno no especificada por contrato.
- Prueba de regresion: FAIL; probo un caso exitoso y no la ausencia de usuarios activos.

## Decision

El modelo permanece como `untrusted_advisory` y no recibe permisos de lectura directa, edicion, Bash ni delegacion. No se habilita como implementador o verificador autonomo.

Se reforzo su system prompt para exigir que cualquier prueba propuesta cubra el fallo descrito. La promocion futura requiere varias evaluaciones representativas y verificacion independiente.

## Reevaluacion

Con el prompt reforzado, el modelo cubrio tanto el caso exitoso como la ausencia de usuarios activos y propuso una prueba que falla antes del arreglo. El criterio puntual paso, pero una sola muestra no justifica otorgar herramientas; se mantiene la decision `advisory-only`.
