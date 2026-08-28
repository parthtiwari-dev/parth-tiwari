# Build-session prompt

Use this prompt in a fresh session to finish the Phase 1 human gate. The content,
provenance and automated checks are already implemented. Do not rebuild them or start Phase 2.

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
established the foundation. Phase 1 now has validated content, claims and a text artifact.

Work phases in BUILD_PLAN.md in order. Finish the Phase 1 human gate and stop.

The remaining Phase 1 work is human validation only:

- Do not open design/directions/*.
- Do not create CSS.
- Do not create visual components.
- Do not implement paper, previews, tearing, canvas, animation, or worlds.
- Use `docs/TEN_SECOND_ARTIFACT.md` exactly as instructed.
- The owner recruits five people who have not seen it and records verbatim answers in
  `docs/TEN_SECOND_TEST.md`.
- The agent does not simulate participants, paraphrase their answers, or mark the gate passed.
- Review the working hero sentence with the real answers before locking it.

Begin by running `npm run phase1:gate` and confirming the current content commit. Then help
the owner administer and record the five-person test. Show the score, ask for the final hero
decision, update the affected live documents in the same commit, and stop before Phase 2.
```

## Drift checks

Stop the session if:

- any file under `design/directions/` is opened during Phase 1;
- CSS or a visual component is created during Phase 1;
- retained v1 prose is treated as verified merely because it exists;
- a public claim has no provenance record;
- a later phase begins before the current gate and owner approval;
- a gate is described as passing without current output.
