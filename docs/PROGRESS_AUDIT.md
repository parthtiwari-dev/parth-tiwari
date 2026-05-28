# EVIDENCEBOUND Progress Audit

Date: 2026-05-28  
Branch: `dev`  
Status: Phase 1 implementation complete; browser visual QA pending user-run server

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

## Phase 0 Checklist

| Task | Result |
|---|---|
| CRYO-GOLD tokens | Done |
| Typography imports and role classes | Done |
| Glass panel shimmer styles | Done |
| Cursor style primitives | Done |
| Plain mode CSS overrides | Done |
| Vite alias and GLSL config | Already present from Phase -1 |
| TypeScript interfaces | Done |
| 9-project canonical data file | Done |
| Pinia stores | Done |
| `usePlainMode` composable | Done |
| Shared primitive components | Done |
| EB favicon | Done |
| 1200x630 OG image | Done |
| Temporary default cursor | Done for Phase 0 testing |
| Index head metadata | Done from roadmap Phase 5 spec |

## Phase 1 Checklist

| Task | Result |
|---|---|
| `vite-plugin-glsl` dependency and Vite wiring | Confirmed already present |
| GLSL shader module declaration | Done |
| Iridescent background shaders | Done |
| Particle field shaders | Done |
| Refusal ripple shaders | Done |
| `SceneRoot` TresCanvas shell | Done |
| `#constellation-section` scroll rig | Done, `400vh` |
| ScrollTrigger camera path | Done |
| Iridescent hue loop | Done, `(delta / 8) * 360` |
| Hardware-tiered particle field | Done, `10k/5k/2k` |
| Refusal ripple timing | Done, 30s cycle / 3s active / max `0.08` |
| 9 constellation nodes | Done from `projects.ts` |
| Manual node raycaster interaction | Done, every-other pointermove |
| Hover node scale | Done, `1.4x` |
| Hover cluster brightness | Done, `+40%` |
| Connector projection layer | Done, pauses while overlay is open |
| Hover-only projected node label | Done, `[ENTER ->]` stub |
| Plain mode scene gate | Done |
| Phase 2 overlays/sections/sliders | Not added |

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

## Phase 0 Files Added

| Area | Files |
|---|---|
| Styles | `src/styles/tokens.css`, `typography.css`, `glass.css`, `cursor.css`, `plain.css` |
| Types | `src/types/project.ts`, `slider.ts`, `node.ts` |
| Data | `src/data/projects.ts` |
| State | `src/stores/projectStore.ts`, `overlayStore.ts`, `sliderStore.ts` |
| Composable | `src/composables/usePlainMode.ts` |
| Shared UI | `GlassPanel`, `GeistChip`, `MetricCountUp`, `StatusBadge`, `CopiedToast` |
| Assets | `public/favicon.svg`, `public/og.png` |
| Head metadata | `index.html` Open Graph, canonical, favicon, font preconnects |

## Phase 1 Files Added

| Area | Files |
|---|---|
| Scene root | `src/components/scene/SceneRoot.vue` |
| Scene controllers | `CameraPathController`, `IridescentBackground`, `ParticleField`, `RefusalRipple` |
| Constellation UI | `ConstellationNodes`, `ConnectorLines`, `NodeLabel` |
| Composables | `useCameraPath.ts`, `useNodeInteraction.ts`, `useParticleField.ts` |
| Shaders | `iridescent.*.glsl`, `particle.*.glsl`, `refusalRipple.*.glsl` |
| Types | `src/types/glsl.d.ts` |

## Verification

| Check | Result |
|---|---|
| `npm.cmd install` | Pass |
| `npm.cmd run typecheck` | Pass |
| `npm.cmd run build` | Pass |
| `npm.cmd audit --audit-level=moderate` | Pass, 0 vulnerabilities |
| Manual app run | User confirmed app runs fine |
| Phase 1 browser visual QA | Pending; Codex did not start server by request |

## Issues Found And Resolved

| Issue | Resolution |
|---|---|
| Git refused repo due dubious ownership | Added repo to Git safe directories |
| PowerShell blocked `npm.ps1` | Use `npm.cmd` |
| Scaffold command created temporary folder | Copied scaffold into repo, removed temporary folder |
| Vite 5 audit findings via esbuild/Vite | Upgraded to Vite 8 |
| Vite 8 changed `manualChunks` typing | Switched to function-based chunking |
| Branch name exposed `codex` locally | Renamed local branch to `dev` before push |
| TypeScript 6 deprecated `baseUrl` warning | Removed `baseUrl`, kept `paths` alias |
| CSS font `@import` order warning | Moved font imports before style rules |
| Cursor hidden before Phase 3 component | Added temporary default cursor in `App.vue` for Phase 0 testing |
| `useCameraPath` narrowed camera too loosely for TS | Stored narrowed camera before nested updater |
| Particle shader uniform indexing risk | Replaced dynamic uniform-array index with fixed branch lookup |

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
| Project links are intentionally empty | Add only confirmed public links later |
| Custom cursor CSS exists before component | Phase 3 adds moving cursor component |
| Three.js bundle exceeds 500 kB warning | Expected after Phase 1 3D stack; monitor later |
| Phase 1 manual FPS/hover/scroll visual checks | Pending user-run server |

## Phase 0 Data Decisions

| Item | Decision |
|---|---|
| Project count | Exactly 9 projects |
| Vivid status | `complete`, because the storyboard platform shipped |
| Oracle Auto Provision status | `experience`, because it is a small infra utility |
| OncoVerse proof | Milestones with `progressPercent: 20` |
| Stick and Dot App | Not a 10th node; represented in Vivid/deployment context later |
| Public links | Empty unless a safe public link is confirmed |

## Next Step

Run the app locally for Phase 1 visual QA, then move to Phase 2 only if scene render, scroll flight, hover labels, connectors, particles, ripple, and plain mode all look correct.
