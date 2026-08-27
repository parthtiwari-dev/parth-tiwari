# The prompt for the build session

Paste the block below into a new chat. It is short on purpose: the repo carries the
context, so the prompt only has to point at it and set the rules.

**Before you paste it**, know that Phase 1 has an owner gate you cannot delegate: the
ten-second test, five people, on the text alone. It has never been run and it blocks
Phase 3. Everything else the session can do.

---

```
Read these four, in order, before doing anything:

  docs/DESIGN_LOCK.md   the design, locked
  docs/WORLDS.md        what is behind each tear, all twelve specified
  docs/BUILD_PLAN.md    the stack, what gets deleted, and the phases
  CLAUDE.md             the working rules

I am rebuilding my portfolio. The design is settled and is called Paper and
Worlds: the landing is one long scrolling sheet of real rag paper, every
project is an entry on it, and tearing an entry opens that project's own
world. A world is a full case study drawn in that project's own visual
language, generated from its real data.

design/directions/paper.html is a working prototype of the landing. It proves
the direction and it has real bugs, listed in WORLDS.md section 5. Treat it as
a reference. Do not port it line by line.

We are rewriting the codebase from scratch. v1 is a Vue SPA with a Three.js
constellation and it is being deleted, not patched. The new stack is Astro,
static output, content collections, vanilla CSS, target one runtime
dependency. The argument is in BUILD_PLAN.md section 1 and it is settled.

Work the phases in BUILD_PLAN.md in order. Start at Phase 0 and stop at its
gate. Do not start a phase until the previous gate actually passes, and prove
the gate by running it rather than by reasoning about it.

Rules for this session:

- One phase at a time. Show me the gate result before moving on.
- Phase 1 is content only. No design file is opened. This has been skipped
  twice and it is what cost the last two sessions.
- Phase 3 ships a complete, readable, crawlable site with no canvas and no
  tear. That ordering is what makes Phases 4 and 5 safe.
- Anything you cannot verify, say so. Do not report a gate as passing because
  it should pass.
- Tick items off the plan in the same commit that does the work, and fix any
  sentence in docs/ that your change makes untrue.
- If you want to add a runtime dependency, argue it in DECISIONS.md first.
- Never invent a number, a testimonial, a client or a user count. Every claim
  on this site has to be checkable.

Start with Phase 0. Tell me what you are deleting before you delete it.
```

---

## After Phase 0

The session will have rewritten `CLAUDE.md` for the new stack. From then on it carries
the rules and this prompt is only needed to restart a cold session.

## If the session drifts

Two failure modes have already happened twice each in this project, so watch for both:

**It starts building before the content exists.** The tell is components appearing
while `src/content/` is empty. `REBUILD_BRIEF.md` §6 and `SESSION_HANDOFF.md` §2 both
name this. Stop it and send it back to Phase 1.

**It reports a gate passing without running it.** The tell is "this should now work" or
"the build succeeds" without output. Every gate in `BUILD_PLAN.md` is a command with a
result. Ask for the result.
