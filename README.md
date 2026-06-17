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

### 2. Create a GitHub OAuth App

GitHub → **Settings → Developer settings → OAuth Apps → New OAuth App**
(<https://github.com/settings/applications/new>).

| Field | Value |
| --- | --- |
| Application name | `miscellany CMS` (anything) |
| Homepage URL | your site URL, e.g. `https://miscellany.pages.dev` |
| Authorization callback URL | `https://<WORKER_URL>/callback` (from step 3) |

After creating it, **Generate a client secret**. Keep the **Client ID** and
**Client Secret** for step 3. (Chicken-and-egg: you can put a placeholder
callback now and edit it once the Worker URL exists.)

### 3. Deploy the auth Worker (`sveltia-cms-auth`)

This is the OAuth backend. Source + deploy button:
<https://github.com/sveltia/sveltia-cms-auth>.

```sh
# option A: one-click "Deploy to Cloudflare Workers" button in that repo
# option B: locally
git clone https://github.com/sveltia/sveltia-cms-auth
cd sveltia-cms-auth
npx wrangler deploy
```

Its URL will be `https://sveltia-cms-auth.<SUBDOMAIN>.workers.dev`.
Set these in **Cloudflare dashboard → Workers → (the worker) → Settings →
Variables and Secrets**:

| Variable | Value | Notes |
| --- | --- | --- |
| `GITHUB_CLIENT_ID` | from step 2 | plain text |
| `GITHUB_CLIENT_SECRET` | from step 2 | **Encrypt** |
| `ALLOWED_DOMAINS` | `*.pages.dev,yourdomain.com` | optional but recommended; restricts who can use the worker |

Go back to the GitHub OAuth App (step 2) and set the callback URL to
`https://<WORKER_URL>/callback`.

### 4. Point config.yml at the Worker

In `public/admin/config.yml`:

```yaml
backend:
  name: github
  repo: <your-gh-user>/miscellany
  branch: cms
  base_url: https://sveltia-cms-auth.<SUBDOMAIN>.workers.dev
```

(`base_url` is the Worker origin — **no** `/callback` suffix here.)

### 5. Create the Cloudflare Pages project

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

### 6. Custom domain (optional)

Pages project → **Custom domains → Set up a domain** → enter your domain.
If the domain's DNS is on Cloudflare, the record is added automatically;
otherwise add the shown CNAME at your DNS host. Then update `site` /
`SITE_URL` (step 5), the OAuth App **Homepage URL** (step 2), and add the domain
to `ALLOWED_DOMAINS` (step 3).

---

## Adding posts

See [CONTRIBUTING.md](./CONTRIBUTING.md).
