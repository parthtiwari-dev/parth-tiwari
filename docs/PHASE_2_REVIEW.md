# Phase 2 owner review: system and page architecture

Opened 2026-08-28. No production visual implementation begins until the owner answers the
first decision batch and reviews the resulting local demos.

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

## Demo delivery

After the first owner answers, build:

- `/review/phase-2` as a local comparison index;
- `/review/phase-2/a`, `/b` and `/c` as live Astro demos;
- representative frames for Home, Work, one case study, Notes and Hire;
- structural wireframes for About and Resume;
- 390px, 800px and 1440px screenshots for each direction;
- keyboard, reduced-motion and no-JavaScript review states.

Run with `npm.cmd run dev` and open `http://127.0.0.1:4321/review/phase-2`.

## Owner decision batch

The chat presents these as short A/B/C choices. Record the answers here before demo code.

1. Demo medium and comparison format.
2. Which representative routes deserve high-fidelity demos.
3. Hero voice and supporting line.
4. Relative visual weight of the two doors.
5. Whether the featured world appears in the first viewport.
6. How much of the black void remains visible around the paper.
7. Paper texture and edge intensity.
8. Desktop and mobile navigation behavior.
9. Portrait prominence and crop.
10. Home register hierarchy.
11. Number and kind of proof claims on Home.
12. Services presentation.
13. Errata presentation.
14. Contact hierarchy and channels.
15. Work register controls and visible metadata.
16. Case-study visual and text arrangement.
17. Notes information architecture.
18. About, Resume and Hire density.
19. Source and provenance presentation.
20. Motion restraint on the paper layer.
21. Review cadence and what becomes locked after each checkpoint.

## Already locked, not reopened in this review

- Astro static output, content collections, vanilla CSS and one runtime dependency;
- one continuous sheet and real paper stock;
- eight route families, with no separate Blog or Experience route;
- no public pricing and qualitative build-effort sorting;
- Bricolage Grotesque, Archivo and DM Mono as the proposed family roles;
- oxblood reserved for actions, focus-worthy emphasis and paper bleed;
- complete static DOM, native scroll, keyboard and touch parity, reduced-motion final states;
- no production tear, backlight or animated world before its assigned phase.
