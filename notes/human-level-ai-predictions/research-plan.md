# Research Plan: Human-Level AI Predictions

## Central Thesis

The AI industry is currently over-leveraged, and this leverage is largely founded on the assumption that AGI is just around the corner. This article argues that:

1. There are fundamental technical obstacles to AGI that current approaches haven't solved
2. The financial structure of the AI industry depends on AGI being imminent
3. When AGI fails to materialize on the promised timeline, there will be significant economic consequences

---

## Current Focus: NVIDIA and OpenAI

The full landscape is too complex to cover comprehensively. Focus research on these two entities:

- **OpenAI** - The leading AI lab making AGI promises, with massive infrastructure commitments
- **NVIDIA** - The central node of AI infrastructure, investor in the ecosystem, benefits from circular economy

Understanding these two in depth will illuminate the broader dynamics.

See: `openai.md`, `nvidia.md` (need to be rewritten with proper URL citations)

---

## Part 1: Understanding AI Industry Leverage

### How much have they borrowed and from whom?

- [ ] OpenAI total funding raised and debt
- [ ] Anthropic total funding raised and debt
- [ ] Hyperscaler (Microsoft, Google, Amazon, Meta) AI-specific debt/capex
- [ ] "Neocloud" companies (CoreWeave, Lambda) debt financing
- [ ] Sources of this capital (VCs, banks, bond markets, etc.)

### What terms/valuations/promises?

- [ ] OpenAI valuation history and what was promised at each round
- [ ] Anthropic valuation and investor expectations
- [ ] Hyperscaler capex projections and stated justifications
- [ ] What timelines have been promised for AGI/returns?

### Current financial position

- [ ] OpenAI cash on hand vs burn rate
- [ ] Anthropic cash on hand vs burn rate
- [ ] Hyperscaler debt-to-cash ratios
- [ ] Revenue vs costs for major AI labs

### Signals of financial stress

- [ ] OpenAI restructuring rumors, federal bailout floating
- [ ] Anthropic/Cursor situation
- [ ] Credit default swap spreads (especially Oracle)
- [ ] Any layoffs, project cancellations, or pivot signals
- [ ] CEO statements that suggest goalpost-moving

---

## Part 2: Technical Obstacles to AGI

### Issue 1: Reverse-engineering the world from language

- [ ] Fill out foundational elements humans have (object permanence, causality, sense of number/space - what else?)
- [ ] Add Ramachandran "Tell-Tale Brain" reference for mirror neurons
- [ ] Add example: spatial reasoning challenges in LLMs
- [ ] Add example: object permanence / image+video model coherence issues
- [ ] Add example: sense of number - data on AI arithmetic failures at large digit counts
- [ ] Add example: Gary Marcus's neurosymbolic AI
- [ ] Research multimodal generalization progress (vision/sound/language fusion)
- [ ] Verify claim about perception-action coupled data being non-existent
- [ ] Find better term for "low-level primitives like object permanence"

#### World Models subsection

- [ ] Research physics simulation labs (the Facebook guy who left?)
- [ ] Find Gary Marcus article on world models
- [ ] Research: any evidence of world-model training improving language capabilities?

### Issue 2: Architecture

- [ ] Does backpropagation constrain architectures to be acyclic?
- [ ] Source for vision system back-linking (deeper areas feeding back to low-level processing)
- [ ] How deep are modern LLMs? (layers vs width)
- [ ] How wide/deep are human brains comparatively?
- [ ] Papers on feed-forward architectures being insufficient for logic/math

### Historical dates to fill in

- [ ] When were neural networks invented?
- [ ] When was backpropagation invented?
- [ ] When were attention mechanisms introduced?
- [ ] When were skip layers introduced?
- [ ] Other key advances?

---

## Part 3: Financial/Economic Claims to Verify

### Ed Zitron's analysis - validity assessment

Zitron's core claims and their support:

**Well-supported claims (corroborated by mainstream financial sources):**

- [ ] ~$121B debt raised by hyperscalers in 2025 (Bank of America confirms)
- [ ] $602B projected capex for 2026, ~75% for AI (CreditSights confirms)
- [ ] OpenAI loses ~$5B/year on ~$3.7B revenue (widely reported)
- [ ] Anthropic lost ~$2.7B in 2024 (widely reported)
- [ ] "Neocloud" companies (CoreWeave, Lambda) are heavily debt-financed
- [ ] Credit markets showing unease - CDS spreads widening, especially Oracle

**Contested/nuanced claims:**

- [ ] "Circular economy" thesis - NVIDIA investing in neoclouds who buy NVIDIA GPUs
  - The New Stack's Lawrence Hecht: "this isn't unusual" for tech ecosystem
  - CNBC calls it "circular" but notes "it works as long as growth holds"
- [ ] Hyperscalers "drowning in debt" - BofA counterpoint: debt-to-cash ratio actually improving (0.94 → 0.75), cash flow projected to hit $1.1T by 2029
- [ ] "No demand" for AI - MIT study (95% of corporate AI projects not improving profits) but small sample size (52 interviews)

**Key question to resolve:** Is this more like dot-com fiber boom (infrastructure survived, investors wiped out) or fundamentally unsound?

### Specific numbers to verify

- [x] Accurate S&P 500 percentages for AI-related companies (NVIDIA 7.17%, see 401k-ai-exposure.md)
- [x] Accurate Fidelity Freedom allocation numbers (see 401k-ai-exposure.md)
- [ ] Oracle's specific debt/risk position (most vulnerable hyperscaler per multiple sources)
