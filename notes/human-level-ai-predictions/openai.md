# OpenAI

OpenAI is a private company, and it runs on investment!

## Funding & Valuation

- **March 2025 (Series F):** $40 billion raised at $300 billion post-money valuation - the largest private funding round ever. [source](https://openai.com/index/march-funding-updates/)
- **October 2024 (Series E):** $6.6 billion raised at $157 billion post-money valuation. [source](https://openai.com/index/scale-the-benefits-of-ai/)
- **Total raised:** ~$57.9 billion across 9 funding rounds as of early 2025. [source](https://tracxn.com/d/companies/openai/__kElhSG7uVGeFk1i71Co9-nwFtmtyMVT7f-YHMn4TFBg/funding-and-investors)

### Microsoft investment timeline

Microsoft is OpenAI's most important investor, providing both cash and Azure compute credits.

In total, they have committed 13 billion, with $11.6 billion funded as of September 2025 [source](https://www.cnbc.com/2025/10/29/microsoft-open-ai-investment-earnings.html)

We don't have a breakdown for cash vs Azure credits, but training compute is paid via Azure credits (part of the investment), while inference is paid in cash.

### Other key investors

- SoftBank: $30 billion (lead in Series F) [source](https://taptwicedigital.com/stats/openai)

### Future funding (December 2025)

The Wall Street Journal reported OpenAI was seeking to raise $100 billion at a valuation of $830 billion, primarily to finance further expansion of computing infrastructure. [source](https://www.calcalistech.com/ctechnews/article/hkr1niibbl)

## Revenue

Note: OpenAI reports **ARR** (Annual Recurring Revenue) which is a single month's revenue × 12. Actual annual revenue is lower since earlier months had less revenue. OpenAI uses a calendar year (January-December). [source](https://www.wheresyoured.at/oai_docs/)

**ARR (per CFO Sarah Friar, Jan 2026):**

- 2023: $2B ARR [source](https://openai.com/index/a-business-that-scales-with-the-value-of-intelligence/)
- 2024: $6B ARR [source](https://openai.com/index/a-business-that-scales-with-the-value-of-intelligence/)
- 2025: $20B+ ARR (exiting year) [source](https://openai.com/index/a-business-that-scales-with-the-value-of-intelligence/)

**Computing capacity (per CFO Sarah Friar, Jan 2026):**

- 2024: 0.6 GW
- 2025: 1.9 GW (~3x increase)

[source](https://finance.yahoo.com/news/openai-cfo-says-annualized-revenue-173519097.html)

**Reported data points:**

- 2024: ~$3.7B actual (implied by The Information: first half 2025 revenue of $4.3B was "16% more than all of 2024") [source](https://www.theinformation.com/articles/openais-first-half-results-4-3-billion-sales-2-5-billion-cash-burn)
- 2024 (December): ~$500M/month (from $6B ARR ÷ 12)
- 2025 (first half, Jan-June): $4.3B (shareholder documents viewed by The Information) [source](https://www.entrepreneur.com/business-news/openai-saw-more-revenue-in-six-months-than-all-of-last-year/497774)
- 2025 (July): First $1B revenue month [source](https://www.saastr.com/openai-crosses-12-billion-arr-the-3-year-sprint-that-redefined-whats-possible-in-scaling-software/)

**2025 revenue analysis:**

These data points are internally consistent at ~10.4% month-over-month growth:

```python
# Given: Dec 2024 = $500M, need $4.3B total for Jan-June
# Binary search finds ~10.4% monthly growth fits both constraints
dec_2024, target_h1 = 500, 4300  # millions
r = 1.1038  # 10.38% monthly growth

# Monthly projection at this rate:
# Dec: $500M → Jan: $552M → Feb: $609M → Mar: $672M
#            → Apr: $742M → May: $819M → Jun: $904M
# H1 total: $4,299M ✓
# Jul (first $1B month): $998M ✓
```

Projecting this growth through year-end:

```python
# H2 projection at 10.4% monthly growth from July $1B:
# Jul: $1,000M → Aug: $1,104M → Sep: $1,218M
#             → Oct: $1,345M → Nov: $1,484M → Dec: $1,639M
# H2 total: $7,790M

# Full year 2025: $4,300M + $7,790M = $12,090M (~$12.1B)
# December 2025 ARR: $1,639M × 12 = $19.7B
```

**What this implies:**

- Sarah Friar's $20B+ ARR claim checks out (~$19.7B projected)
- OpenAI's $13B target would be slightly missed (~$12.1B)
- Sam Altman's claim of "well more" than $13B (BG2 podcast, November 2025) [source](https://techcrunch.com/2025/11/02/sam-altman-says-enough-to-questions-about-openais-revenue/) appears overstated—actual 2025 revenue likely ~$12B

Key takeaway: Dec 2025 revenue is about 1.6B, growth is about 10%/mo

## Expenses & Losses

### Microsoft internal documents

The money flows between Microsoft and OpenAI are complex and bidirectional:

**1. Microsoft invests in OpenAI (~$14B total)**

- Part cash, part Azure compute credits
- The credits are used to pay for **training** compute

**2. OpenAI pays Microsoft for Azure compute**

- **Training:** Paid via credits (non-cash) — doesn't appear as money spent [source](https://techcrunch.com/2025/11/14/leaked-documents-shed-light-into-how-much-openai-pays-microsoft/)
- **Inference:** Paid in cash — real money out the door [source](https://techcrunch.com/2025/11/14/leaked-documents-shed-light-into-how-much-openai-pays-microsoft/)

**3. Revenue share (bidirectional)** [source](https://techcrunch.com/2025/11/14/leaked-documents-shed-light-into-how-much-openai-pays-microsoft/)

- OpenAI → Microsoft: 20% of OpenAI's revenue (ChatGPT, API)
- Microsoft → OpenAI: 20% of Bing + Azure OpenAI Service revenue

#### What the Leaked Documents Show

**Ed Zitron obtained Microsoft's internal accounting** [source](https://www.wheresyoured.at/oai_docs/)

Most significantly, these show the costs that openai pays for azure inference (this is cash spent, not credits).

- **2024:** $3.8B inference / 12 months = **~$317M/month**
- **Jan-Sept 2025:** $8.65B / 9 months = **~$961M/month**

That's **3× the monthly burn rate** in under a year.

**Internal consistency check:** These numbers fit a ~11.5% monthly growth rate in inference costs (calculation: binary search for rate where 2024 total = $3.8B and Jan-Sept 2025 = $8.65B). This is close to the ~10.4% monthly revenue growth, which makes sense — more users = more inference.

**What we don't have from these documents:**

- Training compute costs (hidden in Azure credits, non-cash)
- Other costs (staff, advertising/sales, etc...)

### The Information leaked shareholder documents

[source](https://www.theinformation.com/articles/openais-first-half-results-4-3-billion-sales-2-5-billion-cash-burn)

The Information viewed OpenAI shareholder documents showing H1 2025 results. Key figures:

**GAAP expense line items:**

- R&D: $6.7B [source](https://sacra.com/c/openai/)
- Sales & advertising: $2B (nearly 2× full-year 2024 budget)
- Cost of revenue: ~$2.5B
- **Subtotal: $11.2B**

In this same document, we see that revenue for H1 was 4.3B, for a net loss of 6.9B.

Recall Zitron's numbers. Based on those, H1 2025 inference should be approximately $4.8B, but these documents show cash burn at 2.5B. A 2× discrepancy. I don't really know how to account for this.

maybe...

- "Cost of revenue" excludes some inference costs
- The Information's source had incomplete data
- Different accounting treatment

### Combining this info

Assuming a 10% monthly growth in usage, these numbers add up to:

Zitron: 1.8B inference cost in Dec 2025
The Information: .92B inference cost in Dec 2025

(Recall that we estimated revenue for this month to be 1.6B.)

This is a 2x discrepancy. Probably the cost is somewhere in between.

### WSJ investor documents (reported November 2025)

The Wall Street Journal obtained internal OpenAI financial documents that were "shared with investors this summer" (2025). The exact timing is unclear — could be May (before H1 closed) or July-August (after H1 actuals were known). The documents project $13B 2025 revenue, which matches late-summer timing when ARR had reached ~$13B. WSJ reported on these documents in November 2025. [source](https://fortune.com/2025/11/12/openai-cash-burn-rate-annual-losses-2028-profitable-2030-financial-documents/)

**Loss projections from these documents:**

- 2024: ~$5B loss
- 2025: ~$9B loss ($1.69 spent per $1 of revenue)
- 2026-2027: Burn rate at 57% of revenue
- 2028: ~$74B in operating losses (burn rate rises to ~75% of revenue, which is expected to be 100bn)

### Q3 2025 loss (Microsoft SEC filing)

Microsoft's Q1 FY2026 10-Q filing (covering July-September 2025) provides the clearest picture of OpenAI's finances we have, because Microsoft uses **equity method accounting** — they record their proportional share of OpenAI's actual net income or loss. [source](https://www.sec.gov/Archives/edgar/data/789019/000119312525256321/msft-20250930.htm)

**What the filing says:**

> "We have an investment in OpenAI Global, LLC ('OpenAI') and have made total funding commitments of $13 billion, of which $11.6 billion has been funded as of September 30, 2025. The investment is accounted for under the equity method of accounting, with our share of OpenAI's income or loss recognized in other income (expense), net."

> "Current year net income and diluted EPS were negatively impacted by net losses from investments in OpenAI, which resulted in a decrease in net income and diluted EPS of $3.1 billion and $0.41, respectively."

**Deriving OpenAI's total loss:**

Microsoft's $3.1B hit represents their share of OpenAI's net loss. To get the total:

- Microsoft owns **27%** of OpenAI (disclosed in the same filing)
- But before the for-profit conversion (during Q3), their stake was **32.5%**
- The $3.1B figure is **after tax**; page 37 shows the pre-tax loss was **$4.1B**

Using the more accurate pre-tax figure and original ownership:

```
$4.1B / 0.325 = $12.6B total OpenAI net loss for Q3 2025
```

**What "net loss" means:**

This is standard accounting: Revenue minus Expenses = negative number. Not a valuation change, not cash burn — actual income statement loss.

Our earlier estimate of revenue would put them at:
July: $1,000M
Aug: $1,104M
Sep: $1,219M
Q3 Total: $3,323M = $3.32B

A $12.6B loss implies $16B in total expenses for the quarter. This seems implausibly high compared to the H1 2025 leaked data ($11.2B for 6 months, implying ~$1.9B/month vs ~$5.3B/month in Q3).

**Analysts noticed this too:**

On Microsoft's earnings call, UBS analyst Karl Keirstead pressed CFO Amy Hood: "The investment in OpenAI that sits [in] other income at $4.1 billion is so large... It feels like it's so much larger than you were running through other income in prior quarters that it mustn't just be your share of the OpenAI losses." [source](https://www.thurrott.com/a-i/openai-a-i/329108/openai-lost-12-billion-in-the-previous-quarter)

Hood's response was vague: "That increased loss was all due to our percentage of losses and OpenAI equity method, just to be very clear." She didn't explain why the number was dramatically larger than one year ago ($523M → $3.1B), nor address expectations for future quarters.

Ed Zitron also flagged the discrepancy: "In the space of three months, OpenAI's costs went from a net loss of $13.5bn in six months to a net loss of $12bn in three months. Though there are likely losses related to stock-based compensation, this only represented a cost of $2.5bn in the first half of 2025." [source](https://www.wheresyoured.at/where-is-openais-money-going/)

**No satisfying explanation exists.** Possible factors:

- Stock compensation vesting events (but H1 stock comp was only $2.5B)
- Massive training runs in Q3
- The H1 leaked numbers were incomplete
- Accounting differences between internal docs and GAAP

## Commitments

### Microsoft Azure ($250B)

**Timeline:**

- **September 2025:** OpenAI and Microsoft signed a "non-binding memorandum of understanding" [source](https://www.tomshardware.com/tech-industry/artificial-intelligence/openai-and-microsoft-reach-an-understanding-over-ongoing-contract-negotiations-but-agi-clause-remains-an-uncertainty)
- **October 2025:** Upgraded to a "definitive agreement" (legal term for binding contract) [source](https://www.searchenginejournal.com/microsoft-locks-in-openai-partnership-through-2032/559492/)

**What we know:**

- OpenAI contracted to purchase $250B in Azure services [source](https://openai.com/index/next-chapter-of-microsoft-openai-partnership/)
- Timeframe is **undisclosed** [source](https://www.datacenterdynamics.com/en/news/openai-completes-for-profit-move-microsoft-given-27-stake-and-250bn-azure-contract-but-no-longer-has-cloud-right-of-first-refusal/)
- In exchange, Microsoft gave up "right of first refusal" on new cloud workloads — OpenAI can now use Oracle, AWS, etc.

**What we don't know:**

- The timeframe (could be 10+ years)
- Penalties if OpenAI can't pay
- Whether it's a minimum commitment or "up to" amount

At current inference rates (~$11-15B/year), $250B would take 15-20+ years unless they're planning massive scale-up.

### Other Infrastructure Commitments

OpenAI has announced ~$1.4 trillion in total infrastructure commitments over ~8 years: [source](https://tomtunguz.com/openai-hardware-spending-2025-2035/)

- **Broadcom:** $350B - Custom chips, 10GW deployment starting H2 2026
- **Oracle:** $300B - $60B/year for 5 years (2027-2031), Stargate project
- **Nvidia:** $100B - Hardware for 10GW of data centers
- **AMD:** $90B - 6GW of Instinct GPUs
- **Amazon AWS:** $38B - 7 years (2025-2031), GB200/GB300 GPUs
- **CoreWeave:** $22B - Data center usage through 2029

These are announcements/MOUs, not necessarily binding contracts. The deals ramp up significantly starting 2026-2027.

## Projections

### Expense projections (per WSJ investor documents, Nov 2025)

The Wall Street Journal obtained internal OpenAI financial documents shared with investors. [source](https://fortune.com/2025/11/12/openai-cash-burn-rate-annual-losses-2028-profitable-2030-financial-documents/)

**2025:**

- Total spending: ~$22 billion
- Revenue: ~$13 billion
- Net loss: ~$9 billion ($1.69 spent per $1 of revenue)

**Burn rate as % of revenue:**

- 2026: 57%
- 2027: 57%
- 2028: ~75% ("three-quarters of that year's revenue")

**Key projections:**

- 2028: ~$74 billion in operating losses
- Cumulative cash burn through 2029: $115 billion (per The Information)
- Profitability: Cash flow positive by 2029 or 2030
- 2030 revenue target: $200 billion

**Note:** These are projections from documents shared before the latest computing deals (Microsoft $250B, etc.) were signed, so actual spending may be higher.

### Revenue projections (per WSJ investor documents)

OpenAI's internal targets: $100B ARR by end of 2028, $200B ARR by end of 2030. [source](https://fortune.com/2025/11/12/openai-cash-burn-rate-annual-losses-2028-profitable-2030-financial-documents/)

Since OpenAI reports ARR (a single month × 12), these targets mean hitting $8.33B/month by Dec 2028 and $16.67B/month by Dec 2030.

**Fitting a growth curve** (see `revenue_projection.py`):

Starting from Dec 2025 at $1.6B/month with ~10%/month growth, we fit a decaying growth model: `r(t) = 10% × 0.87^t + 2.9%`. Growth rapidly decays (half-life ~5 months) from 10%/month to a steady ~3%/month (~41% annualized).

| Year | Dec Monthly Rev | ARR    | MoM Growth (Dec) | YoY × |
| ---- | --------------- | ------ | ---------------- | ----- |
| 2025 | $1.6B           | $19.2B | 10.0%            | —     |
| 2026 | $3.8B           | $45.0B | 4.7%             | 2.3×  |
| 2027 | $5.8B           | $69.7B | 3.2%             | 1.6×  |
| 2028 | $8.3B           | $100B  | 3.0%             | 1.4×  |
| 2029 | $11.8B          | $142B  | 2.9%             | 1.4×  |
| 2030 | $16.7B          | $200B  | 2.9%             | 1.4×  |

The key insight: the hard part is 2026. They need to sustain high growth long enough for the monthly run rate to roughly double (from $1.6B to $3.8B). After that, ~3%/month compounding does the rest.

### How realistic are these targets? (see `revenue_realism.py`)

**Current state (Dec 2025):** ~900M WAU [source](https://backlinko.com/chatgpt-stats), ~35-45M paid subscribers [source](https://www.contentgrip.com/openai-chatgpt-subscription-strategy/), 5% conversion, ~$25/month blended consumer ARPU.

**OpenAI's own 2030 user targets** (from The Information, Nov 2025): 2.6B WAU, 220M paid subscribers, 8.5% conversion [source](https://www.contentgrip.com/openai-chatgpt-subscription-strategy/).

**What the revenue curve requires at each year-end:**

| Year | Monthly Rev | WAU    | Paid Subs | Conversion | Consumer ARPU |
| ---- | ----------- | ------ | --------- | ---------- | ------------- |
| 2025 | $1.6B       | 900M   | 45M       | 5.0%       | $25/mo        |
| 2026 | $3.8B       | 1,100M | 62M       | 5.6%       | $40/mo        |
| 2028 | $8.3B       | 1,700M | 117M      | 6.9%       | $41/mo        |
| 2030 | $16.7B      | 2,600M | 220M      | 8.5%       | $38/mo        |

(Assumes consumer subscriptions decline from ~70% to ~50% of revenue as enterprise/API/ads grow.)

**Reality checks:**

1. **WAU growth (900M → 2.6B):** 24% CAGR. Requires reaching 47% of all internet users. Facebook took 13 years to hit 2B WAU. YouTube has ~2.5B monthly users. ChatGPT tripled WAU in 2025 (300M → 900M), but maintaining that pace gets harder as the base grows. Plausible but aggressive.

2. **Subscriber growth (45M → 220M):** 37% CAGR, 4.9× in 5 years. Netflix took 25 years to reach 300M, Spotify 18 years to reach 260M. Disney+ hit 150M in 5 years but then stalled. This would be the fastest subscriber ramp in history at this scale.

3. **Conversion rate (5% → 8.5%):** Ambitious but not unreasonable. Typical SaaS freemium converts 2-5%. If AI becomes essential for work, higher conversion is plausible. The new ChatGPT Go tier ($8/mo) could help by lowering the barrier.

4. **ARPU ($25 → $38/mo):** Requires meaningful Pro ($200/mo) adoption or price increases. The current tier mix is mostly Plus ($20). Enterprise seats command higher ARPU but are counted separately.

5. **Non-consumer revenue by 2030: $100B/year.** This is the hardest part. Even if consumer subs hit their targets, OpenAI needs the other half (~$100B/year) from enterprise contracts, API, ads, and new products. For context: Salesforce does $35B/year, AWS does $100B/year. OpenAI would need to build an AWS-scale enterprise business from scratch in 5 years.

**Bottom line:** The consumer subscription targets are aggressive but not impossible — they require ChatGPT to become as ubiquitous as YouTube. The real question mark is whether OpenAI can build $100B/year in non-consumer revenue (enterprise, API, ads, agents). That's unprecedented for a company this young.

**What $200B revenue requires:**

Current state (Dec 2025): 800M weekly active users, 15M paid subscribers (2% conversion), $36/month implied ARPU (based on 1.6B in Dec 2025).

10 million ChatGPT Plus subscribers paying $20/month (as of Sept 2024) [source](https://www.pymnts.com/artificial-intelligence-2/2024/openai-reportedly-projects-5-billion-loss-this-year/)

ChatGPT is projected to be ~50% of 2030 revenue ($100B). The remaining $100B comes from API (~20%), enterprise contracts, and new products (agents, Sora, etc.).

## Full financial picture (Beginning of 2026)

PitchBook tracks that OpenAI "has raised $63.9B" — total funding. [source](https://pitchbook.com/profiles/company/149504-14)
Tracxn tracks total funding raised at $57.9B.

**Cash out (losses):**

- 2023 losses: ~$2B (implied by $44B cumulative loss projection for 2023-2028) [source](https://the-decoder.com/openai-investors-face-high-risks-internal-forecasts-show/)
- 2024 losses: ~$5B (WSJ investor documents from summer 2025)
- 2025 losses: ~$14-20B (H1 loss of $6.9B per The Information [source](https://www.theinformation.com/articles/openais-first-half-results-4-3-billion-sales-2-5-billion-cash-burn); Q3 loss of ~$12.6B per Microsoft SEC filing [source](https://www.sec.gov/Archives/edgar/data/789019/000119312525256321/msft-20250930.htm) — but Q3 figure is disputed, see analysis above)

**Naive calculation: $57.9B - $19B = ~$39B**

However, "net loss" ≠ cash burn. Non-cash expenses (stock compensation, depreciation, consumed Azure credits) count toward accounting losses but don't reduce the bank balance. Stock comp alone was $2.5B in H1 2025, likely $5-10B cumulative over 2023-2025.

**Adjusted estimate:** If ~$8B of the $19B in losses was non-cash, actual cash burn was ~$11B, leaving **~$47B** in cash.

This is a rough estimate — we don't have precise data on cash vs non-cash expenses.

### Runway analysis

Leaked financial forecasts project OpenAI will burn $17B in cash in 2026, up from $9B in 2025. [source](https://eu.36kr.com/en/p/3624813808157699)

The Information reported annual cash burn rising from $17B (2026) to $35B (2027), peaking at $47B in 2028. [source](https://wiss.com/openai-valuation/)

At $64B cash and $17B/year burn, runway is ~3.75 years (mid-2029) without additional funding.

However, financial expert Sebastian Mallaby predicts OpenAI could run out of money "over the next 18 months" (i.e., mid-2027), arguing that competitors like Google, Microsoft, and Meta can fund AI development from legacy business profits while OpenAI doesn't have that luxury. [source](https://futurism.com/artificial-intelligence/financial-expert-openai-running-out-of-money)

Deutsche Bank expects OpenAI to accrue ~$143B in negative cumulative free cash flow between 2024 and 2029 before turning profitable. [source](https://www.emarketer.com/content/openai-forecast-143-billion-loss-raises-stakes-ai-monetization)

### Infrastructure commitments coming due

OpenAI is committed to pay ~$130B over 2026-2027. That's before the $1.4T in letters of intent to build data centers. [source](https://pivot-to-ai.com/2026/01/23/openai-faces-cash-crunch-in-2026-as-bills-come-due/)

This dramatically changes the runway picture — if these commitments are binding, the $64B on hand won't last long.
