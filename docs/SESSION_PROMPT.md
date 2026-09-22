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
The five approved worlds are merged into `main` (`02b5669`) from `world/integration`: one
shared-foundation commit and one self-contained commit per world. Each illustrated world has a
dedicated `src/pages/work/<slug>/[world].astro`, its own `src/worlds/<slug>/` styles, script and
data schema, a record in `src/content/worlds/`, a data artifact in `src/data/worlds/` and a gate
spec in `scripts/world-gates/`. `npm run phase6:worlds-gate` is the combined gate; `npm run
worlds:parity` compares a production world with its approved study. `main` is not pushed yet.

## Next safe step
1. Push `main` only with the owner's explicit go: Vercel deploys it to production.
2. The owner chooses what follows. Open work, none started:
   - Phase 7 launch: buy and attach `parthtiwari.com` (`src/config/site.ts` is one line),
     per-page social previews (every page shares one portrait image today), the analytics
     decision, re-verify external links, and the live five-person ten-second test.
   - Phase 3 leftovers that overlap launch: mobile arrival review and the ten-second test.
   - Worlds not yet designed: OncoVerse and Spur Chat (their paper case studies are live).
   - The improvement pass the owner asked to defer, including the Vivid and Tathya revisit,
     lighter paintings and the hard-coded "Ten complete case studies" line on `/work`.
3. Every new world still needs owner storyboard approval before implementation.

## Environment
A global npm package `node@22.5.1` (installed 2026-09-22) shadows the system Node 24.16.0 and
Astro 7 refuses to build under it. Until the owner removes it, prefix commands with
`C:\Program Files\nodejs` on PATH. No type checker is installed; strict TypeScript is not
machine-checked by any gate.
