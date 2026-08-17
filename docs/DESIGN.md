# Design

The universe, and why every part of it is the way it is.

This is the primary design document. `PRD.md` says what we are building and why; this says what it looks like, how it behaves, and which specific techniques implement it. Every technique named here comes from a shipped, studied reference — cited inline so a decision can be traced rather than trusted.

---

## 0. What this is for

The site generates leads for paid project work. See `PRD.md` for the buyer and the funnel.

That commercial goal is what justifies the ambition rather than competing with it. The offer being sold is *AI engineering plus genuine interaction craft* — a combination most AI freelancers cannot claim. **The portfolio being an extraordinary interactive artifact is the proof of that claim**, delivered before a word is read. The universe is the demo, not the decoration.

The constraint it creates: the experience must impress in three seconds and get out of the way in sixty. Everything below is designed against both halves of that.

---

## 1. The idea

**A person is not a list of projects. A person is a system with a center of mass.**

The site is a solar system in which Parth is the star and the work orbits him. That much is obvious from the brief. What makes it design rather than decoration is a stricter rule:

> **Every visual property is derived from project data. If a property cannot be justified by data, it is cut.**

This is not an aesthetic preference. The site's entire argument is *evidence* — systems that act only after the evidence agrees. A portfolio making that argument in a universe of hand-placed, meaningless stars refutes itself. The current build places every node position as a literal typed coordinate. That is the single thing this redesign most needs to undo.

The standard to hold this to is **Shirley Wu's *Legends*** (`shirleywu.studio/legends`) — 51 female Nobel laureates rendered as 3D crystals whose *form is generated from each laureate's Wikipedia data*. The geometry is the encoding, not a decoration wrapped around a label. That is the bar.

### The name

**EPHEMERIS.** An ephemeris is a table giving the computed positions of celestial bodies at given times.

It names the rule above rather than restating the thesis: positions are *computed*, never authored. It is astronomical without being decorative, and unlike `EVIDENCEBOUND` it does not ask a visitor to decode a second concept alongside the universe — it describes the universe they are already looking at.

---

## 2. The mapping

Twelve projects. Seven axes. Nothing arbitrary.

*(The count is deliberately the only number in this document that names it. Everywhere else says "every project" — prose that hardcodes a count goes stale the moment one ships, which is exactly what happened to this file twice.)*

| Axis | Encodes | Derived from | Why this axis |
|---|---|---|---|
| **Orbital radius** | Maturity | `status` + whether links resolve to something live | Closeness to the star reads instinctively as "finished, mine, real." Shipped work sits close; exploration sits far. |
| **Body size** | Evidence depth | `weight` + count of metrics, milestones, artifacts | Size is the most immediately comparable visual property. It should carry the thing the site is about: how much can actually be proven. |
| **Orbital angle** | Chronology | project date | Position around the ring is a natural clock. Reading the system clockwise reads the career. |
| **Orbital speed** | Recency of contact | `status` | Active work visibly moves. A dormant project is nearly still. Motion means attention, which is true. |
| **Moons** | Stack | `stack[]` | Technologies orbit the project that uses them. A shared technology visibly recurs across systems. |
| **Cluster / arm** | Domain | capability matching | RAG, agents, diffusion, fraud ML, medical resolve as regions at galaxy scale. |
| **Apparent magnitude** | Label priority | derived composite | Governs when a label appears. See §6. |

**Positions are computed at runtime from data.** Adding a project means adding a record, not typing coordinates. The hard limit that used to be baked into `particle.vert.glsl` — `uniform float uClusterBrightness[9]`, which broke silently at ten projects — was removed on 2026-08-17; the array is now sized from `projects.length` via a `CLUSTER_COUNT` define. Node *positions* are still literal coordinates in `projects.ts`; that is what this section remains about.

### The honesty problem, and the honest solution

True-scale orbital layout will look bad. A real solar system is 99.99% empty, and a dozen projects laid out at honest relative distance produce a sparse, unreadable field. Every space visualization hits this.

`solarsystemscope.com` solves it correctly: **ship both, and label which one the viewer is in.** A schematic mode compresses distances for legibility; a true mode shows honest proportion. The toggle is not a settings afterthought — **the disclosure is itself part of the information design**. A site about evidence should be visibly candid about when it is compressing the truth for readability.

