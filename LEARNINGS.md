# Learnings — battery.mom

> Running log of discoveries, gotchas, design decisions, and patterns. Updated as we build.

---

## 2026-02-26 — Initial Audit

### Architecture
- **Vehicles are in PostgreSQL** (via Prisma), synced daily from `data/vehicles-data.json` by a Vercel cron job at 2 AM UTC. BESS products are loaded directly from `data/BESS-Home-data.json` at build/runtime — no DB model for BESS yet.
- **VehicleProvider is a no-op.** The `VehicleProvider` component in `store/VehicleStore.tsx` wraps children in a `<>` fragment and does nothing. Zustand stores work without providers. It's used in `/ev`, `/bess/commercial`, `/bess/grid` pages. Not harmful but misleading — consider removing or making meaningful.
- **Country type is duplicated.** `types/vehicle.ts` and `types/bess.ts` each define their own `Country` type. Prisma also generates one. These should converge.

### Design System
- **Primary emerald:** `#10b981` (`ev-primary` in Tailwind config). Used across all CTAs, active nav states, chart fills.
- **Card pattern:** `bg-white border border-gray-200 rounded-xl` with subtle shadow. Some pages use `rounded-lg` — should standardise on `rounded-xl`.
- **Container:** `max-w-7xl` (1280px) in most pages, but Header uses `max-w-[1200px]`. Slight inconsistency.
- **Page top padding:** All pages use `pt-12 md:pt-14` to clear the fixed header (h-12 / h-14).

### SEO
- `robots.txt` has placeholder domain `your-domain.com` — critical fix needed.
- Sitemap only covers `/` and `/about` + vehicle detail pages. Missing all major sections.
- `/ev` page has no `export const metadata` — surprising given it's the most complete page.
- StructuredData component generates JSON-LD client-side. For SEO, server-side generation would be better, but it works.

### Navigation
- Header has links to `/scoreboard` and `/calculators` — neither page exists. Users get the custom 404.
- `/bess` nav item has `href="/bess"` but no index page exists there.
- BESS dropdown on hover is clever but the base `/bess` link is unreachable (clicking it navigates to a 404).

### Data
- `vehicles-data.json` has 11,633 lines — substantial dataset covering all 6 SEA countries.
- `BESS-Home-data.json` has 180 lines (approximately 7-8 BESS products).
- BESS prices are stored per-country in a single object — good design for multi-country support.
- Vehicle data includes EV-specific fields like `hasBidirectional`, `otaUpdates`, battery chemistry — thorough schema.

### Components
- `ComparisonTable.tsx` is 2,130 lines — the largest component. Works well but could be split.
- `bess/home/page.tsx` is 2,000 lines — entire page is one file. Calculator logic + UI together.
- `bess/shared-residential/page.tsx` is 1,121 lines — same pattern.
- Pattern: BESS pages are monolithic. Future refactor should extract calculator logic into `/lib/utils/` and chart components into `/components/bess/`.

### Constants Duplication
- `CURRENCY_BY_COUNTRY` / `CURRENCY_SYMBOLS` defined in: `lib/utils.ts`, `components/ComparisonTable.tsx`, `components/StatsGrid.tsx`, `app/bess/home/page.tsx`, `app/bess/shared-residential/page.tsx`. At least 5 copies.
- `COUNTRY_NAMES` defined in at least 3 files.
- `getElectricityRate` constants are in `lib/utils.ts` (DC fast charger rates) and `lib/utils/zero-bill-calculator.ts` (residential rates) — different values for different contexts, which is correct and intentional.

---

*Add new entries below as work progresses.*

## 2026-02-26 — Batch 0 Build

### Homepage
- Built as a **server component** (async) so it can query Prisma for live vehicle count. Falls back gracefully to hardcoded 150 when `DATABASE_URL` is unavailable (e.g., during build).
- BESS product count is derived from the JSON file length at build time — no async needed.
- Design: left-aligned hero (not centered) — matches modern data-tool aesthetics (Linear, Vercel). Centered felt generic.
- 6-card pillar grid with amber "Coming Q2/Q3 2026" badges on unreleased sections — every card is a `<Link>`, so even coming-soon pages are clickable and show clear content.

### Placeholder Pages Pattern
- Established a consistent pattern for all "coming soon" pages: real heading + description → amber clock card with launch date → preview of planned metrics/features → CTA links to live pages. Never just "Coming Soon" text.
- All placeholder pages include `export const metadata` with title, description, and canonical paths.
- Removed unnecessary `VehicleProvider` wrapping from `/bess/commercial` and `/bess/grid` — they're now static server components (faster, simpler).

