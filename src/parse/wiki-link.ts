import type { Extension as MicromarkExtension } from "micromark-util-types";
import type { Extension as FromMarkdownExtension } from "mdast-util-from-markdown";

declare module "micromark-util-types" {
  interface TokenTypeMap {
    wikiLink: "wikiLink";
    wikiLinkMarker: "wikiLinkMarker";
    wikiLinkData: "wikiLinkData";
  }
}

export function wikiLink(): MicromarkExtension {
  return {
    text: {
      91: {
        name: "wikiLink",
        tokenize(effects, ok, nok) {
          return start;

          function start(code: number | null) {
            if (code !== 91) return nok(code);
            effects.enter("wikiLink");
            effects.enter("wikiLinkMarker");
            effects.consume(code);
            return openBracket;
          }

          function openBracket(code: number | null) {
            if (code !== 91) return nok(code);
            effects.consume(code);
            effects.exit("wikiLinkMarker");
            effects.enter("wikiLinkData");
            return inside;
          }

          function inside(code: number | null) {
            if (code === null || code === 10 || code === 13) {
              return nok(code);
            }
            if (code === 93) {
              effects.exit("wikiLinkData");
              effects.enter("wikiLinkMarker");
              effects.consume(code);
              return closeBracket;
            }
            effects.consume(code);
            return inside;
          }

          function closeBracket(code: number | null) {
            if (code !== 93) return nok(code);
            effects.consume(code);
            effects.exit("wikiLinkMarker");
            effects.exit("wikiLink");
            return ok(code);
          }
        },
      },
    },
  };
}

export function wikiLinkFromMarkdown(): FromMarkdownExtension {
  return {
    enter: {
      wikiLink(token) {
        this.enter({ type: "wikiLink", value: "" }, token);
      },
    },
    exit: {
      wikiLinkData(token) {
        const node = this.stack[this.stack.length - 1];
        if (node.type === "wikiLink") {
          (node as { type: "wikiLink"; value: string }).value =
            this.sliceSerialize(token);
        }
      },
      wikiLink(token) {
        this.exit(token);
      },
    },
  };
}
