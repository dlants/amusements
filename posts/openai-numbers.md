---
title: OpenAI by the Numbers
publishDate: "2026-06-01"
shortUrl: openai-numbers
draft: true
---

This post walks through every data point in the revenue plot, where it came from, and how it was derived.

## Observed monthly revenue (`DATA`)

These are realized monthly revenue (or run-rate) figures, not ARR and not projections.

- **Dec 2024 — \$0.50B/mo.** Derived from OpenAI's reported \$6B exit-2024 ARR ÷ 12. [source](https://openai.com/index/a-business-that-scales-with-the-value-of-intelligence/)
- **Jul 2025 — \$1.00B/mo.** OpenAI's first \$1B revenue month, per The Information (via saastr). [source](https://www.saastr.com/openai-crosses-12-billion-arr-the-3-year-sprint-that-redefined-whats-possible-in-scaling-software/)
- **Dec 2025 — \$2.00B/mo.** Run rate from OpenAI's March 2026 funding announcement. [source](https://openai.com/index/accelerating-the-next-phase-ai/)
- **Q1 2026 — \$1.90B/mo.** Derived from The Information's \$5.7B Q1 2026 figure ÷ 3. [source](https://www.theinformation.com/articles/openai-held-1-billion-revenue-lead-anthropic-first-quarter)
- **Mar 2026 — \$2.00B/mo.** Stated in OpenAI's \$122B funding round announcement. [source](https://openai.com/index/accelerating-the-next-phase-ai/)

## Where the 10%/month growth rate comes from

The 10%/month figure isn't reported by anyone. It's derived from known data points by solving for the rate that fits them.

- **Known:** Dec 2024 ≈ \$500M/month (\$6B ARR ÷ 12) and H1 2025 (Jan–June) totaled \$4.3B. [source](https://www.theinformation.com/articles/openais-first-half-results-4-3-billion-sales-2-5-billion-cash-burn)
- **Solve:** Find the monthly growth rate `r` such that, starting from \$500M in Dec 2024, the next six months sum to \$4.3B. A binary search gives **r ≈ 10.4%/month**.
- **Cross-check:** At that rate July 2025 lands at ~\$998M, matching the independently reported "first \$1B month." One rate fits three separate data points. [source](https://www.saastr.com/openai-crosses-12-billion-arr-the-3-year-sprint-that-redefined-whats-possible-in-scaling-software/)

An independent corroboration comes from the cost side: leaked Azure inference figures (\$3.8B in 2024 → \$8.65B in Jan–Sept 2025) fit ~11.5%/month growth, close to the revenue rate (more users → more inference). [source](https://www.wheresyoured.at/oai_docs/)

The script rounds 10.4% down to a flat **10%** as a round number for the intra-year reversal in `dec_from_annual` and as the `PROJECTION_MODEL` starting point. It is a fitted parameter, not a figure OpenAI stated.

## OpenAI's committed targets (`PROJECTED`)

Two of these are reverse-engineered from full-year revenue goals, and two are ARR targets.

The full-year goals are converted to a December monthly run rate by assuming 10%/mo growth within the year, so the 12 months sum to the annual goal: `dec = annual / S` where `S = sum(1.1^-j for j in 0..11)`.

- **Dec 2025 — reversed from the \$13B 2025 revenue target.** The \$13B target is from WSJ-reported internal documents. [source](https://fortune.com/2025/11/12/openai-cash-burn-rate-annual-losses-2028-profitable-2030-financial-documents/)
- **Dec 2026 — reversed from the \$30B 2026 revenue target.** ~\$30B for 2026 per reporting on Q1 2026 trajectory. [source](https://www.wheresyoured.at/news-openai-had-a-negative-122-operating-margin-in-q1-2026-and-chatgpt-growth-has-stalled/)
- **Dec 2028 — \$100B ARR ÷ 12 = \$8.33B/mo.** Internal target of \$100B ARR by end-2028. [source](https://fortune.com/2025/11/12/openai-cash-burn-rate-annual-losses-2028-profitable-2030-financial-documents/)
- **Dec 2030 — \$200B ARR ÷ 12 = \$16.67B/mo.** Internal target of \$200B ARR by end-2030. [source](https://fortune.com/2025/11/12/openai-cash-burn-rate-annual-losses-2028-profitable-2030-financial-documents/)

(ARR targets are already a monthly run rate × 12, so they're just divided by 12; the revenue-goal targets need the growth-curve reversal.)

## Projected growth model (`PROJECTION_MODEL`)

A decaying-growth curve fit starting from Dec 2025 at \$1.6B/mo, used to hit the \$100B (2028) and \$200B (2030) ARR targets. Each row is (year, December monthly run rate \$B, month-over-month growth):

- 2025 — \$1.6B/mo, 10.0%
- 2026 — \$3.8B/mo, 4.7%
- 2027 — \$5.8B/mo, 3.2%
- 2028 — \$8.3B/mo, 3.0%
- 2029 — \$11.8B/mo, 2.9%
- 2030 — \$16.7B/mo, 2.9%

Annual revenue for each year is computed as the sum of that year's 12 monthly revenues, reversed from the December run rate using that year's growth rate (not ARR, which is just Dec × 12). The model and its derivation are documented in `notes/human-level-ai-predictions/openai.md`.

## OpenAI annual revenue (`OPENAI_ANNUAL_ACTUAL`)

- **2024 — \$3.7B actual.** Implied by The Information: H1 2025 revenue (\$4.3B) was "16% more than all of 2024." [source](https://www.theinformation.com/articles/openais-first-half-results-4-3-billion-sales-2-5-billion-cash-burn)
- **2025 — \$12.0B actual/est.** From the month-by-month model in `openai.md` (~10.4%/mo growth from a \$500M Dec 2024 base), which sums to ~\$12.1B.

`OPENAI_ANNUAL_TARGET` is computed from `PROJECTION_MODEL` by summing each year's reversed monthly revenues.

## Comparable product segments (`COMPARABLES_ANNUAL`)

Segment-level annual revenue is used as a more apt comparison than whole-company totals for a single fast-scaling product line.

- **Google Search, Google Cloud, YouTube ads** — calendar-year segment revenue from Alphabet 10-K/8-K disclosures. [TODO: add specific filing links]
- **Azure (est.)** — Microsoft fiscal year (ending June), estimated. Microsoft first disclosed a dollar figure in FY2025 ("Azure surpassed \$75B, up 34%"); earlier years are back-calculated from disclosed Azure growth rates. [TODO: add filing link]
- **AWS** — calendar-year segment revenue from Amazon 10-K disclosures. [TODO: add specific filing links]

## Growth-reversal helpers

- `dec_from_annual(annual)` — converts a full-year revenue goal to its implied December run rate at 10%/mo intra-year growth.
- `annual_from_dec(dec, g)` — the inverse: sums 12 monthly revenues backward from a December run rate at growth `g`, used to turn the projection model's December run rates into annual revenue.
