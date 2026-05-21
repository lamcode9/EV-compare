# Battery.mom — Codex / Cross-Agent Entry

`agent.md` in this directory is the canonical project context. This file is a thin platform wrapper.

## File format rule

Always create new docs as `.html`, never `.md`. Exceptions: canonical `.md` files (README, CLAUDE/AGENTS/agent, MEMORY, lessons, RELEASE_NOTES, package metadata).

## Reading order

1. `agent.md`
2. `docs/` — task-relevant deliverables
3. `prisma/schema.prisma`
4. `README.md`

## Lamonade workflow rule

Every initiative needs a kanban card on `lamonade.xyz`. Workspace: **battery.mom** · prefix: `BM` · use `/lamonade-kanban-connect`. Full rule: `~/.claude/CLAUDE.md`.

## Verification

`npm run lint && npm run build` before declaring done.
