---
title: AI Safety, Honestly
publishDate: "2026-03-26"
shortUrl: ai-alignment
tags: ["tech"]
draft: true
---

# Working notes

## My priors

- Superhuman AI is probably inevitable on some timeline
- Safety research inside profit-driven labs is not meaningfully independent from capabilities acceleration
- Motivated reasoning is everywhere in this field, including from people who sincerely believe they're on the right side
- My background: MS in ML (2013), decade of industry software engineering, written about why current LLMs lack the agentic world models necessary for genuine reasoning

## The key decomposition

There are two largely separate problem spaces getting lumped under "AI safety":

### Near-term / concrete

AI is a tool being deployed by powerful institutions right now. The risks are legible: mass surveillance, autonomous warfare, concentration of power. The actors are known (governments, defense contractors, the labs themselves). The failure mode is political, not technical. We don't need to predict anything about future capabilities to see the problem.

The threads:

- **Mass surveillance:** AI dramatically lowers the cost of monitoring populations at scale
- **Autonomous weapons:** Removing humans from the kill chain

But these are instances of a more general argument: AI is a technology that enables concentration of power. Historically, a dictator needed the consent of hundreds of thousands of people to rule, to surveil and threaten violence against the population. That dependency on human intermediaries was itself a check on power. AI collapses that dependency. A much smaller group of people can now wield surveillance and coercive force through automated systems, without needing a proportional base of human cooperation.

This isn't a new dynamic. Technology has been shifting this ratio for millennia. Lewis Mumford [argued](https://www.jstor.org/stable/3101118) that the first "machines" were human organizations themselves: a pharaoh organized thousands of laborers into a machine-like system, and each subsequent technology made the megamachine more efficient, requiring fewer willing participants. James C. Scott's concept of [legibility](https://yalebooks.yale.edu/book/9780300246759/seeing-like-a-state/) describes the prerequisite: states can only control what they can see, and each new technology of seeing (surnames, censuses, cadastral maps) increases the ratio of governed to governors. In political science, [selectorate theory](https://en.wikipedia.org/wiki/Selectorate_theory) formalizes this: a ruler needs a "winning coalition" of essential supporters, and technology that lets you reward or coerce without intermediaries shrinks that coalition.

AI is a step change in this trajectory. Previous technologies of control still required large bureaucracies to operate: someone had to read the census, staff the surveillance post, process the paperwork. AI removes that bottleneck. The minimum viable coalition for tyranny drops toward zero.

### Long-term / speculative (x-risk)

Superintelligent AI escapes human control. The risks are modeled, not observed. The actors are hypothetical future systems. The failure mode is technical (alignment) or structural (loss of control). This requires predicting capabilities trajectories and theorizing about agent behavior we haven't seen yet.

### The bridge

These aren't actually separate problems. They're connected by an institutional question: **do we have any mechanism for meaningfully constraining how AI is used by powerful actors?**

If the answer is no at current capability levels, then the x-risk conversation is building on sand. You can't solve the hard version of a problem you can't solve the easy version of.

This also maps onto the motivated reasoning concern. The x-risk community is largely funded by and embedded within the same ecosystem building frontier AI. Focusing on speculative future risk is, conveniently, less adversarial to their patrons than asking hard questions about what's being done with LLMs today.

## Open questions

- What are the serious, non-lab-captured threads of AI safety research?
- How much of alignment/interpretability research is genuinely orthogonal to capabilities vs. providing scientific substrate that gets absorbed into frontier model development?
- What are the strongest arguments that individual contributions to safety research actually change outcomes?
- Is there a meaningful distinction between AI safety as a technical research program and as a political/governance problem? Which framing is more tractable?
- What would it look like to contribute honestly, without providing cover for accelerationism?
