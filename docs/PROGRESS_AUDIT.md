# EVIDENCEBOUND Progress Audit

Date: 2026-05-29
Branch: `dev`
Status: Phase 1.5 visual fidelity lock complete; ready for user visual review

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
| Glass shimmer test surface | Done through the Phase 0 `GlassPanel`; temporary fixed test block removed after QA |

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
| Hardware-tiered particle field | Done, `10k/5k/2k` with hybrid ambient/aura distribution |
| Refusal ripple timing | Done, 30s cycle / 3s active / max `0.018` after visual retune |
| 9 constellation nodes | Done from `projects.ts` |
| Manual node raycaster interaction | Done, every-other pointermove |
| Hover node scale | Done, `1.4x` |
| Hover cluster brightness | Done, `+40%` |
| Connector projection layer | Done, pauses while overlay is open |
| Hover-only projected node label | Done, `[ENTER ->]` stub |
| Plain mode scene gate | Done |
| Phase 2 overlays/sections/sliders | Not added |

## Phase 1 VFX Calibration

| Task | Result |
|---|---|
| Direct `postprocessing` composer | Done with `EffectComposer`, `RenderPass`, `EffectPass`, `BloomEffect` |
| Bloom configuration | Retuned: threshold `0.62`, smoothing `0.08`, intensity `0.58`, mipmap blur |
| Node materials | Upgraded to `MeshStandardMaterial` |
| Node emissive status colors | Done |
| Camera-follow point light | Done |
| Ambient light reduction | Done, `0.55` -> `0.12` |
| Per-node atmosphere | Done, camera-facing soft discs; hard target rings removed |
| Connector opacity | Deliberate visual deviation: `0.14` for readability |

## Phase 1 Roadmap Realignment

| Task | Result |
|---|---|
| Rectangular background plane | Replaced with camera-centered inward sky dome |
| Canonical `ParticleField` path | Restored |
| Single particle geometry | Reworked internally as 84% ambient field / 16% constellation aura |
| Ambient particle hover behavior | Stable, sentinel cluster `-1` |
| Aura hover behavior | Cluster brightness affects local aura only |
| Particle size/alpha | Reduced to avoid white snow/cotton blobs |
| Normal `/` route | Shows constellation, transition band, and Phase 0 test surface |
| `?plain=1` | Skips 3D and shows fallback content |
| Glass realism | Tuned lower fill, stronger blur/saturation, highlight, restrained shadow |

## Phase 1 Visual Lock Pass

| Task | Result |
|---|---|
| Darker blue-black scene palette | Done, `--bg: #010409` with lift/bridge tokens |
| Sky dome color calibration | Done, darker navy base with restrained iridescence |
| Atmosphere-only node halos | Done, soft additive glow discs replacing bullseye rings |
| Sparse premium particle field | Done, `84%` ambient field / `16%` project aura |
| Project aura caps | Done, particle size/alpha reduced to avoid blobs |
| Bridge to Phase 0 | Done, overlapped `118vh` dark gradient bridge matched to sky-dome color |

## Phase 1 Decisive Visual Fix

| Task | Result |
|---|---|
| Cold star distribution | Done, 92%+ particles now ice-white/blue with rare warm/gold stars |
| Bright star tier | Done, ~0.2% rare stars with subtle shader twinkle |
| Near-black void | Done, sky dome atmosphere mix capped near `0.04` with stronger vignette |
| Jewel node calibration | Done, smaller visible node bodies, tighter bloom, capped atmosphere opacity |
| Gold contrast punch | Done, complete nodes use stronger emissive and tiny local warm lights |
| Connector visibility | Done, z-index fixed, opacity raised to `0.14`, subtle dash animation added |
| Hover label reliability | Done, label z-index raised and invisible node hit targets added |
| Camera arrival | Done, start moved to `(0, 6, 22)` |
| Browser screenshot sweep | Done, 11 scroll stops plus hover and plain-mode screenshots; latest kept in `.phase1-qa-15` |
| Refusal ripple visual wash | Fixed, large warm radial artifact reduced to a tiny cool low-opacity ripple |

## Phase 1.5 Visual Fidelity Lock

