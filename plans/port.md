# Context

**Objective:** Port notion-to-static-site to a markdown-based static site generator while preserving the TypeScript + server-side React rendering approach.

## Key Changes

- Replace Notion API fetching with reading markdown files from a `posts/` directory
- Parse YAML frontmatter with `gray-matter`
- Parse markdown to mdast tree with `mdast-util-from-markdown`
- Custom wiki-link syntax `[[page title]]` for easy cross-post linking
- Custom React renderer that walks mdast tree (like the old `render/block.tsx` for Notion blocks)
- Keep the existing rendering infrastructure (typestyle CSS-in-JS, React SSR)

## Relevant Files from notion-to-static-site

| File                   | Purpose                                            | Port Strategy                                        |
| ---------------------- | -------------------------------------------------- | ---------------------------------------------------- |
| `main.ts`              | CLI entry point with fetch/build/serve commands    | Copy, remove "fetch" command, simplify "build"       |
| `config.ts`            | Site configuration (SiteConfig type)               | Copy, simplify (remove Notion-specific fields)       |
| `load-page.ts`         | Loads cached JSON into memory                      | Replace with markdown file loader                    |
| `util.ts`              | Core types (PageWithChildren, RenderContext, etc.) | Copy, replace Notion types with markdown types       |
| `render/page.tsx`      | Renders a page to HTML                             | Copy, adapt to markdown content                      |
| `render/util.tsx`      | pageLayout, pageTemplate, CSS styles               | Copy as-is                                           |
| `render/header.tsx`    | Site header/nav                                    | Copy as-is                                           |
| `render/feed.ts`       | RSS/Atom feed generation                           | Copy, adapt to new types                             |
| `render/sitemap.ts`    | Sitemap generation                                 | Copy, adapt to new types                             |
| `render/rich-text.tsx` | Renders Notion rich text                           | Replace with markdown renderer                       |
| `render/block.tsx`     | Renders Notion blocks                              | Remove (markdown parser handles this)                |
| `package.json`         | Dependencies                                       | Copy, remove `@notionhq/client`, add markdown parser |
| `tsconfig.json`        | TypeScript config                                  | Copy as-is                                           |
| `static/`              | Static assets                                      | Copy as-is                                           |

## New Directory Structure

```
/
├── posts/               # Markdown files with YAML frontmatter
│   └── my-post.md
├── static/              # Static assets
│   └── images/          # Images referenced by posts
├── src/
│   ├── main.ts          # CLI entry point (build, serve)
│   ├── config.ts        # Site configuration
│   ├── types.ts         # Core types
│   ├── parse/
│   │   ├── frontmatter.ts   # gray-matter wrapper
│   │   ├── markdown.ts      # mdast parsing with extensions
│   │   └── wiki-link.ts     # micromark + mdast extension for [[...]]
│   ├── load-posts.ts    # Reads markdown files, returns Post[]
│   └── render/
│       ├── markdown.tsx # Recursive mdast → React renderer
│       ├── page.tsx     # Full page template
│       ├── util.tsx     # pageLayout, pageTemplate, CSS
│       ├── header.tsx   # Site header/nav
│       ├── feed.ts      # RSS/Atom generation
│       └── sitemap.ts   # Sitemap generation
├── dist/                # Build output
├── package.json
└── tsconfig.json
```

## Key Types

```typescript
import type { Root } from "mdast";

// Frontmatter from YAML
type PostFrontmatter = {
  title: string;
  publishDate: string; // ISO date
  shortUrl: string; // URL slug
  tags?: string[];
  draft?: boolean;
};

// Loaded post
type Post = {
  frontmatter: PostFrontmatter;
  content: string; // Raw markdown (after frontmatter stripped)
  ast: Root; // Parsed mdast tree
};

// Custom mdast node for wiki-links
interface WikiLink extends Node {
  type: "wikiLink";
  target: string; // The text inside [[...]]
}

// Render context passed to markdown renderer
type RenderContext = {
  posts: Map<string, Post>; // keyed by shortUrl
  postsByTitle: Map<string, Post>; // for wiki-link resolution
  config: SiteConfig;
  currentPost: Post;
};
```

# Implementation

- [x] **Phase 0: Migrate Notion Content**
  - [x] Run `npm run fetch` in notion-to-static-site to populate `cache/` with JSON (69 pages)
  - [x] Create `scripts/notion-to-markdown.ts`:
    - Read all page JSON from `cache/`
    - For each page:
      - Extract title, publishDate, shortUrl from Notion properties
      - Convert Notion blocks to markdown (heading, paragraph, bulleted_list_item, numbered_list_item, code, image, quote, callout, etc.)
      - Handle rich text (bold, italic, code, links, mentions)
      - Convert page mentions to wiki-links `[[page title]]`
      - Write to `posts/{shortUrl}.md` with YAML frontmatter
      - Mark pages without publishDate as `draft: true`
    - Copy images to `static/images/{postShortUrl}/` with clean filenames
  - [x] Run script and verify output (69 posts: 48 published + 21 drafts, 61 images)
  - [x] Manually review posts for correctness

