import { fromMarkdown } from "mdast-util-from-markdown";
import { gfm } from "micromark-extension-gfm";
import { gfmFromMarkdown } from "mdast-util-gfm";
import { wikiLink, wikiLinkFromMarkdown } from "./wiki-link";
import { captionedImage, captionedImageFromMarkdown } from "./captioned-image";
import type { Root } from "mdast";

export function parseMarkdown(content: string): Root {
  return fromMarkdown(content, {
    extensions: [gfm(), wikiLink(), captionedImage()],
    mdastExtensions: [
      gfmFromMarkdown(),
      wikiLinkFromMarkdown(),
      captionedImageFromMarkdown(),
    ],
  });
}
