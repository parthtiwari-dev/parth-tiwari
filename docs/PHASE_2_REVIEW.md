# Phase 2 owner review: system and page architecture

Opened 2026-08-28; updated 2026-08-29. Phase 2 proceeds one route and one review checkpoint
at a time. The owner approved the refined landing structure and its interim public release
on 2026-08-29. `/work` is the next route architecture review; implementation remains Phase 3.

## Scope

Phase 2 locks the shared paper system, route structures, responsive behavior, typography,
content density, static world framing and accessibility states. It produces review demos
and stub renders, not the production site.

Excluded: production tear and backlight implementation, canvas, animated project worlds,
complete production pages and new runtime dependencies. The owner-approved interim release
publishes this reviewed root unchanged; it does not expand the Phase 2 implementation scope.

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
- the arrival stays free of navigation; after the hero, navigation arrives as its own folded
  paper edge and the lower roll must read as a real ending;
- refinement now happens on one version, one checkpoint at a time.

## Current landing reference lock

**Primary direction:** one full-width, continuous rag-paper scroll. Preserve the opening
unfurl, the post-hero folded navigation, the broad lower fold, blunt display type, sparse
mono labels, strict ruled grids and rare oxblood.

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

The owner approved the overall single-scroll direction on 2026-08-28 and asked for focused
craft passes before the landing structure is locked. The completed review slices change the
following:

- the arrival support copy is shorter, the hero and About share one asymmetric split ratio,
  and the portrait column keeps its deliberate empty space;
- the literal brown cylinder treatment is replaced by a lighter folded-paper unfurl, a
  post-hero sticky fold and a broad lower curl built from the real paper stock and CSS;
- non-hero sections use content-driven height and tighter spacing, so the document reads as
  one continuous message rather than a stack of artificial viewport pages;
- paper sides use three original transparent fibre profiles per side in a fixed order, so
  the damage is stable between reloads and no page-height polygon repeats;
- opening light, nav-fold shadow and ink-settle motion are one-shot transform/opacity
  studies and all stop after settling;
- project rows receive a fast torn-ink hover/focus study. It is an interaction preview only;
  project-specific backlights and real world stills remain Phase 4 work.

The pass also introduces one original transparent oxblood marginalia sheet at
`public/media/oxblood-marginalia-phase2.png`. It was generated as separated pen and dry-ink
marks without words or paper texture, then positioned sparingly as editorial evidence of a
hand. Bricolage Grotesque, Archivo and DM Mono remain the readable type system; handwriting
is not applied to body copy or controls.

The root landing also uses `public/media/oxblood-handscroll-marks.png` and three generated
transparent edge assets at `public/media/paper-edge-fibre-{a,b,c}.png`. The edge assets are
near-black alpha profiles with no paper fill, text, iconography, product evidence or invented
data. Each side uses the three profiles in a different fixed order.

`/` is now the single maintained Phase 2 landing stub. The obsolete
`/review/phase-2/` route is removed. Root placement does not mark the Phase 3 home slice as
complete. The stub contains:

- a CSS-only reload unfurl study using the real paper stock;
- no navigation during the arrival, followed by a full-width sticky paper fold after the
  hero;
- the chosen human hero line and two reader doors;
- one contained static BeatMind world study;
- the retained portrait, proof and services structures;
- the complete twelve-project register, latest Errata, honest Writing coming-soon state,
  contact section and physical bottom roll;
- a reduced-motion state that skips the opening and exposes every finished state
  immediately;
- a no-JavaScript reading experience because all content is static HTML.

The Phase 2 demo repeats the unfurl on every reload. Whether production remembers the first
visit is intentionally not decided here because that requires a later behavior decision and
client state. The production tear, centre-row world preview and animated project worlds are
still absent.

Run with `npm.cmd run dev` and open the printed local root URL. Astro increments the port when
the default is occupied. Capture all review sections and paired motion states with
`npm.cmd run phase2:capture -- --url <local-origin>`.

## 2026-08-29 rendered evidence

Each named slice passed HTTP, font and horizontal-overflow checks at 390, 800 and 1440
pixels, and its screenshots were visually inspected before the next slice began:

- `.shots/phase2-a1-restraint`: arrival breathing room, shared split ratio, About emptiness
  and mobile marginalia restraint;
- `.shots/phase2-a2-edge-fibres`: the three fixed edge profiles through the hero and long
  project register;
- `.shots/phase2-a3-paper-folds`: opening directional crease and lower broad fold, including
  the phone treatment without the cropped seal;
- `.shots/phase2-a4-paper-motion`: paired opening-light, nav-fold and ink-settle frames. The
  capture reported zero animations still running after settle at all three widths.
- `.shots/phase2-final-built`: the same responsive and motion evidence captured from the
  built static preview rather than the development server.

Full-sheet grain parallax was rejected before implementation. Moving the stock with
`background-position` would repaint during scroll; moving a separate overlay would promote a
page-height layer. Neither cost earns a barely visible effect. The retained motion changes
only transform and opacity, is bounded, and is removed under reduced motion.

The technical basis is current [MDN animation-performance guidance](https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/Animation_performance_and_frame_rate):
transform and opacity can remain in composition while geometry and painted backgrounds are
more expensive. The retained studies also stop under
[`prefers-reduced-motion`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40media/prefers-reduced-motion).
On 2026-08-29 the built static preview passed `a11y`, `craft` and `perf`: no page errors or
horizontal overflow at 390, 800 or 1440 pixels; complete no-JavaScript and reduced-motion
copy; no canvas; one first-party enhancement script; and zero transferred script bytes
because Astro inlined the small enhancement below the 30 kB Phase 2 ceiling. These checks
prove this landing craft slice only. Owner approval and the remaining Phase 2 route/system
work are still required before the phase gate can pass.

