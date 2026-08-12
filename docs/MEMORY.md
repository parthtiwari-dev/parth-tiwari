# Memory

Durable context for anyone — human or agent — picking this project up cold. Decisions, their reasoning, and the things that are easy to get wrong twice.

Update this when a decision changes. It is the file that stops the same debate happening three times.

---

## Where things stand

| | |
|---|---|
| Baseline commit | `09d2229` |
| Live site | Vercel project `parth-tiwari`, static SPA off `main` |
| Redesign branch | `claude/portfolio-redesign-arch-zm9eq3` |
| Status | Docs complete. No source changes yet. `PLAN.md` Phase 0 is the next work. |

The site as it stands is feature-complete and genuinely well-built. The redesign is elevation, not rescue. Anyone who reads `AUDIT.md` and concludes "this is a mess" has misread it — the defects are concentrated in exactly the areas the original build never had a reason to look at.

---

## Decisions made, and why

### The universe encodes data, or it gets cut

The governing rule. Position, size, angle, speed, moons, cluster, and label priority are all derived from project data. Nothing is hand-placed.

This came from noticing that all nine node positions in the current build are literal typed coordinates. A portfolio whose thesis is *evidence* cannot be built on meaningless decoration — it refutes itself. The bar is Shirley Wu's *Legends*, where 3D geometry is generated from each subject's data.

**Consequence:** adding a tenth project must require adding a data record and nothing else. If a change makes that untrue, the change is wrong.

### All four metaphor mappings, unified by zoom

The owner was offered orbital-maturity, timeline-depth, domain-constellations, and galaxy-zoom as alternatives, and asked for all four.

That turned out to be correct rather than indecisive — they are not competing options but different axes, and a real solar system uses all of them simultaneously. Zoom is the navigation, and **each zoom level reveals a different axis**. See `DESIGN.md` §2.

### Two modes over one scene

From NASA's Eyes on the Solar System: a guided scrollytelling layer on top of a free-orbit simulation, same data.

This resolves the central tension — a recruiter with 40 seconds and an explorer with 10 minutes need different things, and neither should get a degraded version. Guided is the default arrival; free unlocks on the first drag.

### Mobile is a different choreography, not a smaller one

The owner chose this explicitly over "one responsive world" and "keep the split, improve it."

The current build shows mobile users a 3.5-second blocking notice reading *"Desktop unlocks the full constellation controls"* before a decorative starfield with no project nodes. Most people open a portfolio link on a phone. That interstitial is deleted.

### Scope: rebuild the scene layer, and the content layer is on the table

The owner selected both "rebuild the scene, keep the content" and "full rewrite." Resolved as: **the engine gets rewritten unconditionally; the content model and copy get revisited where they block the design, not for their own sake.**

`projects.ts` is 886 lines of genuinely good, hard-won content. It is a liability only where it hardcodes 3D coordinates.

### All craft layers in scope, all cuttable

Sound, loading choreography, micro-interactions, and cinematic post-FX are all in. They are deliberately confined to `PLAN.md` Phase 6, last and individually removable.

The reason is the Snow Fall lesson: the NYT team's own retrospective says their hardest work was *removing* things, and "Snow Fall fatigue" became a real critique of the best-resourced newsroom on earth. Craft has to land on something already excellent, or it is padding.

---

## Things that are easy to get wrong

### GSAP must never write `camera.position` directly

Animate a plain mutable object; read it in the render loop. This is the documented fix for scroll-driven camera jitter, and it recurs in every good implementation studied.

Corollary specific to Vue: **scroll progress must never touch reactive state.** Module-scoped plain object or `shallowRef`. A deep `ref` means TresJS diffs every frame.

### The `NoBlending` label occlusion trick breaks under bloom

It is the fast, widely-recommended way to make CSS3D labels occlude behind WebGL geometry — and post-processing overwrites the transparent region it depends on.

Glowing stars are non-negotiable here, so occlusion uses raycast-against-the-nine-meshes with opacity fade instead. This decision was made once; do not rediscover it.

### `uClusterBrightness[9]` is a hard project-count limit

`particle.vert.glsl:12` declares a fixed-size array read through a 9-branch if-chain, because GLSL ES 1.0 forbids dynamic indexing. **A tenth project breaks the shader silently** — no error, just wrong output.

### `vh` units and percentage scroll offsets break on mobile

Mobile browser chrome resizes the viewport mid-scroll, and scrolling fires constant resize events. From The Pudding's scrollytelling documentation, learned across dozens of published pieces.

