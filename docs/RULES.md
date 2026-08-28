# Working rules

This is the durable operating contract for every session on the Paper and Worlds portfolio.
It applies to planning, research, content, design, code, verification, documentation, commits,
and deployment.

## 1. Inspect before acting

Before changing anything:

1. Read `DESIGN_LOCK.md`, `WORLDS.md`, `BUILD_PLAN.md`, `CONTENT_PROVENANCE.md`,
   `DECISIONS.md`, and `../CLAUDE.md` in the order required by the active session.
2. Read the current phase, its owner-review questions, and its gate in full.
3. Inspect the worktree, current diff, branch, relevant source, and existing evidence.
4. Preserve unrelated or uncommitted user work. If the approved scope overlaps it, stop and
   ask before continuing.

Do not treat an earlier session summary as proof of current repository or external state.

## 2. Ask, do not silently assume

Ask the owner when a missing answer could materially change any of these:

- public copy, positioning, audience, route purpose, or call to action;
- a number, user count, price, date, testimonial, client, outcome, benchmark, or claim;
- project ownership, deployment ownership, link safety, publication permission, or privacy;
- visual direction, interaction behavior, breakpoint behavior, or world storyboard;
- scope, phase ordering, deletion boundary, runtime dependency, data model, or architecture;
- a destructive action, deployment, purchase, message, domain change, or external write.

First try to answer read-only questions from the repository or an authoritative source. Ask
one concrete question when the answer cannot be discovered safely. Do not ask the owner to
repeat a choice already settled in a live document unless new evidence creates a real conflict.

If work can continue safely without the missing answer, mark the item unverified or deferred
and keep it out of public output. Never fill a gap with plausible-sounding content.

## 3. One phase at a time

- Follow `BUILD_PLAN.md` in order.
- Open each phase by showing its scope, exclusions, expected files, and unresolved questions.
- Obtain the owner decision required by that phase before implementation.
- Build only the named checkpoints.
- Prove the gate by running it and inspecting required rendered output.
- Show the evidence and stop. The next phase begins only after explicit owner approval.

A later-phase improvement is not a reason to cross the current boundary. Record it in the
appropriate live document and leave it for its phase.

## 4. Claims and evidence

- Never invent a number, testimonial, client, user count, price, outcome, benchmark, link,
  deployment, or ownership claim.
- Every public claim needs the context, source, verification date, and changing-data snapshot
  required by `CONTENT_PROVENANCE.md`.
- “It built,” “the request returned 200,” and “the screenshot command completed” are narrow
  facts. None proves visual quality, authenticated behavior, production deployment, or claim
  accuracy without the corresponding evidence.
- Show before telling. A verified live artifact outranks a screenshot, and a screenshot
  outranks unsupported prose.
- If a claim cannot be verified, say so plainly and do not publish it.

## 5. Design and accessibility

- `DESIGN_LOCK.md` controls the shared visual system. `WORLDS.md` controls each case-study
  world's narrative material. A storyboard still needs owner approval before implementation.
- The static DOM contains the complete readable and crawlable case study.
- Enhancement may add emotion or explanation but cannot gate meaning, navigation, contact,
  or proof.
- Hover behavior has keyboard and touch parity.
- Reduced motion gets an intentionally composed final state, not a shortened animation.
- Review real output at 390, 800, and 1440 pixels.
- Inspect screenshots. Numeric gates cannot see poor composition, clipped copy, or an ugly
  first frame.

## 6. Dependencies and architecture

- The public site targets one direct production dependency: `astro`.
- Any proposed public runtime dependency requires a written, owner-approved entry in
  `DECISIONS.md` before installation.
- Prefer platform APIs, Astro build-time features, and small local modules.
- Do not introduce a CMS runtime into the public site by default. Publishing architecture is
  a later measured decision.
- Keep enhancements isolated so static routes remain useful when JavaScript or canvas fails.

## 7. Deletion and external actions

- Resolve destructive globs to exact paths and show them before deletion.
- Delete only an owner-approved boundary.
- Use recoverable, revertable commits and verify the target path before removing files.
- Ask before deployment, production data changes, domain changes, paid calls, messages, or
  account changes unless the owner explicitly authorized that exact action.
- Never report a deployment, publication, message, or external change as complete without
  current evidence from that system.

## 8. Documentation is part of the work

At the end of every material session or completed phase:

1. Inspect every file under `docs/` for whether it is live, historical, or newly contradicted.
2. Update every live document affected by the work, including commands, paths, versions,
   routes, counts, decisions, checklists, gates, and status.
3. Keep historical documents only when they have a visible superseded banner and are listed
   as historical in `docs/README.md`.
4. Update `docs/README.md` with the current phase and truth-audit date.
5. Update `BUILD_PLAN.md` checkboxes in the same commit as the work that satisfies them.
6. Update `DECISIONS.md` when a settled technical or product choice changes.
7. Update `CONTENT_PROVENANCE.md` when a public claim is added, changed, verified, rejected,
   or becomes stale.
8. Update `SESSION_PROMPT.md` when the next safe starting point changes.
9. Update the root `README.md` and `CLAUDE.md` whenever commands, stack, workflow, or project
   state changes.
10. Record any remaining uncertainty explicitly. Do not make a document look complete by
    deleting an unresolved question.

Historical documents do not need their old reasoning rewritten after every change. Their
superseded status must remain unmistakable and their description in `docs/README.md` must stay
true.

## 9. Commit and handoff

- Work directly on the owner-selected local branch. For this rebuild, that branch is
  `redesign/v2`. Create another feature or experiment branch only when the owner asks for it
  or approves a specific isolation need.
- Use lowercase, imperative, type-prefixed commit messages.
- Keep phase commits independently revertable.
- Before committing, inspect the complete diff for scope leakage and unintended deletion.
- Run the current phase gate after the final documentation edits.
- The handoff separates verified facts, rendered observations, unverified items, and deferred
  work.
- Never start the next phase merely because time remains in the session.
