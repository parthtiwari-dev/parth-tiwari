# Design skill repos: what they actually encode

Research pass for the v2 portfolio rebuild. Nine repos cloned and read on 2026-08-26.
Every repo was cloned with `git clone --depth 1` and read from disk, not summarised from a
README or a web page. Star counts and dates come from the GitHub REST API on the same day.

Raw copies of the files worth keeping are in [`raw/`](./raw/), one folder per repo. Nothing
over 50KB was copied and no whole repo was copied.

Quotes are verbatim from source files, including their punctuation. Everything outside a quote
is my own summary. Where I could not verify a claim I say so.

**Priority note.** The owner rejected round one as too safe ("nothing feels out of this world").
Sections 2 and 3 are the ambition material and lead the document for that reason. Sections 4
and 5 are the craft floor that keeps ambition from turning into the v1 failure. Read 2, 3, 5
and 12 if reading nothing else.

---

## 1. The table

| Repo | Resolved URL | Author and credibility | What it actually covers | Install as a skill? |
|---|---|---|---|---|
| `MengTo/Skills` | https://github.com/MengTo/Skills | Meng To. Founder of Design+Code, author of the *Design+Code* book. Long-standing, verifiable design-education credibility. 5,438 stars, MIT, last push 2026-08-18. | 60+ skills. The ambition set: `build-awwwards-quality-sites`, `build-threejs-scroll-worlds`, `animation-systems`, `atmosphere-background`, `beam-glow-states`, `beautiful-shadows`, `agency-grid-layout-minimal`. Also capture and prompt workflows. | **Yes, selectively.** This is now the highest-value repo for the ambition brief. Install `animation-systems` and keep `build-awwwards-quality-sites` open as an acceptance checklist. Do not install the game-dev half. |
| `ConardLi/garden-skills` | https://github.com/ConardLi/garden-skills | ConardLi. Well-known Chinese frontend developer and content creator. Trilingual repo with CI skill validation. 10,741 stars, MIT. | `web-design-engineer` plus **25 named style recipes** with real hexes, radii, easings, signature moves and "don't use when" clauses. Three of the 25 are a Motion / Experimental school aimed squarely at spectacular work. | **Yes, for `references/style-recipes/`.** The single most directly actionable artifact in the haul. The workflow half is heavier than needed. |
| `emilkowalski/skills` | https://github.com/emilkowalski/skills | Emil Kowalski. Author of [Sonner](https://sonner.emilkowal.ski) (13M+ weekly npm downloads, his own figure) and [Vaul](https://vaul.emilkowal.ski); ex-Vercel, ex-Linear; runs animations.dev. Credibility rests on shipped libraries, not a following. 32,637 stars, MIT. | Motion decision-making with exact curves, durations, spring configs, gesture physics, interruption, clip-path technique. Plus an Apple WWDC distillation and a curated library picker. | **Yes.** The most credible source here. Install `animate`, `review-animations`, `apple-design`. `emil-design-eng` is the 674-line master file. |
| `codeswithroh/tastemaker` | https://github.com/codeswithroh/tastemaker | Rohit Purkait. Individual developer; no institutional design credential I could verify. 206 stars, MIT, last push 2026-08-22. | A 55KB skill plus 24 references: a 52-gate anti-slop checklist, **12 named page macrostructures**, a six-beat narrative arc, hero budget rules, measured section-padding ranges, contrast gates, runnable Python validators. | **Partly.** Do not install the whole thing. Do steal `macrostructures.md`, `narrative-arc.md`, `hero-guidelines.md`, `anti-slop-checklist.md` and the section-padding numbers. Its motion values are lifted from Emil Kowalski; install his instead. |
| `jakubkrehel/skills` | https://github.com/jakubkrehel/skills | Jakub Krehel. Founding design engineer at Interfere; runs [interfaces.dev](https://interfaces.dev), a design engineering magazine. 4,435 stars, MIT, last push 2026-08-24 (most actively maintained of the nine). | Eleven domain skills with a shared review protocol: typography, colors, layout, accessibility, UI polish, writing, orchestration. Exact values everywhere and an explicit severity and verification format. | **Yes.** The broadest set of concrete non-motion rules, and the best complement to Emil. Install `better-ui`, `better-typography`, `better-colors`, `better-accessibility`, `better-layout`, `better-writing`. |
| `elayadesign/ai-design-skills` | https://github.com/elayadesign/ai-design-skills | "Elaya" (@elayadesigns on X). Design-focused individual account; no verifiable employer or shipped product. 1,402 stars, MIT, pushed once on 2026-07-29 and untouched since. | One 17KB skill: landing page intake, page structure, conversion copy formulas, then a rigid visual system (font bans, spacing table, radius formula, closed hex list, motion choreography, a mandatory scroll-reveal section). | **No, do not install. Mine it.** Part A (strategy) is directly useful for a lead-generating portfolio. Part B is one person's taste written as law and it contradicts better sources on five separate points. |
| `petergyang/no-ai-slop` | https://github.com/petergyang/no-ai-slop | Peter Yang. Product Lead at Roblox, previously Reddit, Twitch and Meta; writes the "Behind the Craft" newsletter. 6,050 stars, MIT. | One skill: named AI-writing patterns with rewrites, plus a 25-item `eval.md` self-check. Detect mode names patterns rather than scoring. | **Yes.** Already adopted in this project (`CLAUDE.md` documents a 2026-08-21 audit). The `eval.md` gate is the part most people skip. |
| `Owl-Listener/designer-skills` | https://github.com/Owl-Listener/designer-skills | "MC Dean". 241 skills across 33 plugins. 2,298 stars, MIT. Breadth is the selling point. Credibility unverified beyond the repo itself. | Textbook UX and UI curriculum as skill files: Gestalt laws, spacing systems, type scales, measure, motion tokens, research methods, design ops. | **No.** Correct but generic. Every rule I checked exists at higher specificity in jakubkrehel's set. 241 medium-specificity skills is worse than 11 high-specificity ones. |
| `haowjy/creative-writing-skills` | https://github.com/haowjy/creative-writing-skills | "haowjy". Individual, no verifiable credential. 426 stars, Apache-2.0. Oldest repo here (created 2025-10-25). | Fiction: eleven agents, genre resources, scene construction, continuity checking. Two general-purpose files hide inside: `llm-writing/SKILL.md` and `writing-principles/SKILL.md`. | **No.** Off-topic. Read `llm-writing/SKILL.md` once for its nine-item "what to delete" list; skip the other 196 files. |

**The three truncated names, resolved:**

- `elayadesign/ai-des...` is **`elayadesign/ai-design-skills`**, containing one skill,
  `landing-page-design`. A sibling repo `elayadesign/redesign-skill` is named in the SKILL.md
  as its companion for upgrading existing sites; not cloned.
- `codeswithroh/taste...` is **`codeswithroh/tastemaker`**. Confirmed. Note that at least two
  unrelated repos are also called "taste-skill" (`senlindesign/taste-skill`,
  `leonxlnx/taste-skill`); different projects, not examined.
- `Owl-Listener/desig...` is **`Owl-Listener/designer-skills`**. Confirmed. The same author
  also publishes `ai-design-skills`, `inclusive-design-skills` and `designpowers`; not examined.

---

## 2. MengTo/Skills: the ambition material

Source files, all in `raw/MengTo-Skills/` unless noted:
`build-awwwards-quality-sites_SKILL.md`, `animation-systems_SKILL.md`,
`design-first-ui-prompting_SKILL.md`. Six further files read from the clone but not copied:
`web-design/build-threejs-scroll-worlds/SKILL.md`, `web-design/atmosphere-background/SKILL.md`,
`web-design/agency-grid-layout-minimal/SKILL.md`, `web-design/beam-glow-states/SKILL.md`,
`web-design/beautiful-shadows/SKILL.md`, `web-design/animation-on-scroll/SKILL.md`.

### 2.1 What "ambitious" means here, stated as an acceptance bar

`build-awwwards-quality-sites` opens by refusing to treat the phrase as a claim:

> "Treat 'Awwwards quality' as an acceptance bar, never as an award or recognition claim."

and closes the loop at the end:

> "Never describe the result as award-winning or Awwwards-recognized unless the user provides
> verifiable evidence."

The bar itself, quoted in full because it is the most useful single sentence in the repo for
this brief:

> "Require a distinct art-directed idea, memorable first viewport, disciplined typography and
> spacing, intentional image crops, authored transitions, and refined hover, focus, active,
> loading, disabled, error, touch, and reduced-motion behavior."

Six ingredients, and five of the six are craft rather than spectacle. The spectacle is one
item: "memorable first viewport".

### 2.2 The hero carries the ambition budget, and it must survive being broken

> "Make the first viewport the site's strongest authored moment."

Four constraints on it, from section 3 of that file:

- "Create a composed GSAP intro sequence for the hero. Keep navigation, primary message, and
  CTA readable and usable **before the animation completes**."
- "Make pointer effects additive. Support touch, keyboard, coarse pointers, window blur, and
  visibility changes without leaving the interface in an incomplete state."
- "Design a **static first frame** that remains complete when JavaScript, media playback,
  WebGL, or motion is unavailable."
- Build "a complete semantic page, not a hero-only concept".

That third rule is the one v1 needed. The creative layer has to be a layer, with a complete
page under it that stands on its own.

### 2.3 Motion system rules (from `build-awwwards-quality-sites`)

- **GSAP is the primary animation system.**
- **Exactly one smooth-scroll engine.** "Evaluate Lenis and Locomotive Scroll, then choose
  exactly one as the site's sole smooth-scroll engine. Never install or initialize both."
  Connect it to ScrollTrigger, refresh measurements after media and font changes, destroy it
  during cleanup.
- **Reduced motion bypasses smooth scroll and scrubbed timelines entirely.** "Render final
  states immediately instead of merely shortening animations."
- **Choreograph section by section.** "Reveal major headings word by word with a restrained
  stagger, then sequence supporting copy and media."
- **The split-text accessibility rule**, a real defect class I did not see stated anywhere else
  in this haul: "Preserve an unsplit accessible name for staggered text. Hide decorative split
  words from assistive technology, never split links or meaningful inline markup, and keep the
  unsplit content visible without JavaScript."
- **Never let two systems own one property.** "Use CSS for simple hover, focus, and tap states.
  Reserve ScrollTrigger for justified scrubbed or pinned sequences and avoid multiple systems
  controlling the same property."

### 2.4 `animation-systems`: the numbers

Duration defaults. These are looser than Emil Kowalski's and explicitly allow long hero
sequences, which is the permission structure the ambition brief needs:

| Tier | Duration |
|---|---|
| Micro (hover, press) | 120-200ms |
| UI state change (toggle, select) | 180-260ms |
| Small transitions (popover, toast) | 220-320ms |
| Page section entrance | 400-800ms |
| Hero sequences | **800-1600ms**, with internal beats |

Four motion primitives to build once and reuse everywhere:

- **Fade + rise** (default entrance): opacity 0 to 1, Y 12-24px to 0, 300-700ms depending on
  size. For text blocks, cards, modals.
- **Scale + fade** (micro emphasis): scale 0.98 to 1, opacity 0 to 1. For popovers, toasts,
  selected states.
- **Slide** (navigation): transform translate, never animated layout. For drawers, step
  transitions.
- **Morph / shared element** (high craft): tab indicators, expanding cards. "Requires
  consistent geometry + measured layout."

Other exact values in the same file:

- Stagger **40-90ms** per element, smaller on mobile.
- Scroll reveal triggers when the section is **20-30% visible**, and animates **once**.
- Hover lift: Y **-2 to -6px** plus a subtle shadow increase.
- Easing: ease-out for UI and for entering. "Avoid elastic/bounce unless brand is playful."
- "Clamp device pixel ratio in heavy canvases (1-2)".

The choreography rule that makes a page feel authored rather than assembled:

> "Primary element moves first. Secondary elements follow with small stagger. Motion
> establishes a 'reading order.'"

Hero ordering is specified: hero visual first, headline next, CTA last.

The gate: motion exists to explain hierarchy, confirm action, guide attention, maintain
continuity, or add polish. "If an animation doesn't serve one of these, delete it."

For hero moments: "Use timelines (or keyframes) with labeled beats. Lock camera/scene movement
first, then layer text."

### 2.5 `build-threejs-scroll-worlds`: read this before any 3D returns

The most rigorous 3D guidance in the haul, and it reads like a direct post-mortem of v1.

**Native scroll stays the source of truth, and story state is deterministic.** Two separate
values, not one:

```js
rig.target = progressFromScroll(scrollY);       // exact reproducible story state
rig.smooth = reduceMotion
  ? rig.target
  : damp(rig.smooth, rig.target, 5.2, dt);      // cinematic render state
```

