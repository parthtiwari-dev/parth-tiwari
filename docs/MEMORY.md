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

### The site is a lead generator, not a CV

**This reframe arrived after the first docs were written and it supersedes them.** The original PRD optimised for a recruiter being impressed. The actual goal is **paid client work at ₹50k–1L per project**, with traffic arriving from cold outreach.

Jobs remain a real but secondary goal. The ordering is deliberate and load-bearing: **a recruiter converts fine from a client-focused site** — working demos and clear outcomes are what they want too. **A client does not convert from a recruiter-focused site.** CGPA, training records and architecture diagrams do not answer "can I trust this person with ₹1 lakh." The higher bar generalises downward, so the site is client-led and the recruiter path is one tap away.

Do not rebalance this toward a job-seeking framing without a deliberate decision. It was considered and rejected.

### The commercial goal justifies the ambition rather than competing with it

The offer is *AI engineering plus genuine interaction craft*. Most AI freelancers ship an ugly Streamlit app; that combination is the differentiator and it is what supports ₹1L over ₹30k.

Which means **the portfolio being an extraordinary interactive artifact is the proof of the claim**, delivered before a word is read. The universe is the demo, not decoration.

The constraint this creates: impress in three seconds, get out of the way in sixty. **The conversion path must work with the 3D entirely bypassed.** If the universe is the only route to contact, it is a toll booth.

### Show before telling

The site has **no `<img>` tags at all**. For the buyer it now serves, that is a bigger defect than anything in the technical audit.

Projects invert to screenshot → outcome → live demo → the existing evidence panels. Those panels are strong; they are simply the wrong opening move for someone deciding whether to spend money.

### The universe encodes data, or it gets cut

The governing rule. Position, size, angle, speed, moons, cluster, and label priority are all derived from project data. Nothing is hand-placed.

This came from noticing that every node position was a literal typed coordinate — since fixed in 3.1/3.3. A portfolio whose thesis is *evidence* cannot be built on meaningless decoration — it refutes itself. The bar is Shirley Wu's *Legends*, where 3D geometry is generated from each subject's data.

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

### The site is renamed EPHEMERIS

`EVIDENCEBOUND` is retired. An ephemeris is a table of computed positions of celestial bodies at given times — it names exactly what the site does, **positions derived from data rather than placed by hand**, and carries the evidence thesis without restating it.

Rejected alternatives and why: *BARYCENTER* (precise for "I am the center", harder to say), *PARALLAX* (perfect concept — deriving fact from observation — but heavily used in tech), *SIDEREAL* (evocative, but names a frame of reference rather than what the site does).

The name is load-bearing in the boot sequence, top bar, both overlay eyebrows, `index.html` title/OG/Twitter/JSON-LD, and `og.png`. It all changes together.

### Chronology uses real dates, not a derived order

Deriving angle from `status` + `weight` was offered and rejected: it would have made chronology the one axis in the universe that wasn't actually true. Under the governing rule of §1 that is not a shortcut, it is a contradiction.

### Cost of Intelligence is revived, not deleted

`sliderConfigs` and `sliderResponse` were dead data feeding a UI deferred twice and never built. Rather than deleting them, the tradeoff control goes into the Proof panel — drag a budget or latency slider, watch the metric respond.

It is the one interactive idea in the original design that reinforces the evidence thesis rather than decorating it. **`sliderStore` is therefore explicitly excluded from the Phase 0 dead-code sweep.**

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

### `uClusterBrightness` was a hard project-count limit — fixed 2026-08-17

`particle.vert.glsl` declared a fixed `[9]` array read through a hand-unrolled 9-branch if-chain, so a tenth project grew the JS uniform array while the declaration stayed at nine — **failing silently**, no error, just wrong output.

