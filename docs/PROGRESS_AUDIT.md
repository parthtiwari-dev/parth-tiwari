# EVIDENCEBOUND Progress Audit

Date: 2026-05-28  
Branch: `dev`  
Status: Phase -1 complete, Phase 0 not started

## Branch And Repo

| Item | State |
|---|---|
| Previous local branch | `codex/evidencebound-bootstrap` |
| Published? | No remote `origin/codex/...` branch was present |
| Current branch | `dev` |
| Remote | `origin` -> `https://github.com/parthtiwari-dev/parth-tiwari.git` |
| Docs preserved | Yes |

## Phase -1 Checklist

| Task | Result |
|---|---|
| Fix Git safe directory | Done |
| Create implementation branch | Done, now renamed to `dev` |
| Scaffold Vue/Vite/TypeScript app | Done |
| Use `npm.cmd` on Windows | Documented |
| Install roadmap stack | Done |
| Add baseline scripts | Done: `dev`, `typecheck`, `build`, `preview` |
| Verify build health | Done |

## Current Stack

| Package | Version |
|---|---|
| Vue | 3.5.35 |
| Vite | 8.0.14 |
| TypeScript | 6.0.3 |
| Tailwind Vite plugin | 4.3.0 |
| Pinia | 2.3.1 |
| GSAP | 3.15.0 |
| Three.js | 0.165.0 |
| @tresjs/core | 4.3.1 |
| vite-plugin-glsl | 1.6.0 |
| vue-tsc | 2.2.12 |

## Verification

| Check | Result |
|---|---|
| `npm.cmd install` | Pass |
| `npm.cmd run typecheck` | Pass |
| `npm.cmd run build` | Pass |
| `npm.cmd audit --audit-level=moderate` | Pass, 0 vulnerabilities |
| Manual app run | User confirmed app runs fine |

## Issues Found And Resolved

| Issue | Resolution |
|---|---|
| Git refused repo due dubious ownership | Added repo to Git safe directories |
| PowerShell blocked `npm.ps1` | Use `npm.cmd` |
| Scaffold command created temporary folder | Copied scaffold into repo, removed temporary folder |
| Vite 5 audit findings via esbuild/Vite | Upgraded to Vite 8 |
| Vite 8 changed `manualChunks` typing | Switched to function-based chunking |
| Branch name exposed `codex` locally | Renamed local branch to `dev` before push |

## Upgrade Notes

| Area | Decision |
|---|---|
| Vue | Upgraded to 3.5; safe within Vue 3 |
| Vite | Upgraded to 8; build/typecheck/audit pass |
| TypeScript | Upgraded to 6 with Vite 8 toolchain |
| GSAP | Upgraded within 3.x |
| Three.js | Kept pinned at 0.165.0 |
| TresJS | Kept pinned at 4.3.1 |
| Pinia | Kept on 2.x for roadmap compatibility |

## Known Risks

| Risk | Action |
|---|---|
| Vite 8 is newer than roadmap baseline | Keep unless Phase 1/2 tooling breaks |
| TypeScript 6 is stricter/newer | Keep strict checks running every phase |
| TresJS/Three API drift risk | Do not upgrade casually during 3D work |
| No Phase 0 project data yet | Build data model first in Phase 0 |
| `public/og.png` missing | Generate during Phase 0 as roadmap requires |

## Next Step

Start Phase 0 exactly from the roadmap: styles, config, types, full project data, composables, shared primitives, favicon/OG assets, then TypeScript gate.
