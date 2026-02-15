"""
OpenAI revenue projection model.

Starting from $1.6B/month (Dec 2025), models linear decay in monthly growth rate
to hit OpenAI's internal $100B target for 2028.
"""

dec_2025 = 1.6  # billions
target_2028 = 100  # billions


def simulate(start_rate, decay_per_month, months=36):
    """Simulate revenue with decaying monthly growth rate."""
    rev = dec_2025
    monthly = []
    rates = []
    for m in range(months):
        rate = max(start_rate - decay_per_month * m, 0.01)  # floor at 1%
        rates.append(rate)
        rev = rev * (1 + rate)
        monthly.append(rev)

    return {
        "2026": sum(monthly[0:12]),
        "2027": sum(monthly[12:24]),
        "2028": sum(monthly[24:36]),
        "final_rate": rates[-1],
        "rates": rates,
    }


# Binary search for decay rate that hits $100B in 2028
lo, hi = 0.0, 0.01
for _ in range(50):
    mid = (lo + hi) / 2
    result = simulate(0.10, mid)
    if result["2028"] < target_2028:
        hi = mid
    else:
        lo = mid

decay = mid
result = simulate(0.10, decay)

print("LINEAR DECAY MODEL")
print(f"Start: 10% monthly, decay: {decay*100:.3f}% per month")
print(f'  2026: ${result["2026"]:.1f}B (ending rate: {result["rates"][11]*100:.1f}%)')
print(f'  2027: ${result["2027"]:.1f}B (ending rate: {result["rates"][23]*100:.1f}%)')
print(f'  2028: ${result["2028"]:.1f}B (ending rate: {result["rates"][35]*100:.1f}%)')
print()
print("Monthly growth rate trajectory:")
print(f'  Jan 2026: {result["rates"][0]*100:.1f}%')
print(f'  Jun 2026: {result["rates"][6]*100:.1f}%')
print(f'  Dec 2026: {result["rates"][11]*100:.1f}%')
print(f'  Jun 2027: {result["rates"][18]*100:.1f}%')
print(f'  Dec 2027: {result["rates"][23]*100:.1f}%')
print(f'  Jun 2028: {result["rates"][30]*100:.1f}%')
print(f'  Dec 2028: {result["rates"][35]*100:.1f}%')
print()
print("Annual growth (YoY):")
rev_2025 = 12.1  # from earlier analysis
print(f'  2025->2026: {(result["2026"]/rev_2025 - 1)*100:.0f}%')
print(f'  2026->2027: {(result["2027"]/result["2026"] - 1)*100:.0f}%')
print(f'  2027->2028: {(result["2028"]/result["2027"] - 1)*100:.0f}%')
