"""
How realistic are OpenAI's revenue targets given their current user base?

Known (Dec 2025):
  - ~900M weekly active users (WAU)
  - ~35M paid subscribers (as of July 2025; likely ~45M by Dec)
  - $1.6B/month revenue
  - Conversion rate: ~5% (paid/WAU)

OpenAI's own 2030 targets (from The Information):
  - 2.6B WAU
  - 220M paid subscribers
  - 8.5% conversion rate
  - $200B ARR ($16.67B/month)

Revenue streams:
  - Consumer subscriptions: ~70% of revenue (ChatGPT Plus $20, Pro $200, Go $8)
  - Enterprise/Business: ~15%
  - API: ~10%
  - Other (licensing, new products): ~5%

Sources:
  - 900M WAU: https://backlinko.com/chatgpt-stats
  - 35M paid subs (July 2025): https://www.contentgrip.com/openai-chatgpt-subscription-strategy/
  - 220M subs / 2.6B WAU / 8.5% by 2030: https://www.contentgrip.com/openai-chatgpt-subscription-strategy/
  - ChatGPT = 75% of 2024 revenue: https://sociallyin.com/open-ai-chat-gpt-statistics/
"""

# === Current state (Dec 2025 estimates) ===
current_wau = 900e6
current_paid = 45e6  # ~35M in July, extrapolating modest growth
current_monthly_rev = 1.6e9  # $1.6B
current_conversion = current_paid / current_wau

# Implied blended ARPU (across all paid tiers)
# Not all revenue is from consumer subs. Estimate ~70% is consumer subscription revenue.
consumer_rev_share = 0.70
consumer_rev = current_monthly_rev * consumer_rev_share
implied_arpu = consumer_rev / current_paid

print("=== CURRENT STATE (Dec 2025) ===")
print(f"  WAU: {current_wau/1e6:.0f}M")
print(f"  Paid subscribers: {current_paid/1e6:.0f}M")
print(f"  Conversion rate: {current_conversion:.1%}")
print(f"  Monthly revenue: ${current_monthly_rev/1e9:.1f}B")
print(f"  Consumer sub revenue (~70%): ${consumer_rev/1e9:.2f}B/month")
print(f"  Implied consumer ARPU: ${implied_arpu:.0f}/month")
print()

# === Revenue targets (from our growth curve fit) ===
targets = {
    2025: {"monthly_rev": 1.6e9},
    2026: {"monthly_rev": 3.75e9},
    2027: {"monthly_rev": 5.81e9},
    2028: {"monthly_rev": 8.34e9},
    2029: {"monthly_rev": 11.81e9},
    2030: {"monthly_rev": 16.67e9},
}

# === OpenAI's own user projections (interpolated) ===
# They target 2.6B WAU and 220M paid subs by 2030
# Current: 900M WAU, ~45M paid
# Let's interpolate assuming smooth growth

import math

def interpolate_exp(start, end, years, y):
    """Exponential interpolation from start to end over 'years' years, return value at year y."""
    rate = (end / start) ** (1 / years)
    return start * rate ** y

print("=== WHAT THE TARGETS REQUIRE ===")
print()
print(f"{'Year':>6} {'Monthly Rev':>12} {'WAU':>8} {'Paid Subs':>10} {'Conv %':>8} {'ARPU':>8} {'Notes':>30}")
print("-" * 90)

for year in range(2025, 2031):
    y = year - 2025
    rev = targets[year]["monthly_rev"]
    
    # Interpolate WAU: 900M -> 2600M over 5 years
    wau = interpolate_exp(900e6, 2600e6, 5, y)
    
    # Interpolate paid subs: 45M -> 220M over 5 years
    paid = interpolate_exp(45e6, 220e6, 5, y)
    
    conv = paid / wau
    
    # If consumer subs stay at 70% of revenue initially, declining to 50% by 2030
    # (as OpenAI plans new revenue streams like ads, shopping)
    consumer_share = 0.70 - (0.20 * y / 5)  # 70% -> 50%
    consumer_rev = rev * consumer_share
    arpu = consumer_rev / paid
    
    notes = ""
    if year == 2025:
        notes = "(current)"
    
    print(f"{year:>6} ${rev/1e9:>10.2f}B {wau/1e6:>7.0f}M {paid/1e6:>9.1f}M {conv:>7.1%} ${arpu:>6.0f}/mo {notes:>30}")

