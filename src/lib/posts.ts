// Shared post-selection logic, kept free of `astro:` imports so it is unit
// testable. The `.astro` pages and the RSS feed all funnel through `listPosts`
// instead of re-inlining the draft filter and sort.

/** The minimal shape these helpers need from a content-collection entry. */
export interface PostLike {
  data: {
    draft: boolean;
    pubDate: Date;
  };
}

/** Newest first, by publish date. Does not mutate the input. */
export function byPubDateDesc<T extends PostLike>(posts: T[]): T[] {
  return [...posts].sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());
}

/**
 * Whether a post should appear. Drafts are shown only when `includeDrafts` is
 * true — that flag is `import.meta.env.DEV` for pages (preview drafts locally)
 * and always false for the RSS feed (a draft must never reach the feed).
 */
export function isVisible(post: PostLike, includeDrafts: boolean): boolean {
  return includeDrafts || !post.data.draft;
}

/** The canonical list: visible posts, newest first. */
export function listPosts<T extends PostLike>(posts: T[], includeDrafts: boolean): T[] {
  return byPubDateDesc(posts.filter((post) => isVisible(post, includeDrafts)));
}
