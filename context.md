# Amusements - Static Site Generator

A TypeScript-based static site generator for a personal blog.

## Commands

- `npm run build` - Build the site to `docs/`
- `npm run serve` - Serve the built site locally (port 1337)

## Directory Structure

```
posts/           # Markdown blog posts
pages/           # Static pages (about, etc.)
static/          # Static assets (copied to docs/)
src/
  config.ts      # Site configuration (SiteConfig)
  types.ts       # Type definitions
  main.ts        # CLI entry point (build/serve commands)
  load-posts.ts  # Loads posts and pages from markdown files
  parse/
    frontmatter.ts  # YAML frontmatter parsing
    markdown.ts     # Markdown to AST parsing
  render/
    home.tsx        # Home page (index.html) - featured + all posts
    archive.tsx     # Archive page (archive.html) - chronological list
    tag-page.tsx    # Per-tag pages ({tag}.html)
    page.tsx        # Individual post/page rendering
    header.tsx      # Site header with nav links
    feed.ts         # RSS/Atom feed generation
    sitemap.ts      # Sitemap generation
    util.tsx        # Shared layout utilities
    constants.ts    # Shared styles (COLORS)
docs/            # Build output
```

## Types

### Blog Post Style Guidelines

- **Avoid phrases and patterns that are markers of AI-generated text.** Readers are increasingly attuned to these and find them offputting. Examples include em-dashes (—) and phrases like "the calculus flips." Use commas, parentheses, colons, or separate sentences instead of em-dashes. More generally, prefer plain, direct phrasing over flourishes that sound like an LLM wrote them.- **Always link external references.** When referring to an external fact, person's work, talk, paper, article, or any claim that originates outside the author's own experience, include a markdown link to a primary source. Prefer linking to the original source (e.g., the actual talk/paper) over secondary summaries.

### Post Frontmatter

```yaml
title: string # Post title
publishDate: string # ISO date (e.g., "2024-01-15")
shortUrl: string # URL slug (becomes {shortUrl}.html)
tags?: string[] # Optional tags (e.g., ["tech", "climbing"])
draft?: boolean # If true, excluded from build
featured?: boolean # If true, shown in "highlighted posts" section
```

### Page Frontmatter

```yaml
title: string # Page title
shortUrl: string # URL slug
showInNav?: boolean # If true, appears in header navigation
```

### SiteConfig (src/config.ts)

- `homeName` - Site name displayed in header
- `postsDir` - Directory for blog posts (default: "posts")
- `pagesDir` - Directory for static pages (default: "pages")
- `staticDir` - Directory for static assets (default: "static")
- `outDir` - Build output directory (default: "docs")
- `tags` - Tags that get dedicated pages (e.g., ["tech", "climbing", "education", "etc"])
- `buttondownId` - Newsletter integration ID
- `mastodonHref` - Mastodon profile link

## Build Process

1. Clear and recreate `docs/` directory
2. Copy static files from `static/` to `docs/`
3. Load posts from `posts/` and pages from `pages/`
4. Render each post to `{shortUrl}.html`
5. Render each static page to `{shortUrl}.html`
6. Render home page to `index.html` (featured + all posts)
7. Render archive to `archive.html`
8. Render tag pages to `{tag}.html` for each configured tag
9. Generate RSS/Atom feeds (`/rss`, `/atom`, `/{tag}/rss`, `/{tag}/atom`)
10. Generate sitemap

## Rendering Stack

- React (JSX) for templating
- typestyle for CSS-in-JS
- mdast for markdown AST manipulation
- Custom markdown extensions in `src/parse/`:
  - **wiki-link.ts** - `[[Title]]` syntax that resolves to other posts
  - **captioned-image.ts** - Images with multi-line captions (see below)

## Custom Markdown Syntax

### Wiki Links

```
[[Post Title]]
```

Resolves to another post by title.

### Captioned Images

```
::image[alt text](/path/to/image.jpg)
Multi-line caption with *formatting* and [links](url).
Source attribution, etc.
::
```

- Alt text goes in brackets (for screen readers)
- Caption supports full markdown formatting
- Caption renders in italics below the image

### YouTube Embeds

Standalone YouTube URLs on their own line are automatically embedded:

```
https://www.youtube.com/watch?v=VIDEO_ID
https://youtu.be/VIDEO_ID
https://www.youtube.com/shorts/VIDEO_ID
```

Inline links like `[text](https://youtube.com/...)` remain as regular links.

## Scripts