> "Use exact progress for navigation, URLs, accessibility, foreground ownership, and
> interaction gating. Use smoothed progress for camera and visual interpolation only. The same
> scroll position must recreate the same state forward, backward, after a fast jump, and after
> reload."
>
> "Keep native scroll as the source of truth; never integrate wheel delta into story position."

**Camera as cinematography, with v1's exact failure named:**

> "Inspect the curve for wall penetration, ground clipping, target flips, speed spikes, and
> accidental close passes."
>
> "Camera motion must expose new spatial relationships: approach, reveal, passage, scale
> change, inspection, horizon, departure. Six dolly-ins aimed at the same center are not six
> scenes."

Catmull-Rom curves for broad continuous travel, segment interpolation for deliberate turns.
Parameterise by chapter progress, not raw curve arc length. Pointer parallax is added only
after the base composition works, then clamped and blended out near precise transitions.

**Measurable performance budget**, given as starting envelopes rather than success claims:

| Budget | Mobile target | Desktop target |
|---|---:|---:|
| DPR cap | 1.25-1.5 | 1.5-2 |
| Visible triangles | 150k-300k | 500k-1.2m |
| Draw calls | 50-90 | 90-160 |
| Shadowed lights | 1-2 | 2-4 |
| Simultaneous blended full-screen layers | 2 | 3 |
| Critical initial transfer | 3-6 MB | 5-10 MB |
| Steady frame time | 16.7ms ideal, 25ms fallback | 16.7ms |

Plus: cap `dt` near 1/30s after stalls; pause on `document.hidden`; "Use a quality governor
that lowers DPR and optional effects **before deleting authored landmarks**."

**Interaction:** raycast against named proxy meshes, not every decorative triangle. Every
essential hotspot mirrors to a DOM button or link in document order with a visible focus state.
Hit targets at least 44 CSS px in the DOM proxy. On touch, tap-to-focus then tap-to-activate
where accidental activation would be costly.

**Failure and access:** "Preserve native reversible scroll; do not trap the wheel or force a
custom scrollbar." Reduced motion snaps to the nearest composed chapter and retains the
complete ordered DOM story. A composed poster or chapter stills when WebGL is unavailable.
Contrast behind copy uses authored scrims or local contrast management, "not an opaque blanket
over the whole scene".

The verification list names three viewports: **1440x900, 768x1024, 390x844**, and a gesture
list: "slow, fast, reverse, scrollbar-drag, anchor navigation, reload-at-depth, and resize
between chapters".

And the honesty rule at the top of the file: "Do not disguise a video as Three.js."

### 2.6 Asset honesty rules, stricter than anything else in the haul

From `build-awwwards-quality-sites`:

- "Do not draw illustrations with model-authored SVG, CSS, or canvas paths."
- "Use photographs for every avatar. Prefer provided or appropriately licensed photos; never
  ship initials, illustrated heads, faceless silhouettes, or generated people presented as real
  customers, staff, or endorsers."
- "Omit a logo wall when no honest proof exists."
- Rejects: "generic gradient blobs, ornamental bento grids, glass applied everywhere, stock
  component layouts, fake testimonials, invented partnerships, logo-wall theater, and motion
  with no narrative role."
- Icons: Solar via Iconify. Iconify SVG Logos only for real companies in truthful contexts.
  Logo Ipsum only for explicitly disclosed fictional specimens, "never as customer proof".
- On working from references: "Generate a materially new identity, layout, copy system,
  imagery, and interaction language. Never reuse, trace, or closely reproduce reference assets,
  screenshots, source code, identity, or copy." Extract only "hierarchy, pacing, contrast, image
  treatment, and motion principles".

### 2.7 Four drop-in techniques with exact values

**`beautiful-shadows`** gives three Tailwind arbitrary-value shadows and forbids mixing them
with the default scale. The medium one, for cards, panels and popovers, is six stacked layers:

```
shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)]
```

The large one, for hero media and modal-like containers, runs out to a 100px blur at 0.12
alpha over six layers. Rules: one shadow strength per component state; never tint them; never
stack two on one element; never use the large one on dense lists or tiny controls.

**`atmosphere-background`** is a recipe for a dark backdrop that is not a gradient blob: "deep
near-black background with soft vertical light folds drifting across the frame like illuminated
fabric, fog sheets, or light curtains", built from multiple overlapping vertical bands with
screen or additive blending, slow sine-wave drift, and brightness accumulating toward one focal
corner (lower right or lower edge) rather than uniformly. Tuning knobs are named: fold count,
drift amplitude and speed, brightness focus, colour, softness. Avoid: "Flat multi-stop gradients
with no layered fold structure", "Loud rainbow color transitions", "Fast turbulence, noisy
particle motion, or obvious repeating patterns that break the calm atmospheric look."

**`beam-glow-states`** (the `border-beam` package, version 1.3.0 verified in the file) maps five
beam presets to states with numeric strengths and durations:

| State | Preset | Strength | Duration |
|---|---|---|---|
| Loading or processing | `pulse-inner` | 0.55-0.75 | 2.3-3s |
| Selected or current | `md` or `pulse-inner` | 0.3-0.55 | 3.2-5s |
| Focus or short active | `sm` or `line` | 0.35-0.6 | not specified |
| High-priority live task | `pulse-outside` | 0.45-0.7 | one per view only |

Guardrails worth keeping regardless of the package: "never make the moving edge the only
loading cue"; do not show a beam for work finishing in about 150ms or less; once shown keep the
loading presentation for 400-600ms to prevent a flash; "For a large collection, animate only
the newly selected item for 800ms to 1200ms, then retain the static selected style"; keep the
ordinary `:focus-visible` outline; provide a static border fallback under reduced motion; the
effect layers use `pointer-events: none` so cancel and retry stay usable.

**`animation-on-scroll`** gives an IntersectionObserver recipe with the exact knobs:
`threshold: 0.2`, `rootMargin: "0px 0px -10% 0px"`, `once = true`, and an
`animation-play-state: paused` to `running` toggle so the element is not animating at all until
it is seen.

### 2.8 `agency-grid-layout-minimal`: ambition without WebGL

The one MengTo direction that reaches for impact through composition rather than compute, which
is the safer bet for a portfolio that must load fast for a cold-outreach visitor:

> "Build the page on a disciplined multi-column grid with large open spans, careful alignment,
> and generous negative space... Use oversized headlines with tight tracking and strong line
> breaks as the primary visual anchor. Pair the hero typography with very small uppercase
> utility labels, timestamps, section markers, or descriptive copy blocks placed in adjacent
> grid columns."

The motion budget for this direction is explicitly small: "masked text reveals, slow image
settle, and restrained hover shifts". Background effects "should stay extremely quiet, such as
a faint wireframe object, subtle texture, or low-opacity abstract geometry". Buttons are "thin
gradient-border wrappers, neutral fills, and small uppercase labels rather than loud pills".
The avoid list includes "Filling every gap with content instead of preserving intentional open
space".

### 2.9 `design-first-ui-prompting`

A prompt skeleton (GOAL / FORMAT / LAYOUT / TYPE SYSTEM / COLOR + MATERIAL / IMAGERY / COPY /
CONSTRAINTS / NEGATIVE PROMPT) with one iteration rule: "Variants: change **ONE variable** at a
time" (angle or crop, accent colour, card arrangement, background tone). Useful for generating
hero imagery, not as a design rule set. Its core line: "Prompt like a design system, not a wish."
---

## 3. ConardLi/garden-skills: the 25 style recipes, and the three built for spectacle

Source: `raw/ConardLi-garden-skills/web-design-engineer_SKILL.md`,
`raw/ConardLi-garden-skills/style-recipes/` (25 files plus INDEX.md),
`raw/ConardLi-garden-skills/failure-patterns.md`.

### 3.1 Why the recipes matter

Each recipe is a complete design language in one file: school, vibe, best-for, touchstone,
palette in hex, typography with weights and sizes, spacing series, radius scale with a stated
ceiling, shadow rule, motion values, "signature moves", an "avoid" list, an AI prompt seed for
generating matching imagery, and a "don't use when" clause. The full set:

`active-theory`, `aesop`, `apple-hig`, `are-na`, `balenciaga-post-2017`, `bloomberg-terminal`,
`dieter-rams-braun`, `field-io`, `headspace-meditation`, `linear`, `mailchimp-freddie`,
`mid-century-modern`, `monocle-magazine`, `muji-kenya-hara`, `notion-pre-ai`, `nyt-the-daily`,
`pentagram`, `raycast`, `resn-storytelling`, `stripe-press`, `tufte-dataink`, `vercel-mesh`,
`vignelli-swiss-helvetica`, `y2k-retrofuturism`.

The skill instructs loading exactly one: "**Load only the one recipe file you're using**, not
the whole catalog", and pasting its concrete values straight into the declared design system,
"that catalog exists so you don't have to invent these on the fly, which is the leading cause
of AI-default Inter + #3b82f6 mush."

### 3.2 The Motion / Experimental school, in full

These three are the only recipes in the catalogue aimed at spectacular work. All three are
cross-linked to each other and to nothing else.

#### `field-io` (Field.io, generative motion identity)

- **Vibe:** "The brand is movement; the page generates itself in front of the visitor"
- **Best for:** brand films, launch moments, agency portfolios, "the visit is the experience" sites
- **Touchstone:** field.io, FIELD.SYSTEMS work, kinetic identity case studies

**Palette.** Dark base `#0B0B0F` to `#000000`. One or two generative gradient hues cycled
through hue rotation, the worked example being deep cyan `#0CE0E5` blending into electric violet
`#5B2EFF`, "or generated procedurally". Ink `#FFFFFF`. Secondary type cool gray `#A0A4B0`.

**Typography.** "a variable font that *animates* on its own axes" is the requirement, not a
suggestion: Söhne Variable, Editorial New Variable, or Inter Display Variable. "Type often
morphs weight, width, or optical-size during scroll." Body type is deliberately restrained,
"a single grotesque at neutral weight; the motion is the show, not the body".

**Spacing.** "irregular by design - content lands in unexpected positions; the grid sometimes
appears and disappears".

**Radius.** `0`. "Field.io's work is rarely soft-cornered."

**Shadow.** Not CSS at all: "through generative lighting in WebGL / Canvas scenes".

**Motion.** "the entire recipe is motion. Multi-stage choreographed sequences. Scroll-driven
not just for parallax but for state changes. Pages frequently feel like a video playing itself."

**Signature moves** (verbatim):
- "Generative type sequences where letters appear, morph, and resolve into headlines on scroll"
- "Particle / mesh systems that respond to cursor and scroll position"
- "Long-tail eased curves (expo-out, quint-out) - `cubic-bezier(0.83, 0, 0.17, 1)` and similar"
- "Section breaks where the entire page state transforms (a full-bleed canvas overtakes the layout)"
- "Choreographed multi-element entries - six elements arrive on staggered delays, not all at once"

**Avoid.** "Static recipes (this isn't a static recipe - a static screenshot will feel
underwhelming)"; "Too many cursor-reactive elements (**one or two key WebGL moments is the
recipe, not the whole page**)"; "Heavy text content - this recipe is for moments, not for
reading".

**Don't use when.** The deliverable will live as a static screenshot ("the recipe loses ~70% of
its impact"); the build budget is small ("this is the most labor-intensive of the 25"); "The
target audience uses low-end hardware or care about performance / accessibility above wow".

#### `active-theory` (cinematic WebGL)

- **Vibe:** "Cinematic web experiences, WebGL heroes, physical-feeling interaction"
- **Best for:** brand launch sites, game and entertainment products, experience marketing
- **Touchstone:** activetheory.net, NASA and Apple WWDC dev portals they built, film tie-in launches

**Palette.** Black plus one signature colour taken from the brand or film. High contrast: deep
black plus a bright accent. Neutrals are always tinted, never plain gray: "gray-with-cast (cool
blue cast for sci-fi, warm amber for cinematic)".

**Typography.** Display is "a strong grotesque or a custom display face built for the campaign
- Druk, Editorial New, ABC Diatype Mono". Body type is secondary: "most content rides over
imagery; less reading, more witnessing". All-caps display is common, "with very tight or very
open tracking depending on tone".

**Spacing.** Cinematic: "content sits centered or in unexpected corners against a full-bleed
canvas". **Radius** `0`. **Shadow** from WebGL lighting, not CSS.

**Motion.** "feature-film-grade. Camera moves through a 3D space. Physics-driven debris /
particles. The page is a stage."

**Signature moves** (verbatim):
- "A full-screen WebGL hero scene that the user moves through (scroll = camera path)"
- "Real-time physics or particle systems responding to cursor / device tilt"
- "Carefully art-directed transitions between scenes (not generic fades)"
- "Sound design integrated (subtle ambient audio that ducks during text passages)"
- "**A single moment of maximum impact** - the recipe builds toward one payoff frame"

