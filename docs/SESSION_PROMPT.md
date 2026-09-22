# Resume: portfolio worlds

## Read first
Read ../CLAUDE.md, RULES.md, WORLD_INTEGRATION.md and DECISIONS.md (the 2026-09-23 section).
Keep the project rules, content provenance and any dirty worktree intact.

## Latest owner intent, 2026-09-23
The owner reviewed every world in the browser. Approved: BeatMind, MedRAG, SecondSelf,
QueryPilot, Order Supervisor, UPI Fraud Engine. Not liked yet: Vivid and Tathya, flagged to
revisit later. The owner asked for the five approved local previews to be integrated into the
real site "line by line, pixel by pixel"; improvements are welcome but optional.

## Current delivery
Local branch `world/integration` (from `main` at `f1d479e`) holds one shared-foundation
commit and one commit per world. Each illustrated world has a dedicated
`src/pages/work/<slug>/[world].astro`, its own `src/worlds/<slug>/` styles, script and data
schema, a record in `src/content/worlds/`, a data artifact in `src/data/worlds/` and a gate
spec in `scripts/world-gates/`. Home and `/work` now open these projects through their
worlds. `npm run phase6:worlds-gate` is the combined gate; `npm run worlds:parity` compares
each production world with its approved study.

## Next safe step
1. Owner reviews the five production routes locally (`npm run build`, `npm run preview`) or
   on a preview deployment the owner authorizes.
2. On approval, tick their BUILD_PLAN items and merge to `main`. Pushing `main` triggers the
   Vercel production deploy: ask first.
3. Then design OncoVerse and Spur Chat, and revisit Vivid and Tathya. Each needs owner
   storyboard approval before implementation.

## Environment
A global npm package `node@22.5.1` (installed 2026-09-22) shadows the system Node 24.16.0 and
Astro 7 refuses to build under it. Until the owner removes it, prefix commands with
`C:\Program Files\nodejs` on PATH. No type checker is installed; strict TypeScript is not
machine-checked by any gate.
