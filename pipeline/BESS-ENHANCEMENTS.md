# BESS Enhancement Pipeline

> Created: 2026-02-27
> Status: Active — **Batch 1 ✅ · Batch 2 ✅ · Batch 3 ✅ · Batch 4 ✅**
> Goal: Make every BESS page a "wow, all the work is done for me" experience for factory owners, property developers, green consultants, and government agencies.

---

## Batch 1 — Quick Wins & Core Infrastructure ✅

- [x] **1.1 PDF export** — `PDFExportButton` component using `html2canvas` + `jsPDF`. Retina A4 with branded header/footer. All BESS pages.
- [x] **1.2 URL state sharing** — `useURLState` hook with debounced `replaceState` + `copyShareLink` clipboard helper. All BESS pages.
- [x] **1.3 Diesel genset replacement** — Genset kVA / diesel price / outage inputs → 15-year TCO comparison with break-even chart. Commercial page.
- [x] **1.4 TOU arbitrage simulator** — Real C&I TOU rate bands per SEA country, 24h tariff chart, charge/discharge timeline, daily/monthly/annual savings. Commercial page.

---

## Batch 2 — Developer & Sustainability Tools ✅

- [x] **2.1 Building comparison** — Save up to 3 configs, side-by-side table with best-value ★ highlighting. `BuildingComparison` component. Shared Residential.
- [x] **2.2 Marketing PDF** — Branded "Green Living, Built In." one-page sales sheet via `jsPDF`. `MarketingPDFButton` component. Shared Residential.
- [x] **2.3 Green cert estimator** — GBI (MY), BCA Green Mark (SG), LEED v4.1 points with per-category breakdowns and tier badges. `GreenCertEstimator`. Shared Residential.
- [x] **2.4 ESG reporting dashboard** — CO₂, renewable %, grid factor, equivalences, 20-yr projections, copy-ready CDP/GRI/TCFD snippet. `ESGDashboard`. Shared Residential + Commercial.

---

## Batch 3 — Government & Grid Intelligence ✅

- [x] **3.1 Policy impact simulator** — Toggle FiT rate, capex subsidy %, net metering, fast permitting, tax break → 10-year adoption projection with capacity, CO₂, and peak-shaving charts. `PolicyImpactSimulator` component. Grid page.
- [x] **3.2 Subsidy ROI calculator** — Input subsidy $/kWh + total budget → installations triggered, CO₂ avoided, cost per tonne, leverage ratio, grid savings. `SubsidyROICalculator` component. Grid page.
- [x] **3.3 National BESS deployment map** — Interactive SVG map of SEA with installed/planned capacity bubbles, hover detail panel, ranked country list. `BESSDeploymentMap` component. Grid page.
- [x] **3.4 Carbon credit estimator** — Calculate avoided CO₂ → revenue at VCS/Gold Standard/Article 6.4/ACX rates, comparison table, projection chart. `CarbonCreditEstimator` component. Commercial page.

---

## Batch 4 — Advanced Comparisons & Polish ✅

- [x] **4.1 BESS product head-to-head** — Select 2 commercial BESS products → side-by-side spec comparison with visual diff bars, ★ winner highlighting, score card. `BESSHeadToHead` component. Commercial page.
- [x] **4.2 Scenario comparison tool** — Model "solar only" vs "solar+BESS" vs "solar+BESS+EV" → compare CO₂, cost, resilience side-by-side with per-country constants and bar charts. `ScenarioComparisonTool` component. Home page.
- [x] **4.3 Tenant ROI pitch calculator** — For condo buyers: "Your unit costs X more but saves Y/month — pays for itself in Z years." Gradient pitch card with 4 key metrics + copy-to-clipboard. `TenantROIPitch` component. Shared Residential page.
- [x] **4.4 Grid stability analysis** — Show how X MWh of distributed storage affects peak demand, renewable curtailment, frequency stability. 24h grid profile chart, 4 before/after metric cards. `GridStabilityAnalysis` component. Grid page.
- [x] **4.5 Demand charge heatmap** — 24h × 7d heatmap of peak demand events with TOU band overlay, battery shaving zone toggle, demand savings summary. `DemandChargeHeatmap` component. Commercial page.

---

## Prioritisation Rationale

**Batch 1 first** because:
- PDF export and URL sharing are zero-content infrastructure that every other feature benefits from
- Diesel replacement and TOU arbitrage are high-value for the largest BESS buyer segment (factory owners in PH/ID/TH)
- All four items are self-contained and don't depend on each other

**Batch 2** next because property developers are the second-largest buyer segment, and green certifications are a strong differentiator.

**Batch 3** for government — longer lead time, more complex, but positions battery.mom as the go-to policy reference.

**Batch 4** is polish and advanced features that deepen engagement for returning users.

---

## Technical Notes

- PDF: Use `html2canvas` to screenshot calculator sections + `jsPDF` to compile. Add `data-pdf-section` attributes to capture zones.
- URL state: Use `URLSearchParams` + `window.history.replaceState` with 300ms debounce. Read on mount via `useSearchParams()`.
- TOU data: Hardcode per-country rate schedules (MY TNB, SG SP Group, TH MEA/PEA, PH Meralco, ID PLN, VN EVN).
- Diesel calc: Standard formula — fuel consumption = kVA × 0.25 L/kWh × hours. Maintenance = 5% of capex/year.