**Avoid.** "Many small WebGL moments (one big set-piece is the recipe, not five small ones)";
"Trying to ship a content-heavy site this way (cinematic recipes work for marketing moments,
not docs)"; "Reaching for off-the-shelf Three.js demos (this recipe demands hand-crafted scenes
- **generic WebGL reads as cheap**)".

**Don't use when.** Performance or accessibility constraints rule out heavy WebGL; the product
is utilitarian ("this recipe is for moments, not for daily use"); "The build budget is
sub-3-weeks".

#### `resn-storytelling` (story through scroll)

- **Vibe:** "Surprise as the reward; the page tells a story to those who scroll"
- **Best for:** brand storytelling, agency portfolios, campaign microsites
- **Touchstone:** resn.co, Resn case-study pages, awwwards site-of-the-day archives

**Palette.** Project-driven. "Resn's recipe is more about composition than a fixed palette."
Often warm-cool contrast within one piece: "warm character against cool environment, or vice
versa". Saturated where the story demands, muted where it breathes.

**Typography.** "A campaign-specific display face is almost always present - custom or
unusual." Body type quiet, humanist sans at small sizes. Notably: "Text often integrated *into*
the scene (titles set in WebGL space, not on a fixed UI layer)."

**Spacing.** "irregular and composition-driven; not grid-strict." **Radius** project-dependent.
**Shadow** scene-baked.

**Motion.** "long-form choreography - a single page might tell a 90-second story across 8-12
scroll triggers, with payoffs at specific moments".

**Signature moves** (verbatim):
- "Scroll triggers reveal narrative beats - a character moves across the screen, a product is unveiled, a punchline lands"
- "Easter eggs hidden for repeat visitors"
- "Cursor-reactive surface materials (a hover changes a texture, an audio cue plays)"
- "Multi-scene composition - each section is treated as a film scene with its own art direction"
- "**A reward at the end** - a special interaction or scene only revealed on full scroll-through"

**Avoid.** "Bloating with too many beats - Resn's recipe is 'fewer, better' beats"; "Pure
decoration without narrative - every motion moment should advance the story"; "Forgetting the
punchline - the recipe needs a payoff scene".

**Don't use when.** "There's no story to tell (the recipe needs narrative content)"; "Audience
won't scroll patiently (Resn rewards patience - for impatient audiences, choose a static
recipe)"; "The build is rushed - Resn's recipe demands choreography time".

#### What the three agree on, which is the load-bearing finding

Every one of the three caps the spectacle at **one**. Field.io: "one or two key WebGL moments
is the recipe, not the whole page". Active Theory: "one big set-piece is the recipe, not five
small ones", building toward "a single moment of maximum impact". Resn: "fewer, better" beats
plus one payoff at the end. None of the three is a licence to make the whole site spectacular,
and all three carry an explicit "don't use when" that names cold-traffic and low-end-hardware
audiences as disqualifiers.

All three also say the reading content does not live in the spectacle. Field.io: "this recipe
is for moments, not for reading". Active Theory: "less reading, more witnessing", and
content-heavy sites are on the avoid list.

### 3.3 A quieter recipe with concrete numbers, for contrast

`linear.md`, quoted because it is the closest match to a serious AI-engineering portfolio:

> Ground `#08090A` ("near-black with warm undertone, not pure black") · Surface 1 `#16171C` ·
> Surface 2 `#1E1F25` · Surface 3 raised `#26272E` · Hairline border `rgba(255,255,255,0.06)` ·
> Primary text `#F7F8F8` · Secondary `#9CA3AF` · Muted `#6B7280` · Accent `#5E6AD2`
> "used on < 5% of pixels" · Gradient meshes "very controlled, < 8% opacity" in the hero only

Typography: "Inter Tight at weight 600 (or Söhne, or Geist Sans) - never plain Inter at default
weight, that's the AI-default". Body Inter 14-15px, weight 400-500, line-height 1.55. Display
letter-spacing `-0.02em`.

Spacing `4 / 8 / 12 / 16 / 24 / 40 / 64 / 96`. Radius `6 / 12 / 16`, "**Never above 16.**
Linear's radius character is 'modest, precise, never gummy.'" Shadow "barely there - soft
`0 1px 2px rgba(0,0,0,0.3)` on raised surfaces. **Never glow, never colored shadow.**"

Motion: "ease-out around 150ms for hover, 350-450ms for layout moves with a quint curve (e.g.,
the famous cubic-bezier(0.22, 1, 0.36, 1)). State changes feel 'snappy but not bouncy.'"

Avoid list: emoji; bouncy springs or elastic easings; more than one saturated colour; radius
above 16; stock photography of people; "'Get Started Free' hero CTAs styled like a 2018 SaaS
landing page".

For an evidence-thesis portfolio, `tufte-dataink` is the other obvious candidate and aligns
with this project's existing rule that a visual must encode something true. `stripe-press`,
`vercel-mesh`, `raycast` and `monocle-magazine` are the other plausible fits.

### 3.4 The anti-cliche table, and why its reasoning is worth adopting

The skill states a reasoning chain rather than a preference:

> "1. The user wants their brand to be recognized. 2. AI defaults = average of training data =
> all brands averaged together = **no brand recognized**. 3. So AI-default output dilutes the
> user's identity into 'yet another AI-generated page'"

Every row of the table carries a stated exception, which is unusual and makes it usable rather
than dogmatic. The rows: aggressive purple to pink to blue gradient; rounded card with a
coloured left-border accent; emoji as icon substitute; SVG-drawn imagery ("AI-drawn SVG humans
always have misaligned features and feel cheap", exception "**Almost never**"); CSS silhouette
substituting for real product imagery ("**Never** for branded work"); Inter, Roboto, Arial,
Fraunces or system-ui as a display face; cyber-neon on `#0D1117` ("GitHub-dark cosplay");
fabricated stats, fake logo walls and dummy testimonials ("**Never**").

The only legitimate exception to every anti-cliche rule is "the brand spec uses it - at that
point it stops being slop and becomes a brand signature."

### 3.5 Placeholder philosophy

> "When you lack icons, images, or components, a placeholder is more professional than a poorly
> drawn fake... A placeholder signals 'real material needed here.' A fake signals 'I cut
> corners.'"

Missing icon becomes a square plus label (`[icon]`, `▢`); missing avatar an initial circle;
missing image a card with its aspect ratio printed on it; missing data means asking, never
fabricating; missing logo means stopping and asking.

### 3.6 Process: two mandatory stop points

1. **Declare the design system in Markdown before writing the first line of code** (palette,
   typography, spacing base unit, radius strategy, shadow hierarchy, motion curves and
   durations), then wait for confirmation.
2. **Ship a viewable v0** with placeholders and explicit `[image]` / `[icon]` markers plus a
   list of assumptions, then wait again. "A v0 with assumptions and placeholders is more
   valuable than a 'perfect v1' that took 3x the time - if the direction is wrong, the latter
   has to be scrapped entirely."

Before either, four positioning questions per artifact: **narrative role** (hero, transition,
data, pull-quote, closing), **viewing distance** (10cm phone, 1m laptop, 10m projector),
**visual temperature** (quiet, energized, authoritative, warm, somber, playful), and a
**capacity check**: "Mentally sketch the rough thumbnail - does the content fit the layout, or
will it overflow / look too sparse?"

Five dials scored 1-10 that must change real decisions, not decorate the brief:
visual-variance, motion-intensity, information-density, asset-dependence, brand-fidelity.

### 3.7 "Aim to Stun", and the scale floors

The section that most directly answers the owner's feedback:

> "Play with proportion and whitespace to create visual rhythm. Bold type-size contrast (a 4-6x
> ratio between h1 and body text is normal). Use color fills, textures, layering, and blend
> modes to create depth. Experiment with unconventional layouts, novel interaction metaphors,
> and thoughtful hover states... Use SVG filters, `backdrop-filter`, `mix-blend-mode`, `mask`,
> and other advanced CSS to create memorable moments. CSS, HTML, JS, and SVG are far more
> capable than most people realize."

Immediately followed by the counterweight:

> "**Less is more** - '1,000 no's for every yes'; whitespace is design"
>
> "If the page looks empty → it's a layout problem, not a content problem. Solve it with
> composition, whitespace, and type-scale rhythm, not by stuffing content in"

Scale floors: presentations at 1920x1080 need text ≥24px; mobile touch targets ≥44px; print
≥12pt; web body text starts at 16-18px.

Pre-delivery checklist items worth borrowing: "All colors come from the design system declared
in Step 3 - **no rogue hues introduced**"; "No use of `scrollIntoView`"; "No text overflow or
truncation; `text-wrap: pretty` applied"; "Visual quality at Dribbble / Behance showcase level".
---

## 4. emilkowalski/skills

Source: `raw/emilkowalski-skills/emil-design-eng_SKILL.md` (674 lines, the master file),
`animate_SKILL.md`, `animate_RECIPES.md`, `review-animations_STANDARDS.md`,
`apple-design_SKILL.md`, `find-animation-opportunities_SKILL.md`, `pick-ui-library_SKILL.md`,
`animation-vocabulary_SKILL.md`.

`emil-design-eng` is the philosophy plus every technique; `animate` is the same content
restructured as a build sequence; `STANDARDS.md` is the same content as a citable reference.
Where all three agree I cite `emil-design-eng`.

### 4.1 The three philosophical claims underneath everything else

> "Good taste is not personal preference. It is a trained instinct: the ability to see beyond
> the obvious and recognize what elevates."

> "Most details users never consciously notice. That is the point. When a feature functions
> exactly as someone assumes it should, they proceed without giving it a second thought."
> Quoting Paul Graham: "All those unseen details combine to produce something that's just
> stunning, like a thousand barely audible voices all singing in tune."

> "**Beauty is leverage.** People select tools based on the overall experience, not just
> functionality. Good defaults and good animations are real differentiators. Beauty is
> underutilized in software."

That third claim is the commercial argument for the ambition brief, from the most credible
source in the haul.

### 4.2 Gate one: should this animate at all

| Frequency | Decision |
|---|---|
| 100+ times/day (keyboard shortcuts, command palette toggle) | **No animation. Ever.** |
| Tens of times/day (hover effects, list navigation) | Remove or drastically reduce |
| Occasional (modals, drawers, toasts) | Standard animation |
| Rare / first-time (onboarding, feedback forms, celebrations) | **Can add delight** |

> "**Never animate keyboard-initiated actions.** These actions are repeated hundreds of times
> daily. Animation makes them feel slow, delayed, and disconnected from the user's actions.
> Raycast has no open/close animation. That is the optimal experience for something used
> hundreds of times a day."

For a portfolio this matters in one direction only: a marketing page is almost entirely in the
bottom two rows. The delight budget is legitimately available. `find-animation-opportunities`
makes the same point from the other side, calling decorative mouse-tracking "fine on a
marketing page" but wrong "on a functional graph in a banking app".

### 4.3 Gate two: name the purpose

One of six words, named before building: **spatial consistency**, **state indication**,
**explanation**, **feedback**, **preventing jarring changes**, **delight** (rare tier only).

> "If the purpose is just 'it looks cool' and the user will see it often, don't animate."

### 4.4 Easing, verbatim

Decision tree: entering or exiting is `ease-out`; moving or morphing on screen is
`ease-in-out`; hover or colour change is `ease`; constant motion (marquee, progress bar) is
`linear`; default is `ease-out`.

```css
/* Strong ease-out for UI interactions */
--ease-out: cubic-bezier(0.23, 1, 0.32, 1);
/* Strong ease-in-out for on-screen movement */
--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);
/* iOS-like drawer curve (from Ionic Framework) */
--ease-drawer: cubic-bezier(0.32, 0.72, 0, 1);
```

> "**Critical: use custom easing curves.** The built-in CSS easings are too weak. They lack the
> punch that makes animations feel intentional."

> "**Never use ease-in for UI animations.** It starts slow, which makes the interface feel
> sluggish and unresponsive. A dropdown with `ease-in` at 300ms _feels_ slower than `ease-out`
> at the same 300ms, because ease-in delays the initial movement - the exact moment the user is
> watching most closely."

Named sources for further curves: easing.dev and easings.co. "Don't create curves from scratch."

### 4.5 Duration, and perceived performance

| Element | Duration |
|---|---|
| Button press feedback | 100-160ms |
| Tooltips, small popovers | 125-200ms |
| Dropdowns, selects | 150-250ms |
| Modals, drawers | 200-500ms |
| Marketing / explanatory | Can be longer |

"**Rule: UI animations should stay under 300ms.**" The marketing exception is explicit and is
the one that applies to a portfolio.

The perceived-performance section is the part usually missed:

- "A **fast-spinning spinner** makes loading feel faster (same load time, different perception)"
- "A **180ms select** animation feels more responsive than a **400ms** one"
- "**Instant tooltips** after the first one is open (skip delay + skip animation) make the whole
  toolbar feel faster"

### 4.6 Springs

