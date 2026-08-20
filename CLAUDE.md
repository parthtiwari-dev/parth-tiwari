# CLAUDE.md

Working instructions for this repository. Read `docs/ARCHITECTURE.md` before touching the scene layer, and `docs/DESIGN.md` before touching anything visual.

---

## What this project is

A personal portfolio for Parth Tiwari, built as a navigable universe rather than a page of cards. Nine projects exist as objects in 3D space.

**It is a lead generator, not a CV.** The goal is paid client work at ₹50k–1L per project, with traffic arriving from cold outreach. Job offers are a real but secondary goal. When a decision trades off between impressing a recruiter and converting a client, **the client wins** — see `docs/PRD.md` §1 for why that ordering serves both.

The organising principle is stated in the site itself and governs code decisions too:

> Systems should act only after the evidence, schema, budget, and workflow state agree.

Practically, that means: **do not add a visual that does not encode something true.** A star's position, size, color, and motion each carry meaning. Decoration that pretends to be data is the specific failure mode this project exists to avoid.

### Two rules that follow from the commercial goal

**Never gate contact behind the experience.** A booking action stays one tap from every screen, at every breakpoint, in every mode. The universe impresses; it must never be the only route to hiring him.

**Show before telling.** A screenshot outranks a paragraph; a working demo outranks a screenshot. Projects open with a visual and an outcome — the problem/architecture/proof/boundary panels are the second layer, not the opening move.

---

## Commands

```bash
npm install          # from lockfile
npm run dev          # Vite dev server
npm run typecheck    # vue-tsc -b --noEmit
npm run build        # typecheck + production build
npm run preview      # serve the production build
npm run frames       # walk every scroll step and every panel, desktop + mobile
```

Before any commit that touches source:

```bash
npm run typecheck && npm run build && npm run budget
```

There is no unit-test runner and no linter configured. Type checking, a clean build and the bundle budget are the mandatory gates.

**`npm run budget` is not optional.** It reads `dist/` and fails if the eager entry chunk exceeds its gzip ceiling or if `WebGLRenderer` appears in it. The lazy-3D boundary has broken *twice*, silently, and neither break failed typecheck, failed the build, or showed up in a screenshot — the first was a `manualChunks` rule that made Rolldown preload the chunk anyway, the second was `data/layout.ts` importing `three` for `Vector3` while `ProjectIndex` statically imports `layoutFor()`, which put 796.96 kB in front of every visitor including `?plain=1`. A number is the only thing that catches this.

**The canvas must never take the vertical axis on touch.** `@tresjs/core` sets `touch-action: none` inline on its canvas, and this canvas is `sticky` at full height over the first four screens of the document — so that default meant **a phone could not scroll the page at all** (8.16). `SceneRoot` overrides it to `pan-y` with `!important`. Scroll is the guided tour and outranks everything; the horizontal axis is the orbit. `npm run nav` asserts a real CDP touch drag, because `window.scrollTo` and `mouse.wheel` both go around the code path that broke.

**`npm run nav` is the behaviour gate.** `scripts/nav-check.mjs` drives the real scene through the Phase 4 navigation contract — default mode, drag-to-free, resume tour, the three zoom scales, deep links, the comparison label, and the phone controls including touch-target size. A screenshot cannot prove any of that. Two defects passed typecheck, build *and* the viewport matrix and were caught only here. Run it after anything touching the camera, the rig, the overlay or the project index.

**`npm run frames` is the eyes gate.** `scripts/frames.mjs` walks the whole document scroll in even steps on desktop and mobile, then opens every project and every panel and drives a *real* `mouse.wheel` against the overlay, recording `scrollHeight`, `clientHeight`, `overflowY` and the `scrollTop` the gesture produced. It exists because six defects in Phase 8 were invisible to every other gate — a camera that flipped, a reveal framing four nodes of twelve, an overlay that could not scroll on desktop, labels printing through the wordmark. Run it before and after anything touching the camera, the scene or the overlay, and **look at the frames — all of them, not the ones that confirm the change**. It cannot see touch: it moves the page with `window.scrollTo`, so a canvas that refuses every touch gesture renders identically to one that does not (8.16). Phase 8 passed every gate and shipped three visible regressions, because the review read ten frames out of three hundred and they were the ten that showed the fixes working (8.14). The probe has to be a synthesised gesture: assigning `scrollTop` succeeds even when the defect is present, because the defect was Lenis cancelling the wheel event before the browser could act on it.

