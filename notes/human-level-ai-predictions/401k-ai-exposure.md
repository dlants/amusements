# 401k AI Exposure Calculation

## Data Sources (as of January 2026)

### S&P 500 Weights (Wikipedia, Jan 2026)

| Company   | Weight | AI-Related?       |
| --------- | ------ | ----------------- |
| NVIDIA    | 7.17%  | ✓ Primary         |
| Alphabet  | 6.39%  | ✓ Hyperscaler     |
| Apple     | 5.86%  | Partial           |
| Microsoft | 5.33%  | ✓ Hyperscaler     |
| Amazon    | 3.98%  | ✓ Hyperscaler     |
| Broadcom  | 2.51%  | ✓ AI chips        |
| Meta      | 2.49%  | ✓ Hyperscaler     |
| Tesla     | 2.31%  | Partial (AI hype) |

**Magnificent Seven total: 33.8% of S&P 500** (Motley Fool, Jan 2026)

### Direct AI Beneficiaries (conservative)

- NVIDIA: 7.17%
- Microsoft: 5.33%
- Alphabet: 6.39%
- Amazon: 3.98%
- Meta: 2.49%
- Broadcom: 2.51%

**Conservative AI exposure in S&P 500: ~27.9%**

### Typical Target-Date Fund Allocation (Fidelity Freedom 2055)

- U.S. Domestic Stock: ~54% (AAII data)
- Foreign Stock: ~36%
- Bonds: ~9%
- Cash: ~1%

Most of the domestic stock allocation tracks the S&P 500 or total market index.

## The Math

For **$100,000 in a typical workplace 401k** (e.g., Fidelity Freedom 2055):

### Path to S&P 500 exposure

- ~54% in US stocks → ~$54,000
- Most of this tracks large-cap (S&P 500-like) → conservatively ~80% = **$43,200 in S&P 500-like holdings**

### AI exposure within that

Using conservative 27.9% AI-heavy weight in S&P 500:

- $43,200 × 27.9% = **~$12,050 in AI-heavy stocks**

### By company (approximate)

| Company   | % of S&P | $ per $100K 401k |
| --------- | -------- | ---------------- |
| NVIDIA    | 7.17%    | ~$3,100          |
| Alphabet  | 6.39%    | ~$2,760          |
| Microsoft | 5.33%    | ~$2,300          |
| Amazon    | 3.98%    | ~$1,720          |
| Meta      | 2.49%    | ~$1,075          |
| Broadcom  | 2.51%    | ~$1,085          |
| **Total** | 27.9%    | **~$12,040**     |

## Summary for Post

Suppose you have $100K in a typical 401k, invested in a typical fund like Fidelity Freedom target-date 2055.

You hold approximately **54% in domestic stock** ([AAII fund data](https://www.aaii.com/fund/ticker/FDEWX)). Most of this tracks large-cap stocks allocated by S&P 500 weights.

Current S&P 500 weights for AI-related companies (as of January 2026, [Wikipedia](https://en.wikipedia.org/wiki/S&P_500)):

- NVIDIA: 7.17%
- Alphabet: 6.39%
- Microsoft: 5.33%
- Amazon: 3.98%
- Broadcom: 2.51%
- Meta: 2.49%

Furthermore, you likely hold approximately **36% in international stock**. The typical international index fund ([VEU holdings](https://stockanalysis.com/etf/veu/holdings/)) has TSMC at 3.18% and ASML at 1.19% - companies that manufacture and enable AI chips.

So your AI exposure ranges from:

- **~$4,200** in "pure-play" AI infrastructure (NVIDIA + TSMC + ASML + Broadcom)
- **~$14,000** if you include hyperscalers (adding Alphabet, Microsoft, Amazon, Meta)

Obviously an AI bubble bursting wouldn't affect Alphabet or Microsoft the same way it would NVIDIA - these companies have diversified revenue streams. But this is the range of exposure you're carrying, and these valuations are all elevated by AI expectations to varying degrees.

## International Holdings AI Exposure

Typical 401k international allocation uses funds like Vanguard FTSE All-World ex-US (VEU) or similar.

### VEU Top Holdings (AI-related)

| Company                     | Weight | Role                                  |
| --------------------------- | ------ | ------------------------------------- |
| Taiwan Semiconductor (TSMC) | 3.18%  | Makes chips for NVIDIA, Apple, AMD    |
| ASML Holding                | 1.19%  | Monopoly on advanced chip lithography |
| Samsung Electronics         | 0.92%  | Memory chips, foundry                 |
| **Subtotal AI-adjacent**    | ~5.3%  |                                       |

The top 10 holdings constitute only 11.4% of VEU - much less concentrated than S&P 500.

### International AI Exposure Calculation

For the ~$36,000 in international holdings (from $100K 401k):

- TSMC: $36,000 × 3.18% = ~$1,145
- ASML: $36,000 × 1.19% = ~$430
- Samsung: $36,000 × 0.92% = ~$330

**International AI exposure: ~$1,900**

## Total AI Exposure Summary

| Source               | Amount       |
| -------------------- | ------------ |
| US stocks (S&P 500)  | ~$12,000     |
| International stocks | ~$1,900      |
| **Total**            | **~$13,900** |

**For every $100K in a typical 401k, roughly $14,000 (14%) is in companies whose fortunes are tied to AI infrastructure success.**

## Caveats

- The ~54% domestic stock figure is for younger workers (2055 target date); closer to retirement would be lower
- "AI exposure" is a judgment call - Apple and Tesla have AI narratives but aren't pure-play
- Tencent, Alibaba (also in top 10 international) have AI efforts but aren't primarily AI-infrastructure plays
- TSMC specifically is the most critical - they manufacture virtually all advanced AI chips

## Alternative: Equal-Weighted S&P 500

If concerned about concentration, the post mentions RSPE (Invesco S&P 500 Equal Weight ESG).
In equal-weighted fund, each company is ~0.2% instead of market-cap weighted, dramatically reducing NVIDIA/hyperscaler exposure.
