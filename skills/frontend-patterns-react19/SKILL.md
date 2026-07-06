# Frontend Patterns (React 19 + Vite + TypeScript)

Patrones y reglas para desarrollo frontend con React 19, TypeScript y Vite.

## Stack Asumido

- React 19
- TypeScript
- Vite
- No se asume Next.js, Remix u otro framework a menos que se detecte

## Reglas Generales

### React Compiler
- No anadir `useMemo`, `useCallback` ni `memo` por defecto.
- React 19 incluye React Compiler que optimiza automaticamente.
- Solo anadir si hay perfilado que demuestre beneficio.

### Componentes
- Componer, no heredar.
- Componentes pequenos y enfocados.
- Props tipadas con TypeScript.
- Evitar default exports (preferir named exports).

### Estado
- Usar estado local con `useState` primero.
- Context para estado compartido entre componentes cercanos.
- No instalar Zustand, Redux u otras librerias de estado global a menos que sea estrictamente necesario.

### Estilos
- CSS Modules o Tailwind segun lo que ya use el proyecto.
- No mezclar enfoques de estilos.
- Responsive por defecto.

### Accesibilidad
- Roles ARIA donde sea necesario.
- Labels en inputs.
- Contraste suficiente.
- Navegacion por teclado.

## Lo Que NO Hacer

- No generar UI generica tipo "AI slop" (cards de mas, placeholders genericos).
- No asumir componentes de shadcn/ui, MUI, Chakra a menos que ya existan.
- No crear componentes de 300+ lineas.
- No mutar props.

## Output Esperado

```
FRONTEND PATTERNS APPLIED

Componentes creados/actualizados: X
Patron usado: composition / compound / custom hooks
Estado: local / context
Estilos: CSS Modules / Tailwind
Accesibilidad: verified
```
