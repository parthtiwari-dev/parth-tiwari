# Phase 4 gate: paper signature, backlight and Sheet Fault

Status: **passed and owner-closed**.

Date: 2026-09-01

## Selected behavior

The owner selected Sheet Fault from the three rendered studies. Production preserves its
full-sheet opening without shipping the study's full-root browser snapshot. Two textured
paper panels separate around an inert clone of the selected real row while the approved
world still or labelled published proof appears behind them.

## Command

```bash
npm run phase4:gate
```

The command first reruns the complete Phase 3 static gate, then exercises Home and `/work`
at 390, 800 and 1440 pixels.

## Render and performance matrix

| Viewport | Home p95 | `/work` p95 | Overflow | Browser errors |
|---|---:|---:|---:|---:|
| 390 | 16.8 ms | 16.8 ms | 0 px | 0 |
| 800 | 16.8 ms | 16.8 ms | 0 px | 0 |
| 1440 | 16.8 ms | 16.7 ms | 0 px | 0 |

Screenshots for focus, preview, mid-fault and final-fault states are in
`.shots/phase4-production/`. The selected panel motion lasts 440 milliseconds and uses
transform only. The enhancement adds 5,184 bytes of JavaScript and 5,950 bytes of CSS before
compression and adds no runtime dependency.

## Interaction and resilience

All six route and viewport combinations pass:

- immediate keyboard-focus preview;
- 180-millisecond pointer dwell;
- centred-row touch preview with native scrolling;
- real navigation to `/work/beatmind/`;
- destination focus on `#case-title`;
- Back restoration to the originating project row;
- direct reduced-motion navigation with no transition call;
- direct navigation after a forced clone failure;
- complete no-JavaScript anchor navigation;
- inert, `aria-hidden` decorative previews and row clones.

## Independent revert

Commit `9d195b0` was reverted with `--no-commit` in an isolated temporary worktree. The full
`npm run phase3:static-gate` then passed: 29 pages built, ten published case studies remained
complete, two deferred projects remained route-less and all internal links and metadata
checks passed. The temporary checkout and its local dependency junction were removed after
the check. The Phase 3 site therefore remains a proven rollback target.

## Owner close

On 2026-09-01 the owner explicitly directed Phase 4 to close and approved promotion without
performing a personal render inspection. That is recorded as an owner waiver of the remaining
visual-review step, not as evidence that the inspection occurred. The automated responsive,
interaction, resilience, performance and independent-revert gates above did run and pass.

Phase 4 is closed. Phase 3's separately deferred review and deployment work remains open.