Use for: drag with momentum, elements that should feel alive (Apple's Dynamic Island),
interruptible gestures, decorative mouse-tracking.

```js
{ type: "spring", duration: 0.5, bounce: 0.2 }            // Apple approach, recommended
{ type: "spring", mass: 1, stiffness: 100, damping: 10 }  // traditional physics
```

Bounce stays 0.1-0.3 and is avoided in most UI. The mouse-tracking note is directly relevant to
any cursor-reactive hero:

> "Tying visual changes directly to mouse position feels artificial because it lacks motion.
> Use `useSpring` from Motion... to interpolate value changes with spring-like behavior instead
> of updating immediately. This works because the animation is **decorative** - it doesn't
> serve a function."

> "Springs maintain velocity when interrupted - CSS animations and keyframes restart from zero."

### 4.7 Component principles

- **Press feedback:** `transform: scale(0.97)` on `:active`, `transition: transform 160ms
  ease-out`. Subtle range 0.95-0.98. Applies to any pressable element.
- **Never `scale(0)`:** "Nothing in the real world disappears and reappears completely."
  Start from `scale(0.9)` or higher plus opacity. "Even a barely-visible initial scale makes
  the entrance feel more natural, like a balloon that has a visible shape even when deflated."
- **Origin-aware popovers:** `transform-origin: var(--transform-origin)`. "The default
  `transform-origin: center` is wrong for almost every popover. **Exception: modals.**"
- **Tooltips skip the delay on subsequent hovers:** first tooltip delays to prevent accidental
  activation; adjacent ones open instantly with `transition-duration: 0ms` via a
  `[data-instant]` attribute.
- **Transitions, not keyframes, for anything rapidly triggered.** Transitions retarget from the
  current value; keyframes restart from zero.
- **`@starting-style`** replaces the `useEffect` plus `mounted` React pattern for entry
  animation, with the `data-mounted` attribute as the legacy fallback.

### 4.8 Blur as a repair tool, explained by mechanism

> "**Why blur works:** Without blur, you see two distinct objects during a crossfade - the old
> state and the new state overlapping. This looks unnatural. Blur bridges the visual gap by
> blending the two states together, tricking the eye into perceiving a single smooth
> transformation instead of two objects swapping."

`filter: blur(2px)` during the transition, kept under 20px. "Heavy blur is expensive,
especially in Safari."

### 4.9 CSS transform mastery, and clip-path as an animation tool

- **Percentage translate** is relative to the element's own size. `translateY(100%)` moves by
  the element's own height whatever the content. "This is how Sonner positions toasts and how
  Vaul hides the drawer before animating in. Prefer percentages over hardcoded pixel values."
- **`scale()` scales children too**, including font size and icons. "This is a feature, not a bug."
- **3D without JS:** `rotateX()` / `rotateY()` with `transform-style: preserve-3d`. The file
  gives a working orbit keyframe:
  ```css
  @keyframes orbit {
    from { transform: translate(-50%, -50%) rotateY(0deg)   translateZ(72px) rotateY(360deg); }
    to   { transform: translate(-50%, -50%) rotateY(360deg) translateZ(72px) rotateY(0deg); }
  }
  ```
- **`clip-path: inset(top right bottom left)`** is treated as one of the most powerful animation
  tools in CSS, with five named applications: hold-to-delete fills, tabs with perfect colour
  transitions, image reveals on scroll, comparison sliders ("Overlay two images. Clip the top
  one with `clip-path: inset(0 50% 0 0)`... No extra DOM elements needed, fully
  hardware-accelerated"), and generic reveals.

The tab trick is worth restating because it solves a problem most implementations get wrong:

> "Duplicate the tab list. Style the copy as 'active' (different background, different text
> color). Clip the copy so only the active tab is visible. Animate the clip on tab change. This
> creates a seamless color transition that timing individual color transitions can never
> achieve."

### 4.10 Gesture physics, with numbers

- **Momentum dismissal:** `velocity = Math.abs(swipeAmount) / timeTaken`; dismiss when
  `velocity > 0.11` regardless of distance. "A quick flick should be enough."
- **Damping at boundaries:** "Things in real life don't suddenly stop; they slow down first."
- **Pointer capture** on drag start.
- **Multi-touch protection:** `if (isDragging) return` on new touch points, "Without this,
  switching fingers mid-drag causes the element to jump to the new position."
- **Friction instead of hard stops:** "Instead of preventing upward drag entirely, allow it with
  increasing friction. It feels more natural than hitting an invisible wall."

### 4.11 Performance, stated as mechanism with a named incident

- Only `transform` and `opacity`. Everything else triggers layout, paint and composite.
- **CSS variables are inheritable:** "In a drawer with many items, updating `--swipe-amount` on
  the container causes expensive style recalculation. Update `transform` directly on the element
  instead."
- **Framer Motion shorthands are not hardware accelerated.** `x`, `y`, `scale` "use
  `requestAnimationFrame` on the main thread". Use the full transform string. The named
  incident: "At Vercel, the dashboard tab animation used Shared Layout Animations and dropped
  frames during page loads. Switching to CSS animations (off main thread) fixed it."
- **CSS animations beat JS under load**, because they run off the main thread.
- **WAAPI** gives JS control at CSS performance, hardware-accelerated and interruptible, with no
  library.

### 4.12 The Sonner principles: building something people adopt

Six, from building a library with (his figure) 13M+ weekly npm downloads:

1. "Developer experience is key. No hooks, no context, no complex setup."
2. "**Good defaults matter more than options.** Ship beautiful out of the box. Most users never
   customize."
3. "**Naming creates identity.** 'Sonner' (French for 'to ring') feels more elegant than
   'react-toast'. Sacrifice discoverability for memorability when appropriate."
4. "Handle edge cases invisibly. Pause toast timers when the tab is hidden. Fill gaps between
   stacked toasts with pseudo-elements to maintain hover state."
5. Transitions, not keyframes, for dynamic UI.
6. "Build a great documentation site. Let people touch the product, play with it."

And the cohesion argument, which is the most useful paragraph in the file for choosing a motion
personality:

> "Sonner's animation feels satisfying partly because the whole experience is cohesive. The
> easing and duration fit the vibe of the library. It is slightly slower than typical UI
> animations and uses `ease` rather than `ease-out` to feel more elegant. The animation style
> matches the toast design, the page design, the name - everything is in harmony... A playful
> component can be bouncier. A professional dashboard should be crisp and fast. **Match the
> motion to the mood.**"

He also admits where there is no formula: "When items enter and exit a list (like Family's
drawer), the opacity change must work well with the height animation. This is often trial and
error. There is no formula - you adjust until it feels right."

### 4.13 Asymmetric timing and stagger

> "Pressing should be slow when it needs to be deliberate (hold-to-delete: 2s linear), but
> release should always be snappy (200ms ease-out). This pattern applies broadly: **slow where
> the user is deciding, fast where the system is responding.**"

Stagger 30-80ms between items. "Long delays make the interface feel slow. Stagger is decorative
- never block interaction while stagger animations are playing."

### 4.14 Debugging, which is a process rule not a technique

- **Slow motion:** 2-5x duration, or the DevTools animation inspector. Four things to look for:
  do colours transition smoothly or do two states overlap; does easing start or stop abruptly;
  is `transform-origin` correct; are opacity, transform and colour in sync.
- **Frame-by-frame** in the Chrome Animations panel for timing drift between coordinated
  properties.
- **Real devices** for gestures, over USB with Safari remote devtools. "The Xcode Simulator is
  an alternative but real hardware is better."
- **"Review your work the next day.** Review animations with fresh eyes. You notice
  imperfections the next day that you missed during development."

### 4.15 `apple-design`: the fluid-interface layer

Distilled from WWDC 2018 *Designing Fluid Interfaces*. The through-line:

> "an interface feels alive when motion starts from the current on-screen value, inherits the
> user's velocity, projects momentum forward, and can be grabbed and reversed at any instant."

Apple's shipped spring values, given as damping ratio plus response in seconds rather than
mass/stiffness/damping:

| Interaction | Damping | Response |
|---|---|---|
| Move / reposition (e.g. PiP) | `1.0` | `0.4` |
| Rotation | `0.8` | `0.4` |
| Drawer / sheet | `0.8` | `0.3` |

Default to damping `1.0` (critically damped, no overshoot). Add bounce (~`0.8`) **only when the
gesture itself carried momentum**. "Overshoot on a menu that just faded in feels wrong;
overshoot on a card you flicked feels right."

Momentum projection, given as Apple's actual function and explicitly not the textbook one:

```js
// decelerationRate ~= 0.998 for normal scroll feel; 0.99 for snappier
function project(initialVelocity /* px/s */, decelerationRate = 0.998) {
  return (initialVelocity / 1000) * decelerationRate / (1 - decelerationRate);
}
```

> "Note: the physics-textbook `v²/(2·decel)` is *not* what Apple ships - use the
> exponential-decay form above."

Rubber-banding:

```js
function rubberband(overshoot, dimension, constant = 0.55) {
  return (overshoot * dimension * constant) / (dimension + constant * Math.abs(overshoot));
}
```

Interruptibility is called "the single most important principle":

> "**Always animate from the *presentation* (current) value, never the target value.** On
> interrupt, read the element's live on-screen transform and start the new animation from there.
> Starting from the logical/target value causes a visible jump."
>
> "**Decompose 2D motion into independent X and Y springs.** A single spring on a 2D distance
> desyncs when X and Y have different velocities."

Materials and depth, which is the closest thing in the haul to a principled glass treatment:

- Translucent nav, toolbars and sheets via `backdrop-filter`, with content scrolling underneath.
- "Material weight encodes hierarchy: darker/heavier materials separate structural regions
  (sidebars); lighter materials draw attention to interactive elements (buttons). **Never stack
  a light translucent surface on another** - legibility collapses."
- "Bigger surfaces should read as thicker: stronger blur + a deeper shadow than small chips."
- "**Dim to focus, separate to keep flow.** A modal task pairs the surface with a dimming scrim
  and pushes the background back/down. A parallel, non-blocking panel uses translucency and
  offset *without* a scrim."
- "**Scroll edge effects, not hard dividers.** Instead of a 1px border under a sticky header,
  fade a small blur/gradient mask where content meets floating chrome."
- "**Materialize, don't just fade.** For glass/blur surfaces, animate blur radius and scale
  together on enter/exit, so the surface reads as a real material arriving rather than a plain
  opacity fade."
- Vibrancy: over translucent surfaces, "don't use flat gray text - use higher-contrast, slightly
  heavier weight, and a small letter-spacing bump. Put color on a solid layer, not the
  translucent foreground."

Three independent accessibility signals, not one: `prefers-reduced-motion: reduce`,
`prefers-reduced-transparency: reduce`, `prefers-contrast: more`. Plus: avoid full-viewport
moving backgrounds, "slow looping oscillations (near 0.2 Hz / one cycle per 5s)", and abrupt
brightness jumps. "Make large moving objects semi-transparent while they travel, and fade big
surfaces out during a large reposition and back in once settled."

Multimodal feedback, three rules: **causality** (trigger on the actual causal event),
**harmony** ("the visual, the sound, and the haptic must fire on the **same frame**"),
**utility** ("Over-feedback trains users to ignore all of it").

Typography: "**Tracking (letter-spacing) is size-specific - never one value for all sizes.**"
Tighten headings toward `-0.02em`, leave body near `0`. Leading tracks size inversely. "Build
hierarchy from weight + size + leading as a set, not size alone."

Process, and the sentence most relevant to the owner's feedback:

> "**Prototype interactively - an interactive demo is worth 'a million static designs.'** You
> discover the interface by building and playing with it; a working prototype also sets a
> concrete bar that prevents a mediocre final implementation."
>
> "Design interaction and visuals together. 'You shouldn't be able to tell where one ends and
> the other begins.' Motion is not a layer added after the pixels."

### 4.16 The Never Ship table, verbatim

| Never | Instead |
|---|---|
| `transition: all` | Name the exact properties |
| `transform: scale(0)` entrance | `scale(0.95)` + `opacity: 0` |
| `ease-in` on a UI element | `ease-out` or a strong custom curve |
| Built-in `ease-out` on a deliberate animation | `cubic-bezier(0.23, 1, 0.32, 1)` |
| Animation on a keyboard shortcut or 100+/day action | No animation |
| UI duration over 300ms with no reason | 150-250ms |
| `transform-origin: center` on a trigger-anchored popover | `var(--transform-origin)` (modals exempt) |
| Keyframes on toasts, toggles, rapidly-triggered elements | CSS transitions |
| Animating `width`/`height`/`margin`/`padding`/`top`/`left` | `transform` / `opacity` |
| Motion `x`/`y`/`scale` props under load | Full `transform` string |
| Ungated `:hover` motion | `@media (hover: hover) and (pointer: fine)` |
| Missing `prefers-reduced-motion` | Gentler variant, not zero |
| Everything entering at once | 30-80ms stagger |

