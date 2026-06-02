# EVIDENCEBOUND Progress Audit

Date: 2026-06-01
Branch: `dev`
Status: Phase 2 single-world overlay path active; project links panel, evidence top bar, Experience/Training/Capability, About signal with social links, and Drive-ready Resume renderer implemented

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
| Node emissive colors | Done; Phase 1.9 switched visible color semantics to `nodeKind` |
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

## Phase 1.6 Constellation Composition Lock

| Task | Result |
|---|---|
| Late-scroll hover | Fixed by moving node raycast listeners to `window` so bridge/console overlap cannot block hover |
| Hover label placement | Fixed by clamping projected labels inside the viewport |
| Connector style | Changed from animated dotted graph lines to continuous faint hairlines |
| Space depth | Added procedural far-star layer in the sky dome and retuned particle split to 88% ambient / 12% aura |
| Node palette | Tuned gold/teal/amber/ice toward tighter jewel colors with lower halo dominance |
| Final camera composition | Tuned final camera point and eased the final look target toward the constellation center |
| Phase 0 handoff | Added scroll-progress scene fade plus masked console background to remove the hard shelf transition |
| Browser feedback loop | Latest evidence in untracked `.phase1-qa-18`; hover probes pass at mid and late scroll |

## Phase 1.8 Minimal Visual Polish

| Task | Result |
|---|---|
| Purple sky wash | Reduced by shifting the sky shader toward deep navy and lowering violet/Milky Way intensity |
| Edge-node framing | Initially tested a conservative no-flip endpoint; replaced in the follow-up camera correction below |
| First-screen context | Replaced tutorial hint with restrained `EVIDENCEBOUND / 9 SYSTEMS` corner label |

## Phase 1.8 Camera Correction

| Task | Result |
|---|---|
| Cinematic fly-through | Restored the dramatic negative-Z endpoint so the scroll can arrive through the constellation instead of flattening out early |
| Smooth turn | Replaced the abrupt flip behavior with a moving look target from SecondSelf toward the constellation center |
| Final reveal | Pulled the endpoint slightly farther back to `(0, 2.1, -7.2)` so the 9-node constellation reads more fully in the final visible frame |
| Handoff timing | Delayed the scene fade to keep the final constellation visible longer before Phase 0 takes over |

## Phase 1 Performance Lock

| Task | Result |
|---|---|
| DPR cap | Lowered Tres canvas DPR cap from `1.75` to `1.25` |
| Chrome target | User-confirmed Chrome now reaches about `60fps`, satisfying the Phase 1 target browser gate |
| Brave target | User-confirmed Brave now holds around `50fps+`, acceptable for Phase 1 |
| Comet browser | Observed around `30fps`; treated as non-target browser/compositor overhead and not a Phase 1 blocker |
| UI impact | No roadmap UI/scene refactor; visual composition preserved |

## Phase 1.9 Constellation IA Lock

| Task | Result |
|---|---|
| Node kinds | Added `personal-project`, `work-experience`, `utility`, and `current-build` metadata |
| Node weights | Added `flagship`, `major`, and `minor` evidence-weight metadata |
| Vivid standalone node | Replaced by the `Stick and Dot` work-experience node |
| Vivid artifact | Preserved as the featured creative AI artifact under `Stick and Dot` |
| Stick and Dot App | Preserved as a product-platform artifact under `Stick and Dot` |
| Project count | Still exactly 9 constellation nodes |
| Slider binding | `costPerQuery` now targets `stick-and-dot` |
| Connector graph | `Stick and Dot` now connects to `OncoVerse` |
| Scene readout | Added quiet constellation index with simple color dots and visitor-facing labels |
| Node colors | Switched visible colors from lifecycle `status` to IA `nodeKind` so personal/work/current/utility are readable |
| Utility color | Shifted utility nodes to hot ember so they separate from background stars and read as real tooling evidence |
| Small-node visibility | Added a post-scale visibility floor for `medium-small`, `small`, and `tiny` nodes plus wider ambient particle clearance around minor nodes |
| Sky-dome seam | Replaced UV-anchored nebula bands with direction-based triplanar noise/star layers so camera turns no longer expose a back-wall convergence |
| Roadmap | Updated Phase 2 language for project and work-experience overlays |

## Phase 2 Step 1 Boot Sequence

