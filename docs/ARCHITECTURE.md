# Architecture

How EVIDENCEBOUND is built today, and the shape it is moving toward.

This document describes **current state as of the redesign baseline** (commit `09d2229`). It is deliberately factual rather than aspirational — the target architecture lives in `DESIGN.md` and `PLAN.md`. Where something is broken or dead, it says so, because a map that hides the potholes is worse than no map.

---

## 1. Stack

| Layer | Choice | Version | Notes |
|---|---|---|---|
| Framework | Vue | 3.5 | `<script setup>` SFCs throughout, no Options API |
| State | Pinia | 2.x | 4 stores, 1 entirely dead |
| 3D | Three.js | 0.165.0 | **Pinned.** Scene behavior depends on current API |
| 3D bindings | TresJS `@tresjs/core` | 4.3.1 | **Pinned.** Used for canvas/camera only |
| Post-FX | `postprocessing` | 6.38.0 | Used directly, not via a Tres wrapper |
| Animation | GSAP + ScrollTrigger | 3.x | Registered globally in `main.ts` |
| Styling | Tailwind CSS | 4.x | Via `@tailwindcss/vite`; config is a stub |
| Shaders | `vite-plugin-glsl` | 1.x | `.glsl` imported as strings |
| Build | Vite | 8.x | |
| Types | TypeScript | 6.x | `vue-tsc -b --noEmit` |
| Host | Vercel | — | Static SPA, project `parth-tiwari` |

There is **no router** and **no lint config**. There is no unit-test runner either, but `npm run shots` (Playwright, `scripts/shots.mjs`) is a real verification gate across five viewports. Navigation is entirely store-driven overlay state on a single page.

---

## 2. Entry and mode resolution

`src/main.ts` is 10 lines: import global CSS, register `ScrollTrigger`, mount `App` with Pinia. No error boundary, no Suspense, no hydration concerns.

`App.vue` resolves **four orthogonal flags** that together select the render tree:

| Flag | Source | Notes |
|---|---|---|
| `isPlain` | `?plain=1` via `usePlainMode()` | Module-level shared ref |
| `isMobileViewport` | `matchMedia('(max-width: 767px)')` | Live listener, re-branches on resize/rotate |
| `prefersReducedMotion` | `matchMedia('(prefers-reduced-motion: reduce)')` | Live listener |
| `isDebug` | `?debug=1` | Set in `onMounted` only, so never true on first paint |

Derived gate:

```
experienceReady = isPlain || (bootComplete && !showMobileNotice)
```

### Render tree

| Component | Condition | Location |
|---|---|---|
| `SceneRoot` (WebGL) | `!isPlain && !isMobileViewport` | `App.vue:113` |
| `MobileStarWorld` (Canvas2D) | `!isPlain && isMobileViewport` | `App.vue:114` |
| `BootSequence` | `!isPlain && !bootComplete` | `App.vue:116` |
| `MobileBestExperienceNotice` | mobile + not reduced-motion + not yet dismissed | `App.vue:122` |
| `HeroSection` | `experienceReady` | `App.vue:127` |
| `EvidenceTopBar` | `!isPlain && experienceReady` | `App.vue:132` |
| `PlainExperience` | `isPlain && experienceReady` | `App.vue:134` |
| `MobileSystemsIndex` + `MobileFooterDock` | mobile + ready + About closed | `App.vue:136-137` |
| `ProjectOverlay`, `EvidenceOverlay` | `!isPlain` — always mounted, self-gating | `App.vue:139-140` |
| `CustomCursor` | `!isPlain && !isMobileViewport` | `App.vue:218` |
| `.phase-zero-console` | `?debug=1` only | `App.vue:148-215` |

**The desktop/mobile switch is a component swap, not a shared abstraction.** Desktop gets a 400vh scroll-scrubbed WebGL section; mobile gets a fixed decorative canvas plus a DOM card list. The two paths share no scene code.

---

## 3. State

### `projectStore`
Wraps the static `projects` array plus `highlightedProjectIds`. `highlight()`/`clearHighlight()` have exactly one consumer (`CapabilityMap.vue`).

