# Audit

Findings against commit `09d2229`, the redesign baseline. Every item was verified against the running build or the source; nothing here is inferred.

Ordered by impact, not by area. Each finding names the file and line so it can be checked rather than trusted.

---

## Summary

The project's own `PROGRESS_AUDIT.md` closes with *"Coding is effectively complete for v1. Remaining work is content polish."* That is accurate about **features**, and inaccurate about **fitness**. Everything advertised is built and works. What was never done is the layer underneath: performance budgets, keyboard access, and the question of what the visitor actually pays to load.

The git history explains why precisely. Across 44 commits, roughly a third are visual re-tuning of the 3D scene, and **exactly one commit in the entire history mentions performance**. There is no commit touching tests, linting, CI, accessibility, or bundle size — and that is exactly where the defects are.

---

## Build health

`npm run typecheck` — **clean.** Zero errors, zero warnings.

`npm run build` — succeeds in 2.63s:

```
dist/index.html                    4.75 kB │ gzip:   1.29 kB
dist/assets/index.css            116.98 kB │ gzip:  19.90 kB
dist/assets/vendor.js              5.93 kB │ gzip:   2.78 kB
dist/assets/gsap.js              112.81 kB │ gzip:  44.34 kB
dist/assets/index.js             191.50 kB │ gzip:  57.41 kB
dist/assets/three.js             767.72 kB │ gzip: 208.31 kB
```

**1,078 kB raw JS / ~313 kB gzip**, plus 117 kB CSS.

| Payload | raw | gzip | share |
|---|---|---|---|
| three.js | ~666 kB | ~185 kB | **62% of all JS** |
| @tresjs/core | 101 kB | 39 kB | bundled into the `three` chunk |
| gsap | 113 kB | 44 kB | full core + ScrollTrigger, for 2 tweens |
| app code | ~105 kB | ~34 kB | |
| postprocessing | ~59 kB | ~18 kB | only 4 symbols used |
| `src/data/*` | 27 kB | 9 kB | mostly `projects.ts` |

`npm audit` — **4 high-severity vulnerabilities** (`brace-expansion`, `nanoid`, `postcss`, `vite 8.0.0–8.0.15`), all transitive dev-chain, all fixable with `npm audit fix`. `PROGRESS_AUDIT.md:331` claims "Pass, 0 vulnerabilities" — stale by ten weeks.

---

## Critical

### C1 — The entire 3D stack loads on every route, including plain mode and mobile

There are **zero dynamic imports** in `src/`. No `defineAsyncComponent`, no `<Suspense>`.

`App.vue:18` statically imports `SceneRoot`, which pulls `@tresjs/core` and `three`; `PostProcessing.vue:4` pulls `postprocessing`. `main.ts:3-4` imports GSAP at entry. The built `index.html` **modulepreloads every chunk**, including the 767 kB three.js bundle.

`v-if` gates *rendering*, not the import graph. Consequences:

- **`?plain=1` — the crawlable, printable, low-power route — downloads 767 kB of three.js and 113 kB of GSAP to render static text.**
- **Every phone downloads and parses three.js**, despite `MobileStarWorld` being pure Canvas2D and needing none of it.
- **Reduced-motion users get the full scene.** `App.vue:113` has no `prefersReducedMotion` term. `SceneRoot.vue:74` skips only the hue ScrollTrigger; camera path, bloom, particles, and the always-on render loop all still run.
- **Tablets execute it.** The mobile branch is `max-width: 767px`, so any device ≥768 CSS px — iPad, most Android tablets, low-power laptops — mounts the full WebGL scene with bloom, 10 dynamic lights, and up to 10,000 particles.

A single `defineAsyncComponent` behind the existing `v-if` recovers ~208 kB gzip for mobile and plain-mode visitors.

### C2 — Desktop keyboard and screen-reader users cannot open any project

`useNodeInteraction.ts:109-111` binds `pointermove` and `pointerdown` only. There is no keyboard path, no focusable proxy, no roving tabindex, and no visible list of projects on desktop.

`EvidenceTopBar` exposes Experience, Training, Capability, About, and Resume — **never projects**. `MobileSystemsIndex.vue:120` has real buttons, but it does not render above 767px.

**On desktop, the primary navigation of the site is unreachable without a mouse.** This is the most severe defect in the audit: it is a total content lockout for an entire class of visitor, and it affects the nine things the site exists to show.

### C3 — `MobileStarWorld` runs two render loops from mount

`onMounted:206` calls `resize()`, which at `:123` calls `render()` → schedules chain A. Then `:212` schedules chain B. **Two independent loops run from the first frame**, doubling all per-frame cost.

Every `resize` event (`:207`) spawns another chain; every `visibilitychange` → visible (`:200`) spawns another. `cancelAnimationFrame` at `:195`/`:217` can only cancel the most recent — the rest keep running against a detached canvas.

