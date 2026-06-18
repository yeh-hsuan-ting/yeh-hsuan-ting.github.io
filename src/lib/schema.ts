// Frontmatter schema for the `posts` collection, defined with Astro's bundled
// zod (`astro/zod` — the same instance `astro:schema` exposes) so it can be
// imported and tested outside the Astro runtime. Sveltia CMS
// (public/admin/config.yml) writes fields that map 1:1 to this.
import { z } from 'astro/zod';

export const postSchema = z.object({
  title: z.string(),
  pubDate: z.coerce.date(),
  description: z.string().optional(),
  draft: z.boolean().default(true),
  tags: z.array(z.string()).optional(),
});

export type PostFrontmatter = z.infer<typeof postSchema>;