### 4.17 `pick-ui-library`: the curated picks

base-ui (unstyled accessible primitives), cmdk (command menus), Sonner (toasts), input-otp,
Leva (control panels), motion.dev (springs, layout, exit, gestures), NumberFlow (animated
numbers), torph (animated text), Cobe (3D globes), **Satori** (HTML/CSS to SVG/PNG, for dynamic
OG images), **shiki** (syntax highlighting), Liveline (streaming charts), recharts (everything
else), dnd kit, Virtuoso, zustand, clsx, cva, next-themes.

Satori and shiki are directly relevant to this project: Satori replaces the hand-run `npm run og`
script, and shiki is the right answer if v2 shows code.

### 4.18 `animation-vocabulary`: naming things precisely

A reverse-lookup glossary that turns "the bouncy thing when a popover opens" into "Pop in".
Useful when briefing a designer or another agent. Terms worth knowing from it: **Origin-aware
animation**, **Continuity transition**, **Morph**, **Shared element transition**, **Layout
animation**, **Direction-aware transition**, **Scroll-driven animation** (progress tied directly
to scroll position, distinct from **Scroll reveal**), **Rubber-banding**, **Stepped animation**,
**Orchestration**, **Fill mode**.
---

## 5. codeswithroh/tastemaker

Source: `raw/codeswithroh-tastemaker/macrostructures.md`, `narrative-arc.md`,
`hero-guidelines.md`, `anti-slop-checklist.md`, `style-tokens.md`,
`interface-quality-rules.md`, `animation-guidelines.md`, `component-patterns.md`.

**Provenance, stated because it changes how much weight to give each file.** The motion file's
easing tokens, duration table, physicality rules and gesture rules are the same values as Emil
Kowalski's, down to the three cubic-beziers. `interface-quality-rules.md` says plainly it is
"Adapted from **Vercel's Web Interface Guidelines**
(`github.com/vercel-labs/web-interface-guidelines`)" and that the copy is a snapshot of an
actively maintained document. So tastemaker is largely a synthesis layer. Its original
contributions, and the reason it earns a section, are the macrostructures, the narrative arc,
the hero budget, the section-padding measurements and the pre-emit critique.

### 5.1 The twelve named macrostructures

This is the most directly actionable list in the haul for the ambition brief, because it is a
menu of page shapes that are not the generic template. The file states the problem first:

> "the reflexive hero → 3-feature-cards → testimonial → CTA → footer rhythm... is the single
> most recognizable 'an AI built this' tell at the page level, and it survives a perfect
> palette."

And the framing that keeps it honest:

> "**Shape is not the same question as story.** This file... answer[s] what the page looks like.
> `references/narrative-arc.md` answers why each section exists and in what order - work that
> out *first*, then pick the shape that carries it."

| # | Name | Shape | Reach for it when |
|---|---|---|---|
| 1 | **Feature Stack** | Hero, then features revealed one full-width band at a time down the scroll, each an alternating text/visual split. "built as *bands*, not a 3-up card grid, and every band leads with a real mockup/chart, not a paragraph" | A product with 3-6 distinct capabilities that each deserve a real visual |
| 2 | **Bento Showcase** | "An asymmetric grid of mixed-span tiles (1×1, 2×1, 2×2) where each tile shows one capability as a small live-looking UI fragment. Visual rhythm comes from tile size, not repetition" | Many small features better shown at a glance than explained in sequence |
| 3 | **Editorial Index** | "Reads like a well-set magazine or a studio's index page: a masthead, a numbered or categorized list of work/sections, generous type, hairline rules. Content-led, not conversion-led" | **Portfolios**, agencies, publications, "this is who we are" pages |
| 4 | **Long-Scroll Narrative** | The narrative arc told top to bottom, one full-section beat at a time, with a scroll-linked reveal between them. "The page is a story, not a menu" | A non-obvious product that needs explaining before the pitch lands; a manifesto; a launch |
| 5 | **Stat-Led** | "A single dominant number or a tight row of real metrics is the hero and the spine of the page" | The story is genuinely quantitative and the numbers are real |
| 6 | **Gallery Grid** | "The work is the pitch: a grid of real photography, product shots, or case tiles fills the page, chrome kept minimal" | Commerce, photography, physical product, anything where imagery sells |
| 7 | **Product Demo / Workbench** | "The hero is the product in use (a real annotated mockup, an interactive-looking capture, a clipped-by-viewport demo), and the page is organized around *doing*, not describing" | Dev tools, apps, "anything where seeing it work is the strongest argument" |
| 8 | **Split Diptych** | "a persistent statement/nav column beside a scrolling content column, or a hard left/right split fold" | Studios, single-voice products, "anything wanting an art-directed rather than stacked feel" |
| 9 | **Conversational FAQ** | "built around real questions the audience actually asks, answered directly, with proof and CTA folded into the answers" | Products fighting a specific objection or a trust gap |
| 10 | **Manifesto** | "Type-forward, few images, one strong point of view carried by big statements and short lines. The restraint *is* the design" | Brand-led launches, opinionated products, "a studio staking a position" |
| 11 | **Catalogue** | "A structured, almost tabular listing (products, plans, specs, releases) presented with editorial care rather than as a bare table" | Commerce with many SKUs, pricing-as-page, changelogs, spec-heavy products |
| 12 | **Poster Fold** | "One full-bleed art-directed fold (a photograph, a hand-built illustration, a bold type composition) carries the whole first screen; the page below becomes something quieter" | "the brand or a single image *is* the message" |

Four for this project by the file's own selection criteria: **Editorial Index** (named for
portfolios), **Product Demo / Workbench** (named for dev tools and "seeing it work"),
**Long-Scroll Narrative** (a non-obvious offer that needs explaining), **Manifesto** (a
position, which is what the evidence thesis is).

The selection rules:

> "**Match shape to argument, not to habit.** The Feature Stack is the right answer surprisingly
> often *and* the wrong answer to reach for reflexively... If the brief's strongest argument is
> 'look how much people use this,' that's Stat-Led; 'look at the work,' Gallery Grid; 'let me
> explain why this matters,' Long-Scroll Narrative."

> "**Vague brief → offer, don't default.** If there's genuinely no signal... offer the user three
> macrostructures from categorically different groups (one grid-led like Bento, one
> document-led like Long-Scroll, one poster-led like Manifesto) - three concrete choices, not a
> survey of all twelve."

> "**Honesty rule (binds every macrostructure).** Stat-Led, Catalogue, and any proof band must
> use **real** numbers, logos, and testimonials, or an honest placeholder... If the user
> supplied no real figures, pick a shape that doesn't demand them, or leave the slot honestly
> empty."

App shells are excluded: "the sidebar-plus-topbar frame *is* its macrostructure".

### 5.2 The narrative arc: six beats, minimum four

Grounded in named frameworks rather than invented: StoryBrand (SB7), PAS
(Problem-Agitate-Solution), and "the converged modern SaaS convention".

1. **Hook** (the hero) - the promise.
2. **Problem / stakes** - "what's actually broken or at risk. Specific to *this* product, never
   generic ('teams struggle with X' is not a story beat - it's a placeholder for one)." Plus a
   dose of Failure: what happens if nothing changes.
3. **Solution / mechanism** - "how the product actually solves it, *shown*... not just asserted."
4. **How it works** - "3-5 steps, not an exhaustive walkthrough."
5. **Proof** - real evidence. Has a visual-density floor: "a label + description + small icon in
   a bordered box is not enough to carry a proof beat".
6. **Close / CTA** - "tied back to the hook's promise... what the visitor's world looks like
   after they act."

> "**Never collapse below four distinct beats** - a page that goes straight from hook to proof
> to close skips the part that actually persuades."

`How it works` is the one beat that can legitimately fold into `Solution`, "a deliberate merge,
not an accidental omission". Merges and skips must be stated out loud, not quietly not built.

The self-check, top to bottom: Who is this for and what is the promise? What is actually wrong
or at stake? How does this fix it? Why should I believe it? What do I do now?

> "a page can pass every structure gate (real macrostructure, varied archetypes, no generic
> template) and still fail this one, because variety and coherence are different properties. A
> page needs both."

The arc is recorded in one line before building, e.g. "Arc: Hook (H2 split demo) → Problem
(prose + before/after) → Solution (F1 bands) → How it works (F4 steps) → Proof (P4 stat strip)
→ Close (C2 statement). No beats skipped."

### 5.3 Hero guidelines

Start with a completed sentence, before markup:

> "This product helps [specific user] achieve [valuable outcome] by [distinct mechanism]."
>
> "If the hero needs a workflow diagram, four metrics, or a paragraph to explain the product,
> the message is not yet sharp enough."

**The attention budget**, a starting limit and not a quota to fill: one optional eyebrow, one
headline, one subhead, one primary CTA, at most one secondary CTA, one focused visual.

> "Do not add trust rows, feature chips, workflow rails, contract/metric sidebars, floating
> badges, decorative stamps, orbit lines, file/status footers, or multiple mockups merely
> because there is room."

**Headline sizing, which cuts both ways.** This is the part worth quoting because it is a
failure this project could easily repeat:

- 6-12 words is the budget; 6-8 words gets the full display size; 9-12 words steps down "roughly
  one clamp tier down, about 15-20% smaller across the whole `clamp()` range".
- "**Under 6 words still has a ceiling - a shorter headline is not a license to go bigger.** The
  instinct to size inversely with word count (fewer words, so make each one huge) is exactly the
  failure real output has shown: a 4-word headline like 'Block blind agent releases.' rendering
  one word per line at near-viewport scale. **3-5 words caps at the same full display size the
  6-8 word band uses, never above it.** Real premium product heroes (Linear, Stripe, Vercel) run
  short headlines at that same top-tier size, not a scaled-up outlier; punchiness comes from
  word choice and whitespace, not from exceeding the scale's own ceiling."
- A headline under 6 words must read on 1-2 lines. Three or more lines means the type is too
  large for the container.
- Line-height floor for a bold, large-clamp display headline is **1.0**. Below it (0.87 is named)
  descenders and punctuation touch the line below. "Check this visually, not just by the
  line-height number - the same value that's safe at 400-weight/3rem can clip at
  800-weight/6rem+."
- Subhead: one sentence, "ideally 16-28 words and no more than two lines on desktop".

**One proof visual**, showing the result rather than the machinery. "For a builder or generation
tool, show one excellent finished output. For a dashboard, crop to the one decision or result
users care about instead of reproducing the entire app shell." Use at most one outer
presentation frame. "Avoid a dashboard inside a dashboard."

**Composition:**

- "Give the headline and visual clear, separate territories with generous negative space."
- "Let one side dominate slightly; equal-weight columns can feel mechanically templated."
- "Use one intentional rule-break at most: a controlled bleed, an off-grid edge, or a restrained
  accent bar. Do not stack several decorative gestures."
- "Keep the hero palette quieter than the sections below it."

**The floating metric chip**, allowed as an annotation and not a second hero group: cap at one
or two, they must sit ON the proof visual overlapping its edge, "The number must be real",
caption-scale and quiet.

**The animated comparison**, which is the one technique in this file with implementation detail
and is a strong fit for a before/after portfolio piece:

> "layer the two real screenshots absolutely, clip the top layer with `clip-path: inset()`
> driven by a CSS custom property (e.g. `--wipe`), and animate that property back and forth on
> a slow loop (GSAP supports tweening CSS custom properties directly:
> `gsap.to(el, { "--wipe": "80%", duration: 4, ease: "sine.inOut", yoyo: true, repeat: -1 })`)"

**Responsive acceptance checks:** no horizontal overflow at 390px; headline readable in roughly
3-5 lines with no avoidable orphaned one-word line; "At the top of the display size range, the
headline fits comfortably in 2-3 lines"; CTAs "either fit cleanly side by side or stack as
full-width actions; they never squeeze into awkward labels"; "The proof visual remains legible
when stacked. Crop or simplify its internals rather than shrinking a dense desktop composition
until it becomes unreadable."

**The subtraction pass.** List every distinct hero group and keep only those answering one of:
What is this? Why should I care? What should I do next? What does a good result look like?
"If two groups answer the same question, keep the stronger one."

### 5.4 The pre-emit self-critique

Score the planned output 1-5 on six axes before finalising. "Anything **< 3 on any axis triggers
a revision pass**." The axes are the most useful checklist in the file:

| Axis | What is being scored |
|---|---|
| **Show-don't-tell** | Is each section mostly something to look at, with text as caption? Scored first. |
| **Philosophy** | "Is there a clear *why* - a position this design takes, a reason it looks like *this* - or is it just a competent layout?" |
| **Hierarchy** | "Can a viewer tell, in 2 seconds, what's primary, secondary, tertiary?" |
| **Specificity** | "Does this look like *this* product/brief - or like a generic page that could be anyone's, just in different colors?" |
| **Restraint** | Has everything not earning its place been removed? |
| **Variety** | Structural distance from previous builds. "a palette swap doesn't count as variety" |

