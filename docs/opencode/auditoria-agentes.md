---
titulo: "Auditoria Agentes OpenCode"
tipo: opencode
categoria: agentes
tags: [opencode, agentes, auditoria, status/active, area/config]
relacionado: "[[Agentes OpenCode]], [[Runbook Revisar Agentes]]"
ultima-actualizacion: 2026-07-13
---
# Auditoria Agentes OpenCode

> [!info] Propósito
> Matriz de cobertura para detectar solapamientos y agentes obsoletos. Revisar cada 3 meses con [[Runbook Revisar Agentes]].

## Última revisión
- **Fecha:** 2026-07-13
- **Revisor:** @code-reviewer + @software-architect
- **Hallazgos:** inicial — sin cambios

## Matriz de Cobertura

### Desarrollo
| Agente | Especialidad | Único/Solapa | Último uso |
|--------|-------------|-------------|------------|
| senior-developer | Full-stack Laravel/Livewire/FluxUI | Único (stack específico) | — |
| backend-architect | Backend, APIs, DB, cloud | OK — solapa parcial con software-architect | — |
| frontend-developer | React/Vue/Angular UI | OK | — |
| rapid-prototyper | MVP rápido | Único (velocidad sobre calidad) | — |
| minimal-change-engineer | Diffs mínimos | OK — complementa a code-reviewer | — |
| software-architect | Arquitectura sistémica | OK — más alto nivel que backend-architect | — |

### Calidad y Seguridad
| Agente | Especialidad | Único/Solapa | Último uso |
|--------|-------------|-------------|------------|
| code-reviewer | Revisión de código | ⚠️ solapa con appsec en seguridad | — |
| application-security-engineer | AppSec SDLC | ⚠️ solapa con code-reviewer en revisión | — |
| database-optimizer | BD, queries, índices | Único | — |

### Diseño y UX
| Agente | Especialidad | Único/Solapa | Último uso |
|--------|-------------|-------------|------------|
| ui-designer | UI, componentes, pixel-perfect | ⚠️ solapa con ux-architect en sistemas de diseño | — |
| ux-architect | UX, CSS systems, foundations | ⚠️ solapa con ui-designer | — |
| visual-storyteller | Narrativa visual | Único | — |
| brand-guardian | Identidad de marca | Único | — |

### DevOps e Infra
| Agente | Especialidad | Único/Solapa | Último uso |
|--------|-------------|-------------|------------|
| devops-automator | CI/CD, infra, cloud | Único | — |

### Producto y Negocio
| Agente | Especialidad | Único/Solapa | Último uso |
|--------|-------------|-------------|------------|
| product-manager | Producto full-cycle | Único | — |
| business-strategist | Estrategia business | Único (consultoría) | — |
| experiment-tracker | A/B testing | Único | — |
| incident-response-commander | Incidentes prod | Único | — |

### Documentación y Comunicación
| Agente | Especialidad | Único/Solapa | Último uso |
|--------|-------------|-------------|------------|
| technical-writer | Docs técnicas | Único | — |
| git-workflow-master | Git, branching | Único | — |
| prompt-engineer | Optimización prompts LLM | Único | — |
| codebase-onboarding-engineer | Onboarding codebase | Único | — |

### Marketing y Contenido (12 agentes)
| Agente | Especialidad | Único/Solapa | Último uso |
|--------|-------------|-------------|------------|
| content-creator | Estrategia multi-plataforma | ⚠️ solapa con social-media-strategist | — |
| social-media-strategist | LinkedIn, Twitter | ⚠️ solapa con content-creator | — |
| instagram-curator | Instagram | Único (red específica) | — |
| linkedin-content-creator | LinkedIn | Único (red específica) | — |
| tiktok-strategist | TikTok | Único (red específica) | — |
| seo-specialist | SEO técnico | Único | — |
| ad-creative-strategist | Ads, RSA, Google/Meta | Único | — |
| growth-hacker | Growth, viral loops | Único | — |
| short-video-editing-coach | Edición video | Único | — |
| video-optimization-specialist | YouTube | Único | — |

### Soporte y Evaluación
| Agente | Especialidad | Único/Solapa | Último uso |
|--------|-------------|-------------|------------|
| support-responder | Soporte al cliente | Único | — |
| tool-evaluator | Evaluación herramientas | Único | — |

## Solapamientos detectados (⚠️)

| Par | Gravedad | Recomendación |
|-----|---------|---------------|
| code-reviewer ↔ appsec-engineer | Media | code-reviewer: bugs+lógica+mantenibilidad. appsec: SAST/DAST+threat modeling+vulns. División clara, mantener ambos. |
| ui-designer ↔ ux-architect | Media | ui-designer: pixel-perfect+componentes. ux-architect: foundations+CSS systems+accesibilidad. Mantener ambos. |
| content-creator ↔ social-media-strategist | Alta | Fusionar en un solo agente `content-strategist` que cubra ambas áreas. |
| backend-architect ↔ software-architect | Baja | backend-architect: implementación. software-architect: diseño sistémico. Diferente nivel de abstracción. Mantener. |

## Decisiones pendientes
- [ ] Evaluar fusión `content-creator` + `social-media-strategist` → `content-strategist`
- [ ] Rellenar columna "Último uso" en próxima revisión (2026-10)

## Historial de revisiones
| Fecha | Cambios |
|-------|---------|
| 2026-07-13 | Auditoría inicial — matriz creada, 4 solapamientos detectados |
