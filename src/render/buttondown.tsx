import * as React from "react";
import { pageLayout } from "./util";
import { renderHeader } from "./header";
import { SiteConfig, Page } from "../types";

export function renderButtondown(
  config: SiteConfig,
  pages: Map<string, Page>,
  tag?: string,
): string {
  const header = renderHeader(config, pages);

  const formHtml = `\
<form
  action="https://buttondown.email/api/emails/embed-subscribe/${config.buttondownId}"
  method="post"
  target="popupwindow"
  onsubmit="window.open('https://buttondown.email/${config.buttondownId}', 'popupwindow')"
  class="embeddable-buttondown-form"
>
  <label for="bd-email">Enter your email</label>
  <input type="email" name="email" id="bd-email" />
  ${tag ? `<input type="hidden" name="tag" value="${tag}" />` : ""}
  <input type="submit" value="Subscribe" />
  <p>
    <a href="https://buttondown.email/refer/${config.buttondownId}" target="_blank">Powered by Buttondown.</a>
  </p>
</form>`;

  return pageLayout({
    header,
    content: [
      <h1 key="title">
        Get emails when I write{" "}
        {tag ? `new posts tagged with "${tag}".` : "any new posts."}
      </h1>,
      <div key="form" dangerouslySetInnerHTML={{ __html: formHtml }} />,
    ],
    meta: { title: "newsletter" },
  });
}
