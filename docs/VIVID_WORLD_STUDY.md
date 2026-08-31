# Vivid Story Loom review study

Implemented 2026-08-31. Status: **standalone owner-review animatic; not a production Astro
route and not a completed project world**.

## What was built

`design/directions/vivid-world.html` turns the selected Story Loom concept into eight
native-scroll chapters:

1. written scene;
2. shot plan;
3. character anchor;
4. real evaluation frames arriving;
5. the previous-render conditioning failure;
6. intended neutral-reference binding;
7. explicitly future multi-style research;
8. complete storyboard and paper-case-study handoff.

The page uses one sticky visual stage and normal document scrolling. Intersection Observer
selects the active chapter. One throttled scroll update moves only the concept plate and
progress transform, with a 32 ms minimum interval. It adds no package, captures no pointer
and does not snap or hijack scroll.

## Asset and evidence boundary

The decorative loom plate at
`design/references/vivid-story-loom/vivid-story-loom-concept.png` was generated for this
review from Vivid's real single-character inspection sheet. It is art direction, not product
output, and is never labelled as evidence.

The foreground anchor and four shots were copied unchanged from the real local Vivid run
folder `evals/runs/phase3-fast-legacy-clean-852da6d/images/single_character` on the current
`upgrade-flux` checkout. The source repository was inspected read-only and its substantial
uncommitted Phase 4 work was not changed. These frames expose actual continuity defects as
well as strengths; the review does not quietly replace them with cleaner generated concepts.

The oxblood failure treatment is explicitly labelled an illustrated state. A publishable
frame pair from the verified previous-render pose-copying experiment is still required before
production. Anime, watercolour, ink and stop-motion remain concept-board future research,
not current FLUX.2 mode claims.

## Rendered evidence

Local browser evidence is under `.shots/vivid-story-loom/`:

- `1440-arrival.png`, `1440-frames.png`, `1440-failure.png`, `1440-ending.png`;
- `800-arrival.png`, `800-frames.png`, `800-reduced-motion.png`;
- `390-arrival.png`, `390-frames.png`.

The 390, 800 and 1440 views have no horizontal overflow. All referenced images loaded at
their intrinsic width, the self-hosted fonts reached `loaded`, the eight active scene states
advanced under native scroll, the skip link reached `#world-ending`, the final work-register
link remained visible and browser logs contained no errors or warnings.

The 800 reduced-motion screenshot uses the review query `?motion=reduce`, which applies the
same static rules as the `prefers-reduced-motion` media block: no sticky stage, all chapters
readable and the complete evidence grid visible. This proves the intended visual state but
is not a native operating-system media-emulation test. The `<noscript>` fallback and semantic
image alternatives are present in source, but JavaScript-disabled rendering was not available
in the selected in-app browser and therefore is **not reported as rendered evidence**.

## Design QA

`design-qa.md` compares the selected Story Loom board with the rendered desktop and phone
frame-arrival states. One mobile collision between the source label and narrative card was
found and fixed by removing the redundant source readout below 820 px. The final comparison
has no open P0, P1 or P2 issue. The concept plate remains a large review PNG; production must
derive responsive, licensed AVIF/WebP plates only after the direction and crops are approved.

## What this does not authorize

- It does not add `/work/vivid/` or another production route.
- It does not complete the Vivid case study.
- It does not claim the current identity/reference phase passed in the Vivid repository.
- It does not publish the current evaluation frames or settle their model-licence boundary.
- It does not move the portfolio from Phase 3 to the later project-world implementation
  phase.

## Owner review

The owner should review the complete scroll, especially the frame-arrival, failure,
future-style and ending chapters. Approval would lock Story Loom as Vivid's storyboard
direction; it would not yet approve these evaluation images as the production dataset.
