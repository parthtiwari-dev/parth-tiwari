# Parth Tiwari portfolio

This repository is rebuilding Parth Tiwari's portfolio as **Paper and Worlds**: a
static, multi-page Astro site whose project case studies use each project's real data.

The current code is the Phase 0 foundation only. It intentionally contains one unstyled,
server-rendered placeholder route and no canvas, tear interaction, final copy, content
collection, or world implementation.

## Stack

- Astro 7.2.9, exactly pinned
- static HTML output
- strict TypeScript configuration
- vanilla CSS when visual work begins in Phase 2
- Playwright as a development-only browser verification tool

`astro` is the only direct production dependency.

## Commands

```bash
npm install
npm run dev
npm run build
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
