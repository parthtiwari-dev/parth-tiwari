# Product Requirements

What the site is for, who it serves, and what "done" means.

---

## 1. The problem with the current site

It is genuinely ambitious and genuinely well-built, and it still fails at its job in three specific ways:

1. **A recruiter with 40 seconds cannot get what they need.** The path to any project runs through a 2.2s boot sequence, a hero, and 400vh of scroll before a single node is clickable. There is no index, no "show me the work" shortcut, and on desktop no keyboard path to a project at all.
2. **The universe is decoration, not information.** All nine node positions are hand-typed coordinates. Nothing about where a star sits, how big it is, or how it moves says anything true about the work. It looks like data and isn't — which is the exact failure mode a site about *evidence* cannot afford.
3. **Mobile is told it is the lesser version.** A blocking 3.5-second interstitial announces "Desktop unlocks the full constellation controls" before showing a decorative 2D starfield with no nodes. Most people who open a portfolio link open it on a phone.

The redesign fixes these three things. Everything else is in service of them.

---

## 2. Who this is for

**Primary — the hiring engineer or founder.** Arrives from a LinkedIn message, a GitHub profile, or a cold application. Skeptical by default. Wants to answer one question fast: *is this person's work real?* They will spend 30–90 seconds unless something earns more. They may well be on a phone, on transit, at 40% battery.

**Secondary — the recruiter or non-technical screener.** Needs role, stack, availability, and a resume. Should never have to understand the metaphor to find these.

**Tertiary — the peer.** Another engineer or designer who found this because it was shared as *a nice site*. Will explore, inspect, look at the source, and possibly amplify it. This visitor is why the craft ceiling is high — but they are never the reason to make the primary visitor work harder.

The design tension this creates is the central one: **the experience must be extraordinary without being a toll booth.**

---

## 3. Principles

**Every visual encodes something true.** Position, size, color, motion, and sound each carry meaning derived from project data. If a property cannot be justified by data, it is decoration and gets cut. This is the site's thesis applied to its own construction.

**Legibility is the ceiling, not the floor.** The universe is not a puzzle. A first-time visitor should understand what they are looking at within seconds, without a legend. If the metaphor needs explaining, it has failed.

**Mobile is a different choreography, not a smaller one.** Touch gets an interaction model designed for touch — drag to orbit, tap to select, pinch to scale. Not a shrunken desktop, not a fallback, and never an apology.

**No dead ends for keyboard or screen readers.** Every project reachable by mouse is reachable by keyboard, on every breakpoint. This is a hard requirement, not a nice-to-have — the current site fails it completely on desktop.

**Never autoplay sound.** Muted by default, one obvious toggle, and the preference survives every transition.

**Restraint over richness.** Apple's most-copied scroll moment is 148 JPEGs on a canvas, and their product pages are silent. Premium is frame-perfection and editing, not accumulation. Anything that cannot hold its frame budget gets cut rather than shipped degraded.

---

## 4. What we are building

### 4.1 One universe, all screens

A single WebGL world replaces the current desktop-scene / mobile-canvas split. Camera choreography, particle density, post-processing, and input model adapt per device and per detected quality tier — but it is one scene, one codebase, one set of nodes.

This removes, in a single move: the 768–820px dead zone, the WebGL context destruction on resize, the byte-for-byte duplicated star renderer, and the "mobile is lesser" framing.

### 4.2 The mapping

Every axis encodes a real property:

| Visual axis | Encodes | Derived from |
|---|---|---|
| Orbital radius | **Maturity** — shipped and live sits close, early exploration sits far | `status` + whether links resolve to something live |
| Body size | **Evidence depth** — how much can actually be proven | `weight` + count of metrics, milestones, artifacts |
| Orbital angle | **Chronology** — position in the timeline | project date |
| Orbital speed | **Recency of contact** — active work visibly moves | `status` |
| Moons | **Stack** — technologies orbiting the project that uses them | `stack[]` |
| Spiral arm / cluster | **Domain** — RAG, agents, diffusion, fraud ML, medical | capability matching |
| Zoom depth | **Navigation itself** | scroll / pinch |

**Node positions are computed, never typed.** Adding a tenth project requires adding data, not coordinates.

### 4.3 Zoom as navigation

Three scales, each revealing a different axis:

- **Galaxy** — domains read as clusters. Overview, orientation, the shape of the whole body of work.
- **System** — maturity as radius, depth as size. The default arrival state.
- **Project** — moons resolve into the actual stack; the existing five-panel overlay opens.

Zoom is implemented as **field-of-view change, not dolly**, to avoid near-plane clipping across the scale range. On approach to a node, global scene rotation is zeroed and the target rotates locally, to avoid float-precision drift.

### 4.4 The 40-second path

A persistent, always-available way to reach any project without traversing the universe:

- A real DOM index of all nine projects, present in the document on every breakpoint
- Keyboard-navigable, screen-reader-complete, crawlable
- Visually quiet on desktop, primary on mobile
- Deep-linkable per project

