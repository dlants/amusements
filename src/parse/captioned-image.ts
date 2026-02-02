import type {
  Extension as MicromarkExtension,
  Construct,
  Tokenizer,
  State,
  Code,
  TokenizeContext,
} from "micromark-util-types";
import type { Extension as FromMarkdownExtension } from "mdast-util-from-markdown";
import { markdownLineEnding } from "micromark-util-character";

declare module "micromark-util-types" {
  interface TokenTypeMap {
    captionedImage: "captionedImage";
    captionedImageMarkerStart: "captionedImageMarkerStart";
    captionedImageMarkerEnd: "captionedImageMarkerEnd";
    captionedImageAlt: "captionedImageAlt";
    captionedImageUrl: "captionedImageUrl";
  }
}

const nonLazyContinuation: Construct = {
  partial: true,
  tokenize: function (effects, ok, nok) {
    const self = this as TokenizeContext;
    return start;

    function start(code: Code): State | undefined {
      if (code === null) {
        return nok(code);
      }
      effects.enter("lineEnding");
      effects.consume(code);
      effects.exit("lineEnding");
      return lineStart;
    }

    function lineStart(code: Code): State | undefined {
      return self.parser.lazy[self.now().line] ? nok(code) : ok(code);
    }
  },
};

/**
 * Captioned image syntax:
 * ::image[alt text](/path/to/image.jpg)
 * Optional multi-line caption
 * with *formatting* and [links](url)
 * ::
 */
export function captionedImage(): MicromarkExtension {
  const captionedImageConstruct: Construct = {
    concrete: true,
    name: "captionedImage",
    tokenize: function (effects, ok, nok) {
      const self = this as TokenizeContext;

      const closingConstruct: Construct = {
        partial: true,
        tokenize: function (effects, ok, nok) {
          return start;

          function start(code: Code): State | undefined {
            if (!markdownLineEnding(code)) return nok(code);
            effects.enter("lineEnding");
            effects.consume(code);
            effects.exit("lineEnding");
            return atLineStart;
          }

          function atLineStart(code: Code): State | undefined {
            if (code !== 58) return nok(code); // :
            effects.enter("captionedImageMarkerEnd");
            effects.consume(code);
            return expectSecondColon;
          }

          function expectSecondColon(code: Code): State | undefined {
            if (code !== 58) return nok(code); // :
            effects.consume(code);
            effects.exit("captionedImageMarkerEnd");
            return afterClose;
          }

          function afterClose(code: Code): State | undefined {
            if (code === null || markdownLineEnding(code)) {
              return ok(code);
            }
            return nok(code);
          }
        },
      };

      return start;

      function start(code: Code): State | undefined {
        if (code !== 58) return nok(code); // :
        effects.enter("captionedImage");
        effects.enter("captionedImageMarkerStart");
        effects.consume(code);
        return colon2;
      }

      function colon2(code: Code): State | undefined {
        if (code !== 58) return nok(code); // :
        effects.consume(code);
        return expectI;
      }

      function expectI(code: Code): State | undefined {
        if (code !== 105) return nok(code); // i
        effects.consume(code);
        return expectM;
      }

      function expectM(code: Code): State | undefined {
        if (code !== 109) return nok(code); // m
        effects.consume(code);
        return expectA;
      }

      function expectA(code: Code): State | undefined {
        if (code !== 97) return nok(code); // a
        effects.consume(code);
        return expectG;
      }

      function expectG(code: Code): State | undefined {
        if (code !== 103) return nok(code); // g
        effects.consume(code);
        return expectE;
      }

      function expectE(code: Code): State | undefined {
        if (code !== 101) return nok(code); // e
        effects.consume(code);
        effects.exit("captionedImageMarkerStart");
        return expectBracket;
      }

      function expectBracket(code: Code): State | undefined {
        if (code !== 91) return nok(code); // [
        effects.consume(code);
        effects.enter("captionedImageAlt");
        return insideAlt;
      }

      function insideAlt(code: Code): State | undefined {
        if (code === null || markdownLineEnding(code)) return nok(code);
        if (code === 93) {
          // ]
          effects.exit("captionedImageAlt");
          effects.consume(code);
          return expectParen;
        }
        effects.consume(code);
        return insideAlt;
      }

      function expectParen(code: Code): State | undefined {
        if (code !== 40) return nok(code); // (
        effects.consume(code);
        effects.enter("captionedImageUrl");
        return insideUrl;
      }

      function insideUrl(code: Code): State | undefined {
        if (code === null || markdownLineEnding(code)) return nok(code);
        if (code === 41) {
          // )
          effects.exit("captionedImageUrl");
          effects.consume(code);
          return afterUrl;
        }
        effects.consume(code);
        return insideUrl;
      }

      function afterUrl(code: Code): State | undefined {
        if (code === null || markdownLineEnding(code)) {
          // Start caption section
          return atLineEnding(code);
        }
        return nok(code);
      }

      function atLineEnding(code: Code): State | undefined {
        if (code === null) {
          effects.exit("captionedImage");
          return ok(code);
        }
        // Try to match closing ::
        return effects.attempt(
          closingConstruct,
          afterClose,
          continueCaption,
        )(code);
      }

      function afterClose(code: Code): State | undefined {
        effects.exit("captionedImage");
        return ok(code);
      }

      function continueCaption(code: Code): State | undefined {
        if (!markdownLineEnding(code)) return nok(code);
        return effects.check(
          nonLazyContinuation,
          continueLine,
          afterClose,
        )(code);
      }

      function continueLine(code: Code): State | undefined {
        effects.enter("lineEnding");
        effects.consume(code);
        effects.exit("lineEnding");
        return inCaptionLine;
      }

      function inCaptionLine(code: Code): State | undefined {
        if (code === null || markdownLineEnding(code)) {
          return atLineEnding(code);
        }
        effects.consume(code);
        return inCaptionLine;
      }
    },
  };

  return {
    flow: {
      58: captionedImageConstruct,
    },
  };
}

export function captionedImageFromMarkdown(): FromMarkdownExtension {
  return {
    enter: {
      captionedImage(token) {
        this.enter(
          { type: "captionedImage", alt: "", url: "", caption: "" },
          token,
        );
      },
    },
    exit: {
      captionedImageAlt(token) {
        const node = this.stack[this.stack.length - 1] as {
          type: "captionedImage";
          alt: string;
        };
        node.alt = this.sliceSerialize(token);
      },
      captionedImageUrl(token) {
        const node = this.stack[this.stack.length - 1] as {
          type: "captionedImage";
          url: string;
        };
        node.url = this.sliceSerialize(token);
      },
      captionedImage(token) {
        // Parse caption from the full content
        const fullContent = this.sliceSerialize(token);
        const node = this.stack[this.stack.length - 1] as {
          type: "captionedImage";
          caption: string;
        };
        // Extract caption: everything after first line, before final ::
        const lines = fullContent.split("\n");
        if (lines.length > 1) {
          // Remove first line (::image[alt](url)) and last line (::)
          const captionLines = lines.slice(1);
          if (captionLines[captionLines.length - 1]?.trim() === "::") {
            captionLines.pop();
          }
          node.caption = captionLines.join("\n").trim();
        }
        this.exit(token);
      },
    },
  };
}
