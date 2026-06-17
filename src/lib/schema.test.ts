import { describe, it, expect } from 'vitest';
import { postSchema } from './schema';

describe('postSchema', () => {
  it('accepts a minimal valid post and defaults draft to true', () => {
    const result = postSchema.parse({ title: 'Hello', pubDate: '2026-06-17' });
    expect(result.title).toBe('Hello');
    expect(result.draft).toBe(true);
    expect(result.pubDate).toBeInstanceOf(Date);
  });

  it('coerces an ISO datetime string into a Date', () => {
    const result = postSchema.parse({ title: 'T', pubDate: '2026-06-17T08:30:00Z' });
    expect(result.pubDate.toISOString()).toBe('2026-06-17T08:30:00.000Z');
  });

  it('keeps an explicit draft flag and optional fields', () => {
    const result = postSchema.parse({
      title: 'T',
      pubDate: '2026-06-17',
      description: 'A note',
      draft: false,
      tags: ['notes', 'astro'],
    });
    expect(result.draft).toBe(false);
    expect(result.description).toBe('A note');
    expect(result.tags).toEqual(['notes', 'astro']);
  });

  it('rejects a post missing its title', () => {
    expect(() => postSchema.parse({ pubDate: '2026-06-17' })).toThrow();
  });

  it('rejects a non-date pubDate', () => {
    expect(() => postSchema.parse({ title: 'T', pubDate: 'not-a-date' })).toThrow();
  });

  it('rejects tags that are not an array of strings', () => {
    expect(() => postSchema.parse({ title: 'T', pubDate: '2026-06-17', tags: 'notes' })).toThrow();
  });
});
