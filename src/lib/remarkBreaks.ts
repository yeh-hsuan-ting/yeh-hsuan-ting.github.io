import { visit, SKIP } from 'unist-util-visit';
import type { Root, Text, Break } from 'mdast';

/**
 * remark plugin — 把段落內的「軟換行」(單一 \n) 轉成硬換行 (break 節點)，
 * 顯示文章的分行。掛在 astro.config.mjs 的 markdown.processor。
 *
 * 外層只在 build 開始時跑 1 次；回傳的 transformer 每篇文章跑 1 次。
 */
export default function remarkBreaks() {
  return (tree: Root) => {
    visit(tree, 'text', (node, index, parent) => {
      if (index === undefined || parent === undefined) return;
      if (!node.value.includes('\n')) return;

      // 'a\nb\nc' → text('a'), break, text('b'), break, text('c')
      const replacement = node.value
        .split('\n')
        .flatMap(
          (value, i): Array<Text | Break> =>
            i === 0 ? [{ type: 'text', value }] : [{ type: 'break' }, { type: 'text', value }],
        );

      // 把原本那顆 text 換成這一串，游標跳到插入節點之後（避免重訪）
      parent.children.splice(index, 1, ...replacement);
      return [SKIP, index + replacement.length];
    });
  };
}
