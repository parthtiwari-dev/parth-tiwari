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
| 0.1 | Lazy-load the 3D stack behind `defineAsyncComponent` so `?plain=1` and mobile stop downloading Three.js | AUDIT C1 |
| 0.2 | Add a real, focusable DOM index of all nine projects on every breakpoint — fixes the desktop keyboard lockout | AUDIT C2 |
| 0.3 | Focus trap + focus restoration in all four modal surfaces | AUDIT H3 |
| 0.4 | Fix the double render loop in `MobileStarWorld` | AUDIT C3 |
| 0.5 | Stop `ConnectorLines` and `NodeLabel` re-allocating and reading layout every frame | AUDIT H1, H2 |
| 0.6 | Cancel the leaking rAF in `SceneRoot`; track the untracked timers in `HeroTagline`, `AboutSignal`, `useCameraPath` | AUDIT H4, M4 |
| 0.7 | Fix the `vendor` chunk rule so `@vue/*` scoped paths actually match | AUDIT M3 |
| 0.8 | `npm audit fix` — 4 high-severity transitive vulnerabilities | AUDIT |
| 0.9 | Define the missing CSS variables (`--font-mono`, `--font-display`, `--font-body`, `--active-glow`) | AUDIT |
| 0.10 | Add reduced-motion to the scene mount condition so it genuinely produces a static experience | AUDIT C1 |
| 0.11 | Enable Vercel Web Analytics — currently returns no data, so no UX claim is measurable | AUDIT S9 |
| 0.12 | Fix canonical URL mismatch (trailing slash), stale `sitemap.xml` lastmod, and add `?plain=1` to the sitemap | AUDIT S2, S3, S4 |
| 0.13 | Add security headers to `vercel.json` | AUDIT S6 |
| 0.14 | Delete dead code: `isOverlayReadyProject`, `CopiedToast`, 7 unused tokens. **Keep `sliderStore`** — it is revived in 3.8. | ARCHITECTURE §11 |

**Exit:** typecheck and build clean; keyboard can reach every project; plain mode ships no WebGL engine.

---

## Phase 1 — Content honesty and rename

Small, high-leverage, mostly data rather than code.

| # | Task | State |
|---|---|---|
| 1.1 | Links resolved and verified. `vivid-alpha` and `www.beatmind.tech` linked. `support-core-nine` linked with its new node (1.4). **The Streamlit apps are deliberately NOT linked** — `upi-fraud-engine.streamlit.app` 303-redirects to `share.streamlit.io/-/auth/app`, so it fails the no-auth rule below; the same applies to the other hibernating Community Cloud apps. An empty links panel is correct behaviour. | done |
| 1.2 | Leave `stick-and-dot-app` unlinked (owner exclusion) and `oncoverse` unlinked (deploy `ERROR`) | done |
| 1.2a | ~~`beatmind` deploy `BLOCKED`~~ — **stale, corrected 2026-08-17.** Live on its own production domain (`www.beatmind.tech`, apex 308s to www) with production Clerk keys. Shipped as a node, linked. | done |
| 1.3 | `started: 'YYYY-MM'` added to every project and to the `Project` type. **Derived from each repo's first commit**, not owner recall — one verifiable rule applied uniformly beats ten remembered dates, and it is documented as such on the type. Surfaced as text in plain mode; the orbital-angle encoding lands in 3.1. | done |
| 1.4 | **Decided 2026-08-17.** `support-core` is in — a deployed, streaming support agent built to a real company brief is the single most commercially legible thing in the set for the buyer in `PRD.md` §3, and it verified as a live app with no auth wall. `tathya` stays out for now: 62 commits and the most recently active public repo, but a civic/government tracker does not read as a capability the target buyer is shopping for, and it dilutes a set that is otherwise about shipped AI systems. **Reversible in one array entry** — revisit if the audience widens. | done |
| 1.5 | Rename EVIDENCEBOUND → EPHEMERIS. Copy, metadata and `package.json` done. **Two `seededRandom('evidencebound-…')` seeds are deliberately frozen** and now carry comments saying so — they are retired brand names but load-bearing values, and renaming them reshuffles the entire star field. | done |
| 1.6 | Project count derived from `projectStore.projectCount` everywhere — `EvidenceTopBar`, `MobileFooterDock`, `ProjectIndex`, `PlainExperience`, `BootSequence`. No literal count remains in prose or in the shader (see the `CLUSTER_COUNT` fix). | done |