| Task | Result |
|---|---|
| `BootSequence.vue` | Added full-screen fixed near-black CRYO-GOLD terminal overlay |
| `useBootSequence.ts` | Added timed line reveal, skip reveal, auto fade, Escape handling, and reduced-motion skip |
| Live project count | Boot line reads `projectStore.projectCount` instead of hardcoding `9` |
| Scene warmup | `SceneRoot` remains mounted behind the boot overlay |
| Plain mode | `?plain=1` skips boot and 3D, preserving fallback content |
| Accessibility | Terminal status uses `role="status"` / `aria-live="polite"` and skip is a real button |
| Scope | No HeroSection, EvidenceDataBar, overlays, sliders, or camera/scene visual changes |

## Phase 2 Step 2 Hero Layer

| Task | Result |
|---|---|
| Hero layer | Added lower-left cinematic `PARTH TIWARI` over the constellation |
| Tagline | Added `useCharacterSplit` typewriter at roadmap `18ms` timing |
| Scroll cue | Added pulsing `scroll to enter the field` cue, hidden after interaction |
| Phase 0 scaffold | Removed from normal `/`; still available through plain/debug wiring if needed |
| Bottom data bar | Intentionally removed after visual review because it cluttered the constellation |
| End-scroll shading | Removed old Phase 0 handoff fade so the final constellation no longer darkens |

## Phase 2 Realigned Evidence Navigation

| Item | Status |
|---|---|
| Project film strip | Expanded from 4 panels to 5 panels |
| Links / Launch panel | Added for all 9 project overlays |
| Link policy | Renders only confirmed fields from `project.links`; no fake anchors or private URLs |
| Supported link fields | `github`, `liveUI`, `liveAPI`, `apiDocs`, `demoVideo`, `caseStudy`, `docs`, `deployment` |
| Top Evidence Bar | Added as a fixed low-height glass rail after the Hero fade threshold |
| Enabled top actions | `[EXPERIENCE]`, `[TRAINING]`, `[CAPABILITY]`, and `[ABOUT]` open same-world overlays |
| Deferred top actions | Resume is visible but disabled until its Drive source is configured |
| Experience overlay | Implemented as a same-page work timeline overlay, not a standalone section below the constellation |
| Initial deployment data | Stick and Dot work node, with Vivid and Stick and Dot App child artifacts |
| Scene behavior | Evidence overlay pauses constellation interaction and connector projection; Capability keeps the render loop active only for highlight feedback |
| Routes | No router or separate pages added |

## Phase 2.4 Training, Capability, Contact Overlays

| Item | Status |
|---|---|
| Training overlay | Added two formal training records as glass timeline cards, including the CGPA chip |
| Capability overlay | Added five capability groups with hover-to-project matching from `project.stack` |
| Contact overlay | Removed as a separate surface; GitHub, LinkedIn, Email, and X placement now lives inside About |
| Top bar | Training, Capability, and About enabled; Contact removed as a separate action; Resume enabled by Drive source |
| Constellation highlight | Capability hover dispatches `projectStore.highlight(projectIds)` and softly emphasizes matching nodes |
| Performance policy | Training, Experience, and Contact pause the scene; Capability remains animated only while skill highlight is useful |
| Routes | Still no router or standalone scroll sections |

## Phase 2.5 About Signal And Resume Renderer

| Item | Status |
|---|---|
| About | Added a special constellation-native `AboutSignal` surface instead of another card/grid overlay |
| About copy | Uses a short human note, prominent social link band, and cleaner signal facts instead of terminal lines |
| About scene behavior | Freezes the constellation at the current scroll frame, keeps the top bar visible, and renders pure typography above the field without a panel/scrim |
| About social links | Adds GitHub, LinkedIn, Email, and a disabled X placeholder until a real handle is confirmed |
| Resume renderer | Added Drive-backed `ResumeOverlay` with lazy iframe preview and open-in-Drive action |
| Resume config | `src/data/resume.ts` accepts a Drive file ID or share link; top-bar Resume enables only when configured |
| Resume current state | Enabled with the current Drive source; renderer derives `/preview` from the configured link |

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

## Phase 2 Step 1 Files Added

| Area | Files |
|---|---|
| Boot overlay | `src/components/sections/BootSequence.vue` |
| Boot state/timing | `src/composables/useBootSequence.ts` |

## Phase 2 Step 2 Files Added

