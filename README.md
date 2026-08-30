# Parth Tiwari portfolio

This repository is rebuilding Parth Tiwari's portfolio as **Paper and Worlds**: a
static, multi-page Astro site whose project case studies use each project's real data.

The current code has completed Phase 1 and is working through Phase 2. It contains validated
content collections, twelve complete case-study records, twelve Errata entries, route copy,
services, experience, and source-linked claims. The maintained Phase 2 landing now lives at
`/`. It is a reviewable static stub, not the Phase 3 production site. `/work/` has its
register study, `/work/beatmind/` has the shared-case-study pilot, and Notes, About, Resume
and Hire now have route-review implementations. The landing includes the approved full-width rag sheet, post-hero sticky
paper fold, content-driven sections, stable fibre-edge segments, bounded one-shot paper
motion and the current project-hover study. The rejected A/B/C studies were removed. There
is still no production tear, backlight, canvas or animated world. The owner approved the
current root landing for an interim public release while the rest of Phase 2 continues;
that release is not the complete Phase 3 or Phase 7 site.

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
npm run phase2:notes-capture -- --url http://127.0.0.1:4321
npm run phase2:about-capture -- --url http://127.0.0.1:4321
npm run phase2:resume-capture -- --url http://127.0.0.1:4321
npm run phase2:hire-capture -- --url http://127.0.0.1:4321
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
five-person comprehension test remains required on the Phase 3 static preview.

Phase 2 remains open. Every route family now has a review implementation, and the BeatMind
case-study pilot is approved. Owner visual approval for the recent Notes, About, Resume and
Hire slices, shared-token and route-state closeout, and rendered contrast are still required
before the Phase 2 gate can pass. Vivid has not begun.
