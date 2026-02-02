#!/usr/bin/env npx tsx
/**
 * Converts Notion JSON cache to markdown files with YAML frontmatter.
 * 
 * Usage: npx tsx scripts/notion-to-markdown.ts
 */

import * as fs from "fs";
import * as path from "path";

const CACHE_DIR = path.join(__dirname, "../notion-to-static-site/cache");
const POSTS_DIR = path.join(__dirname, "../posts");
const IMAGES_SRC = path.join(CACHE_DIR, "images");
const IMAGES_DEST = path.join(__dirname, "../static/images");

// Map from original image filename (in cache) to {cleanName, postShortUrl}
type ImageInfo = { cleanName: string; postShortUrl: string };
const imageRenameMap = new Map<string, ImageInfo>();
const usedImageNames = new Map<string, Set<string>>(); // per-post uniqueness

// Fully decode a URL-encoded string (handles double-encoding)
function fullyDecode(str: string): string {
  let decoded = str;
  let prev = "";
  while (decoded !== prev) {
    prev = decoded;
    try {
      decoded = decodeURIComponent(decoded);
    } catch {
      break;
    }
  }
  return decoded;
}

// Extract clean filename from URL-encoded S3 path
function cleanImageFilename(encodedFilename: string, postShortUrl: string): string {
  // Fully decode the URL-encoded filename (may be double-encoded)
  const decoded = fullyDecode(encodedFilename);
  
  // Extract just the filename part from S3 URLs like:
  // https://bucketeer-xxx.s3.amazonaws.com/public/images/uuid_dimensions.jpeg
  // or: https://substack-post-media.s3.amazonaws.com/public/images/uuid_dimensions.jpeg
  const match = decoded.match(/([a-f0-9-]+_\d+x\d+\.(png|jpeg|jpg|gif|webp))$/i) 
    || decoded.match(/([a-f0-9-]+\.(png|jpeg|jpg|gif|webp))$/i)
    || decoded.match(/([^/]+\.(png|jpeg|jpg|gif|webp))$/i);
  
  if (match) {
    let cleanName = match[1];
    
    // Get or create the set of used names for this post
    if (!usedImageNames.has(postShortUrl)) {
      usedImageNames.set(postShortUrl, new Set());
    }
    const postUsedNames = usedImageNames.get(postShortUrl)!;
    
    // Ensure uniqueness within this post
    let finalName = cleanName;
    let counter = 1;
    while (postUsedNames.has(finalName)) {
      const ext = cleanName.substring(cleanName.lastIndexOf('.'));
      const base = cleanName.substring(0, cleanName.lastIndexOf('.'));
      finalName = `${base}-${counter}${ext}`;
      counter++;
    }
    postUsedNames.add(finalName);
    return finalName;
  }
  
  // Fallback: use the encoded filename as-is
  return encodedFilename;
}

// Types matching Notion API structure
type RichTextItem = {
  type: "text" | "mention" | "equation";
  text?: {
    content: string;
    link?: { url: string } | null;
  };
  mention?: {
    type: "page" | "date" | "user" | "database";
    page?: { id: string };
  };
  annotations: {
    bold: boolean;
    italic: boolean;
    strikethrough: boolean;
    underline: boolean;
    code: boolean;
    color: string;
  };
  plain_text: string;
  href?: string | null;
};

type Block = {
  id: string;
  type: string;
  has_children: boolean;
  children?: Block[];
  paragraph?: { rich_text: RichTextItem[]; color: string };
  heading_1?: { rich_text: RichTextItem[] };
  heading_2?: { rich_text: RichTextItem[] };
  heading_3?: { rich_text: RichTextItem[] };
  bulleted_list_item?: { rich_text: RichTextItem[]; children?: Block[] };
  numbered_list_item?: { rich_text: RichTextItem[]; children?: Block[] };
  code?: { rich_text: RichTextItem[]; language: string; caption: RichTextItem[] };
  image?: {
    type: "external" | "file";
    external?: { url: string };
    file?: { url: string };
    caption: RichTextItem[];
  };
  quote?: { rich_text: RichTextItem[] };
  divider?: object;
  video?: {
    type: "external" | "file";
    external?: { url: string };
    caption: RichTextItem[];
  };
  bookmark?: { url: string; caption: RichTextItem[] };
  callout?: { rich_text: RichTextItem[]; icon?: { emoji?: string } };
  column_list?: object;
  column?: object;
  child_page?: { title: string };
  child_database?: { title: string };
  table_of_contents?: object;
};

