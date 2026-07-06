# Audit: VozArt (React + Fabric.js + AI Multimodal)

Auditoría técnica para app creativa con AI, WebSocket y Android.

## Cuando Usar

Revisión de seguridad AI, calidad frontend/backend, estado mobile, o previo a release.

## Pilares Obligatorios

### 1. Seguridad AI (crítico)
- Prompt injection: ¿entrada de usuario sanitizada antes de llegar al LLM? ¿system prompt hardcodeado o configurable?
- API keys: ¿solo en servidor? ¿cliente tiene acceso a claves de AI providers?
- Respuestas del LLM: ¿validadas antes de mostrar al usuario? ¿podrían contener HTML/JS malicioso?
- Rate limiting: ¿límite de requests por usuario a los AI providers?
- Provider fallback: ¿si Gemini falla, prueba OpenAI/Claude/Ollama?

### 2. Seguridad WebSocket
- Validación de mensajes: ¿schemas definidos para cada tipo de mensaje?
- Autenticación: ¿conexiones anónimas permitidas? ¿origen validado?
- Rate limiting: ¿protección contra DoS vía WebSocket?
- Reconexión: ¿cliente reconecta automáticamente? ¿manejo de estado inconsistente?

### 3. Testing (brecha principal)
- Tests unitarios: ¿existe algún test? (actual: CERO)
- Tests de integración: ¿WebSocket + AI providers simulados?
- Tests visuales: ¿Fabric.js canvas renderizado correctamente?
- Prioridad: qué testear primero (AI providers > WebSocket > Canvas > Mobile)

### 4. Frontend (React 19 + Fabric.js 7)
- Manejo de errores: ¿ErrorBoundary en componentes clave? ¿errores de AI atrapados?
- Memoria: ¿Fabric.js objetos limpiados al desmontar? ¿event listeners removidos?
- Estado: ¿WebSocket reconecta sin perder estado del canvas?
- Performance: ¿canvas se re-renderiza innecesariamente?

### 5. Mobile (Capacitor Android)
- Permisos: ¿AndroidManifest permisos mínimos o excesivos?
- Build: ¿APK firmado? ¿versión code consistente con package.json?
- Splash/iconos: ¿presentes para todas las densidades?
- ProGuard: ¿reglas de ofuscación configuradas?

### 6. Backend (Express + WebSocket)
- Middleware: ¿CORS configurado correctamente? ¿body parser con límite?
- Errores: ¿manejador global de errores Express? ¿errores de AI expuestos al cliente?
- Logging: ¿estructurado? ¿secrets en logs?

## Reglas de Evaluación
- Cada hallazgo requiere EVIDENCIA concreta (archivo:línea).
- No recomendar mejoras que aumenten tokens sin beneficio claro.
- Priorizar seguridad AI y testing sobre refactors estéticos.
- Distinguir entre: CRÍTICO (fuga de datos), ALTO (caída del servicio), MEDIO (deuda técnica), BAJO (cosmético).

## Output Esperado

```
ARCHIVO | HALLAZGO | SEVERIDAD | RIESGO | EVIDENCIA | MEJORA | COSTO TOKENS | ROI
```

## Veredicto

`MEJORAR` / `DEJAR COMO ESTÁ` / `MEJORAR SOLO CONFIG`
