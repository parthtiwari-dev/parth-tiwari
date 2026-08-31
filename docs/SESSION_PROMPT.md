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

The maintained routes are /, /work/, /work/beatmind/, /work/vivid/, /notes/, /notes/[slug]/, /about/,
/resume/ and /hire/. The owner-approved BeatMind Sound Foundry remains a standalone research
animatic, not a production world. There is still no production tear, backlight or canvas
world in Astro.

The Vivid Story Loom remains a standalone native-scroll study and the owner deferred its deep
review. `/work/vivid/` is now a separate static paper case study generated through the shared
typed contract. `docs/VIVID_CASE_STUDY_AUDIT.md` records the inspected `main` and
`upgrade-flux` history, current plan boundary, evidence and maintenance workflow. The Vivid
source repository was read only and its dirty Phase 4 work remains untouched. Do not present
the source-only named-reference checkpoint or the plan's identity and speed targets as achieved.

The next safe work stays inside Phase 3B: audit and add the next project case-study record, or
perform an owner-requested Vivid paper refinement. Do not move either Vivid or BeatMind world
study into Astro yet. Production worlds remain Phases 5 and 6.

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