- [x] **Phase 1: Project Setup**
  - [x] Create directory structure: `src/`, `src/parse/`, `src/render/`, `posts/`, `static/`, `static/images/`
  - [x] Copy `package.json`, update dependencies:
    - Remove: `@notionhq/client`
    - Add: `gray-matter`, `mdast-util-from-markdown`, `mdast-util-gfm`, `micromark-extension-gfm`, `@types/mdast`
  - [x] Copy `tsconfig.json`
  - [x] Run `npm install` to verify dependencies

- [x] **Phase 2: Core Types & Config**
  - [x] Create `src/types.ts` with Post, PostFrontmatter, WikiLink, RenderContext types
  - [x] Copy and simplify `config.ts` → `src/config.ts` (remove Notion-specific fields like rootPageId, rootDatabaseId, tagMap)
  - [x] Verify no type errors

- [x] **Phase 3: Markdown Parsing**
  - [x] Create `src/parse/frontmatter.ts`:
    - Wrapper around `gray-matter`
    - Returns `{ frontmatter: PostFrontmatter, content: string }`
  - [x] Create `src/parse/wiki-link.ts`:
    - Micromark syntax extension to tokenize `[[...]]`
    - Mdast extension to create `wikiLink` nodes
  - [x] Create `src/parse/markdown.ts`:
    - Uses `mdast-util-from-markdown` with GFM + wiki-link extensions
    - Returns mdast `Root` tree
  - [x] Verify no type errors

- [x] **Phase 4: Post Loading**
  - [x] Create `src/load-posts.ts`:
    - Read all `.md` files from `posts/` directory
    - For each file: parse frontmatter, then parse markdown to AST
    - Build `posts` Map (by shortUrl) and `postsByTitle` Map
    - Filter out drafts in production
  - [x] Create a sample post in `posts/` for testing (69 posts already exist from Phase 0)
  - [x] Verify no type errors

- [x] **Phase 5: Rendering Infrastructure**
  - [x] Copy `render/util.tsx` → `src/render/util.tsx` (pageLayout, pageTemplate, CSS)
  - [x] Copy `render/header.tsx` → `src/render/header.tsx`, adapt to new types
  - [x] Copy `render/constants.ts` → `src/render/constants.ts`
  - [x] Copy `render/favicon.tsx` → `src/render/favicon.tsx`
  - [x] Verify no type errors

- [x] **Phase 6: Markdown Renderer**
  - [x] Create `src/render/markdown.tsx`:
    - `renderNode(node: MdastNode, context: RenderContext): ReactElement`
    - Handle all standard mdast types: heading, paragraph, text, emphasis, strong, link, image, code, blockquote, list, listItem, thematicBreak, etc.
    - Handle custom `wikiLink` type: resolve target via `context.postsByTitle`, render as `<a>`
    - `renderChildren(nodes: MdastNode[], context): ReactElement[]` helper
  - [x] Verify no type errors

- [x] **Phase 7: Page Rendering**
  - [x] Create `src/render/page.tsx`:
    - Render post title as `<h1>`
    - Render publish date, tags
    - Call `renderNode()` on `post.ast` for body content
    - Generate prev/next navigation
    - Wrap in `pageLayout()`
  - [x] Verify no type errors

- [x] **Phase 8: Main Entry Point**
  - [x] Create `src/main.ts` with two commands:
    - `build`: load posts → render each → write HTML to `dist/`
    - `serve`: static file server for `dist/`
  - [x] Copy `static/` contents to `dist/` during build
  - [x] Copy `static/black-rectangle.svg` favicon
  - [x] Verify no type errors

- [x] **Phase 9: Feed & Sitemap**
  - [x] Copy and adapt `render/feed.ts` → `src/render/feed.ts`
  - [x] Copy and adapt `render/sitemap.ts` → `src/render/sitemap.ts`
  - [x] Integrate into main.ts build command
  - [x] Verify no type errors

- [x] **Phase 10: End-to-End Test**
  - [x] Test posts already exist (48 published posts from Phase 0)
  - [x] Run `npm run build` - builds 48 posts successfully
  - [x] Verify HTML pages include header, content, prev/next navigation
  - [x] Verify RSS feed generated correctly
  - [x] Verify sitemap.xml generated
  - [ ] Run `npm run serve` and verify in browser (manual step)
