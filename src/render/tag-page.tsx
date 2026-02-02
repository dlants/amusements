import * as React from "react";
import { stylesheet } from "typestyle";
import * as csstips from "csstips";
import * as csx from "csx";
import { Page, Post, SiteConfig } from "../types";
import { renderHeader } from "./header";
import { pageLayout } from "./util";
import { COLORS } from "./constants";

const css = stylesheet({
  pageTitle: {
    fontSize: "1.4em",
    fontWeight: "bold",
    marginBottom: csx.px(20),
  },
  postList: {
    ...csstips.vertical,
    ...csstips.verticallySpaced(10),
  },
  postRow: {
    ...csstips.content,
    ...csstips.horizontal,
    ...csstips.horizontallySpaced(10),
  },
  postDate: {
    ...csstips.content,
    color: COLORS.gray.toString(),
    minWidth: csx.px(100),
  },
  postTitle: {
    ...csstips.content,
  },
});

export function renderTagPage(
  tag: string,
  posts: Map<string, Post>,
  config: SiteConfig,
  pages?: Map<string, Page>,
): string {
  const tagPosts = Array.from(posts.values())
    .filter((p) => p.frontmatter.publishDate && p.frontmatter.tags?.includes(tag))
    .sort(
      (a, b) =>
        new Date(b.frontmatter.publishDate).getTime() -
        new Date(a.frontmatter.publishDate).getTime(),
    );

  const header = renderHeader(config, pages);

  const content = [
    <div className={css.pageTitle} key="title">
      Posts tagged "{tag}"
    </div>,
    <div className={css.postList} key="list">
      {tagPosts.map((post) => (
        <div className={css.postRow} key={post.frontmatter.shortUrl}>
          <span className={css.postDate}>
            {new Date(post.frontmatter.publishDate).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
          <a className={css.postTitle} href={`${post.frontmatter.shortUrl}.html`}>
            {post.frontmatter.title}
          </a>
        </div>
      ))}
    </div>,
  ];

  return pageLayout({
    header,
    content,
    meta: {
      title: `${tag} | ${config.homeName}`,
    },
  });
}
