import { describe, it, expect } from 'vitest';
import { byPubDateDesc, isVisible, listPosts, type PostLike } from './posts';

const post = (draft: boolean, date: string): PostLike => ({
  data: { draft, pubDate: new Date(date) },
});

describe('byPubDateDesc', () => {
  it('orders posts newest first', () => {
    const older = post(false, '2026-01-01');
    const newer = post(false, '2026-06-01');
    expect(byPubDateDesc([older, newer])).toEqual([newer, older]);
  });

  it('does not mutate the input array', () => {
    const input = [post(false, '2026-01-01'), post(false, '2026-06-01')];
    const snapshot = [...input];
    byPubDateDesc(input);
    expect(input).toEqual(snapshot);
  });
});

describe('isVisible', () => {
  it('always shows published posts', () => {
    expect(isVisible(post(false, '2026-01-01'), false)).toBe(true);
    expect(isVisible(post(false, '2026-01-01'), true)).toBe(true);
  });

  it('hides drafts unless drafts are included', () => {
    expect(isVisible(post(true, '2026-01-01'), false)).toBe(false);
    expect(isVisible(post(true, '2026-01-01'), true)).toBe(true);
  });
});

describe('listPosts', () => {
  it('excludes drafts and sorts newest first when includeDrafts is false', () => {
    const published = post(false, '2026-01-01');
    const draft = post(true, '2026-06-01');
    expect(listPosts([draft, published], false)).toEqual([published]);
  });

  it('includes drafts when includeDrafts is true, still sorted newest first', () => {
    const published = post(false, '2026-01-01');
    const draft = post(true, '2026-06-01');
    expect(listPosts([published, draft], true)).toEqual([draft, published]);
  });

  it('returns an empty array when given no posts', () => {
    expect(listPosts([], false)).toEqual([]);
  });
});
