# Parth Tiwari portfolio

This repository is rebuilding Parth Tiwari's portfolio as **Paper and Worlds**: a
static, multi-page Astro site whose project case studies use each project's real data.

Phases 1, 2, 4 and 5 are closed; Phase 3 owner and preview checks remain open.
The site has ten paper case studies and eight project worlds. BeatMind, Vivid and Tathya
render on the shared canvas route; MedRAG, SecondSelf, QueryPilot, Order Supervisor and UPI
Fraud Engine are illustrated worlds ported pixel for pixel from their owner-approved studies,
each on its own route. Those five are on local branch `world/integration` and are not merged
or deployed yet. See [the integration record](docs/WORLD_INTEGRATION.md).

The approved studies remain in `design/directions/`. Run `node scripts/world-study-server.mjs`
and open `http://127.0.0.1:4327/` to compare them, or `npm run worlds:parity` to diff every
study against its production route.

**Live interim landing:** [parth-tiwari-1.vercel.app](https://parth-tiwari-1.vercel.app/).
The Astro release replaced v1 from `main` on 2026-08-29 and passed live accessibility,
no-JavaScript, reduced-motion and script-budget checks at 390, 800 and 1440 pixels.

## Stack

- Astro 7.2.9, exactly pinned
- static HTML output
- strict TypeScript configuration
- vanilla CSS for the active Phase 2 landing system
- Playwright as a development-only browser verification tool

`astro` is the only direct production dependency.

## Commands

```bash
npm install
npm run dev
npm run build
npm run phase1:gate
npm run phase2:capture -- --url http://127.0.0.1:4321
npm run phase2:work-capture -- --url http://127.0.0.1:4321
npm run phase2:case-capture -- --url http://127.0.0.1:4321
npm run phase2:case-capture -- --url http://127.0.0.1:4321 --slug vivid --title Vivid
npm run phase2:notes-capture -- --url http://127.0.0.1:4321
npm run phase2:about-capture -- --url http://127.0.0.1:4321
npm run phase2:resume-capture -- --url http://127.0.0.1:4321
npm run phase2:hire-capture -- --url http://127.0.0.1:4321
npm run phase2:gate -- --part render --url http://127.0.0.1:4321
npm run phase2:gate -- --part states --url http://127.0.0.1:4321
npm run phase2:gate -- --part contracts --url http://127.0.0.1:4321
npm run phase3:case-batch-gate
npm run phase3:static-gate
npm run phase4:study
npm run phase4:study-capture
npm run phase4:gate
npm run phase5:world-gate
npm run phase5:gate
npm run phase6:tathya-gate
npm run phase6:worlds-gate
npm run worlds:parity
npm run worlds:media
npm run worlds:stills
npm run preview
```

Browser checks, run against a started server:

```bash
npm run shots -- --url http://127.0.0.1:4321
npm run a11y -- --url http://127.0.0.1:4321
npm run craft -- --url http://127.0.0.1:4321
npm run perf -- --url http://127.0.0.1:4321
```

## Working order

Read [`docs/RULES.md`](docs/RULES.md), [`docs/DESIGN_LOCK.md`](docs/DESIGN_LOCK.md),
[`docs/WORLDS.md`](docs/WORLDS.md), [`docs/BUILD_PLAN.md`](docs/BUILD_PLAN.md), and
[`CLAUDE.md`](CLAUDE.md) before making changes. Work one phase at a time and stop when
its measured gate passes.

The owner deferred the unrun Phase 1 text-only test. It was not marked as passing. A real
five-person comprehension test remains required on the Phase 3 static preview. Phase 3B now
generates case-study routes from validated content. BeatMind, Vivid and the approved
eight-project batch are complete records. Fraud Risk Intelligence and Oracle Auto Provision
remain visible, non-clickable deferred rows and emit no placeholder routes.

Phase 2 closed on 2026-08-31. Every route family has an accepted-for-now review
implementation, and the shared render, state, contrast, font-budget and static-boundary gates
pass. Further visual polish is deferred rather than reported as finished. The owner directed Phase 4 to begin while the remaining Phase 3 render
review, human test and preview deployment stay deferred. The Phase 4 motion studies are
captured at 390, 800 and 1440 pixels; the owner selected Sheet Fault. Production replaces
the study's slow full-root snapshot with two transform-only paper panels and measures
16.7-16.8 ms p95 across Home and `/work`. Its independent revert gate passes. The owner
explicitly waived personal render inspection and closed Phase 4 on 2026-09-01.

Phase 5 adds one shared dependency-free world lifecycle and the BeatMind Precision Descent
pilot. Home and `/work` enter that world first; projects without a published world continue
to open their paper case studies. The world uses a sanitized, committed export of real
source and five-stem envelopes plus analysis data. It omits the unverified failure/retry
trace and emits no audio request. The complete automated and independent-revert gates pass;
the owner approved the rendered world on 2026-09-02, so Phase 5 is closed. Phase 3's
deferred review remains a separate open item. Vivid's Story Loom is the sole Phase 6A world
in implementation, using a cleared four-frame Kyoto evaluation sequence, a text-only
missing-evidence boundary and an explicit unresolved commercial-model licence notice.
