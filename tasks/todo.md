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

## Next (await user decision)
- [ ] Promote to `/` (homepage centerpiece) + add a nav entry in `components/Header.tsx`.
- [ ] Propagate primitives across existing pages (home, /ev, /bess, /scoreboard) — replace
      ad-hoc `max-w-*`, inline hex, per-page card styles. This is the bulk of the "fix the
      messy containers/borders" work.
- [ ] Phase 2 — data refresh: battery $/kWh cost curve, global EV-over-time, China share,
      un-bury SEA battery deployment from "Rest of World".
- [ ] Later phases — thought leadership / "where it's going" third act (space solar, etc.).
