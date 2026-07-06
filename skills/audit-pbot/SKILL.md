# Audit: Pbot (Sniper AI Trading Bot)

Auditoría técnica para bot de trading cuantitativo Binance Futures.

## Cuando Usar

Revisión de seguridad financiera, calidad de código, riesgo de producción, deuda técnica o previo a deploy.

## Pilares Obligatorios

### 1. Seguridad Financiera
- Position sizing: ¿límites por operación y drawdown máximo?
- Stop-loss: ¿obligatorio en cada entrada? ¿hardcoded o configurable?
- Risk gates: ¿circuit breakers ante pérdidas consecutivas?
- Conexión exchange: ¿reconexión automática? ¿timeout? ¿rate limiting?
- Modo PAPER/SHADOW/REAL: ¿aislamiento probado?

### 2. Seguridad de API Keys y Secrets
- API keys: ¿solo en .env? ¿gitignored?
- Logs: ¿se filtran keys, tokens o datos sensibles?
- Errors: ¿stack traces expuestos en logs o respuestas?
- `.env.example`: ¿documentado pero sin valores reales?

### 3. Robustez del Runtime
- Graceful shutdown: ¿close de conexiones, cancel de órdenes abiertas?
- Race conditions: ¿orden de ejecución asegurada? ¿locks en estado compartido?
- Manejo de errores: ¿try/except con logging? ¿retry con backoff?
- Memory leaks: ¿RSS monitoreado? ¿objetos no limpiados?

### 4. Calidad de Código
- Tests: ¿coverage 75%+? ¿tests de integración con exchange simulado?
- Tipado: ¿mypy strict_optional? ¿errores de tipo ignorados?
- Linting: ¿ruff sin excepciones? ¿pre-commit pasa?
- Deuda técnica: ¿TODO/FIXME/HACK en código? ¿archivos deprecados sin limpiar?

### 5. Arquitectura
- Acoplamiento: ¿lógica de trading separable del runtime? ¿inyección de dependencias?
- Configuración: ¿valores hardcodeados vs configurables por símbolo?
- Logging: ¿estructurado? ¿niveles correctos (DEBUG/INFO/WARNING/ERROR)?
- Documentación técnica: ¿memoria-tecnica.md actualizada? ¿mejoras-pendientes.md refleja estado real?

## Reglas de Evaluación
- Cada hallazgo requiere EVIDENCIA concreta (archivo:línea).
- No recomendar mejoras que aumenten complejidad sin beneficio medible.
- Priorizar cambios pequeños, reversibles y bajo demanda.
- Distinguir entre: CRÍTICO (pérdida financiera), ALTO (caída del bot), MEDIO (deuda técnica), BAJO (cosmético).

## Output Esperado

```
ARCHIVO | HALLAZGO | SEVERIDAD | RIESGO | EVIDENCIA | MEJORA | COSTO TOKENS | ROI
```

## Veredicto

`MEJORAR` / `DEJAR COMO ESTÁ` / `MEJORAR SOLO CONFIG`