**`npm run labels` is the label gate.** `scripts/label-check.mjs` asserts the projection cull, the magnitude-and-distance decluttering, the name cap, occlusion fading rather than hiding, and that a card can actually be clicked. It caught a card drifting 26.8px per 500ms under the cursor on its first run.

**`npm run a11y` is the accessibility gate.** `scripts/a11y-check.mjs` tabs the real page at 390/800/1440 and asserts reachability, accessible names, focus indicators, the dialog contract, focus trap and restoration, WCAG AA contrast on every visible text node, and plain-mode content parity. It found twelve `outline: none` violations on its first run.

**`npm run perf` is the sustained-load gate.** Two minutes per tier, comparing the end of the run against the start. It skips the absolute frame-rate assertion when it detects software rendering — this runner has no GPU, and failing a build on a SwiftShader number would be reporting a fact about the CI box as a fact about the site.

**`npm run craft` covers the Phase 6 guarantees** that are not matters of taste — chiefly that `index.html`'s visibility guard still reveals the page when every JS request fails. Anything touching that guard, `main.ts`'s reveal call, or the idle autopilot should re-run it.

**`npm run shots` is the third.** Playwright captures `/` and `/?plain=1` at 390, 430, 800, 834 and 1440 with the right device scale factor and a touch pointer, reporting page errors per viewport. Run it before and after anything touching the scene, layout or shaders:

```bash
npm run dev &                       # or vite preview
node scripts/shots.mjs --tag before
# ...change...
node scripts/shots.mjs --tag after
```

800 is not padding — it is the documented 768–820 dead zone. The touch pointer is not either: `qualityTier.ts` branches on `(pointer: coarse)`, so a merely-narrow window takes the wrong branch and proves nothing.

**`npm run capture` re-shoots the live demos** into `public/media/` — stills at two widths plus a short silent recording, from the deployments listed in `scripts/capture-demos.mjs`. It re-verifies every URL is 200 and auth-free before it captures and refuses otherwise, which is the linking rule applied to screenshots: an image of a login wall, an error page, or a stranger's site is worse than no image. Re-run it when a demo's UI changes, and read the captures before trusting them into `projects.ts`.

Both harnesses launch Chromium through `scripts/browser.mjs`. Do not call `chromium.launch()` directly — it resolves a version-stable binary and, behind an egress proxy, passes the flags without which every navigation dies as `ERR_CONNECTION_RESET`. The reasoning is in that file.

---

## Hard constraints

**Do not upgrade `three` or `@tresjs/core`.** Both are pinned (`0.165.0` / `4.3.1`). The scene, shaders, and post-processing chain depend on current API behavior. If an upgrade becomes necessary, it is its own PR with a full visual QA pass — never a drive-by bump inside a feature change.

**`particle.vert.glsl` sizes `uClusterBrightness` from a `CLUSTER_COUNT` define**, injected by `useParticleField.ts` from `projects.length`. It used to be a literal `[9]` read through a hand-unrolled if-chain, which broke silently on the tenth project — the JS uniform array grew and the declaration did not. GLSL ES 1.0 forbids indexing by an arbitrary expression, but a for-loop index over a constant bound *is* a constant-index-expression, so the lookup is a bounded loop and the project count is no longer baked into the shader. Verified in-browser at ten projects. **Do not reintroduce a literal length here.**

**Never add a project link that is not confirmed public and safe.** Private repos, company endpoints, internal URLs, account data, and unreviewed deployments stay out. An empty links panel is correct behavior, not a bug to paper over.

**Never assume `<project>.vercel.app` is ours.** Short aliases are claimed globally. This has already bitten twice:

