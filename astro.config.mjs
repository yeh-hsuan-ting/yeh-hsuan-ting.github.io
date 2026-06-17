// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// IMPORTANT: set this to your real production URL.
// RSS feed links and the sitemap are generated from it.
// Keep it in sync with SITE_URL in src/consts.ts.
export default defineConfig({
  site: 'https://yeh-hsuan-ting.github.io',
  integrations: [mdx(), sitemap()],
});
