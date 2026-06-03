# EVIDENCEBOUND - Parth Tiwari

Systems that act only after the evidence agrees.

## Roadmap Source

The build source of truth is [docs/EVIDENCEBOUND_BUILD_ROADMAP.md](docs/EVIDENCEBOUND_BUILD_ROADMAP.md).

Live site: [parth-tiwari.vercel.app](https://parth-tiwari.vercel.app)

The current implementation has completed the cinematic constellation, project film strips, top evidence overlays, mobile star-world path, Drive-backed Resume renderer, and Phase 5 production/SEO hardening. Remaining content work is limited to confirmed public links plus final language/grammar polish.

## Stack

| Layer | Current choice | Roadmap note |
|---|---|---|
| Framework | Vue 3.5.35 | Upgraded within Vue 3 |
| Build | Vite 8.0.14 | Upgraded from roadmap Vite 5 to clear audit findings |
| Language | TypeScript 6.0.3 | Upgraded with Vite 8 toolchain |
| 3D | Three.js 0.165.0 | Pinned to roadmap-safe line |
| 3D Vue wrapper | @tresjs/core 4.3.1 | Pinned and documented as required |
| Post-processing | postprocessing 6.38.0 | Direct composer path for bloom |
| Animation | GSAP 3.15.0 | Upgraded within GSAP 3 |
| State | Pinia 2.3.1 | Roadmap-compatible |
| Styling | Tailwind CSS 4.3.0 | Roadmap-compatible |
| Shader imports | vite-plugin-glsl 1.6.0 | Roadmap-compatible |
| Deployment | Vercel static | Live with SPA rewrites and cache headers |

Vite and TypeScript were upgraded because the scaffold typechecked and built cleanly, and `npm audit` required a Vite major upgrade for a clean dependency graph. Three.js and TresJS stay pinned because the 3D layer is higher risk.

## Current Status

- Phase -1 complete: repo, branch, scaffold, dependency lock, baseline checks.
- Phase 0 complete: design tokens, typography, glass/plain styles, canonical project data, Pinia stores, shared primitives, favicon, OG image, and head metadata.
- Phase 1 complete: TresJS scene shell, sky dome, particles, refusal ripple, scroll camera path, 9 project nodes, connector projection, hover labels, bloom, node glow, and Phase 0 handoff.
- Phase 1 performance gate passed on the target Chrome path after capping canvas DPR at `1.25`.
- Phase 1.9 complete: node kind/weight metadata is locked, Vivid is now a featured artifact under the Stick and Dot work-experience node, and the constellation readout explains kind/weight.
- Phase 2 Step 1 complete: boot overlay runs on normal page loads, uses the live project count, supports skip/Escape, and is skipped for `?plain=1` plus reduced-motion users.
- Phase 2 Step 2 complete: lower-left cinematic Hero renders over the constellation, the Phase 0 console is removed from normal `/`, and the bottom data bar was intentionally removed after visual review.
- Phase 2 realignment complete: same-page project overlays now use 5 panels, the top evidence bar appears after the Hero handoff, Experience/Training/Capability open over the constellation, and About appears as a scrollable human signal with social links over the frozen field.
- Resume overlay is implemented with Google Drive preview support and derives the preview URL from `src/data/resume.ts`.
- Phase 4 complete: mobile keeps the identity with a dedicated animated star world, drawer navigation, mobile project cards that reuse the same project overlay, and a compact footer band.
- Phase 5 hardening complete: `vercel.json`, robots, sitemap, expanded head metadata, Twitter/OG cards, JSON-LD, and a complete `?plain=1` static crawl/print fallback.
- Next step: populate the remaining confirmed public project links and polish site language.

## Setup

Use `npm.cmd` in PowerShell on this machine because `npm.ps1` is blocked by execution policy.

```bash
npm.cmd install
npm.cmd run dev
```

## Checks

```bash
npm.cmd run typecheck
npm.cmd run build
npm.cmd audit --audit-level=moderate
npm.cmd run preview
```

## Build Rules

- Keep `docs/EVIDENCEBOUND_BUILD_ROADMAP.md` as the implementation source of truth.
- Preserve `docs/PORTFOLIO_DISCOVERY_AND_IDEAS.md` as research/context.
- Use TypeScript objects for content; `src/data/projects.ts` will be the single source of truth from Phase 0 onward.
- Do not add markdown-driven project content unless the roadmap changes.
- Keep v1 static and Vercel-ready.
- Exclude audio, Howler.js, GSAP SplitText, and Temporal frontend code from v1.
- Treat `?plain=1` as the complete static crawl/print fallback path.

## Phase Gates

- Phase -1 gate: scaffold builds, typechecks, audits cleanly, and branch is `dev`.
- Phase 0 gate: tokens, typography, glass/plain styles, types, project data, stores, shared primitives, favicon, and OG image compile with zero TypeScript errors. Complete.
- Phase 1 gate: cinematic constellation renders, scroll camera path works, all 9 nodes are visible, hover labels work, `?plain=1` skips 3D, Chrome reaches about 60fps, and checks pass. Complete.
- Phase 1.9 gate: constellation information architecture is locked before overlays: node kind, origin, weight, and child artifacts compile cleanly. Complete.
- Phase 2 Step 1 gate: boot overlay fades into the warmed constellation, supports skip/Escape, and skips for plain/reduced-motion paths. Complete.
- Phase 2 Step 2 gate: Hero is readable over the tuned constellation, normal `/` no longer shows the Phase 0 scaffold, and end-scroll handoff shading is removed. Complete.
- Phase 2 realignment gate: Project overlays render 5 panels, the Links/Launch panel renders only safe confirmed URLs, Experience/Training/Capability open as same-world overlays, and About opens as a constellation-native signal with social links. Complete.
- Phase 4 gate: Mobile keeps the star-world identity without mounting the desktop 3D scene, uses drawer navigation, exposes project cards, reuses the same overlays, and keeps desktop unchanged. Complete.
- Phase 5 gate: Live Vercel deployment has SPA rewrites, cache headers, robots/sitemap, production metadata, JSON-LD, and complete `?plain=1` fallback. Complete.
- Later phase gates remain exactly as defined in the roadmap.

## Performance Notes

- Chrome is the target browser for the Phase 1 FPS gate.
- Chrome is user-confirmed at about `60fps` after the DPR cap change.
- Brave is user-confirmed around `50fps+`.
- Comet is treated as a non-target browser/compositor outlier for now.
- The current performance fix preserves the UI and visual composition.

## Environment

No environment variables are required for v1.
