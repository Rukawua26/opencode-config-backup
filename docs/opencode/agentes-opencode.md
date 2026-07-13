---
titulo: "Agentes OpenCode"
tipo: opencode
categoria: agentes
tags: [opencode, agentes, config, status/active, area/config]
relacionado: "[[OpenCode System]], [[OpenCode Config]]"
ultima-actualizacion: 2026-07-13
---
# Agentes OpenCode

## Sistema de Agentes
Dos niveles de agentes en el ecosistema OpenCode:

### 1. Agentes de Producción (35)
Hand-crafted para uso diario. Ubicados en `agents/` dentro del backup.

| Agente | Función |
|-------|---------|
| senior-developer | Full-stack dev (Laravel/Livewire/FluxUI) |
| product-manager | Gestión de producto |
| backend-architect | Arquitectura backend |
| frontend-developer | Frontend React/Vue/Angular |
| code-reviewer | Code review constructivo |
| devops-automator | CI/CD e infraestructura |
| ui-designer | Diseño UI |
| database-optimizer | Optimización BD |
| software-architect | Arquitectura de software |
| application-security-engineer | AppSec |
| technical-writer | Documentación |
| git-workflow-master | Git y branching |
| rapid-prototyper | MVP rápido |
| minimal-change-engineer | Diffs mínimos |
| prompt-engineer | Optimización prompts |
| codebase-onboarding-engineer | Onboarding codebase |
| business-strategist | Estrategia business |
| growth-hacker | Growth marketing |
| content-creator | Estrategia contenido |
| seo-specialist | SEO |
| social-media-strategist | Social media |
| instagram-curator | Instagram |
| linkedin-content-creator | LinkedIn |
| tiktok-strategist | TikTok |
| short-video-editing-coach | Edición video |
| video-optimization-specialist | YouTube |
| ad-creative-strategist | Ads |
| brand-guardian | Branding |
| visual-storyteller | Visual storytelling |
| ux-architect | UX |
| experiment-tracker | A/B testing |
| incident-response-commander | Incidentes |
| tool-evaluator | Evaluación herramientas |
| support-responder | Soporte |

### 2. Agentes Library (233)
Curados por división funcional. Ubicados en `agents-library/` dentro del backup.

| División | # Agentes | Cobertura |
|----------|-----------|-----------|
| marketing | 37 | Social media, SEO, content, ads, China |
| engineering | 25 | Backend, frontend, DevOps, AI, mobile |
| specialized | 39 | Business/technical domains |
| design | 8 | UI, UX, brand, visual, accessibility |
| security | 8 | AppSec, pentest, threat intel, compliance |
| product | 5 | PM, sprint, feedback, trends |
| sales | 8 | Sales engineering, strategy, coaching |
| support | 6 | Customer support, analytics, legal |
| finance | 4 | Accounting, FP&A, investment, tax |
| testing | 6 | QA, accessibility, API, performance |
| project-management | 7 | PM, operations |
| paid-media | 6 | PPC, programmatic, tracking, audit |
| game-development | 17 | Unity, Unreal, Godot, Roblox |
| gis | 10 | Mapping, spatial data, cartography |
| academic | 4 | Geography, psychology, anthropology |

### Índice
- `agents-index.tsv` — TSV con slug, división, descripción y tags de los 233 agentes.

## Invocación
En OpenCode: `@nombre-del-agente`

## Ubicación
- Backup: `opencode-config-backup/agents/` y `opencode-config-backup/agents-library/`
- Integración: `~/.config/opencode/agents/`

## Ver también
- [[OpenCode System]]
- [[Plugins OpenCode]]
- [[Agentes Library]]