- `npx tsx scripts/notion-to-markdown.ts` - Converts Notion JSON cache to markdown files
  - Reads from `notion-to-static-site/cache/`
  - Outputs to `posts/` directory
  - Copies images to `static/images/{post-shortUrl}/`
  - Handles captioned images with the `::image` syntax

## Research Notes

Research notes live in `notes/` subdirectories (e.g., `notes/human-level-ai-predictions/`).

### Citation Requirements

**Every factual claim in research notes must include a URL where that information can be verified.**

Format citations inline after the claim:

```
OpenAI lost approximately $5B in 2024. [source](https://example.com/article)
```

Or use footnote-style for multiple citations:

```
OpenAI's infrastructure commitments total $1.4T over 8 years.[^1]

[^1]: https://example.com/openai-infrastructure-deals
```

Do NOT use placeholder citation formats like `<cite index="1-6">` - these are not real citations.

**Source Preferences:**

- Prefer primary sources (investor relations pages, SEC filings, company earnings reports) over mainstream media summaries
- For financial figures, always include the specific quarter/date the number is from
- When citing analyst estimates that aren't publicly available (e.g., Mizuho Securities reports), it's acceptable to cite a secondary source but note that it's citing the primary source
- Mainstream news articles (CNBC, etc.) are often imprecise - prefer investor research sites or official company sources when possible

**Research Process:**

- When a secondary source cites a number, trace back to the original source (e.g., "The Information viewed shareholder documents" is better than "Yahoo Finance reported")
- If a source doesn't explain where a number came from, don't trust it blindly - note that it's unsourced or find corroboration
- Check if the current date means newer data should be available (e.g., if it's 2026, 2025 full-year numbers should exist)
- Do follow-up searches when initial results are outdated or incomplete

**Distinguish Between Metrics:**

- ARR (Annual Recurring Revenue) ≠ actual annual revenue. ARR is a single month × 12 and companies report it when it looks best
- Clearly separate: confirmed actuals vs targets/projections vs claims
- Note when figures are disputed and cite both sides

**Formatting:**

- Avoid jargon (e.g., use "first half" not "H1")
- Prefer bulleted lists over tables for readability
- Organize by category (e.g., separate Revenue section from Costs section)
- Keep source URLs inline with each data point, not in footnotes

**Calculations:**

- Use Python scripts (via bash) for any math calculations - don't do arithmetic in your head

## Editing / Writing Collaboration

When helping edit blog posts, follow these principles:

- **Help the author find their own thesis.** Don't impose a frame. Ask questions, identify tensions and disconnects, and reflect back what the post is actually arguing (vs. what the intro promises). The author often knows what they want to say but hasn't articulated it yet.
- **Work from bullets up.** When the author provides rough bullets or notes, turn them into prose. Don't over-embellish. Stay close to their voice and intent.
- **Don't front-load the whole argument.** If the post builds toward a key insight through examples, don't give it away in the intro. Let the structure do the work. The intro should set up the problem and create motivation to keep reading.
- **Identify structural problems before line-editing.** Cohesion issues (intro promises X but post delivers Y) matter more than word choice. Start by mapping the key points of each section and checking whether the throughline holds.
- **Propose edits, don't just apply them.** Show the proposed EDL edit and let the author react before assuming it's right. The author may want to take the idea in a different direction.
- **Keep it concrete.** When suggesting a reframe, show what the actual text would look like, not just an abstract description of what it should do.
- **Start with a hook.** The opening should make the target audience care about what they're about to read. Think about who they are and what will grab them. Don't open with throat-clearing, background, or tangential anecdotes.
- **Categorize feedback by priority.** Use tiers like "must-fix" (typos, grammar, unsubstantiated claims), "structural" (section splits, redundancy), and "tightening" (word choice, phrasing). This lets the author triage quickly and skip what doesn't resonate.
- **Start with mechanical fixes.** Typos, grammar errors, and style-guide violations first. They're uncontroversial, fast, and build momentum.
- **Trust the author's audience instincts.** The author knows what will be "triggering" or land poorly with their specific readers. When they push back on a suggestion, don't argue.
- **Don't over-substantiate.** Some claims are obvious enough to the target audience that adding examples or citations is distracting. If the author says it doesn't need evidence, move on.
- **Cut rather than demote.** If a reference or analogy isn't earning its place as the lead, it probably won't work as supporting color either. Be willing to kill darlings entirely.
- **Present feedback as a numbered menu.** Let the author accept or reject items individually rather than treating the review as a package deal.

## Agent Usage Preferences

- When reviewing multiple sections of a blog post (or similar parallel review tasks), use `spawn_foreach` rather than individual `spawn_subagent` calls.