Each loop redraws 5,200–9,200 stars in Canvas2D with `globalCompositeOperation = 'lighter'` (forces read-modify-write blending across the whole canvas), and:

- `:52-62` builds a **template-literal rgba string per star per frame** — up to 9,200 allocations/frame, ~550k/sec of GC pressure
- `:162-168` calls `createRadialGradient()` **per glint star per frame**, plus an extra fill of radius `r*8`
- `:144-146` `beginPath`/`arc`/`fill` per star, no batching, no sprite cache

This is the mobile experience, on the devices least able to absorb it. A pre-rendered sprite atlas with `drawImage` would be roughly an order of magnitude cheaper.

---

## High

### H1 — `ConnectorLines` does 12 forced layout reads per frame to draw nothing

`:133` schedules `requestAnimationFrame` unconditionally — `props.paused` skips the work but never stops the loop.

Per frame: `:113` allocates a new array and 6 new objects and reassigns a `ref`, forcing a full Vue re-render of the `<svg>` at 60 fps; `:89` calls `getBoundingClientRect()` inside `projectNode()`, twice per pair → **12 forced layout reads per frame**. The rect is constant unless the canvas resizes.

All of it runs even though `v-show="line.visible && line.isActive"` (`:154`) means **nothing renders unless a node is hovered**.

### H2 — `NodeLabel` runs every frame while hidden

`:42`, `:50`, `:67` — three rAF re-arm points, loop never stops. `:41`/`:49` assign a **brand-new object** per frame while nothing is hovered, so ref identity changes and Vue re-evaluates dependents 60×/sec for a no-op. Another `getBoundingClientRect()` at `:46`.

### H3 — No focus trap or focus restoration in any modal

Four surfaces declare `role="dialog" aria-modal="true"`: `ProjectOverlay:177`, `EvidenceOverlay:127`, `EvidenceTopBar:150` (drawer), `MobileBestExperienceNotice:78`.

A search for `'Tab'`, `activeElement`, `focusable`, and `inert` across `src/` returns **nothing**. Tab escapes into the still-visible, still-interactive page behind the scrim. Background content is never `inert` or `aria-hidden`.

Focus moves *into* each dialog on open but is **never restored** to the trigger on close (`ProjectOverlay:147`, `EvidenceOverlay:101`) — keyboard users land back at document start.

The mobile drawer additionally declares `aria-modal` while applying **no body scroll lock**, unlike every other overlay.

### H4 — Uncancelled rAF leaks a ScrollTrigger

`SceneRoot.vue:78-88` schedules a `requestAnimationFrame` that is **not cancelled** in `onUnmounted` (`:91-93`). If the component unmounts within one frame of mount, the callback runs *after* `hueMilestoneTrigger?.kill()` — creating a ScrollTrigger that is never killed.

This is very reachable: `App.vue:113` toggles `SceneRoot` on any resize across 767px. Repeatable and unbounded.

### H5 — Crossing 767px destroys and recreates the WebGL context

`App.vue:113-114` unmounts `SceneRoot` on any resize or rotation across the breakpoint, destroying the entire WebGL context, all shaders, and the 10k-particle buffers — then rebuilding them on the way back. There is no debounce.

Browsers hard-cap live WebGL contexts at roughly 16. Repeated toggling risks `CONTEXT_LOST`.

### H6 — The 768–820px dead zone

`App.vue:25` switches at **767px**; `EvidenceTopBar.vue:7` and `EvidenceOverlay.vue:11` switch at **820px**.

Between them: the desktop WebGL scene mounts, the nav is already in mobile hamburger mode, and neither `MobileSystemsIndex` nor `MobileFooterDock` render. Tablets in portrait land squarely here.

---

## Medium

### M1 — GPU cost concentrated in three avoidable places

- **10 dynamic PointLights** (9 nodes at `ConstellationNodes.vue:311-313`, plus `CameraLight`). All node bodies use `MeshStandardMaterial`, so the PBR fragment shader loops over `NUM_POINT_LIGHTS=10` for **every fragment**. Single biggest mid-tier-GPU cost in the scene.
- **27 large additive transparent quads always drawn** — 3 per node (corona at `radius × 12`, halo `× 5.2`, glint `× 5.6`), all `depthWrite:false, depthTest:false, DoubleSide`. Their `discard` statements **defeat early-Z on tile-based mobile GPUs**.
- ~~**The sky shader** is not quality-tiered.~~ **Fixed 2026-08-18.** It runs 63 `noise()` evaluations per fragment at high tier, 42 at medium, 21 at low, driven by the same detection as particle count, DPR and post-FX.

Node spheres are `SphereGeometry(r, 48, 24)` — 2,304 triangles each for what render as near-points.

### M2 — The render loop never stops

