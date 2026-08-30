# Build-session prompt

Use this prompt in a fresh session after the completed Phase 2 gate.

```text
Read these in order before taking action:

1. docs/RULES.md
2. docs/DESIGN_LOCK.md
3. docs/WORLDS.md
4. docs/BUILD_PLAN.md
5. docs/CONTENT_PROVENANCE.md
6. docs/DECISIONS.md
7. CLAUDE.md

The portfolio is Paper and Worlds on Astro 7.2.9 with static output. Phase 0 established the
foundation. Phase 1 established validated content and claims; its unrun text-only human test
was deferred, not passed. Phase 2 closed on 2026-08-31 after the owner accepted the current
route designs as the review baseline and deferred further visual polish.

The Phase 2 gate evidence is in docs/PHASE_2_GATE.md and .shots/phase2-gate-final. It covers
all eight route families at 390, 800 and 1440 pixels, plus no-JavaScript, reduced-motion,
touch, keyboard focus, contrast, font budget and the static dependency boundary. Do not
report the deferred polish pass as complete.

The maintained routes are /, /work/, /work/beatmind/, /notes/, /notes/[slug]/, /about/,
/resume/ and /hire/. The owner-approved BeatMind Sound Foundry remains a standalone research
animatic, not a production world. There is still no production tear, backlight or canvas
world in Astro.

The owner's next requested task is a Vivid world planning and concept-image review. Treat it
as research/storyboard input only: inspect the current Vivid upgrade-flux branch and its plan
before proposing anything, map the world to the intended final product rather than a stale
snapshot, use only real capabilities and evidence, and generate concept imagery for owner
review before implementation. Do not start Phase 5 production world code out of order.
Phase 3 remains the next implementation phase unless the owner explicitly amends BUILD_PLAN.

Begin with git status and diff. Preserve all current work. Stop at the applicable gate.
```

## Drift checks

Stop the session if:

- a public claim has no provenance record;
- a later implementation phase begins before the current gate;
- exploratory Vivid imagery is presented as a real product output without evidence;
- the Vivid world is planned from stale portfolio assumptions instead of the current
  `upgrade-flux` end-state plan;
- a gate is described as passing without current output.
