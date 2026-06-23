# Lessons - battery.mom

Use this file for durable lessons that should shape future agent work in this repository. Keep detailed historical notes in `LEARNINGS.md`; keep this file shorter, action-oriented, and current.

## Operating Lessons

- Start each meaningful task by checking `agent.md`, this file, `copilot-instructions.md`, and the relevant product or data docs.
- Borrow only general workflow discipline from other projects. Do not import CentsCheck-specific design, release, privacy, or app-store rules into Battery.mom.
- For multi-step or architectural work, write a short plan before editing. Use `pipeline/PLAN.md` when the work belongs on the roadmap.
- After corrections, repeated mistakes, surprising bugs, or durable decisions, add a new lesson here so the next session does not relearn it.
- Verification is part of the work. Prefer `npm test` for logic changes, `npm run lint` for code quality, and `npm run build` for route, metadata, and Next.js integration risk.

## Product Lessons

- Battery.mom is a trust product. Do not make vague or promotional claims when a specific number, assumption, or source note would serve users better.
- The audience spans homeowners, installers, businesses, and policymakers across Singapore, Malaysia, Indonesia, Thailand, Vietnam, and the Philippines. Keep copy plain enough for non-specialists but precise enough for professionals.
- Data-first UI beats decoration. Charts, tables, comparison cards, and clear assumptions are more valuable than ornamental hero sections.
- Placeholder or future-facing pages should still look intentional, with useful context, realistic timing, and links to live tools.

## Architecture Lessons

- Vehicles are backed by Prisma/PostgreSQL and `data/vehicles-data.json`; BESS home products currently come from `data/BESS-Home-data.json`.
- BESS pages have historically been large, monolithic files. When touching them deeply, prefer extracting domain logic into `lib/utils/` and reusable UI into focused components.
- Use the server/client split pattern for interactive routes that need metadata: `page.tsx` as the server wrapper and `page-client.tsx` for client interaction.
- Country, currency, tariff, and formatting constants have been duplicated in several places. Check `lib/constants.ts` and shared utilities before adding another copy.
- Country-specific assumptions are not always interchangeable. Residential energy rates, EV charging rates, commercial tariffs, and grid-scale BESS assumptions can intentionally differ.
- JSX whitespace gotcha: a literal space between a closing inline tag like `</strong>` and the following text can be dropped at render — seen reliably when the tag's content ends in a symbol such as `%` or `×` (e.g. `42.5%</strong> of` rendered `42.5%of`). Use an explicit `{' '}` to guarantee the space. Verify rendered text, not just source.
- Charts must live in a client component (`'use client'`). Reuse the SSR-safe `components/ResponsiveContainer.tsx` wrapper (defers recharts until after mount) rather than recharts' own `ResponsiveContainer`, to avoid server/client SVG hydration mismatches.

## Design Lessons

- Keep the existing visual system steady: emerald primary, Inter, `max-w-7xl`, white cards, gray borders, `rounded-xl`, and subtle shadows.
- Mobile at 375px is a first-class layout target. Tables, cards, charts, and controls need real responsive treatment.
- Dense energy data needs whitespace and progressive disclosure. Show the key number first, then let users inspect the details.
- Every public route should have useful metadata, accessible structure, and clear navigation back to live tools.
- A reusable design-system foundation now exists in `components/ui/` (`Container`, `Section`, `Card`, `Stat`, `Eyebrow`, `Badge`, `Button` + a `cn` helper) with tokens in `tailwind.config.ts`: an editorial `ink`/`paper`/`brand`/`gold` palette, `rounded-card`/`rounded-pill`/`rounded-panel`, `shadow-card`/`shadow-raised`, and a serif `font-display` (Newsreader via the `--font-display` var). A reusable `.reveal` scroll-in utility lives in `globals.css`. Prefer these primitives over hand-rolling boxes, inline hex, or ad-hoc `max-w-*` widths.
- The revamp direction (started June 2026) is narrative-first: the flagship story page `app/state-of-battery-power/` is the first vertical slice and the reference implementation for the new system. Propagate the primitives across existing pages (home, `/ev`, `/bess`, `/scoreboard`) rather than reintroducing per-page card/border styling. This supersedes the older "white cards, gray borders, rounded-xl" convention where the two conflict — keep the new editorial system as the forward path.
- Modern, not boxy: avoid "container in container in container with borderlines." One bordered surface per visual level — a `Card`/section owns the border; its inner groupings use a background tint (`bg-paper-200`), hairline dividers (`divide-y divide-ink/5`), or whitespace, NOT their own borders. Reserve borders for genuinely interactive controls (buttons, toggles, breadcrumb pills) where the border is the affordance. Prefer soft `shadow-card` + tint over hard outlines. This keeps dense pages (e.g. the scoreboards) feeling editorial rather than like a grid of bordered cells.

