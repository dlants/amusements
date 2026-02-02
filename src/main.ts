import * as yargs from "yargs";
import * as fs from "fs";
import * as path from "path";
import express from "express";
import { siteConfig } from "./config";
import { loadPosts } from "./load-posts";
import { renderPage, renderStaticPage } from "./render/page";
import { renderFeed, renderTagFeed } from "./render/feed";
import { renderSitemap } from "./render/sitemap";
import { renderArchive } from "./render/archive";
import { renderHome } from "./render/home";
import { renderTagPage } from "./render/tag-page";

yargs
  .command(
    "serve",
    "serve the site locally",
    (yargs) => {
      yargs.option("port", {
        describe: "port to bind on",
        default: 1337,
      });
    },
    async (argv) => {
      const app = express();

      app.use(
        "/",
        express.static(siteConfig.outDir, {
          extensions: ["html"],
        }),
      );

      app.listen(argv.port as number);
      console.log(`Listening on port ${argv.port}`);
    },
  )
  .command(
    "build",
    "build the site from markdown posts",
    {},
    async (_argv) => {
      const outDir = siteConfig.outDir;

      if (fs.existsSync(outDir)) {
        fs.rmSync(outDir, { recursive: true });
      }
      fs.mkdirSync(outDir, { recursive: true });
      fs.mkdirSync(path.join(outDir, "images"), { recursive: true });

      // Copy static files
      if (fs.existsSync(siteConfig.staticDir)) {
        copyDirSync(siteConfig.staticDir, outDir);
      }

      const { posts, postsByTitle, pages } = loadPosts(siteConfig);

      for (const [shortUrl, post] of posts) {
        console.log(`rendering ${shortUrl}`);
        const html = renderPage(post, posts, postsByTitle, siteConfig, pages);
        const filePath = path.join(outDir, `${shortUrl}.html`);
        fs.writeFileSync(filePath, html);
      }

      // Render static pages
      for (const [shortUrl, page] of pages) {
        console.log(`rendering page ${shortUrl}`);
        const html = renderStaticPage(page, posts, postsByTitle, siteConfig, pages);
        const filePath = path.join(outDir, `${shortUrl}.html`);
        fs.writeFileSync(filePath, html);
      }

      // Render home page
      const homeHtml = renderHome(posts, siteConfig, pages);
      fs.writeFileSync(path.join(outDir, "index.html"), homeHtml);
      console.log("wrote index.html");

      // Render archive page
      const archiveHtml = renderArchive(posts, siteConfig, pages);
      fs.writeFileSync(path.join(outDir, "archive.html"), archiveHtml);
      console.log("wrote archive.html");

      // Render tag pages and feeds
      for (const tag of siteConfig.tags) {
        const tagHtml = renderTagPage(tag, posts, siteConfig, pages);
        fs.writeFileSync(path.join(outDir, `${tag}.html`), tagHtml);
        console.log(`wrote ${tag}.html`);
        renderTagFeed(tag, posts, siteConfig);
      }

      renderFeed(posts, siteConfig);
      await renderSitemap(posts, siteConfig);

      console.log(`Built ${posts.size} posts to ${outDir}/`);
    },
  )
  .help().argv;

function copyDirSync(src: string, dest: string) {
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      fs.mkdirSync(destPath, { recursive: true });
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}
