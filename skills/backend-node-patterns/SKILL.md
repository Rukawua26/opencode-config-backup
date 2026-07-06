# Backend Patterns (Node.js + Express + TypeScript)

Patrones y reglas para desarrollo backend con Node.js, TypeScript y Express.

## Stack Asumido

- Node.js (LTS)
- TypeScript
- Express
- No se asume NestJS, Fastify u otro framework a menos que se detecte

## Reglas Generales

### Estructura
- Separacion minima en capas: rutas -> servicios -> acceso a datos.
- Cada archivo con una responsabilidad clara.
- Modular, no orientado a clases gigantes.

### API Design
- RESTful sobre GraphQL por defecto.
- URLs basadas en recursos (`/api/markets/:id`).
- Query params para filtrado, sorting y paginacion.
- Verbos HTTP correctos (GET, POST, PUT, PATCH, DELETE).

### Validacion
- Todo input validado con esquema (Zod) antes de procesar.
- Validacion en el middleware, no en el handler.

### Errores
- Errores consistentes con formato unificado.
- No exponer stack traces ni detalles internos.
- Errores de validacion devueltos como 400 con detalles.
- Errores de autenticacion como 401, autorizacion como 403.

### Env Variables
- Toda config via environment variables.
- Validacion de existencia al iniciar la app.
- Valores por defecto solo para desarrollo.

### Logging
- Usar logger estructurado (pino, winston) si ya existe.
- No usar `console.log` en produccion.
- Logs de error con contexto suficiente.

### Performance
- Prevenir N+1 queries.
- Usar `SELECT` con columnas especificas, no `SELECT *`.
- Paginacion en listas (limit/offset o cursor).
- Cachear respuestas cuando sea apropiado.

## Lo Que NO Hacer

- No sobrearquitecturar con patrones innecesarios (CQRS, Event Sourcing, etc.) para APIs simples.
- No crear DTOs/Entidades separadas si no hay beneficio claro.
- No usar clases para todo; funciones tipadas bastan.

## Output Esperado

```
BACKEND PATTERNS APPLIED

Estructura: routes / services / data access
API style: RESTful
Validacion: Zod
Logging: [logger usado]
Performance: paginated, N+1 checked
```
