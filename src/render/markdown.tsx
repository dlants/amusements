import * as React from "react";
import type {
  Root,
  RootContent,
  PhrasingContent,
  Heading,
  Paragraph,
  Text,
  Emphasis,
  Strong,
  Link,
  Image,
  Code,
  InlineCode,
  Blockquote,
  List,
  ListItem,
  ThematicBreak,
  Break,
  Html,
  Delete,
  Table,
  TableRow,
  TableCell,
} from "mdast";
import { stylesheet } from "typestyle";
import * as csx from "csx";
import { COLORS } from "./constants";
import { RenderContext, WikiLink, CaptionedImage } from "../types";
import { parseMarkdown } from "../parse/markdown";

const css = stylesheet({
  tableOfContents: {
    paddingTop: csx.px(10),
    paddingBottom: csx.px(10),
    $nest: {
      ul: {
        listStyle: "none",
        paddingLeft: 0,
        margin: 0,
      },
      li: {
        paddingTop: csx.px(4),
        paddingBottom: csx.px(4),
      },
      a: {
        color: COLORS.black.toString(),
        textDecoration: "none",
        $nest: {
          "&:hover": {
            textDecoration: "underline",
          },
        },
      },
    },
  },
  heading: {
    $nest: {
      a: {
        color: "inherit",
        textDecoration: "none",
        $nest: {
          "&:hover": {
            textDecoration: "underline",
          },
        },
      },
    },
  },
  code: {
    backgroundColor: COLORS.lightgray.toString(),
    padding: csx.px(2),
    borderRadius: csx.px(3),
    fontFamily: "'Roboto Mono', monospace",
    fontSize: "0.9em",
  },
  codeBlock: {
    backgroundColor: COLORS.lightgray.toString(),
    padding: csx.px(12),
    borderRadius: csx.px(4),
    fontFamily: "'Roboto Mono', monospace",
    fontSize: "0.85em",
    overflowX: "auto",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
  },
  blockquote: {
    borderLeft: `3px solid ${COLORS.gray.toString()}`,
    paddingLeft: csx.px(16),
    marginLeft: 0,
    color: COLORS.gray.toString(),
  },
  table: {
    borderCollapse: "collapse",
    width: "100%",
    marginTop: csx.px(16),
    marginBottom: csx.px(16),
  },
  tableCell: {
    border: `1px solid ${COLORS.lightgray.toString()}`,
    padding: csx.px(8),
  },
  image: {
    maxWidth: "100%",
  },
  embedContainer: {
    position: "relative" as const,
    width: "100%",
    paddingBottom: "56.25%",
    height: 0,
    marginTop: csx.px(16),
    marginBottom: csx.px(16),
    $nest: {
      iframe: {
        position: "absolute" as const,
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
      },
    },
  },
  captionedImage: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    marginTop: csx.px(16),
    marginBottom: csx.px(16),
  },
  caption: {
    fontStyle: "italic",
    color: COLORS.gray.toString(),
    fontSize: "0.9em",
    marginTop: csx.px(8),
    textAlign: "left" as const,
    maxWidth: "90%",
    paddingLeft: csx.px(16),
  },
});

type MdastNode = RootContent | PhrasingContent | WikiLink;

export type HeadingInfo = {
  depth: number;
  text: string;
  slug: string;
};

function getHeadingText(node: Heading): string {
  let text = "";
  for (const child of node.children) {
    if (child.type === "text") {
      text += child.value;
    } else if ("children" in child) {
      text += (child.children as { type: string; value?: string }[])
        .filter((c) => c.type === "text")
        .map((c) => c.value || "")
        .join("");
    }
  }
  return text;
}

function slugify(text: string, slugMap: Map<string, number>): string {
  const slugBase = text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 50);
  
  const count = slugMap.get(slugBase) || 0;
  slugMap.set(slugBase, count + 1);
  
  return count === 0 ? slugBase : `${slugBase}-${count}`;
}

export function extractHeadings(ast: Root): HeadingInfo[] {
  const headings: HeadingInfo[] = [];
  const slugMap = new Map<string, number>();
  
  for (const node of ast.children) {
    if (node.type === "heading") {
      const text = getHeadingText(node);
      headings.push({
        depth: node.depth,
        text,
        slug: slugify(text, slugMap),
      });
    }
  }
  return headings;
}

