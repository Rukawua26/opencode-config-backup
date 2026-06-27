# Implement Spec

Use the `sdd-implement` skill to implement a project-local SDD feature.

Input: `$ARGUMENTS`

Prompt axes:

- Role: act as the project stack specialist.
- Context: use only the requested feature, minimal constitution files, and files listed in `plan.md`.
- Task: complete `tasks.md` one item at a time.
- Restrictions: do not expand scope, do not refactor outside the plan, do not read unrelated specs or broad directories.
- Format: update task/verification artifacts and return commands/files changed.

Rules:

- Require `spec.md`, `plan.md`, and `tasks.md`.
- Treat the spec as the source of truth.
- Implement one task at a time.
- Do not expand scope without updating the spec or plan first.
- Run relevant verification and update `verify.md`.
- Use the loop: implement -> verify -> correct -> verify until the relevant checks pass or a blocker is documented.
- Before marking a task complete, run an anti-hallucination check: read the modified file sections, confirm every API/type/file exists in real code, and confirm no behavior was added outside `spec.md` acceptance criteria.
- Add `Verificacion Anti-Alucinacion` to `verify.md` with concrete evidence.

Expected result:

- Code changes limited to the plan
- Updated task/verification state when useful
- Summary of acceptance criteria validated
