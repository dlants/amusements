---
title: "Predictions for Human-Level AI"
publishDate: "2026-02-02"
shortUrl: "human-level-ai-predictions"
tags: ["tech"]
draft: true
---

discourse about human-level ai
hype from OpenAI and Anthropic (at some point they claimed that they already had human-level AI right?)
lack of genuine discourse around whether this is possible or not. From my perspective, the conversation around this is really not talkign about the core issues around scaling and human-level intelligence.

## Issue 1: reverse-engineering the world from language

Human intelligence is based on a foundation of millenia of organisms embedded in reality and interacting with physics. Our brains evolved through interacting with the real world, and thus have a foundation of object permanence, causality, sense of number and space <TK... fill this out more. What other foundational elements are there?>.

Starting on this foundation, at some point humans developed a sophisticated social structure, and specialised brain structures like mirror neurons for modeling the behavior of others (<TK> use Ramachandran Tell tale brain for reference). Lanugage emerged on this very rich foundation.

Modern LLMs are in effect trying to reverse-engineer these deep structures about reality starting with the language abstraction. So naturally they struggle with many things that seem silly to us.

<TK example: spacial reasoning>
<TK example: object permanence, challenges around image and video models to maintain a coherent scene>
<TK example: sense of number. Pull data about AI's inability to do arithmetic up to large number of digits>
<TK example: allude to Gary Marcus's neurosymbolic AI>

One might object and say - well AIs are now being trained on video. Imagine trying to learn about the world through merely observing images and video. You may learn something about object permanence and causality.

Are LLMs able to generalize across the modalities of vision, sound and language? Training data that links these modalities together - image captions, transcripts of video, etc... is rather sparse (at least compared to the quantity of information avialable in the single modality). Image and video models have achieved some interesting progress lately. <TK do more research about this. I believe this is improving but is not nearly robust enough. The progress is consistent with _trying to reverse engineer reality from more abstract representations_, and as such will always be brittle and trip up in situations that humans find trivial.>

Humans evolved through an environment where they were fully embedded in the environment, had rich sensory fusion between bifocal vision and all of their other senses. Furthermore, we evolved in an environment with a tight coupling between perception and action. We perceive in order to act, and we act in order to perceive.

https://rodneybrooks.com/why-todays-humanoids-wont-learn-dexterity/
Summary: human dexterity is a tight coupling of fine motor and vision sensing. Modern robots do not have nearly as rich of sensory information available to them. Even if they did, perception-action coupled data is non-existent. <TK verify this>

While LLMs have benefitted from vast quantities of text, video and audio data available on the internet, we simply do not have this kind of data. We could collect it, but capturing rich, multisensory percpetion data that's coupled to action is extremely challenging. Personally, I believe that this is the sort of data that we need for unsupervised learning approaches to be able to start learning the <TK what's a good word for this. Low-level, primitives like object permanence?>

### What about world models?

<TK some activity around building physics simulations where AIs can gather this data>. I think the guy who left Facebook to found this isn't quite building actual world models? There was an article about that, maybe by Gary Marcus... I'll have to do some research on this.

This is a really promising direction! But I also think there's really limited information avialable online as to what success researchers have had in seeing benefits of world model training generalize to language. LLMs have billions of parameters, and there is plenty of space in those weights to predict language, and to predict a physical world _separately_. Is there any evidence that researchers have been able to cross that gap - to improve the LLMs command of language through training it on world models? This is extremely challening, and as far as I know hasn't been done.

## Issue 2: Architecture

GPTs are largely one-directional architectures. Information flows from tokens to deeper and deeper layers of the model, to the output layer. Information flows from earlier tokens to later ones, and that's it. Part of this is that our mechanisms for training them - backpropagation <TK does backpropagation put constraints on acyclicality?>. Part of this is to make them more computationally feasible. When we process token N+1, we reuse all of the computation up to token N, which is what makes it feasible to train and do inference on models of this size.

Human brains function in a rather different way. Rather than a single feed-forward pass, there is ongoing, distributed activity that eventually settles into a given pattern. There's also a lot of back-linking from deeper parts of various networks to earlier ones. For example, in our vision systems, it seems that information about _what_ we are looking at travels back to more low-level processing areas and helps our brains coalesce around a singular interpretation of what we're lookign at <TK: is this right? Source>