The current build uses `h-[400vh]`, `min-height: 220vh`, and `padding-top: 148vh`.

### Float precision breaks multi-scale space

Flying from constellation scale to a single project accumulates error and the scene visibly jitters. The fix from 100,000 Stars: **zero the global scene rotation on approach and rotate the target locally instead.** Keep the scene centred on the origin; never translate `Scene` itself.

### `v-if` does not prevent an import

The current build gates `SceneRoot` with `v-if`, which stops it *mounting* — the 767 kB Three.js chunk is still downloaded, parsed, and modulepreloaded on every route including `?plain=1`. Lazy loading requires `defineAsyncComponent`.

### Audio is blocked until a user gesture

`AudioContext` starts `suspended`; `context.resume()` must be called inside a click/tap handler. This is why every good 3D site has a start button — the constraint generates the design rather than fighting it.

---

## Rejected, with reasons

| Rejected | Why |
|---|---|
| One continuous camera take | Harder to author, harder to deep-link, and it punishes every project added later. Discrete destinations instead. |
| Free-roam only | A recruiter with 40 seconds needs the guided path to exist. |
| Photorealistic planets | Kurzgesagt's illustrated approach is why 60 orders of magnitude stay coherent. Stylized-and-consistent beats realistic-and-mismatched. |
| Live generative audio | 100,000 Stars cut it because it crashed Chrome. Pre-rendered loops instead. |
| `logarithmicDepthBuffer` | Measurably degrades performance with many overlapping transparent objects; documented desktop/mobile inconsistency. Tight near/far planes instead. |
| A physics playground | Bruno Simon's car is brilliant and is a different site. This one must be readable in 40 seconds. |
| A router with per-project pages | Overlays in one world are the existing identity and they work. Deep links go through query params. |
| Node click → camera lerp | Already tried and rejected during the original build (`PROGRESS_AUDIT.md` Phase 3 item 4) — it felt worse than opening the overlay directly. Do not re-propose without new evidence. |

---

## Constraints that do not move

- **`three@0.165.0` and `@tresjs/core@4.3.1` are pinned.** Any upgrade is its own PR with full visual QA.
- **No project link ships unless confirmed public-safe.** Private repos, company endpoints, internal URLs, unreviewed deployments stay out. An empty links panel is correct behavior.
- **`?plain=1` stays complete.** It is the accessibility and SEO backstop. New content goes there too.
- **Sound never autoplays.**
- **Typecheck and build are the only automated gates.** There is no test runner and no linter, so those two are not optional.

---

## Research provenance

Roughly 55 sites were studied across two parallel sweeps. **Firecrawl hit its free daily network cap on the first call**, so both sweeps ran on WebSearch and WebFetch against primary sources instead — studio case studies, Codrops build logs, `web.dev` engineering posts, and published retrospectives.

This produced better material than scraping would have: the depth came from engineering write-ups rather than listicle summaries. Where only secondary detail was available, the research said so rather than inventing mechanism.

The full reference index with what to take from each is `DESIGN.md` §12. The three highest-value sources:

1. **100,000 Stars** — `web.dev/case-studies/100000stars`. Unusually candid, and it solved multi-scale space navigation in 2012 with solutions that remain non-obvious.
2. **NASA Eyes on the Solar System** — the dual-mode structure.
3. **Bruno Simon's portfolio case study** — the most actionable audio and mobile detail found anywhere, with full source public.

---

## Open questions

Unresolved, and none of them block Phase 0 or Phase 2:

1. **Project dates.** Orbital angle encodes chronology; `projects.ts` has no date field. Without one, angle falls back to a stable derived ordering.
2. **Which live Vercel deployments are public-safe to link.** Six projects show "Pending verification" while being deployed and reachable. Needs an explicit yes per URL.
3. **Whether `EVIDENCEBOUND` survives.** It is a strong name and it is a second thing for a visitor to decode alongside the universe metaphor.
4. **Whether "Cost of Intelligence" returns.** `sliderConfigs` and `sliderResponse` are dead data supporting a UI that was deferred and never built. Either build it into project panels or delete it.

---

## Vercel

Team `parthtiwari-devs-projects`. Portfolio project is `parth-tiwari`.

Other live projects in the same account, several of which correspond to portfolio entries currently showing no links: `oncoverse`, `vivid`, `stick-and-dot-app`, `beatmind`, `tathya`, `support-core`.

**Web Analytics returns no data** — not enabled. Until it is, no claim about how the site is actually used is measurable, and none should be made.
