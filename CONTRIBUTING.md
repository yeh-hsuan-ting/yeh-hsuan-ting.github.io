# Adding a post

A post is a Markdown file in `src/content/posts/`. Frontmatter must satisfy the
zod schema in `src/content.config.ts`:

| Field         | Type     | Required            | Notes                             |
| ------------- | -------- | ------------------- | --------------------------------- |
| `title`       | string   | yes                 |                                   |
| `pubDate`     | date     | yes                 | `2026-06-17` or ISO datetime      |
| `description` | string   | no                  | used in lists + `<meta>` + RSS    |
| `draft`       | boolean  | no (default `true`) | `true` = hidden from build & feed |
| `tags`        | string[] | no                  |                                   |

The Markdown body below the frontmatter is the post content.

## Option A — locally, in your editor

```sh
# new file: src/content/posts/my-post.md  (filename becomes the URL slug)
npm run dev      # preview at http://localhost:4321 — drafts show here
```

```markdown
---
title: My post
pubDate: 2026-06-17
description: One line for the index and feed.
draft: false
tags:
  - notes
---

Write here.
```

Commit to `main` to publish (drafts stay hidden until `draft: false`):

```sh
git add src/content/posts/my-post.md
git commit -m "Add: my post"
git push
```

## Option B — from the web, at `/admin`

1. Go to `https://<your-site>/admin` and **Sign in with Token** (a GitHub PAT — see README step 2).
2. **Posts → New Post**, fill the fields, write in the Markdown editor, **Save**.
3. Saving commits to the **`cms`** branch — this does **not** deploy.
4. To publish: merge `cms` → `main` (open a PR on GitHub and merge it, or
   locally `git checkout main && git merge cms && git push`). Make sure the
   post's **Draft** toggle is off so it appears on the live site.

See the "Draft → publish model" section in [README.md](./README.md) for why it
works this way.
