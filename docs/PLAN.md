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
| 4.1 | Guided mode: scroll drives the scripted path (default arrival) |
| 4.2 | Free mode: drag to orbit, pinch/wheel to zoom; unlocked by direct manipulation, with a quiet "resume tour" affordance |
| 4.3 | FOV-as-zoom; rotate-the-scene-not-the-camera |
| 4.4 | Zero-out-rotation-on-approach for float precision |
| 4.5 | Three zoom scales: galaxy → system → project |
| 4.6 | Pairwise comparison — the previously-focused project stays in frame, receding |
| 4.7 | Deep links per project via query param |
| 4.8 | Explicit mobile controls (visible zoom, reset) alongside gestures |

---

## Phase 5 — Labels

| # | Task |
|---|---|
| 5.1 | Manual projection into Vue state; cull `ndc.z > 1` |
| 5.2 | Occlusion by raycast against the nine meshes, with opacity fade — **not** the `NoBlending` hole-punch, which breaks under bloom |
| 5.3 | Magnitude × distance drives label visibility |
| 5.4 | Label LOD: dot → short name → full card |
| 5.5 | MSDF text for in-space labels; real DOM for anything a recruiter or crawler reads |

---

## Phase 6 — Craft

Everything here is cuttable. Nothing here is load-bearing. That is deliberate — the site must be excellent before any of it lands.

| # | Task |
|---|---|
| 6.1 | Loading choreography: real asset progress, continuous transition into the universe, `<head>` visibility guard with 8s failsafe |
| 6.2 | Audio: reactive-first, muted by default, `context.resume()` on the loader gesture |
| 6.3 | Nine tuned notes in one scale, one per project |
| 6.4 | Velocity-modulated random sample pools with a limiter |
| 6.5 | `BiquadFilterNode` lowpass on the ambient bed when a project opens |
| 6.6 | Silence audio entirely under resume and experience overlays |
| 6.7 | Iridescent thin-film material on the center star |
| 6.8 | Matcaps for project bodies — removes 10 dynamic PointLights |
| 6.9 | Dither and `fwidth()` AA in the shaders |
| 6.10 | Near-field parallax dust so camera motion is legible |
| 6.11 | Post-FX: DOF racking focus on approach, chromatic aberration on fast motion, grain |
| 6.12 | Micro-interactions: magnetic controls, cursor reacting to context, text decode on reveal. Native CSS scroll-driven animation where it suffices |
| 6.13 | Idle autopilot — camera drifts if the visitor stops |

---

## Phase 7 — Hardening

| # | Task |
|---|---|
| 7.1 | Full keyboard pass on every breakpoint |
| 7.2 | Screen reader pass |
| 7.3 | Contrast audit — `--ice-faint` on `--bg` at small mono sizes is the known risk |
| 7.4 | Real-device testing: mid-tier Android, iPad portrait (the old dead zone), Safari |
| 7.5 | Thermal test — 2 minutes sustained, no runaway |
| 7.6 | Verify plain mode still contains every piece of content |
| 7.7 | Frame budget verification per quality tier |
| 7.8 | Update `PROGRESS_AUDIT.md` drift, or retire it in favour of these docs |

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
