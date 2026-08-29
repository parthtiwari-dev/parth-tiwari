# Phase 2 BeatMind world study

Opened 2026-08-29. This is an owner-review storyboard rendered as a standalone design
artifact. It is not part of the Astro route, does not alter `/work/beatmind/`, does not
authorize Phase 5 and does not satisfy a Phase 2 checklist item.

**Owner response, 2026-08-30:** the owner liked the first study and its thoughtfulness but
did not accept its clean diagram-and-card treatment as the final visual target. Follow-up
research produced the Sound Foundry. The owner then approved that premise, its nine-scene
order and the current five-stem BeatMind language. This document now describes the replacement
animatic. Production implementation still waits for Phase 5.

## Question being tested

Can BeatMind begin with a scroll-only, immersive explanation of the product and then hand
the reader to the existing paper case study for the engineering deep dive?

The world and the paper have different jobs:

- the world makes the product understandable through motion;
- the paper preserves the complete readable, crawlable case study, evidence and decisions.

No click, drag, sound or feedback prompt is required to finish the world. Native document
scroll is the only input. The page includes a skip link, a no-JavaScript reading path and a
reduced-motion reading path.

## Reference lock

This study keeps the dark BeatMind surface from `design/directions/lock.html`, the current
paper system and the product's own coloured-stem language. It rejects a fake mixer, a copied
product interface, scroll snapping, trapped scrolling, autoplay audio and invented metrics.
Generated machinery is used only as a dark decorative environment. Code-drawn score data is
kept visually and technically separate from it.

The moving score comes from the owner-authored BeatMind browser synth in
`apps/web/src/lib/beat.ts` in the separate BeatMind checkout: 124 BPM, C-sharp minor, eight
bars and five independently controlled stems. The five current palette entries come from
`apps/web/src/config/stemTypes.ts` and `apps/web/src/app/globals.css`:

- vocals `#f0a2c0`;
- backing vocals `#c58fd6`;
- drums `#f0955a`;
- bass `#5aa8f0`;
- other `#7de3a8`.

The owner chose the current five-stem product language on 2026-08-30. `WORLDS.md` now records
that decision and retires the stale four-stem storyboard.

## Approved scroll story

1. **Specimen chamber:** one source waveform coils inside black glass.
2. **Separation gantry:** the source is drawn into five current BeatMind stem lanes.
3. **Worker loss:** a labelled storyboard interruption breaks the run.
4. **Retry:** the same durable operation continues forward.
5. **Analysis scanner:** tempo, key, bars, chords and sections attach to the shared clock.
6. **Arrangement deck:** sections move without leaving that clock.
7. **Mix chamber:** five stem levels become one balance.
8. **Render press:** five working parts collapse into one mixdown.
9. **Deep dive:** the finished mixdown stays inside the dark world and offers one explicit
   link to the complete paper case study.

The failure and recovery states are deliberately labelled as storyboard states. The
BeatMind repository contains capture tooling for real preparation stages, but no complete
publishable failure-and-retry export was found. No fake job identifier, duration or trace is
used here. Phase 5 remains blocked on that real export and on an approved audio excerpt.

## Implementation budget used by the study

- standalone HTML, CSS and one Canvas 2D module;
- native scroll with a sticky visual stage;
- no new package or runtime dependency;
- frame loop capped at 30 fps and paused while the page is hidden;
- stable source-derived score data rather than per-load randomness;
- six stable generated machine plates used only as decorative atmosphere;
- canvas hidden with JavaScript disabled while all nine textual scenes remain.

This is disposable storyboard code. If approved, Phase 5 must implement the shared world
lifecycle and data contract before promoting any drawing code into the Astro site.

## Rendered evidence

Evidence is under `.shots/phase2-beatmind-world-study/`. The replacement Sound Foundry
animatic was scripted and visually inspected on 2026-08-30 at 390, 800 and 1440 pixels:

```text
phone-390: 9 scenes, overflow 0px, ending present, paper absent, errors 0
tablet-800: 9 scenes, overflow 0px, ending present, paper absent, errors 0
desktop-1440: 9 scenes, overflow 0px, ending present, paper absent, errors 0
no-js: 9 scenes, ending present, paper absent, canvas removed
reduced-motion: 9 scenes, 1 final plate, world 4795px, errors 0
```

The final owner-requested capture reports the ending CTA present and the paper section absent
at 390, 800 and 1440 pixels, with zero overflow and zero browser errors. No JavaScript keeps
all nine sections and the CTA while removing the canvas. Desktop keeps one continuous
industrial field and moves the actual score through it. Phone uses closer environment crops,
lower-third copy and a separate stem legend. The final mixdown seals into a dark master state.
Reduced motion shows that final composed machine state immediately and keeps the nine readable
sections.

## Inputs still blocked before Phase 5

- Which complete real failure-and-retry trace can be exported for publication?
- Which real separated-track envelopes and analysis markers form the production specimen?
- Which owner-created or licensed audio excerpt may be used, if any?
- The exact production route transition receives owner review with the Phase 5 storyboard
  gate; this Phase 2 artifact locks the world-ending boundary and CTA hierarchy without
  shipping the animated world.