Default is schematic. The toggle is one control, always visible at system scale.

### Scale is felt through comparison, not magnitude

`neal.fun/size-of-space` is the most effective scale piece on the web and it never asks you to comprehend 10²⁶ metres. It shows each object **next to the previous one**, forty times in a row. You only ever process "this is bigger than that."

Applied here: when the camera approaches a project, the previously-focused project stays in frame, receding. Depth is felt as a chain of comparisons rather than an impossible single tableau. This costs nothing and does more emotional work than any shader.

---

## 2b. The conversion layer

The universe is the top of the funnel. It is not the funnel.

A visitor arriving from cold outreach — on a phone, skeptical, sixty seconds of patience — must be able to land, be impressed, and book a call **without ever flying through space**. If the universe is the only route to contact, it becomes a toll booth and the site stops earning.

### Show before telling

The site currently contains **no images at all**. For the buyer it now serves, that is the largest single defect in the product, larger than anything in the technical audit.

Every project inverts its opening:

| | Layer | Note |
|---|---|---|
| 1 | **Screenshot** | The product, working. Non-negotiable. |
| 2 | **Outcome** | What it does, for whom, in plain language |
| 3 | **Try it live** | Where a deployment resolves publicly |
| 4 | Problem / Architecture / Proof / Boundary | The existing panels — excellent, and the *second* layer |

The evidence panels are not being demoted because they are weak. They are strong, and they are the wrong opening move for someone deciding whether to spend money. A technical buyer reaches them one scroll later; a client never has to.

### Persistent contact

A booking action is reachable in one tap from every screen, at every breakpoint, in both guided and free modes. It does not hide behind the About overlay, and it does not require reaching the end of a scroll narrative.

Ranked, not equal — four co-equal buttons dilute intent:

1. **Booking link** — primary
2. **Contact form** — for those not ready to talk
3. **Email** and **WhatsApp** — always visible, direct

No prices. Every path leads to a conversation.

### Trust surface

A photo and a first-person intro. Clients hire people, and there is currently no image of Parth anywhere on the site.

Testimonials have no home in the current design because none exist. The layout reserves the slot rather than pretending otherwise — an empty, honest space is correct, and it becomes the highest-value thing to fill.

---

## 3. Structure: two modes, one scene

This is the most important structural decision, and it comes from **NASA's Eyes on the Solar System** — which ships a guided scrollytelling presentation layer *on top of* a free-orbit simulation, over identical data.

| Mode | Camera authority | For |
|---|---|---|
| **Guided** | Scroll drives a scripted path | The recruiter with 40 seconds. Arrives by default. |
| **Free** | User drags to orbit, pinches to zoom | The explorer. Unlocked by any direct manipulation. |

Neither is a downgrade of the other. This is what resolves the central tension in the brief: extraordinary without being a toll booth.

Transition between them is implicit — the moment the user drags, guided scrub yields to free orbit, and a quiet "resume tour" affordance appears. No modal, no mode picker.

### The 40-second path

Independent of both modes, a real DOM index of every project exists in the document on every breakpoint. Keyboard-navigable, screen-reader-complete, crawlable, deep-linkable.

Quiet on desktop, primary on mobile. **This is what fixes the current desktop keyboard lockout**, where the projects — the entire point of the site — are reachable only by `pointermove`.

### The Snow Fall warning

The NYT team's own retrospective on Snow Fall says their hardest work was *removing* elements that felt duplicative or fatiguing, and "Snow Fall fatigue" became a real critique aimed at the best-resourced newsroom on earth.

The defence here is the derivation rule in §1. Every element must survive one question: **what data determined this?** Anything that cannot answer is cut, however beautiful.

---

## 4. Camera and scale

### Zoom is field-of-view, not dolly

From **100,000 Stars** — the closest precedent to this concept and the most candid engineering write-up available on it.

Narrow the FOV on approach; widen it on retreat. This sidesteps near-plane clipping across a scale range spanning galaxy to project, which is the classic killer of multi-scale space scenes. It is also the most expressive camera move available: the *amount* of FOV effect changes the interpreted scale of the whole scene.

### Rotate the scene, not the camera

Also from 100,000 Stars. Drag-to-orbit becomes trivial, and camera math reduces to a single `position.z` for zoom. Far simpler than orbit controls, and far more predictable under scroll scrubbing.

