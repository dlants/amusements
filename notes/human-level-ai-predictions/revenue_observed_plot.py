"""
Plot observed OpenAI monthly revenue over time.

Only realized monthly revenue data points (not ARR, not projections).
Each point is a reported/derived monthly run rate. Sources are in openai.md
under "Observed Revenue".

Output: revenue_observed.png
"""

import datetime
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import matplotlib.dates as mdates
from adjustText import adjust_text

# (date, monthly revenue in $B, label, source-note)
DATA = [
    (datetime.date(2024, 12, 1), 0.50, "Dec 2024", "from $6B ARR / 12"),
    (datetime.date(2025, 7, 1), 1.00, "Jul 2025", "first \\$1B month (The Information)"),
    (datetime.date(2025, 12, 1), 2.00, "Dec 2025", "OpenAI Mar 2026 announcement"),
    (datetime.date(2026, 2, 1), 1.90, "Q1 2026", "\\$5.7B/quarter (The Information)"),
    (datetime.date(2026, 3, 1), 2.00, "Mar 2026", "OpenAI \\$122B funding round"),
]

# OpenAI's own committed/internal revenue targets.
# Full-year revenue goals are reversed into a December monthly run rate by
# assuming 10%/mo growth within the year (the 12 months sum to the annual goal):
#   annual = dec * sum(1.1^-j for j in 0..11)  =>  dec = annual / S
# ARR targets are already a monthly run rate x 12, so just divide by 12.
GROWTH = 0.10
S = sum((1 + GROWTH) ** -j for j in range(12))


def dec_from_annual(annual):
    return annual / S


PROJECTED = [
    (datetime.date(2025, 12, 1), dec_from_annual(13), "Dec 2025",
     "reversed from \\$13B 2025 target (10%/mo)"),
    (datetime.date(2026, 12, 1), dec_from_annual(30), "Dec 2026",
     "reversed from \\$30B 2026 target (10%/mo)"),
    (datetime.date(2028, 12, 1), 100 / 12, "Dec 2028", "\\$100B ARR target"),
    (datetime.date(2030, 12, 1), 200 / 12, "Dec 2030", "\\$200B ARR target"),
]

# Projected model from openai.md: (year, Dec monthly run rate $B, MoM growth).
# Annual revenue for a year = sum of that year's 12 monthly revenues, reversed
# from the December run rate using the per-year growth rate (not ARR, which is
# just Dec x 12).
PROJECTION_MODEL = [
    (2025, 1.6, 0.100),
    (2026, 3.8, 0.047),
    (2027, 5.8, 0.032),
    (2028, 8.3, 0.030),
    (2029, 11.8, 0.029),
    (2030, 16.7, 0.029),
]


def annual_from_dec(dec, g):
    return dec * sum((1 + g) ** -k for k in range(12))


OPENAI_ANNUAL_ACTUAL = [(2024, 3.7), (2025, 12.0)]
OPENAI_ANNUAL_TARGET = [(y, annual_from_dec(dec, g))
                        for y, dec, g in PROJECTION_MODEL]

# Segment-level annual revenue ($B), more apt comparables for a single fast-
# scaling product line than whole-company totals. Google segments are from
# Alphabet 10-K/8-K disclosures (calendar year). Azure is a Microsoft fiscal
# year (ending June) and is ESTIMATED: Microsoft only disclosed a dollar figure
# for the first time in FY2025 ("Azure surpassed $75B, up 34%"); earlier years
# are back-calculated from disclosed Azure growth rates.
COMPARABLES_ANNUAL = {
    "Google Search": [(2017, 69.81), (2018, 85.30), (2019, 98.12), (2020, 104.06),
                      (2021, 148.95), (2022, 162.45), (2023, 175.04),
                      (2024, 198.08), (2025, 224.53)],
    "Google Cloud": [(2017, 4.06), (2018, 5.84), (2019, 8.92), (2020, 13.06),
                     (2021, 19.21), (2022, 26.28), (2023, 33.09), (2024, 43.23),
                     (2025, 58.71)],
    "YouTube ads": [(2017, 8.15), (2018, 11.16), (2019, 15.15), (2020, 19.77),
                    (2021, 28.85), (2022, 29.24), (2023, 31.51), (2024, 36.15),
                    (2025, 40.37)],
    "Azure (est.)": [(2018, 5.8), (2019, 9.9), (2020, 15.4), (2021, 23.1),
                     (2022, 33.5), (2023, 43.2), (2024, 56.2), (2025, 75.3)],
    "AWS": [(2013, 3.1), (2014, 4.6), (2015, 7.9), (2016, 12.2), (2017, 17.5),
            (2018, 25.7), (2019, 35.0), (2020, 45.4), (2021, 62.2), (2022, 80.1),
            (2023, 90.8), (2024, 107.6), (2025, 124.0)],
}

