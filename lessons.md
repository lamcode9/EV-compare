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

## Design Lessons

- Keep the existing visual system steady: emerald primary, Inter, `max-w-7xl`, white cards, gray borders, `rounded-xl`, and subtle shadows.
- Mobile at 375px is a first-class layout target. Tables, cards, charts, and controls need real responsive treatment.
- Dense energy data needs whitespace and progressive disclosure. Show the key number first, then let users inspect the details.
- Every public route should have useful metadata, accessible structure, and clear navigation back to live tools.