| Area | Files |
|---|---|
| Hero | `src/components/sections/HeroSection.vue`, `HeroName.vue`, `HeroTagline.vue` |
| Text animation | `src/composables/useCharacterSplit.ts` |

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
| `git diff --check` | Pass |
| Manual app run | User confirmed app runs fine |
| Phase 1 browser visual QA | Pass for structure and interaction; Codex ran isolated Vite/Chrome sweeps and stopped the temp server |
| Latest visual sweep | Pass: Phase 1.8 camera correction browser QA captured 20 scroll stops in `.phase1-qa-22`; hover probes pass at early, mid, and late visible constellation positions; `?plain=1` still skips 3D |
| Phase 1 FPS gate | Pass: DPR cap `1.25` gives user-confirmed Chrome ~`60fps`; Brave ~`50fps+`; Comet excluded as non-target |

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
| Late-scroll hover blocked by overlap | Moved pointer listeners to `window`; bridge remains `pointer-events: none` |
| Hover card clipping near viewport edge | Clamped projected label coordinates |
| Shelf-like console handoff | Added camera-progress fade overlay and masked Phase 0 background fade-in |

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
| Boot visual QA | Browser verification still needs a live local dev session after implementation; static build and type gates pass |
| Overlay project links | Populate `project.links` only after each GitHub, live UI, API docs, demo video, write-up, or deployment URL is confirmed safe and public |
| Disabled top-bar actions | Training, Capability, About, Contact, and Resume need real content/link before enabling |

## Phase 0 Data Decisions

| Item | Decision |
|---|---|
| Project count | Exactly 9 projects |
| Stick and Dot node | `complete` work-experience node with Vivid and Stick and Dot App artifacts |
| Vivid status | Featured artifact under Stick and Dot; storyboard platform shipped |
| Oracle Auto Provision status | `experience`, because it is a small infra utility |
| OncoVerse proof | Milestones with `progressPercent: 20` |
| Stick and Dot App | Not a 10th node; represented as product evidence under Stick and Dot |
| Public links | Empty unless a safe public link is confirmed |

## Phase 2 Section 3/4 Overlay Slice

| Item | Status |
|---|---|
| Scope | Same-page film-strip overlay section |
| Overlay-ready nodes | All 9 constellation nodes |
| Data source | `src/data/projects.ts`, verified against safe README/docs from the real project folders and discovery docs |
| Click behavior | Every node opens `overlayStore.open(projectId)` |
| Panels | Problem, Architecture, Proof, Boundary, Links/Launch |
| Navigation | Close, Escape, arrow buttons, keyboard arrows, wheel, touch swipe |
| Routes | No router or project detail pages added |
| Visual scope | No 3D, particle, camera, hero, boot, or cursor rebuild |

## Phase 2 Overlay Files Added

| Area | Files |
|---|---|
| Overlay shell | `ProjectOverlay.vue`, `FilmStrip.vue`, `FilmStripHeader.vue` |
| Panels | `PanelProblem.vue`, `PanelArchitecture.vue`, `PanelProof.vue`, `PanelBoundary.vue`, `PanelLinks.vue` |
| Diagram | `BrokenFlowDiagram.vue` |
| Gate | `src/data/overlayReady.ts` derives all ready ids from canonical project data |

## Phase 2 Evidence Navigation Files Added

| Area | Files |
|---|---|
| Top bar | `src/components/sections/EvidenceTopBar.vue` |
| Site overlay state | `src/stores/evidenceOverlayStore.ts` |
| Evidence overlay shell | `src/components/evidence/EvidenceOverlay.vue` |
| Experience | `src/components/evidence/ExperienceLog.vue` |
| Training | `src/components/evidence/TrainingData.vue`, `src/data/training.ts` |
| Capability | `src/components/evidence/CapabilityMap.vue`, `src/data/capabilities.ts` |
| About | `src/components/evidence/AboutSignal.vue`, `src/data/about.ts` |
| Social links | `src/data/socialLinks.ts` |
| Resume | `src/components/evidence/ResumeOverlay.vue`, `src/data/resume.ts` |
| Link vocabulary | `src/data/projectLinks.ts` |

## Phase 2 Section 5 Cost Of Intelligence Deferral

| Item | Status |
|---|---|
| Decision | Deferred; do not add a standalone section after the constellation |
| Reason | A separate Cost section breaks the cinematic constellation flow and feels redundant |
| Future placement | Fold tradeoff controls into project panels later, likely as per-project evidence/tradeoff treatment |
| Data retained | Existing `sliderConfigs`, `sliderStore`, and `sliderResponse` fields remain for future panel integration |
| Removed | Standalone Cost section wiring and temporary Cost components |

## Phase 3 Interaction Backlog

