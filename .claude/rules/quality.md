# Quality rules

The standard `/review-pr` and the `code-reviewer` agent check changes against
this. It is short on purpose — this is a static Astro writing site, not a
backend. Don't invent backend ceremony.

## Gates (must pass — these are the BLOCK conditions)

- `npm run lint` — ESLint clean (0 errors)
- `npm run check` — `astro check`, 0 errors
- `npm run test:coverage` — all tests pass, coverage ≥ 90% on `src/lib/**`
- `npm run build` — succeeds
- `npm run format:check` — Prettier clean

`npm run quality` runs lint + check + coverage + build in one shot.

## Project conventions

- **URL is mirrored** — `SITE_URL` in `src/consts.ts` must match `site` in
  `astro.config.mjs`. RSS links and the sitemap derive from it. A change to one
  without the other is a BLOCK.
- **Frontmatter = the schema** — every post must satisfy `postSchema` in
  `src/lib/schema.ts`. `draft` defaults to `true`. Schema changes must keep
  `public/admin/config.yml` (Sveltia CMS) in sync.
- **Draft model is sacred** — drafts are visible in `astro dev` only, and never
  in the build output or the RSS feed. All three consumers go through
  `listPosts(posts, includeDrafts)` in `src/lib/posts.ts`: pages pass
  `import.meta.env.DEV`, the feed passes `false`. Don't re-inline the filter or
  sort, and don't let a draft leak into the feed.
- **Logic lives in `src/lib`** — anything unit-testable belongs there (pure, no
  `astro:` virtual-module imports), with a colocated `*.test.ts`. New logic in a
  `.astro` frontmatter that could be a pure function should move to `src/lib`
  and get a test. `.astro` templates are covered by check + build, not Vitest.

## Content & markup

- All pages render through `src/layouts/Base.astro`; set a `title` and, where it
  makes sense, a `description` (feeds the `<meta>` description + lists + RSS).
- `lang="zh-Hant-TW"`; prose and UI copy are Traditional Chinese.
- Keep diffs surgical — match the existing Tailwind/utility style, don't
  reformat or "improve" untouched markup.

## Severity guide

- **BLOCK** — a failing gate, a leaked draft, URL/schema desync, a CMS/schema
  mismatch, broken build/types.
- **WARN** — re-inlined draft/sort logic, untested new `src/lib` logic, a page
  missing title/description, accessibility regressions (missing alt, bad heading
  order).
- **SUGGESTION** (max 3) — style/clarity nits worth doing but not blocking.