- `vivid.vercel.app` returns 200 and belongs to someone else; ours is `vivid-alpha.vercel.app`.
- **`parth-tiwari.vercel.app` is not ours either** — this very site lives at `parth-tiwari-1.vercel.app`. Every canonical, OG and JSON-LD URL pointed at the stranger's host until it was caught.

Always resolve the production alias from the Vercel project's `domains` array, confirm 200 without auth, and confirm ownership before linking.

**Never invent social proof.** No fabricated testimonials, no estimated metrics, no implied clients. The testimonial slot stays empty until a real quote exists. A site whose thesis is evidence cannot fake its own.

**The site URL lives in exactly one constant.** It feeds canonical, OG, Twitter, JSON-LD and the sitemap. `parthtiwari.com` is planned — do not scatter the URL across files again.

---

## Conventions

### Components
Vue 3 `<script setup lang="ts">` SFCs. Scoped styles. No Options API, no global component registration.

Scene components that drive Three.js imperatively use an **empty template** and do their work in `setup`. Keep that pattern — it is why the renderless controllers do not warn.

### Styling
All color and spacing comes from `src/styles/tokens.css`.

`--bg` is **`#000000`** as of 8.4 — pure black, not the old `#010409`. The empty sky measured `rgb(1, 4, 13)` in a capture of the shipped build, and a void that is twelve parts blue to one part red is a navy, not space. Anything floating in it only reads as light if the black is actually black.

`--ice-faint` is a **hairline** colour: 2.34:1 against `--bg`, which is fine for a 1px border and an AA failure for text. Faint *text* uses `--ice-quiet` (4.89:1). `npm run a11y` computes the real composited ratio for every visible text node and will catch a regression here. Do not hardcode a hex or rgba that a token already defines.

This was violated heavily — `--ice` as a raw literal, 35 times across 15 files. **Fixed; verified 0 occurrences on 2026-08-18.** Do not add new ones.

Tailwind's config carries no theme extension, so tokens are reached via the escape-hatch form: `text-[color:var(--ice)]`. If you extend the Tailwind theme to fix this, migrate call sites in the same change rather than leaving two idioms alive.

### The 3D layer must read the same palette as the DOM
Star colors are currently hardcoded hexes in `ConstellationNodes.vue` that do not match the legend swatches describing them. Any new scene color reads from tokens.

### Breakpoints
**Ten distinct thresholds exist as of 2026-08-18** — 320, 620, 640, 720, 760, 767, 768, 820, 900, 1040 — so the "do not add a tenth" rule has already been broken once and the count here was stale. Do not add an eleventh; consolidate instead. Use the shared breakpoint tokens; if the one you need does not exist, add it centrally rather than inline.

The 768–820px range is a known dead zone (desktop scene + mobile nav + no mobile content). Any responsive change must be checked at 800px.

### Motion
Every animation needs a `prefers-reduced-motion: reduce` path, and it must be a *real* fallback — final state shown immediately, not just a shorter duration. This is already done well across the codebase; keep the standard.

### Accessibility
New overlays need: `role="dialog"`, `aria-modal`, focus moved in on open, **focus trapped while open**, **focus restored to the trigger on close**, and Escape to dismiss. The first two exist today; the trap and restoration do not — do not ship a new overlay that repeats that gap.

**Nothing legible may sit behind an open overlay.** The panel is glass, and glass shows what is under it — the hero wordmark, the legend, the scale readout and the node labels all read straight through a project panel once the tint came down (8.14). They are hidden while any overlay is open, and anything new that renders over the canvas needs the same treatment. `backdrop-filter` is not a substitute: no blur radius small enough to leave a starfield looking like stars will touch 100px type.

**Do not set `outline` in a component at all.** `styles/focus.css` owns the focus ring for the whole app. Twelve components each set `outline: none` inside a combined `:hover, :focus-visible` rule and relied on a glow that, measured, several of them did not actually render — so the guarantee moved to one file (7.1). Add a glow on top if you like; do not take the ring away.

Any interaction reachable by hover must also be reachable, **and dismissable**, by touch. `CapabilityMap` used to fail this and is the worked example: hover previews, tap pins, tapping the pinned control releases it, and a visible Clear control exists for anyone who has neither hover nor a second tap in mind. Copy that shape rather than inventing a new one.

