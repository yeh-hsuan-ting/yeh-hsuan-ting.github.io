import { glob } from 'astro/loaders';
import { defineCollection } from 'astro:content';
import { postSchema } from './lib/schema';

// The frontmatter schema lives in ./lib/schema so it is unit testable.
// Sveltia CMS (public/admin/config.yml) writes fields that map 1:1 to it.
const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
  schema: postSchema,
});

export const collections = { posts };
