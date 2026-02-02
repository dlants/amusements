import * as React from "react";
import * as csstips from "csstips";
import { Page, Post, RenderContext, SiteConfig } from "../types";
import { renderMarkdown, extractHeadings, renderTableOfContents } from "./markdown";
import { renderHeader } from "./header";
import { pageLayout } from "./util";

csstips.normalize();
csstips.setupPage("#root");

export function getAdjacentPosts(
  currentPost: Post,
  posts: Map<string, Post>,
): { previous?: Post; next?: Post } {
  const sortedPosts = Array.from(posts.values())
    .filter((p) => p.frontmatter.publishDate)
    .sort(
      (a, b) =>
        new Date(b.frontmatter.publishDate).getTime() -
        new Date(a.frontmatter.publishDate).getTime(),
    );

  const currentIndex = sortedPosts.findIndex(
    (p) => p.frontmatter.shortUrl === currentPost.frontmatter.shortUrl,
  );

  if (currentIndex === -1) {
    return {};
  }

  return {
    next: currentIndex > 0 ? sortedPosts[currentIndex - 1] : undefined,
    previous:
      currentIndex < sortedPosts.length - 1
        ? sortedPosts[currentIndex + 1]
        : undefined,
  };
}

function renderPostNavigation(post: Post, posts: Map<string, Post>) {
  const { previous, next } = getAdjacentPosts(post, posts);

  if (!previous && !next) {
    return undefined;
  }

  return (
    <div
      style={{
        marginTop: "3em",
        paddingTop: "1em",
        borderTop: "1px solid #ddd",
        display: "flex",
        justifyContent: "space-between",
        fontSize: "0.9em",
      }}
    >
      <div style={{ flex: 1 }}>
        {previous && (
          <div>
            <div style={{ color: "#666", marginBottom: "0.25em" }}>
              ← Previous
            </div>
            <a href={`${previous.frontmatter.shortUrl}.html`}>
              {previous.frontmatter.title}
            </a>
          </div>
        )}
      </div>
      <div style={{ flex: 1, textAlign: "right" }}>
        {next && (
          <div>
            <div style={{ color: "#666", marginBottom: "0.25em" }}>Next →</div>
            <a href={`${next.frontmatter.shortUrl}.html`}>
              {next.frontmatter.title}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export function renderPage(
  post: Post,
  posts: Map<string, Post>,
  postsByTitle: Map<string, Post>,
  config: SiteConfig,
  pages?: Map<string, Page>,
): string {
  const context: RenderContext = {
    posts,
    postsByTitle,
    config,
    currentPost: post,
  };

  const header = renderHeader(config, pages);

  const headings = extractHeadings(post.ast);
  const toc = renderTableOfContents(headings);

  const content = [
    <h1>{post.frontmatter.title}</h1>,
    post.frontmatter.publishDate && (
      <div style={{ color: "#666", fontSize: "0.9em", marginBottom: "1em" }}>
        {new Date(post.frontmatter.publishDate).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </div>
    ),
    toc,
    renderMarkdown(post.ast, context),
    renderPostNavigation(post, posts),
  ];

  return pageLayout({
    header,
    content,
    meta: {
      title: post.frontmatter.title,
    },
  });
}

export function renderStaticPage(
  page: Page,
  posts: Map<string, Post>,
  postsByTitle: Map<string, Post>,
  config: SiteConfig,
  pages?: Map<string, Page>,
): string {
  const context: RenderContext = {
    posts,
    postsByTitle,
    config,
    currentPost: null as unknown as Post,
  };

  const header = renderHeader(config, pages);

  const content = [
    <h1 key="title">{page.frontmatter.title}</h1>,
    renderMarkdown(page.ast, context),
  ];

  return pageLayout({
    header,
    content,
    meta: {
      title: page.frontmatter.title,
    },
  });
}
