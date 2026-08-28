# Build-session prompt

Use this prompt in a fresh build session after the Phase 0 gate and owner approval. The
repository carries the detailed plan, so the session should execute Phase 1 directly without
replanning the whole rebuild.

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
removed the Vue/Three.js constellation and established the verified static foundation.

Work phases in BUILD_PLAN.md in order. Start with Phase 1 only and stop at its gate.

Phase 1 is content and provenance only:

- Do not open design/directions/*.
- Do not create CSS.
- Do not create visual components.
- Do not implement paper, previews, tearing, canvas, animation, or worlds.
- Inspect the retained source data as an inventory, not as approved public copy.
- Ask the owner every Phase 1 question before settling public wording or uncertain facts.
- Never invent a number, testimonial, client, user count, price, result, link, or deployment.
- Every publishable claim needs a CONTENT_PROVENANCE.md record.

Begin by reporting the repository state, Phase 1 scope and exclusions, the files expected to
change, and the exact owner decisions required by BUILD_PLAN.md. Do not open a design artifact.

Build only after those questions are answered. Run the Phase 1 gate, update every affected
live document and checklist in the same commit, show the evidence, and stop before Phase 2.
```

## Drift checks

Stop the session if:

- any file under `design/directions/` is opened during Phase 1;
- CSS or a visual component is created during Phase 1;
- retained v1 prose is treated as verified merely because it exists;
- a public claim has no provenance record;
- a later phase begins before the current gate and owner approval;
- a gate is described as passing without current output.