> "Two passes is normal; a third is usually a sign the *brief* is underspecified, not the design"

### 5.5 The gates with checkable numbers

Gate 1, show-don't-tell, called "the highest-leverage anti-slop check there is":

> "is each one mostly something to *look at* (a UI mockup, a chart, a comparison, a diagram, a
> numbered visual flow, a stat callout, an illustration) with text as its caption - or is it
> mostly prose with a decorative icon?... Replace explanatory paragraphs with the thing they
> describe: 'fast analytics' → an actual chart; 'simple 3-step setup' → three visual panels;
> 'powerful editor' → a mockup of the editor."

Gate 6, the intentional rule-break, and the counterpart to the ambition brief:

> "A design where everything sits on the grid, evenly spaced and perfectly safe, reads as
> generated even when every token is right. Human-authored work usually has one deliberate
> break: an element that bleeds past its column, an oversized number, an asymmetric moment, a
> bit of tension or delight the system didn't require. Find the one intentional break that
> makes this feel made by a person. If there isn't one, the page is probably too safe."

Exactly one. Gate 7 and the hero file both cap it at one.

Other numeric gates:

- **Gate 11:** a section headline outside the hero caps at **50-65% of the hero's display size**
  and reads in 1-2 lines. Exception: a Long-Scroll Narrative or Manifesto's single deliberate
  statement moment.
- **Gate 18:** accent stays **≤ ~5% of any viewport** by area.
- **Gate 25:** no horizontal scroll at any width **320-1920px**. Use `overflow-x: clip`, not
  `hidden`, "which breaks `position: sticky`". Any grid track holding an image uses
  `minmax(0, 1fr)`, "never bare `1fr` (bare `1fr` takes the image's intrinsic width as its floor
  and blows past the viewport on phones)". Display headers set
  `overflow-wrap: anywhere; min-width: 0`.
- **Gate 26:** **no two-line clickable text** at any width. No button label, nav link, footer
  link, tab label, breadcrumb or CTA wraps to two lines. Hit targets ≥44x44px below 40rem.
- **Gate 30:** "No `hover:scale-105` applied across unrelated elements; no single element
  carrying translate + scale + shadow + color at once; no overshoot/bounce easing
  (`cubic-bezier(0.34, 1.56, ...)`) on buttons/modals/tooltips."
- **Gate 31:** the focus ring "**never** fades/transitions into existence".
- **Gate 33:** "hover-tooltips delay ~800ms, focus-tooltips 0ms"; "prefer optimistic update +
  Undo over a confirmation dialog"; "If removing an animation wouldn't lose the user any
  information, remove it - most pages have too much motion, not too little."
