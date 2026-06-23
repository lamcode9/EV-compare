# Revamp — Phase 1 vertical slice: "The State of Battery Power"

Goal: build one flagship narrative page on the data already in the repo, and let the
design system (tokens + primitives) crystallize out of it. Visible artifact first;
foundation extracted from a real page, then propagated site-wide in later phases.

## Design system foundation (extracted from this slice) — DONE
- [x] Tokens in `tailwind.config.ts`: ink/paper/brand/gold palette, rounded (pill/card/panel),
      shadow (card/raised), `font-display` serif. Existing `ev` colors preserved.
- [x] `.reveal` scroll-in utility in `globals.css` (pure CSS, progressive enhancement).
- [x] Core primitives in `components/ui/`: Container, Section, Card, Stat, Eyebrow, Badge,
      Button + `cn` helper + barrel index. Server components.

## Flagship narrative page — DONE
- [x] `app/state-of-battery-power/page.tsx` (server, static-prerendered): 9 scenes, editorial pacing.
- [x] `app/state-of-battery-power/_components/charts.tsx` (client island): 3 Recharts views.
- [x] All numbers computed from `data/energy-deployment-scoreboard.ts` (no hardcoded drift).

## Verify — DONE
- [x] `npx tsc --noEmit` clean
- [x] `npm run lint` clean (0 errors)
- [x] `npm run build` succeeds; `/state-of-battery-power` prerenders as static
- [x] Visual check desktop + mobile (375px); fixed JSX `{' '}` spacing bugs

## Propagation across the site — IN PROGRESS
Design directive (user, reaffirmed): "no container in container in container with borderlines."
Verify every route with the live nested-border detector — target 0 non-interactive nested borders.
- [x] Promote story to `/` (homepage centerpiece) + nav entry in `components/Header.tsx`.
- [x] Header + Footer reskinned onto tokens.
- [x] Scoreboard pillar (hub, /ev, /bess, /energy) — token migration + de-nested (34→0 on energy).
- [x] Homepage reconciled onto the editorial system (serif headlines, ink/paper tokens,
      de-nested method metric pills, calmer brand accent). nested 5→0.
- [x] `/bess` desk landing + `/ev` hero shell migrated to serif + tokens.
- [ ] **Deep EV components** (shared, used by /ev, /ev/[id], /ev/compare): `ComparisonTable`,
      `VehicleSection`, `QuickPickCards`, `StatsGrid`, `BESSHeadToHead` — still gray/emerald.
- [ ] **BESS calculator pages** (the worst offenders, heavy token debt + nesting):
      `app/bess/home` (366 old tokens, 142 borders), `commercial`, `grid`, `shared-residential`,
      `products/[slug]`, `case-studies`, `installers`.
- [ ] Calculators pages (`/calculators/*`), `/insights`, `/about`, `/contact`, misc.

## Phase 2 + later (keep in view)
- [ ] Data refresh: battery $/kWh cost curve, global EV-over-time, China share,
      un-bury SEA battery deployment from "Rest of World".
- [ ] Later phases — thought leadership / "where it's going" third act (space solar, etc.).