**Bypassed in practice.** Six modules import the raw `projects` array directly rather than going through the store: `SceneRoot`, `ConstellationNodes`, `ConnectorLines`, `ParticleField`, `MobileSystemsIndex`, `overlayReady`. The store adds no value over the import except the highlight list.

### `overlayStore`
`isOpen`, `activeProjectId`, `activePanelIndex`. Panel index clamped to `maxPanelIndex = 4`.

### `evidenceOverlayStore`
`activeKind` (`experience | training | capability | about | resume`); `isOpen` is computed from it.

### `sliderStore`
**Live since 2026-08-18.** `CostOfIntelligence.vue` in the Proof panel reads `sliderConfigs`
and writes through `setValue`. The dial deliberately refuses to interpolate: away from the
measured setting it withdraws the number rather than inventing one. `sliderResponse` remains
unread on purpose — see `CLAUDE.md`.

### Known state problems

1. **Two unrelated "an overlay is open" booleans.** Every consumer re-derives the union by hand — `SceneRoot.vue:41-45` does it three times with slightly different semantics. Nothing prevents both overlays being open at once.
2. **Body-scroll-lock implemented three times.** `useBodyScrollLock.ts` already refcounts; `ProjectOverlay` and `EvidenceOverlay` each carry an *additional* byte-identical private `hasScrollLock` flag and `setBodyScrollLock()` function.
3. **Escape handled in five places**, all as unconditional global `window` listeners that do not coordinate.
4. **`isOverlayReadyProject` is a tautology** — `overlayReady.ts:3` builds its ID list as `projects.map(p => p.id)`, so it returns `true` for every project, yet it is still branched on in three places as though it gates something.
5. **Panel count declared three times** with different semantics: `overlayStore.ts:4` (`maxPanelIndex = 4`), `FilmStrip.vue:47` (`filmStripPanelCount = 5`), and the panel array literal at `FilmStrip.vue:21-27`.

---

## 4. The 3D scene

### Composition

`SceneRoot.vue` owns everything. A `#constellation-section` of `h-[400vh]` provides scroll runway; a `sticky top-0 h-screen` child pins the viewport.

Inside `<TresCanvas>` (`antialias: false`, `dpr: [1, 1.25]`, `render-mode="always"`, ACES tone mapping):
`ScenePauseController` · `CameraPathController` · `CameraLight` · `IridescentBackground` · `ParticleField` · `RefusalRipple` · `ConstellationNodes` · `NodeMoons` · `PostProcessing` · `CameraAuthoring` (debug only)

Outside the canvas, as DOM/SVG overlays reading `tresContext`:
`ConnectorLines` · `NodeLabel` · a hardcoded legend

All in-canvas components use an **empty-template, imperative-Three-in-setup** pattern. TresJS's declarative layer is used only for the camera and ambient light.

### Camera

Scroll → GSAP ScrollTrigger → manual `camera.lookAt`.

`useCameraPath.ts` tweens a plain `{ value: 0 }` object with `scrub: 1.5`, sampling a `CatmullRomCurve3` through **5 hardcoded `Vector3`s**. The look-at target lerps between two hardcoded points via `smoothstep(progress, 0.48, 0.82)`.

`CameraPathController.vue` captures `camera.value` **once** in `onMounted` — if TresJS swaps the camera, the path silently detaches.

### ~~Four independent animation clocks~~ — two, as of 2026-08-18

This is the single most important structural fact about the scene:

| Clock | Owners |
|---|---|
| GSAP ScrollTrigger | camera path, particle hue milestones |
| TresJS `useLoop` | `ConstellationNodes`, `ParticleField`, `IridescentBackground`, `RefusalRipple`, `CameraLight`, `PostProcessing` |
| Raw `requestAnimationFrame` | `ConnectorLines`, `NodeLabel`, `CustomCursor`, `PanelProof` |
| Separate rAF | `MobileStarWorld` |

`ScenePauseController` pauses **only** the TresJS loop. The raw rAF loops keep re-scheduling regardless — they self-gate on a `paused` prop for *work*, but never stop the frame request.

There are also **two separate ScrollTriggers on the same element**, created in different files (`useCameraPath.ts` and `SceneRoot.vue:79-88`).

