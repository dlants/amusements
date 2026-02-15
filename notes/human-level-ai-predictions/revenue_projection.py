"""
Fit a decaying monthly growth curve for OpenAI revenue projections.

Known:
  - Dec 2025: $1.6B/month (current)
  - Current monthly growth: ~10%
  
Targets (interpreting OpenAI's ARR targets as end-of-year ARR):
  - Dec 2028: $100B ARR → $8.33B/month
  - Dec 2030: $200B ARR → $16.67B/month

Model: monthly growth rate r(t) = r0 * decay^t + r_floor
  where t is months after Dec 2025
  Two free parameters: decay, r_floor
"""

import math

R0 = 1.6       # Dec 2025 monthly revenue ($B)
r0 = 0.10      # Current monthly growth (10%)
target_36 = 100 / 12   # Dec 2028 monthly target
target_60 = 200 / 12   # Dec 2030 monthly target


def project(decay, r_floor, months=60):
    revenue = [R0]
    for t in range(1, months + 1):
        rate = r0 * (decay ** t) + r_floor
        revenue.append(revenue[-1] * (1 + rate))
    return revenue


def objective(decay, r_floor):
    rev = project(decay, r_floor, 60)
    err1 = (rev[36] - target_36) ** 2
    err2 = (rev[60] - target_60) ** 2
    return err1 + err2


# Grid search then refine
best_err = float('inf')
best_params = (0.95, 0.02)

for decay_i in range(800, 1000):
    decay = decay_i / 1000
    for floor_i in range(0, 100):
        r_floor = floor_i / 1000
        err = objective(decay, r_floor)
        if err < best_err:
            best_err = err
            best_params = (decay, r_floor)

# Refine with finer grid around best
d0, f0 = best_params
for decay_i in range(int(d0 * 10000) - 100, int(d0 * 10000) + 100):
    decay = decay_i / 10000
    for floor_i in range(int(f0 * 10000) - 100, int(f0 * 10000) + 100):
        r_floor = floor_i / 10000
        if decay <= 0 or decay >= 1 or r_floor < 0:
            continue
        err = objective(decay, r_floor)
        if err < best_err:
            best_err = err
            best_params = (decay, r_floor)

decay, r_floor = best_params
rev = project(decay, r_floor, 60)

print(f"Model: r(t) = {r0:.0%} × {decay:.4f}^t + {r_floor:.4%}")
print(f"  Initial monthly growth: {r0:.1%}")
print(f"  Asymptotic monthly growth: {r_floor:.2%}")
half_life = math.log(2) / (-math.log(decay)) if decay < 1 else float('inf')
print(f"  Growth rate half-life: {half_life:.1f} months")
print(f"  Fit error: {best_err:.6f}")
print()

# December snapshots
print("December monthly revenue and required YoY growth:")
print(f"{'Year':>6} {'Monthly ($B)':>14} {'ARR ($B)':>10} {'MoM at Dec':>12} {'YoY ×':>8}")
print("-" * 54)
for yr in range(6):
    t = yr * 12
    if t > 60:
        break
    year = 2025 + yr
    rate = r0 * (decay ** t) + r_floor if t > 0 else r0
    yoy = f"{rev[t] / rev[t - 12]:.2f}×" if t >= 12 else "—"
    print(f"{year:>6} {rev[t]:>14.2f} {rev[t] * 12:>10.1f} {rate:>11.1%} {yoy:>8}")

print()
print("Target check:")
print(f"  Dec 2028: ${rev[36]:.2f}B/month (ARR ${rev[36]*12:.1f}B) — target $8.33B (ARR $100B)")
print(f"  Dec 2030: ${rev[60]:.2f}B/month (ARR ${rev[60]*12:.1f}B) — target $16.67B (ARR $200B)")

# Actual annual revenue
print()
print("Actual annual revenue (sum of 12 monthly figures):")
for year_offset in range(5):
    start = 1 + year_offset * 12   # Jan of year
    end = 12 + year_offset * 12    # Dec of year
    if end > 60:
        break
    annual = sum(rev[t] for t in range(start, end + 1))
    year = 2026 + year_offset
    prev_annual = sum(rev[t] for t in range(start - 12, end - 12 + 1)) if year_offset > 0 else None
    yoy = f"  ({annual / prev_annual:.1f}×)" if prev_annual else ""
    print(f"  {year}: ${annual:.1f}B{yoy}")
