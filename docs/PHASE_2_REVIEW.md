# Phase 2 owner review: system and page architecture

Opened 2026-08-28. Phase 2 proceeds one route and one review checkpoint at a time. The
landing page is the only active route. `/work` and every other route wait until the landing
structure is approved.

## Scope

Phase 2 locks the shared paper system, route structures, responsive behavior, typography,
content density, static world framing and accessibility states. It produces review demos
and stub renders, not the production site.

Excluded: production tear and backlight implementation, canvas, animated project worlds,
complete production pages, deployment and new runtime dependencies.

## Research and source boundary

The reference set for the current landing review is:

- the owner's 2026-08-28 screenshots of the strongest sections from Direction C;
- the owner-supplied parchment-scroll image for the broad physical idea only;
- the real licensed `public/media/paper-stock.jpg` used for the implementation;
- the Phase 1 content collections and claim records;
- the approved local craft references recorded before the first exploration.

The supplied parchment image contains a watermark and is not a site asset. The build does
not copy, crop, ship or trace it. The first recreation followed its cylindrical silhouette
too literally and the owner rejected that result. The replacement uses the project's real
paper stock and CSS to construct broad folded lips, shadows and irregular edges in the site's
own visual language.

## First exploration, rejected

The first checkpoint produced three interactive studies:

- A, The Working Sheet;
- B, The Technical Register;
- C, Paper Over the Void.

The owner rejected all three as complete directions on 2026-08-28. The comparison index,
direction routes and direction-specific component logic were removed. They remain
recoverable from Git history. This rejection is useful evidence:

- the sheet must span the desktop rather than float inside a dark gutter;
- the project demo must be contained in the hero, never used as wallpaper behind paper;
- the page should feel like an old message being physically unrolled;
- the nav belongs in the upper roll and the lower roll must read as a real ending;
- refinement now happens on one version, one checkpoint at a time.

## Current landing reference lock

**Primary direction:** one full-width, continuous rag-paper scroll. Preserve the physical
top and bottom rolls, blunt display type, sparse mono labels, strict ruled grids and rare
oxblood.

**Retain from the rejected C study:**

- the illustrated `Hi, I am Parth.` section;
- the three-column proof treatment with denominators;
- the three-column `Where I can be useful.` section;
- the left-copy/right-project composition, after removing the background world and red
  frame treatment that made the project feel pasted on.

**Hero copy:** use the Phase 1 line, `I build AI products, break them, fix them, and write
down what actually happened.` It is the most direct and human of the three candidates and
already has a validated content source. This remains reviewable after it is seen in context.

**Media roles:**

- real paper stock owns the sheet and folds;
- the generated portrait remains a concept study derived from the real portrait, not an
  approved production likeness;
- the real BeatMind screenshot stays inside a dark product-world plate;
- no fake project numbers, interface states or product screenshots are introduced.

**Reject:** paper floating in a void, a project UI behind the sheet, narrow desktop canvas,
rounded SaaS cards, decorative serif swaps, generic gradients, invented evidence and a
second batch of competing landing directions.

## Current implementation checkpoint

The owner approved the overall single-scroll direction on 2026-08-28 and asked for one
focused craft pass before the landing structure is locked. That pass changes four things:

- the literal brown cylinder treatment is replaced by a lighter folded-paper unfurl and
  upper/lower curl built from the real paper stock and CSS;
- non-hero sections use content-driven height and tighter spacing, so the document reads as
  one continuous message rather than a stack of artificial viewport pages;
- paper sides and corners expose irregular dark bites without cutting into the content grid;
- project rows receive a fast torn-ink hover/focus study. It is an interaction preview only;
  project-specific backlights and real world stills remain Phase 4 work.

The pass also introduces one original transparent oxblood marginalia sheet at
`public/media/oxblood-marginalia-phase2.png`. It was generated as separated pen and dry-ink
marks without words or paper texture, then positioned sparingly as editorial evidence of a
hand. Bricolage Grotesque, Archivo and DM Mono remain the readable type system; handwriting
is not applied to body copy or controls.

`/review/phase-2/` is now the only landing review route. It contains:

- a CSS-only reload unfurl study using the real paper stock;
- a full-width top roll containing navigation;
- the chosen human hero line and two reader doors;
- one contained static BeatMind world study;
- the retained portrait, proof and services structures;
- the complete twelve-project register, latest Errata, honest Writing coming-soon state,
  contact section and physical bottom roll;
- a reduced-motion state that skips the opening animation and exposes the finished page
  immediately;
- a no-JavaScript reading experience because all content is static HTML.

The Phase 2 demo repeats the unfurl on every reload. Whether production remembers the first
visit is intentionally not decided here because that requires a later behavior decision and
client state. The production tear, centre-row world preview and animated project worlds are
still absent.

Run with `npm.cmd run dev` and open the printed local URL followed by
`/review/phase-2/` (Astro increments the port when the default is occupied). Capture all
review sections with `npm.cmd run phase2:capture -- --url <local-origin>`.

## Review sequence

1. Review the folded top roll, opening unfurl, side/corner damage and lower curl.
2. Review whether the tightened section rhythm now feels like one continuous message.
3. Review the torn-ink project hover/focus and the amount of marginalia.
4. Lock the landing tokens and responsive rules only after desktop, tablet and phone pass.
5. Build and review `/work` structure only after the landing checkpoint is approved.

## Already locked, not reopened here

- Astro static output, content collections, vanilla CSS and one runtime dependency;
- one continuous sheet and real paper stock;
- eight route families, with no separate Blog or Experience route;
- no public pricing and qualitative build-effort sorting;
- Bricolage Grotesque, Archivo and DM Mono in their recorded roles;
- oxblood reserved for actions, focus-worthy emphasis and paper bleed;
- complete static DOM, native scroll, keyboard and touch parity, reduced-motion final states;
- no production tear, backlight or animated world before its assigned phase.
