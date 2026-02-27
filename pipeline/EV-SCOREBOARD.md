# EV Scoreboard Enhancement Pipeline

> Created: 2026-02-27
> Status: Active — **Batch 1 ✅ · Batch 2 ✅ · Batch 3 ✅**
> Goal: Transform the EV comparison page from a functional data table into a wow-inducing scoreboard that makes professionals share it and casual users bookmark it.

---

## Current State Assessment

**What works:**
- Side-by-side comparison table with 22 spec rows and best-value green highlighting
- 4 mini bar charts (Battery Capacity, Typical Top-Up, Range, Cost/km)
- Key Insights section (auto-generated textual comparisons)
- CSV export, sortable columns, info tooltips via portal
- VehicleCard with StatsGrid below the comparison table

**What's missing / weak:**
- **No visual scoring** — no radar chart, no "battery.mom score", no at-a-glance verdict
- **No personality** — every row looks the same; no category grouping with visual separators
- **No badges / awards** — "Best Range", "Best Value", "Most Efficient" not called out visually
- **No EV-as-battery lens** — the *signature perspective* of battery.mom (batteries first, cars second) isn't reflected in the scoreboard UI
- **Charts are basic** — 4 simple bar charts with no interactivity, no radar, no scatter
- **No quick-pick** — users must search; no "featured" or "popular" EVs to click instantly
- **Insights are plain text** — no visual emphasis, no iconography, no shareable cards
- **Mobile experience** — table scrolls but has no mobile-first view, no stacked cards
- **No share / embed** — can't share a specific comparison via URL or screenshot

---

## Batch 1 — Visual Punch & Instant Wow (6 features)

- [x] **1.1 battery.mom Score** — Composite weighted score (0–100) per vehicle: range (25%), efficiency (25%), value (price÷range, 20%), charging speed (15%), battery tech (15%). Animated circular gauge at top of each vehicle column in comparison table. Green/amber/red zones. `EVScoreGauge` component.
- [x] **1.2 Winner Badges** — Auto-detect category winners and render premium pill badges: 🏆 Best Range, ⚡ Most Efficient, 💰 Best Value, 🔋 Biggest Battery, ⚡ Fastest Charge. Show in table header and on VehicleCard. Ties = both get badge. `WinnerBadges` component.
- [x] **1.3 Radar Comparison Chart** — Recharts RadarChart overlaying all selected vehicles on 6 axes: Range, Efficiency, Power, Charging Speed, Battery Size, Value. Normalized 0–100 per axis. Shows vehicle strengths at a glance. Replace or add alongside existing mini charts. `EVRadarChart` component.
- [x] **1.4 Visual Spec Bars** — For numeric rows in the comparison table, add inline horizontal progress bars behind the numbers. Bar width = value ÷ best-in-class. Makes it instantly obvious who leads without reading numbers. Pure CSS, no new component.
- [x] **1.5 Quick-Pick Hero Cards** — Above the search box, show 3 featured EVs ("Most Popular", "Best Value", "Editor's Pick") as clickable hero cards with key specs + score gauge. One click adds to comparison. `QuickPickCards` component.
- [x] **1.6 Shareable Comparison Card** — "Share this comparison" button that generates a branded summary card (canvas → PNG) showing vehicles, scores, and winner badges. Copy to clipboard or download. `ShareComparisonCard` component.

---

## Batch 2 — Deep Interactivity & Battery-First Lens (5 features)

- [x] **2.1 Battery health projection** — Chart showing estimated usable capacity at Year 1, 3, 5, 8, 10 based on battery chemistry degradation curves (NMC vs LFP vs SolidState). Unique to battery.mom. `BatteryHealthChart`.
- [x] **2.2 "Battery as home backup" calculator** — "How many hours can this EV power your home?" Input household watt draw → hours of backup per vehicle. Makes the battery-first angle tangible. `EVAsBackupCalc`.
- [x] **2.3 5-year Total Cost of Ownership** — Interactive calculator: purchase price + electricity cost + maintenance + insurance + resale → 5-year TCO per vehicle. Adjustable annual km. `EVTotalCostChart`.
- [x] **2.4 Efficiency heatmap by speed** — Estimated efficiency at 60/80/100/120 km/h per vehicle (based on published consumption curves). Heatmap showing which EV is best for city vs highway. `SpeedEfficiencyHeatmap`.
- [x] **2.5 Smart Insights v2** — Upgrade insights from plain text to visual cards with icons, metric callouts, and comparative mini-charts. Auto-generate "If you drive X km/day, pick Y" recommendations. `SmartInsightsCards`.

---

## Batch 3 — Mobile-First & Polish (4 features)

- [x] **3.1 Mobile card view** — Below md breakpoint, transform comparison table into swipeable stacked cards with score gauge + key metrics. No horizontal scroll. `MobileComparisonCards`.
- [x] **3.2 URL state for comparisons** — Encode selected vehicle IDs in URL params so users can share a specific comparison link. `useComparisonURL` hook.
- [x] **3.3 Print-optimized layout** — `@media print` styles + "Print comparison" button. Clean A4 layout with scores, table, and radar chart. No buttons/navigation.
- [x] **3.4 Animated transitions** — Subtle entrance animations for score gauges (count-up), progress bars (slide-in), and badge reveals (pop). CSS + framer-motion-lite.

---

## Scoring Methodology

### battery.mom Score (0–100)

| Dimension | Weight | Best = 100 | Metric |
|-----------|--------|------------|--------|
| Range | 25% | Highest WLTP range in class | `rangeKm / maxRangeInClass × 100` |
| Efficiency | 25% | Lowest kWh/100km in class | `minEfficiency / efficiency × 100` |
| Value | 20% | Lowest price-per-km-range | `minPricePerKm / pricePerKm × 100` |
| Charging | 15% | Fastest DC 0–80% | `minChargeTime / chargeTime × 100` |
| Battery | 15% | Composite: capacity + warranty + tech | See below |

**Battery sub-score:**
- 50% capacity (largest = 100)
- 30% warranty years (parsed from string, 8yr = 100)
- 20% chemistry bonus (LFP = 90, NMC = 75, SolidState = 100, Other = 60)

Score is computed relative to the *selected comparison set*, not global. This means scores change when you add/remove vehicles — making it feel dynamic and personal.

---

## Prioritisation

**Batch 1 first** because:
- Score gauge + winner badges + radar chart = instant visual differentiation from every other EV comparison site
- Quick-pick cards reduce friction for first-time visitors
- Spec bars make the existing table 10× more readable with zero new data
- Share card drives organic growth

**Batch 2** deepens the *battery-first* thesis — battery health, backup hours, TCO, and speed heatmap are content no other site has.

**Batch 3** is mobile + polish — important but not wow-factor.

---

## Technical Notes

- Score computation: Pure client-side `useMemo` — recalculates when selection changes. No API needed.
- Radar chart: `recharts` `RadarChart` with `PolarGrid`, `PolarAngleAxis`, `Radar` layers.
- Canvas share card: `html2canvas` (already in deps) targeting a hidden render div.
- Visual spec bars: Inline `style={{ width: \`\${pct}%\` }}` with Tailwind `bg-emerald-100` behind table cell text.
- Quick-pick: Static array of 3 vehicle IDs per country — can be updated monthly.
- Badge detection: Compare each vehicle's metric against `Math.max/min` of selected set.
