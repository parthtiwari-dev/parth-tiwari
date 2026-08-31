# Case-study contract

Locked 2026-08-30. This document defines the content contract for every
`/work/[slug]/` paper case study. It does not define a project's animated world.

## Purpose

A world demonstrates what a project does through native scroll and project-specific
graphics. The paper case study explains what the project is, why it exists, how it was
built, what the evidence supports, and where the work failed. Neither experience replaces
the other.

The paper page must be complete static HTML. Removing JavaScript, video playback, canvas,
and every animated asset may reduce atmosphere, but it may not remove the argument.

## Required reading order

Every published case study must contain these beats in this order. Adjacent beats may share
one visual section when that improves the story, but none may silently disappear.

1. **Masthead.** Project title, one human thesis, status, date where sourced, role,
   organization and exact contribution. Lead with real product evidence or a labelled,
   accessible source record when no publication-cleared product image exists. Include only
   verified public links.
2. **What it is.** The product, intended user and complete workflow in plain language.
3. **Product proof.** Use one of three typed proof forms: a real muted recording with poster,
   duration and caption; a real interface or evaluation image with intrinsic dimensions and
   useful alternative text; or an accessible DOM record of a real workflow, evaluation or
   source trace. Label records as evidence, never simulated product UI. State what each proof
   establishes. Playback and JavaScript may disappear without removing the explanation.
4. **Problem and responsibility.** The problem, constraints, working context and what Parth
   personally owned. Do not imply sole authorship, employment or a client relationship
   without owner approval and evidence.
5. **Research that changed the build.** Name the paper, product, library, experiment or
   feedback source; record the finding; record the decision it changed. A reference list
   without a changed decision does not satisfy this beat.
6. **How it was built.** Explain the architecture and data flow through two to four
   consequential system boundaries. Prefer one legible diagram to a gallery of technology
   logos.
7. **Decisions and rejected alternatives.** For every selected decision, name the rejected
   approach and the remaining trade-off. Do not write choices as inevitable victories.
8. **Evidence and outcomes.** Publish only claim records whose status is `verified` and
   `publish: true`. Keep the denominator, context and verification date attached. State
   an honest absence when there is no defensible outcome measurement.
9. **What failed and changed.** Use the sequence symptom, cause, correction and remaining
   risk. At least one failure may link to its crawlable `/notes/[slug]/` erratum.
10. **Current limitations and deliberate boundaries.** Keep technical limitations separate
    from things the product intentionally refuses to do.
11. **Future plans.** Label each item `planned`, `investigating` or `blocked`. Do not
    publish an unsupported deadline.
12. **Stack, sources and close.** Group the stack by responsibility, distinguish public
    evidence from internally audited material, then offer the live product, register,
    related erratum, next project and contact route.

## Typed content

Paper case studies use the optional `caseStudy` object in `src/content/schemas.mjs`. It
contains:

- a required review date, classification, thesis, credit, exact contribution, cover proof
  and intended user;
- a typed video, image or evidence-record lead proof and three workflow proofs that may each
  be a real image or evidence record;
- project-specific headings, responsibilities and architecture steps;
- research findings and the decisions each changed;
- selected decisions, rejected alternatives and trade-offs;
- structured failures;
- current limitations, an evidence note and status-labelled future work;
- public and internally audited sources, related-note wording and the closing handoff.

BeatMind and Vivid are the reference records. `src/pages/work/[slug].astro` generates a
static page for every validated project that contains this object, so new case studies do not
need a hard-coded route or component fork. The object stays optional while project audits are
incomplete. A missing object means the register renders a non-clickable **Case study in
development** state, and related Notes links return to `/work/` rather than opening a missing
route. Missing data is a blocker, not a reason to invent placeholder prose.

## Visual and interaction rules

- The case-study surface is the portfolio's rag paper. A project may use its own accent
  inside real product media, diagrams and small evidence annotations.
- A dark project world is not the paper masthead. The world ends with a deliberate
  deep-dive action; the paper page begins as a readable document.
- Product screenshots and recordings may retain their native light or dark interface.
  They are evidence, not page chrome.
- Use ruled rows, captions, ledgers and diagrams before generic rounded cards.
- Oxblood is reserved for actions, measurements, corrections, focus and meaningful status.
- Desktop may use a sticky chapter rail. Phone keeps the complete sequence in one column and
  may use only a compact reading-progress strip that does not cover the text.
- Native scroll is never trapped. Video is user-controlled and audio never autoplays.
- All images have dimensions and useful alternatives. Reduced motion and no JavaScript
  preserve the complete reading order.

## Publication gate

A case study is reviewable only when:

- its typed content validates;
- every displayed number resolves to a publishable claim record;
- contribution and organization wording is owner-approved;
- every product image or recording is real and has publication permission;
- every evidence record names its source boundary and remains readable without CSS or
  JavaScript;
- private repository paths, secrets, user data, audio filenames and internal identifiers
  are absent from public copy;
- the static build passes;
- rendered 390px, 800px and 1440px views have no overflow, clipped text or missing media
  alternatives;
- no-JavaScript retains every required beat;
- the owner has inspected the rendered page.

Passing this contract does not authorize the project's animated world. `WORLDS.md` and the
Phase 5 storyboard gate control that work separately.
