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
      const arr = node.value.split('\n'); // [a , b], given a\nb

      let i;
      const newChildren: Array<Text | Break> = [];
      for (i = 0; i < arr.length; i++) {
        newChildren.push({ type: 'text', value: arr[i] });
        if (i !== arr.length - 1) {
          // not last item
          newChildren.push({ type: 'break' });
        }
      }

      // replace the original one with the new children
      parent.children.splice(index, 1, ...newChildren);

      // control cursor to process the next item
      return [SKIP, index + newChildren.length];
    });
  };
}
