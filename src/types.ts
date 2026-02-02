import type { Root, Literal } from "mdast";

export type PostFrontmatter = {
  title: string;
  publishDate: string; // ISO date
  shortUrl: string; // URL slug
  tags?: string[];
  draft?: boolean;
  featured?: boolean;
};

export type Post = {
  frontmatter: PostFrontmatter;
  content: string; // Raw markdown (after frontmatter stripped)
  ast: Root; // Parsed mdast tree
};

export type PageFrontmatter = {
  title: string;
  shortUrl: string;
  showInNav?: boolean;
};

export type Page = {
  frontmatter: PageFrontmatter;
  content: string;
  ast: Root;
};

export interface WikiLink extends Literal {
  type: "wikiLink";
  value: string; // The text inside [[...]]
}

export interface CaptionedImage {
  type: "captionedImage";
  alt: string;
  url: string;
  caption: string; // May contain markdown formatting
}

declare module "mdast" {
  interface RootContentMap {
    wikiLink: WikiLink;
    captionedImage: CaptionedImage;
  }
}

export type SiteConfig = {
  homeName: string;
  faviconPath: string;
  buttondownId?: string;
  mastodonHref: string;
  postsDir: string;
  staticDir: string;
  outDir: string;
  tags: string[];
  pagesDir: string;
};

export type RenderContext = {
  posts: Map<string, Post>; // keyed by shortUrl
  postsByTitle: Map<string, Post>; // for wiki-link resolution
  config: SiteConfig;
  currentPost: Post;
  headings?: { depth: number; text: string; slug: string }[];
  headingIndex?: number;
};
