# Parth Tiwari portfolio

This repository is rebuilding Parth Tiwari's portfolio as **Paper and Worlds**: a
static, multi-page Astro site whose project case studies use each project's real data.

The current code has completed Phases 1 and 2, has an open Phase 3 gate and has the selected
Phase 4 Sheet Fault implementation awaiting final owner review. It contains validated
content collections, twelve base project records, twelve Errata entries, route copy,
services, experience, and source-linked claims. The maintained Home route lives at `/`.
`/work/` has its complete register, ten published `/work/[slug]/` routes use the shared paper
case-study system, and Notes, About, Resume and Hire have static route implementations. The
landing includes the approved full-width rag sheet, post-hero sticky
paper fold, content-driven sections, stable fibre-edge segments, bounded one-shot paper
motion and the production project preview. The rejected Phase 2 A/B/C directions were
removed. Home and `/work` now use the selected Sheet Fault route transition with static
backlights, real paper panels, real-route navigation and accessibility fallbacks. There is
still no canvas or animated project world. The current
interim deployment still contains the earlier root-only release; the complete static site has
not passed the Phase 3 preview gate or the Phase 7 production cutover.

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
pass. Further visual polish is deferred rather than reported as finished. Vivid production
work has not begun. The owner directed Phase 4 to begin while the remaining Phase 3 render
review, human test and preview deployment stay deferred. The Phase 4 motion studies are
captured at 390, 800 and 1440 pixels; the owner selected Sheet Fault. Production replaces
the study's slow full-root snapshot with two transform-only paper panels and measures
16.7-16.8 ms p95 across Home and `/work`. Its independent revert gate passes. Final rendered
owner approval remains open.