A later scroll-frame pass found that the large `drop-shadow()` applied to the complete
6,800-8,400px sheet was the source of visible jank. The one-variable A/B at 390, 800 and
1440px reduced p95 frame intervals from 33.4/66.6/83.4 ms to 16.7/16.7/16.8 ms after that
filter was removed, with no frames over 50 ms. The design keeps depth through the small
generated edge fibres and the local top/bottom fold shadows instead of filtering the full
document. Run `npm.cmd run perf:scroll -- --url <local-origin>` to repeat the diagnostic.

## Interim production evidence

The owner approved replacing v1 with this reviewed root landing to collect feedback. On
2026-08-29 `main` was fast-forwarded to the Astro rebuild and Vercel reported the commit as
successful. A cache-bypassed request to `https://parth-tiwari-1.vercel.app/` returned HTTP
200 with the new title and hero and without the old EPHEMERIS marker. The live URL then
passed `a11y`, `craft` and `perf` at 390, 800 and 1440 pixels. This evidence covers the
interim root only and does not satisfy the remaining Phase 2, Phase 3 or Phase 7 gates.

## Worlds research boundary

[`PHASE_2_WORLDS_ANIMATION_MEMO.md`](PHASE_2_WORLDS_ANIMATION_MEMO.md) inventories the real
data export, demonstrated interaction and accent status for the seven projects marked
`📐 specced` in `WORLDS.md`. Missing exports and unspecified accents are explicitly blocked.
The memo is storyboard input only and authorizes no world code.

## `/work` register review slice

The first `/work` study now lives on the real `/work/` URL on `redesign/v2`, while remaining
off `main` and production. It is a Phase 2 composition demo, not the Phase 3 production
route. Its case-study links intentionally point at the future `/work/[slug]/` URLs; those
destinations are not built in this phase.

The study uses the existing paper material, type and oxblood roles. Reference synthesis
adds a dense continuous catalogue, a thin separation between ordering and state filtering,
and compact project-row anatomy without importing another site's visual language. The
twelve real collection entries remain in one register. Row depth carries the
flagship/substantial/focused hierarchy so the page does not become three disconnected
lists.

Owner inputs currently represented in the render are:

- a human opening with editorial scale but controls still visible in the first viewport;
- `Featured`, `Build effort` and `Most recent` ordering;
- a separate `Active now` filter, matching `live`, `running` and
  `in-progress` entries;
- title, summary, status, qualitative effort, sourced start date and arrow on every row;
- one already-published verified fact on a flagship row only when the content collection
  supplies one;
- a static localised BeatMind preview study. No hover-driven world, centred-row touch
  preview, tear or animated world is implemented early.

The owner approved the opening, row hierarchy and controls on 2026-08-29, then rejected the
desktop preview panel because it overlaid row metadata and read as a separate black strip.
The refinement removes that panel and uses one faded BeatMind aperture behind the right edge
of the first row at every width. It also raises summary, evidence and metadata type sizes,
adds a shared torn-paper mobile menu, and makes Home's primary Work door enter `/work/`.

Rendered refinement evidence is in `.shots/phase2-work-detail-refinement`. The scripted pass
checks 390, 800 and 1440 pixel widths, all twelve default rows, six currently active rows,
most-recent ordering, overflow, image alternatives, named controls and browser errors. It
separately checks that all twelve entries remain visible and the enhancement controls
disappear with JavaScript disabled. The route-flow audit is in `.shots/phase2-route-audit`. The revised
preview and menu still need owner review; this does not complete a Phase 2 checklist item or
authorize a production merge.

Home keeps its lighter editorial index of all twelve projects because the complete-site plan
requires every project there. `/work` remains distinct by adding full summaries, evidence,
dates, ordering and state filtering; copying its complete layout back onto Home would erase
that distinction. This is a design recommendation awaiting owner confirmation.

No `personal` or `company` ownership field exists in the validated project records. Only
Spur Chat is explicitly sourced as a take-home. A context filter or badge is blocked until
the owner identifies which projects were produced during employment and which organization
may be named publicly.

## Review sequence

1. Review the post-hero navigation fold, opening unfurl, segmented side damage and lower
   curl.
2. Review whether the tightened section rhythm now feels like one continuous message.
3. Review the torn-ink project hover/focus and the amount of marginalia.
4. Lock the landing tokens and responsive rules only after desktop, tablet and phone pass.
5. Review the revised `/work` under-row preview and paper mobile menu. Keep the route on
   `redesign/v2` until that review is approved.
6. After `/work`, review the shared case-study structure, then Notes, About, Resume and Hire
   one route family at a time.

## Already locked, not reopened here

- Astro static output, content collections, vanilla CSS and one runtime dependency;
- one continuous sheet and real paper stock;
- eight route families, with no separate Blog or Experience route;
- no public pricing and qualitative build-effort sorting;
- Bricolage Grotesque, Archivo and DM Mono in their recorded roles;
- oxblood reserved for actions, focus-worthy emphasis and paper bleed;
- complete static DOM, native scroll, keyboard and touch parity, reduced-motion final states;
- no production tear, backlight or animated world before its assigned phase.