type Page = {
  object: "page";
  id: string;
  properties: {
    Name?: { type: "title"; title: RichTextItem[] };
    "short-url"?: { type: "rich_text"; rich_text: RichTextItem[] };
    "Publish Date"?: { type: "date"; date: { start: string } | null };
    Tags?: { type: "multi_select"; multi_select: { name: string }[] };
    [key: string]: unknown;
  };
  children: Block[];
};

type Database = {
  object: "database";
  id: string;
};

type PageMap = Map<string, Page>;

// Load all pages from cache
function loadPages(): PageMap {
  const pages = new Map<string, Page>();
  const files = fs.readdirSync(CACHE_DIR).filter(f => f.endsWith(".json"));
  
  for (const file of files) {
    const content = fs.readFileSync(path.join(CACHE_DIR, file), "utf-8");
    const data = JSON.parse(content);
    if (data.object === "page") {
      pages.set(data.id, data as Page);
    }
  }
  
  return pages;
}

// Get page title from properties
function getPageTitle(page: Page): string {
  const titleProp = page.properties.Name;
  if (titleProp?.type === "title" && titleProp.title.length > 0) {
    return titleProp.title.map(t => t.plain_text).join("");
  }
  return "Untitled";
}

// Get short URL from properties, or generate from title
function getShortUrl(page: Page): string {
  const prop = page.properties["short-url"];
  if (prop?.type === "rich_text" && prop.rich_text.length > 0) {
    const shortUrl = prop.rich_text.map(t => t.plain_text).join("");
    if (shortUrl) return shortUrl;
  }
  // Generate from title
  const title = getPageTitle(page);
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .substring(0, 50) || page.id.substring(0, 8);
}

// Get publish date from properties
function getPublishDate(page: Page): string | null {
  const prop = page.properties["Publish Date"];
  if (prop?.type === "date" && prop.date?.start) {
    return prop.date.start;
  }
  return null;
}

// Get tags from properties
function getTags(page: Page): string[] {
  const prop = page.properties.Tags;
  if (prop?.type === "multi_select") {
    return prop.multi_select.map(t => t.name);
  }
  return [];
}

// Convert rich text to markdown
function richTextToMarkdown(richText: RichTextItem[], pages: PageMap): string {
  return richText.map(item => {
    let text = "";
    
    if (item.type === "mention" && item.mention?.type === "page" && item.mention.page) {
      // Convert page mention to wiki-link
      const targetPage = pages.get(item.mention.page.id);
      if (targetPage) {
        const title = getPageTitle(targetPage);
        return `[[${title}]]`;
      }
      return `[[${item.plain_text}]]`;
    }
    
    text = item.plain_text;
    
    // Apply annotations
    if (item.annotations.code) {
      text = "`" + text + "`";
    }
    if (item.annotations.bold) {
      text = "**" + text + "**";
    }
    if (item.annotations.italic) {
      text = "*" + text + "*";
    }
    if (item.annotations.strikethrough) {
      text = "~~" + text + "~~";
    }
    
    // Apply link (but not if it's code, which looks weird)
    if (item.type === "text" && item.text?.link?.url && !item.annotations.code) {
      text = `[${text}](${item.text.link.url})`;
    }
    
    return text;
  }).join("");
}