export function renderTableOfContents(headings: HeadingInfo[]): JSX.Element | null {
  if (headings.length === 0) {
    return null;
  }
  
  const minDepth = Math.min(...headings.map(h => h.depth));

  return (
    <div className={css.tableOfContents}>
      <ul>
        {headings.map((heading, i) => (
          <li key={i} style={{ paddingLeft: `${(heading.depth - minDepth) * 20}px` }}>
            <a href={`#${heading.slug}`}>{heading.text}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function renderMarkdown(ast: Root, context: RenderContext): JSX.Element {
  const headings = extractHeadings(ast);
  const contextWithHeadings: RenderContext = {
    ...context,
    headings,
    headingIndex: 0,
  };
  return <>{renderChildren(ast.children as MdastNode[], contextWithHeadings)}</>;
}

function renderChildren(
  nodes: MdastNode[],
  context: RenderContext,
): React.ReactNode[] {
  return nodes.map((node, i) => (
    <React.Fragment key={i}>{renderNode(node, context)}</React.Fragment>
  ));
}

function renderNode(node: MdastNode, context: RenderContext): React.ReactNode {
  switch (node.type) {
    case "heading":
      return renderHeading(node, context);
    case "paragraph":
      return renderParagraph(node, context);
    case "text":
      return (node as Text).value;
    case "emphasis":
      return <em>{renderChildren((node as Emphasis).children, context)}</em>;
    case "strong":
      return (
        <strong>{renderChildren((node as Strong).children, context)}</strong>
      );
    case "link":
      return renderLink(node as Link, context);
    case "image":
      return renderImage(node as Image);
    case "code":
      return renderCodeBlock(node as Code);
    case "inlineCode":
      return <code className={css.code}>{(node as InlineCode).value}</code>;
    case "blockquote":
      return (
        <blockquote className={css.blockquote}>
          {renderChildren((node as Blockquote).children as MdastNode[], context)}
        </blockquote>
      );
    case "list":
      return renderList(node as List, context);
    case "listItem":
      return renderListItem(node as ListItem, context);
    case "thematicBreak":
      return <hr />;
    case "break":
      return <br />;
    case "html":
      return (
        <span dangerouslySetInnerHTML={{ __html: (node as Html).value }} />
      );
    case "delete":
      return <del>{renderChildren((node as Delete).children, context)}</del>;
    case "table":
      return renderTable(node as Table, context);
    case "tableRow":
      return renderTableRow(node as TableRow, context);
    case "tableCell":
      return renderTableCell(node as TableCell, context);
    case "wikiLink":
      return renderWikiLink(node as WikiLink, context);
    case "captionedImage":
      return renderCaptionedImage(node as CaptionedImage, context);
    default:
      console.warn(`Unknown mdast node type: ${(node as MdastNode).type}`);
      return null;
  }
}

function renderHeading(node: Heading, context: RenderContext): JSX.Element {
  const children = renderChildren(node.children, context);
  
  // Get the slug from the pre-computed headings
  let slug: string | undefined;
  if (context.headings && context.headingIndex !== undefined) {
    const headingInfo = context.headings[context.headingIndex];
    if (headingInfo) {
      slug = headingInfo.slug;
    }
    context.headingIndex++;
  }

  const content = slug ? (
    <a href={`#${slug}`}>{children}</a>
  ) : children;

  const props = slug ? { id: slug, className: css.heading } : {};

  switch (node.depth) {
    case 1:
      return <h1 {...props}>{content}</h1>;
    case 2:
      return <h2 {...props}>{content}</h2>;
    case 3:
      return <h3 {...props}>{content}</h3>;
    case 4:
      return <h4 {...props}>{content}</h4>;
    case 5:
      return <h5 {...props}>{content}</h5>;
    case 6:
      return <h6 {...props}>{content}</h6>;
    default:
      return <h6 {...props}>{content}</h6>;
  }
}

function extractYouTubeId(url: string): string | null {
  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname;

    if (
      hostname === "youtu.be" ||
      hostname === "www.youtu.be"
    ) {
      return parsedUrl.pathname.slice(1).split("?")[0];
    }

    if (
      hostname === "youtube.com" ||
      hostname === "www.youtube.com"
    ) {
      if (parsedUrl.pathname.startsWith("/shorts/")) {
        return parsedUrl.pathname.slice("/shorts/".length);
      }
      if (parsedUrl.pathname.startsWith("/clip/")) {
        return null;
      }
      const vParam = parsedUrl.searchParams.get("v");
      if (vParam) {
        return vParam;
      }
    }
  } catch {
    return null;
  }
  return null;
}

function renderYouTubeEmbed(videoId: string): JSX.Element {
  return (
    <div className={css.embedContainer}>
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen={true}
        frameBorder={0}
      />
    </div>
  );
}

function renderParagraph(node: Paragraph, context: RenderContext): JSX.Element {
  // Check if paragraph contains only a standalone YouTube URL
  if (
    node.children.length === 1 &&
    node.children[0].type === "link" &&
    node.children[0].children.length === 1 &&
    node.children[0].children[0].type === "text" &&
    node.children[0].children[0].value === node.children[0].url
  ) {
    const videoId = extractYouTubeId(node.children[0].url);
    if (videoId) {
      return renderYouTubeEmbed(videoId);
    }
  }

  return <p>{renderChildren(node.children, context)}</p>;
}

function renderLink(node: Link, context: RenderContext): JSX.Element {
  return (
    <a href={node.url} title={node.title || undefined}>
      {renderChildren(node.children, context)}
    </a>
  );
}

function renderImage(node: Image): JSX.Element {
  return (
    <img
      className={css.image}
      src={node.url}
      alt={node.alt || undefined}
      title={node.title || undefined}
    />
  );
}

function renderCodeBlock(node: Code): JSX.Element {
  return (
    <pre className={css.codeBlock}>
      <code>{node.value}</code>
    </pre>
  );
}

function renderList(node: List, context: RenderContext): JSX.Element {
  const children = renderChildren(node.children as MdastNode[], context);
  if (node.ordered) {
    return <ol start={node.start ?? undefined}>{children}</ol>;
  }
  return <ul>{children}</ul>;
}

function renderListItem(node: ListItem, context: RenderContext): JSX.Element {
  return <li>{renderChildren(node.children as MdastNode[], context)}</li>;
}

function renderTable(node: Table, context: RenderContext): JSX.Element {
  const [headerRow, ...bodyRows] = node.children;
  return (
    <table className={css.table}>
      {headerRow && (
        <thead>
          {renderTableRow(headerRow, context, true)}
        </thead>
      )}
      {bodyRows.length > 0 && (
        <tbody>
          {bodyRows.map((row, i) => (
            <React.Fragment key={i}>
              {renderTableRow(row, context, false)}
            </React.Fragment>
          ))}
        </tbody>
      )}
    </table>
  );
}

function renderTableRow(
  node: TableRow,
  context: RenderContext,
  isHeader: boolean = false,
): JSX.Element {
  return (
    <tr>
      {node.children.map((cell, i) => (
        <React.Fragment key={i}>
          {renderTableCell(cell, context, isHeader)}
        </React.Fragment>
      ))}
    </tr>
  );
}

function renderTableCell(
  node: TableCell,
  context: RenderContext,
  isHeader: boolean = false,
): JSX.Element {
  const children = renderChildren(node.children, context);
  if (isHeader) {
    return <th className={css.tableCell}>{children}</th>;
  }
  return <td className={css.tableCell}>{children}</td>;
}

function renderWikiLink(node: WikiLink, context: RenderContext): JSX.Element {
  const target = node.value;
  const linkedPost = context.postsByTitle.get(target);

  if (linkedPost) {
    return <a href={`${linkedPost.frontmatter.shortUrl}.html`}>{target}</a>;
  }

  console.warn(
    `Wiki link target not found: "${target}" in post "${context.currentPost.frontmatter.title}"`,
  );
  return <span>{target}</span>;
}

function renderCaptionedImage(node: CaptionedImage, context: RenderContext): JSX.Element {
  // Parse the caption as markdown to support formatting
  const captionAst = node.caption ? parseMarkdown(node.caption) : null;
  
  return (
    <div className={css.captionedImage}>
      <img
        className={css.image}
        src={node.url}
        alt={node.alt || undefined}
      />
      {captionAst && (
        <div className={css.caption}>
          {renderMarkdown(captionAst, context)}
        </div>
      )}
    </div>
  );
}
