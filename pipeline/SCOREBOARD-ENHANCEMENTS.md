# Scoreboard Enhancement Pipeline

> Created: 2026-02-27
> Status: Active — **Batch 1 ✅ · Batch 2 ✅ · Batch 3 ✅**
> Goal: Transform the Adoption Scoreboard from a static data table into a dynamic, shareable, "wow" dashboard that professionals reference and casual viewers bookmark.

---

## Current State Assessment

**What works:**
- 6 SEA countries with real data across 6 metrics (EV adoption, total EVs, chargers/1M, solar GW, BESS penetration, EV sales growth)
- Metric selector tabs, ranking table with mini progress bars, vertical bar chart
- Country detail panel: 6-stat grid + radar chart + tariff/incentives
- At-a-glance comparison table with policy grades
- Data sources section with CTA links

**What's missing / weak:**

- **No composite score** — 6 individual metrics but no "Overall Readiness Score" that instantly ranks who's winning
- **No podium / hero** — top countries look the same as bottom ones; no visual celebration of leaders
- **No trend arrows** — all numbers are flat; no sense of "this went up 15%" or momentum
- **No auto-generated headlines** — data just sits there; no "Thailand leads SEA with 11.2% EV adoption" narrative
- **Table isn't sortable** — at-a-glance table has no column-click sorting
- **Single-country detail only** — can't compare 2 countries side-by-side
- **No share / export** — can't share a country scorecard as image or link
- **No historical context** — current snapshot only; no "vs 6 months ago" comparison
- **No regional benchmarks** — how does SEA compare to the world?
- **Charts are basic** — one bar chart, no area/line trends, no scatter
- **Country detail panel is plain** — gray boxes, no visual hierarchy or sparklines
- **No animations** — metric switching and number rendering feel static
- **Mobile is scroll-heavy** — table requires scroll; no card-based mobile view
- **"Last updated: February 2025"** — stale feeling when data is actually up-to-date

---

## Batch 1 — Visual Impact & Instant Wow (6 features)

- [x] **1.1 Country Readiness Score** — Composite weighted score (0–100) per country: EV adoption (25%), charger density (20%), EV growth (20%), solar capacity (15%), BESS penetration (10%), policy grade (10%). Animated ring gauge per country at top of page. Gold/silver/bronze ring colours for top 3.
- [x] **1.2 Top-3 Podium** — Hero section above the metric selector showing the top 3 countries as a visual podium: gold (#1, tallest), silver (#2), bronze (#3). Each card shows flag, name, composite score gauge, and best metric. Click to expand detail.
- [x] **1.3 Trend Arrows & Delta Badges** — Add ↑/↓/→ trend indicators next to each numeric value in the ranking table and at-a-glance table. Show absolute delta and percentage change (vs simulated prior period). Green for up, red for down, gray for flat.
- [x] **1.4 Auto-Generated Headlines** — Narrative section below the podium: 3–5 auto-generated data-driven sentences ("Thailand leads SEA with 11.2% EV adoption rate", "Malaysia saw the fastest growth at +120% YoY", "Singapore has 13× more chargers per capita than the Philippines"). Fresh on every metric change.
- [x] **1.5 Sortable At-a-Glance Table** — Column headers become clickable sort triggers (ascending/descending toggle). Highlight sorted column. Best-in-class green highlighting per column.
- [x] **1.6 Side-by-Side Country Comparison** — Select 2 countries from a picker to see dual radar charts overlaid, metric-by-metric delta table, and narrative comparison ("Thailand has 3.3× more EVs than Singapore but Singapore has 9.7× the charger density").

---

## Batch 2 — Deep Analytics & Engagement (5 features)

- [x] **2.1 Historical Trend Lines** — Small sparkline or area chart per metric showing 4 data points (2021, 2022, 2023, 2024). Visible in country detail and inline in table cells.
- [x] **2.2 Regional Context Banner** — "How does SEA compare?" panel showing SEA average vs global/EU/China benchmarks for 3 key metrics (adoption rate, charger density, growth).
- [x] **2.3 Share Country Scorecard** — "Share this country" button generates a branded PNG (html2canvas) showing country flag, composite score, key metrics, radar chart, and battery.mom branding. Copy/download.
- [x] **2.4 Metric Deep-Dive Modal** — Click any metric label to open a modal with: definition, calculation methodology, data source, chart showing all 6 countries for that metric, and 2-sentence insight.
- [x] **2.5 Country Economic Snapshot** — For each country detail, show GDP/capita, electricity cost comparison, and EV affordability index (average EV price / average annual income).

---

## Batch 3 — Polish & Mobile (4 features)

- [x] **3.1 Animated Number Count-Ups** — When metrics appear in viewport, animate from 0 to actual value over 800ms. Use Intersection Observer.
- [x] **3.2 Mobile Card View** — Below md breakpoint, replace at-a-glance table with swipeable country cards showing composite score + 4 key metrics.
- [x] **3.3 Data Freshness Indicator** — Replace static "Last updated" text with a dynamic badge: "Updated 2 days ago" with green/amber/red colour based on staleness.
- [x] **3.4 Export & Print** — "Export as CSV" for the at-a-glance table + "Print scorecard" button with @media print styles.

---

## Scoring Methodology — Country Readiness Score (0–100)

| Dimension | Weight | Best = 100 | Metric |
|-----------|--------|------------|--------|
| EV Adoption | 25% | Highest adoption rate in SEA | `rate / maxRate × 100` |
| Charger Density | 20% | Highest chargers/million | `density / maxDensity × 100` |
| EV Sales Growth | 20% | Highest YoY growth | `growth / maxGrowth × 100` |
| Solar Capacity | 15% | Highest solar GW | `solar / maxSolar × 100` |
| BESS Penetration | 10% | Highest BESS % | `bess / maxBess × 100` |
| Policy Grade | 10% | Letter → numeric (A=100, A-=90, B+=80, B=70, C+=60, C=50) | direct |

Scores are relative to the SEA peer set (best = 100, worst = proportional).

---

## Prioritisation

**Batch 1 first** because:
- Composite score + podium = instant "who's winning" answer for both professionals referencing data and casual users skimming
- Trend arrows turn static data into a living story
- Auto-generated headlines give the page a newsroom feel — shareworthy
- Sortable table is table-stakes UX that's currently missing
- Side-by-side comparison makes it interactive and reusable

**Batch 2** adds depth: historical context, global benchmarks, and shareability for presentations and reports.

**Batch 3** is polish: animations, mobile, and export.

---

## Technical Notes

- Composite score: Pure client-side `useMemo` — recalculated from COUNTRIES array. No API needed.
- Podium: Static layout with CSS grid, conditional gold/silver/bronze styling.
- Trend arrows: Add `previousPeriod` data to COUNTRIES array (simulated or real). Delta = current - previous.
- Headlines: Generated from ranked data via template strings in `useMemo`.
- Sort: `useState<SortField>` + `useState<SortDirection>` with stable sort.
- Side-by-side: `useState<[CountryCode, CountryCode] | null>` with dual radar + delta table.
- Share card: html2canvas (already in deps) targeting a hidden render div.