### Node positions — hand-placed, not derived

**Derived since 2026-08-18 (PLAN.md 3.1/3.3).** `src/data/layout.ts` computes every node's position, radius and orbital speed from the project record: orbital radius from maturity (`status` + whether a public link resolves), angle from `started` read clockwise, sphere radius from evidence depth (`weight` + metric/milestone/artifact counts), speed from recency, height from `origin`. `ConstellationNodeConfig` now holds only `relatedIds`, because a relationship between two projects is a judgement and nothing in the data implies it. `layoutFor()` throws on a miss rather than falling back to the origin — a silently-placed node is the meaningless decoration this replaced.

**Nothing about a star's position currently encodes anything true about the work.** This is the central thing the redesign changes — see `DESIGN.md`.

Visual radius *is* derived, but through **two overlapping size tables**: `radiusBySize` × `NODE_VISUAL_SCALE (0.48)`, then floored by a second `minimumVisibleRadiusBySize` table that exists purely to undo the 0.48 scale for small nodes.

### `ConstellationNodes.vue` — the heaviest file (478 lines)

Per project it builds **5 meshes + 1 light**: sphere body, halo plane, corona plane, glint plane, invisible raycast hit-sphere, and an optional `PointLight` whose intensity is a 4-deep nested ternary.

Three near-identical `ShaderMaterial` factories are defined **inline as template literals in the `.vue` file** rather than in `src/shaders/` — and all three share an identical vertex shader, copy-pasted three times.

`onUnmounted` disposes 5 geometries and 5 materials per node but **does not dispose or remove the `PointLight`s**.

### Interaction

`useNodeInteraction.ts` raycasts against the invisible hit-spheres only. Listeners attach to `window`, not the canvas. Pointer-move is throttled by skipping every other event.

Hover state is tracked **three ways simultaneously**: written onto `node.runtimeState`, emitted to `SceneRoot` as two separate refs (one of which is derivable from the other), then dispatched as a global `CustomEvent('evidence-cursor-intent')` consumed by `CustomCursor` — a window-level event bus with exactly one producer and one consumer.

### Overlays that aren't 3D

`ConnectorLines` and `NodeLabel` are **DOM/SVG overlays**, not scene objects. Both re-project world→screen every frame using a **verbatim-duplicated projection block**. `ConnectorLines` reallocates a fresh array of objects every frame, triggering full Vue reactivity per rAF — and does this for all pairs even though lines are only visible on hover.

---

## 5. Shaders

| File | Role | Assessment |
|---|---|---|
| `iridescent.*.glsl` | Sky dome (radius-90 `BackSide` sphere locked to camera) | Dense and good-looking, and the largest GPU cost in the app: 7 `triFbm` calls × 3 `fbm` × `SKY_OCTAVES`. **Quality-tiered since 2026-08-18** — 63 `noise()` evaluations per fragment at high, 42 at medium, 21 at low, injected as a define from `utils/qualityTier.ts`. Fewer octaves reads as a softer nebula rather than a missing one. |
| `particle.*.glsl` | Star field | The best-engineered shader here. Size/alpha/warmth tiers, diffraction spikes gated to rare bright stars, 4-stop color ramp, luma-preserving hue rotation. |
| `refusalRipple.*.glsl` | "Refusal" ring | **Effectively invisible** — output alpha multiplied by `0.004`, on an unconnected 30-second wall-clock timer. Not wired to any refusal, store, or interaction. |

**Inventory gap:** 3 of the 6 shader programs actually in the scene (halo, corona, glint) are not in `src/shaders/` — they live as inline template strings in `ConstellationNodes.vue:138-265`.

**~~Hard limit~~ — resolved 2026-08-17.** `particle.vert.glsl` used to declare `uniform float uClusterBrightness[9]` read via a 9-branch if-chain, and a tenth project broke it silently. It now sizes from a `CLUSTER_COUNT` define injected by `useParticleField.ts` from `projects.length`, with the lookup as a bounded loop — GLSL ES 1.0 forbids indexing by an arbitrary expression, but a for-loop index over a constant bound is a constant-index-expression. Verified in-browser at ten projects, and again at twelve. There is no project-count limit in the shader any more.