I think it's also interesting to compare the architectures of our brains to LLMs more generally. LLMs are wide, with each layer being possibly billions of weights, but ultimately they are not particularly deep <TK confirm this, how deep are modern LLMs?>. In contrast, human brains are <TK. How wide/deep?>.

This is not to say that the human brain architecture is _necessary_ to support things like object permanence, causality or logic. I do think it is useful to contextualize the LLM architectures we're dealing with however. The things that they can do are really impressive, but they are constrained in some very fundamental ways. Can current architectures represent things like mathematics or logic? Or would representing these structures (rather approximating parts of these structures, as LLMs currently do) require some other architecture, like neurosymbolic AI or even some other neural network design.

<TK papers on feed-forward architectures being insufficient to represent things>
see https://www.wired.com/story/ai-agents-math-doesnt-add-up/

# Research Labs and Secrecy

Betting against AI is difficult currently, due to the sheer amount of capital and brain power being thrown at it. One thing I've spent a lot of time thinking about is - what if there's a lab somewhere out there that's about to crack this? Hyperscalers are desperate for anything that will give them an edge, and will immediately throw massive resources behind any potential advancement. Maybe there are labs - even within OpenAI and Anthropic themselves - that are already working on all of these problems and keeping them hush-hush?

I think this is not likely for a few reasons.

There's been a lot of movement of people between these labs, so anything super secret would have been spread through the industry already.

Hyperscalers are burning money and are hyper-leveraged in debt. They are desperate for anything that makes them look like they are about to breach AGI, to secure more debt. Altman promised that AGI already existed at OpenAI, claimed that GPT5 was going to be it, then moved the goalposts. See what's happening with Anthropic / Cursor, or OpenAI floating a federal bailout. This looks like businesses worrying about cutting burn rate and worrying about paying off investors, not labs racing towards the final frontier.

Overall, my take is that these companies are not in a position to sit on innovations of the scale of world-model fusion or a new architecture. If such things were happening, we would hear about them from the CEOs themselves.

# What does this mean?

I'm not saying that AGI is impossible, or even that it won't come within our lifetime. I don't think there's anything special about our brains and what we do - and I do think that we will ultimately create AGI.

We have to remember though that neural networks were invented in <TK>. Backpropagation was invented in <TK>. Many of the advances that made modern GPTs possible were discovered gradually.

- attention mechanisms <TK>
- skip layers <TK>
- others? <TK>

My point is that current LLMs are limited in some very fundamental ways. They are very powerful, and they have taught us a lot about the boundaries between what they can do and general intelligence. These are new obstacles, and we are gaining a more and more crisp understanding of where the boundaries lie. But solving these obstacles will require research, which is notoriously unpredictable. It could take decades, and even then we might discover new and more nuanced issues.

I am also not saying that AIs aren't useful. I think even at current levels, they will fundamentally transform our society. (see [[AI is not mid - a response to Dr. Cottom’s NYT Op-Ed]])

However, the current frensy around AI doesn't seem to be engaging with these questions and realities. My interpretation is that this is a product of capital getting impatient and greedy - they saw the promise of GPTs, and, being gambling addicts that they are, went all in. And unfortunately they pulled most of our economy, tech sector, etc... with them.

## skin in the game

Nvidia is currently responsible for 7% of the S&P 500. If you add to that Microsoft, Google, Amazon, Meta and Broadcom, that's nearly 28%. A lot of this is predicated on the idea that we are in the final stretches of a race towards AGI. When AGI fails to materialize, that is going to take a big chunk out of the economy and the US tech sector.

More practically, if you are holding a typical 401k fund like Fidelity Freedom, about 4% of your retirement is invested in AI infrastructure (NVIDIA, TSMC, ASML, Broadcom), and up to 14% in hyperscalers (Alphabet, Microsoft, Amazon, Meta).

I recently switched jobs so I had the opportunity to swap my retirement savings to an IRA. In light of all of this thinking, I decided to use the flexibility afforded there to "put my money where my mouth is" so to speak, and switch my primary holdings to an equal-weighted ESG (RSPE). So now my exposure to AI is considerably smaller. This is not investing advise.