| Task | Result |
|---|---|
| Visual target | Locked as cinematic evidence constellation inside a deep blue-black nebula |
| Nebula depth | Upgraded sky-dome shader with procedural blue/cyan wisps, stronger vignette, subtle grain |
| Micro-star density | Increased within canonical `ParticleField`; still below snow/cotton density |
| Star realism | Added colder distribution, rare bright stars, and subtle shader diffraction glints |
| Project nodes | Tuned as smaller crisp named-star jewels with tighter glow and glints |
| Phase 0 framing | Reframed as evidence console surface, not final landing content |
| Glass realism | Added layered cracked/refraction overlay, sharper border, stronger blur/saturation |
| Scroll transition | Extended bridge overlap to fade the constellation into Phase 0 instead of cutting |
| Browser feedback loop | Completed iterative sweeps; latest evidence in untracked `.phase1-qa-15` |

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
| postprocessing | 6.38.0 |
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

## Phase 1 VFX Files Added

| Area | Files |
|---|---|
| Post-processing | `src/components/scene/PostProcessing.vue` |
| Lighting | `src/components/scene/CameraLight.vue` |

## Verification

| Check | Result |
|---|---|
| `npm.cmd install` | Pass |
| `npm.cmd run typecheck` | Pass |
| `npm.cmd run build` | Pass |
| `npm.cmd audit --audit-level=moderate` | Pass, 0 vulnerabilities |
| Manual app run | User confirmed app runs fine |
| Phase 1 browser visual QA | Pass for structure and interaction; Codex ran isolated Vite/Chrome sweeps and stopped the temp server |
| Latest visual sweep | Pass: `.phase1-qa-15` contains 11 scroll stops, hover probe, plain-mode screenshot, and summary |

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
| Flat node visuals | Added bloom, standard materials, emissive color, key light, and soft atmosphere discs |
| Uniform star field | Added size/alpha/warmth tiers plus organic drift and parallax |
| Flat background | Increased iridescence and added depth/noise variation |
| Visible background rectangle | Replaced finite plane with inward sky dome |
| Particle snow/cotton look | Reworked canonical particle field with ambient/aura distribution and lower alpha |
| Phase 1 to Phase 0 hard transition | Added temporary dark transition band before Phase 0 test surface |
| Roadmap drift from split particle system | Restored canonical `ParticleField` files and removed split-system files |
| Green-gray scene wash | Shifted Phase 1 palette toward darker blue-black while preserving CRYO-GOLD accents |
| Bullseye halo look | Replaced hard ring geometry with soft atmosphere-only shader discs |
| Fairy-light particle warmth | Inverted particle warmth distribution toward cold ice-white stars |
| Bloated node glow | Raised bloom threshold, reduced bloom intensity, reduced node visual radius |
| Invisible/weak connectors | Raised connector overlay z-index and opacity, added dash animation |
| Hover labels unreliable | Added larger invisible hit targets and deferred renderer event binding |
| Helicopter-like camera start | Lowered start point to `(0, 6, 22)` |
| Dev console framebuffer warnings | Guarded post-processing composer until renderer size is non-zero |
| Renderless component template warnings | Added empty templates to renderless scene controllers |
| Huge refusal ripple wash | Reduced geometry, opacity, and blending so it stays subliminal |
| Temporary fixed glass rectangle | Removed after Phase 0 `GlassPanel` verified the glass treatment |
| Flat Phase 1.5 sky | Added procedural nebula wisps without reintroducing a rectangular plane |
| Sparse visual field | Increased micro-star visibility while keeping roadmap particle count tiers |
| Hard Phase 1 to Phase 0 cut | Replaced short bridge with an overlapped long fade layer |
| Card-like glass | Added crack/refraction overlay and stronger glass optics |

## Upgrade Notes

| Area | Decision |
|---|---|
| Vue | Upgraded to 3.5; safe within Vue 3 |
| Vite | Upgraded to 8; build/typecheck/audit pass |
| TypeScript | Upgraded to 6 with Vite 8 toolchain |
| GSAP | Upgraded within 3.x |
| postprocessing | Added direct `6.38.0`; skipped Tres wrapper to preserve pinned Three/Tres stack |
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
| Three.js bundle exceeds 500 kB warning | Expected after Phase 1 3D/post-processing stack; monitor later |
| Phase 1 manual FPS/hover/scroll visual checks | Browser screenshot sweep completed; user subjective review still needed |
| Dev-only TresJS lifecycle warnings | Observed in Vite dev mode; no page errors and production build is clean |
| External font network in sandbox | Headless QA reported `ERR_NETWORK_ACCESS_DENIED` for remote fonts; expected in restricted sandbox |

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

Review the `.phase1-qa-15` screenshots and the running app, then move to Phase 2 only if the cinematic constellation direction feels right.