- **Gate 37:** headline line-height floor 1.0.
- **Gate 38:** no italic headers, and no `<em>` inside an upright heading. "`Built to
  <em>think</em>` is one of the most reliable AI tells."
- **Gate 39:** at most **three font families** on the page.
- **Gate 12:** "Logo is a real mark, not a letter in a box. A single letter set inside a
  rounded/colored square or circle is the logo equivalent of the indigo gradient."
- **Gate 14:** no indigo-to-purple or blue-to-cyan diagonal gradient, "including a
  `background-clip: text` gradient headline, which no mood allows".
- **Gate 16, the contrast failures that actually ship:** button text within ~5% OKLCH lightness
  of the button fill; "a dark section left with ink-on-ink (any panel with OKLCH lightness < 50%
  must also swap its text to a light color in the same rule)"; an accent used as a text-bearing
  fill with no verified on-accent colour.
- **Gate 36:** body copy is never monospace. "Mono/semi-mono for paragraph text reads as
  'developer template.' Holds even for a technical mood."
- **Gate 47:** no invented metrics, testimonials, logos or case-study counts.
- **Gate 48:** no mid-render token improvisation. An inline hex "means the model picked the
  palette then freestyled past it".
- **Gate 51:** "Not the same pill eyebrow on every section... Once is fine; the identical
  treatment on every section is a tell."
- **Gate 52:** "Semi-brutalist is a deliberate choice, not the reflex. Hairline borders instead
  of shadows, flat fills, high-contrast mono, sharp/minimal radius - a legitimate style when it
  fits the product, a tell when it's the house default applied regardless of mood."

Gate 5's chrome tells are worth naming separately: nav is not the reflexive
wordmark-left-plus-links-plus-button bar unless the page has 2 or fewer destinations; footer is
not the reflexive 4-column Product/Company/Resources/Legal grid unless it is a docs root; "no
eyebrow-left/heading-right two-column section head (stack the eyebrow above the heading)"; "no
hand-drawn fake browser/phone/IDE chrome (use a real screenshot or omit)".

### 5.6 Spacing, with the governing rule and measured section padding

The rule that decides which token applies:

> "**The space around a group of elements should be equal to or greater than the space within
> it.**"

Three pricing cards with 24px between them each need 24px or more internal padding. Card padding
floors by type: compact or dense card 12-16px; **content card (heading plus body) 24px minimum**;
showcase or hero card 32px or more.

Section padding, stated as measured against real landing pages (make.design named as the
reference case), not guessed:

| Section role | Per-side padding |
|---|---|
| Lightweight / connective (logo strip, trust bar) | 48-64px |
| Standard content section | 64-96px |
| Pivotal (hero, primary proof or demo) | **128-192px** |

The **combined boundary gap** between two adjacent sections commonly lands at **120-250px on
desktop**. "That gap is what a visitor actually perceives as the pause before the next idea
starts - undershoot it and sections blur into one long scroll where nothing gets its own
moment."

> "Consistency belongs at the level of **the rule**... not at the level of forcing every section
> to an identical number - that flatness is its own tell."

Desktop values only. "Drop one to two tiers at the mobile breakpoint." And: "**Whitespace alone
is a legitimate, often preferred, separation mechanism at this scale** - real landing pages using
this generous a padding range frequently carry the same background color straight through and
let the padding itself do the work, no alternating tint or divider required."

Contrast floor: two checks, not one. Body text vs background at 4.5:1, **and** button label vs
primary fill at 4.5:1. "Two of the five reference-anchor drafts above originally shipped a
Primary color (a terracotta and an emerald green) that looked fine as a swatch but only cleared
~2.5-3.6:1 with white button text." White is the correct button-label colour on all five of its
verified anchors; "don't default to the mood's text color for button labels, use white."

### 5.7 Interface quality rules (the Vercel-derived layer)

Worth keeping as a pre-ship checklist. The items not already covered elsewhere in this document:

- **URL reflects state.** "filters, tabs, pagination, expanded panels belong in query params."
  Navigation uses real `<a>`/`<Link>` so Cmd-click and middle-click work. Deep-link stateful UI.
- **Flex children need `min-w-0`** for truncation to work at all.
- Explicit `width`/`height` on images to prevent layout shift; `loading="lazy"` below the fold,
  `fetchpriority="high"` for the critical above-fold image. Plus a recorded real bug: "setting
  HTML `width`/`height` attributes *and* a CSS `aspect-ratio` without `height: auto` makes the
  browser use the literal attribute height."
- `color-scheme: dark` on `<html>` for dark themes, "fixes native scrollbars and inputs".
  `<meta name="theme-color">` matches the page background.
- `Intl.DateTimeFormat` and `Intl.NumberFormat`, never hardcoded. `translate="no"` on brand
  names, code tokens and identifiers.
- Placeholders end with `…` and show a real example of the pattern. Loading states end with an
  ellipsis: `Loading…`, `Saving…`.
- Lists over ~50 items get virtualization or `content-visibility: auto`. Do not read layout
  during render.
- Inputs: `spellCheck={false}` on emails, codes and usernames; **never block paste**; submit
  stays enabled until the request starts; focus the first error on submit.
- Modals and drawers use `overscroll-behavior: contain`. While dragging, disable text selection
  and mark the dragged element `inert`.

Flag on sight: `user-scalable=no` or `maximum-scale=1`, `onPaste` + `preventDefault`,
`transition: all`, `outline-none` with no `:focus-visible` replacement, `<div>`/`<span>` with
click handlers, images without dimensions, big `.map()` with no virtualization, inputs without
labels, icon buttons without `aria-label`, hardcoded date or number formats, unjustified
`autoFocus`.

Three runnable validators ship with the skill and look reusable as CI gates for this project,
though I did not run them: `scripts/check_contrast.py`, `scripts/audit_motion.py`,
`scripts/anti_slop_scan.py`. The scanner is described as catching "generic purple/cyan
gradients, gradient text, `h-screen`, dead links, missing alt text, placeholder copy, AI-copy
phrases, emoji icons, repeated eyebrow labels, and `transition-all`".
---

## 6. jakubkrehel/skills

Source: `raw/jakubkrehel-skills/` (16 files copied).

The distinguishing feature is a shared review protocol. Every skill ends with a severity ladder
(HIGH / MEDIUM / LOW), a verification section separating "checked without a browser" from
"checked in a browser", and a mandatory **Not verified** label for anything not actually run.

> "So the bar for reporting is evidence, not taste. The bar for `Approve` is that you inspected
> what you claim to have inspected. A short report from a real inspection beats a long one
> padded to look thorough." (`better-interface_SKILL.md`)

### 6.1 The cheaper-fix ladder

Take the earliest step that works:

1. **Delete.** "A separator that space would carry, an animation on a high-frequency
   interaction, an ARIA attribute a native element makes redundant, a ramp nothing imports."
2. **Use the platform.** The native element, the native control, the browser's own focus ring.
3. **Reuse what the project has.** An existing token, spacing step, or motion curve.
4. **Correct the value.** The wrong easing, radius, gap, or contrast pair.
5. **Add.** A new token, wrapper, media query, or ARIA attribute the platform cannot supply.

> "A fix written at step 5 where step 1 was available is its own finding. Report the deletion
> instead."

### 6.2 Escalation triggers: HIGH on sight

Thirteen conditions that are never averaged down because the surface is minor. The ones a
portfolio can actually hit: an interactive control with no accessible name; a keyboard-reachable
control with no visible focus indicator; a control reachable by pointer but not keyboard; motion
ignoring `prefers-reduced-motion`; content clipped, overlapped or unreachable at 320px width or
200% zoom; text failing its contrast ratio; meaning carried by colour alone; truncated content
with no way to reach the full value; content reachable only past a scroll edge with no visible
cue; and

> "A state change carried by motion alone, with no color, icon, or label left behind when the
> animation does not run."

### 6.3 better-ui: exact values

- **Concentric radius:** `outerRadius = innerRadius + padding`. Past `24px` of padding, treat
  the layers as separate surfaces. "Mismatched radii on nested elements is the most common thing
  that makes an interface feel off."
- **Press scale is `0.96`.** "Always `0.96`; anything below `0.95` feels exaggerated."
  `transition-duration: 150ms`, `ease-out`. Ship a `static` prop to switch it off.
- **Icon transitions:** scale `0.25` to `1`, opacity `0` to `1`, blur `4px` to `0px`,
  `{ type: "spring", duration: 0.3, bounce: 0 }`. "Bounce is always `0`." Without a motion
  library, keep both icons in the DOM with one absolutely positioned and cross-fade with
  `cubic-bezier(0.2, 0, 0, 1)`.
- **Image outlines:** `1px`, `oklch(0 0 0 / 0.1)` light, `oklch(1 0 0 / 0.1)` dark,
  `outline-offset: -1px`. Never a tinted near-black like slate-900 or zinc-900. "A tinted outline
  picks up the surrounding surface color and reads as dirt on the image edge." `outline` rather
  than `border` because outline never affects layout and the negative offset hugs the corner
  radius.
- **Shadow-as-border tokens** (light mode, three layers: a 1px ring, subtle lift, ambient depth):
  ```css
  --shadow-border:
    0px 0px 0px 1px oklch(0 0 0 / 0.06),
    0px 1px 2px -1px oklch(0 0 0 / 0.06),
    0px 2px 4px 0px oklch(0 0 0 / 0.04);
  ```
  Dark mode collapses to one white ring: `0 0 0 1px oklch(1 0 0 / 0.08)`, hover `0.13`. "**Never
  apply this to dividers**" - those stay borders.
- **Optical alignment:** button with a trailing icon uses `icon-side padding = text-side padding
  - 2px`. Play triangles shift `translateX(2px)`.
- **Icon stroke matches text weight:** `1.5px` beside 400, `2px` beside 600. One stroke weight
  per icon set, one icon library per surface.
- **Enter stagger ~100ms** between semantic chunks, ~80ms between title words, combining
  `opacity` + `blur(4px)` + `translateY(12px)`.
- **Exits are softer than enters:** a small fixed `translateY(-12px)`, not the full container
  height; 150ms exit against a 300ms enter; `ease-out` in both directions. "Sometimes correct:
  remove immediately when motion adds no context."
- **Theme switch:** inject `*,*::before,*::after{transition:none !important}`, read
  `document.body.offsetHeight` to force a synchronous flush, remove on a nested
  `requestAnimationFrame`. Otherwise "the switch reads as a slow smear rather than an instant
  change". `next-themes` ships this as `disableTransitionOnChange`.
- **`will-change` only for `transform`, `opacity` and `filter`**, and only after seeing
  first-frame stutter. "Never add it preemptively to every animated element, since each extra
  compositing layer costs memory."
- **Motion restraint:** high-frequency interactions get instant feedback or ≤150ms on opacity and
  background-color. "Motion is never the only feedback channel." "Brief and precise beats
  prominent. When in doubt cut the duration, not the clarity."

And the review instruction: "When reviewing, slow the interface down. What feels off at 10%
speed is what is subtly wrong at full speed."

### 6.4 better-typography: exact values

- Line-height: headings ~`1.1`, body `1.5`-`1.6`, unitless. "Anything that wraps to three or more
  lines needs at least `1.4`, even in a height-constrained row."
- Below `18px`, weight `400` or heavier. "Weights under `300` are display-only at `28px`+; they
  disappear at text sizes."
- Measure capped around 60-75 characters for long-form.
- Four wrapping declarations with four jobs: `text-wrap: balance` on headings, `text-wrap:
  pretty` on descriptions, `overflow-wrap: break-word` where a long token could escape,
  `white-space: nowrap` on labels and badges. Skip balance and pretty in long-form text.
- `font-variant-numeric: tabular-nums` on any value that changes.
- iOS Safari zooms the page when an input's text is under `16px`. Two named fixes, and the skill
  says to ask which the design wants rather than picking.
- Size floors: body starts at `16px`; UI text `14px` for inputs and menus, `13px` for captions,
  rarely below `12px`.
- Prefer the CSS property over the raw OpenType tag: `font-weight: 650` not
  `font-variation-settings: "wght" 650`, "because properties keep working when a non-variable
  fallback renders".
- Role-based scale starting point (size / line-height / weight): Display 36px/1.1/600, Title
  24px/1.2/600, Heading 18px/1.3/600, Body 16px/1.5/400, Caption 13px/1.4/400. "Emphasis within
  a role is one weight step up (`400` → `500`), not a size change."
- `letter-spacing: -0.02em` on display headings, `0.05em` on uppercase labels.
- `-webkit-font-smoothing: antialiased` once on the root, never per component.
- Smart punctuation: curly quotes in prose, en dash for ranges (`2010–2020`), the single ellipsis
  character, `&nbsp;` to hold `16 px` together, `&shy;` for break hints.
- `text-box: trim-both cap alphabetic` trims the font's reserved space so text stops sitting low
  in buttons and badges. Chromium 133+ and Safari 18.2+, "Treat it as progressive enhancement".
- Underlines: `text-underline-position: from-font` and `text-decoration-thickness: from-font`.
  "Color is the only part of a real underline that animates reliably. So unless the only thing
  animating is the color, build the underline as a separate element."

### 6.5 better-colors: exact thresholds

APCA is recommended as the default for design decisions; WCAG 2 is kept for legal conformance.

| Content type | APCA min | APCA preferred |
|---|---|---|
| Body text | Lc 75 | Lc 90 |
| Non-body text (labels, headlines) | Lc 60 | Lc 75 |
| Large text (≥36px) | Lc 45 | Lc 60 |
| UI components | Lc 30 | n/a |

WCAG 2: normal text 4.5:1 AA and 7:1 AAA; large text (≥24px, or ≥18.5px bold) 3:1 and 4.5:1; UI
components 3:1.

> "**Change lightness first.** It is the channel contrast responds to. Hue and saturation move
> the measured value far less, so fixing contrast by changing hue is wasted effort."

Two constraints on the fix: "On a background near 75% perceived lightness, even pure black text
reaches only about Lc 60", so a mid-range background is the thing that has to change; and pushing
lightness can push the colour out of gamut.

> "**Light or dark background?** The crossover is around 73% perceived lightness... That is
> higher than intuition suggests. Between roughly 60% and 73% the background already looks light,
> yet white text still measures meaningfully better than black."

Also: measure translucent surfaces "against the lightest and darkest content it can sit over";
measure the rendered result of `color-mix()` and opacity modifiers, not the declaration; for text
over images, "Measure the worst region, or guarantee one with a scrim".

System rules: primitives name a value (`--blue-500`) and are never used in a component; semantic
tokens name a job (`--color-text-secondary`) and are the only tier components reference. Anything
within `15°` of hue counts as the same colour, so one colour means one thing. Ramp properties:
even steps in *perceived* lightness, constant hue, vividness peaking mid-ramp, steps denser at
the light end. "Both ends stop short of pure black and white, which cannot carry hue at all."

> "Fill exactly one action per view... Put the color on the background, not the label. A filled
> button reads as primary across the room; accent-colored text on a neutral button reads as a
> link."

Gradient interpolation: `in oklab` is the default; `in oklch` when a two-hue gradient goes grey in
the middle; "The sRGB default darkens and mutes the midpoint. It is what most interfaces already
have, because it is what you get without asking."

### 6.6 better-layout: exact values

- **Group with space, not lines.** "Space groups first, background shapes second, separator lines
  last." The gap between groups must be at least 2x the gap within one (8px intra to 16px+ inter).
- Adjacent bordered or filled controls: `12px`. Around borderless text and icon controls: `24px`.
  Unrelated control groups: `24px`+. "Borderless controls need more clearance, because nothing
  marks where one target ends and the next begins. The space is the boundary."
- **Progressive disclosure needs an affordance.** In a horizontal scroller, size items so the next
  peeks `16-32px` past the container edge. "A row of cards that ends exactly at the edge looks
  complete, and nobody scrolls it." Disclosure labels say what is hidden: "Show 12 more results",
  not "More".
- **Content bleeds, controls float.** Backgrounds and media extend to the viewport edges; text and
  controls stay inside layout margins and `env(safe-area-inset-*)`.
- Full-width buttons in content layouts stay inside the layout margins with a visible radius,
  starting near `16px` inline on mobile.
- **Breakpoints come from content.** "Break where the layout actually stops fitting, not at
  `768px` because a preset says so." Prefer container queries for components. "Collapse late...
  Premature collapsing throws away space users paid for." Test the smallest and largest supported
  sizes first.
- No fixed widths sized to English labels; buttons size from their label via `padding-inline`.
- Logical properties (`padding-inline-start`, `margin-inline-end`) rather than physical left and
  right.
- "Never park a critical action where it can be cut off: the bottom edge of a resizable pane,
  below the fold of a fixed-height modal, behind an expanding keyboard."

### 6.7 better-accessibility

**Hit areas.** WCAG 2.5.8 AA is **24x24px** as the hard floor; 2.5.5 AAA is 44x44; Apple HIG
44x44pt; Material 48x48dp. "Treat 44px as the recommended touch target for primary controls and
40px as a useful desktop target where density permits." Under the spacing exception, 20px targets
need a 4px gap. Expand with a pseudo-element on the wrapping `<label>` or `<button>`, "never on
the `<input>`, because replaced elements don't render `::before`/`::after` reliably". Two
interactive elements never have overlapping hit areas.

**Decorative layers absorb pointer events**, and this is directly relevant to any glass or glow
treatment in v2:

> "A decorative layer painted over interactive content absorbs every pointer event its box
> covers: a gradient scrim, a glow, a blurred sheen, a full-bleed `::after`. The control
> underneath looks live and does nothing, and no hit-area sizing fixes it."

`pointer-events: none` plus `aria-hidden="true"`, except on a layer the user is meant to hit
("a modal scrim that dismisses on click is a control, not decoration").

**Focus.** Style `:focus-visible`, not `:focus`. Prefer the browser's unmodified ring with only
`outline-offset: 2px` added, because it "adapts to platform and forced-color settings without the
author predicting every background". A custom `outline: 2px solid` with no colour renders
`currentColor`, "which is not automatically accessible". In `forced-colors: active`, keep the
default colour adjustment or name a system colour such as `Highlight`. Give in-page anchor targets
`scroll-margin-top`, "such as `80px` under a sticky header".

**Reduced motion should be opt-in**, which is the strongest version of this rule in the haul:

> "Wrap animations in `@media (prefers-reduced-motion: no-preference)` so users who asked for
> reduced motion get the static version by default, rather than you chasing every animation with
> an override."

The global kill switch fallback uses `0.01ms`, not `none`, "so `animationend` and `transitionend`
still fire and JS waiting on them doesn't hang".

Disable entirely: parallax scrolling, autoplaying video and GIFs, looping decoration, spinning
and large-scale movement. Replace: slide/scale/zoom becomes an opacity crossfade, smooth scrolling
becomes an instant jump, auto-rotating carousels start paused. Keep: loading spinners and
progress, instant state changes, brief functional feedback.

**Autoplay and timed UI.** Anything moving, blinking or updating on its own for more than 5
seconds needs a visible pause or stop control (WCAG 2.2.2), "muted looping hero videos included".
Toasts carrying an action or an error stay until dismissed; where one must time out, 5 seconds is
the floor and hover or focus pauses the timer.

**Zoom and reflow.** 200% zoom (WCAG 1.4.4) and reflow at 320px (WCAG 1.4.10, equivalent to 400%
zoom on a 1280px viewport) with vertical scrolling alone. Tables, maps and code blocks are the
exception and scroll inside their own container. "Fixed heights are what break under zoom. Use
`min-height` on anything containing text."

**`rem` vs `px`:** `rem` for `font-size`, text container `max-width`, media-query breakpoints and
spacing that should scale with text; `px` for borders and hairlines, focus outline width and
offset, box-shadow details, fixed-size decorations. "Breakpoints are where the choice matters
most."

**Touch:** `touch-action: manipulation` on interactive elements to remove the double-tap zoom
delay; `touch-action: none` scoped only to a surface implementing its own gestures, "at page level
it removes scrolling"; set `-webkit-tap-highlight-color` deliberately; hover styling behind
`@media (hover: hover)` because "On touch, `:hover` latches after a tap and holds until the user
taps elsewhere, so it reads as a stuck selected state."

### 6.8 better-writing

- Verb-first button labels. "A confirmation button repeats the consequence, so the dialog is
  answerable without reading the body. 'Delete this project?' offers `Delete project` and
  `Cancel`."
- "Unable to load content", not "We're having trouble loading this content". In errors, "'we'
  invites ambiguity and reads as deflection".
- Errors are instructions placed beside the field that failed: "Choose a password with at least 8
  characters", not "That password is too short". "No blame, no 'oops', no exclamation marks."
  Phrase hints positively and show them before the mistake.
- "When the same error keeps firing, redesign the interaction instead of rewording it."
- Link text must survive being read out of context, "because screen-reader users navigate by a
  list of the page's links". A bare "Learn more" breaks as soon as two appear on one page; suffix
  each: "Learn more about exports".
- One capitalization policy per element type. Sentence case is the safer default: "It is calmer,
  has no per-word rules to remember and localizes cleanly."
- Tone flexes with stakes: warm for success and onboarding; neutral for routine actions and
  settings; "Calm, plain, zero playfulness" for errors and destructive confirmations; serious and
  explicit for data loss and security.
- Empty states say what the place is, how to fill it, and offer one next action. "Never park
  persistent information in an empty state. It disappears the moment content exists."
- Placeholders are examples (`name@example.com`, `DD/MM/YYYY`), never labels.
- Match the verb to the input device: "tap" on touch, "click" with a pointer, "select" when both.
- "Never assemble a sentence from fragments around a variable (`"You have " + n + " new
  messages"`), because word order changes per language."
- "Use possessives sparingly: 'Favorites' beats 'Your Favorites'."

---

## 7. elayadesign/ai-design-skills

Source: `raw/elayadesign-ai-design-skills/landing-page-design_SKILL.md`.

Split into Part A (strategy) and Part B (a visual system stated as non-negotiable). Part A is
good. Part B is one person's taste in the imperative, and it conflicts with better-sourced
material on five points. Treat accordingly.

### 7.1 Part A: worth taking for a lead-generating portfolio

> "A landing page is not a homepage. A homepage serves multiple intents. A landing page wins one
> intent: **one offer → one audience → one primary action.**"

Required above the fold, in order: headline (outcome plus audience), subheadline (how, with
specificity), primary CTA (verb plus what they get), one proof signal, hero visual.

Mid page: problem-to-solution, three to five outcome-driven benefits, how it works in three
steps, social proof. Bottom: FAQ (six to twelve), risk reversal, final CTA identical to the top.

Intake questions, asked in one batch and not one at a time: the one primary action; the exact
offer; what counts as a conversion; the ICP; the problem they are solving; **the top three
objections, meaning why they do not convert today**; the traffic source; what visitors already
know when they land. "If the user cannot answer, make a reasonable assumption, state it in one
line, and continue. Do not stall the build."

