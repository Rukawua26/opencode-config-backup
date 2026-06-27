# Verify Spec

Verify a project-local SDD feature against its acceptance criteria.

Input: `$ARGUMENTS`

Rules:

- Read only the requested feature under `./spec/features/` and relevant changed files.
- Compare implementation against `spec.md` acceptance criteria.
- Run checks from `plan.md` when available.
- Use the `verification-loop` skill for full project verification when appropriate.
- Record results in `spec/features/<feature>/verify.md`.

Expected result:

- PASS/FAIL status
- Commands executed
- Criteria validated
- Remaining issues, if any
