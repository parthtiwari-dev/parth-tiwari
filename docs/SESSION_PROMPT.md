# Build-session prompt

Use this prompt in a fresh session to work on Phase 2 design-system and page-architecture
exploration. Phase 1 is complete under its owner-amended gate.

```text
Read these in order before taking action:

1. docs/RULES.md
2. docs/DESIGN_LOCK.md
3. docs/WORLDS.md
4. docs/BUILD_PLAN.md
5. docs/CONTENT_PROVENANCE.md
6. docs/DECISIONS.md
7. CLAUDE.md

The portfolio is being rebuilt as Paper and Worlds on Astro 7.2.9 with static output. Phase 0
established the foundation. Phase 1 established validated content and claims. The owner
deferred the unrun text-only test; do not call it passed.

Work phases in BUILD_PLAN.md in order. Start Phase 2 owner review and visual exploration.

Phase 2 is design-system and route-architecture work:

- Do not open design/directions/*.
- Do not create CSS.
- Do not create visual components.
- Do not implement paper, previews, tearing, canvas, animation, or worlds.
- Research references before designing and record a reference lock.
- Build three distinct local demo directions from the same real Phase 1 content.
- Ask the owner one comprehensive batch of visual and route-structure questions.
- Do not build the production site, tear, backlight, canvas or animated worlds.
- Show real renders at 390, 800 and 1440 pixels before asking the owner to lock a direction.

Begin by confirming the Phase 1 commit and clean worktree. Inspect the approved design lock,
research artifacts and paper prototype as references, not code to port. Present the research
synthesis and comprehensive owner choices before production implementation.
```

## Drift checks

Stop the session if:

- any file under `design/directions/` is opened during Phase 1;
- CSS or a visual component is created during Phase 1;
- retained v1 prose is treated as verified merely because it exists;
- a public claim has no provenance record;
- a later phase begins before the current gate and owner approval;
- a gate is described as passing without current output.
