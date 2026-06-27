# 🚀 Configuración Completa de OpenCode | Tu Entorno de Desarrollo Portátil

## 🎯 ¿Qué es este repositorio?

**Configuración portátil y lista para usar de OpenCode** que te permite **reiniciar tu entorno de desarrollo completo en segundos** en cualquier computadora, sin necesidad de volver a configurar nada.

<quotestyle>
"Mi trabajo es demasiado personalizado, ¡y no quiero perderlo!"
</quotestyle>

---
## 📦 ¿Qué incluye? (Lo esencial para programar)

### 🧠 Brains y Personalidades
- 📨 **Agentes activos**: 20+ agentes especializados (backend, frontend, seguridad, revisión de código, diseño, etc.)
- 📚 **Librería completa**: 40+ plantillas de agentes con prompts detallados
- 🎭 **Personalidad base**: `SOUL.md` con mi estilo de trabajo único

### ⚡ Rendimiento Optimizado para Menos Tokens
- 📉 **Compacidad inteligente**: Reduce automáticamente el contexto cuando crece demasiado
- 🎯 **Configuración económica**: `tail_turns: 4` en `work`, `tail_turns: 3` en `personal`
- 🗑️ **Poda automática**: Elimina outputs viejos durante la compactación
- 💰 **Modelo económico**: `cheap-llm` usa `gemini-2.5-flash-lite` para tareas simples

### 🛠️ Herramientas Esenciales
- 💾 **Memoria persistente**: Guarda contexto entre sesiones automáticamente
- 🔍 **Detección de loops**: Evita el uso repetitivo y tokens infinitos
- 📋 **Checkpoints**: Backup automático antes de editar archivos críticos
- 🎲 **Sandbox Docker**: Ejecuta comandos aislados y seguros
- 📊 **Kanban integrado**: Tareas persistentes con estado visual

### 🔌 Conectividad MCP
- 🤖 **cheap-llm MCP**: SIRVE para tareas baratas como resumir o traducir
- 🔑 **Seguro**: Usa `GOOGLE_API_KEY` o `GEMINI_API_KEY` desde `.env`

### 🌐 Perfiles Especializados
- ⚡ **work**: Producción con todas las funciones (full features)
- 🎒 **personal**: Uso económico con menos tokens y más ligero

---
## 🏗️ Arquitectura Visual: Cómo funciona todo juntos

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  ~/.config/opene │    │   GitHub Repo   │    │  ~/Escritorio /  │
│     d           │    │                 │    │  Cualquier PC   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                      │                       │
         │ Clona/clona          │                    │
         ▼                      ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  opencode.jsonc │───▶│   install.sh    │◀───│  config personalizada │
│ (servidor local) │    │ (un comando!)    │    │  (tu .env)            │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                      │                       │
         └──────────────────────┼───────────────────────┘
                                ▼
┌─────────────────────────────────────────────────────────────┐
│  .opencode/                                                  │
│  ├─ agents/               → Agentes listos para usar       │
│  ├─ agents-library/       → Plantillas completas           │
│  ├─ plugins/              → memory, personalities, etc.    │
│  ├─ profiles/             → work ✓ personal               │
│  ├─ mcp/                  → cheap-llm MCP                   │
│  ├─ opencode.jsonc        → Config global principal       │
│  ├─ SOUL.md              → Mi personalidad base          │
│  └─ .env.example         → Plantilla de claves seguras     │
└─────────────────────────────────────────────────────────────┘

                 ↓
┌─────────────────────────────────────────────────────────────┐
│  Dos clics → npm ci → reiniciar OpenCode                    │
│  ¡Y LISTO! Todo restaurado                                    │
└─────────────────────────────────────────────────────────────┘
```

---
## 🚀 Instalación rápida (En 3 pasos)

### Paso 1: Clona el backup
```bash
git clone https://github.com/Rukawua26/opencode-config-backup.git
```

### Paso 2: Ejecuta la magia
```bash
cd opencode-config-backup
./install.sh
```

### Paso 3: Agrega tus claves personales
```bash
# Abre ~/.config/opencode/.env y agrega tus API keys
# Luego reinicia OpenCode
```

<tips>Pro tip: Guarda este repo como `~/.config/opencode-backup/` y úsalo como template</tips>

---
## 🎛️ Instalación manual (para_copy-paste)

1. **Copia la configuración**
   ```bash
   cp -r /ruta/a/opencode-config-backup/.config/opencode ~/.config/opencode
   ```

2. **Reemplaza los marcadores de posición**
   ```bash
   # Encuentra todos los __HOME__ y reemplázalos con tu directorio home
