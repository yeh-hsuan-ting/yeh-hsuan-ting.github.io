# miscellany

A minimal, reading-focused writing site. Astro + TypeScript, content as Markdown
in a content collection, [Sveltia CMS](https://sveltiacms.app) at `/admin` for
web editing, deployed to Cloudflare Pages.

- **Content**: `src/content/posts/*.md` — schema enforced by zod in `src/content.config.ts`.
- **Drafts**: `draft: true` posts are excluded from the build and the RSS feed
  (visible only in `npm run dev`).
- **Fonts**: self-hosted variable woff2 (Inter for UI, Newsreader for body) in
  `public/fonts/` — no runtime font fetches.

## Develop

```sh
npm install
npm run dev        # http://localhost:4321  (drafts visible here)
npm run build      # -> dist/  (drafts excluded)
npm run preview    # serve the built dist/
npm run check      # astro check (types)
```

---

## Draft → publish model (important)

Sveltia CMS has **no editorial-workflow yet** (planned pre-1.0). It commits
directly to whatever branch `config.yml` points at on every save. To get
"save drafts without deploying," this repo uses a **branch split**:

- The CMS (`public/admin/config.yml`) commits to the **`cms`** branch.
- Cloudflare Pages builds **production from `main` only**.
- **Saving in `/admin` never triggers a production deploy.**
- **Publishing = merge `cms` → `main`** (e.g. open a PR on GitHub and merge,
  or `git checkout main && git merge cms && git push`).

`draft: true` is a second, independent layer: even after you merge to `main`,
a post stays out of the live site and feed until you flip it to `draft: false`.

> So the full lifecycle is: write in `/admin` (→ `cms`) → merge `cms`→`main`
> when ready to deploy → set `draft: false` to actually surface the post.

---

## Manual steps to take it live

These can't be done from code — do them once, in order. Replace every
`<PLACEHOLDER>`.

### 1. Push this repo to GitHub

```sh
git init
git add -A
git commit -m "Initial scaffold"
gh repo create miscellany --private --source=. --remote=origin --push
git push -u origin main
git branch cms main && git push -u origin cms   # create the CMS branch
```

Then in `public/admin/config.yml` set `repo: <your-gh-user>/miscellany`.

### 2. Authentication — "Sign in with Token" (no Worker, default)

Sveltia authenticates with a GitHub **Personal Access Token** stored in your
browser. **Nothing to deploy** — no OAuth App, no Cloudflare Worker.

1. Create a token at <https://github.com/settings/tokens>:
   - **Fine-grained** (recommended): *Generate new token* → Resource owner: your
     account → **Only select repositories → `miscellany`** → Repository
     permissions → **Contents: Read and write** (Metadata: Read is added
     automatically).
   - or **classic**: tick the **`repo`** scope.
2. Open `https://<your-site>/admin`, click **Sign in with Token**, paste it.

`config.yml` needs no `base_url` for this — it's already configured this way.

<details>
<summary>Optional: OAuth login flow instead (smoother UX / multiple editors)</summary>

Only worth it if non-technical people will edit, or you dislike pasting a token.

1. **OAuth App** — <https://github.com/settings/applications/new>: Homepage =
   your site URL, Authorization callback URL = `https://<WORKER_URL>/callback`
   (fill in after the next step). Generate a client secret; keep Client ID + Secret.
2. **Deploy the Worker** — `sveltia-cms-auth`
   (<https://github.com/sveltia/sveltia-cms-auth>), via its one-click deploy
   button or `npx wrangler deploy`. URL: `https://sveltia-cms-auth.<SUB>.workers.dev`.
   In **Workers → that worker → Settings → Variables and Secrets** set
   `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` (**Encrypt**), and optional
   `ALLOWED_DOMAINS` (e.g. `*.pages.dev,yourdomain.com`). Set the OAuth App
   callback to `<WORKER_URL>/callback`.
3. **config.yml** — add `base_url: https://sveltia-cms-auth.<SUB>.workers.dev`
   under `backend:` (Worker origin, **no** `/callback` suffix).

</details>

### 3. Create the Cloudflare Pages project

Cloudflare dashboard → **Workers & Pages → Create → Pages → Connect to Git** →
pick this repo.

| Setting | Value |
| --- | --- |
| Production branch | `main` |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Framework preset | Astro (or None) |
| Node version (env var `NODE_VERSION`) | `22` |

**Stop preview builds on the `cms` branch** so saving drafts doesn't burn build
minutes: Pages project → **Settings → Builds & deployments → Branch control /
Preview deployments → set to "None"** (or include only branches that aren't
`cms`). Production stays on `main`.

After the first deploy, set your real URL in two places and redeploy:

- `astro.config.mjs` → `site`
- `src/consts.ts` → `SITE_URL`

(RSS links + sitemap depend on this.)

### 4. Custom domain (optional)

Pages project → **Custom domains → Set up a domain** → enter your domain.
If the domain's DNS is on Cloudflare, the record is added automatically;
otherwise add the shown CNAME at your DNS host. Then update `site` / `SITE_URL`
(step 3). *(If you went the OAuth route, also update the OAuth App Homepage URL
and add the domain to `ALLOWED_DOMAINS`.)*

---

## Adding posts

See [CONTRIBUTING.md](./CONTRIBUTING.md).
