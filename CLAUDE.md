# CLAUDE.md

## 行為準則

1. **先想再寫**
   - 不要假設，把假設明確講出來
   - 不懂就問，不要藏困惑
   - 有多種解讀就攤開來講，不要默默挑一個
   - 有更簡單的做法就推回去
   - 動手前先把 tradeoff 攤開

2. **簡單優先**
   - 解決問題的最少 code，不寫投機性的東西
   - 不加沒被要求的功能
   - 單次使用不寫抽象
   - 沒被要求的「彈性」「可配置」不加
   - 檢驗：「資深工程師會說這太複雜嗎？」會的話就重寫

3. **手術式修改**
   - 只改該改的，只清自己弄髒的
   - 不順手「改善」旁邊的 code、comment、formatting、markup
   - 沒壞的不重構
   - 配合現有風格（Tailwind utility、檔案慣例），就算你會寫不同
   - 檢驗：「每一行改動都能追溯到使用者的要求嗎？」

4. **目標驅動**
   - 定義驗收條件，跑到驗證通過為止
   - 「修 bug」→「寫重現測試，然後讓它過」
   - 多步驟任務先列計畫和每步的驗證條件

## What is this

**miscellany（雜記）** — a personal static writing site. Astro 6 + Tailwind v4 +
MDX, content authored in Markdown or via Sveltia CMS (`/admin`), Traditional
Chinese (`zh-Hant-TW`), deployed to GitHub Pages.

- Posts live in `src/content/posts/*.md` and must satisfy `postSchema`
  (`src/lib/schema.ts`).
- **Draft model**: drafts show in `astro dev` only — never in the build output
  or the RSS feed. Everything routes through `listPosts()` in `src/lib/posts.ts`.
- **Publish flow**: CMS saves to the `cms` branch (no deploy); publishing is a
  `cms → main` merge/PR. Push to `main` builds + deploys (`.github/workflows/deploy.yml`).
- Testable logic lives in `src/lib/**` (pure, no `astro:` imports), with a
  colocated `*.test.ts`. `.astro` templates are covered by check + build.

## Build, test, quality

```bash
npm run dev            # local preview at :4321 (drafts visible)
npm run build          # static build → dist/ (drafts excluded)

npm run lint           # ESLint
npm run check          # astro check (types + content diagnostics)
npm run test           # Vitest
npm run test:coverage  # Vitest + coverage (≥ 90% on src/lib)
npm run format         # Prettier --write
npm run quality        # lint + check + test:coverage + build (the full gate)
```

The gate runs two places: **CI** (`.github/workflows/ci.yml`, authoritative, on
every PR/push) and **locally** via a Claude hook that blocks `git push` if any
check fails. A PostToolUse hook auto-formats + `eslint --fix`es on every edit.

## Skills

- `/review-pr` — review the current branch (or a PR) against
  `.claude/rules/quality.md`; delegates to the read-only `code-reviewer` agent.
- `/polish-pr` — review → fix → review loop until 0 BLOCK + 0 WARN and all gates
  green.

Use them: review before opening/merging a PR, polish to drive findings to zero.

## Rules

- `SITE_URL` (`src/consts.ts`) must stay in sync with `site` (`astro.config.mjs`).
- Schema changes must stay in sync with `public/admin/config.yml` (Sveltia CMS).
- Never let a draft reach the build or the feed.
- Content voice is Traditional Chinese.
