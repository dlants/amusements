import { Feed } from "feed";
import fs from "fs";
import path from "path";
import { Post, SiteConfig } from "../types";

export function renderFeed(posts: Map<string, Post>, config: SiteConfig) {
  const feed = new Feed({
    title: "dlants.me",
    description: "Writing about things that I feel like writing about",
    id: "https://dlants.me",
    link: "https://dlants.me",
    language: "en",
    image: "https://dlants.me/black-rectangle.svg",
    copyright: "All rights reserved, 2023, Denis Lantsman",
    generator: "awesome",
    feedLinks: {
      rss: "https://dlants.me/rss",
      atom: "https://dlants.me/atom",
    },
    author: {
      name: "Denis Lantsman",
      email: "mail@mail.dlants.me",
      link: "https://dlants.me",
    },
  });

  ["Technology", "Education", "Climbing", "Training", "Tech", "Ed-Tech"].map(
    (c) => feed.addCategory(c),
  );

  const sortedPosts = Array.from(posts.values())
    .filter((p) => p.frontmatter.publishDate)
    .sort(
      (a, b) =>
        new Date(b.frontmatter.publishDate).getTime() -
        new Date(a.frontmatter.publishDate).getTime(),
    );

  for (const post of sortedPosts) {
    feed.addItem({
      title: post.frontmatter.title,
      id: post.frontmatter.shortUrl,
      link: `https://dlants.me/${post.frontmatter.shortUrl}.html`,
      description: "Read the full post at dlants.me",
      content: "Read the full post at dlants.me",
      author: [
        {
          name: "Denis Lantsman",
          email: "mail@mail.dlants.me",
          link: "https://dlants.me",
        },
      ],
      date: new Date(post.frontmatter.publishDate),
    });
  }

  const rssPath = path.join(config.outDir, "rss");
  fs.writeFileSync(rssPath, feed.rss2());
  console.log(`wrote ${rssPath}`);

  const atomPath = path.join(config.outDir, "atom");
  fs.writeFileSync(atomPath, feed.atom1());
  console.log(`wrote ${atomPath}`);
}

export function renderTagFeed(
  tag: string,
  posts: Map<string, Post>,
  config: SiteConfig,
) {
  const feed = new Feed({
    title: `dlants.me - ${tag}`,
    description: `Posts tagged ${tag}`,
    id: `https://dlants.me/${tag}`,
    link: `https://dlants.me/${tag}.html`,
    language: "en",
    image: "https://dlants.me/black-rectangle.svg",
    copyright: "All rights reserved, 2023, Denis Lantsman",
    generator: "awesome",
    feedLinks: {
      rss: `https://dlants.me/${tag}/rss`,
      atom: `https://dlants.me/${tag}/atom`,
    },
    author: {
      name: "Denis Lantsman",
      email: "mail@mail.dlants.me",
      link: "https://dlants.me",
    },
  });

  const tagPosts = Array.from(posts.values())
    .filter((p) => p.frontmatter.publishDate && p.frontmatter.tags?.includes(tag))
    .sort(
      (a, b) =>
        new Date(b.frontmatter.publishDate).getTime() -
        new Date(a.frontmatter.publishDate).getTime(),
    );

  for (const post of tagPosts) {
    feed.addItem({
      title: post.frontmatter.title,
      id: post.frontmatter.shortUrl,
      link: `https://dlants.me/${post.frontmatter.shortUrl}.html`,
      description: "Read the full post at dlants.me",
      content: "Read the full post at dlants.me",
      author: [
        {
          name: "Denis Lantsman",
          email: "mail@mail.dlants.me",
          link: "https://dlants.me",
        },
      ],
      date: new Date(post.frontmatter.publishDate),
    });
  }

  const tagDir = path.join(config.outDir, tag);
  fs.mkdirSync(tagDir, { recursive: true });

  const rssPath = path.join(tagDir, "rss");
  fs.writeFileSync(rssPath, feed.rss2());
  console.log(`wrote ${rssPath}`);

  const atomPath = path.join(tagDir, "atom");
  fs.writeFileSync(atomPath, feed.atom1());
  console.log(`wrote ${atomPath}`);
}
