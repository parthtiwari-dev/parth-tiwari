# Rebuild brief

Revised 2026-08-27. The direction, product requirements and execution sequence are now
settled in `DESIGN_LOCK.md`, `PRD.md` and `BUILD_PLAN.md`.

This file preserves the diagnosis and the guards that prevent v2 from repeating v1.

## 1. Why v1 is replaced

The Vue/Three.js constellation is well built and hard to understand. People shown the site
could not reliably identify the projects, what Parth does or where to begin. The metaphor
became the information architecture: a visitor had to learn a legend and interact before
receiving content.

The root cause was not insufficient polish. The creative metaphor was chosen first and the
projects were fitted into it.

v1 is therefore replaced rather than patched.

## 2. What remains forbidden

- Constellations, stars, orbital navigation and glass-panel space interfaces
- A creative graphic used as the only route or content surface
- Client-rendered content as the primary page
- A separate mobile experience that loses desktop content
- Invented clients, users, testimonials or benchmark numbers
- Shipping a phase because it “should” pass without running its gate

## 3. The structural guard

**The creative layer must be deletable.**

Phase 3 ships a complete static site without a tear, backlight or animated world. Phase 4
adds the paper signature in one revertable commit. Phases 5 and 6 add a shared world system
and project stories that each revert independently.

The test is literal and runs in a temporary worktree. Reverting an enhancement must leave
complete routes, content, navigation and contact.

## 4. Supporting rules

1. **Content before form.** Phase 1 is plain content and provenance. No design artifact is
   opened.
2. **Static before enhanced.** Every page reads from HTML on disk with JavaScript disabled.
3. **One phase at a time.** The owner sees the opening questions, checkpoints and gate
   evidence before the next phase.
4. **Storyboard before world.** A project story is approved before its generator is coded.
5. **Real data or an honest empty slot.** A fabricated graphic invalidates the site's trust
   argument.
6. **Native scroll remains native.** Scroll may advance a visual story but is never hijacked.
7. **A growing site uses content contracts.** Project and note counts are not hard-coded.
8. **Every decision has a reason.** Current decisions and open phase questions live in
   `DECISIONS.md`.

## 5. The comprehension gate

Five people who have not seen the artifact get ten seconds with it. Then ask:

> What does he do? Would you hire him? For what?

Record answers verbatim. Four of five must satisfy the rubric in `TEN_SECOND_TEST.md`.
An agent cannot simulate this gate.

The gate runs:

- on text alone after Phase 1;
- on the complete static site after Phase 3;
- on the live domain after Phase 7.

Visual and world phases use their own owner-review, accessibility, resilience and
performance gates in addition to this comprehension test.

## 6. The execution sequence

| Phase | Result |
|---|---|
| 0 | Astro static foundation after reviewed v1 deletion |
| 1 | Complete sourced content, no design |
| 2 | Approved design system and page architecture |
| 3 | Complete static preview site |
| 4 | Approved backlight and tear enhancement |
| 5 | Shared world lifecycle and BeatMind pilot |
| 6 | Remaining worlds, one reviewed story at a time |
| 7 | Production cutover |
| 8 | Post-launch publishing/admin workflow |

The full checklists and gates live only in `BUILD_PLAN.md`.

## 7. Current blockers

- The text-only ten-second test has not been run.
- Several numeric claims need their source, scope and snapshot date.
- BeatMind's 17-user count and Vivid's changing count need attached evidence before
  publication.
- The public price band and meaning of cost sorting require Phase 1 owner decisions.

These block claims or later gates. They do not reopen the Paper and Worlds direction.