// Convert blocks to markdown
function blocksToMarkdown(blocks: Block[], pages: PageMap, postShortUrl: string, indent = ""): string {
  const lines: string[] = [];
  let i = 0;
  
  while (i < blocks.length) {
    const block = blocks[i];
    
    switch (block.type) {
      case "paragraph":
        if (block.paragraph) {
          const text = richTextToMarkdown(block.paragraph.rich_text, pages);
          lines.push(indent + text);
          lines.push("");
        }
        break;
        
      case "heading_1":
        if (block.heading_1) {
          const text = richTextToMarkdown(block.heading_1.rich_text, pages);
          lines.push(indent + "# " + text);
          lines.push("");
        }
        break;
        
      case "heading_2":
        if (block.heading_2) {
          const text = richTextToMarkdown(block.heading_2.rich_text, pages);
          lines.push(indent + "## " + text);
          lines.push("");
        }
        break;
        
      case "heading_3":
        if (block.heading_3) {
          const text = richTextToMarkdown(block.heading_3.rich_text, pages);
          lines.push(indent + "### " + text);
          lines.push("");
        }
        break;
        
      case "bulleted_list_item":
        if (block.bulleted_list_item) {
          const text = richTextToMarkdown(block.bulleted_list_item.rich_text, pages);
          lines.push(indent + "- " + text);
          if (block.children) {
            lines.push(blocksToMarkdown(block.children, pages, postShortUrl, indent + "  "));
          }
        }
        break;
        
      case "numbered_list_item":
        if (block.numbered_list_item) {
          const text = richTextToMarkdown(block.numbered_list_item.rich_text, pages);
          lines.push(indent + "1. " + text);
          if (block.children) {
            lines.push(blocksToMarkdown(block.children, pages, postShortUrl, indent + "   "));
          }
        }
        break;
        
      case "code":
        if (block.code) {
          const lang = block.code.language === "plain text" ? "" : block.code.language;
          const code = block.code.rich_text.map(t => t.plain_text).join("");
          lines.push(indent + "```" + lang);
          lines.push(code);
          lines.push(indent + "```");
          lines.push("");
        }
        break;
        
      case "image":
        if (block.image) {
          let url = block.image.type === "external" 
            ? block.image.external?.url 
            : block.image.file?.url;
          
          if (url?.startsWith("images%2F")) {
            // Local image from cache - get clean filename
            const originalFilename = url.slice("images%2F".length);
            
            // Check if we've already mapped this filename
            if (!imageRenameMap.has(originalFilename)) {
              const cleanName = cleanImageFilename(originalFilename, postShortUrl);
              imageRenameMap.set(originalFilename, { cleanName, postShortUrl });
            }
            
            const imageInfo = imageRenameMap.get(originalFilename)!;
            url = `/images/${imageInfo.postShortUrl}/${imageInfo.cleanName}`;
          }
          
          const caption = block.image.caption.length > 0 
            ? richTextToMarkdown(block.image.caption, pages)
            : "";
          
          if (caption) {
            // Use captioned image syntax for images with captions
            // Generate a short alt text from the first sentence or 100 chars
            const altText = caption.split(/[.!?]/)[0].slice(0, 100).trim() || "Image";
            lines.push(indent + `::image[${altText}](${url})`);
            lines.push(indent + caption);
            lines.push(indent + "::");
            lines.push("");
          } else {
            // Standard markdown for images without captions
            lines.push(indent + `![](${url})`);
            lines.push("");
          }
        }
        break;
        
      case "quote":
        if (block.quote) {
          const text = richTextToMarkdown(block.quote.rich_text, pages);
          const quoteLines = text.split("\n").map(l => indent + "> " + l);
          lines.push(...quoteLines);
          lines.push("");
        }
        break;
        
      case "divider":
        lines.push(indent + "---");
        lines.push("");
        break;
        
      case "video":
        if (block.video?.type === "external" && block.video.external?.url) {
          lines.push(indent + block.video.external.url);
          lines.push("");
        }
        break;
        
      case "bookmark":
        if (block.bookmark?.url) {
          const caption = block.bookmark.caption.length > 0
            ? richTextToMarkdown(block.bookmark.caption, pages)
            : block.bookmark.url;
          lines.push(indent + `[${caption}](${block.bookmark.url})`);
          lines.push("");
        }
        break;
        
      case "callout":
        if (block.callout) {
          const icon = block.callout.icon?.emoji || "💡";
          const text = richTextToMarkdown(block.callout.rich_text, pages);
          const calloutLines = text.split("\n").map((l, i) => 
            indent + "> " + (i === 0 ? icon + " " : "") + l
          );
          lines.push(...calloutLines);
          lines.push("");
        }
        break;
        
      case "column_list":
        // Flatten columns into sequential content
        if (block.children) {
          for (const column of block.children) {
            if (column.children) {
              lines.push(blocksToMarkdown(column.children, pages, postShortUrl, indent));
            }
          }
        }
        break;
        
      case "child_page":
      case "child_database":
      case "table_of_contents":
        // Skip these - they don't translate well to static markdown
        break;
        
      default:
        console.warn(`Unhandled block type: ${block.type}`);
    }
    
    i++;
  }
  
  return lines.join("\n");
}

