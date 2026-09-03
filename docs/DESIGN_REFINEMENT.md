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

## Run 2 — apply the tokens; fix the layout offenders (this commit)

Wired the type/space/measure tokens into every stylesheet (`landing`, `case-study`,
`work-register`, `profile-pages`, `notes`, `hire`, `not-found`, `world-foundation`,
`project-transition`):

- **Headings demoted.** Every page h1 now uses `--display-1` (~44-88px, was 130-176px);
  every section h2 uses `--display-2` (~38-62px, was 92-112px); world chapter headings use
  the same. All display type moved to `--tracking-display` (-0.02em, was -0.055 to -0.075)
  and `--leading-snug` (1.0 for multi-line, was 0.82-0.92).
- **Section rhythm.** `.case-chapter`, `.path/current-work/rules-section`, `.section-pad`,
  the `.hire-*` sections, `.article-*` and the mastheads moved from 104-192px padding to
  `--section-y` / `--section-y-loose` (56-120px). Hero `min-height`s cut ~35%. Case-study
  page height dropped ~9% (17.0k -> 15.6k px at 1440) with a much clearer hierarchy.
- **Orphaned right-column captions removed.** `.project-heading`, `.profile-section-heading`,
  `.archive-heading`, `.hire-section-heading`, `.case-heading-row` are now single-column:
  the label sits above the headline, the gloss becomes a `--text-lg` standfirst under it.
- **Wide-row dead zone reduced.** `/work` and `/notes` register rows keep a `1fr` copy
  column with right-aligned metadata but the list is capped at 76rem and the summary at
  ~60ch, so the mid-row gap shrank from ~600px to ~190px. The `/notes` project column
  widened so long names wrap instead of colliding. Not fully eliminated: a narrower
  site-wide container (which also touches the nav offset calcs) is a follow-up.
- **`/work` hover.** The torn-paper `::before` on `.project-row` / `.work-row` / `.note-row`
  is re-inset to `0 -1px` (full row coverage) with a cleaner seeded polygon and
  `--ease-paper`. The stray `.note-row` hover glyph was removed.
- **Leads off the muted brown.** `.case-thesis`, `.hero-support`, `.about-introduction p`,
  the `.work/notes/hire/article` intros and every `> p` first-of-type in a chapter now use
  `--ink`, not `--ink-secondary`. `--ink-quiet` is metadata/labels/captions only.
- **Labels >= ~12.5px.** Every `--font-mono` label across all stylesheets moved from
  .51-.68rem to `--text-2xs` / `--text-xs` (12-14px), including the world HUD (`.world-nav`,
  `.world-readout`, `.world-audit`, `.world-stem-key`) and the 9.9px chapter labels.
- **Page quick-hits.** Landing `.about-beat` gap 192px -> 32-64px and portrait max-height
  42rem -> 28rem; `.quiet-proof` is now a compact three-number cue (context text hidden),
  `.proof-section` keeps the full dated proof; `/notes` hero collapsed to two lines with no
  right-column collision; `/resume` skill/stack lines get `text-wrap: pretty`; `/hire`
  headline demoted and section spacing tightened; note articles switched from
  `--section-y-loose` to `--section-y` and body leading 1.78 -> 1.55.

Gate: `npm run phase6:vivid-gate` exit 0 (76 PASS, 0 FAIL). `npm run a11y` green at
390/800/1440, zero horizontal overflow. `npm run perf:scroll` landing p95 back to
16.7-16.8ms at all three widths (Run 1's un-masked wide-viewport cost improved because the
shorter sections repaint less); case study 16.7ms at all widths.

## Run 3a — registers span the width; ledger dead-space (this commit)

Owner feedback on the Run 2 build: the `/work` and `/notes` register tables "should span in
the horizontal viewport" and there was still wasted space beside them. The Run 2 mitigation
(`max-width: 76rem` on the list plus a `1fr` copy column and right-aligned metadata columns)
left the list left-aligned inside the 1640px section with a ~400px void on the right *and* a
~190-650px hole between the summary and the metadata. No CSS-only rebalance closes that hole
at 1640px width while the summary stays at a readable measure, so the rows were restructured.

- **Register rows are now `number | copy | kicker | arrow`** on `/work`, `/notes` and the
  landing register. The per-column metadata (status / effort / date on `/work`, the project
  name on `/notes`, status / effort on the landing) collapses into one right-aligned
  `.row-kicker` / `.note-project` / `.project-kicker` line at the top-right of the row. The
  arrow is absolutely positioned at the row's right edge. `.row-copy` is capped at 52-56rem
  so the title and summary keep a readable measure.
- **The `max-width: 76rem` caps are gone.** `.work-register`, `.register-heading`,
  `.notes-register`, `.notes-column-labels` now fill `--content`. Every row rule and the
  header rule span the full width, content is anchored at both edges, and there is no
  mid-row hole — the remaining whitespace reads as the gap between two columns of a wide
  ledger.
- The tabular column headers ("Status / Effort / Started", "Project / Correction /
  Evidence") reduce to a single "Project"/"Correction" + "Open" pair, dropping the stale
  `padding-left` alignment hack.
- The `<=1000px` and `<=760px` register media queries were rewritten for the two/three-column
  grid (they previously placed `.row-status` / `.row-effort` by explicit `grid-column` /
  `grid-row` and hid `.row-started`). On phones the kicker sits above the title.
- **Ledger vertical dead-space.** `.path-ledger`, `.work-lines` and `.rules-ledger` rows
  carried `min-height: 6-7.5rem` that content never reached; cut to 3-3.5rem. The last row
  of each ledger drops its bottom rule so it no longer floats orphaned above the next
  section border. `.path-section` / `.current-work` / `.rules-section` moved from
  `--section-y-loose` to `--section-y`.

Gate: `npm run phase6:vivid-gate` exit 0 (76 PASS, 0 FAIL). `npm run a11y` green at
390/800/1440, zero horizontal overflow. `npm run perf:scroll` landing p95 16.7-16.8ms at all
three widths. `npm run phase2:gate` exit 0. Sheet Fault row-clone transition inspected at
1440px (top panel carries the kicker and arrow, bottom panel the summary, fault line clean).
`craft` still fails the pre-existing "at most one enhancement script" assertion (2 since
Phase 4; not in any gate chain; fails on `main`).

## Run 3b and Run 4 (pending)

Run 3b: world choreography (right-edge clip on right-aligned scene copy, crossfade
hysteresis in `world-lifecycle.ts`, a scrim behind narration over the canvas), the landing
`data-reveal` resting-opacity fix, the Vivid "Enter the Sound Foundry" CTA copy-leak fix,
and — as a separate commit so a `perf:scroll` regression cannot force reverting the layout
work — the paper-texture `content-visibility` pass bundled with removing
`scroll-behavior: smooth`. Deckle-PNG regeneration and the UPI matplotlib chart restyle are
**deferred**: they are asset-generation tasks nobody flagged in review and would consume the
run. Run 4 is the mobile-width repeat of the review (tuning the steep `13-19vw` middle terms
of the heading clamps, the register kicker/title stacking on phones).

Prose left-clustering on article and case pages (heading, labels, evidence and the
`--measure` prose column all left-aligned inside the 1640px container, leaving the right
half open) is **by owner decision** (decision 3, narrow prose only). Recorded here as an
observation to revisit in Run 4, not changed in Run 3.
