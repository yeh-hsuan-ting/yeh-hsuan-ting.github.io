---
name: review-pr
description: Code review against project standards. Delegates diff-reading and the quality gates to the code-reviewer subagent; main thread spot-checks the riskiest changes. Use to review a PR or the current branch.
user-invocable: true
argument-hint: [PR number, branch, or empty for current branch vs main]
---

Review a pull request or the current branch against `.claude/rules/quality.md`.
Heavy lifting (diff reading, running the gates, cross-referencing rules) is
delegated to the `code-reviewer` subagent; the main thread spot-checks the
highest-risk changes.

Target: $ARGUMENTS (PR number, branch name, or URL. If empty, review the current
branch against `main`.)

## Step 1 — Scope (main thread, metadata only)

Run `git diff main...HEAD --stat` (or `gh pr diff <n> --stat` for a PR number) to
capture the file list and line counts. Do NOT read the diff contents yet — that
is the subagent's job.

## Step 2 — Delegate to the code-reviewer subagent

Spawn **one** agent with `subagent_type: "code-reviewer"`. Brief it with:

- The diff target (from $ARGUMENTS, or `main...HEAD`)
- The file/line stats from Step 1

It will read the diff, run the gates (lint / check / test:coverage / build /
format:check), check the project conventions, and return the strict JSON report.

## Step 3 — Main-thread spot-check (highest-risk only)

Read directly — don't take the subagent's word — for any change that touches:

- The draft model: `src/lib/posts.ts`, `rss.xml.js`, page `getCollection` calls
- `src/lib/schema.ts` or `public/admin/config.yml` (must stay in sync)
- `src/consts.ts` ↔ `astro.config.mjs` URL mirror

Confirm or correct the subagent's findings on these paths.

## Step 4 — Report

Present a concise summary grouped by severity:

- **BLOCK** (must fix) — failing gates first, then correctness
- **WARN** (should fix)
- **SUGGESTION** (max 3, optional)
- **Gates**: lint / check / tests + coverage% / build / format — pass or fail

State the verdict plainly: clean, or N blocks / M warns to address. Do not fix
anything here — that's `/polish-pr`.
