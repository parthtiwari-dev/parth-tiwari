# Phase 2 About review

Recorded 2026-08-30. This is the route-structure and craft review for `/about/`. It does
not complete Phase 2 or promote the complete site into Phase 3.

## Owner inputs

- Education and work receive equal narrative weight.
- The voice is casual and first person.
- The recommended ATS-first treatment remains reserved for `/resume/`.
- About contains the person, path and working rules. It does not become a second resume.

## Reference lock

The existing Paper and Worlds sheet, typography and route navigation remain the primary
source. Two outside references have deliberately narrow roles:

- [Josh Comeau's About page](https://www.joshwcomeau.com/about-josh/) contributes only a
  candid first-person opening and a chronological path through work;
- [Maggie Appleton's site](https://maggieappleton.com/) contributes only the clear naming
  of different kinds of authored work without flattening them into one corporate bio.

Neither visual language is copied. The page rejects testimonial blocks, skill clouds,
generic values cards and an ornamental timeline.

## Route structure

1. A candid portrait and `Hi, I am Parth.` introduction.
2. One chronological ledger combining two education records and the current role.
3. The current Stick and Dot work as three plain source-backed lines.
4. Five operating rules expressed as checks used during the work.
5. Direct paths to Work and Resume.

The portrait uses the audited local photograph and its existing descriptive alternative.
Education and experience are validated Astro content collections. Their private PDF source
locator is never emitted into public HTML.

## Rendered evidence

`npm run phase2:about-capture -- --url http://127.0.0.1:4323 --tag phase2-about-review-1`
passed against the built static output at 390, 800 and 1440 pixels:

- one `h1` and one sourced portrait with intrinsic dimensions and alternative text;
- three chronological path records, three current-work lines and five operating rules;
- zero horizontal overflow, unnamed controls, missing image alternatives or browser errors;
- zero client scripts;
- the same complete route with JavaScript disabled.

Screenshots are in `.shots/phase2-about-review-1`. The hero, path and operating rules were
visually inspected at all three widths. On phone the portrait follows the introduction;
tablet and desktop retain the deliberate asymmetric paper composition.

## Publication boundary

The route contains no endorsement, testimonial, user count or new numeric outcome. The
timeline uses the owner-supplied Resume B artifact as its private source. Owner visual
approval remains before the combined Phase 2 route-hierarchy checklist can close.