---

## Content

`src/data/projects.ts` is the single source of truth for the projects. Node metadata, panel copy, stack, links, and artifacts all live there. Prefer changing data over changing components.

Supporting data files: `about.ts`, `training.ts`, `capabilities.ts`, `socialLinks.ts`, `resume.ts`, `projectLinks.ts`, `services.ts`, `showcase.ts`.

**`images` and `video` are evidence, not decoration.** Both are captured from deployments confirmed public and auth-free by `scripts/capture-demos.mjs`, never mocked up, never taken from a prototype, and every `alt` and `caption` must describe what is actually in the frame. A project with no honest capture renders no Demo panel — `hasShowcase()` in `data/showcase.ts` decides, and an empty showcase would be exactly the decoration-pretending-to-be-data this project exists to avoid. Note that `images` counts toward `evidenceOf()` in `layout.ts`, so adding a capture legitimately grows that project's star.

**Never hardcode the project count in prose.** Every surface derives it from `projectStore.projectCount` — `EvidenceTopBar`, `MobileFooterDock`, `ProjectIndex`, `PlainExperience` and `BootSequence` all do this correctly now. There is no fixed number of projects anywhere in the codebase; keep it that way.

---

## Known dead code

~~`isOverlayReadyProject`, `CopiedToast`, `RefusalRipple`, `NodeRuntimeState.ringState`/`colorState`, and the tokens `--bg-bridge`, `--surface-glass`, `--surface-glass-hover`, `--teal-deep`.~~ **All deleted 2026-08-18** (PLAN 0.14, which had been ticked once without being done).

Still standing, and still fine:

- `GlassPanel`, `GeistChip`, `StatusBadge`, `MetricCountUp` — reachable only via `?debug=1`, which is a documented mode rather than dead code. `--cold` stays because `GeistChip` reads it.

~~**Used but undefined**: `--active-glow`, `--font-mono`, `--font-display`, `--font-body`.~~ **Fixed** — all four are defined in `tokens.css`; verified 2026-08-18.

**Dead as of 8.18:** the pairwise-comparison machinery — `navigationStore.previousProjectId`,
`NodeLabels`' `--comparison` label and eyebrow, and `syncFocusCentre`'s `PAIR_BIAS` /
`PAIR_MARGIN` framing. It is not deleted, and it is not reachable either. The ghost only ever
appeared *after* a panel closed, because a project can only be focused by opening one — so
"the previous subject stays labelled" and "the camera stays parked at SINGLE SYSTEM zoom on a
star you did not ask for" were the same behaviour seen from two sides. The exit contract won
(8.18). `nav-check` asserts the new contract instead of 4.6. Delete it or revive it
deliberately; do not wire a new path to it by accident.

**Revived 2026-08-18:** `sliderStore` and `sliderConfigs` now drive the Cost of Intelligence
control in the Proof panel (3.8). `sliderResponse` is still read by nothing, and that is
deliberate — it was meant to let the dial change a node's colour and size, but size encodes
evidence depth now (3.1) and a slider changing it would break an encoding the legend
explains. Leave it, or delete it, but do not wire it to the scene.

---

## Naming

The site is **EPHEMERIS**. `EVIDENCEBOUND` is retired.

Swept 2026-08-18: copy, metadata, scene-graph object names, the favicon's `aria-label` and glyph, and **`og.png`, which still read EVIDENCEBOUND** on the card every share and unfurl renders. Regenerate that card with `npm run og` (`scripts/og.mjs`) rather than editing a binary by hand — it went stale for months precisely because nobody could rebuild it.

The one deliberate survivor is `seededRandom('evidencebound-particles-hybrid')` in `useParticleField.ts`. It is a retired name but also the input that determines every ambient star's position; renaming it reshuffles the entire field. It carries a comment saying so.

An ephemeris is a table of computed positions of celestial bodies. The name states the design rule: positions are derived from data, never placed by hand.

---

## Routes and modes

There is no router. Three modes, all on `/`:

