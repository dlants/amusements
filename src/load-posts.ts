import * as fs from "fs";
import * as path from "path";
import { parseFrontmatter, parsePageFrontmatter } from "./parse/frontmatter";
import { parseMarkdown } from "./parse/markdown";
import { Page, Post, SiteConfig } from "./types";

export type LoadedPosts = {
  posts: Map<string, Post>;
  postsByTitle: Map<string, Post>;
  pages: Map<string, Page>;
};

export function loadPosts(
  config: SiteConfig,
  options: { includeDrafts?: boolean } = {},
): LoadedPosts {
  const postsDir = config.postsDir;
  const files = fs.readdirSync(postsDir).filter((f) => f.endsWith(".md"));

  const posts = new Map<string, Post>();
  const postsByTitle = new Map<string, Post>();

  for (const file of files) {
    const filePath = path.join(postsDir, file);
    const fileContent = fs.readFileSync(filePath, "utf-8");

    const { frontmatter, content } = parseFrontmatter(fileContent);

    if (frontmatter.draft && !options.includeDrafts) {
      continue;
    }

    const ast = parseMarkdown(content);

    const post: Post = {
      frontmatter,
      content,
      ast,
    };

    posts.set(frontmatter.shortUrl, post);
    postsByTitle.set(frontmatter.title, post);
  }

  const pages = new Map<string, Page>();
  const pagesDir = config.pagesDir;
  if (fs.existsSync(pagesDir)) {
    const pageFiles = fs.readdirSync(pagesDir).filter((f) => f.endsWith(".md"));

    for (const file of pageFiles) {
      const filePath = path.join(pagesDir, file);
      const fileContent = fs.readFileSync(filePath, "utf-8");

      const { frontmatter, content } = parsePageFrontmatter(fileContent);

      const ast = parseMarkdown(content);

      const page: Page = {
        frontmatter,
        content,
        ast,
      };

      pages.set(frontmatter.shortUrl, page);
    }
  }

  return { posts, postsByTitle, pages };
}