---

## 6. Mobile

`MobileStarWorld.vue` is a complete from-scratch Canvas 2D reimplementation sharing **zero code** with the desktop path.

Verbatim duplication between the two:

- **`seededRandom` is copy-pasted byte-for-byte** — `MobileStarWorld.vue:32-46` vs `useParticleField.ts:28-42`. Identical FNV-1a + xorshift, identical constants. Only the seed string differs.
- Star tiering, warmth assignment, and the color ramp are each re-derived with **different numbers** in a different color space.
- Diffraction spikes re-implemented with canvas strokes, duplicating what the fragment shader does per-pixel.
- `clamp` redefined locally (also redefined in `NodeLabel.vue`) despite `THREE.MathUtils.clamp` being available.

Mobile has no nodes, no hover, no connectors, no labels, no camera path, no bloom. Project data reaches mobile only through the DOM list in `MobileSystemsIndex`. The star world is `aria-hidden`, `pointer-events: none` — purely decorative.

`MobileSystemsIndex` sets `padding-top: 148vh`, so the first ~1.5 screens are empty starfield before any content appears.

### The 768–820px dead zone

`App.vue` switches at **767px**; `EvidenceTopBar` and `EvidenceOverlay` switch at **820px**. Between those values the desktop WebGL scene mounts *and* the nav is already in mobile hamburger mode, while neither `MobileSystemsIndex` nor `MobileFooterDock` render. Tablets land here.

---

## 7. Design tokens

`src/styles/tokens.css` defines 27 custom properties. `tailwind.config.ts` is a 5-line stub with **no theme extension**, so no token is reachable as a Tailwind utility — every usage in markup is the escape-hatch form `text-[color:var(--ice)]`.

**Tokens are declared but not trusted:**

| Token | Used via `var()` | Hardcoded as a literal |
|---|---|---|
| `--ice` | — | **35 times across 15 files** |
| `--bg-cyan` | 2 | **21 times** |
| `--gold-glow` | — | **11 times** |

**Dead tokens (zero uses):** `--bg-lift`, `--bg-bridge`, `--bg-nebula`, `--surface-glass`, `--surface-glass-hover`, `--teal-deep`, `--cold`.

**Used but undefined:** `--active-glow` (`cursor.css:25`), and `--font-mono` / `--font-display` / `--font-body` (referenced 5 times in `PlainExperience.vue`). These silently no-op — the plain/print route falls back to default system fonts.

**The legend lies.** `SceneRoot.vue:203-221` renders legend swatches using `var(--gold)`, `var(--teal-active)`, `var(--amber)`, `var(--utility)`. The actual stars use *different* hardcoded hexes in `ConstellationNodes.vue:94-122`. The dots do not match the stars they describe.

**`--bg` (`#010409`) is written out four times**: `tokens.css`, `SceneRoot.vue:108`, `index.html:17`, `MobileStarWorld.vue:255`.

### Typography

Role split (Spectral display / Geist Mono labels / Inter body) is applied consistently and reads well. The **scale is not**.

Six scale steps are declared in tokens, but there are **41 distinct ad-hoc `font-size: clamp(...)` declarations**, no two derived from a common ratio, plus 33 fixed sizes outside the token set (`MobileSystemsIndex.vue` alone has eight bespoke sizes). `HeroName` applies `.type-display` *and* overrides it with a near-but-not-equal local clamp.

---

## 8. Accessibility

### Present and genuinely good

- `role="dialog" aria-modal="true"` + programmatic focus on open, across all overlays
- Escape-to-close everywhere; arrow-key panel navigation
- Live regions on boot status, panel counter, capability readout
- `aria-label` on every icon button; decorative layers correctly `aria-hidden`
- Typed text announces the **full** string via `aria-label` rather than the partial
- **Reduced motion is genuinely respected** — 11 CSS blocks plus JS guards; boot skipped, typing skipped, star world static, count-ups jump to final
- `?plain=1` is a complete crawlable and printable route

### Missing

