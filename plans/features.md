# Context

**Objective:** Add featured posts, tag pages, special pages directory, and script-generated home page/navigation.

## Current State

- Posts in `posts/` with frontmatter: title, publishDate, shortUrl, tags, draft
- Tags in use: `tech`, `climbing`, `education`, `etc`
- `src/render/index.tsx` renders a chronological post list as index.html
- `src/render/header.tsx` renders a simple header with home link + RSS/newsletter links
- `src/render/feed.ts` generates RSS/Atom for all posts

## Key Types

```typescript
// Add to PostFrontmatter
featured?: boolean;

// Add to SiteConfig
tags: string[];  // Tags that get dedicated pages
pagesDir: string;  // Directory for special pages (e.g., "pages")
```

## Files to Modify/Create

- `src/types.ts` - add `featured` to PostFrontmatter
- `src/config.ts` - add `tags` array and `pagesDir`
- `src/render/home.tsx` - NEW: script-generated home page with featured posts
- `src/render/archive.tsx` - NEW: full post archive (current index.tsx logic)
- `src/render/tag-page.tsx` - NEW: per-tag post list page
- `src/render/header.tsx` - modify to include tag links and special page links
- `src/render/feed.ts` - add per-tag feed generation
- `src/load-posts.ts` - add loading of special pages from `pages/`
- `src/main.ts` - integrate new renderers

# Implementation

- [x] **Phase 1: Add featured flag to types**
  - [x] Update `PostFrontmatter` in `src/types.ts` to add `featured?: boolean`
  - [x] Verify no type errors

- [x] **Phase 2: Update config**
  - [x] Add `tags: string[]` to SiteConfig (e.g., `["tech", "climbing", "education", "etc"]`)
  - [x] Add `pagesDir: string` to SiteConfig (e.g., `"pages"`)
  - [x] Update `siteConfig` in `src/config.ts` with values
  - [x] Verify no type errors

- [x] **Phase 3: Create archive page**
  - [x] Rename/refactor `src/render/index.tsx` → `src/render/archive.tsx`
  - [x] Rename function `renderIndex` → `renderArchive`
  - [x] Output to `archive.html` instead of `index.html`
  - [x] Update `src/main.ts` to use `renderArchive`
  - [x] Verify no type errors

- [x] **Phase 4: Create home page**
  - [x] Create `src/render/home.tsx`
  - [x] Filter posts by `featured: true` and show at top
  - [x] Show all posts in chronological order below featured section
  - [x] Output to `index.html`
  - [x] Integrate into `src/main.ts`
  - [x] Verify no type errors

- [x] **Phase 5: Create tag pages**
  - [x] Create `src/render/tag-page.tsx`
  - [x] `renderTagPage(tag: string, posts: Map, config)` - filter posts by tag, render list
  - [x] Generate `{tag}.html` for each tag in config.tags
  - [x] Integrate into `src/main.ts` build loop
  - [x] Verify no type errors

- [x] **Phase 6: Per-tag feeds**
  - [x] Modify `src/render/feed.ts` to accept optional tag filter
  - [x] Create `renderTagFeed(tag: string, posts: Map, config)`
  - [x] Output to `{tag}/rss` and `{tag}/atom`
  - [x] Integrate into `src/main.ts` build loop
  - [x] Verify no type errors

- [x] **Phase 7: Load special pages**
  - [x] Create `pages/` directory
  - [x] Create a sample page (e.g., `pages/about.md` with title, shortUrl frontmatter, no publishDate)
  - [x] Add `Page` type to `src/types.ts` (similar to Post but no publishDate required)
  - [x] Update `src/load-posts.ts` to also load pages from `pagesDir`
  - [x] Return `{ posts, postsByTitle, pages }` from loader
  - [x] Verify no type errors

- [x] **Phase 8: Render special pages**
  - [x] Modify `src/render/page.tsx` to handle Page type (no date/prev/next)
  - [x] Integrate into `src/main.ts` build loop
  - [x] Verify no type errors

- [x] **Phase 9: Update header navigation**
  - [x] Modify `src/render/header.tsx` to accept config
  - [x] Add tag links (tech, climbing, education, etc)
  - [x] Add special page links (from loaded pages, filtered by some criteria like `showInNav: true`)
  - [x] Update all callers of `renderHeader()`
  - [x] Verify no type errors

- [ ] **Phase 10: Mark featured posts**
  - [ ] Add `featured: true` to a few posts in `posts/`
  - [x] Run build, verify home page shows featured posts
  - [x] Verify tag pages work
  - [x] Verify special pages render
  - [x] Verify header navigation includes all links

- [x] **Phase 11: End-to-end test**
  - [x] Run `npm run build`
  - [x] Verify index.html shows featured + recent posts
  - [x] Verify archive.html shows all posts
  - [x] Verify {tag}.html pages exist and filter correctly
  - [x] Verify {tag}/rss and {tag}/atom feeds exist
  - [x] Verify special pages render
  - [x] Verify header has tag and page links