The array is now sized by a `CLUSTER_COUNT` define injected from `projects.length`, and the lookup is a `for` loop over that constant bound. GLSL ES 1.0 forbids indexing by an arbitrary expression, but a loop index over a constant bound *is* a constant-index-expression, so this is legal ES 1.0 and the shader no longer knows how many projects exist. **Do not reintroduce a literal length.**

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
| Two separate paths for clients and recruiters | A fork-in-the-road makes every visitor choose before they know anything. One client-led site serves both; the reverse does not. |
| Published pricing | Owner targets both Indian SMBs and Western startups. Fixed prices destroy the ability to price by client and geography. Every path leads to a conversation instead. |
| Four co-equal contact buttons | All four channels ship, but ranked — booking primary, form secondary, email and WhatsApp always-visible. Equal weighting dilutes intent. |
| Buying a domain now | Deferred by the owner. `parthtiwari.com` is planned. Site URL is a single constant so the swap is one line — do not scatter the URL again. |
| Fabricated testimonials or invented metrics | Never. The slot stays honestly empty until a real quote exists. The site's entire thesis is evidence. |

---

## Constraints that do not move

- **`three@0.165.0` and `@tresjs/core@4.3.1` are pinned.** Any upgrade is its own PR with full visual QA.
- **No project link ships unless confirmed public-safe.** Private repos, company endpoints, internal URLs, unreviewed deployments stay out. An empty links panel is correct behavior.
- **`?plain=1` stays complete.** It is the accessibility and SEO backstop. New content goes there too.
- **Sound never autoplays.**
- **Typecheck, build, and `npm run shots`.** No unit-test runner and no linter, so these three are not optional. `shots` is Playwright across 390/430/800/834/1440 — it is the only thing that catches a viewport-specific regression, and it exists because a whole phase shipped once without mobile ever being rendered.

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

Unresolved, none blocking Phase 0 or Phase 2:

1. **Project dates.** Owner is supplying month/year per project. Blocks orbital angle (3.1) only.
2. ~~**`tathya`, `beatmind`, `support-core`** have no portfolio entry.~~ **All three resolved 2026-08-17** — shipped as nodes, taking the set to twelve. The nine-node shader limit that used to gate this is gone (`CLUSTER_COUNT`). Only their Render/Streamlit backends stay unlinked, on cold-start and auth-wall grounds respectively.
3. **Whether Vivid ships at all.** It is Stick and Dot company work, same as the app the owner excluded. Currently linked per instruction — revisit if the exclusion was about company work generally rather than that one repo.

---

## Vercel

Team `parthtiwari-devs-projects`. Portfolio project is `parth-tiwari`.

### Never assume `<project>.vercel.app`

This nearly caused a real mistake. `vivid.vercel.app` returns 200 and **belongs to someone else** — this account's project is at `vivid-alpha.vercel.app`. Short aliases are claimed globally, first come first served.

**Always** resolve the production alias from the Vercel project's `domains` array, confirm 200 without auth, and confirm ownership. Verified state at baseline:

| Project | Production URL | Ships |
|---|---|---|
| vivid | `vivid-alpha.vercel.app` | yes |
| tathya | `tathya-1.vercel.app` | **yes — linked 2026-08-17.** Live and actively ingesting; topics dated the current month. Render API (`tathya-zi9p.onrender.com`) NOT linked — free tier, 30–60s cold start. |
| support-core | `support-core-nine.vercel.app` | **yes — linked 2026-08-17.** Serves the real app. Render backend NOT linked — a bare API root is not a demo. |
| stick-and-dot-app | `stick-and-dot-app.vercel.app` | no — owner exclusion |
| beatmind | **`www.beatmind.tech`** (apex 308s to www) | **yes — linked 2026-08-17.** The old `beatmind-theta.vercel.app` 404 / `BLOCKED` reading is stale; it shipped to its own production domain with production Clerk keys. |
| oncoverse | none resolving | no — latest production deploy in `ERROR` |

**OncoVerse has never successfully deployed to production.** Its empty links panel is accurate, not an oversight. Do not "fix" it by inventing a URL.

**Web Analytics returns no data** — not enabled. Until it is, no claim about how the site is actually used is measurable, and none should be made.
