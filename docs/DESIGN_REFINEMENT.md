# Design refinement: the nine-point pass

This is the deferred Phase 2 visual-polish pass (`BUILD_PLAN.md` line 352-359, "the
acceptance does not claim that the deferred visual-polish pass is complete") plus the
deferred Phase 3 rendered review plus one Phase 5 world bug. It is permitted work inside
`DESIGN_LOCK.md`, which says the lock "does not prevent improving spacing, hierarchy,
motion, accessibility, storytelling or world choreography" (line 14-15). It does not change
any metaphor, route, claim or world storyboard.

Branch: `refine/design-system-9point` (from `main` at 6965edb). One revertable commit per
run. Gate per run: `npm run phase6:vivid-gate` (runs phase1-5 + Vivid world) + `npm run a11y`
+ `npm run perf:scroll` + rendered 390/800/1440 review, then owner review before the next run.

## Source review

`FULL_SITE_AUDIT_2026-09-01.md` and a fresh end-to-end expert review reached the same
diagnosis: the content is the strongest part of the site; the **typography and spatial
system** hold it back (no mid-scale type register, section rhythm far outside the token
scale, orphaned right-column captions, wide-row dead zones, sub-10px labels), and the
**BeatMind world is intermittently blank** (its ~5s init races a scroll and the 8%-opacity
resting state has no fallback).

## Owner decisions

1. **Colour** — darken `--ink-quiet` only; keep the other drifted values (they passed the
   Phase 2 gate); reconcile `DESIGN_LOCK.md` §8 to the real values plus the new quiet-ink.
2. **World backdrop** — owner undecided; low-risk default taken: keep the single static
   frame this pass, defer per-chapter photographic evolution to Phase 6 storyboards.
3. **Text width** — narrow prose columns only via a new `--measure` container; keep
   `--grid-content` at 1640px for the register / index / masthead layouts.

## Run 1 — foundations (this commit)

**Bug: paper-page black flash.** `html`/`body` and the paper-route wrappers
(`.profile-page`, `.case-review-page`, `.work-review-page`, `.notes-review-page`,
`.note-article-page`) now paint `var(--paper)` instead of `var(--void)`. Any lagging
texture repaint during a scroll now shows cream, never near-black. Added
`scroll-padding-top: 6rem` so in-page anchors clear the sticky nav. The four sub-page sticky
navs and the case mobile-progress bar are now fully opaque `var(--paper)` instead of
`rgb(233 225 210 / 96%)`.

`scroll-behavior: smooth` is **retained** for Run 1. Removing it un-masked a real
paper-texture repaint cost the `perf:scroll` test had been hiding (the test's `scrollTo`
calls were being coalesced by the smooth-scroll engine; the true per-frame paint on the
landing is ~33ms @800px / ~50ms @1440px, not 16.7ms). Its removal is bundled with the Run 3
paper-texture perf work.

**Bug: BeatMind world init wedge.** `world-lifecycle.ts` + `world-foundation.css`:

- Split the ready flag. `[data-world-ready]` (set synchronously) still commits the
  scroll-scrubbing layout. The dramatic per-scene de-emphasis now waits for
  `[data-world-running]`, set only after the engine confirms a real canvas frame. A stalled
  or slow engine therefore degrades to "readable, not animated," never a blank chamber.
- Resting `.world-scene-copy` opacity raised from `.08` to `.6` (legible). Non-current
  scenes drop to `.14` only once `data-world-running` is set. `.is-current` still → `1`.
  The reduced-motion and print blocks force `1` for the new selector too.
- The active scene is primed synchronously at mount from the real scroll position (no
  opening scrub on a deep link) and tracked directly from scroll events, so the chapter
  HUD and highlight stay correct even where `requestAnimationFrame` is throttled to nothing.
- The RAF loop self-heals: a scroll while the stage overlaps the viewport forces
  `visible = true`, and the `IntersectionObserver` gained `rootMargin: 256px` and reads the
  last entry, so a single transient miss can no longer wedge the loop.
- The 60KB real BeatMind export is **not resampled** (committed artifact, no regeneration
  tool). The flag split removes the need — the opacity drop no longer races the parse.
- All changes are in the shared engine + shared CSS, so the Vivid world gets the same
  hardening.

**Token layer** (`paper-system.css` `:root`, additive — wired into components in Run 2):

- `--text-2xs … --text-2xl` fluid steps for the missing 13-34px middle register.
- `--display-1/2/3`, capped well below today (page h1 ≈ 44-88px, section h2 ≈ 38-62px).
- `--leading-tight/snug/mid/body/relaxed`, `--tracking-display -0.02em` /
  `--tracking-tight` / `--tracking-label`.
- `--measure 64ch` / `--measure-narrow 52ch` / `--measure-wide 74ch`.
- `--space-20/24/32`, `--section-y` (56-96px) and `--section-y-loose` (80-120px).

**Colour.** `--ink-quiet` `#685e52` → `#4a4038`. Measured contrast on the real stock rose
from 4.88:1 to **7.77:1** (`phase2:gate`). `DESIGN_LOCK.md` §8 reconciled to the in-use
values.

## Incidental fixes and known stale checks

- **Fixed:** `scripts/phase3-static-site-gate.mjs` hard-coded `publishedWorlds = new
  Set(['beatmind'])` and never gained `'vivid'` when the Vivid world shipped, so
  `phase3:static-gate` (and the whole `phase6:vivid-gate` chain) failed on `main` before
  this branch. It now derives the set from `src/content/worlds/*.json` `published` flags.
- **Left for the owner:** `scripts/craft-check.mjs` asserts "Phase 2 landing has at most one
  enhancement script"; the landing has had two (`landing-motion`, `project-transition`)
  since Phase 4 shipped the transition. `craft` is not in any phase-gate chain. Fails on
  `main` too.

## Run 1 gate evidence

- `npm run phase6:vivid-gate` — exit 0. All of phase1 (schemas/content/build), phase2
  (routes/states/contrast/font-budget; `--ink-quiet/--paper 7.77:1`), phase3 (10 case
  studies, 2 deferred, 31 pages no broken links, sitemap/RSS/404, home doors incl.
  `/work/vivid/world/`), phase4 (Sheet Fault at 390/800/1440, p95 16.7-16.8ms, Back
  restoration, reduced-motion, forced-failure, no-JS), phase5 (BeatMind world: animated
  render 8/8 scene tracking, no-JS, reduced-motion, canvas-failure, lifecycle, resize,
  route/Back, print, data-contract 6 signals/256 bins, transfer 2637 gzip), phase6 (Vivid
  world: same battery).
- `npm run a11y` — pass at 390/800/1440 (lang, one main, one h1, no heading skip, alt text,
  named controls, no horizontal overflow).
- `npm run perf:scroll` — landing p95 16.7 @390 / ~33 @800 / ~33 @1440 (unchanged from
  baseline — the wide-viewport cost is pre-existing, addressed in Run 3); case study
  `/work/beatmind/` p95 16.7 at all three widths.
- Manual: jump-scroll to page bottom on `/about` shows cream, not black. BeatMind world
  under a fully RAF-throttled context shows readable `.6`-opacity narration with the primed
  chapter highlighted, never a blank page.

## Run 2 and Run 3

See `~/.claude/plans/attach-federated-book.md`. Run 2 wires the type/space/measure tokens
into every component, demotes the billboard headings, kills the orphaned captions and
wide-row dead zones, fixes the `/work` hover, moves leads off the muted brown and lifts
every label to ~12.5px+. Run 3 does world choreography (labels, edge clip, crossfade,
text-over-canvas), the deckle regeneration, the paper-texture scroll-perf fix bundled with
removing `scroll-behavior: smooth`, the UPI matplotlib chart restyle, the Vivid CTA
copy-leak fix and the landing `data-reveal` resting-opacity fix. Run 4 is the mobile-width
repeat of the review.
