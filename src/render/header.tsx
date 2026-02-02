import * as React from "react";
import { stylesheet, classes } from "typestyle";
import * as csstips from "csstips";
import * as csx from "csx";
import { favicon } from "./favicon";
import { COLORS } from "./constants";
import { siteConfig } from "../config";
import { Page, SiteConfig } from "../types";

const css = stylesheet({
  header: {
    ...csstips.content,
    ...csstips.vertical,
  },

  topHeaderRow: {
    background: COLORS.lightgray.toString(),
  },

  headerRow: {
    ...csstips.content,
    ...csstips.horizontal,
    ...csstips.horizontallySpaced(10),
    alignItems: "flex-end",
    paddingRight: csx.px(15),
    paddingLeft: csx.px(15),
    maxWidth: "100%",
    overflow: "hidden",
    flexWrap: "nowrap",
  },

  headerItem: {
    ...csstips.content,
    $nest: {
      a: {
        color: COLORS.black.toString(),
        textDecoration: "none",
        textDecorationColor: COLORS.lightgray.toString(),
        $nest: {
          "&:hover": {
            backgroundColor: COLORS.lightgray.toString(),
          },
        },
      },
    },
  },

  homeLink: {
    ...csstips.content,
    ...csstips.horizontal,
    ...csstips.horizontallySpaced(10),
    textDecoration: "none",
    alignItems: "center",
    $nest: {
      img: {
        maxHeight: csx.px(30),
      },
    },
  },

  divider: {
    ...csstips.flex,
  },

  rightSection: {
    ...csstips.content,
    ...csstips.horizontal,
    ...csstips.horizontallySpaced(10),
    alignItems: "center",
  },

  subscribe: {},
});

export function renderHeader(
  config?: SiteConfig,
  pages?: Map<string, Page>,
) {
  const cfg = config ?? siteConfig;
  const navPages = pages
    ? Array.from(pages.values()).filter((p) => p.frontmatter.showInNav)
    : [];

  return (
    <div className={css.header}>
      <div className={classes(css.headerRow, css.topHeaderRow)}>
        <a className={css.homeLink} href="index.html">
          {favicon}
          <span>{cfg.homeName}</span>
        </a>
        <div className={css.divider} />
        <div className={css.rightSection}>
          {cfg.tags.map((tag) => (
            <div className={css.headerItem} key={tag}>
              <a href={`${tag}.html`}>{tag}</a>
            </div>
          ))}
          {navPages.map((page) => (
            <div className={css.headerItem} key={page.frontmatter.shortUrl}>
              <a href={`${page.frontmatter.shortUrl}.html`}>
                {page.frontmatter.title}
              </a>
            </div>
          ))}
          {cfg.buttondownId ? (
            <div className={classes(css.headerItem, css.subscribe)}>
              {"| "}
              <a href="/rss">rss</a>{" "}
              <a href="/atom">atom</a>{" "}
              <a href="/buttondown.html">newsletter</a>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
}