print()
print("=== REALITY CHECKS ===")
print()

# 1. WAU growth
wau_2030 = 2600e6
wau_cagr = (wau_2030 / current_wau) ** (1/5) - 1
print(f"1. WAU Growth: {current_wau/1e6:.0f}M → {wau_2030/1e6:.0f}M (5-year CAGR: {wau_cagr:.0%})")
print(f"   For context: global internet users ~5.5B, smartphone users ~4.6B")
print(f"   2.6B WAU = {2600/5500*100:.0f}% of internet users, {2600/4600*100:.0f}% of smartphone users")
print(f"   Facebook hit 2B WAU (took 13 years). YouTube has ~2.5B monthly users.")
print(f"   ChatGPT went 300M→900M WAU in 12 months (3× in 1 year)")
print()

# 2. Subscriber growth  
paid_2030 = 220e6
paid_cagr = (paid_2030 / current_paid) ** (1/5) - 1
print(f"2. Subscriber Growth: {current_paid/1e6:.0f}M → {paid_2030/1e6:.0f}M (5-year CAGR: {paid_cagr:.0%})")
print(f"   Netflix: ~300M paid subs (took 25 years)")
print(f"   Spotify: ~260M paid subs (took 18 years)")
print(f"   Disney+: ~150M subs (took 5 years)")
print(f"   OpenAI needs 220M in 5 years from 45M — that's 4.9× growth")
print()

# 3. Conversion rate
print(f"3. Conversion Rate: {current_conversion:.1%} → 8.5%")
print(f"   Spotify free-to-paid: ~45%")
print(f"   Typical SaaS freemium: 2-5%")
print(f"   8.5% is ambitious but not unreasonable if the product keeps improving")
print()

# 4. ARPU trajectory
consumer_rev_2030 = targets[2030]["monthly_rev"] * 0.50
arpu_2030 = consumer_rev_2030 / paid_2030
print(f"4. ARPU: ${implied_arpu:.0f}/mo → ${arpu_2030:.0f}/mo")
print(f"   Current tier mix: Plus ($20), Pro ($200), Go ($8)")
print(f"   If mostly Plus: hard to grow ARPU much above $25")
print(f"   Need Pro adoption or price increases to push higher")
print()

# 5. Non-consumer revenue
non_consumer_2030 = targets[2030]["monthly_rev"] * 0.50
print(f"5. Non-Consumer Revenue by 2030: ${non_consumer_2030/1e9:.1f}B/month (${non_consumer_2030*12/1e9:.0f}B/year)")
print(f"   Enterprise + API + Ads + Shopping + Licensing")
print(f"   For context: Salesforce total revenue ~$35B/year")
print(f"   AWS revenue ~$100B/year")
print(f"   OpenAI needs ${non_consumer_2030*12/1e9:.0f}B/year from non-consumer sources alone")
print()

# 6. The hardest year: 2026
print(f"6. The Hardest Year: 2026")
rev_2026 = targets[2026]["monthly_rev"]
growth_needed = rev_2026 / current_monthly_rev
wau_2026 = interpolate_exp(900e6, 2600e6, 5, 1)
paid_2026 = interpolate_exp(45e6, 220e6, 5, 1)
print(f"   Monthly revenue must grow {growth_needed:.1f}× (${current_monthly_rev/1e9:.1f}B → ${rev_2026/1e9:.2f}B)")
print(f"   Need WAU: {wau_2026/1e6:.0f}M, Paid: {paid_2026/1e6:.0f}M")
print(f"   This requires sustaining ~5-10%/month growth while the rate is already decelerating")
print(f"   Current trajectory (10%/mo decaying) makes this plausible if models keep improving")
