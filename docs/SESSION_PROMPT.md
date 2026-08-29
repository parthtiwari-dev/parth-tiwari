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

- Do not implement the Phase 3 production routes, project backlight, tearing, canvas or
  animated worlds. The maintained Phase 2 root stub and bounded paper-motion studies are
  allowed.
- Research references before designing and record a reference lock.
- One interactive full-width scroll landing exists at `/` from the real Phase 1 content.
  The obsolete review route and rejected A/B/C routes were removed.
- The owner approved its overall direction. The current checkpoint includes the restraint
  pass, stable segmented fibre edges, directional opening/end folds, bounded one-shot paper
  motion and the existing torn-ink project hover. This approved root is live at
  `https://parth-tiwari-1.vercel.app/` as an interim feedback release.
- `docs/PHASE_2_WORLDS_ANIMATION_MEMO.md` records candidate graphics for the seven specced
  worlds. It is research only and authorizes no world implementation.
- Review one route at a time. Home and `/work` architecture are approved. Do not add a
  Personal/Company register filter; verified employment context belongs inside a case study.
- The shared `/work/[slug]` case-study structure is next, using BeatMind as the real-content
  pilot. Ask only case-study questions before rendering it.
- Do not build the production site, tear, backlight, canvas or animated worlds.
- Refresh the 390, 800 and 1440 evidence after changes. Preserve the approved landing while
  reviewing `/work`; production route implementation remains Phase 3.

Begin by confirming the current branch and diff. Preserve the approved landing checkpoint.
Review the shared `/work/[slug]` structure next at phone and desktop widths. Phase 2 remains incomplete until
every route structure, shared token, accessibility state and rendered-contrast gate is
approved and verified.
```

## Drift checks

Stop the session if:

- any file under `design/directions/` is opened during Phase 1;
- CSS or a visual component is created during Phase 1;
- retained v1 prose is treated as verified merely because it exists;
- a public claim has no provenance record;
- a later phase begins before the current gate and owner approval;
- a gate is described as passing without current output.
