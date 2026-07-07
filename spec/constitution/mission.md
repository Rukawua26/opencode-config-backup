# Mission

opencode-custom contains custom OpenCode skills, rules, and supporting artifacts that shape Miguel's AI coding workflow.

## Goals

- Keep reusable workflow knowledge in skills instead of repeating instructions manually.
- Support project-local SDD without global spec context bloat.
- Keep skills concise, actionable, and safe to load on demand.
- Preserve token hygiene by avoiding automatic broad context loading.

## Non-Goals

- Do not store project feature specs globally here.
- Do not duplicate project-specific docs that belong in each repo's `spec/` or docs.
- Do not add config that modifies OpenCode startup behavior without explicit approval.