`SceneRoot.vue:113` sets `render-mode="always"`. `@tresjs/core` has no `visibilitychange` or `IntersectionObserver` pausing (verified against `node_modules`).

`#constellation-section` is `400vh`, so once the visitor scrolls past, an **off-screen canvas keeps rendering bloom, particles, and 10 lights indefinitely**. `MobileStarWorld` at least handles `visibilitychange`; the desktop scene does not.

### M3 — Chunking rule never matches Vue

`vite.config.ts:29` tests `id.includes('node_modules/vue')`, which never matches `@vue/runtime-core`, `@vue/shared`, or `@vue/reactivity` — the scoped path is `node_modules/@vue/…`.

That is why `vendor` is an implausible 5.93 kB. The real Vue runtime (~60 kB) is buried in the app chunk and **gets cache-busted on every content edit**.

### M4 — Untracked timers fire after unmount

| File:line | Issue |
|---|---|
| `HeroTagline.vue:25` | `setTimeout(start, 100)` handle never stored or cleared |
| `AboutSignal.vue:27` | `setTimeout(start, 120)` untracked — and it kicks off an **~800-timer chain**. `AboutSignal` mounts/unmounts on every About open/close. |
| `useCameraPath.ts:56` | `requestAnimationFrame(() => ScrollTrigger.refresh())` not covered by `cleanup` |
| `useBootSequence.ts:75-82` | fade `gsap.to` tween not stored, not killed |

### M5 — `AboutSignal` types 800 characters at 0 ms/char

`AboutSignal.vue:13` passes `msPerChar: 0`, so the typewriter is effectively disabled — but the machinery still runs. `useCharacterSplit.ts:32-34` does one reactive string mutation and one `setTimeout` **per character**, ~800 times. Browsers clamp to ~4 ms, giving roughly **3.2 seconds of continuous re-rendering** to display text instantly.

### M6 — `matchMedia` constructed on every scroll event

`HeroSection.vue:25` calls `window.matchMedia('(max-width: 767px)')` **inside a computed that depends on `scrollY`**, so a fresh `MediaQueryList` is constructed on every scroll tick. It also never re-evaluates on resize, since nothing listens.

---

## Accessibility

The baseline is better than typical for this genre and deserves saying: every `@click` sits on a real `<button>`, all decorative SVGs are `aria-hidden`, all icon-only buttons have `aria-label`, every file with a button defines `:focus-visible`, there are no `<img>` tags to need alt text, and **reduced motion is genuinely honored** across 10 CSS blocks and 8 JS guards — with real fallbacks, not just shorter durations.

Violations beyond C2 and H3:

| # | Location | Issue |
|---|---|---|
| A1 | `SceneRoot.vue:104-116` | `<TresCanvas>` has no `aria-hidden`, no `role`, no text alternative, no fallback content — an unlabeled interactive canvas in the a11y tree. (`MobileStarWorld:228` and `ConnectorLines:147` do this correctly.) |
| A2 | `index.html` / `App.vue` | **No skip link**, with a 400vh canvas section first in DOM order. |
| A3 | `EvidenceTopBar.vue:113` | `aria-label="Open evidence navigation"` is static while `aria-expanded` flips. Announces "Open" when open. |
| A4 | `MobileFooterDock.vue:77`, `AboutSignal.vue:62` | `:href="disabled ? undefined : href"` — an `<a>` without `href` is not focusable and not exposed as a link; `aria-disabled` on it is meaningless. |
| A5 | `FilmStrip.vue:52-63` | Five panel tabs are plain buttons with only `class="is-active"`. No `role="tablist"/"tab"`, no `aria-selected`, no `aria-controls`. **Active panel is invisible to AT.** |
| A6 | `CapabilityMap.vue:75-78` | `@blur` clears before the readout can be read, and the `aria-live` region chatters on every arrow-key pass through ~40 chips. Touch users can select but never deselect. |
| A7 | `HeroTagline.vue:32`, `AboutSignal.vue:53` | `aria-label` on a `<p>` (generic role) is widely ignored by AT and duplicates the visible text. |
| A8 | `BootSequence.vue:35-41` | Full-screen `role="status"` blocks the page 2.2s without being a dialog or taking focus; skip button only appears after 500 ms. |
| A9 | `HeroSection.vue:102` | `hero-cue-pulse 2s infinite` has no reduced-motion guard. `EvidenceTopBar` transitions are also unguarded. |
| A10 | `EvidenceTopBar.vue:283` +13 others | `outline: none` appears **14 times**, often with only a border-color shift as replacement. |

Contrast is unverified anywhere. `--ice-faint` (`#2e4f5e`) on `--bg` (`#010409`) at 0.54–0.66rem mono sizes is the highest-risk combination, and `.evidence-top-bar__brand` additionally applies `opacity: 0.55`.

---

