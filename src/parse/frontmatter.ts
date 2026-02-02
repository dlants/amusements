import matter from "gray-matter";
import { PageFrontmatter, PostFrontmatter } from "../types";

export function parseFrontmatter(fileContent: string): {
  frontmatter: PostFrontmatter;
  content: string;
} {
  const { data, content } = matter(fileContent);

  const frontmatter: PostFrontmatter = {
    title: data.title,
    publishDate: data.publishDate,
    shortUrl: data.shortUrl,
    tags: data.tags,
    draft: data.draft,
    featured: data.featured,
  };

  return { frontmatter, content };
}

export function parsePageFrontmatter(fileContent: string): {
  frontmatter: PageFrontmatter;
  content: string;
} {
  const { data, content } = matter(fileContent);

  const frontmatter: PageFrontmatter = {
    title: data.title,
    shortUrl: data.shortUrl,
    showInNav: data.showInNav,
  };

  return { frontmatter, content };
}
