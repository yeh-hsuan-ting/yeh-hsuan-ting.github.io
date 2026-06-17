#!/bin/bash
# PreToolUse hook (Bash): hard quality gate before `git push`. Non-agentic — no
# LLM judgment, just runs the same checks CI runs. Exit 2 blocks the push.
#
# Commits stay fast (not gated here); the gate fires on push, the moment work
# leaves the machine. CI (.github/workflows/ci.yml) is the authoritative gate;
# this is the local fast-feedback mirror so Claude never pushes red.

INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty')

# Only act on git push.
echo "$COMMAND" | grep -qE '(^|[^[:alnum:]])git[[:space:]]+push' || exit 0

cd "$CLAUDE_PROJECT_DIR" || exit 0
[ -f package.json ] || exit 0

step() {
  echo "› $1" >&2
  if ! eval "$2" >&2; then
    echo "✗ $1 failed — fix before pushing (push blocked)." >&2
    exit 2
  fi
}

step "lint" "npm run lint --silent"
step "astro check" "npm run check --silent"
step "tests + coverage" "npm run test:coverage --silent"
step "build" "npm run build --silent"

echo "✓ quality gate passed" >&2
exit 0
