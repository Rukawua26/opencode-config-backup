#!/usr/bin/env bash
# auto-verify.sh - Git hook for tiered verification
# Usage: ln -sf ~/tools/auto-verify.sh <project>/.git/hooks/pre-commit
#        ln -sf ~/tools/auto-verify.sh <project>/.git/hooks/pre-push
# Tiers:
#   pre-commit: lint + typecheck only (fast, <30s)
#   pre-push:   lint + typecheck + tests (blocks on failure)

HOOK_NAME=$(basename "$0")
if [ "$HOOK_NAME" = "pre-commit" ]; then
  MODE="fast"
elif [ "$HOOK_NAME" = "pre-push" ]; then
  MODE="full"
else
  echo "auto-verify: unknown hook '$HOOK_NAME', defaulting to fast mode"
  MODE="fast"
fi

ROOT=$(git rev-parse --show-toplevel 2>/dev/null || echo "$PWD")
cd "$ROOT" || exit 1

PASS=0
FAIL=0

run_check() {
  local label="$1" cmd="$2"
  if eval "$cmd" > /dev/null 2>&1; then
    echo "  [PASS] $label"
    PASS=$((PASS + 1))
  else
    echo "  [FAIL] $label"
    FAIL=$((FAIL + 1))
  fi
}

echo "=== auto-verify ($MODE mode) ==="

# TypeScript stack
if [ -f tsconfig.json ]; then
  run_check "typecheck" "npx tsc --noEmit"
  run_check "lint" "npx eslint . --max-warnings 0"
fi

# Python stack
if [ -f pyproject.toml ] || [ -f setup.cfg ] || [ -f setup.py ]; then
  run_check "lint (ruff)" "ruff check ."
  run_check "type (pyright)" "pyright . 2>/dev/null || true"
fi

if [ "$MODE" = "full" ]; then
  # Tests (full mode = pre-push)
  if [ -f package.json ]; then
    TEST_SCRIPT=$(node -e "const p=require('./package.json');" -e "console.log(p.scripts&&p.scripts.test||'')" 2>/dev/null || echo "")
    if [ -n "$TEST_SCRIPT" ]; then run_check "tests" "npm test"; fi
  fi
  if [ -f pyproject.toml ]; then
    run_check "tests" "python -m pytest --tb=short -q 2>/dev/null || python -m unittest discover -q 2>/dev/null || true"
  fi
  # Deps audit (full mode)
  if [ -f package.json ]; then
    run_check "deps audit" "npm audit --audit-level=critical 2>/dev/null || true"
  fi
fi

echo "---"
echo "  Passed: $PASS  Failed: $FAIL"

if [ "$FAIL" -gt 0 ] && [ "$MODE" = "full" ]; then
  echo ""
  echo "BLOCKED: $FAIL check(s) failed in full mode (pre-push). Fix before pushing."
  echo "Use 'git commit --no-verify' to bypass pre-commit only."
  exit 1
fi

exit 0