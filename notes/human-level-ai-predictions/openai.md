# OpenAI

OpenAI is a private company, and it runs on investment!

## Funding & Valuation

- **March 2025 (Series F):** $40 billion raised at $300 billion post-money valuation - the largest private funding round ever. [source](https://openai.com/index/march-funding-updates/)
- **October 2024 (Series E):** $6.6 billion raised at $157 billion post-money valuation. [source](https://openai.com/index/scale-the-benefits-of-ai/)
- **Total raised:** ~$57.9 billion across 9 funding rounds as of early 2025. [source](https://tracxn.com/d/companies/openai/__kElhSG7uVGeFk1i71Co9-nwFtmtyMVT7f-YHMn4TFBg/funding-and-investors)

### Microsoft investment timeline

Microsoft is OpenAI's most important investor, providing both cash and Azure compute credits:

- **July 2019:** $1 billion — Microsoft became OpenAI's exclusive cloud provider [source](https://www.startupbooted.com/openai-valuation-history)
- **2021:** Additional funding (NYT reports ~$2B total between 2019 and early 2023) [source](https://techcrunch.com/2023/01/23/microsoft-invests-billions-more-dollars-in-openai-extends-partnership/)
- **January 2023:** $10 billion [source](https://www.startupbooted.com/openai-valuation-history)
- **October 2024:** $750 million (part of $6.6B round) [source](https://www.startupbooted.com/openai-valuation-history)
- **Total committed:** $13 billion, with **$11.6 billion funded** as of September 2025 [source](https://www.cnbc.com/2025/10/29/microsoft-open-ai-investment-earnings.html)

**Cash vs credits:** We don't have a breakdown, but training compute is paid via Azure credits (part of the investment), while inference is paid in cash.

**Future commitment:** OpenAI has contracted to purchase $250 billion in Azure services going forward [source](https://www.cnbc.com/2025/10/29/microsoft-open-ai-investment-earnings.html)

### Other key investors

- SoftBank: $30 billion (lead in Series F) [source](https://taptwicedigital.com/stats/openai)
- NVIDIA: $100 million (October 2024, Series E) [source](https://taptwicedigital.com/stats/openai)

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

**Projections:**

- 2028: $100B (OpenAI internal projection from Q3 2025, per The Information) [source](https://www.theinformation.com/articles/openai-targets-more-than-100-billion-in-revenue-by-2029)

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
- **Subtotal: ~$11.2B**

Recall Zitron's numbers. Based on those, H1 2025 inference should be approximately $4.8B, but these documents show casj burn at 2.5B. A 2× discrepancy. I don't really know how to account for this.

The difference between the subtotal (11.2B) and the cost of revenue (2.5B) can be explained by:

- Stock compensation: ~$2.5B (shares, not cash)
- Training compute: Paid via Microsoft Azure credits (part of their investment), not cash

**What this means:** The R&D figure ($6.7B) includes non-cash items like stock comp and possibly training compute credits. We can't cleanly separate "how much did OpenAI spend on training" from these numbers.

**Discrepancy with Microsoft documents:** The Information reports "cost of revenue" at $2.5B for H1 2025, but Zitron's Microsoft documents show inference alone was $5B for H1 2025. Either:

- "Cost of revenue" excludes some inference costs
- The Information's source had incomplete data
- Different accounting treatment

### Q3 2025 loss (Microsoft SEC filing)

Ed Zitron reported that Microsoft's Q1 FY2026 SEC filing (covering July-September 2025) showed **OpenAI lost $12B in that single quarter**. [source](https://www.wheresyoured.at/where-is-openais-money-going/)

This is 4-5x the H1 2025 cash burn rate ($2.5B over 6 months).

**TODO:** Trace this to the actual Microsoft 10-Q filing and verify. Zitron claims this is "actual, real accounting" from SEC filings, not leaked documents.

### Key Insights

- **Inference is the real cash bleed:** $3.8B (2024) → $8.65B (first 9 months of 2025). This is actual money, not credits.
- **Training costs are obscured:** Paid via Microsoft investment credits, so they don't appear as cash expenses.
- **We can't derive revenue from revenue share:** The leaked numbers are NET (after Microsoft's payments to OpenAI are deducted), and Microsoft doesn't disclose Bing/Azure OpenAI revenue.

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

- **Cumulative losses before profitability:** Could reach $143 billion (Deutsche Bank forecast) [source](https://www.tradingkey.com/analysis/stocks/us-stocks/261490879-openai-revenue-advertisement-tradingkey)
- **Funding gap by 2030:** $207 billion (HSBC estimate) [source](https://finance.yahoo.com/news/openai-is-the-2025-yahoo-finance-company-of-the-year-120054312.html)
- **IPO:** Potentially at $1 trillion valuation as early as late 2026 [source](https://finance.yahoo.com/news/openai-is-the-2025-yahoo-finance-company-of-the-year-120054312.html)

## Users

- 500 million weekly active users (April 2025) [source](https://taptwicedigital.com/stats/openai)
- ~10 million ChatGPT Plus subscribers paying $20/month (as of Sept 2024) [source](https://www.pymnts.com/artificial-intelligence-2/2024/openai-reportedly-projects-5-billion-loss-this-year/)
- 1 million+ organizations using OpenAI technology (December 2025) [source](https://sacra.com/c/openai/)
