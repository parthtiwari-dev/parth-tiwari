# EVIDENCEBOUND - Parth Tiwari

Systems that act only after the evidence agrees.

## Roadmap Source

The build source of truth is [docs/EVIDENCEBOUND_BUILD_ROADMAP.md](docs/EVIDENCEBOUND_BUILD_ROADMAP.md).

The current implementation is in **Phase -1: Project Bootstrap + Lockdown**. Phase 0 starts only after this scaffold remains healthy.

## Stack

| Layer | Current choice | Roadmap note |
|---|---|---|
| Framework | Vue 3.5.35 | Upgraded within Vue 3 |
| Build | Vite 8.0.14 | Upgraded from roadmap Vite 5 to clear audit findings |
| Language | TypeScript 6.0.3 | Upgraded with Vite 8 toolchain |
| 3D | Three.js 0.165.0 | Pinned to roadmap-safe line |
| 3D Vue wrapper | @tresjs/core 4.3.1 | Pinned and documented as required |
| Animation | GSAP 3.15.0 | Upgraded within GSAP 3 |
| State | Pinia 2.3.1 | Roadmap-compatible |
| Styling | Tailwind CSS 4.3.0 | Roadmap-compatible |
| Shader imports | vite-plugin-glsl 1.6.0 | Roadmap-compatible |
| Deployment | Vercel static | Planned for Phase 5 |

Vite and TypeScript were upgraded because the scaffold typechecked and built cleanly, and `npm audit` required a Vite major upgrade for a clean dependency graph. Three.js and TresJS stay pinned because the 3D layer is higher risk.

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
- Treat `?plain=1` as a first-class fallback path.

## Phase Gates

- Phase -1 gate: scaffold builds, typechecks, audits cleanly, and branch is `dev`.
- Phase 0 gate: tokens, typography, glass/plain styles, types, project data, stores, shared primitives, favicon, and OG image compile with zero TypeScript errors.
- Later phase gates remain exactly as defined in the roadmap.

## Environment

No environment variables are required for v1.
