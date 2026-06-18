# miscellany

A minimal, reading-focused writing site. Astro + TypeScript, content as Markdown
in a content collection, [Sveltia CMS](https://sveltiacms.app) at `/admin` for
web editing, deployed to GitHub Pages (user site at `https://yeh-hsuan-ting.github.io`).

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
- The GitHub Pages Action builds **only on push to `main`** (see `.github/workflows/deploy.yml`).
- **Saving in `/admin` never triggers a deploy.**
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

### 1. Repo on GitHub — done

The repo is public at **`yeh-hsuan-ting/yeh-hsuan-ting.github.io`** (a GitHub
_user site_), with a `main` branch (production) and a `cms` branch (CMS commits).
`public/admin/config.yml` already targets it. Nothing to do here.

### 2. Authentication — "Sign in with Token" (no Worker, default)

Sveltia authenticates with a GitHub **Personal Access Token** stored in your
browser. **Nothing to deploy** — no OAuth App, no Cloudflare Worker.

1. Create a token at <https://github.com/settings/tokens>:
   - **Fine-grained** (recommended): _Generate new token_ → Resource owner: your
     account → **Only select repositories → `yeh-hsuan-ting.github.io`** →
     Repository permissions → **Contents: Read and write** (Metadata: Read is
     added automatically).
   - or **classic**: tick the **`repo`** scope.
2. Open `https://yeh-hsuan-ting.github.io/admin`, click **Sign in with Token**, paste it.

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

### 3. Enable GitHub Pages (one click, once)

The deploy workflow (`.github/workflows/deploy.yml`) is already committed — it
builds with `withastro/action@v6` on every push to `main` and publishes to Pages.
You just need to point Pages at it:

- Repo → **Settings → Pages → Build and deployment → Source: GitHub Actions**.

That's it. The next push to `main` runs the Action and the site goes live at
`https://yeh-hsuan-ting.github.io/` (first run takes a couple of minutes; watch
the **Actions** tab). `site`/`SITE_URL` are already set, so RSS + sitemap are
correct. Drafts stay out of the build; `cms`-branch saves never deploy.

### 4. Custom domain (optional)

Repo → **Settings → Pages → Custom domain** → enter your domain; GitHub writes a
`CNAME` file to the repo. Add the DNS records GitHub shows at your DNS host, then
update `site` in `astro.config.mjs` and `SITE_URL` in `src/consts.ts` to the new
URL.

---

## Adding posts

See [CONTRIBUTING.md](./CONTRIBUTING.md).
