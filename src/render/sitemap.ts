import { SitemapStream, streamToPromise } from "sitemap";
import { Readable } from "stream";
import fs from "fs";
import path from "path";
import { Post, SiteConfig } from "../types";

export async function renderSitemap(
  posts: Map<string, Post>,
  config: SiteConfig,
) {
  const links = Array.from(posts.values()).map((post) => ({
    url: `${post.frontmatter.shortUrl}.html`,
  }));

  const stream = new SitemapStream({ hostname: "https://dlants.me" });
  const buf = await streamToPromise(Readable.from(links).pipe(stream));

  const sitemapPath = path.join(config.outDir, "sitemap.xml");
  fs.writeFileSync(sitemapPath, buf);
  console.log(`wrote ${sitemapPath}`);
}