dates = [d for d, _, _, _ in DATA]
values = [v for _, v, _, _ in DATA]
pdates = [d for d, _, _, _ in PROJECTED]
pvalues = [v for _, v, _, _ in PROJECTED]


def draw_curves(ax):
    ax.plot(dates, values, marker="o", color="#1f6feb", linewidth=2,
            markersize=7, label="observed")
    ax.plot(pdates, pvalues, marker="s", color="#d29922", linewidth=2,
            markersize=7, linestyle="--", label="OpenAI committed targets")
    ax.set_xlabel("Date")
    ax.set_ylabel("Monthly revenue (\\$B)")
    ax.grid(True, alpha=0.3)
    ax.legend(loc="upper left")


def annotate(ax, points, fmt):
    texts = []
    for d, v, label, note in points:
        if not label:
            continue
        texts.append(ax.text(mdates.date2num(d), v,
                             fmt.format(label=label, v=v, note=note),
                             ha="center", fontsize=7))
    adjust_text(texts, ax=ax,
                arrowprops=dict(arrowstyle="-", color="gray", lw=0.5),
                expand=(1.3, 1.6))


fig, (ax1, ax2, ax3) = plt.subplots(1, 3, figsize=(22, 6))

# Left: zoom on observed data through March 2026.
draw_curves(ax1)
ax1.set_title("Observed monthly revenue (through Mar 2026)")
ax1.set_xlim(datetime.date(2024, 9, 1), datetime.date(2026, 6, 1))
ax1.set_ylim(0, max(values) * 1.4)
ax1.xaxis.set_major_locator(mdates.MonthLocator(interval=3))
ax1.xaxis.set_major_formatter(mdates.DateFormatter("%b %Y"))
annotate(ax1, DATA, "{label}\n\\${v:.2f}B\n{note}")

# Right: full timeline including OpenAI's committed targets.
draw_curves(ax2)
ax2.set_title("Observed vs OpenAI's committed targets")
ax2.set_ylim(0, max(pvalues) * 1.2)
ax2.xaxis.set_major_locator(mdates.YearLocator())
ax2.xaxis.set_major_formatter(mdates.DateFormatter("%Y"))

comp_colors = {
    "Google Search": "#8250df",
    "Google Cloud": "#2da44e",
    "YouTube ads": "#cf222e",
    "Azure (est.)": "#1f6feb",
    "AWS": "#bf8700",
}
annotate(ax2, PROJECTED, "{label}\n\\${v:.1f}B/mo\n{note}")

# Right-most: total annual revenue (not ARR) vs calendar year.
ay = [y for y, _ in OPENAI_ANNUAL_ACTUAL]
av = [v for _, v in OPENAI_ANNUAL_ACTUAL]
ax3.plot(ay, av, marker="o", color="#000000", linewidth=2.5,
         markersize=8, label="OpenAI (actual/est.)")

ty = [y for y, _ in OPENAI_ANNUAL_TARGET]
tv = [v for _, v in OPENAI_ANNUAL_TARGET]
ax3.plot(ty, tv, marker="s", color="#000000", linewidth=2.5,
         markersize=8, linestyle="--", label="OpenAI (annual targets)")

for name, series in COMPARABLES_ANNUAL.items():
    cy = [y for y, _ in series]
    cv = [v for _, v in series]
    ax3.plot(cy, cv, marker=".", markersize=6, linewidth=1.5, alpha=0.85,
             color=comp_colors[name], label=name)

ax3.set_title("Annual revenue: OpenAI vs comparable product segments")
ax3.set_xlabel("Calendar year")
ax3.set_ylabel("Annual revenue (\\$B)")
ax3.grid(True, alpha=0.3)
ax3.legend(loc="upper left", fontsize=8)

fig.autofmt_xdate()
fig.tight_layout()
fig.savefig("revenue_observed.png", dpi=150)
print("Wrote revenue_observed.png")
