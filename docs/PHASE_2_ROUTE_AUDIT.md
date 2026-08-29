# Phase 2 route-flow audit: Home to Work

Audited 2026-08-29 from fresh local browser captures at 1440 and 390 pixels. Evidence is
stored in `.shots/phase2-route-audit`. This audit covers the current Home to Work journey;
it is not a full-site accessibility claim.

## User goal and accessibility target

A client or employer should understand the arrival, choose the Work door, reach the complete
register, scan or filter the projects and retain a clear route onward. The static experience
must remain readable with keyboard, touch, reduced motion and no JavaScript.

## Steps

1. **Home arrival — healthy.** `01-home-arrival.png` shows one dominant statement, two clear
   doors and the real BeatMind study. The Work door previously jumped down the same page;
   it now navigates to `/work/` and was verified through the browser.
2. **Home post-hero reading — healthy with a route boundary.** `02-home-navigation.png`
   confirms the paper continues through proof and the personal introduction. Home keeps the
   lighter twelve-project editorial index required by the build plan; `/work` owns the
   denser evidence, dates and controls.
3. **Work opening — healthy.** `03-work-desktop.png` gives the register its own purpose,
   keeps controls in the first desktop viewport and states the default order.
4. **Desktop register — corrected, awaiting owner review.** `04-work-desktop-preview.png`
   records the rejected dark overlay. `10-work-desktop-refined.png` replaces it with a faint
   under-row BeatMind aperture and raises the register's summary, evidence and metadata type
   sizes.
5. **Mobile register — healthy.** `05-work-mobile.png` and `07-work-mobile-refined.png` show
   native scrolling, readable rows and the same localised preview principle without hiding
   the project name or summary.
6. **Mobile navigation — corrected, awaiting owner review.** `06-work-mobile-menu.png`
   records the generic boxed menu. `09-work-mobile-menu-final.png` uses a shared paper-stock
   surface, oxblood state and torn lower edge while retaining native `details` and `summary`
   keyboard behaviour.

## Strengths

- Home and Work have distinct jobs without contradicting each other.
- The complete register remains server-rendered and readable without JavaScript.
- Sorting and `Active now` are separated conceptually and visually.
- Real collection data supplies every row; no project, claim or date was invented.
- The same paper, type, focus and action roles now cover both routes.

## Risks and open decisions

- `/notes`, `/about`, `/resume` and `/hire` remain future route contracts. A single
  `/work/beatmind/` Phase 2 pilot now proves the shared case-study structure, but the other
  eleven case-study URLs are still intentionally unbuilt. The review routes therefore do
  not yet form a complete live journey.
- The owner rejected a Personal/Company register split on 2026-08-29. Verified employment
  context may appear inside an individual case study after its exact public wording and
  contribution are approved; it is not a register filter or row badge.
- The new desktop aperture and paper menu need owner visual approval.
- Actual foreground/background contrast on the paper and world surfaces remains a Phase 2
  gate check; screenshots alone cannot prove it.

## Accessibility evidence and limits

Automated checks cover landmarks, heading order, alternative text, named controls,
horizontal overflow and browser errors at 390, 800 and 1440 pixels. Native links, buttons,
checkboxes, `details` and `summary` preserve keyboard semantics. The register has sticky-nav
scroll clearance. Manual screen-reader output, zoom above 200%, forced colors and actual
contrast measurements remain outstanding and must not be reported as passing yet.

## Recommendation

Keep the compact all-project index on Home and the complete sortable register on `/work`.
Do not duplicate the full Work layout on Home or add an ownership filter. Continue with the
shared case-study structure review.
