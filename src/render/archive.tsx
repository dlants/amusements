import * as React from "react";
import { stylesheet } from "typestyle";
import * as csstips from "csstips";
import * as csx from "csx";
import { Page, Post, SiteConfig } from "../types";
import { renderHeader } from "./header";
import { pageLayout } from "./util";
import { COLORS } from "./constants";

const css = stylesheet({
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
  tag: {
    ...csstips.content,
    backgroundColor: COLORS.lightgray.toString(),
    padding: `${csx.px(2)} ${csx.px(6)}`,
    borderRadius: csx.px(3),
    fontSize: "0.85em",
  },
});

export function renderArchive(
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

  const content = [
    <div className={css.postList}>
      {sortedPosts.map((post) => (
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
          {post.frontmatter.tags?.map((tag) => (
            <span className={css.tag} key={tag}>
              {tag}
            </span>
          ))}
        </div>
      ))}
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
