# The Long Sunrise — v2 art-direction pass (de-slop + world layer)

Verdict from v1 audit: content architecture good; presentation reads as "gradient
with text". Fix by building a scene + adopting the site's editorial identity.

## v2 Increments
- [x] World layer (hand-written, SunriseSky): ground plane + per-act silhouettes
      (hills → mill town w/ smoke → pylons+catenaries → rooftops w/ panels →
      sawtooth gigafactory → Earth curvature w/ city lights → morning haze),
      ONE sun rising physically from behind the horizon (occluded lower limb,
      scatter at horizon, right-hand lane), film grain (soft-light seeded tile),
      sticker sun + sky swarm ring deleted (ladder owns the space frame)
- [x] De-slop system (narrative.tsx + page-client): eyebrows/stat cards/glass/
      pills/dingbats gone; hairline-rule editorial figures, italic serif labels,
      GiantLine scroll-scrubbed pull quotes, wire-feed receipts
- [x] Sub-agent restyles: GatesBoard + PredictionsLedger → paper cards + ruled
      ledger; WrightLawChart header box/slider thumb/annotations; ladder +
      flywheel label pass
- [x] Per-act composition + copy trim (terawatt pull, "Then, morning." giant,
      coda line giant, aphorism cuts)
- [x] Round-2 scene fixes from screenshots: sun-handoff keyframe at 0.645
      (ghost disc), earthCurve envelope ends 0.85 (dome over morning), sunlit
      ground lift after 0.46, mobile sun lane 0.85w
- [x] Verify: Playwright frames desktop+375px (2 rounds), tsc, lint (1 pre-
      existing warning), build green, /sunrise static

# v1 build log (done, kept for reference)

New cinematic scrollytelling route `/sunrise`. Global-first anchor, SEA sub-anchor
("closer to home" insets), hearth vignettes (one continent per act). No new deps
(no R3F — raw canvas; recharts/zustand already available but plain hooks suffice).
Chrome-free route (SiteShell), page dawns into the editorial paper UI + real Footer.

## Architecture
- `app/sunrise/page.tsx` (metadata) + `page-client.tsx` (composition, copy from content)
- `content/sunrise/script.ts` — all copy + verified data moments (typed, versioned)
- `app/sunrise/_lib/useScroll.ts` — useScrollFraction / useSectionProgress / useInView / usePrefersReducedMotion
- `app/sunrise/_components/` — SunriseSky (fixed canvas dawn arc: night → coal dark →
  pre-dawn → first light → brightening → space-black w/ sun disc → morning → paper),
  PowersOfTenLadder, WrightLawChart, BatteryHUD, FlywheelDiagram, GatesBoard, PredictionsLedger
- Narrative primitives (Act/Beat/Hearth/SeaInset/BigNumber) — hand-written, taste-critical

## Increments
- [x] Plan + infra hooks
- [x] Sub-agents (parallel, isolated files): A SunriseSky · B PowersOfTenLadder ·
      C WrightLawChart · D BatteryHUD+Flywheel · E GatesBoard+PredictionsLedger
- [x] Script.ts (full copy), narrative primitives, page composition,
      SiteShell chrome-free branch, Header/Footer/sitemap links
- [x] Story remap (measured act anchors → sky keyframes); z-order fix (canvas z-0,
      content z-10 — negative z painted under main's bg); Act V ink-tone fixes
- [ ] WrightLawChart mobile layout fixes (agent round 2, in flight)
- [ ] Final: `npm run lint && npm run build`, full-page re-verify, lessons

## Deferred polish (v1.1 candidates)
- HUD drain during False Dawn (copy softened to "the doubt beat" for now — restore
  "the only scene where the charge stops" only when the HUD actually does it)
- M1 real-time solar sync (duck-curve sunset synced to visitor's local time)
- Swarm-ring visibility pass at story 0.74–0.82; OG poster frames per act

## Constraints
- Data integrity: only verified figures from the brief's §06 inventory. Banned:
  "effectively free", "too cheap to meter", "limitless".
- Mobile-first 375px; ≤200 KB critical JS (no new deps); prefers-reduced-motion static.
- Kardashev/Dyson framed honestly (thought experiment, not forecast); orbital solar
  with NASA OTPS 12–80× cost critique on-page.
