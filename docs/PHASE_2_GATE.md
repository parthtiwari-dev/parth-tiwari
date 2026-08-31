# Phase 2 gate evidence

Phase 2 closed on 2026-08-31. The owner accepted the current route designs as the review
baseline and explicitly deferred another visual-polish pass. This is acceptance for the
design-system and page-architecture gate, not a claim that every page is visually final.

## What was proved

The gate ran against the local Astro server at `http://127.0.0.1:4323` after a fresh
`npm.cmd run phase1:gate` build.

The rendered matrix covered `/`, `/work/`, `/work/beatmind/`, `/notes/`, one representative
`/notes/[slug]/`, `/about/`, `/resume/` and `/hire/` at 390, 800 and 1440 pixels. All 24
combinations returned HTTP 200 with exactly one `h1` and one `main`, no horizontal overflow,
missing image alternative text, unnamed controls, heading-level skips, browser errors or
canvas. Representative phone, tablet and desktop screenshots were inspected after capture;
no clipped or unreadable first-viewport content was found. The evidence is in
`.shots/phase2-gate-final`.

The state pass verified every route with JavaScript disabled, the reduced-motion final
state, the paper mobile menu inside the viewport and the shared 3px oxblood keyboard focus
ring. The landing page reports one running reduced-motion animation object whose effective
duration is at most 1ms; no meaningful animation remains.

The shared contract pass verified:

- paper contrast: ink 14.09:1, secondary ink 6.81:1, quiet ink 4.88:1 and oxblood 6.40:1;
- world contrast: primary world ink 18.06:1 and secondary world ink 7.70:1;
- the honest Writing `Coming soon` copy with no empty post cards;
- 55,916 bytes across the four self-hosted WOFF2 files;
- `astro` as the only direct runtime dependency;
- no canvas in the maintained Home, Work or case-study sources;
- named paper, ink, type, spacing, grid, focus, motion and world token roles.

The quiet-ink token changed from `#706659` to `#685e52` because the former measured only
4.33:1 on the base paper color. The corrected token measures 4.88:1 while preserving its
quiet role.

## Commands and results

```text
npm.cmd run phase1:gate
PASS schemas, content provenance and 19-page Astro build

npm.cmd run phase2:gate -- --part render --url http://127.0.0.1:4323 --tag phase2-gate-final
PHASE 2 RENDER GATE PASSED

npm.cmd run phase2:gate -- --part states --url http://127.0.0.1:4323 --tag phase2-gate-final
PHASE 2 STATES GATE PASSED

npm.cmd run phase2:gate -- --part contracts --url http://127.0.0.1:4323 --tag phase2-gate-final
PHASE 2 CONTRACTS GATE PASSED
```

The gate is split into three bounded commands because a single full Playwright run exceeded
the local command-session window. The first oversized full-page screenshot attempt and the
first unsplit run were not counted as evidence because neither produced a final result.

## Boundary after the gate

Phase 2 contains review implementations and a locked shared system. It does not contain the
production tear, project backlight, canvas worlds or the complete Phase 3 static-site gate.
Future polish may change the accepted baseline, but it must refresh the relevant rendered
evidence rather than rewriting this result retroactively.