**Verification rule for any link, now and later:** resolve the real production alias from the Vercel project (never assume `<name>.vercel.app` — that check would have shipped a stranger's site), confirm it returns 200 without auth, confirm it belongs to this account.

**Why this mattered disproportionately:** the site's entire argument is evidence, and it was showing "Pending verification" on projects that were deployed and reachable. That is now resolved in both directions — live work is linked, and work that only *looks* live (the hibernating Streamlit apps) is deliberately not, because a link that lands on an auth screen is a worse evidence failure than no link.

---

## Phase 1.5 — Proof and conversion

**The highest-commercial-value phase in the plan.** It is deliberately early, ahead of the engine rewrite, because it converts leads on the *current* site while the universe is still being built.

| # | Task | Blocked on |
|---|---|---|
| 1.5.1 | Capture screenshots of `vivid-alpha`, `tathya-1`, `support-core-nine` at desktop and mobile via Playwright; commit as optimised assets | — |
| 1.5.2 | Add an `images` field to the project model; render screenshot-first in the overlay | 1.5.1 |
| 1.5.3 | Add an `outcome` field — what it does, for whom, plain language | owner |
| 1.5.4 | Services block: three ranked offers in outcome language | — |
| 1.5.5 | Persistent booking CTA, one tap from every screen at every breakpoint | booking tool choice |
| 1.5.6 | Contact form with a serverless endpoint | — |
| 1.5.7 | Email and WhatsApp as always-visible direct channels | — |
| 1.5.8 | About: photo + first-person intro | owner photo |
| 1.5.9 | Reserve a testimonial slot; leave it honestly empty until one exists | owner |
| 1.5.10 | Site URL as a single exported constant consumed by canonical, OG, Twitter, JSON-LD, sitemap | — |

**Why before Phase 2:** the engine rewrite is invisible to a buyer. Screenshots, outcomes and a booking button are the entire difference between a site that generates leads and one that does not. If the project stalls after this phase, it has still paid for itself.

**No prices anywhere.** Every path leads to a conversation.

---

## Phase 2 — The engine

The load-bearing rewrite. Nothing visual changes for the visitor; everything downstream depends on it.

| # | Task | Source |
|---|---|---|
| 2.1 | **One clock.** Single render loop owning the scene; scroll and time are inputs. Stops when off-screen or tab hidden. | DESIGN §8 |
| 2.2 | **Camera as data.** `{ scrollProgress, camera, target, activeNode }[]`; GSAP scrubs two plain mutable objects; render loop reads them. Scroll progress never touches reactive state. | DESIGN §4 |
| 2.3 | Adopt **Lenis** for scroll, feeding ScrollTrigger | DESIGN §4 |
| 2.4 | **Quality tier system** — one detection feeding particle count, shader complexity, post-FX, DPR. Tier the sky shader, which is currently untiered. | DESIGN §8 |
| 2.5 | **One scene across all breakpoints.** Delete `MobileStarWorld`; remove the mount/unmount breakpoint switch. Kills the 768–820px dead zone and the WebGL context churn. | DESIGN §9 |
| 2.6 | **Tokens as single source of truth** for DOM and WebGL. Extend the Tailwind theme; migrate the 35 hardcoded `--ice` literals. Star colors read from the same palette as the legend. | ARCHITECTURE §7 |
| 2.7 | Replace `vh`-based scroll runways with pixel offsets | DESIGN §9 |
| 2.8 | Dev-only Tweakpane camera authoring GUI that dumps poses to JSON | DESIGN §4 |
| 2.9 | Collapse the two overlay booleans into one state machine; scroll lock and Escape handled once | ARCHITECTURE §3 |

**Exit:** visually equivalent to today, running on one clock, one scene, derived tokens, at ≥ current frame rate on every tier.

---

## Phase 3 — Derived layout

Where the universe starts meaning something.

| # | Task |
|---|---|
| 3.1 | Compute orbital radius from maturity, size from evidence depth, angle from date, speed from recency |
| 3.2 | Move orbital motion into the vertex shader — per-instance phase attribute, positions upload once |
| 3.3 | Delete the hand-typed `node.position` coordinates from `projects.ts` |
| 3.4 | Remove the hardcoded `uClusterBrightness[9]` limit so a tenth project cannot silently break the shader |
| 3.5 | Moons: `stack[]` rendered as satellites; shared technologies visibly recur |
| 3.6 | Schematic ↔ true-scale toggle, with the current mode always labelled |
| 3.7 | Apparent magnitude derivation feeding label priority |
| 3.8 | **Cost of Intelligence** revived inside the Proof panel — drag a budget/latency slider, watch the metric respond. `sliderConfigs` and `sliderResponse` stop being dead data. |

**Exit:** adding a project requires adding a data record and nothing else.

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
