# Phase 2 owner review: system and page architecture

Opened 2026-08-28. No production visual implementation begins until the owner reviews the
resulting local demos. The owner asked to work page by page, section by section, rather
than settle every route in one questionnaire.

## Scope

Phase 2 locks the shared paper system, route structures, responsive behavior, typography,
content density, static world framing and accessibility states. It produces review demos and
stub renders, not the production site.

Excluded: tear implementation, backlight implementation, canvas, animated worlds, complete
production pages, deployment and new runtime dependencies.

## Research brief

Designing a portfolio system for clients and engineering employers on the web. The primary
goal is to make Parth's real AI product work understandable and trustworthy, then give each
reader a direct route. The tone is authored, physical, technically precise and human. The
main risk is spectacle overwhelming the work, followed by the opposite risk of turning the
paper idea into a generic editorial page.

Research used the approved `paper.html` prototype, the real paper stock, the locked content,
the local Vignelli, Tufte, Stripe Press, NYT and Active Theory craft references, and the
project's existing accessibility and anti-generic research. Live Refero tools are not
configured, so the bundled research is the reference source for this pass.

## Prototype findings

Keep:

- the real rag-paper stock and visible deckle edge;
- bold sans-serif display type against warm ink;
- the long editorial register;
- oxblood as a rare action and bleed color;
- the moment where a dark project world becomes visible through the sheet.

Improve:

- remove the repeated Start a project action in the first viewport;
- replace every stale proof figure with Phase 1 claim records;
- reduce mobile navigation crowding and protect project names from metadata collisions;
- keep the backlit register readable instead of letting the graphic cover every row equally;
- give the portrait and first-person introduction a more deliberate human beat;
- make the two doors clear without making the page feel like a SaaS landing template.

## Reference synthesis

Primary direction: the owner-approved paper prototype and real stock. Preserve the physical
sheet, sharp grotesque type, long document, dark world contrast and rare oxblood.

Borrow only:

- Vignelli's strict alignment and information hierarchy for navigation and the register;
- Tufte's direct labels and denominator discipline for proof;
- Stripe Press's treatment of a physical object as an object, not its serif typography;
- Active Theory's single high-impact transition rule for the later tear and worlds, not its
  WebGL-first page architecture.

Reject: cream editorial autopilot, decorative serif or italic word swaps, card grids,
rounded SaaS chrome, fake screenshots, generic gradients, and motion on every section.

## Three demo directions

All three use the same Phase 1 content and the same Paper and Worlds metaphor.

### A. The Working Sheet, recommended starting point

The closest evolution of the prototype. A bold human arrival, quiet two-door decision,
large portrait beat, disciplined register, three verified proof figures, ranked services,
latest Errata and a direct close. Paper remains visually strong, but texture is locally
calmed beneath long text. The first project world appears as a controlled static cutaway,
not a wallpaper.

### B. The Technical Register

The project index arrives earlier and carries more metadata. Grid, rules, labels and direct
proof dominate. This is strongest for engineering credibility and weakest for warmth. It
uses no cards, minimal motion and smaller display type. The portrait interrupts the register
later as the deliberate human counterweight.

### C. Paper Over the Void

The most cinematic version. The sheet feels suspended over a dark world, with one large
static BeatMind cutaway behind the arrival and smaller controlled glimpses near flagship
entries. The paper remains the complete page. This direction spends more of the visual
budget on the contrast between material and world, so typography and metadata become quieter.

## Owner input synthesis, 2026-08-28

The answers are exploration inputs, not permanent locks. The owner may revise them after
seeing rendered evidence.

- Build interactive Astro demos rather than screenshot-only mockups.
- Explore all three directions instead of choosing from prose.
- Work page by page. The first checkpoint is the complete landing page only; `/work` and
  every other route wait for a later owner review.
- Keep the landing tactile and human while also testing a more cinematic exposure of the
  void. Do not average those traits into one safe design; let the three demos disagree.