This is the single most important addition. It is what lets the experience be ambitious *without* being a toll booth, and it fixes the keyboard lockout at the same time.

### 4.5 Craft layers

All four requested layers are in scope:

**Sound** — ambient bed per zoom scale; a lowpass filter engaging when a project opens (sells "adjacent room" in one `BiquadFilterNode`); velocity-modulated random sample pools of 4–5 variants per interaction event so repeated hovers never sound identical. Muted by default, one toggle, preference persisted.

**Loading choreography** — replaces the terminal boot. Tracks real asset progress and transitions *into* the universe as one continuous move with no cut. A synchronous visibility guard with an 8-second failsafe so a failed load never leaves a blank page.

**Micro-interactions** — magnetic controls, cursor reacting to what it is over, text decode/scramble on reveal, hover states with real easing rather than linear transitions. Native CSS scroll-driven animation where it suffices; GSAP only where it does not.

**Cinematic camera and post-FX** — depth of field racking focus onto the approached node, restrained chromatic aberration during fast motion, film grain, retuned bloom. All quality-tiered.

**Additional layers not originally requested but in scope:**

- **Dither in the sky shader** (`(hash(gl_FragCoord.xy) - 0.5) * 0.0045`). Deep space is nothing but dark gradients; without this it bands visibly on every display.
- **`fwidth()`-based anti-aliasing** on orbit rings and connector lines so they hold 1px at every zoom level.
- **A dev-only camera authoring GUI** that lets a pose be flown to and dumped as JSON per node. Every studio that does this well authors camera in-browser rather than re-exporting from Blender.
- **A quality-tier system** as a first-class concept — one detection feeding particle count, shader complexity, post-FX chain, and DPR.

### 4.6 Content honesty

Six of nine projects currently render "Pending verification" while several are deployed and publicly reachable. Each live URL is confirmed public-safe, then linked.

The site's entire argument is evidence. Shipping it with its strongest evidence unlinked is the most self-defeating thing in the current build, and the cheapest to fix.

---

## 5. Explicitly out of scope

- A CMS or admin UI. Data stays in typed TypeScript files.
- A router with real per-project pages. Deep links are query-param driven against the single page.
- Multiplayer, visitor presence, or any realtime backend.
- Blog, writing, or long-form article surfaces.
- Analytics beyond Vercel's own.
- Three.js or TresJS version upgrades. Both stay pinned; any upgrade is its own PR with a full visual QA pass.

---

## 6. Success criteria

### Must hold — non-negotiable

| # | Criterion | Measured by |
|---|---|---|
| M1 | Every project reachable by keyboard alone, on every breakpoint | Manual tab-through on mobile, tablet, desktop |
| M2 | Every modal traps focus and restores it to the trigger on close | Manual test per overlay |
| M3 | `?plain=1` does not download the 3D stack | Network panel: no `three` chunk requested |
| M4 | Mobile first load ships no WebGL engine it does not use | Network panel on a phone profile |
| M5 | No blocking interstitial on any device | Absence of `MobileBestExperienceNotice` |
| M6 | Reduced motion produces a genuinely static experience | No render loop running under the media query |
| M7 | `npm run typecheck` and `npm run build` clean | CI-equivalent local run |
| M8 | Plain mode contains every piece of content in the full experience | Content diff |

### Should hold — performance

| # | Target |
|---|---|
| P1 | 60fps sustained on desktop Chrome at the default quality tier |
| P2 | ≥30fps on a mid-tier Android phone; no thermal runaway over 2 minutes |
| P3 | Initial JS for the interactive route below the current 313 kB gzip, despite added features |
| P4 | Zero forced layout reads inside any per-frame loop |
| P5 | Render loop stops when the scene is off-screen or the tab is hidden |
| P6 | Exactly one animation clock; no orphaned rAF chains |

### Should hold — experience

| # | Target |
|---|---|
| E1 | A visitor can reach any project's evidence within 15 seconds of first paint, without scrolling the universe |
| E2 | The mapping is understandable without a legend |
| E3 | Sound is off until asked for, and never surprises anyone |
| E4 | Nothing on screen is decorative-pretending-to-be-data |

---

## 7. Open questions

Carried into `PLAN.md` rather than blocking:

1. **Project dates.** Orbital angle encodes chronology, but `projects.ts` has no date field. Needs either a `started`/`shipped` date per project, or angle falls back to a stable derived ordering.
2. **Which live URLs are safe to publish.** Six projects have Vercel deployments. Each needs an explicit yes before it ships.
3. **Whether the `EVIDENCEBOUND` name survives.** It is strong and it is also a second thing for a visitor to decode alongside the universe metaphor.
4. **Whether the "Cost of Intelligence" slider concept returns.** The data model still carries `sliderConfigs` and `sliderResponse`; the UI was deferred and never built. Either build it into project panels or delete the dead data.