| # | Item | Status | Notes |
|---|---|---|---|
| 1 | Custom cursor component | Implemented | Replaced temporary cursor with desktop/reduced-motion-safe `Default`, `Enter`, and `Refuse` states |
| 2 | Cursor interaction classes | Implemented | Buttons/links are detected by delegation; node hover sends scene cursor intent; refusal targets use `.cursor-refuse` |
| 3 | Node label wipe and hover treatment | Implemented | Hover labels now use a DOM-only wipe, gold scan hairline, and attached edge glint without changing layout |
| 4 | Node click camera lerp | Rejected | Trial felt worse than direct overlay open; keep node click immediate and avoid disturbing the stable scroll camera |
| 5 | Architecture panel motion | Implemented | Architecture boxes stagger and connector lines draw on panel enter |
| 6 | Proof metric motion | Implemented | Proof metrics count up on panel mount, then settle to exact source display with gold sweep |
| 7 | Boundary/refusal behavior | Implemented | Refusal cursor state and subtle boundary pulse are wired |
| 8 | Film-strip panel transitions | Implemented | Panels use a restrained side-wipe while existing keyboard/wheel/swipe navigation remains |
| 9 | Scroll milestone hue offsets | Implemented | Particle-only hue offset at 25% milestones; sky/nebula and camera are untouched |
| 10 | Evidence overlay entrances | Implemented | Evidence overlay header/body and About content fade/translate in lightly with reduced-motion fallback |
| 11 | Reduced-motion audit | Implemented | Boot/cursor/CSS motion already guarded; typewriter and proof counters now complete immediately under reduced motion |
| 12 | Phase 3 performance gate | Implemented | Typecheck/build/audit/diff-check pass; manual UX checks passed on user side; known Three.js chunk warning accepted |

## Phase 3 UI Decisions

| Item | Decision |
|---|---|
| EvidenceDataBar | Keep deferred/removed from the normal constellation route unless redesigned into a non-redundant overlay detail |
| Cost of Intelligence | Keep deferred as a future project-panel/tradeoff treatment, not a standalone post-constellation section |
| Phase 3 priority | Interactions first: cursor, film-strip motion, proof motion, refusal behavior |

## Phase 4 Step 1 Mobile Best-Experience Interstitial

| Item | Status |
|---|---|
| Scope | Mobile-only post-boot interstitial |
| Desktop path | Unchanged: boot completes directly into hero/top bar |
| Mobile path | Boot completes, then a 3s desktop-best-experience notice appears before hero |
| Plain mode | `?plain=1` skips boot and the notice |
| Reduced motion | Skips the notice and enters the page immediately |
| Visual treatment | CSS-only CRYO-GOLD field-mode notice with scan line, stars, and small constellation motif |

## Phase 4 Step 2 Mobile World Calibration

| Item | Status |
|---|---|
| Direction | Revised after visual review: do not reuse the desktop constellation scene on mobile |
| Mobile world | Added `MobileStarWorld.vue`, a portrait-first 2D canvas/CSS starfield behind the mobile flow |
| Desktop scene | `SceneRoot` no longer mounts below 768px, so project nodes/connectors/labels/raycast are removed from mobile |
| Star treatment | Strongly densified far micro-star layer, brighter cold pinpoints, rare cyan/gold bright points, subtle glints, scroll parallax, no project-node blobs |
| Reduced motion | Mobile star world renders one static frame and stops looping motion |
| Desktop impact | Desktop `SceneRoot`, nodes, connector hover, project overlays, and cursor path remain unchanged |

## Phase 4 Step 3 Mobile Evidence Rail Polish

| Item | Status |
|---|---|
| Scope | Mobile-only navigation polish for `EvidenceTopBar` |
| Desktop impact | Desktop top bar layout, centered actions, and right Resume placement unchanged |
| Mobile rail | Superseded; wrapped/horizontal pills were too bulky over the mobile starfield |
| Mobile drawer | Added compact hamburger trigger and right-side glass evidence drawer |
| Resume | Gold-accented drawer action on mobile |
| Brand | Keeps subtle `EVIDENCEBOUND / 9 SYSTEMS` signal at top-left |

## Phase 4 Step 4 Mobile Systems Index

| Item | Status |
|---|---|
| Scope | Mobile-only project entry layer over the dedicated star world |
| Data source | Reuses canonical `projects.ts` |
| Panels | No new panels; each card opens the existing 5-panel `ProjectOverlay` |
| Grouping | Personal Projects, Work Experience, Utility / Tooling; sorted by evidence weight |
| Card treatment | Glass evidence records with kind, weight, one-line proof, stack chips, and `open evidence ->` |
| Placement | Corrected to live over the fixed mobile star world instead of below it |
| Desktop impact | Desktop constellation and project overlay flow unchanged |

## Next Step

Phase 4 is in mobile execution. Next mobile work is project overlay touch polish, then footer dock/plain-mode completion.
