# Build-session prompt

Use this prompt in a fresh build session. The repository carries the detailed plan, so the
session should execute Phase 0 directly without requiring a separate plan-mode pass.

```text
Read these in order before taking action:

1. docs/DESIGN_LOCK.md
2. docs/WORLDS.md
3. docs/BUILD_PLAN.md
4. docs/CONTENT_PROVENANCE.md
5. docs/DECISIONS.md
6. CLAUDE.md

The portfolio is being rebuilt from the Vue/Three.js constellation into Paper and Worlds.
The public brand is Parth Tiwari. The landing is one long sheet of real rag paper. Projects
are entries on it. The paper can backlight to reveal a project preview, then tear into that
project's real route and scroll-directed world.

The design direction is locked, but no phase is assumed perfect. Follow the working protocol
in BUILD_PLAN.md section 0. At the start of every phase, state the scope and exclusions, ask
the owner the phase-specific questions, and show the proposed reference lock, route structure
or storyboard where applicable. Build in the named checkpoints, keep the owner updated, run
the gate, show the evidence and stop. Do not begin the next phase until the owner approves.

Work phases in BUILD_PLAN.md in order. Start with Phase 0 only.

Before deleting anything:

- inspect git status and the current diff;
- resolve the exact deletion manifest from BUILD_PLAN.md section 3;
- show the full list of files/directories and dependency changes;
- explain what survives;
- wait for the owner's approval.

Phase 1 is content and provenance only. Do not open design/directions files, create CSS or
build visual components. It has been skipped twice and is not skipped again.

Phase 3 must ship a complete, readable, crawlable preview site with no canvas, no tear and no
animated world. Phase 4 adds the paper signature as a revertable enhancement. Phase 5 builds
the shared world lifecycle and BeatMind pilot. Phase 6 builds the other worlds one reviewed
story at a time.

Rules:

- One phase at a time.
- A gate passes only when its command, render or human-test evidence exists.
- Tick plan items only in the same commit that completes and verifies them.
- Fix every documentation sentence made false by the work.
- Preserve dirty or unrelated user changes.
- Do not add a public runtime dependency without a recorded DECISIONS.md entry and owner
  approval.
- Never invent a number, testimonial, client, user count or deployment status.
- Every public number must have a CONTENT_PROVENANCE.md record with context and snapshot date.
- Do not polish or port design/directions/paper.html. It is evidence and a visual reference.

Begin Phase 0 by reporting the repository state and the exact deletion manifest. Do not
delete until the owner approves it.
```

## Drift checks

Stop the session if:

- a later phase begins before the current gate;
- content components appear while Phase 1 content or provenance is incomplete;
- a visual phase starts without its owner review;
- a world is coded before its storyboard and real-data inventory;
- production is cut over during the Phase 3 preview;
- a gate is described as passing without output.