- **No focus trap in any dialog.** Tab from inside an overlay walks into the page behind it. No `inert` or `aria-hidden` on background content.
- **No focus restoration** — closing an overlay drops focus to `document.body`.
- **No skip link**, and no reachable `<h1>` in the live experience (the only `h1` sits inside a `pointer-events: none` layer).
- `outline: none` appears **14 times**, often with only a border-color shift as the focus signal.
- Film-strip tabs are plain buttons — no `role="tablist"`, no `aria-selected`.
- The drawer scrim is a focusable full-viewport `<button>` sitting in the tab order ahead of the panel.
- `CapabilityMap` chips **cannot be deselected on touch** — the only clear paths are `mouseleave` and `blur`.
- No `<noscript>`; without JS the page is an empty `#app`.
- Contrast unverified for `--ice-faint` on `--bg` at the many 0.54–0.66rem mono labels.

---

## 9. Content model

`src/data/projects.ts` (886 lines) is the single source of truth for 9 projects. Each carries: identity (`id`, `name`, `tagline`), taxonomy (`status`, `nodeKind`, `origin`, `weight`), `stack[]`, `links`, five `panels` (problem / architecture / proof / boundary implied by links), optional `artifacts[]`, and the 3D `node` block.

Supporting data: `about.ts`, `training.ts`, `capabilities.ts` (5 groups, 45 skills, with fuzzy stack matching), `socialLinks.ts`, `resume.ts` (Drive-backed), `projectLinks.ts` (link-card copy).

### Fields declared but never read

- `origin` — populated on all 9, read by nothing
- `sliderResponse` — on 5 of 12, still read by nothing, deliberately (3.8)
- `radialMetricId` — read by nothing
- `NodeRuntimeState.ringState` and `colorState` — computed and written every frame, read by nothing (there is no ring mesh)

### Content gap

**Only 3 of 9 projects have any populated `links`.** The other six render a "Pending verification" empty state — while several of those projects are deployed and publicly reachable on Vercel right now.

---

## 10. Build

`vite.config.ts` chunks `pinia` + `vue` as `vendor` and bundles `@tresjs/core` into the `three` chunk. **`postprocessing` is unchunked** and lands in the entry bundle.

There is no code-splitting by mode: the Three.js stack is in the graph regardless of whether the visitor is on mobile or in plain mode.

---

## 11. Dead code inventory

| Item | Status |
|---|---|
| `src/stores/sliderStore.ts` | Never imported |
| `overlayReadyProjectIds` export | Zero importers |
| `isOverlayReadyProject` | Constant-`true`; three dead branches |
| `CopiedToast` | Mounted with a literal `:show="false"` |
| `RefusalRipple` + 2 shaders | Renders at alpha ×0.004 on an unconnected timer |
| `GlassPanel`, `GeistChip`, `StatusBadge`, `MetricCountUp` | Reachable only via `?debug=1` |
| `.phase-bridge` / `.phase-zero-console` CSS | 88 lines serving the debug block only |
| 7 tokens | Zero uses |
| `ProjectOrigin` | Now load-bearing — drives node height in `layout.ts`. `NodeSize` deleted with 3.3. |

---

## 12. Target architecture

Direction, in brief. Detail lives in `DESIGN.md` and `PLAN.md`.

1. **One scene, all breakpoints.** Replace the desktop/mobile component swap with a single WebGL world whose camera choreography, density, and input model adapt. Mobile becomes touch-native, not degraded.
2. **Derived layout.** Node position, size, and orbital motion are computed from project data, not typed in by hand. Every visual property encodes something true.
3. **One clock.** A single frame loop owns the scene; scroll and time are inputs to it, not competing drivers.
4. **Tokens as the only source of color and scale**, reachable from Tailwind, with the 3D layer reading the same palette as the DOM.
5. **One overlay state machine** replacing two booleans, with focus trap, focus restoration, and scroll lock handled once.
6. ~~**Quality tiers as a first-class concept**~~ — **done 2026-08-18.** Sky shader, particle count, post-FX and DPR all scale from one detection in `utils/qualityTier.ts`.
7. **Lazy-load the 3D stack** so plain mode and first paint do not pay for it.
