---
title: 你好，世界
pubDate: 2026-06-17
description: 第一篇文章——順便快速導覽這個網站是怎麼搭起來的。
draft: false
tags:
  - meta
  - astro
---

這是一篇已發布的文章。它會出現在首頁、擁有自己的頁面，也會出現在 RSS 訂閱裡。

## 草稿是怎麼運作的

在 frontmatter 裡設定 `draft: true`，這篇文章就會被排除在正式建置與訂閱之外。當你執行
`npm run dev` 時它仍然會顯示，所以你可以在發布前先在本機預覽。

> 想新增文章，可以在本機把一個 Markdown 檔丟進 `src/content/posts/`，或者從網頁上的
> `/admin` 新增。
