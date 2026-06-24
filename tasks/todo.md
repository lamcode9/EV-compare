# Site cohesion pass — nav, naming, chart clarity, EV-page UI

User report (2026-06-24), 4 fronts:
1. Chart titling unclear — "is this total generation or *additions added*?" Make every chart title explicitly state the measure type (total/stock vs annual addition/flow vs cumulative vs change). Applies site-wide.
2. EV adoption page (`/scoreboard/ev`, legacy `app/scoreboard/page-client.tsx`, 1551 lines) still on the OLD generic palette (indigo/amber/red/purple/pink hex + rainbow charts) — never migrated to the ink/paper/brand editorial system.
3. Duplicate adoption link — `/scoreboard/ev` appears under BOTH "Big Picture → EV Adoption" and "EVs → Adoption by Country".
4. Stale "Scoreboard" concept — orphaned `/scoreboard` hub (titled "Scoreboards"), and all 3 boards carry a duplicated pill-nav ("Scoreboard home / EV adoption / BESS adoption / Global battery deployment") whose labels don't match the header's Big Picture set.

## Decisions
- **Track vs Decide thesis** (established): Big Picture = TRACK surfaces (Story + 3 boards). EVs/Battery&Solar = DECIDE tools. EV adoption is a TRACK surface → its canonical home is Big Picture. **Fix #3: remove "Adoption by Country" from the EVs dropdown** (keep "EV Adoption" under Big Picture). EVs dropdown becomes Compare · EV vs Petrol · Charging Cost.
- **Fix #4:** one shared `BigPictureNav` component, labels matching the header (Big Picture · Global Deployment · EV Adoption · Storage Adoption). Replace the 3 duplicated inline pill-navs. Redirect `/scoreboard` → `/state-of-battery-power` (kill orphaned hub). Repoint homepage primary CTA off `/scoreboard`. Keep "Battery Deployment Scoreboard" h1 on the energy board (legit name).
- **Fix #1:** surgical — make total-vs-additions explicit. Most charts already clear. Genuinely ambiguous: the generation area charts (story page + energy board "World energy shift" total mode). Title them "Total ... generation". Verify the rest read clearly.
- **Fix #2:** migrate `app/scoreboard/page-client.tsx` to ink/paper/brand. Chart colors → brand greens + reuse the energy board's on-brand source palette for multi-series (no rainbow). De-nest 3 bordered violations. font-display headings.

## Increments (each: build+lint+tsc green → commit → push → CI green)
- [x] **I1 — Flow/naming:** header de-dup, shared BigPictureNav, `/scoreboard` redirect, homepage CTA repoint. — `fe6bef3`, CI green.
- [x] **I2 — Chart clarity:** generation charts titled "Total ...", energy-board mode subtitle reflects total vs change, per-chart measure labels. — `467c2e6`.
- [x] **I3 — EV adoption UI migration:** palette + charts + de-nest on `app/scoreboard/page-client.tsx` + InfoTooltip hover fix. — `8d082f4`. Verified in-browser.

All four user-reported fronts addressed. Done.

## Constraints
- Inner repo only (`/Users/km/Developer/Battery.mom/Battery.mom`). Data-integrity: no invented numbers (this pass is UI/IA/copy, not data). One bordered surface per level. Push to prod after each increment; CI must stay green.