Headline formulas: "{Outcome} without {pain}", "The {category} for {audience}", "Ship {result} in
{time}".

Specificity, with its own worked example:

> "❌ 'Save time and streamline' / ✅ 'Cut your weekly reporting from 4 hours to 15 minutes'"

CTA rule: "Verb plus what they get. Never 'Learn more' or 'Submit'."

Benefit bullets: "Bold benefit, then the proof or detail."

Four layout archetypes with a stated selection condition: **A** classic hero plus sections
(product understandable from a screenshot, most common); **B** long-form story (need to educate
and overcome skepticism); **C** minimal conversion page (high-intent traffic, or a short offer);
**D** comparison page (search intent includes alternatives).

Conversion rules: "Match message to source" (mirror the ad headline in the hero); "Never place
competing CTAs above the fold"; "Reduce risk" with at least one of free trial, free plan, no
credit card, cancel anytime, money back; "Put proof directly beside the claim it supports."

Build order: hero, benefits, how it works, proof, FAQ, final CTA. "Never rebuild the whole page on
each iteration. Section by section keeps control and keeps diffs reviewable."

SEO: `noindex` ad-only campaign pages; index evergreen offers; put the FAQ in plain
question-and-answer form for answer engines and add FAQ schema.

Named pitfalls: too many CTAs above the fold; vague value prop ("streamline", "optimize"); a large
feature list with no outcomes; proof buried at the bottom; no clear next step.

### 7.2 Part B: the concrete parts

- **Spacing table**, a closed set: 0, 2, 4, 8, 12, 16, 24, 32, 40, 48, 64, 80, 96px. "Only these
  values. Nothing between them, nothing outside them." Main buttons: 8px vertical, 12px
  horizontal padding.
- **Nested radius:** when the gap between shapes is under 32px, `inner radius = outer radius −
  gap`, applied only when the result is greater than 2. "Below that, leave the inner shape square
  or unchanged."
- **Hero max width 680px** for both heading and subheading. "Read the heading copy and insert line
  breaks at **meaningful** points... Break where the thought breaks."
- Font sizes must resolve to Tailwind's default scale; an off-scale size snaps to the **closest
  step below**, taking both size and its paired line height.
- Buttons: `text-base` semibold; `text-sm` semibold for smaller header buttons.
- **B8 Content realism**, the strongest section: no Lorem Ipsum, no "John Doe", no placeholder
  brands ("Acme Corp", "Nexus", "SmartFlow"), no round fake numbers (`99.99%`, `50%`, `$100.00`)
  but organic ones (`47.2%`, `$99.00`, `+1 (312) 847-1928`). Banned phrases: "Elevate",
  "Seamless", "Unleash", "Next Gen", "Game changer", "Delve", "Tapestry", "In the world of".
  Sentence case headers. Active voice. "No exclamation marks in success messages, and no 'Oops!'
  in errors." Unique avatars per person and varied blog post dates.
- **B9 states:** hover, active (`scale(0.98)` or `translateY(1px)`), focus ring, loading
  (skeletons shaped like the real layout, not circular spinners), empty ("a composed 'getting
  started' view, never a blank panel"), error (inline and specific, never `window.alert()`). "No
  dead links. A button pointing at `#` is either linked or visually disabled. The current page
  must be indicated in the navigation."
- **B10 ship requirements:** privacy and terms links, a custom branded 404, client-side email and
  required-field validation, a skip-to-content link, cookie consent where required, a branded
  favicon, `<title>` plus meta description plus `og:image` plus social tags, alt text on every
  meaningful image, semantic HTML, "A way back from every page."

### 7.3 Part B: the contestable parts, flagged

- **Fonts.** "Use: Geist, Manrope, Geist Mono, Poppins. **Never use: Inter, Roboto, Arial, Open
  Sans, Helvetica.**" No italics anywhere. No 900/black weights. One typeface per site.
- **"No hyphens in text."** Literal hyphens, inside body copy, headings and labels. "Rewrite the
  phrase instead." Unusual and stated nowhere else in the haul.
- **Dark mode backgrounds, a closed hex list:** `#000000`, `#181818`, `#1F1F1F`, `#272727`,
  `#313131`, `#131209`.
- **"Never use gradients in backgrounds."** The one exception is required rather than permitted:
  the hero heading text is a left-to-right gradient, `#FFFFFF` → `#9B9B9B` on dark, `#000000` →
  `#666666` on light. "This is the one place gradients are used, and only on text, never on the
  background."
- **Icons:** Phosphor, Solar or Iconamoon. "Never use: Material Icons, Material Symbols."
- **Motion:** `transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]` as the site-wide
  default. Scroll reveals go `translate-y-16 blur-md opacity-0` to `translate-y-0 blur-0
  opacity-100` "over 800ms or longer". "**Never use `window.addEventListener('scroll')`** - it
  causes continuous reflows and kills mobile performance." Its nav recipe is a floating glass
  pill (`mt-6 mx-auto w-max rounded-full`) morphing into a `backdrop-blur-3xl bg-black/80`
  full-screen overlay with staggered link reveals at `delay-100`, `delay-150`, `delay-200`.
- **B11, mandatory:** a "tagline reveal" section, `text-4xl` to `text-6xl`, minimum two lines,
  starting at 25-35% opacity, with each word transitioning to full colour individually in reading
  order as it crosses a trigger line, using the B7 curve. "Words activate one at a time as they
  cross a trigger line, not the entire block flipping at once."

The `transition-all duration-700` default is banned by three other sources. Note that the curve
itself, `cubic-bezier(0.32,0.72,0,1)`, is Emil Kowalski's `--ease-drawer`, so the disagreement is
about the property list and the duration, not the curve.

---

## 8. petergyang/no-ai-slop

Source: `raw/petergyang-no-ai-slop/SKILL.md` and `eval.md`.

Already adopted in this project; `CLAUDE.md` documents a 2026-08-21 audit that removed 17 em
dashes. What is worth re-reading is the structure rather than the word list.

**Two modes, and detect mode refuses to score.** "AI detectors guess. Named patterns are evidence
the user can check." A detect pass names the pattern, quotes the line, gives the fix in a few
words, and does not rewrite.

**Banned outright** (verbatim): delve, foster, leverage, utilize, facilitate, empower,
streamline, robust, cutting-edge, paradigm shift, game changer, this is huge, this changes
everything, tapestry, realm, beacon, multifaceted, meticulous, intricate, paramount,
transformative, elevate, embark, supercharge, harness, ever-evolving.

**Conditional, not banned**, which is the clause the project's `CLAUDE.md` relies on:

> "Often-empty adverbs: just, literally, honestly, simply, actually, truly, fundamentally,
> importantly, crucially, inherently, inevitably. **Cut them when they add nothing. Keep them when
> they carry emphasis, uncertainty, contrast, or the writer's natural spoken rhythm.**"

**The eighteen named patterns:** binary contrasts, throat-clearing openers, faux-insight setups,
colon reveals, superficial analysis (trailing `-ing` clauses: highlighting, underscoring,
reflecting, showcasing), importance puffery, interpretive metadiscourse, weasel attribution,
fake-strong verbs, synonym cycling, negative listing, dramatic fragmentation, robotic rhythm,
rhetorical setups, fake-profound kickers, summary-recap endings, formatting slop, em dashes.

**The portability test**, the single most transferable idea in the file:

> "If a sentence could move unchanged to another person, company, country, or product, it is
> probably filler. Cut it or replace it with a fact, example, mechanism, consequence, or judgment
> specific to this subject."

Two more worth keeping for portfolio copy:

> "**Protect the specific fact.** Don't smooth a useful detail into generic importance. 'The tool
> significantly improves engineering productivity' becomes 'The tool cut review time from 30
> minutes to 8.'"

> "**Always show, don't tell the reader what to think.** Make facts, actions, examples, and
> consequences carry the emphasis. Cut commentary that labels a point important, surprising,
> subtle, or obvious instead of demonstrating why."

**Em dash policy is graded, not absolute:** "In short copy, use none. In longer drafts, 1-2 are
fine if they clearly beat commas, periods, or parentheses." The project's zero-dash rule is
stricter than its source, deliberately.

**`eval.md`** is a 25-check pass/fail list run against the edited draft by the same agent that
made the edit: "Was the edit checked directly against this file without requiring separate editor
and evaluator agents?" Copying the eval-file pattern is more useful than copying the word list.

---

## 9. Owl-Listener/designer-skills

Source: `raw/Owl-Listener-designer-skills/` (5 files copied of 241 skills).

241 skills across 33 plugins in five collections (design-research, ux-strategy, ui-design,
interaction-design, design-ops), plus `designer-toolkit` and `visual-critique`. Each SKILL.md is
2-7KB and reads like a well-written textbook entry: correct, complete, and rarely specific enough
to change a decision. Verdict is based on the index plus eight representative files, not an
exhaustive read.

Concrete values that are there:

- **Measure:** 45-75 characters, 66 often cited as ideal. By context: long-form articles and docs
  55-70; UI body copy 45-65; captions 40-60; pull quotes 30-45. "Increase line-height slightly as
  column width grows (wider measure needs more leading)."
- **Spacing scale:** 2/4/8/16/24/32/48/64px from a 4 or 8px base, with named spacing *types*
  (inset, stack, inline, grid gap) and three density modes (compact one step down, comfortable,
  spacious one step up).
- **Type scale:** 12/14/16/20/24/32/40/48-64px on a 1.25 or 1.333 ratio; line-height tight 1.2,
  normal 1.5, relaxed 1.75; letter-spacing tight −0.02em, normal 0, wide 0.05em for uppercase
  labels; "Limit to 4-5 sizes in regular use."
- **Motion system:** duration tokens instant 50ms, fast 100ms, normal 200ms, moderate 300ms, slow
  400ms, deliberate 600ms. "Don't create more tokens than you have distinct use cases. 4-6 values
  is usually enough." Stagger 30-50ms; **total staggered sequence should not exceed 500ms**;
  direction consistency ("if elements slide in from the right, related outgoing elements slide out
  to the left"). Reduced motion handled "at the system level, not component by component", via a
  `duration-instant` override applied at `:root`.

Its easing tokens are Material Design derived and conflict with Emil Kowalski's: `ease-standard:
cubic-bezier(0.2, 0, 0, 1)`, `ease-decelerate: cubic-bezier(0, 0, 0.2, 1)` for entering,
`ease-accelerate: cubic-bezier(0.3, 0, 1, 0.3)` for **leaving**, `ease-spring:
cubic-bezier(0.34, 1.56, 0.64, 1)`.

One line worth keeping regardless of the verdict: "**Document what should NOT animate as clearly
as what should** - not everything moves."

The six Gestalt-law skills (proximity, similarity, closure, continuity, common region,
figure-ground) plus `von-restorff-effect` are readable primers. Nothing in them is actionable at a
level jakubkrehel's `better-layout/grouping-and-alignment.md` does not already cover with numbers.

---

## 10. haowjy/creative-writing-skills

Source: `raw/haowjy-creative-writing-skills/llm-writing_SKILL.md`,
`writing-principles_SKILL.md`.

The repo is a fiction-writing system: eleven agents (brainstormer, character-sim,
continuity-checker, critic, editor, muse, outliner, reader-sim, style-creator, web-researcher,
writer), genre resources for six genres, scene construction, style analysis, a knowledge-base
layer, and Claude Code hooks. None of that maps to a portfolio.

Two general-purpose files are exceptions.

`llm-writing/SKILL.md` has a nine-item "What to Delete" list that is a tighter version of
no-ai-slop:

> - Writing to fill a section because it exists. Delete it or merge its content where it belongs.
> - Labeling concepts without explaining how they work. Explain the mechanism or cut the label.
> - Stating conclusions without evidence. Show the evidence or drop the claim.
> - Hiding uncertainty behind confident language. Say what you don't know.
> - Softening every claim with qualifiers.
> - Repeating what you already said in different words, or summarizing the body as a conclusion.
> - Connecting ideas with transition words instead of meaning. If the relationship isn't clear
>   without the word, restructure.
> - Pairing clauses where one half already carries the meaning ("It's not X, it's Y"). Keep the
>   half that carries it.
> - Writing for the person who asked for the document instead of the person who will read it.
>   Write for the reader.

It also prescribes a revision order that moves outward and back: "Start with the whole artifact,
then move inward: structure, beats, paragraphs, sentences, words... after a local change, zoom
back out through the surrounding beat, larger structure, and full artifact."

`writing-principles/SKILL.md` is fiction-specific, but its em dash note reaches the same
conclusion as no-ai-slop independently: "Readers increasingly associate em dashes with
AI-generated prose." Its "Economy" principle transfers: "Every element does more than one thing...
The measure is whether removing the element would cost the reader something." That is a usable
test for a portfolio section, not only for prose.
