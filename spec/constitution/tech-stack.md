# Tech Stack

## Tecnologias Y Versiones

- Primary artifacts: OpenCode skills in `skills/<name>/SKILL.md`.
- Related config: `~/.config/opencode/opencode.jsonc` loads `/home/miguel/opencode-custom/skills` through `skills.paths`.
- Existing skills include debugging, verification, TDD, security review, frontend/backend patterns, audit skills, and SDD workflow skills.
- Commands live globally under `~/.config/opencode/commands/` when needed.

## Estructura Del Proyecto

- `skills/<name>/SKILL.md`: reusable workflow instruction units.
- `spec/constitution/`: SDD constitution for this skills repo.
- `spec/features/`: specs for changes to skills or workflow behavior.
- Related global commands are outside this repo in `~/.config/opencode/commands/`.

## Arquitectura Y Flujo De Datos

- Skills are loaded on demand by OpenCode according to task fit.
- Skills should instruct behavior; they should not store project-specific feature specs.
- SDD skills operate on the current project's local `./spec/` directory.
- Verification skills should record evidence in project-local `verify.md` when part of SDD.

## Convenciones

- Every skill should explain when to use it, workflow, restrictions and expected output.
- Keep skills concise and composable.
- Prefer project-local context over broad global context.
- If a skill affects startup-time behavior, mention restart requirements.
- Preserve ASCII unless the file already justifies Spanish/non-ASCII text.

## Umbrales de Calidad

- **Tests**: Cobertura minima esperada 70% backend / 50% frontend. No bloquea.
- **Deps**: Solo `--audit-level=critical` bloquea. LOW/MODERATE son INFO.
- **Accesibilidad**: Obligatoria para cambios en `.tsx`, `.jsx`, `.html`, `.css`.
- **Git hooks**: pre-commit = lint + typecheck (no bloquea). pre-push = full tests (bloquea).
- Instalar hooks con: `ln -sf ~/tools/auto-verify.sh <project>/.git/hooks/pre-commit`

## Comandos

```bash
# Markdown-only repo; no build step required.
# Restart OpenCode after adding/changing skills or commands if they are loaded at startup.
```

## Nivel SDD

- Nivel: Spec-Anchored.
- La spec se mantiene viva y actualizada.
- Cada cambio importante se registra en spec o plan antes que en codigo.
- Specs en: `spec/constitution/` y `spec/features/`.

## Estilo Visual

- No visual UI.
- Markdown should be scannable with short headings and operational checklists.

## Prohibiciones

- Do not create `/home/miguel/spec/` as a global spec source.
- Do not store project feature specs in this repo.
- Do not duplicate large project docs inside global skills.
- Do not modify `~/.config/opencode/` config behavior without explicit user approval.
- Do not add broad auto-loaded context that increases tokens for unrelated projects.