s   sed -i "s|__HOME__|${HOME}|g" ~/.config/opencode/opencode.jsonc
   ```

3. **Agrega tus secretos**
   ```bash
   cp ~/.config/opencode/.env.example ~/.config/opencode/.env
   # Edita ~/.config/opencode/.env y agrega tus API keys
   ```

4. **Instala dependencias**
   ```bash
   cd ~/.config/opencode
   npm ci
   ```

5. **¡A trabajar!**
   ```bash
   opencode
   ```

---
## 🔐 Qué protected (y qué no)

### ✅ SEGURO para subir a GitHub
- 🔑 **Nada**: Archivos `.env`, `node_modules/`, estado local generado
- 🗂️ **Todo**: Configuración, agentes, plugins, dependencias necesarias
- 🛡️ **Cifrado**: Claves API solo en `.env` (¡local!)

### ❌ OJO con estos archivos
```text
.env                → Contiene API keys, ¡NO subir!
node_modules/        → Se reinstala con npm ci
~/.local/share/...  → Estado local personal
```

---
## 💼 Perfiles: Trabajo vs Uso Personal

| Característica | `work` (⚡ Producción) | `personal` (🎒 Ocasional) |
|---------------|----------------------|--------------------------|
| **Plugins** | Memoria, Personalidades, Guardrails, Checkpoints, Kanban | Solo memoria + personalidad |
| **Costos** | Canón con todas las funciones | Más económico y rápido |
| **Memoria** | `tail_turns: 4` | `tail_turns: 3` (ahorro) |
| **Ideal para** | Programación diaria, proyectos activos | Consulta rápida, bajo costo |

---
## 🤖 Los agentes que uso diariamente

### Agentes principales:
- 🧠 **agent-adjuster**: Optimiza prompts y contexto
- 🔍 **code-reviewer**: Revisa cambios por arquitectura/seguridad/rendimiento
- 🛡️ **security-reviewer**: Detección de riesgos y hardening
- ⚡ **trading-runtime-reviewer**: Seguridad en tiempo real

### Agentes especializados:
- 🔧 **debugging-and-error-recovery**: Solución de problemas específica
- 🎨 **code-simplification**: Limpieza de código sin cambios funcionales
- 📊 **code-review-and-quality**: Revisor general
- 🎲 **decomposition**: Divide tareas complejas

---
## ⚡ Comandos útiles rápidamente

```bash
# Instala todo
./install.sh

# Si hubo cambios
npm ci --prefix ~/.config/opencode

# Ejecuta OpenCode
opencode

# ¡Usa tus agentes!
# Type "@cualquier-agente" o usa comandos integrados
```

---
## 🏆 ¿Por qué esta configuración es especial?

1. **Rendimiento**: Funciona con menos tokens gracias a compactación inteligente
2. **Portabilidad**: Same experiencia en cualquier PC, incluso fuera de casa
3. **Seguridad**: Nada que exponga secretos al subir a GitHub
4. **Especialización**: Diseñado específicamente para desarrollo intensivo en TypeScript/React/Node.js
5. **Mantenimiento**: Plantillas de agents-factura + lib de library-listos-para-usar

---
## 🚀 Próximos pasos

- 🌍 **Comparte**: ¡Ayuda a otros desarrolladores a tener su mismo entorno!
- 📈 **Mantén**: Añade más habilidades, agents o mejoras con `git log --oneline --graph`
- 💝 **Dona**: Si te ayudó, comparte con otros 🚀

---
## 📊 Estadísticas rápido

- ⭐ **Destellas**: Configuración actualizada con todo el rigor que usas diariamente
- 📁 **Archivos**: 150+ archivos con rica documentación
- 🔑 **Seguridad**: ".env" nunca subido, todas las claves privadas
- 🧠 **Tokens**: Optimizado específicamente para menor costo
- 💤 **Automatización**: install.sh hace todo automáticamente

---
## 🎓 Cómo contribuir

1. **Lee** la documentación en `.opencode/context/` primero
2. **Fork** este repo y haz cambios
3. **Crea** un PR con commit messages claros
4. **Verifica** todo con las validaciones CI (`./.github/workflows/ci.yml`)

<note>Si tienes dudas, pregunta con: `/ask ayuda Configuración OpenCode`</note>

---

*_Creamos espaciotemporalmente independiente — siempre disponible para programar, debuggear y optimizar el trabajo._*

---
*(Versión: $(git log --oneline -1 | cut -d' ' -f1)) | $(date +"%Y-%m-%d")} | [Rukawua26](https://github.com/Rukawua26)