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

Work phases in BUILD_PLAN.md in order. Continue Phase 2 owner review and visual exploration.

Phase 2 is design-system and route-architecture work:

- Do not implement the production paper shell, project backlight, tearing, canvas,
  animation, or worlds. Phase 2 review stubs are allowed.
- Research references before designing and record a reference lock.
- One interactive full-width scroll landing exists at `/review/phase-2/` from the real
  Phase 1 content. The rejected A/B/C routes were removed.
- Review one route at a time. The landing page is the only active route.
- Do not build the production site, tear, backlight, canvas or animated worlds.
- Refresh the 390, 800 and 1440 evidence after changes. Refine the landing one checkpoint at
  a time, beginning with the top roll, unfurl and hero.

Begin by confirming the current branch and diff. Run the local review route and collect the
owner's feedback on the current checkpoint. Record the approved landing structure before
starting `/work`. Phase 2 remains incomplete until every route structure,
shared token, accessibility state and rendered-contrast gate is approved and verified.
```

## Drift checks

Stop the session if:

- any file under `design/directions/` is opened during Phase 1;
- CSS or a visual component is created during Phase 1;
- retained v1 prose is treated as verified merely because it exists;
- a public claim has no provenance record;
- a later phase begins before the current gate and owner approval;
- a gate is described as passing without current output.