## SEO and delivery

Correct and worth keeping: full OG set with a real 1200×630 image and alt text, `summary_large_image`, canonical, favicon, a well-formed JSON-LD `@graph` with correct `@id` cross-references, `robots.txt` pointing at the sitemap, SPA rewrite, and `immutable` 1-year caching on `/assets/*`.

| # | Location | Issue |
|---|---|---|
| S1 | Site-wide | **SPA with no SSR or prerender.** The default route ships an empty `<div id="app">`; all content renders client-side after ~1 MB of JS. OG/Twitter tags are the only thing a non-JS crawler sees. |
| S2 | `public/sitemap.xml:5` | `<lastmod>2026-06-03</lastmod>` — ten weeks stale, and `changefreq weekly` contradicts it. |
| S3 | `index.html` throughout | **The canonical host was wrong, not just the trailing slash.** Every URL pointed at `parth-tiwari.vercel.app`, which is absent from the Vercel project's `domains` array and serves a different site. The real production alias is `parth-tiwari-1.vercel.app`. The site was declaring a stranger's page as the canonical home of its own content. Fixed, and the URL now lives in one constant. |
| S4 | `public/sitemap.xml` | `?plain=1` — explicitly described in-code as "the complete crawlable version" — is **not listed, has no canonical of its own, and is unreachable from any link in the UI**. The crawlable fallback is undiscoverable by crawlers and users alike. |
| S5 | `index.html:36-38` + `style.css:1-2` | Preconnects exist, but fonts load via **CSS `@import` inside the bundled stylesheet**. That is a render-blocking, serially-discovered chain — the browser must fetch 117 kB of CSS before it learns the font URLs. No `<link rel="preload">`. |
| S6 | `vercel.json` | **No security headers at all** — no `X-Content-Type-Options`, `Referrer-Policy`, `Strict-Transport-Security`, `Permissions-Policy`, or CSP. No cache header for `/`. |
| S7 | `index.html:12` | `<meta name="keywords">` — ignored by every major engine since ~2009. |
| S8 | `EvidenceTopBar.vue:105`, `MobileFooterDock.vue:100` | Hardcoded `"9 SYSTEMS"` and `"9 systems / public-safe evidence / 2026"` while `projectStore.projectCount` exists and is used correctly at `App.vue:118`. Will silently lie on the 10th project; the footer also hardcodes the year. |
| S9 | Vercel | **Web Analytics returns no data** — not enabled. There is no measurement behind any claim about how the site is used. |

---

## Content

**Only 3 of 9 projects have populated `links`** (`querypilot`, `upi-fraud`, `medrag`). The other six render a "Pending verification" empty state.

Meanwhile the Vercel account for this same team currently hosts live deployments named `oncoverse`, `vivid`, `stick-and-dot-app`, `beatmind`, `tathya`, and `support-core`. Several of the six projects showing "Pending verification" **are deployed and publicly reachable right now**.

This is the cheapest high-impact fix available: the site's entire thesis is evidence, and its strongest evidence is live and unlinked. Each URL still needs confirming as public-safe before it ships — but the confirming, not the building, is the remaining work.

---

## Documentation drift

`PROGRESS_AUDIT.md` (dated 2026-06-03) is a phase-by-phase build log. **Formally retired 2026-08-18** under PLAN 7.8 and now carries a header saying so; it is preserved as history, not as reference. Claims that no longer matched the code even then:

| Claim | Reality |
|---|---|
| `:331` "0 vulnerabilities" | 4 high |
| `:79` bloom `0.62 / 0.08 / 0.58` | `0.52 / 0.1 / 0.72` (`PostProcessing.vue:44-47`) |
| `:217` typewriter "18ms" | `8` in `HeroTagline`, `0` in `AboutSignal` |
| `:63` particles "84% ambient" vs `:148` "88%" | `0.88` (`useParticleField.ts:206`) |
| `:401` three.js "exceeds 500 kB — monitor later" | now 767 kB, eagerly preloaded on every route |
| `:407` Resume/About "disabled until content" | all enabled; `resume.ts:8` has a live Drive ID |

---

## What this means for the redesign

The audit does not argue for starting over. The content model, the panel system, the copy, and the reduced-motion discipline are all good and hard-won.

It argues that four structural decisions must change, and they are the same four the redesign was already going to make:

1. **Load what the visitor will actually use** — split the 3D stack behind a dynamic import (C1).
2. **One scene across all breakpoints** — removes the mount/unmount context churn (H5), the dead zone (H6), and the duplicated mobile renderer (C3) in a single move.
3. **Keyboard parity is not optional** — the DOM must carry a real, focusable representation of every project on every breakpoint (C2).
4. **One frame loop** — kills the per-frame layout thrash, the orphan chains, and the never-stopping off-screen render (H1, H2, C3, M2).