### SEO Fixes
- `robots.txt` now points to correct domain.
- Sitemap expanded from 2 entries to 10 static pages + all vehicle detail pages.
- Every page now has metadata. The `/ev` page was the biggest gap — most-used page with zero SEO metadata.

### Design Consistency
- All new pages use `pt-12 md:pt-14` to clear the fixed header.
- All new pages use `max-w-7xl` container.
- Cards consistently use `bg-white border border-gray-200 rounded-xl` pattern.
- Badges use `text-[11px] font-semibold rounded-full` pattern from existing BESS pages.

---

## 2026-02-26 — Batch 1 Build

### Calculators
- **EV vs ICE TCO** (`/calculators/ev-vs-ice`): Full interactive client component. Per-country presets for popular EV/ICE pairs, 5/7/10-year projections, cumulative cost chart + cost breakdown bar chart, CO₂ comparison. Country data includes petrol prices, electricity tariffs, EV incentives, maintenance, insurance, depreciation curves.
- **Solar Payback** (`/calculators/solar-payback`): Roof area + quality + monthly bill → system size, payback year, 25-year savings, self-sufficiency %. Includes 25-year projections with 0.5% panel degradation, 3% tariff inflation, and inverter replacement at year 12. Links back to Zero-Bill Calculator for battery-paired analysis.
- **EV Charging Cost** (`/calculators/ev-charging-cost`): Three-way charge mix (home/AC public/DC fast) with per-country rates. EV presets per country (popular models with real efficiency data). Pie chart for cost breakdown, bar comparison vs petrol. Rate table shows all 3 charging types with efficiency losses. Tips section cross-links solar and BESS calculators.
- All three calculators follow the same UI pattern: country selector → sliders/inputs → stat cards → charts → assumptions/tips. Consistent emerald accent, gray-50 backgrounds, responsive grid.
- Calculator hub page updated: all 5 calculators now show as "live" in a single 3-column grid (removed live/coming split).

### Scoreboard
- Split into server component (page.tsx with metadata) + client component (page-client.tsx for interactivity).
- Real data for 6 countries: EV adoption rates, total EVs, charging density (per million), solar GW, BESS penetration %, EV sales growth YoY, policy grades, top-selling EV, tariffs, incentives.
- Interactive: metric selector tabs re-rank countries + update bar chart. Click a country to see radar chart (normalised vs peers) + detail stats grid + tariff/incentive info.
- "At a glance" summary table for quick comparison across all 6 metrics.
- Data source citations section with IEA, IRENA, BloombergNEF, national registries.
- Deferred to Batch 3: trend sparklines (need historical data collection), interactive SVG map.

### Insights / Articles
- Used TSX content components in `/content/` directory — no MDX dependency needed. Each article is a React component exporting article body JSX. Article metadata lives in `/content/articles.ts` as a typed array.
- Dynamic route `/insights/[slug]/page.tsx` with `generateStaticParams` and `generateMetadata`. Content components imported statically and mapped by slug.
- Listing page shows published articles as clickable cards (category badge, reading time, date) + "Coming next" section with planned article titles.
- 3 seed articles written:
  1. **LFP vs NMC** (~8 min): comparison table, tropical heat impact, EVs in SEA, home battery advice
  2. **13.5 kWh zero-bill Malaysia** (~10 min): daily energy flow modelling, bill reduction calculations, payback analysis, NEM discussion
  3. **EV adoption SEA 2024 review** (~12 min): country-by-country data, trends (Chinese brands, charging, solar-EV connection), 2025 outlook
- Each article includes cross-links to relevant calculators and tools.
- Sitemap expanded to include calculator subpages and all article slugs.

### Pattern: Server/Client Split
- For pages with both metadata (needs server) and interactivity (needs client): create `page.tsx` as minimal server wrapper with metadata, and `page-client.tsx` as the full client component. Used for scoreboard. Calculators are pure client components (no metadata needed for dynamic content).

### Constants Duplication (Continued)
- Each calculator defines its own country data constants (tariffs, petrol prices, etc.) locally. This is intentional for now — the calculators need different data shapes and the overhead of a shared constants file isn't worth it yet. When a 4th calculator needs the same data, refactor to `/lib/constants/country-data.ts`.

---

## 2026-02-26 — Batch 3 Build (EV Detail Pages)