### Zero out rotation on approach

The float-precision fix, and the one nobody anticipates: when the camera closes on a node, **zero the global scene rotation and rotate the target node plus its environment locally instead.** The viewer appears to orbit; coordinates never drift from the origin.

Without this, flying from constellation scale down to a single project accumulates floating-point error and the scene visibly jitters. Related non-negotiables:

- **One declared unit, never broken.** 100,000 Stars used 1 GL unit = 1 light year. Here: one unit = one derived orbital unit, declared once.
- **The scene stays centered on the origin.** Never translate the `Scene` itself.
- **Prefer tight near/far planes over `logarithmicDepthBuffer`** — it measurably degrades performance with many overlapping transparent objects and has documented desktop/mobile inconsistency.
- Offset coincident geometry by ~0.001 rather than sharing exact coordinates.

### The scroll → camera contract

This exact chain recurs across every good implementation studied (Codrops, Ridgeline, Prometheus, the Lenis ecosystem):

```
Lenis → ScrollTrigger (pin + scrub: 1) → one GSAP timeline
      → two plain mutable objects { cameraPos, cameraTarget }
      → read in the render loop
```

Two rules, both of which the current build violates:

1. **GSAP never writes `camera.position` directly.** It mutates a plain object; the render loop reads it. This is the documented fix for scroll-driven camera jitter.
2. **Scroll progress never touches reactive state.** In Vue this means a module-scoped plain object or `shallowRef` — never a deep `ref`, or TresJS diffs on every frame.

Camera path is **data, not code**: an array of `{ scrollProgress: {start, end}, camera: {x,y,z}, target: {x,y,z}, activeNode }`. 100,000 Stars explicitly named "data mixing too much with code" as its own biggest regret. We take the lesson for free.

Easing is per-segment via `CustomEase`, never global. Linear camera moves read as cheap; small variations in acceleration dominate perceived quality.

### Author the camera in the browser

Every studio that does this well authors camera live rather than re-exporting from Blender. **Active Theory** built an in-browser parameter editor so an art director could tune the entire camera flow without a DCC round-trip.

A dev-only GUI (Tweakpane) lets a pose be flown to and dumped as JSON per node. This is a tooling investment that pays back within a day of iteration.

---

## 5. Look

### Palette

The existing CRYO-GOLD identity is genuinely good and survives. What changes is that it becomes **the single source of truth for both DOM and WebGL** — currently the 3D layer hardcodes eight hexes that do not match the legend swatches describing them.

Star color is not authored per node. Following 100,000 Stars: each node carries **one normalized float attribute**, and the shader indexes a **color-ramp texture**. Enormous attribute-buffer saving, art-directable palette in a single image, and the color literally means something because the float is derived.

### Materials

**Iridescent thin-film shading on the center star.** Dogstudio's KIKK 2016 bubble is the reference — it is the most "premium and otherworldly" material available for a sphere and it is cheap.

**Matcaps for project bodies.** Bruno Simon's portfolio has *no lights at all* — matcaps everywhere, with faked bounce light from vertex distance to ground × `dot(abs(normal), up)`. This is directly relevant: the current build runs **10 dynamic PointLights** through `MeshStandardMaterial`, meaning the PBR fragment shader loops over all ten for every fragment. That is the single largest mid-tier GPU cost in the scene, and matcaps eliminate it entirely while *increasing* art direction control.

### Two shader lines that are not optional

```glsl
// 1. Dither — kills 8-bit banding in dark gradients.
//    Deep space is nothing but dark gradients. Without this it bands on every display.
color += (hash(gl_FragCoord.xy) - 0.5) * 0.0045;

// 2. fwidth() anti-aliasing on orbit rings and connector lines,
//    so they hold 1px at every zoom level across the whole scale range.
float aa = fwidth(dist);
float line = smoothstep(w + aa, w - aa, dist);
```

### Near-field parallax particles

From `neal.fun/deep-sea`: **in empty space, motion is invisible without something close to the camera.** A sparse near-field dust layer is what makes camera movement legible. The current particle field is all mid-and-far; adding a thin near layer is the cheapest possible improvement to the sense of travel.

### Post-processing

