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
