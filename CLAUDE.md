# Battery.mom — Claude Desktop Entry

`agent.md` in this directory is the canonical project context. This file is a thin Claude-side wrapper.

## File format rule

Always create new docs as `.html`, never `.md`. Exceptions: canonical `.md` files (README, CLAUDE/AGENTS/agent, MEMORY, lessons, RELEASE_NOTES, package metadata).

## Reading order

1. `agent.md` — mission, stack, layout, verification rules
2. `docs/` — deliverables relevant to the current task
3. `prisma/schema.prisma` — DB model
4. `README.md`

## Lamonade workflow rule

Every initiative needs a kanban card on `lamonade.xyz`. Workspace: **battery.mom** · prefix: `BM` · use `/lamonade-kanban-connect`. Linked docs + final summary + category tag from the canonical 10-set. Full rule: `~/.claude/CLAUDE.md`.

## Verification

`npm run lint && npm run build` before declaring done. Verify zero-bill calculator on a reference case for any tariff / calculation change.