- Use strong display type, real paper irregularity and rare oxblood. Button and control
  treatment remains an explicit exploration area.
- Compare the real portrait with a generated hand-drawn treatment. The drawing is a
  concept asset and is not approved as the production portrait.
- Keep both hero doors important. Their final visual hierarchy and exact hero sentence
  remain open until the landing demos are reviewed.
- Home follows the locked long-sheet flow and includes every project.
- Project previews should eventually respond to the entry nearest the viewport centre,
  but Phase 2 shows only static preview framing. Backlight behavior remains Phase 4.
- Worlds remain scroll-directed stories with complete written explanation. Native scroll
  is never trapped or replaced.
- BeatMind may prompt the visitor to enable sound, but audio starts only from a labelled
  user action and always has a visible stop.
- The paper can move subtly with document scroll on the landing. Inside a world, the paper
  layer is absent rather than continuing to move behind the case study. Returning restores
  the correct document position; implementation of that navigation remains Phase 4.
- Notes uses one chronological hub, every published note receives a page, and Writing
  launches with the approved honest coming-soon state.
- Contact methods should be easy to find. The exact primary method remains open for the
  later Hire-page review.

## Landing demo delivery

After the first owner answers, build:

- `/review/phase-2` as a local comparison index;
- `/review/phase-2/a`, `/b` and `/c` as live Astro demos;
- one complete landing-page exploration in each direction, using the same real content;
- 390px, 800px and 1440px screenshots for each direction;
- keyboard, reduced-motion and no-JavaScript review states.

Run with `npm.cmd run dev` and open `http://127.0.0.1:4321/review/phase-2`.

## Landing exploration checkpoint, 2026-08-28

Implemented for owner review, not approved as the production direction:

- `/review/phase-2/` comparison hub;
- `/review/phase-2/a/` Working Sheet landing demo;
- `/review/phase-2/b/` Technical Register landing demo;
- `/review/phase-2/c/` Paper Over the Void landing demo;
- one shared review component fed by the validated projects, claims, services, notes and
  route copy;
- self-hosted Bricolage Grotesque 700, Archivo 400/600 and DM Mono 400 subsets, with their
  OFL licences retained. The combined WOFF2 payload is 55,916 bytes;
- one generated transparent ink-and-graphite portrait study derived from the real portrait,
  stored as a Phase 2 concept asset. It is not approved as final imagery;
- a reusable lower-section capture command, `npm.cmd run phase2:capture`.

Current rendered findings:

- Direction A integrates the drawing into the paper most naturally.
- Direction B produces the clearest first-viewport information hierarchy and the densest
  engineering register.
- Direction C creates the strongest paper-to-world contrast.
- A and C use compact non-flagship rows; B deliberately keeps every summary visible as the
  technical alternative.

The Astro build, configured accessibility checks and no-JavaScript/reduced-motion content
checks pass for all three directions at 390, 800 and 1440 pixels. That does not complete the
Phase 2 gate: the owner has not selected or combined a landing direction, other route
structures are not built, and rendered contrast has not yet been measured.

## Review sequence

1. Build and inspect the three landing-page demos.
2. Ask only landing-specific questions that rendered evidence exposes.
3. The owner selects one direction or explicitly combines named traits.
4. Record the approved landing structure and shared tokens.
5. Continue route by route, beginning with `/work`, only after the landing checkpoint is
   approved.

## Already locked, not reopened in this review

- Astro static output, content collections, vanilla CSS and one runtime dependency;
- one continuous sheet and real paper stock;
- eight route families, with no separate Blog or Experience route;
- no public pricing and qualitative build-effort sorting;
- Bricolage Grotesque, Archivo and DM Mono as the proposed family roles;
- oxblood reserved for actions, focus-worthy emphasis and paper bleed;
- complete static DOM, native scroll, keyboard and touch parity, reduced-motion final states;
- no production tear, backlight or animated world before its assigned phase.
