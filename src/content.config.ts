import { glob } from 'astro/loaders';
import { defineCollection } from 'astro:content';
import { z } from 'astro:schema';

// Frontmatter schema for the `posts` collection.
// Sveltia CMS (public/admin/config.yml) writes fields that map 1:1 to this.
const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    pubDate: z.coerce.date(),
    description: z.string().optional(),
    draft: z.boolean().default(true),
    tags: z.array(z.string()).optional(),
  }),
});

export const collections = { posts };
