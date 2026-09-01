# Phase 4 paper-transition motion studies

Status: **Sheet Fault selected and implemented; final rendered owner approval remains open**.

Date: 2026-09-01

## Boundary

The original checkpoint compared three non-production ways for a rendered project entry to
leave the paper and reveal its approved world still. The comparison artifact itself still
does not add production behavior to Astro; the later production translation and gate are
recorded at the end of this document. Animated world motion remains outside Phase 4.

The owner directed Phase 4 to begin before the remaining Phase 3 render review, human test
and preview deployment. That is a recorded work-order exception, not a Phase 3 gate pass.

## Inputs already settled

- The eventual enhancement applies to both the Home project index and `/work` register.
- The preview uses an approved world still. Until one exists, a real published case-study
  proof may be used temporarily and must be labelled as proof rather than world imagery.
- Pointer hover dwell is 180 milliseconds. Keyboard focus previews immediately.
- The complete tactile handoff must finish within 500 milliseconds.
- Coarse pointers use the entry nearest the viewport centre while native scrolling remains
  in control.
- Reduced motion keeps the composed preview and skips the tear.
- The study uses the real paper stock and approved BeatMind Sound Foundry still. It creates
  no simulated product UI or invented data graphic.

## Reference lock

The target stays inside the existing Paper and Worlds system: one full-width rag-paper
surface, stable fibre damage, oxblood only for the selected review state, dark world below
the paper and native document scrolling. The Phase 2 `/work` row hierarchy is the structural
reference. The old `paper.html` prototype remains material evidence only and is not copied.

The comparison artifact is:

- `design/directions/phase-4-paper-transition.html`
- `design/directions/phase-4-paper-transition.css`
- `design/directions/phase-4-paper-transition.js`

Run `npm run phase4:study` to review the comparison locally at
`http://127.0.0.1:4326/`. This dedicated server keeps the artifact out of the public Astro
route set.

## Study comparison

### A. Row Rip

The selected rendered row splits into two narrow, irregular paper strips. The world appears
exactly where the chosen entry was, so selection and destination remain closely connected.
It has the clearest hierarchy, the least animated area and the strongest performance result.

Trade-off: it is deliberately local and less cinematic than the other studies.

### B. Edge Peel

The selected rendered row separates on one jagged vertical seam and peels toward opposite
edges. Direction is clearer and the paper feels slightly heavier than Row Rip.

Trade-off: the divided label can briefly read like two detached scraps on a phone. It also
has a few isolated slow frames even though its p95 remains within one 60 Hz frame.

### C. Sheet Fault

The full rendered sheet separates around the selected row, making the world feel like a
fault beneath the document. This is the most dramatic and the strongest literal expression
of a world behind the paper.

Trade-off: it animates too much surface. Fresh-page measurement reaches 83.3 ms p95 on the
800-pixel viewport and 166.7 ms p95 at 1440 pixels. This breaks the Phase 4 performance
budget and makes the technique unsuitable for production in its current form.

## Rendered evidence

Run:

```bash
npm run phase4:study-capture
```

The command starts an isolated local static server, captures each study at 390, 800 and
1440 pixels, checks overflow and browser errors, verifies the reduced-motion composition and
measures two clean runs after discarding one warm-up run. Output lives in
`.shots/phase4-motion-studies/`.

Each width and study contains:

- `default`
- `preview`
- `tear-mid`
- `tear-final`
- `reduced`

All 45 screenshots returned HTTP 200 with zero horizontal overflow and zero page errors.
All nine reduced-motion checks rendered zero tear pieces while retaining the world preview.

| Viewport | Row Rip p95 / frames over 33.4 ms | Edge Peel p95 / frames over 33.4 ms | Sheet Fault p95 / frames over 33.4 ms |
|---|---:|---:|---:|
| 390 | 16.8 ms / 0 | 16.8 ms / 1 | 33.4 ms / 4 |
| 800 | 16.7 ms / 0 | 16.7 ms / 1 | 83.3 ms / 19 |
| 1440 | 16.8 ms / 0 | 16.8 ms / 2 | 166.7 ms / 17 |

The measurements are a comparative development signal, not a production performance gate.
Production code does not exist yet.

## Visual inspection

The inspected 390, 800 and 1440 frames preserve the full-width paper surface and use the
real BeatMind still. Row Rip maintains the strongest project-to-world continuity. Edge Peel
has convincing direction on tablet and desktop but becomes busier on phone. Sheet Fault is
visually legible at all three widths, yet its broad overlap and measured jank outweigh its
drama. The review toolbar is artifact-only and will not ship.

## Owner selection and production translation

The owner selected **C: Sheet Fault** on 2026-09-01 because its material story was strongest,
while explicitly accepting that its first study might need later optimization. The study's
full-root browser snapshot was not carried into production: it was the source of the 83.3 ms
and 166.7 ms p95 results above.

Production keeps the selected visual argument with a cheaper mechanism:

- the approved world still expands behind the page;
- two fixed paper panels use the real paper stock and separate around the chosen row;
- each panel carries a sanitized, inert clone of only that real rendered row;
- panel movement is transform-only and completes in 440 milliseconds;
- the real anchor remains the routing source of truth;
- reduced motion, JavaScript absence and forced enhancement failure navigate directly.

`npm run phase4:gate` captures the implementation at 390, 800 and 1440 pixels on both Home
and `/work`. All six measured transition paths returned 16.7-16.8 ms p95 with zero overflow
or browser errors. Keyboard, pointer, centred-row touch, destination focus, Back restoration,
reduced motion, no-JavaScript navigation and forced-failure navigation pass. Evidence lives
in `.shots/phase4-production/`.

This closes the study-selection checkpoint. The remaining Phase 4 owner gate is approval of
the final production renders, not another A/B/C selection. The independent revert gate is
recorded in `docs/PHASE_4_GATE.md` and passes.