Retuned bloom, depth of field racking focus onto the approached node, restrained chromatic aberration during fast motion, film grain. All quality-tiered (§8).

**One hard constraint discovered in research:** the fast CSS3D occlusion technique (`blending: THREE.NoBlending` hole-punch) **breaks under post-processing**, because bloom overwrites the transparent region. Since glowing stars are non-negotiable here, occlusion must use raycast-against-the-nine-meshes with opacity fade instead. See §6.

---

## 6. Labels in 3D space

The hardest solved-but-unobvious problem in the whole build.

### Positioning

At this node count, skip `CSS2DRenderer` and project manually into Vue state:

1. `vec.project(camera)` → NDC
2. `x = (ndc.x * 0.5 + 0.5) * width`, `y = (-ndc.y * 0.5 + 0.5) * height`
3. **`if (ndc.z > 1) hide`** — otherwise labels for objects *behind the camera* render mirrored into the viewport. This is the bug everyone ships, and the current `NodeLabel` implementation has exactly this shape of cull.
4. `pointer-events: none` on the container, re-enabled per interactive label
5. Fade via CSS opacity transitions — **never `display: none`**

### Occlusion

Raycast against only the nine star meshes (cheapest and most controllable — drei's `<Html occlude={[refs]}>` semantics), then **fade opacity rather than hiding**. A label snapping off is far more jarring than one fading. drei exposes `onOcclude` specifically so the transition can be animated rather than hard-flipped.

### Decluttering by magnitude

From **Stellarium Web**, which keeps a 600,000-star catalog readable: label visibility is a **function of importance × zoom**, not a fixed set.

Each project carries a derived apparent magnitude. Labels appear as the camera approaches and the magnitude threshold rises. **Label detail itself has levels**: dot → short name → full card. Nine labels never all render at once unless zoomed to overview, and at that scale they are short.

### DOM or WebGL?

Both, deliberately:

- **MSDF text in WebGL** for in-space labels that must live among the stars — occludes correctly, shader-animatable, zero relayout. Igloo Inc animates text purely by swapping SDF texture offsets in a shader.
- **Real DOM** for anything a recruiter or a crawler must read.

100,000 Stars is candid that DOM labels pixelate on zoom (the renderer rasterizes text into a textured quad) and cannot be occluded by WebGL geometry. They ended up mixing both techniques in one scene. So do we — on purpose rather than by accident.

---

## 7. Sound

Muted by default. One toggle in fixed chrome. Preference persisted across every transition.

### The policy constraint is the design

`AudioContext` is `suspended` until a user gesture; `context.resume()` must be called inside the first click handler. Bruno Simon's start-button loader exists *because of* this restriction.

**Turn the constraint into ceremony.** The loader's start control is the gesture that unlocks audio — which is also the honest moment to ask.

### Model: reactive-first

**Patatap** (`patatap.com`, Jono Brandel × Lullatone, built on Two.js + Web Audio) has **zero ambient bed — 100% reactive.** Silence until you act. Nothing to mute, nothing to annoy.

This is the safest possible model for a portfolio: a recruiter who never interacts hears nothing; someone who explores is rewarded. A light ambient bed layers in only at system and galaxy scale, and **is silenced entirely under the resume and experience overlays** — nobody should read a CV with music under it.

### One tuned note per star

Nine short sounds, **all in one scale**, so any order of exploration sounds musical. That is craft, and it is cheap.

### Anti-repetition is the whole trick

From Bruno Simon's case study — the most actionable audio detail found anywhere:

> Several similar files per event, chosen at random, with **volume *and playback rate* randomized per instance**, plus a limiter capping simultaneous playback.

This is precisely what separates crafted audio from a soundboard. Without it, hovering nine stars repeatedly becomes unbearable within thirty seconds.

### Pre-render, don't synthesize

`ambient.garden` ships a "frozen" landscape of **pre-rendered loops** as its default, reserving live WebAssembly DSP for an opt-in mode. Get the aesthetic benefit of generative audio at the cost of static files.

Also from 100,000 Stars, learned the hard way: they *cut* generative Web Audio because it crashed Chrome, fell back to two `<audio>` elements cross-triggering on `ended`, with a deliberate 15-second silence between loops "to prevent listener fatigue" — and even that did not loop perfectly.

### The one filter worth more than everything else

**A `BiquadFilterNode` lowpass engaging when a project opens.** The ambient bed instantly sounds like it is in an adjacent room. One node, and it sells spatial continuity better than any amount of reverb.

**Tone.js** for transport and scheduling; **Howler.js** for the sample pools with rate control. Hand-rolled `AudioBufferSourceNode` timing is where nearly all amateur web audio falls apart.

---

## 8. Performance

### Quality tiers as a first-class concept

One detection feeds particle count, shader complexity, post-FX chain, and DPR. The current build tiers particle count but leaves the sky shader — ~84 noise evaluations per fragment, fullscreen, every frame — completely un-tiered. It is the largest GPU cost in the app.

| Tier | Sky shader | Particles | Post-FX | DPR |
|---|---|---|---|---|
| High | Full fbm | Full | Bloom + DOF + grain | ≤2 |
| Medium | Reduced octaves | Reduced | Bloom only | ≤1.5 |
| Low | Ramp texture, no noise | Minimal | None | 1 |

**Clamp `pixelRatio` to 2.** Modern phones report up to 5.

### One clock

The current build runs four independent animation clocks and `ScenePauseController` pauses only one of them. Off-screen, the desktop scene keeps rendering bloom, particles and ten lights indefinitely, because `@tresjs/core` has no `visibilitychange` or `IntersectionObserver` pausing.

Target: **exactly one loop**, which stops when the scene is off-screen or the tab is hidden.

### Bake expensive things

Lusion bakes Houdini cloth into ArrayBuffers and PNGs, storing vertex animation as **16-bit ints with a divider** and interpolating 11 keyframes into 66. Ridgeline moves particle motion into the **vertex shader** so positions upload once and the shader does the drifting.

Applied here: orbital motion is computed in the vertex shader from a per-instance phase attribute. Positions upload once. The CPU never touches a star per frame.

### Dirty-flag transforms

Active Theory's Hydra tracks dirty flags so transforms only recompute when properties actually change — they name high CPU as the reason laptop fans scream during WebGL experiences. In Three.js terms: `matrixAutoUpdate = false` on static stars, updated manually.

### Pre-render what must be perfect

Apple's most-copied scroll moment — the AirPods Pro page — is **148 JPEGs drawn to a canvas**, indexed by scroll position. Zero decode jank, perfectly deterministic. Apple's "premium" is frame-perfection and restraint, not richness. Their product pages are also silent.

Persepolis Reimagined goes further: it hands off **invisibly between pre-rendered video and live WebGL using a chroma-key shader**, with color grading and camera pose matched across the cut.

If the intro — the universe assembling around the center — cannot hold its frame budget live on a mid-range laptop, it gets pre-rendered and handed off at a matched camera pose. That is not a compromise; it is what the reference-quality sites actually do.

### Loading

A synchronous visibility guard in `<head>`, removed by the loader, **with an 8-second failsafe timeout** so a failed load never leaves a blank page:

```html
<style id="fp-guard">body > *{visibility:hidden!important}</style>
```

Real asset progress, transitioning *into* the universe as one continuous move with no cut.

---

## 9. Mobile

Not a smaller desktop. A different choreography over the same scene and the same data.

| | Desktop | Mobile |
|---|---|---|
| Guided camera | scroll scrub | scroll scrub |
| Free camera | drag orbit, wheel zoom | drag orbit, **pinch zoom** |
| Select | hover → click | **tap** |
| Index | quiet side rail | **primary surface** |
| Labels | on hover | **always at magnitude threshold** (no hover state exists) |

### Two rules that are not negotiable

From The Pudding's own scrollytelling documentation, learned across dozens of published pieces:

1. **Pixel offsets, not percentages.** Percentage offsets jump when mobile browser chrome resizes the viewport mid-scroll.
2. **Avoid `vh` units.** Scrolling fires constant resize events on mobile.

These two are the single biggest killer of scroll-driven 3D on phones. The current build uses `h-[400vh]`, `min-height: 220vh`, and `padding-top: 148vh`.

### Structural fixes this delivers

Moving to one scene removes, in a single change: the 768–820px dead zone, WebGL context destruction on every resize across 767px, and the byte-for-byte duplicated star renderer (`seededRandom` is currently copy-pasted verbatim between the two paths).

And the interstitial telling mobile users that "desktop unlocks the full constellation controls" is deleted outright.

### Bruno Simon's concession

He openly admits that adding an on-screen joystick and speed buttons on mobile **contradicts his own "no interface" philosophy** — and that it was correct anyway.

Worth internalizing: **on mobile, explicit controls beat interface purity.** Visible zoom and reset controls, not just gestures.

---

## 10. Accessibility

Not a compliance section. Two of these are the most severe defects in the current build.

- **Every project reachable by keyboard on every breakpoint.** Currently impossible on desktop.
- **Focus trapped in every modal, restored to the trigger on close.** Currently neither.
- **Reduced motion produces a genuinely static experience** — no render loop at all, not a shorter animation. Currently reduced-motion users still get the full WebGL scene mounted and animating.
- Canvas carries a text alternative; a skip link exists.
- Film-strip tabs get real `role="tablist"` / `aria-selected` semantics.
- Sound never starts itself.
- `?plain=1` stays complete, and becomes **discoverable** — it is currently unreachable from any link in the UI and absent from the sitemap, despite being described in-code as "the complete crawlable version."

Consider **Reka UI** (Radix Vue) for dialogs, panels and sliders. NASA's Eyes team deliberately used an accessible off-the-shelf primitive library and themed it, to spend their design budget on the 3D instead. That trade is correct here too.

---

## 11. What we are deliberately not doing

- **Not a continuous single take.** Discrete destinations (Cartier's six rooms, Igloo's crystals) are easier to author, easier to deep-link, easier to make performant, and they do not punish adding a tenth project.
- **Not free-roam only.** A recruiter with 40 seconds needs the guided path to exist.
- **Not photorealistic planets.** Kurzgesagt's illustrated approach is why 60 orders of magnitude stay visually coherent — you cannot photograph a quark and a galaxy cluster in one consistent style. Stylized and consistent beats realistic and mismatched.
- **Not live generative audio.** Pre-rendered loops. 100,000 Stars crashed Chrome trying.
- **Not a physics playground.** Bruno Simon's car is brilliant and is a different site. Ours has to be readable in 40 seconds.
- **Not more.** The Snow Fall lesson is that the hard work was removal.

---

## 12. Reference index

Cited above, worth returning to:

| Reference | What to take |
|---|---|
| **100,000 Stars** (`web.dev/case-studies/100000stars`) | FOV-as-zoom, rotate-the-scene, zero-out-rotation-on-approach, color-ramp texture, one declared unit, camera-as-data |
| **NASA Eyes on the Solar System** | Guided + free dual mode; one consolidated side panel; accessible off-the-shelf 2D chrome |
| **Shirley Wu — Legends** | Geometry generated from data. The standard for rigour. |
| **Size of Space** (neal.fun) | Pairwise comparison instead of absolute scale |
| **Deep Sea** (neal.fun) | Near-field parallax; emptiness as information; restraint |
| **Solar System Scope** | Real-scale vs schematic toggle, labelled |
| **Stellarium Web** | Magnitude-driven label culling |
| **Bruno Simon** | Matcaps over lights; velocity-randomized sample pools; mobile explicit controls |
| **Patatap** | Zero ambient, fully reactive audio |
| **ambient.garden** | Pre-rendered loops over live DSP; autopilot idle state |
| **Igloo Inc** | Procedural geometry from data; SDF text in shader; KTX2 |
| **Active Theory (Prometheus, Hydra)** | In-browser camera authoring; ping-pong rendering; dirty-flag transforms |
| **Lusion v3** | Bake simulation into buffers; parallel mobile asset track |
| **Apple product pages** | Pre-render what must be perfect; silence; restraint |
| **Persepolis Reimagined** | Chroma-key handoff between pre-rendered and live |
| **Codrops cinematic-scroll tutorials** | The two-mutable-objects camera pattern |
| **Ridgeline build log** | Measured perf playbook; dither; `fwidth()`; loader failsafe |
| **The Pudding process docs** | Scrollama; the two mobile scroll rules |
| **NYT Snow Fall retrospective** | Choreograph motion to reading pace; remove things |
| **The First The Last** (SOTY 2022, 2024) | Nuxt + WebGL + PixiJS + GSAP — Vue is not a handicap |
