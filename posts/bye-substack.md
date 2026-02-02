---
title: Goodbye, Substack. Hello, self-hosting.
publishDate: 2023-08-27
shortUrl: bye-substack
tags: [tech, etc]
---

When I first started writing this blog, I had a Medium page. After a few years, Medium got really aggressive about pushing paid content on users, and putting articles behind paywalls. Also, the promised readership from the Medium network never materialized.

Substack was the hot new thing, so I figured I’d move my writing there. Now, Substack is getting pushier about getting reader’s emails and directing them to paid content.

I was also hoping that I’d get some traffic via the Substack network. That also didn’t really happen - I got about 600 page views from within the Substack network over the entire lifetime of the blog. The blog got about 30,000 views total, so Substack accounts for about 2% of my traffic.

What’s worse is that I got some complaints on my reddit posts about not being able to view the content, as people were confused about the banner that Substack places over the page trying to get the user’s email.

::image[What’s shown to many visitors to a Substack blog](/images/bye-substack/Screenshot_2023-08-27_at_6.46.39_PM.png)
What’s shown to many visitors to a Substack blog.
::

I’m guessing that many more than 2% of the potential visitors to my blog saw this, got annoyed or didn’t notice the “No thanks” button, and didn’t bother reading.

This was something that was in the back of my mind for a while. Aside from that, I found the inflexibility of the interface quite annoying. I want to write about several topics - tech, climbing, and other things - and I really wanted to set up an rss feed for each topic. I wanted to verify my Mastodon account w/ the blog, which required inserting a header into the page, which Substack didn’t allow me to do.

And of course, I don’t control the domain of my blog (this [costs $50 to set up](https://support.substack.com/hc/en-us/articles/360051222571-How-do-I-set-up-my-custom-domain-)), and have no control over how permanent the links are, or what Substack will do with the email addresses of the people who sign up.

A few weeks ago I read [your words are wasted](https://www.hanselman.com/blog/your-words-are-wasted) by Scott Hanselman, and it really stuck in my head. Overall it just didn’t feel like this was a space that *I owned*. So I decided to take the leap and self-host.

# in search for self-hosting tooling

I love the command line, and I love my editor ([neovim](https://neovim.io/), though I’ve been keeping an eye on [helix](https://helix-editor.com/) lately). I’ve made several attempts at writing blogs and documentation in markdown, using static site renderers like [Hugo](https://gohugo.io/) or [Jekyll](https://jekyllrb.com/), or note-taking tools like [neorg](https://github.com/nvim-neorg/neorg) or [Obsidian](https://obsidian.md/).

However, I find that writing prose in markdown introduces friction that gets in the way of my writing. I want to be able to see what my page will look like. I want to be able to embed videos and images. I want to easily split my content up into multiple files and link between them.

Lately, I’ve been having a really nice time using Notion. It’s free for individual users, so I decided to try to use it as the place where I write and organize my blog.

The next step was how to turn my Notion page into a website. Notion does allow one to [publish a page to the web](https://www.notion.so/help/guides/publish-notion-pages-to-the-web), but it’s not a really workable feature for something more permanent (no way to use your own domain, no control over links inside the page).

My next move was to try [Potion](https://potion.so/). However, I found that a previous version of my site got cached in the Potion system somehow, so when the page loaded it would show an old version of the site, before flashing to the latest content. Not ideal. Also, there was no rss support.

My next move was to try exporting the Notion page to html, and writing a script using [cheerio](https://cheerio.js.org/) to modify it. This worked fairly well, though I did find the process of manually exporting the site every time I had an update unsatisfying.

Next I ended up wiring up my script to the [Notion API](https://github.com/makenotion/notion-sdk-js). This way I could have my script use the API to fetch changes, and avoid the manual export step. I started out using [notion-render](https://github.com/kerwanp/notion-render), but found that I was writing a lot of custom renderers and encountered a couple of bugs, so I ended up swapping to writing my own.

# notion-to-static-site

It took a few weeks, but I now have something that works pretty well for managing this site - a package I wrote: [notion-to-static-site](https://github.com/dlants/notion-to-static-site).

You can see the [README](https://github.com/dlants/notion-to-static-site) for details, but in summary it:

- uses the notion api to get a target page and all of its children.
- renders the output to static html using react-dom and typestyle.
- has a basic responsive layout.
- generates rss and atom feeds for all of the databases in your page.
- supports tagging your posts, filtering by a tag, and also generates a feed for each tag.
I want this package to be really hackable, so for now I’m recommending folks fork the repo. This way you can easily change the implementation for how various elements are rendered and styled.

I wish there was a good way to share this work between different users. Perhaps I can split off some parts of the core into a package? I’m nervous that this will make local development more complicated to set up. Send me a note if you know of a good way to do this.

I know not everyone likes Notion, and it is still a centralized, paid service that I don’t control. In the future I may experiment with hooking up something like this to [AnyType](https://anytype.io/), though they don’t have a web interface or an API yet.

# hosting, etc…

To complete my site deployment, I use:

- [buttondown](https://buttondown.email/) for mailing lists, which is free for up to 100 recipients.
- [render](https://render.com/) for hosting / building. I think the static site hosting is completely free, so I’m only really using up the build minutes. It’s free up to 500 minutes per month, then you have to pay $5 per 1000 minutes.
Overall, the site is currently costing me $25/year (for the domain). That’s not bad at all!

I’m also planning on adding some non-invasive analytics, since I do find it motivating to see when my writing gets views. I’ll probably go for [open web analytics](https://www.openwebanalytics.com/).

# conclusion

With a bit of elbow grease, I now have a setup I’m really happy with. I can write in a comfortable environment, and have a fully customizable site that I own.

I hope that [notion-to-static-site](https://github.com/dlants/notion-to-static-site) helps others do the same!
