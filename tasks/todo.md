# One Cinematic Work — v4 (full-bleed scene stages · site-wide cohesion)

User verdict on v3: "really not great." Two root causes: (1) framed film cels are
the opposite of cinema — the video must BE the stage, full-bleed behind the words;
(2) /sunrise was built as an island — the real goal is the whole site as one
cinematic argument (story spine, data proof, calculator practicality, one design
language). Reconstructed prompt approved; storyboard gate before any code.

## Phase 0 — storyboard gate
- [x] docs/one-cinematic-work-storyboard.html — film grammar (SceneStage, five
      laws, kill/keep table), 9 scenes × 8 authored cuts w/ grade hexes + text
      safe areas, site architecture ("the morning the story promises"), homepage
      overture (3 beats), unification pass table, asset reshoot plan, phases A/B/C
      with done-means. AWAITING KM REVIEW — no implementation until approved.

## Phase A — the film (/sunrise on SceneStage) — approved, built
- [x] SceneStage primitive: fixed full-viewport stage, anchor-measured scene
      ranges, scroll-playhead crossfade cuts (window −0.6vh→+0.3vh around
      anchors, so the cut plays under the title-card choreography), data-beat
      dimming via [data-stage-dim] (partial strengths supported), directional
      dark/light scrims + SVG grain emulsion, in-frame subtitles (desktop
      only — mobile collided with the column), missing-asset → canvas
      fallback, reduced-motion → full-bleed posters. Direct DOM writes from
      one rAF handler — scrolling never re-renders React.
- [x] FilmCel + caption strips + filmcel-in keyframes removed; 9 scenes wired
      (fire→combustion→false-dawn→first-light→megablock→gigafactory→orbit→
      swarm→morning) with new anchors: storage, orbit, morning, morning-end.
      Swarm hands the sky back early (outBias) so "Then, morning." plays on
      the canvas dawn. Morning scene tone=light; film develops to paper at
      morning-end before GatesBoard.
- [x] Reading column moved left (COL_FRAME max-w-6xl + max-w-xl/2xl measure)
      across narrative primitives; wide figures stay centered in reading light.
- [x] docs/sunrise-asset-prompts.html rewritten v4 full-bleed (4 rules, 3
      audit gates, audit-vs-regenerate per slot, crf 20 pipeline); registered.
- [x] Verify: tsc clean, lint 1 pre-existing warning, build green (/sunrise
      static), Playwright 19 frames × desktop/mobile/reduced-motion — cuts,
      dims, scrims, tone flip, paper develop all confirmed; fixed mobile
      caption collision. Browser-pane compositor unreliable for full-page
      shots → used repo-local Playwright probe (established pattern).
- [ ] KM audits/regenerates clips per v4 gates → install → final full audit

## Phase B — the trailer (homepage overture)
## Phase C — the morning (chart theme, title-card-lite headers, shared stat
   component, grain on narrative surfaces, story↔tool handoffs)

# The Long Sunrise — v3 (compelling copy · film cels · cinematic entrances)

User verdict on v2: good start, not there. (1) copy not compelling, (2) no
assets/loop videos painting the picture (esp. abundance + Dyson swarm),
(3) act entrances not cinematic.

## v3 Increments
- [x] Copy rewrite (script.ts, hand): rhythm + verbs + motif callbacks
      (hearth→furnace→rooftop→swarm), break up data-dump sentences, move
      sources to subs. HARD RULE: every figure byte-identical to v2 — no new
      numbers, no invented claims.
- [x] Cinematic act entrances: ActHeader → scroll-scrubbed title card
      (rule draws in, era slides, masked title rise, hearth line last);
      hero gets a one-time slow dawn-in; Act V header unified via tone prop.
- [x] FilmCel component: lazy loop-video slots (public/sunrise/*.mp4),
      muted/loop/playsinline, play-on-visible, renders NOTHING until
      loadeddata (page perfect with zero assets), reduced-motion → poster,
      editorial hairline + italic caption chrome, dark/light tone.
- [x] Wire cels as establishing shots: fire (I), combustion (II),
      first-light (III), orbit (IV), swarm (mid-coda), morning (V light).
- [x] Grok Imagine prompt laundry list → docs/sunrise-asset-prompts.html
      (per-asset prompt, grade hexes matched to sky keyframes, loop +
      compression specs, drop-in filenames) + registered via lamonade skill.
- [x] Verify: tsc clean, lint (1 pre-existing warning), build green
      (/sunrise static), Playwright frames: hero dawn-in, Act I mid/full
      entrance, Act III over dusk, Act V light title card; 0 visible cel
      figures with no assets (6 expected 404s in console, by design).
- [x] Extras wired: false-dawn (mid-interlude, after Vietnam para),
      megablock (Act III storage beat), gigafactory (leads Act IV; orbit
      moved mid-act to "the loop has already left the ground"). 9 slots.
- [x] Assets installed: 8/9 clips from ~/Developer/Battery.mom/videos
      (winners: swarm.mp4 monumental-gold take, morning.mp4 aerial-metropolis
      take; spares kept in /videos). Compressed crf 23 + posters → 5.7 MB
      total in public/sunrise/. Verified: all 8 cels readyState 4 + visible,
      screenshots fire/swarm/morning composited clean.
- [x] false-dawn clip installed — all 9 slots live.
- [x] Full re-audit (62 frames, desktop+mobile): found + fixed numeral
      mask crush (III→II; shrink-0), SEA run-in duplication, Wright chart
      scrim /45→/70 on daylight. Verified fixes on rebuilt prod server.
      Accepted tradeoffs documented in lessons.md (cel layout-shift,
      dead-black ground bands in stills).

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