| Mode | Trigger | Purpose |
|---|---|---|
| Full | default | The universe |
| Plain | `?plain=1` | Static, crawlable, printable. No 3D, no animation. |
| Debug | `?debug=1` | Legacy console surface |

`?project=<id>` is orthogonal to all three: it restores that project's overlay and focuses its node (`useProjectDeepLink.ts`). It uses `replaceState`, never `pushState` — opening a panel is not navigation, and pushing history would make Back close an overlay instead of leaving the site. Unknown ids are ignored rather than opening an empty overlay, and the other parameters survive the rewrite.

**Plain mode must stay complete.** It is the accessibility and SEO backstop — every piece of content reachable in the full experience must also be reachable there. When you add content, add it to `PlainExperience.vue` too.

---

## Performance

The sky shader (`iridescent.frag.glsl`) is the largest GPU cost in the app: 7 `triFbm` calls, each running `fbm` three times, each looping `SKY_OCTAVES` times — 63 `noise()` evaluations per fragment at high tier, fullscreen, every frame.

**All quality decisions come from `src/utils/qualityTier.ts`.** One detection feeds particle count, DPR, sky octaves and whether post-FX mounts. Do not add a second capability check — that fragmentation is exactly what 2.4 removed. Anything added to the sky shader is a performance decision and should scale with `SKY_OCTAVES`.

`ConstellationNodes.vue`'s `onUnmounted` disposes geometries and materials **and removes the `PointLight`s from the graph** — the lights were the one thing it missed, and they have no GPU buffer to dispose but do hold a parent reference, so twelve of them survived every scene remount. Keep that call when editing the teardown.

`ConnectorLines` is **gone** (8.2). It drew `relatedIds` — a hand-typed judgement nothing on the page explained — as flat SVG hairlines pinned above the canvas, and its per-tick array reallocation went with it. `OrbitPaths.vue` replaces it: one `LineSegments` inside the rig, built once per scale mode, drawing the orbit each node actually travels. A ring is a measurement; a relationship was not.

**There are no lights in the scene, and adding one would do nothing.** Star bodies are matcaps generated in `utils/matcap.ts` from the same token as the legend swatch; halos, coronas, glints, particles, the sky, the centre star and its corona are shader materials; **moons are matcaps too** (8.6 — they were `MeshBasicMaterial`, which is unlit by definition, so ninety satellites rendered as 4.6px of flat colour). The thirteen lights that used to be here were the largest mid-tier GPU cost in the app (6.8). If a new object needs shading, give it a material that shades itself.

The matcap's `color` is **white**, scaled past 1 into the half-float buffer — that multiplier is where the old `emissiveIntensity` animation lives. Do not set it to the node colour: the hue is already in the texture and multiplying twice squares it.

**Labels are one component, not one per node.** `NodeLabels.vue` projects every node in a single tick callback and `data/labelLod.ts` decides the whole set at once — the five-name cap is a decision about the set and cannot be made a label at a time. A card only ever appears on intent (hover or focus), never from the derivation, and it freezes while the pointer is on it because stars orbit and a moving click target is not one. Occlusion is a raycast against `data/nodeMeshes.ts` that fades opacity; **never** the `NoBlending` hole-punch, which breaks under the bloom pass this scene runs.

**Labels step around DOM chrome** (8.12). The hero, the legend and the scale readout all lay out in the same screen coordinates the label projector does, and none of them knew about the others — three project names printed through "PARTH TIWARI" at 390px, and "Tathya" rendered under the constellation index in the reveal frame. `data/screenRegions.ts` lets a surface publish its box; the projector demotes an overlapping name to a dot, **never to nothing**, because the star is the invitation. Register a box for any new fixed panel over the canvas.

Anything readable stays real DOM. MSDF-in-WebGL text is not installed and adding it is an open decision (PLAN 5.5) — do not reach for it to solve occlusion, which is already solved.

**Navigation is two modes over one scene.** Guided (scroll drives the authored pose array) is the default arrival; free orbit is unlocked by the first drag, pinch or zoom-button press. `NavigationController.vue` is the **only** thing that writes the camera in either mode — they were never going to survive as two components, because both want the same transform and the handover has to be seamless within one frame.

