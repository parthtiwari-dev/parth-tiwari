# Phase 6A Vivid Story Loom audit

Status: **implementation in progress; automated browser gate and owner review remain open.**

## Production contract

Vivid is the sole Phase 6A project. `/work/vivid/world/` is a static Astro route and
`/work/vivid/` remains its canonical paper case study. Home and the work register use the
validated world record to enter the world first.

The world consumes `src/data/worlds/vivid-world-v1.json`, a versioned publication-only
export audited to Vivid commit `852da6d`. It contains one owner-cleared Kyoto pottery
evaluation anchor, four ordered real evaluation frames, scene labels, continuity notes and
references to the verified base and rejected-Turbo claims. It deliberately excludes prompts,
seeds, run identifiers, user data and private paths.

## Evidence boundaries

- The Story Loom plate is decorative machinery with empty rails. It is not Vivid output and
  has empty alternative text when used in the animated stage.
- The character anchor and four evaluation frames are the only product-image evidence in the
  world. They retain useful descriptive alternative text and intrinsic dimensions.
- The verified previous-render pose-copying finding has no cleared visual comparison. The
  world says so in ordinary HTML and shows no reconstructed or illustrative failure frame.
- Portfolio use of this one sequence is owner-cleared. Vivid's commercial product-model
  licence remains unresolved and is stated in the current-boundary scene.

## Gate

`npm run phase6:vivid-gate` runs the Phase 5 gate then checks Vivid data validation, private
data patterns, route handoff, real-image alternative text, responsive animation, no-JavaScript,
reduced-motion, Canvas failure, native scrolling, Back restoration and the 30fps/50ms budget.

The scripted browser portion is pending because the local browser process was blocked by the
Codex usage limit on 2026-09-02. This is an environment limitation, not a passing gate. Run
the command again when local Playwright execution is available, then review the generated
`.shots/phase6-vivid-world/` renders at 390, 800 and 1440 pixels before closing Vivid.
