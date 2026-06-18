#!/bin/bash
# PostToolUse hook (Edit|Write): auto-format, then auto-fix lint, on the touched
# file. Best-effort — never blocks the edit (always exits 0).

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')
[ -z "$FILE_PATH" ] && exit 0
[ -f "$FILE_PATH" ] || exit 0

cd "$CLAUDE_PROJECT_DIR" || exit 0

case "$FILE_PATH" in
  *.astro | *.ts | *.tsx | *.js | *.jsx | *.mjs | *.md | *.mdx | *.json | *.css)
    npx prettier --write "$FILE_PATH" 2>/dev/null
    ;;
esac

case "$FILE_PATH" in
  *.astro | *.ts | *.tsx | *.js | *.jsx | *.mjs)
    npx eslint --fix "$FILE_PATH" 2>/dev/null
    ;;
esac

exit 0
