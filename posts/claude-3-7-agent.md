---
title: coding agents in the real world
publishDate: 2025-03-01
shortUrl: claude-3-7-agent
tags: [tech]
---

I read a lot of praise for coding tools and agents (Claude 3.7 especially), but I haven’t had as much success with applying such tools to my own project. I've been experimenting with using my [plugin](https://github.com/dlants/magenta.nvim) to work on the plugin code, which is 90% typescript and 10% lua.  I want to share my experience to provide a more nuanced take about what these agents can and cannot do. I hope this can help those who maybe are feeling some FOMO about not using them, and help ground your thinking about what the current state of AI agents is.

# coding agents writing code

As the plugin has grown, the usefulness of the agent has significantly diminished. I'm finding that even when I explicitly provide context to the agent by including all the relevant files, it still struggles to implement things.

I am definitely not relying on it to make any algorithmic or data structure decisions. I've experimented with this somewhat by providing more vague or open-ended prompts like "roll up these multiple diffs into a single diff" or "I'm seeing this bug try to fix it". The agent often addresses such prompts with superficial changes (like adding an interface for the requested feature but not actually implementing the guts of the feature). In order to get it to write reasonable, substantial changes I find that I have to give it step-by-step instructions, and I often feel like I have to go down to the level of pseudo-code, and often it struggles with even that.

I end up having to review the code very carefully. It is pretty sloppy about edge conditions (often including unnecessary guards or missing edge cases). It's very sloppy about things like adjusting coordinate systems (in neovim it's kind of a mess with 0-based and 1-based indexing and it definitely messes up things like this). The agent struggles with using consistent patterns like naming or using helper functions.

I also often see the [wine glass problem](https://www.reddit.com/r/ChatGPT/comments/1gas25l/your_mission_should_you_choose_to_accept_it_is_to/) emerge, where it drifts into “average code”. For example, I have a React-ish framework for rendering text into a buffer and often it starts writing JSX/React even though the included context has no react imports, no JSX, and plenty of examples of how to use the [template strings](https://github.com/dlants/magenta.nvim/blob/main/node/chat/chat.ts#L519).

I have not been able to get the agent to effectively use the tools available to it to actually explore the code and grab the relevant info (though I think I might try to reverse engineer Anthropic's new [Claude code agent](https://www.anthropic.com/news/claude-3-7-sonnet) to see what their tool definitions are... I think this can get significantly better with tuning).

# coding agents and disengagement

The thing I’m most worried about is my ability to stay engaged with problem solving while using these tools. I think about this in the context of [Kahneman’s System 1 vs System 2 thinking](https://thedecisionlab.com/reference-guide/philosophy/system-1-and-system-2-thinking). System 2 (slow, deliberate reasoning) is expensive and takes effort to engage.

I'm a very lazy guy (a quality that I think is important to embrace to be a high-level software engineer). I need to get my head in the right place to “click in” and actually absorb the context of the code and start engaging with the problem, but it's easy to lose that flow when you have the AI available. I find myself thinking “I wonder if I can just plug this into the chat window and get a solution?”, which takes me out of the flow.

I think this is actually quite distinct from what I used to do when I would go to Google or Stack Overflow. When searching, I would still be in the mental state of learning and problem solving - I wouldn’t expect to just find the answer. On the other hand, when I start interacting with the agent, it’s really easy to slip away from trying to solve the problem and into trying to figure out how to prompt the agent into solving the problem for you. My brain is eager to dump the context, rather than trying to expand it.

I’m pretty convinced that in many cases I've actually ended up spending more time trying to massage the AI into solving the problem than I would have just sitting down and working through it myself. I also find that overall I feel a lot less engaged while coding, which is concerning. This is something that I really want to understand better and mitigate as I continue using AI in my day to day work.

# the good

Having said that, I still think incorporating AI is useful for many things, which is why I keep investing time in it:

- Looking things up directly from the editor, being able to use natural language and ask followup questions, and having an easy ability to copy/paste between the chat buffer and the code file.
- Working with new languages. I got going with lua pretty fast, and I can quickly throw together boilerplate code like "show me how to traverse a table in reverse order", or "how would I send a HTTP request without blocking neovim". Normally I'd have to google this stuff and it definitely closes the loop much faster.
- Varied but predictable editing patterns, like "Something is going wrong in this function, can you add logging when x, y and z happen?" or "refactor this file to pull out this functionality". I'm pretty fast at stuff like this already via vim, but I do find myself reaching for the tool more often when normally I'd have to spend some time setting up macros or something.
- I think edit prediction (which is what I'm working on adding currently) will also be a big boon. I'm using copilot but I like the ability to predict the next edit rather than just the section immediately after what I’m typing, like a smarter auto-complete.
To summarize, AI really shines when you already know what you need to do, and you just need to go through the text editing motions to actually do it.

# the hype

When I see people talk about how much success they're having with coding assistants, I assume they are probably working with small or localized contexts, and also problems that squarely fit into the interpolation (rather than extrapolation) space. In other words, things that are fairly routine, where the LLM has plenty of working examples in the training corpus, rather than something new or something that combines existing pieces in a novel way.

Routine programming accounts for a lot of work that Software Engineers do, so I have no doubt that this will have some significant impact on the profession as a whole. I am certainly finding writing Terraform configs much easier these days. However I see this as just a continuation of a trend that’s been part of the profession since its inception. The Software Engineer’s job is not to churn out predictable, repeatable code. We automate the routine so that we can focus on solving novel problems.

I want to put this take out there, because I think it’s important to understand the distinction between what AI models are and are [not doing](https://arxiv.org/abs/2410.06992), especially when we start talking about agents going off and solving problems [on their own](https://devin.ai/).

I think agents are far from being able to problem-solve, based on my own experience trying to apply LLMs and coding agents to a context that’s actually similar to my work. I also haven’t really seen significant steps being taken in that direction. Claude 3.5 has remained the best coding model through the introduction of 4o and o1-mini (which struggle significantly even with generating tool invocations that match a schema). Claude 3.7 hasn’t really been distinguishable from 3.5 for me.

These are useful tools and they’ve certainly saved me time, but as with any tool, they have hteir limitations and drawbacks.