// Escape YAML string if needed
function yamlString(str: string): string {
  if (str.includes(":") || str.includes("#") || str.includes("'") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '\\"')}"`;
  }
  return str;
}

// Generate frontmatter
function generateFrontmatter(page: Page, shortUrl: string): string {
  const title = getPageTitle(page);
  const publishDate = getPublishDate(page);
  const tags = getTags(page);
  
  const lines = ["---"];
  lines.push(`title: ${yamlString(title)}`);
  if (publishDate) {
    lines.push(`publishDate: ${publishDate}`);
  } else {
    lines.push(`draft: true`);
  }
  lines.push(`shortUrl: ${shortUrl}`);
  if (tags.length > 0) {
    lines.push(`tags: [${tags.map(t => yamlString(t)).join(", ")}]`);
  }
  lines.push("---");
  
  return lines.join("\n");
}

// Main conversion
function main() {
  console.log("Loading pages from cache...");
  const pages = loadPages();
  console.log(`Found ${pages.size} pages`);
  
  // Ensure output directories exist
  fs.mkdirSync(POSTS_DIR, { recursive: true });
  fs.mkdirSync(IMAGES_DEST, { recursive: true });
  
  // Convert each page that has content
  let converted = 0;
  let drafts = 0;
  const usedShortUrls = new Set<string>();
  
  for (const [id, page] of pages) {
    // Skip pages with no children (empty pages)
    if (!page.children || page.children.length === 0) {
      continue;
    }
    
    const title = getPageTitle(page);
    let shortUrl = getShortUrl(page);
    
    // Ensure unique shortUrl
    let uniqueShortUrl = shortUrl;
    let counter = 1;
    while (usedShortUrls.has(uniqueShortUrl)) {
      uniqueShortUrl = `${shortUrl}-${counter}`;
      counter++;
    }
    usedShortUrls.add(uniqueShortUrl);
    
    const publishDate = getPublishDate(page);
    const isDraft = !publishDate;
    
    if (isDraft) {
      console.log(`Converting (draft): ${title} (${uniqueShortUrl})`);
      drafts++;
    } else {
      console.log(`Converting: ${title} (${uniqueShortUrl})`);
    }
    
    const frontmatter = generateFrontmatter(page, uniqueShortUrl);
    const content = blocksToMarkdown(page.children, pages, uniqueShortUrl);
    const markdown = frontmatter + "\n\n" + content;
    
    const outputPath = path.join(POSTS_DIR, `${uniqueShortUrl}.md`);
    fs.writeFileSync(outputPath, markdown, "utf-8");
    converted++;
  }
  
  console.log(`\nConverted ${converted} posts to markdown (${drafts} drafts)`);
  
  // Build a reverse lookup from cache filename to imageInfo
  // The imageRenameMap keys may be double-encoded, but cache files are single-encoded
  const cacheFilenameToInfo = new Map<string, ImageInfo>();
  for (const [mapKey, info] of imageRenameMap) {
    // Try the key as-is
    cacheFilenameToInfo.set(mapKey, info);
    // Also try single-decoded version (in case map key is double-encoded)
    try {
      const decoded = decodeURIComponent(mapKey);
      if (decoded !== mapKey) {
        cacheFilenameToInfo.set(decoded, info);
      }
    } catch {}
  }
  
  // Copy and rename images into post-specific subdirectories
  if (fs.existsSync(IMAGES_SRC)) {
    const images = fs.readdirSync(IMAGES_SRC);
    console.log(`\nProcessing ${images.length} images from cache...`);
    let copied = 0;
    let skipped = 0;
    const createdDirs = new Set<string>();
    
    for (const img of images) {
      const imageInfo = cacheFilenameToInfo.get(img);
      if (imageInfo) {
        // Create post subdirectory if needed
        const postDir = path.join(IMAGES_DEST, imageInfo.postShortUrl);
        if (!createdDirs.has(postDir)) {
          fs.mkdirSync(postDir, { recursive: true });
          createdDirs.add(postDir);
        }
        
        fs.copyFileSync(
          path.join(IMAGES_SRC, img),
          path.join(postDir, imageInfo.cleanName)
        );
        copied++;
      } else {
        // Image not referenced by any post - skip it
        skipped++;
      }
    }
    console.log(`Copied ${copied} images to ${createdDirs.size} post directories (skipped ${skipped} unreferenced)`);
  }
  
  console.log("\nDone!");
}

main();
