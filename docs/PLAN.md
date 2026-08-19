# Plan

How the redesign gets built, in an order where the site is never broken and value lands early.

Read `DESIGN.md` first. This document is sequencing, not rationale.

---

## Sequencing principle

Three rules govern the order:

1. **Fix what is broken before building what is new.** Several defects in `AUDIT.md` (keyboard lockout, plain mode downloading 767 kB of Three.js, orphaned render loops) are cheap to fix and independently valuable. They ship first, without waiting for the universe.
2. **Revenue before rendering.** Screenshots, outcomes and a booking button are what convert a lead. The engine rewrite is invisible to a buyer. Phase 1.5 therefore lands *before* Phase 2, so the site starts earning while the universe is still being built.
3. **The engine before the art.** Camera-as-data, one clock, derived layout, and quality tiers are load-bearing. Building visual polish on the current four-clock, hand-placed foundation means building it twice.

Each phase ends with the site deployable. No phase leaves `main` in a worse state than it found it.

---

## Phase 0 — Foundations and quick wins

Independent of the redesign. Ships alone, immediately.

| # | Task | Source |
|---|---|---|
| ✅ 0.1 | Lazy-load the 3D stack behind `defineAsyncComponent` so `?plain=1` and mobile stop downloading Three.js | AUDIT C1 |
| ✅ 0.2 | Add a real, focusable DOM index of all nine projects on every breakpoint — fixes the desktop keyboard lockout | AUDIT C2 |
| ✅ 0.3 | Focus trap + focus restoration in all four modal surfaces | AUDIT H3 |
| ✅ 0.4 | Fix the double render loop in `MobileStarWorld` | AUDIT C3 |
| ✅ 0.5 | Stop `ConnectorLines` and `NodeLabel` re-allocating and reading layout every frame | AUDIT H1, H2 |
| ✅ 0.6 | Cancel the leaking rAF in `SceneRoot`; track the untracked timers in `HeroTagline`, `AboutSignal`, `useCameraPath` | AUDIT H4, M4 |
| ✅ 0.7 | Fix the `vendor` chunk rule so `@vue/*` scoped paths actually match | AUDIT M3 |
| ✅ 0.8 | `npm audit fix` — 4 high-severity transitive vulnerabilities. **Regressed and re-fixed 2026-08-18:** the same count was back (postcss path traversal, vite `server.fs.deny` bypass, launch-editor NTLM disclosure), all dev-only. `npm audit` now reports 0. `three` and `@tresjs/core` verified unmoved at 0.165.0 / 4.3.1 afterwards. | AUDIT |
| ✅ 0.9 | Define the missing CSS variables (`--font-mono`, `--font-display`, `--font-body`, `--active-glow`) | AUDIT |
| ✅ 0.10 | Add reduced-motion to the scene mount condition so it genuinely produces a static experience | AUDIT C1 |
| 🟡 0.11 | **Code side done 2026-08-18.** `@vercel/analytics` installed and `inject()` called from `main.ts` — the framework-agnostic entry, because there is no router here to hook. Skipped on loopback hosts: the insights script only exists on Vercel's edge, so injecting it locally made `vite preview` 404 on every route at every viewport and turned `npm run shots` into a harness reporting twenty errors it should ignore. **Still owner-blocked:** Web Analytics must also be enabled for the project in the Vercel dashboard, which cannot be done from the repo. Until that is on, every claim about how people use this site remains unmeasured. | AUDIT S9 |
| ✅ 0.12 | Fix canonical URL mismatch (trailing slash), stale `sitemap.xml` lastmod, and add `?plain=1` to the sitemap | AUDIT S2, S3, S4 |
| ✅ 0.13 | Add security headers to `vercel.json` | AUDIT S6 |
| ✅ 0.14 | **Actually done 2026-08-18**, having been ticked once without being done. Deleted: `data/overlayReady.ts` and `isOverlayReadyProject` with its three branching call sites (it always returned `true`, so `NodeLabel`'s `canOpen` prop and its `nodeKindLabel` fallback were dead too); `CopiedToast`; `RefusalRipple` and both its shaders, which mounted a per-frame loop callback and a transparent draw to render something invisible on an unconnected 30-second timer; `NodeRuntimeState.ringState` and `.colorState`, written at construction and read by nothing, plus the `ringByStatus` map and the `state` field feeding them. Tokens `--bg-bridge`, `--surface-glass`, `--surface-glass-hover`, `--teal-deep` removed. `--cold` kept — `GeistChip` genuinely reads it. `--bg-lift`, `--bg-nebula` and `--active-glow` all acquired real users. **Kept `sliderStore`** — revived in 3.8. | ARCHITECTURE §11 |

**Exit:** typecheck and build clean; keyboard can reach every project; plain mode ships no WebGL engine.

**Audited and closed out 2026-08-18.** Two rows here had been ticked without being done (0.11,
0.14) and one had silently regressed (0.8). All three are now accurate. Alongside them, the
smaller debts that had accumulated in `CLAUDE.md`'s known-issues list:

- **`og.png` still said EVIDENCEBOUND** — the retired brand, on the card every share, unfurl and
  search preview renders. Regenerated as EPHEMERIS by `scripts/og.mjs`, which exists precisely
  because a binary nobody can regenerate is a binary nobody updates. The favicon's `aria-label`
  and its `EB` glyph were stale for the same reason and are fixed.
- **`CapabilityMap` was a touch trap** — chips selected on tap and cleared only on `mouseleave`,
  which never fires on a phone, so the readout stuck on the first thing tapped and the
  constellation stayed highlighted with it. Hover now previews, tap pins, tapping the pinned chip
  releases, and there is a visible Clear control that a keyboard user gets too.
- **The `PointLight`s leaked** on every scene unmount — no GPU buffer to dispose, but twelve live
  scene-graph nodes kept their subtrees alive across `?plain=1` toggles and tier changes.
- A `cdn.jsdelivr.net` preconnect survived the Geist Mono self-hosting, and
  `CameraPose.activeNode` was a declared field no pose ever set.

---

## Phase 1 — Content honesty and rename

Small, high-leverage, mostly data rather than code.

| # | Task | State |
|---|---|---|
| ✅ 1.1 | Links resolved and verified. `vivid-alpha` and `www.beatmind.tech` linked. `support-core-nine` linked with its new node (1.4). **The Streamlit apps are deliberately NOT linked** — `upi-fraud-engine.streamlit.app` 303-redirects to `share.streamlit.io/-/auth/app`, so it fails the no-auth rule below; the same applies to the other hibernating Community Cloud apps. An empty links panel is correct behaviour. | done |
| ✅ 1.2 | Leave `stick-and-dot-app` unlinked (owner exclusion) and `oncoverse` unlinked (deploy `ERROR`) | done |
| ✅ 1.2a | ~~`beatmind` deploy `BLOCKED`~~ — **stale, corrected 2026-08-17.** Live on its own production domain (`www.beatmind.tech`, apex 308s to www) with production Clerk keys. Shipped as a node, linked. | done |
| ✅ 1.3 | `started: 'YYYY-MM'` added to every project and to the `Project` type. **Derived from each repo's first commit**, not owner recall — one verifiable rule applied uniformly beats ten remembered dates, and it is documented as such on the type. Surfaced as text in plain mode; the orbital-angle encoding lands in 3.1. | done |
| ✅ 1.4 | **Decided 2026-08-17 — both in.** `support-core`: a deployed streaming support agent built to a real company brief, the most commercially legible artifact in the set for the buyer in `PRD.md` §3. `tathya`: initially deferred on the argument that a civic tracker is not a capability the target buyer shops for — **that call was made without opening it and was wrong.** It is live and actively ingesting, with topics dated this month, a five-stage pipeline, a typed API, and a reader wired to real data with no mocks. *Alive* is rarer than *legible*, and a portfolio arguing for evidence should weight a running system above a marketable category. Both linked on their Vercel frontends; neither Render API is linked, because a free-tier endpoint with a 30–60s cold start is not a demo. | done |
| ✅ 1.5 | Rename EVIDENCEBOUND → EPHEMERIS. Copy, metadata and `package.json` done. **Two `seededRandom('evidencebound-…')` seeds are deliberately frozen** and now carry comments saying so — they are retired brand names but load-bearing values, and renaming them reshuffles the entire star field. | done |
| ✅ 1.6 | Project count derived from `projectStore.projectCount` everywhere — `EvidenceTopBar`, `MobileFooterDock`, `ProjectIndex`, `PlainExperience`, `BootSequence`. No literal count remains in prose or in the shader (see the `CLUSTER_COUNT` fix). | done |


**Verification rule for any link, now and later:** resolve the real production alias from the Vercel project (never assume `<name>.vercel.app` — that check would have shipped a stranger's site), confirm it returns 200 without auth, confirm it belongs to this account.

**Why this mattered disproportionately:** the site's entire argument is evidence, and it was showing "Pending verification" on projects that were deployed and reachable. That is now resolved in both directions — live work is linked, and work that only *looks* live (the hibernating Streamlit apps) is deliberately not, because a link that lands on an auth screen is a worse evidence failure than no link.

---

## Phase 1.5 — Proof and conversion

**The highest-commercial-value phase in the plan.** It is deliberately early, ahead of the engine rewrite, because it converts leads on the *current* site while the universe is still being built.

| # | Task | State |
|---|---|---|
| ✅ 1.5.1 | **Done 2026-08-18.** `scripts/capture-demos.mjs` captures desktop (1440, DSF 2) and phone (iPhone 13) stills plus a short silent screen recording of each live demo, into `public/media/`. Five targets: `beatmind`, `stick-and-dot` (Vivid), `support-core`, `tathya`, `querypilot`. Every URL is re-verified 200 and auth-free *at capture time* and refused otherwise — the same rule as linking, because a screenshot of a login wall is not evidence. JPEG q88 from Chromium rather than a new `sharp` dependency. |
| ✅ 1.5.2 | **Done 2026-08-18.** `images` and a new `video` field are populated for those five. Rendered by a new **Demo panel that opens the overlay** ahead of Problem (`PanelShowcase.vue`), conditional on real media existing — `data/showcase.ts` owns both `hasShowcase()` and the panel count, since `filmStripPanelCount` and the store's `maxPanelIndex` were two constants that would have disagreed. Video and stills are one ordered slide list: they were two branches with a thumbnail strip that rendered, highlighted and changed nothing whenever a project had both. |
| 🟡 1.5.3 | `outcome` field exists and renders in both modes, but only **3 of 12** projects have one (`beatmind`, `support-core`, `tathya`). **Owner-blocked, and deliberately so** — an outcome states what a system did and for whom, and inferring that from the architecture panels would be inventing a claim on a site whose entire argument is evidence. Nine lines outstanding. |
| ✅ 1.5.4 | Built in `ServicesBlock.vue` + `data/services.ts`, three ranked offers in outcome language, each naming the projects that prove it. **Mounted in the full experience 2026-08-18 — see the note below.** |
| ✅ 1.5.5 | `BookingCta.vue`, fixed, every breakpoint, every mode but plain. `IS_BOOKING_CONFIRMED` gates it so the button is never a broken promise. |
| 🟡 1.5.6 | `ContactPanel.vue` ships a `mailto:` form and no serverless endpoint, **deliberately**: it needs no backend, no third-party form service, and cannot silently drop a lead the way an unwired form would. Revisit only if volume justifies it. **Mounted in the full experience 2026-08-18.** |
| ✅ 1.5.7 | **Done 2026-08-18.** Email always visible; WhatsApp number supplied by the owner and live at `wa.me/917000181882`. `IS_WHATSAPP_CONFIGURED` still gates every affordance, so emptying the constant removes them cleanly rather than shipping a link to nowhere. |
| ✅ 1.5.8 | **Done 2026-08-18.** Owner-supplied photo, cropped 4:5 from the original 3264x2448 and served at two widths via `srcset`, in `AboutSignal` and in plain mode. Deliberately not a headshot: the buyer is hiring someone to build a thing, and the brief was creativity rather than professionalism. `alt` describes the frame, not the vibe. |
| ✅ 1.5.9 | Testimonial slot reserved and honestly empty in `ContactPanel.vue`. Stays that way until a real quote exists. |
| ✅ 1.5.10 | `config/site.ts` is the single constant, feeding canonical/OG/Twitter/JSON-LD/sitemap. `index.html` cannot import TS, so its 13 occurrences are enumerated in that file and must move with it. |

**The gap this phase actually had, found 2026-08-18.** 1.5.4 and 1.5.6 were built and then mounted
*only inside `PlainExperience.vue`*. So the site a lead lands on — the universe, at `/` — had no
services block and no contact panel at all, just the floating booking button. Every visitor who
did not think to append `?plain=1` got the least commercial version of a site whose stated purpose
is generating paid client work. `ConversionClose.vue` now mounts both in flow after the
constellation runway, where the scroll ends.

**Status 2026-08-18 — the code side of Phase 1.5 is closed.** Eight of ten done, two are
`🟡` for reasons no commit can clear: 1.5.3 needs nine outcome lines from the owner, and 0.11's
other half is a toggle in the Vercel dashboard. 1.5.6's `mailto:` is a deliberate stop, not an
omission.

**One live demo is broken, and this is owner homework.** `support-core-nine.vercel.app` loads, but
its backend at `support-core.onrender.com` returned nothing in 200s on three separate paths — not
a free-tier cold start, which resolves in 30–60s. A visitor who clicks that link can ask a question
and will watch "Lumi is typing…" forever. It is captured as its greeting state only, it has no
video (a recording would document a hang), and the capture script keeps the interaction hook
commented with why it is disabled. **Either restore the backend or drop the `liveUI` link** — a link
that hangs is a worse evidence failure than no link.

**Why before Phase 2:** the engine rewrite is invisible to a buyer. Screenshots, outcomes and a booking button are the entire difference between a site that generates leads and one that does not. If the project stalls after this phase, it has still paid for itself.

**No prices anywhere.** Every path leads to a conversation.

---

## Phase 2 — The engine

The load-bearing rewrite. Nothing visual changes for the visitor; everything downstream depends on it.

| # | Task | Source |
|---|---|---|
| ✅ 2.1 | **One clock — done 2026-08-18 (two named clocks, see the status note).** `useSceneVisibility.ts` stops the scene when the section scrolls out of view or the tab is hidden, via IntersectionObserver + `visibilitychange` — both event-driven, no polling. It previously rendered 10,000 particles, a 63-noise sky shader, ten lights and a bloom pass to paint frames nobody could see, four viewport-heights up the page. One signal now gates the TresJS loop *and* `ConnectorLines`, which reallocates an array every frame. **Completed 2026-08-18:** `ConnectorLines` and `NodeLabel` moved onto `gsap.ticker`, which also steps Lenis and ScrollTrigger. `ConnectorLines` previously self-scheduled a rAF and early-returned while paused, keeping a frame callback alive all session doing nothing; paused now means not called. Two clocks remain by design — the ticker, and the TresJS render loop that owns the camera. `CustomCursor` and `PanelProof` keep their own rAFs deliberately: both are event-driven and self-terminating, not continuous loops. | DESIGN §8 |
| ✅ 2.2 | **Done 2026-08-18.** `data/cameraPath.ts` holds `CameraPose[]` — `at`, `position`, `target`, optional `activeNode`. It was five positions in one array, two look-at points in another, and a hardcoded `smoothstep(0.48, 0.82)` deciding the turn; adding a stop meant editing three places. `useCameraPath` now only advances a plain non-reactive `{ value }` on scroll, and `CameraPathController` samples it **once per rendered frame** and applies it — previously GSAP's `onUpdate` wrote the camera on the scroll event's schedule, so a scroll burst moved the camera several times between painted frames and a paused loop still paid for it. Targets lerp between adjacent poses (a curve through look-at points overshoots and reads as glancing away); `sampleCameraPath` writes into preallocated vectors, no per-frame garbage. | DESIGN §4 |
| ✅ 2.3 | **Done 2026-08-18.** `useSmoothScroll.ts`. The reason is not the easing: native wheel scroll on Windows arrives in ~100px jumps, the camera is scrubbed against scroll position, so the camera moved in those same steps and `scrub: 1.5` was hiding it. Interpolated scroll gives the scrub a continuous input. Lenis is stepped from `gsap.ticker` rather than its own rAF, so it did not become a third clock, and `lagSmoothing(0)` is required — GSAP's default fabricates a time jump after a slow frame, which desynchronises Lenis from the tween reading it. No-op under `prefers-reduced-motion`; `syncTouch: false` because touch devices already interpolate in the compositor. | DESIGN §4 |
| ✅ 2.4 | **Quality tier system — done 2026-08-18.** `utils/qualityTier.ts` detects once and feeds all four knobs: particle count (10k/5k/2k), DPR (`[1,1.25]`/`[1,1.1]`/`[1,1]`), sky-shader octaves via a `SKY_OCTAVES` define (3/2/1 → 63/42/21 `noise()` calls per fragment), and whether bloom mounts at all. Replaces three disagreeing decisions and one that was never made. `prefers-reduced-motion` forces low — a stated preference, not a capability guess. Handsets are detected by coarse pointer + narrow viewport rather than core count, because mid-range phones report 8 cores and then thermally throttle. | DESIGN §8 |
| ✅ 2.5 | **One scene across all breakpoints — done 2026-08-18.** `MobileStarWorld.vue` deleted (383 lines); `showDesktopScene`/`showMobileScene` collapsed to one `showScene`. 2.4 was the enabler: the reason a separate 2D mobile scene existed was that the WebGL one was too expensive for a phone, and the tier now runs it at 2,000 particles / DPR 1 / 1 sky octave / no bloom. A cheaper version of the real thing beats a second thing that only resembles it. Kills the 768–820px dead zone, the WebGL context churn on resize, and one of the four animation clocks. **⚠️ Not verified on a real mobile viewport — see the note under this table.** | DESIGN §9 |
| ✅ 2.6 | **Tokens as single source of truth** for DOM and WebGL. **Node colours done 2026-08-17** — `--node-personal/work/build/utility` added to `tokens.css`; `ConstellationNodes` resolves them via `utils/cssTokens.ts` with the tuned hex as fallback, and the legend swatches in `SceneRoot` read the same four. This fixed a real correctness bug: three of four swatches named a colour their star was not. Values were *promoted upward* from the scene rather than reconciled downward, so the emissive tuning is unchanged and there is no visual regression. **Completed 2026-08-18:** a Tailwind v4 `@theme` block in `style.css` maps every token to a utility name, each entry a `var()` reference so `bg-bg` and `var(--bg)` cannot drift. All 28 escape-hatch usages (`text-[color:var(--ice)]`) migrated to `text-ice`. The point is failure mode: a misspelled custom property resolves to nothing and renders an inherited colour silently, whereas a misspelled utility fails the build. | ARCHITECTURE §7 |
| ✅ 2.7 | **Done 2026-08-18.** `useScrollRunway.ts` resolves the constellation track in pixels and holds it stable across the resizes mobile browser chrome causes: a height change under 160px with the width unchanged is chrome and is ignored; a width change or a rotation re-measures. As `400vh` the track silently changed length mid-scroll and ScrollTrigger's `end: 'bottom bottom'` moved with it. The two remaining `vh` runways are behind `?debug=1`. | DESIGN §9 |
| ✅ 2.8 | **Done 2026-08-18.** `CameraAuthoring.vue`, `?debug=1` only. Scrub progress, read the sampled position/target back live, copy the whole `CAMERA_POSES` array as source. Only worth building because 2.2 made poses data — there was nothing a GUI could write back to two disconnected constant arrays. Verified code-split: Tweakpane is a 148 kB chunk reached through a 1.6 kB async component, absent from the production entry. Re-check that after any change here. | DESIGN §4 |
| ✅ 2.9 | **Done 2026-08-18.** Two fixes. **Mutual exclusion:** `overlayStore.open()` and `evidenceOverlayStore.open()` now close each other — nothing enforced this, so a project overlay could open on top of an evidence overlay leaving two dialogs stacked and two scroll locks held. **One Escape:** `useEscapeStack.ts` is a LIFO registry with a single capture-phase listener, replacing five independent `keydown` handlers that all fired at once and closed everything, in mount order rather than in the order the user opened things. The boot sequence stays out — its Escape means "skip", not "dismiss". Scroll lock was already correctly refcounted and was left alone. | ARCHITECTURE §3 |

**Exit:** visually equivalent to today, running on one clock, one scene, derived tokens, at ≥ current frame rate on every tier.

**Status 2026-08-18 — Phase 2 complete. All nine items done.**

Exit criterion was "visually equivalent to today, running on one clock, one scene, derived
tokens, at ≥ current frame rate on every tier." Met, with one honest amendment: **two**
clocks, not one — `gsap.ticker` and the TresJS render loop. Merging those would mean
reaching inside `@tresjs/core`, which is pinned and which the repo forbids upgrading. Two
named clocks with a written rule against a third is the achievable version.

Visual equivalence verified by `npm run shots --tag before` / `--tag after` across five
viewports and two routes: no page errors anywhere, desktop frame identical.

New dependencies, all deliberate: `lenis` (runtime, 2.3), `playwright` + `tweakpane` +
`@tweakpane/core` (dev only). `CLAUDE.md` said to ask before adding dependencies; this was
asked for as "complete the full phase 2", which is what these implement.

### Verification now exists

`npm run shots` (`scripts/shots.mjs`, Playwright) captures `/` and `/?plain=1` at 390, 430,
**800**, 834 and 1440 with correct device scale factor and a touch pointer, and reports any
page error or failed request per viewport. The 800 entry is the documented 768–820 dead
zone. The touch pointer matters specifically because `qualityTier.ts` branches on
`(pointer: coarse)`, so a merely-narrow desktop window would take the wrong branch and prove
nothing.

This closes the gap that blocked the rest of the phase. The earlier warning — that
`resize_window` moved the OS window without changing the captured viewport, and Chrome on
Windows will not go below ~500px — is resolved: **2.5 is now verified at a real 390px
viewport**, and the dead zone at 800px renders the full scene with no mobile navigation
overlapping it.

**Found while verifying, pre-existing, not yet fixed:** at 390px the `ProjectIndex` rail
(bottom-left, `bottom: 5.5rem`) overlaps the hero sub-line by a few pixels. It predates all
of this — the rail has been on every breakpoint since 0.2 — but it is on the buyer's device,
so it belongs in Phase 6 craft rather than being forgotten.

> ⚠️ **2.5 is unverified on a real mobile viewport.** `resize_window` via the browser
> tooling moves the OS window but does not change the captured viewport, and Chrome on
> Windows will not go below ~500px wide, so the narrow-width render was never actually
> exercised. Typecheck and build are clean and the desktop scene is unchanged, but the
> change most needing a phone is the one that could not be tested on one. **Check by hand
> before pushing:** DevTools device toolbar at 390px, and the 768–820px band, looking for
> the scene mounting at all, frame rate, and whether the mobile nav still sits correctly
> over it.
>
> The remaining open items (2.1 one clock, 2.2 camera as data, 2.3 Lenis) are the parts of
> this phase that most need that same verification, which is why they were not attempted
> blind.

---

## Phase 3 — Derived layout

Where the universe starts meaning something.

| # | Task |
|---|---|
| ✅ 3.1 | **Done 2026-08-18.** `data/layout.ts`. Radius from maturity (`status` + whether a public link resolves — a live link is the difference between a claim and something a stranger can open, so `oncoverse`, which has never deployed, correctly stays at the rim). Angle from `started`, evenly spaced rather than time-proportional, because real gaps are wildly uneven and would bunch eight projects into one arc. Sphere radius from evidence depth, with receipt counts capped so a project cannot inflate itself by listing more bullets. Speed from recency. Height from `origin`. |
| ✅ 3.2 | **Done 2026-08-18.** Nodes orbit; motion means attention, so an active project visibly moves and a dormant one is nearly still. `data/nodeMotion.ts` is the single owner of current positions — without it the meshes, label projector, connector projector and particle field each recompute independently, drift by a frame, and labels detach from their stars. Aura particles orbit **in the vertex shader**: positions upload once and the CPU sends twelve `vec3` deltas per frame instead of rewriting 10,000 positions. Rigid translation rather than rotating each particle about the origin, because a particle outside its node sweeps a wider arc and the aura shears off within a minute. Verified by capturing the scene 20 s apart. |
| ✅ 3.3 | **Done 2026-08-18.** All twelve coordinate triples and `size` values deleted, `NodeSize` removed from the type, `ConstellationNodeConfig` reduced to `relatedIds`. Five consumers repointed at `layoutFor()`: `ConstellationNodes`, `NodeLabel`, `ConnectorLines`, `useParticleField` (×2 — clearance and aura placement). |
| ✅ 3.4 | **Done 2026-08-17**, ahead of the phase — it was blocking BeatMind from shipping as a node. `CLUSTER_COUNT` define + bounded loop; verified in-browser at ten, then twelve. |
| ✅ 3.5 | **Done 2026-08-18.** `NodeMoons.vue`. Up to six stack entries orbit each project, and **hue is hashed from the technology name**, so Next.js is the same blue around BeatMind, Tathya, Stick and Dot and Spur Chat — the recurrence is what makes a stack legible as a fact about the whole body of work rather than a list repeated twelve times. Orbital phase is hashed too, so a shared technology sits at a consistent point in each parent's ring. One `InstancedMesh` for ~90 satellites; at that count the draw-call difference is the entire cost of the feature. Off on the low tier, where the budget is better spent keeping the nodes smooth. |
| ✅ 3.6 | **Done 2026-08-18.** `layout.ts` derives both; a `scaleModeStore` keeps the scene, labels, connectors and particle field in agreement, because a disagreement here shows as labels floating off their nodes. Schematic evens the spacing and compresses radius; true spaces by elapsed months and lets radius spread by raw maturity. True looks worse — eight of twelve projects started within five months of each other — and shipping both with the mode disclosed in the legend is the only version that keeps faith with the thesis. `restack()` translates each aura particle by its cluster's delta rather than re-randomising, so a node keeps the same halo across the toggle. |
| ✅ 3.7 | **Done 2026-08-18.** `ProjectIndex` is ordered by derived magnitude (evidence 0.65 + maturity 0.35) instead of by `weight` alone, so the rail and the scene agree about what matters. `weight` was judgement with no receipts; magnitude folds in maturity and what can be proven, so a flagship with an empty proof panel ranks below a major one that shipped with metrics. |
| ✅ 3.8 | **Done 2026-08-18, with one deliberate inversion.** The configs hold one measured value, not a curve, so a slider that recomputed a number as you drag would be fabricating metrics — the thing `CLAUDE.md` forbids and the thing this site argues against. **So it refuses.** At the measured setting it shows the real figure; move away and it withdraws to "not measured here" and says why. `sliderResponse`'s effect on node colour and size is deliberately *not* wired: size encodes evidence depth now (3.1), and a slider changing it would break an encoding the legend explains. |

**Exit:** adding a project requires adding a data record and nothing else.

**Status 2026-08-18 — Phase 3 complete. All eight items done.**

Exit criterion — "adding a project requires adding a data record and nothing else" — met and
then some: a new record now also gets an orbit, a size, a place in the index ordering, its
own moons, and a position in both scale modes, without touching a line of scene code. A new project needs
a record in `projects.ts`; position, size and speed follow from it, and the shader no longer
has a project-count limit.

**Audited 2026-08-18, independently of the commits that claimed it.** All eight items verified
against the code rather than the doc: `layout.ts` derives every axis, no coordinate triples
survive in `projects.ts`, `nodeMotion.ts` is the sole owner of live positions, `NodeMoons.vue`
hashes hue from technology name, `scaleModeStore` keeps four layers in agreement, `ProjectIndex`
sorts by derived magnitude, and the Cost of Intelligence dial refuses off-measurement. The
sentence that used to sit here — "3.2, 3.5, 3.6, 3.7 and 3.8 remain" — was left over from an
earlier commit and directly contradicted the line above it. Exactly the stale claim this
document warns about.

**A production bug the harness caught, unrelated to this phase.** Teaching
`scripts/shots.mjs` to report failing request *URLs* rather than "Failed to load resource"
surfaced `ERR_BLOCKED_BY_ORB` on the Geist Mono stylesheet — an `@import` to a jsDelivr path
that **does not exist**. The package ships woff2 files but no `style.css` there, jsDelivr
answered 404 as `text/plain` with `nosniff`, and Chrome blocked it. Geist Mono had therefore
*never* loaded: every mono label, the legend, the overlay eyebrows and the boot sequence
were silently rendering in a fallback. Now self-hosted from `public/fonts/`, because the
typography is load-bearing identity and should not depend on a third party being reachable.

**A regression this phase caused, found in the same audit and fixed.** `layout.ts` imported
`three` for `Vector3` and three `MathUtils` helpers. `ProjectIndex` reads `layoutFor()` to order
the rail and is a *static* import in `App.vue`, so that one import pulled the entire engine out
of the lazy scene chunk and into the eager entry: **796.96 kB, 212.19 kB gzip, before first
paint, for every visitor including `?plain=1`** — the precise guarantee 0.1 exists to make.
`layout.ts` now exports a plain `Vec3` and imports nothing; `nodeMotion.ts` wraps resting
positions into real vectors at the scene boundary. Entry chunk 796.96 kB → 130.82 kB. This was
the *second* silent break of that boundary, so `npm run budget` (`scripts/budget.mjs`) now
asserts the entry's gzip size and that `WebGLRenderer` is absent from it, and exits non-zero
otherwise. Negative-tested by reintroducing the import.

**One thing the derivation exposed:** the hand-typed coordinates had been doing *framing*,
not just placement — everything was clustered stage-right so the hero wordmark stayed clear.
With positions derived from data that stopped being true and nodes landed on the type. Fixed
in the camera rather than by biasing the layout: pose 0 now looks left of centre. The layout
encodes the data; the camera decides the shot. Verified at all five viewports.

---

## Phase 4 — Navigation

| # | Task |
|---|---|
| ✅ 4.1 | **Done 2026-08-18** (largely by 2.2/2.3 — this phase inherited it and verified it). Scroll drives the scripted path and it is still the default arrival: nothing about free mode is reachable until the visitor asks for it. |
| ✅ 4.2 | **Done 2026-08-18.** Drag to orbit, pinch to zoom, and the first manipulation flips the mode — no modal, no picker (DESIGN §3). A drag only counts past 4px, or every tap on a node would register as a one-pixel orbit and eat the click. **Plain wheel is deliberately left alone:** it is the guided path's only input, and hijacking it would break the tour for every mouse user who never intended to leave it, so wheel-zoom is `ctrl`+wheel — the trackpad pinch gesture. "Resume tour" appears only once there is a tour to resume. |
| ✅ 4.3 | **Done 2026-08-18.** Free mode rotates the rig, not the camera: the camera stays on +z looking at the origin, so orbiting costs two Euler angles instead of a second camera to reconcile with the scripted one. Zoom moves distance *and* narrows FOV. Both live in `useFreeOrbit.ts`, deliberately non-reactive. |
| ✅ 4.4 | **Done 2026-08-18, for a different reason than the plan gave.** The rig re-centres on the focused node so orbiting pivots around the subject rather than the origin it happens to be 13 units from. DESIGN §4 frames this as a float-precision fix inherited from 100,000 Stars, where one unit is a light year — **that reason does not apply at this scale and the code says so.** The constellation spans ~34 units; float32 resolves that to ~4e-6 units and there is nothing to drift. The interaction reason is real and independent, so the behaviour ships and the false rationale does not. |
| ✅ 4.5 | **Done 2026-08-18.** Galaxy → system → project, as distances of 22 / 13 / 6. `22` is not a round number: it is where `CAMERA_POSES[0]` actually sits (21.3 units from its target). The first pass used 30, which put the arrival shot below its own galaxy threshold — the readout said "neighbourhood" over a shot of the whole constellation, and the first zoom press skipped a scale. The label is derived from live distance in both modes, so it cannot disagree with the camera. |
| ✅ 4.6 | **Done 2026-08-18.** The previously-focused project keeps a quiet "Previously" label and the framing opens until both fit. Framing is computed from the geometry — centre biased 35% toward the predecessor, distance solved from the half-extent and the current FOV — because the first version guessed a multiple of the separation, under-shot, and left the ghost card clamped to the bottom of the screen with its star below the viewport. The ghost label also refuses to clamp: off screen means not shown, since a card pinned to an edge pointing at nothing is worse than no card. |
| ✅ 4.7 | **Done 2026-08-18.** `?project=<id>`, via `history.replaceState` rather than a router — one query parameter does not justify the dependency. **`replaceState`, not `pushState`:** opening a project is not navigation, and pushing history would make Back close an overlay instead of leaving the site, which would trap someone who arrived from a cold-outreach link. Unknown ids are ignored rather than opening an empty overlay, and `?plain=1` / `?debug=1` survive the rewrite. |
| ✅ 4.8 | **Done 2026-08-18.** Zoom in / zoom out / resume tour as real buttons at 44px, on every breakpoint, keyboard-reachable and labelled — gestures alone assume a visitor who already expects them. They step between the three named scales rather than nudging, so every press lands somewhere the readout can describe. On phones the cluster is a row above the booking dock: booking is never the thing that moves. |
| ✅ 4.9 | **Done 2026-08-19 (Phase 8).** Two defects in one array. The path **flew through its own look-at point** — between 70% and 78% of the scroll the z component of the look direction went from -0.51 to +0.76 with the camera 2.06 units from its target, a 180° reversal in 8% of the runway that swept every star across the frame and re-landed it. The path is an orbit now: target at the origin, camera arcing around it, so the direction rotates continuously by construction. Closest approach along the interpolated curve is **11.48 units**, sharpest turn **1.83°** per quarter-percent. And the **reveal framed four nodes of twelve**, because the final pose sat at z = -7.2, inside a ring of outer radius 13.5, looking outward. Framing is geometry, so it is derived: `constellationExtent()` reports what must fit and the controller pushes the camera out along the posed direction until it does, opening the lens only if `MAX_DISTANCE` runs out first. The binding axis is the *narrower* screen one — horizontal on a portrait phone, which is why no single typed number could serve both. **12/12 at 1440×900 and 12/12 at 390×844**, from 8 and 2. |

**Exit:** guided by default, free on demand, both over one scene, with every route to a
project — star, keyboard rail, deep link — moving the same camera.

**Status 2026-08-18 — Phase 4 complete. All eight items done.**

### The seam was the whole problem

Handing control from the scripted camera to free orbit has to be invisible, and two
attempts at it were not. The rig quaternion is the *inverse of the camera's orientation,
exactly* — that falls out of the arithmetic rather than being tuned — but the Euler
decomposition used to carry it must be **XYZ, not the YXZ an orbit camera would use.** A
roll-free `lookAt` camera is `Ry(a)·Rx(b)`; its inverse is `Rx(−b)·Ry(−a)`, and decomposing
that as YXZ needs a non-zero Z term which the first version silently dropped. The result
looked like a botched sign. Separately, the field of view had to be anchored to whatever the
guided camera was already using, because an absolute distance→FOV curve wanted 39.7° where
the authored camera sits at 45° and snapped on the first frame.

Measured after the fix: **0.46% of sampled pixels differ across the handover**, and those are
the hero tagline still typing and the nodes still orbiting between the two captures.

### Verification now exists for behaviour, not just rendering

`npm run nav` (`scripts/nav-check.mjs`) drives the real scene through fifteen assertions —
default mode, drag-to-free, resume, scale stepping, deep links including a bad id and the
`?plain=1` interaction, the comparison label appearing only on a genuine second focus, and
the phone controls including their touch-target size.

It earned its place immediately. Two defects passed typecheck, build and the whole viewport
matrix and were caught only here: the scale readout was never fed in guided mode, so it
reported "constellation" for the entire scripted path; and focus was wired to the scene's
click handler, so opening a project from the keyboard rail — the accessible route, and the
one 0.2 exists for — moved no camera at all. The overlay is now the single trigger, which is
the one thing stars, rail and deep links all agree on.

---

## Phase 5 — Labels

| # | Task |
|---|---|
| ✅ 5.1 | **Done 2026-08-18.** Manual projection into Vue state, one pass per tick, with the depth cull. `CSS2DRenderer` skipped for the reason DESIGN §6 gives — at twelve nodes hand projection is cheaper and far more controllable. The cull is `ndc.z <= 1` *plus* the x/y bounds: without it a star behind the camera projects to a mirrored point **inside** the viewport and its label tracks backwards across the screen. |
| ✅ 5.2 | **Done 2026-08-18.** Occlusion by raycast against the node hit meshes only, fading opacity to 0.22 rather than hiding. Explicitly **not** the `NoBlending` hole-punch, which writes a transparent quad into the colour buffer and breaks under bloom — and this scene runs bloom on every tier above low. The hit meshes are reused rather than the visible spheres, because a label and a pointer disagreeing about which star is in front would be its own bug. Verified: orbiting until stars overlap drives the minimum label opacity to 0.22. |
| ✅ 5.3 | **Done 2026-08-18.** `data/labelLod.ts`. Apparent magnitude is the project's derived magnitude (3.7) scaled by camera distance, normalised so that at the galaxy resting distance apparent *is* magnitude. **Distance alone is not enough of a filter** — fly into a dense arc and a dozen projects clear the threshold together, because the arc got closer, not any one project — so there is also a hard cap of five names, spent strongest-first. Measured at the overview: 7 dots, 3 names, 0 cards, and the names go to BeatMind, Stick and Dot and Tathya. |
| ✅ 5.4 | **Done 2026-08-18.** dot → name → card. A card only ever appears on intent (hover, or the focused subject in free mode), never from the derivation, so the pile of twelve cards can never happen. The card is the one interactive label — `pointer-events` is off on the container and re-enabled just for it — and clicking it opens the project. |
| 🟡 5.5 | **DOM half done 2026-08-18; MSDF deliberately not built, pending a decision.** Everything a person or a crawler reads is real DOM text, which is the half of this item that carries the SEO and screen-reader guarantee. MSDF-in-WebGL was wanted for one reason — correct occlusion among the stars — and 5.2 now solves that by raycast, so the remaining benefit is perspective-scaled glyphs. Against that: a new runtime dependency (`troika-three-text`, ~180 kB into the lazy chunk), a font atlas to generate and keep in sync with the self-hosted Geist Mono, and compatibility risk against pinned `three@0.165`. **`CLAUDE.md` requires asking before adding a dependency, so it has not been added.** Owner decision. |

**Exit:** every star is labelled at a level the camera earns, nothing readable is trapped in a
canvas, and no label ever renders for a star that is not there.

**Status 2026-08-18 — four of five done, 5.5 is an owner decision, not an omission.**

### Why one component and not twelve

`NodeLabel.vue` rendered exactly one card for the hovered project, and Phase 4 added a second
instance for the comparison ghost. That shape cannot declutter: the name budget is a decision
about the *whole set* — which five of twelve are strongest right now — and a component that
only knows its own project can never make it. `NodeLabels.vue` is one ticker callback over one
pass, which is also one clock rather than twelve.

### Verification

`npm run labels` (`scripts/label-check.mjs`) drives the real scene through fourteen assertions:
projection and the behind-camera cull, that no label renders outside the viewport, that more
than one detail level is in use, the name cap, that no card appears without intent, that the
projector actually runs each tick, hover promotion, the click-through, and that occlusion fades
via a transitioned opacity rather than `display: none`.

It caught a genuine usability defect on its first run. Cards track their star, stars orbit, and
the measured drift was **26.8px in 500ms** — fast enough that a card slides under the cursor
while you are reaching for it. It was *just* clickable, which is the worst kind of defect: fine
when you test it deliberately, broken-feeling when you do not. A card now freezes the moment the
pointer is on it and resumes when the pointer leaves; measured slip afterwards is 0.00px.

Two assertions in that harness had to be rewritten because they were testing the wrong thing —
"an untouched card tracks its star" depends on which star happened to be hovered, and a
`complete` project orbits at 0.004 rad/s and sits visibly still. Liveness is asserted across the
whole label set instead, where something is always moving.

---

## Phase 6 — Craft

Everything here is cuttable. Nothing here is load-bearing. That is deliberate — the site must be excellent before any of it lands.

| # | Task |
|---|---|
| ✅ 6.1 | **Done 2026-08-18.** `<head>` visibility guard with an 8-second failsafe. The guard is the easy half; the failsafe is the one that matters, because hiding content behind JS means a script that never runs leaves a permanently blank page — a blocked bundle, a CDN failure, one syntax error in an old browser. It reveals unconditionally after 8s and is cancelled the moment the app mounts. **Verified by aborting every JS request and watching the page appear anyway.** *Real asset progress is not instrumented, and deliberately so:* the 3D chunk is lazily imported and only starts loading after the boot sequence completes, so during boot there is nothing whose progress could honestly be reported. A fake progress bar is the exact decoration-as-data failure this repo exists to avoid. |
| ❌ 6.2 | **Not built — owner decision.** See the note below. |
| ❌ 6.3 | **Not built — owner decision.** |
| ❌ 6.4 | **Not built — owner decision.** |
| ❌ 6.5 | **Not built — owner decision.** |
| ❌ 6.6 | **Not built — owner decision.** |
| ✅ 6.7 | **Done 2026-08-18 — and its subject did not exist.** DESIGN §5 specifies thin-film shading "on the center star" and there was no centre star: twelve nodes orbiting an empty origin, in a layout that derives every position as a radius and an angle *about a centre*. `CentreStar.vue` + `thinFilm.frag.glsl`. The colour is interference, not paint — three cosines standing in for R/G/B wavelengths over an optical path that grows toward the limb, plus Fresnel. Took three passes: the first was 72% gold tint and resolved to flat olive, the second packed eight rings into the silhouette and read as a dartboard, the third has the low band frequency and high grazing-angle floor a real film actually shows. |
| ✅ 6.8 | **Done 2026-08-18. Thirteen lights removed.** Star bodies are `MeshMatcapMaterial` and the twelve per-node `PointLight`s, the camera key light and the ambient are all gone — nothing in the scene responds to a light any more (halos, coronas, glints, particles and sky are shader materials; moons are `MeshBasicMaterial`). DESIGN names the PBR-over-ten-lights loop as the single largest mid-tier GPU cost. Matcaps are **generated from the same token as the legend swatch** rather than shipped as a PNG, so the star and the swatch describing it cannot drift (the 2.6 bug). The emissive term became a `color` multiplier past 1 into the half-float buffer, which is where the breathing pulse and hover boost now live. |
| 🟡 6.9 | **Dither done; `fwidth()` has no subject.** The sky already dithered, but against `vUv` and animated by time — so at DPR 1.25 each noise cell covered more than a device pixel (which is not dithering) and a still page shimmered. Now `gl_FragCoord`-based, static, at DESIGN's 0.0045, and added to the corona, the other wide low-alpha gradient. **The `fwidth()` line has nothing to anti-alias:** DESIGN aims it at orbit rings and connector lines, and connector lines are DOM SVG that the browser already anti-aliases while no ring primitive exists. Adding geometry to justify a line of shader code would be backwards. |
| ✅ 6.10 | **Done 2026-08-18.** `NearFieldDust.vue`, a sparse shell at radius 15–27. **Inside the rig, which is the whole trick:** free mode rotates the scene rather than the camera (4.3), so dust parented to the camera would be nailed to the screen and parallax nothing — inside the rig, dust out at the camera's own orbit distance sweeps several times faster than the constellation at radius 4–13. Parallax from the geometry, not from a second transform. Off entirely on the low tier. |
| 🟡 6.11 | **Chromatic aberration and grain done, high tier only. Depth of field deliberately not shipped.** Aberration is driven by smoothed camera speed, so it reads as a lens under load rather than a broken display on a still frame; grain sits at 0.028 opacity. **DOF was the item and it is the wrong effect for this scene:** it needs a depth pass, and the subjects here are small bright points against black — blurring by depth blurs precisely what the viewer is looking at, and bokeh on a bloomed point is a smear, not a circle. The FOV change already carries "approach" (4.3). |
| ✅ 6.12 | **Done 2026-08-18.** `useMagnetic.ts` on the booking CTA — the one action that matters commercially, so the one that earns the pixels. Fine pointers only (on touch the transform would only apply *as you press*, a button that moves under the tap), reduced motion opts out, and the listener is on `window` because the point is to react before the pointer arrives. Cursor-reacts-to-context and text-decode-on-reveal already shipped in `CustomCursor.vue` and `useCharacterSplit.ts`. |
| ✅ 6.13 | **Done 2026-08-18.** Idle autopilot after 12s in free mode, eased in over 1.5s so it does not read as the page grabbing the camera back. It nudges the *target* azimuth, so it goes through the same damping as a drag and can never fight one. **Idle is detected from the targets changing, not from a callback per input** — gestures, zoom buttons, focus and deep links all move the camera by different routes, and a hand-wired list of "this counts as input" is a list the next control will be missing from. |

**Status 2026-08-18 — 7 done, 2 partial with stated reasons, 5 audio items not built.**

### Audio (6.2–6.6) is an owner decision, not an oversight

DESIGN §7 specifies **Tone.js for transport and Howler.js for the sample pools**, over
**pre-rendered loops rather than synthesis** — and is explicit that hand-rolled
`AudioBufferSourceNode` timing is where amateur web audio falls apart, and that 100,000 Stars
*cut* generative Web Audio because it crashed Chrome.

Three things block it, and only the third is decisive:

1. Two new runtime dependencies. `CLAUDE.md` requires asking first.
2. No audio assets exist, and pre-rendered loops are the stated approach.
3. **The author cannot hear the output.** Shipping sound onto a lead-generation site without
   listening to it is unverifiable work of exactly the kind the rest of this repo refuses. The
   architecture — muted by default, gesture-gated resume, a lowpass on overlay open, silence
   under resume and experience overlays — is all buildable blind. The sound design is not.

The conservative default is already in place by accident: the site is silent, which is
DESIGN's own "a recruiter who never interacts hears nothing".

### Verification

`npm run craft` (`scripts/craft-check.mjs`) covers the parts of this phase that are not
matters of taste: that the app reveals on mount, that the failsafe is cancelled when it should
be, that **the page still becomes visible with every JS request aborted**, and that the scene
keeps moving with nobody touching it.

The rest was judged on screenshots at each step, which is why the centre star took three
passes and the matcap took two — the first matcap multiplied the node colour by a matcap that
already contained it, squaring the hue and returning golds darker and more orange than their
swatch.

---

## Phase 7 — Hardening

| # | Task |
|---|---|
| ✅ 7.1 | **Done 2026-08-18.** `npm run a11y` tabs the real page at 390, 800 and 1440 and asserts, per stop: that it is reachable, that it is not zero-size, that it has an accessible name, and that it shows a focus indicator. 37–39 stops per breakpoint, all clean. **It found twelve real violations** — see below. |
| ✅ 7.2 | **Done 2026-08-18.** Every visible control has an accessible name, every image declares `alt`, heading levels never skip, and the project overlay is a labelled `aria-modal` dialog that takes focus on open, **traps it** (verified by tabbing 25 times and checking focus never leaves), and restores it on close. Name resolution follows the real algorithm — `aria-label`, `aria-labelledby`, `label[for]`, wrapping label, placeholder — because the first version read `textContent` and reported every form input as unnamed, which was a bug in the test, not the site. |
| ✅ 7.3 | **Done 2026-08-18. The known risk was real and is measured.** `--ice-faint` on `--bg` is **2.34:1** — a clear AA failure at the 12px mono sizes it was used for, and PLAN named it as the suspect before anything was measured. Fixed with a new `--ice-quiet` token at **4.89:1**, applied to the eleven declarations that coloured *text*; `--ice-faint` keeps its hairlines, which WCAG does not govern. The harness now computes the real composited ratio for every visible text node — walking up for the first ancestor that actually paints, because almost everything here sits over a WebGL canvas or a translucent panel — and fails below 4.5:1 (3:1 for large text). |
| 🟡 7.4 | **Emulated, not real, and the difference is stated.** iPad portrait (834×1112) and the old 768–820 dead zone are covered by `npm run shots` at every change, and a handset profile (390px, coarse pointer, DPR 3) drives the tier detection down the real branch. **Safari/WebKit was not tested at all** — only Chromium is installed here, and no amount of viewport emulation is a browser engine. Mid-tier Android was likewise emulated, not measured: this runner has no GPU (see 7.5). Both need a person with the hardware. |
| ✅ 7.5 | **Done 2026-08-18 — two minutes sustained, per tier, no degradation.** `npm run perf` measures frame intervals over a real render loop and compares the last third of the run against the first: high **98.0%** of opening rate retained, handset **100.4%**, reduced-motion **100.3%**. That is the question a thermal test is actually asking — leaks, unbounded allocation and a growing scene graph all show up as "slower at the end than at the start", and that shape reproduces on any hardware. |
| 🟡 7.7 | **Not assertable in this environment, and the harness says so rather than pretending.** This runner rasterises through SwiftShader — WebGL on the CPU, no GPU — so the high tier measures 2.6 fps here and would measure nothing like that on the mid-tier Android this project targets. Failing a build on that number would be reporting a fact about the CI box as a fact about the site, so the absolute frame-rate gate is **skipped when software rendering is detected and enforced when it is not**. Run `npm run perf` on real hardware to close this. |
| ✅ 7.6 | **Done 2026-08-18.** All twelve projects in the rail appear in plain mode by name, and services, contact, about, capabilities, training and the portrait are all present. This check was itself broken on its first run — it read the collapsed rail, got zero projects, and passed vacuously. A parity test that passes because it found nothing to compare is worse than no test. |
| ✅ 7.8 | **Done 2026-08-18 — retired, not updated.** `PROGRESS_AUDIT.md` now opens with a header stating it is frozen and listing what in it is false. Updating was the wrong option: 587 lines describing a build since rewritten through seven phases, and a document needing line-by-line re-verification on every change is one nobody re-verifies. It is preserved because `MEMORY.md` cites it for a real decision, and deleting it would lose that. |

**Exit:** every claim in this phase is a number produced by a script, or an explicit
statement that it could not be produced here.

**Status 2026-08-18 — 6 done, 2 partial for reasons no commit can clear.**

### The twelve focus violations

`CLAUDE.md` has said since the beginning: never `outline: none` without an equally visible
replacement. Twelve components did it anyway, all in the same shape — a combined
`:hover, :focus-visible` rule that removed the outline and swapped in a glow. Two problems,
and the second is the one that mattered:

1. Keyboard focus looked **identical to mouse hover**, so a keyboard user could not tell
   where they were on a page that highlights on hover anyway.
2. Measured, several of them rendered **no indicator at all** — the replacement depended on a
   background and box-shadow stack that a translucent panel over a WebGL canvas swallowed.

The fix is one file. `styles/focus.css` owns the ring, and no component sets `outline` any
more, so the guarantee lives in a single place instead of being re-promised in twelve. That is
the same move as `sceneRig.ts`, `nodeMotion.ts` and `labelLod.ts`: when a rule has to hold
everywhere, one owner enforces it and the rest inherit.

### What the harnesses cannot do

Three things in this phase need a person and hardware, and no amount of scripting substitutes:

- **Safari.** A different engine, not a different viewport.
- **A real mid-tier Android**, for both frame rate and actual heat.
- **A real screen reader.** 7.2 checks the accessibility *tree* — names, roles, structure,
  focus behaviour — which is most of what goes wrong. It does not tell you whether the
  result is pleasant to listen to.

---

## Phase 8 — The scene, looked at

Every earlier phase was built from the code outward. This one started from **300 captured
frames** — every scroll step on desktop and mobile, every panel of every project, both ends
of each — because six of the eight defects below are invisible in a diff and four of them
had already survived every gate in phases 0 through 7.

`npm run frames` is the harness. It walks the document scroll in even steps, then opens every
project and drives a real `mouse.wheel` against the overlay, recording `scrollHeight`,
`clientHeight`, `overflowY` and the `scrollTop` the gesture actually produced. The point is
that "scrolling inside a project doesn't work" becomes a number.

| # | Task |
|---|---|
| ✅ 8.1 | **Overlay scroll was dead on desktop.** Lenis binds `wheel` on `window` with `allowNestedScroll: false`, so after `ProjectOverlay`'s handler correctly stepped aside to let the browser scroll the panel, Lenis cancelled the event and applied the delta to a page that is scroll-locked while the overlay is open. Caught by patching `Event.prototype.preventDefault` and reading the stack. Measured: one wheel notch moved **0px** against 275px of hidden content, and **100px** with `data-lenis-prevent` on the root. Touch was never affected — Lenis runs `syncTouch: false` — which is exactly why this read as "the phone is fine". Every one of the 65 mobile panels overflowed, up to **1146px**. |
| ✅ 8.2 | **`ConnectorLines` deleted; `OrbitPaths` replaces it.** The lines drew `relatedIds`, and `types/project.ts` said the quiet part itself: *"a relationship between two projects is a judgement, not a measurement. Nothing in the data implies it."* They were rendered as flat SVG hairlines at `z-20` — constant 1.1px width and 0.32 opacity from a node four units away to one twenty units away, unoccluded by the star they crossed, sliding across the frame while everything else parallaxed. A 2D overlay pasted onto a 3D scene reads as exactly that. Orbit rings state a measurement instead (`orbitRadius`, where radius encodes maturity) and live inside the rig, so they take perspective and depth. `relatedIds` and `ConstellationNodeConfig` are gone with them. |
| ✅ 8.3 | **Orbital speed made visible.** `speedOf` returns the honest ordering and at raw values it was unreadable: 0.055 rad/s is one revolution every 114 seconds, 0.004 is one every 26 minutes. `MOTION_SCALE = 4` in `nodeMotion.ts` is a **playback rate, not a re-derivation** — one scalar for every node, so the 13.75:1 ratio the data states is untouched. It lives in `nodeMotion` rather than `layout` because the derivation states what is true and the presentation decides how it is shown. Guarded by a new assertion (8.10) rather than by good intentions. |
| ✅ 8.4 | **The sky is black.** Sampled from the shipped build, empty sky measured `rgb(1, 4, 13)` — blue twelve times red, a navy wash rather than a void. `--bg` is `#000000`, the shader's gradient floor is near zero, the nebula thresholds are up and its weights down so it reads as discrete clouds rather than fog, the aurora term is halved, and the stars are brighter because they now carry the frame. Real deep-field imagery is black with the colour concentrated in objects; the reference set says the same thing from the design side. |
| ✅ 8.5 | **The centre star was a soap bubble; it is a star.** The thin-film shader was genuinely the physics and genuinely wrong for this object — at distance a flat green disc easily mistaken for a project node, at close range a ball of concentric rainbow rings filling the frame. Replaced with limb darkening, a hot-white core through the `--gold` tint, surface granulation, and a chromatic fringe confined to the outer few percent of the disc. It is opaque and depth-writing now: the old one let the particle field show straight through it. A billboard corona was added, because a star's light is mostly *outside* its silhouette and no amount of work on the disc substitutes for that. |
| ✅ 8.6 | **Moons were 4.6 pixels of flat colour.** `MeshBasicMaterial` is unlit by definition, so ninety satellites rendered as stuck pixels and the "a technology keeps the same colour everywhere" idea was being made in a language nobody could see. Radius 0.032 → 0.058 (~8.4px), segments 8×6 → 12×8, and a matcap so they shade — the same bargain the nodes already take. Still well under `MIN_VISIBLE_RADIUS`, so a moon can never be mistaken for its parent. |
| ✅ 8.7 | **Glass had nothing to refract.** `.glass-panel` asked for `blur(22px) saturate(1.55)` over a scrim at 0.64 alpha with a `blur(10px)` of its own — by the time the panel's filter sampled the page, the scene behind was already a uniform dark field, and blurring something uniform returns the same uniform thing. The scrim drops its blur entirely and falls to a gradient, so the starfield stays sharp behind the panel. The panel's blur comes **down** to 16px, which is the counter-intuitive half: past ~18px the sample radius exceeds the spacing of anything in a starfield and every sample averages to the same grey. |
| ✅ 8.8 | **Mobile panels: 870 of 1150px before a sentence.** The overlay header stacked its controls under a two-line title, the panel nav was `repeat(5, ...)` from before the Demo panel existed so a six-panel project orphaned "06 Links" on its own row, and the Proof dial was 288px square — three-quarters of the screen width for a one-digit number. Controls back onto the title row, three columns fitting real words instead of `Bound`, dial to 9.5rem. |
| ✅ 8.9 | **Collisions the viewport matrix could not see.** `npm run shots` samples one scroll position, so a fixed header that only overlaps content 3000px down never appeared. The top bar gained a masked gradient scrim — padding cannot fix a fixed element, since content passes under it at *some* scroll position regardless. The hero's bottom padding now clears the scale readout, which the scroll cue had been printing across since the first captured frame. |
| ✅ 8.10 | **Two input defects the gates had been passing over.** Node selection fired on `pointerdown` with no movement threshold, so pressing a star to orbit opened its overlay before the drag moved a pixel — free orbit was unreachable from the most natural place to start it. And hover throttled by dropping every *other* `pointermove`, which is not a throttle (rate varies by device) and can drop the *last* event, leaving a pointer at rest on a star that never responded. Selection now needs a `pointerup` on the same node within 6px and re-picks on release; hover is one pick per frame with a trailing resolve. `npm run labels` gained **5.6**, asserting no star moves faster than 120px/s, so 8.3's knob cannot be raised until the stars are unhittable. |
| ✅ 8.11 | **The thesis took 58 seconds to appear.** `useCharacterSplit` re-armed a `setTimeout` per character, which makes total duration a function of how often the browser runs a timer rather than of `msPerChar`. Measured on the hero tagline — 83 characters at 8ms, so 664ms of intent — the real rate was **one character every 700ms**. Timers are the lowest-priority thing on the event loop and this page runs a WebGL scene ahead of them. Now time-derived on `gsap.ticker`: a slow device skips characters and still finishes on schedule. `msPerChar` raised to 18, because 664ms was never observed and reads as a flash rather than as typing. |
| ✅ 8.12 | **Labels and DOM chrome shared a coordinate system and ignored each other.** The hero is `position: fixed` over the canvas, so at 390px three project names printed straight through "PARTH TIWARI" and the thesis line, on the first frame anybody sees; at the other end of the scroll "Tathya" rendered underneath the constellation index. `data/screenRegions.ts` lets each surface publish its box and the projector demotes only the labels that actually overlap one — a name to a dot, never to nothing, because the star is the invitation. Hero measurement is `ResizeObserver`-driven: the tagline types itself in, so the box grows after mount while the page is still. Names near the right edge now flip to the other side of their star. |
| ✅ 8.13 | **The reveal shows every project, on every screen.** Covered in 4.9 — recorded here because it is the frame this phase was called in to fix. Desktop 8/12 → **12/12**, phone 2/12 → **12/12**. |
| ✅ 8.14 | **Phase 8 reviewed against the deployed site, and three of its own changes reverted.** Captured every frame again — this time from `parth-tiwari-1.vercel.app`, not a local preview — and looked at all of them rather than the ten that confirmed the fixes. **8.7 went too far**: with the panel tint at 0.30 and the blur at 16px, "PARTH TIWARI" at 100px and the whole thesis line read straight *through* an open project, along with the legend, the scale readout and two node labels. The reasoning was wrong in a specific way — 16px is enough blur for a starfield and no blur radius small enough to leave stars looking like stars will touch a 100px serif. The real fix is to remove what is behind rather than fight it through the glass: the hero now hides for *any* overlay (it only checked the evidence one, so opening a project left it at full opacity), and the scene chrome and node labels hide with it, since they are controls for a paused scene. Tint back to 0.38, blur to 20px. **8.8 also cost more than it saved**: moving the overlay's controls onto the title row bought 40px of header and spent 90px on wrapping — three 44px targets take 150px of a 390px viewport, so "Stick and Dot" wrapped to three lines. Controls back below the title; the height comes out of the type instead. And the three-column panel nav shipped "03 ARCHITECTU…", so number and word stack inside the tile. **8.12 tested the wrong thing**: `overlapsChrome` checked the anchor point, so "Tathya" — whose star sat 25px left of the legend while its name ran 90px into it — was never demoted. It tests the label's extent now, in its drawing direction. Also: a `name`-level label rendered text with no marker, on the assumption that the star is the marker, which fails when the star is behind the corona; the top bar's scrim started fading inside the bar's own band and let a serif heading through at 25%; the booking pill was 78% opaque so body copy read through it; and the index rail printed through the DOM sections below the scene, where every project is already a focusable card. |
| ✅ 8.15 | **Second review pass — four more, three of them mine.** The mobile arrival still had the scale readout's top border cutting through "agree.", and the padding rule meant to prevent it looked correct in the file: a *later* media query at `and (max-height: 680px)` was overriding it, and a portrait iPhone 13 reports **664px** of viewport once browser chrome is subtracted. A branch written for phones in landscape was firing on the primary phone case. Threshold moved to 560px, which is below any phone held upright — and the number came from `devices['iPhone 13'].viewport`, not from a guess. The footer's last line lost its year behind the booking pill; the end of a document *can* be padded clear of a fixed control, unlike mid-page copy, so it is. And hiding the index rail under an overlay (8.14) **broke focus restoration** — the overlay restores focus to the element that opened it, and half the time that is a button in the rail, so `v-if` destroyed the restore target and closing a project dropped focus to `<body>`. `npm run a11y` caught it in one run. The rail recedes with opacity now and stays mounted. Also confirmed here: **131 panels, 77 overflowing, every one of them scrolls**, and zero page errors across the whole capture. |
| ✅ 8.16 | **A phone could not scroll the page at all.** `@tresjs/core` sets `touch-action: none` inline on its canvas — reasonable for a library whose canvas is normally a widget in a page, catastrophic here, where the canvas is `sticky` at `h-screen` and covers the whole viewport for the first four screens of the document. A touch beginning on it was never handed to the browser, so the wordmark and tagline sat locked in place and nothing moved. Reported as *"I can't scroll anywhere, I can't do anything"*, reproduced exactly: 9962px of document, no scroll lock, `defaultPrevented` false, and a 300px drag moving `scrollY` by **0**. Overridden to `pan-y` — the vertical axis goes back to the browser because scroll *is* the guided tour, the horizontal stays with us because that is the azimuth orbit. `!important`, because the declaration is inline and TresJS is pinned. **Two more fell out of fixing it.** `pan-y` still delivers a few `pointermove` events before the browser claims the gesture, and they were enough to clear the drag threshold — so every swipe flipped the scene into free orbit and killed the tour on the visitor's first touch; an axis test now latches a touch gesture as scroll-or-orbit once and never re-decides. And a drag that crossed a star lost the rest of itself to the hover *card*, which is a real `<button>` above the canvas — traced by logging pointer targets through a drag and watching them go `CANVAS → node-labels__card → node-labels__card-name`. `setPointerCapture` fixes that properly. It was intermittent until 8.10 made hover reliable, which is the only reason `npm run nav` caught it. |
| ✅ 8.17 | **Focus restoration assumed the trigger survives.** Choosing a project from the index rail *collapses the rail*, so the button that opened the overlay is unmounted before the overlay finishes opening — and `restoreFocus` to a detached node is a silent no-op that drops a keyboard user onto `<body>` at the top of the document. `useFocusTrap` takes a `restoreFallback` now, evaluated at deactivate time so it can name something that did not exist at activate time; the overlay points it at the rail's toggle, which is the control that opens the same list again and is always present. Found by `npm run a11y` failing three runs in a row, then traced by printing `document.activeElement` across open and close. |
| ✅ 8.18 | **Closing a project threw the scene away.** Reported as *"the whole state of the website just goes away"*, and it was the camera, not the page. Opening a project calls `focusProject`, which enters free mode and pulls the orbit in to `SCALE_DISTANCE.project`; closing reversed none of it. So a viewer four screens into the guided tour dismissed the panel and found the scale readout silently switched from NEIGHBOURHOOD to **SINGLE SYSTEM**, the camera parked at maximum zoom on the centre star, orbits flattened to lines, label elements down from 31 to 16 on desktop and **14 to 6** on phone, and a "resume tour" button that had not been there a minute earlier as the only way back. What made it disorienting rather than merely wrong is that `scrollY` was restored *exactly* — 800 → 800 — so the document said one thing and the camera another. `NavigationController` now snapshots mode, focus and the orbit targets on the first open and unwinds them on close; the snapshot survives stepping between projects inside the overlay, so the undo goes to where the viewer was before any of it, not to the previous project. Restoring routes through a new `navigation.restore()` rather than `focusProject` + `resumeGuided`, because those two encode decisions — entering free mode, and remembering a node worth comparing against — and an undo is neither; going through them left `previousProjectId` pointing at the project just closed and put a ghost "Previously" label on screen. Verified by driving the built site with real clicks at 1440×900 and 390×844: labels 31 → 28 and 14 → 14, scale readout back to NEIGHBOURHOOD, "drag to look around" back, no stuck hover card. |

**Exit:** the frames say so. `npm run frames` before and after, and the before/after pair is
the evidence — not a claim in a commit message.

**Status 2026-08-19 — 17 of 17 done.** Gates: typecheck, build, budget (118.33 kB eager,
three.js absent), nav 15/15, labels 15/15, a11y 23/23, craft 5/5, shots 10/10 clean.

### The lesson of 8.14

Every gate passed after 8.1–8.13 and three of the changes were visibly wrong, because the
gates check *properties* — is it reachable, is it named, does it contrast, did it move — and
none of them can see two legible things in the same pixels. `npm run frames` produces 300
images for exactly that, and the first pass through it read ten of them: the ones that would
show the fixes working. Looking at the frames that confirm a change is not looking at the
frames.

The second pass (8.15) made the same point from the other direction: a CSS rule can be
correct and still not apply, and the only way to know which you have is to look at the
rendered pixel. `padding-bottom: 13.5rem` was in the file, was the right number, and was
being overridden by a media query written for a case that does not exist on the device it
was matching.

The harness also lied once, and in a way worth recording: it measured the overlay's
`scrollHeight` *after* the wheel gesture, so five panels that correctly advanced to the next
panel — because they fit, and there was nothing left to scroll — were reported as "148px
hidden, scrollTop did not move". It records the state before the gesture now, and whether
the panel advanced, so the two outcomes cannot be confused again.

### What the user actually said, and what it turned out to be

Six complaints, six different underlying causes, and only one of them was where it felt like
it was:

| Reported | Actual cause |
|---|---|
| "scrolling inside the project doesn't work" | Lenis cancelling the wheel event at `window` |
| "the flip that rearranges everything" | camera crossing its own look-at point, 2.06 units away |
| "the end frame needs to show every node" | final pose sat *inside* the ring looking outward |
| "the lines go here and there, I don't get the point" | they drew a hand-typed judgement, as a 2D overlay |
| "glass panels don't feel like glass" | the scrim flattened the scene before the blur ran |
| "space should be more black" | correct, and the nebula/aurora wash was the reason |

The one that was *not* reported and mattered most: pressing a star to orbit opened its
overlay. Nobody described that as a bug because nobody got far enough to form the
expectation.

### On stopping at three tiers

Moons orbit nodes, nodes orbit the centre. A fourth tier — the whole constellation orbiting
something larger — was discussed and dropped, because nothing in the data says what that
larger thing *is*, and inventing one would be exactly the decoration-pretending-to-be-data
this project exists to avoid. The rings do the work a fourth tier was wanted for: they make
the system read as a system.

---

## Risk register

| Risk | Mitigation |
|---|---|
| **Scope.** This is a large plan and the current site works. | Phase 0 and 1 ship independently and are valuable alone. Every later phase is individually revertible. |
| **True-scale layout looks bad.** Honest orbital distance produces a sparse, unreadable field. | Anticipated. Schematic default with a labelled toggle (DESIGN §2). |
| **Snow Fall fatigue.** Ambition tipping into exhausting. | Every element must answer "what data determined this?" Phase 6 is entirely cuttable. |
| **One scene on mobile underperforms two.** The current split exists because the desktop scene was unusable on phones. | Quality tiers land in Phase 2, *before* the merge in 2.5. If a tier cannot hold 30fps, it renders fewer things — not a different scene. |
| **Three.js/TresJS pinned.** Some techniques may want newer APIs. | Work within 0.165. Any upgrade is its own PR with full visual QA. |
| **No tests.** Typecheck and build are the only gates. | Phase 7 is manual and explicit. Consider adding Vitest for the derivation logic in Phase 3 — pure functions, easy to test, and the highest-value thing to protect. |
| **Firecrawl quota.** Research ran on WebSearch/WebFetch instead. | Already mitigated — the depth came from engineering write-ups rather than scraped listicles. Reference index in `DESIGN.md` §12 is complete. |
| **No social proof.** Zero testimonials, zero client names, zero usage numbers. The strongest conversion lever is entirely absent. | Cannot be engineered. Phase 1.5.9 reserves the slot honestly rather than faking it. Flagged as owner homework, ranked first. |
| **The universe delays revenue.** A long build before the site converts anything. | Phase 1.5 ships proof and booking on the *current* site. Revenue capability does not wait on the engine. |
| **Ambition reads as unserious to a business buyer.** A founder may want a contractor, not an artist. | The plain-language headline, outcomes, screenshots and one-tap booking all work without the 3D. The universe impresses; it never gates. |

---

## Open decisions

Resolved: the rename to EPHEMERIS, real dates for chronology, Cost of Intelligence revived in the Proof panel, and the confirmed link set. See `PRD.md` §7.

Still open, none blocking Phase 0 or 2:

1. **Project dates** — owner supplying. Blocks 3.1 only.
2. **`tathya` / `beatmind` / `support-core`** — owner sorting per-project. Any addition past nine nodes blocks on 3.4.
3. **Whether Vivid ships** — it is Stick and Dot company work like the excluded app. Linked per instruction; revisit if the exclusion was categorical.
