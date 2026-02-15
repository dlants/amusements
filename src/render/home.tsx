import * as React from "react";
import { stylesheet } from "typestyle";
import * as csstips from "csstips";
import * as csx from "csx";
import { Page, Post, SiteConfig } from "../types";
import { renderHeader } from "./header";
import { pageLayout } from "./util";
import { COLORS } from "./constants";

const FEATURED_SHORT_URLS = new Set<string>([
  "self-compassion",
  "ai-whiplash",
  "ed-cla-software-teams",
  "ai-mid",
  "climbing-ed-capacity",
  "climbing-ed-cla",
  "sports-gene",
  "mystery",
  "agi-not-imminent",
]);

const css = stylesheet({
  pageTitle: {
    fontSize: "2em",
    marginBottom: csx.px(10),
  },
  subtitle: {
    marginBottom: csx.px(30),
  },
  section: {
    ...csstips.vertical,
    marginBottom: csx.px(30),
  },
  sectionTitle: {
    fontSize: "1.5em",
    marginBottom: csx.px(5),
  },
  legend: {
    color: COLORS.gray.toString(),
    fontSize: "0.9em",
    marginBottom: csx.px(15),
  },
  postList: {
    ...csstips.vertical,
    ...csstips.verticallySpaced(10),
  },
  postRow: {
    ...csstips.content,
    ...csstips.horizontal,
    ...csstips.horizontallySpaced(10),
    alignItems: "flex-start",
  },
  starIndicator: {
    ...csstips.content,
    width: csx.px(16),
    textAlign: "center",
  },
  postTitle: {
    ...csstips.flex1,
  },
  postDate: {
    ...csstips.content,
    color: COLORS.gray.toString(),
  },
  tag: {
    ...csstips.content,
    backgroundColor: COLORS.lightgray.toString(),
    padding: `${csx.px(2)} ${csx.px(6)}`,
    borderRadius: csx.px(3),
    fontSize: "0.85em",
  },
});

function PostList({ posts }: { posts: Post[] }) {
  return (
    <div className={css.postList}>
      {posts.map((post) => {
        const isFeatured = FEATURED_SHORT_URLS.has(post.frontmatter.shortUrl);
        return (
          <div className={css.postRow} key={post.frontmatter.shortUrl}>
            <span className={css.starIndicator}>{isFeatured ? "★" : ""}</span>
            <a className={css.postTitle} href={`${post.frontmatter.shortUrl}.html`}>
              {post.frontmatter.title}
            </a>
            {post.frontmatter.tags?.map((tag) => (
              <span className={css.tag} key={tag}>
                {tag}
              </span>
            ))}
            <span className={css.postDate}>
              {new Date(post.frontmatter.publishDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export function renderHome(
  posts: Map<string, Post>,
  config: SiteConfig,
  pages?: Map<string, Page>,
): string {
  const sortedPosts = Array.from(posts.values())
    .filter((p) => p.frontmatter.publishDate)
    .sort(
      (a, b) =>
        new Date(b.frontmatter.publishDate).getTime() -
        new Date(a.frontmatter.publishDate).getTime(),
    );

  const header = renderHeader(config, pages);

  const content: React.ReactElement[] = [
    <h1 className={css.pageTitle} key="title">Amusements</h1>,
    <p className={css.subtitle} key="subtitle">Writing about things I feel like writing about.</p>,
    <div className={css.section} key="all">
      <h2 className={css.sectionTitle}>all posts</h2>
      <p className={css.legend}>★ = highlighted</p>
      <PostList posts={sortedPosts} />
    </div>,
  ];

  return pageLayout({
    header,
    content,
    meta: {
      title: config.homeName,
    },
  });
}
