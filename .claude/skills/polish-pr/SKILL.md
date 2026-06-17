---
name: polish-pr
description: Iterative review→fix→review cycle until the PR is clean. Addresses BLOCKs, WARNs, and reasonable suggestions, and always ends on a fresh review that confirms the gates are green.
user-invocable: true
argument-hint: [PR number, branch, or empty for current branch vs main]
---

Run `/review-pr` → fix findings → `/review-pr` → … until clean. Always ends on a
review so the win condition is confirmed, not assumed.

Target: $ARGUMENTS (PR number, branch name, or empty for current branch vs
`main`.)

## Win condition (all true on the FINAL review)

- 0 BLOCK
- 0 WARN
- All reasonable SUGGESTIONs implemented (or explicitly declined with a reason)
- Gates green: lint, `astro check`, tests + coverage ≥ 90% on `src/lib`, build,
  `format:check`

## Loop

1. **Review** — run `/review-pr` against the target. Collect findings into a
   checklist.
2. **Stop?** — if 0 BLOCK, 0 WARN, and no reasonable suggestions remain, go to
   Done.
3. **Fix** — work the checklist. BLOCKs first, then WARNs, then suggestions.
   - Surgical diffs only — fix what's flagged, don't refactor untouched code.
   - For each fix, the change should trace to a specific finding.
   - Follow `.claude/rules/quality.md`; respect the draft model and the
     URL/schema mirrors.
   - The PostToolUse hook auto-formats and `eslint --fix`es on save.
4. **Re-review** — run `/review-pr` again on the updated tree. Back to step 2.

Guard against thrash: if the same finding survives two fix attempts, stop and
ask the user rather than guessing.

## Done

State the final review result and confirm each gate is green. If you declined
any suggestion, say which and why. Do not push — leave that to the user (the
push will re-run the local quality gate anyway).