### Individual Vehicle Detail Pages
- **Dynamic route structure**: `/ev/[id]/page.tsx` (server component for metadata/SSG) + `page-client.tsx` (client component for interactive charts)
- **generateStaticParams**: Pre-generates all vehicle detail pages at build time using Prisma to fetch available vehicle IDs
- **generateMetadata**: Dynamic OG metadata with vehicle name, specs, and local pricing for SEO
- **Comprehensive specs display**: Performance, battery, charging, pricing, and technology features in organized sections
- **Interactive charts**: Range by driving style (bar chart), energy consumption breakdown (pie chart), battery degradation over 10 years (dual-axis line chart)
- **Data visualizations**: All using Recharts with consistent emerald theming and responsive containers
- **Vehicle links**: Updated ComparisonTable to make vehicle names clickable links to their detail pages (emerald color with hover underline)
- **Type safety**: Proper Vehicle type casting from Prisma JsonValue fields (optionPrices, rebates) using `as unknown as Vehicle`
- **SEO optimization**: Structured metadata, canonical URLs, and descriptive alt text for accessibility

### Technical Implementation Notes
- **Static generation**: All vehicle pages pre-built at compile time for fast loading and SEO
- **Error handling**: 404 pages for invalid vehicle IDs using Next.js `notFound()`
- **Data fetching**: Server-side Prisma queries with proper error handling
- **Chart calculations**: Client-side computed data for range estimates, energy breakdown, and degradation curves
- **Responsive design**: Mobile-first layout with grid breakpoints matching existing design system
- **Navigation**: Breadcrumb navigation and cross-links to comparison table and calculators

---

## 2026-02-26 — Batch 2 Build

### Commercial BESS Calculator
- **Peak shaving calculator**: Inputs (peak demand kW, target reduction %, peak duration hrs) → outputs (battery size kWh/kW, capex, payback, ROI). Includes 15-year cashflow projection with degradation and O&M. Load profile chart shows before/after demand curves. Revenue stacking explainer covers peak shaving + arbitrage + backup + grid services.
- **Use-case presets**: Office/Retail/Factory/Data Centre with realistic load profiles and peak hours. Clicking a preset auto-fills inputs with typical values.
- **Product comparison table**: 7 commercial BESS products (BYD, Tesla, Sungrow, CATL, Huawei, Samsung) with capacity, power, cycles, warranty, footprint. Chemistry badges (LFP/NMC) with color coding.
- **Case studies**: 3 real case studies (shopping mall Bangkok, manufacturing Johor, office Singapore) with system specs, results, and annual savings.
- **Country data**: Commercial tariffs, demand charges, BESS costs, peak hours for all 6 SEA countries. Revenue assumptions include 15% arbitrage spread and 88% round-trip efficiency.

### Grid BESS Calculator
- **LCOE/LCOS calculator**: Inputs (system size MWh, cycles/year, project life, capex/MWh, O&M/MWh/year, revenue/MWh/cycle) → outputs (LCOE, LCOS, NPV, payback). 20-year cashflow projection with 8% discount rate and 2.5% annual degradation. Revenue/O&M/cumulative NPV line chart.
- **Technology comparison**: 4 battery chemistries (LFP, NMC, Flow, Sodium-ion) with cost/kWh, cycle life, energy density, advantages/disadvantages, use cases. Bar charts for cost vs cycles. Table format for detailed specs.
- **Global projects table**: 10 major grid BESS projects (Tesla Hornsdale, BYD Tuas South, Fluence Gateway) with capacity, chemistry, developer, status, year. Focus on LFP chemistry with operational status badges.
- **Policy tracker**: 6 SEA countries with current incentives (Singapore Energy Storage Programme, Malaysia Large Scale Solar + Storage, Thailand Smart Grid). Status badges (Active/Developing/Planning) with descriptions and incentive amounts.
- **Cost assumptions**: Grid-scale capex $600-1200/kWh, annual O&M 2% of capex, 85% round-trip efficiency, 20-year project life.

### Pattern: BESS Page Architecture
- Both commercial and grid pages follow the same structure: server wrapper (page.tsx) with metadata + client component (page-client.tsx) with full interactivity. Calculator inputs → results cards → charts → data tables → assumptions/CTA.
- Charts use Recharts consistently: LineChart for cashflow/projections, BarChart for comparisons, ResponsiveContainer for responsiveness.
- Data tables use consistent styling: gray-50 header, white rows, hover states, tabular-nums for numbers, chemistry/status badges.
- Navigation CTAs link between BESS pages and cross-link to home/shared-residential calculators.

### Country Data Management
- Each BESS calculator defines country-specific constants locally (tariffs, costs, peak hours). Commercial uses demand charges + commercial tariffs, grid uses utility-scale costs. No shared constants file yet — when BESS pages grow to 4+ calculators, extract to `/lib/constants/bess-data.ts`.
- Currency formatting helpers (`fmt`, `fmtShort`) duplicated across calculators. Could extract to `/lib/utils/currency.ts` if used in 3+ places.
