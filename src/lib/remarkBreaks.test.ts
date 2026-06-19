import { describe, it, expect } from 'vitest';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import type { Root, Paragraph, Text } from 'mdast';
import remarkBreaks from './remarkBreaks';

/**
 * Helper：把 Markdown parse 成 mdast，跑 plugin，回傳第一段每個子節點的 type。
 * 這就是「mock」—— 不必啟動整個 Astro，直接在 mdast 樹上觀察 plugin 的效果。
 */
function childTypes(md: string): string[] {
  const tree = unified().use(remarkParse).parse(md) as Root;
  remarkBreaks()(tree); // ← 直接呼叫 transformer，tree 會被就地修改
  const paragraph = tree.children[0] as Paragraph;
  return paragraph.children.map((child) => child.type);
}

describe('remarkBreaks', () => {
  it('單一換行 → text, break, text', () => {
    expect(childTypes('床前明月光\n疑是地上霜')).toEqual(['text', 'break', 'text']);
  });

  it('沒有換行 → 原樣不動', () => {
    expect(childTypes('床前明月光')).toEqual(['text']);
  });

  it('多行 → 每個換行一個 break', () => {
    expect(childTypes('一\n二\n三')).toEqual(['text', 'break', 'text', 'break', 'text']);
  });

  it('前後多餘的 \\n 會被濾掉，不產生前導/尾隨 break', () => {
    const tree: Root = {
      type: 'root',
      children: [{ type: 'paragraph', children: [{ type: 'text', value: '\nfoo\n' }] }],
    };
    remarkBreaks()(tree);
    const paragraph = tree.children[0] as Paragraph;
    expect(paragraph.children.map((child) => child.type)).toEqual(['text']);
  });

  it('root 層的 text node（沒有 parent/index）→ guard 直接跳過，不動它', () => {
    const lone: Text = { type: 'text', value: 'a\nb' };
    remarkBreaks()(lone as unknown as Root);
    expect(lone.value).toBe('a\nb');
  });
});