Free mode **rotates the rig, not the camera** (DESIGN §4). Everything in constellation space hangs off one `<TresGroup>`; `data/sceneRig.ts` registers it and `toWorld()` is the only sanctioned way to convert a local node position to a world one. `NodeLabels` computes screen positions by hand and **must** go through it — skip it and every label detaches from its star the moment anyone drags.

**Guided mode is an orbit too, and must stay one** (8.1 / 4.9). `CAMERA_POSES` used to fly the camera *through* its own look-at point at 72% of the scroll — a 180° reversal in 8% of the runway that swept every star across the frame. The invariant when editing those poses: camera-to-target distance stays well clear of zero, measured along the interpolated curve and not just at the poses. It is 11.48 units today. `scripts/frames.mjs` is how you see a violation; nothing else will show it.

The orbit state in `useFreeOrbit.ts` is a deliberately non-reactive module singleton. Do not put it in a store and do not `computed()` over it: it changes every frame, and a computed over a plain object is evaluated once and never invalidates. The reactive copy the DOM reads is `navigationStore.distance`, pushed from the render loop only when it has actually moved.

**Two clocks, and that is the budget.** `gsap.ticker` steps Lenis, ScrollTrigger, `NodeLabels` and `useCharacterSplit`; the TresJS `useLoop` renders the scene and applies the camera. `MobileStarWorld`'s rAF went with the file (2.5), the DOM overlays moved onto the ticker (2.1), and the typewriter joined it in 8.11 — it was a self-re-arming `setTimeout` chain, which made its duration a function of how often the browser felt like running a timer and had the hero tagline taking **58 seconds** to finish.

**Do not add a third.** Anything needing a frame callback joins `gsap.ticker` — a raw `requestAnimationFrame` will drift against the scroll interpolation Lenis is doing on the ticker, and it will not stop when the scene pauses.

**The page is hidden until Vue mounts, with an 8-second failsafe** (`index.html` + `main.ts`, 6.1). If you change either half, keep the failsafe: hiding content behind JS means a script that never runs leaves a permanently blank page. `npm run craft` asserts this by aborting every JS request.

`ScenePauseController` is fed by `useSceneVisibility`, so the scene stops when the section is off-screen, the tab is hidden, or an overlay is open.

---

## Keeping the plan honest

**Tick items off `docs/PLAN.md` in the same commit that does the work.** Prefix the row with
`✅` (done), `🟡` (partial — say what is left in the row itself), or `⬜` (open), and rewrite
the row to describe what was actually built rather than what was proposed.

This is not bookkeeping. `docs/` is the only memory that survives a session, and a plan that
still describes finished work as pending is worse than no plan — the next session re-derives
a decision that was already made, or re-does work that already shipped. Three separate stale
claims in these docs (the nine-node shader cap, `beatmind` marked `deploy BLOCKED`, the
untiered sky shader) each cost real time before they were caught.

The same applies to the other docs: when a change makes a sentence in `ARCHITECTURE.md`,
`AUDIT.md`, `DESIGN.md` or `MEMORY.md` untrue, fix it in that commit. If a claim cannot be
verified, say so in the doc — an explicit "not verified on mobile" is worth more than
silence.

## Git

Work on feature branches. Commit messages are lowercase, imperative, prefixed by type (`feat:`, `fix:`, `polish:`, `docs:`, `chore:`) — match the existing history.

Do not open a pull request unless asked.

---

## Deployment

Vercel, project `parth-tiwari`, static SPA off `main`. `vercel.json` handles the SPA rewrite and asset cache headers. No environment variables are required.

Web Analytics is **half-wired**: `@vercel/analytics` is installed and `main.ts` calls `inject()` on every non-loopback host, but the dashboard toggle for the project is an owner action and is not confirmed on. Until it is, there is still no real usage data — treat assertions about "how people use the site" as untested.

The loopback skip is deliberate. `/_vercel/insights/script.js` is served by Vercel's edge and exists nowhere else, so injecting it under `vite preview` 404s on every route at every viewport and makes `npm run shots` cry wolf.
