# World integration

2026-09-23. Phase 6. Local branch `world/integration`, cut from `main` at `f1d479e`.
Not merged, not pushed, not deployed.

## Owner decisions

- The owner reviewed every world in the browser: the five local studies through
  `scripts/world-study-server.mjs`, and BeatMind, Vivid and Tathya on the live site.
- Approved: MedRAG, SecondSelf, QueryPilot, Order Supervisor, UPI Fraud Engine (and
  BeatMind, already approved). Vivid and Tathya: "just not vivid and tathya so maybe
  something we pick on later". Both keep their current routes and are flagged to revisit.
- Integrate the approved studies into the real site now, "line by line pixel by pixel
  accurately". This supersedes the 2026-09-09 instruction to finish every world design first.
  Enhancements were invited but optional ("otherwise they are fine currently as well"). This
  pass ships faithful ports; improvements are proposed separately below.
- The two leftover worktrees were removed only after their branches were proven merged and
  their unique rejected drafts archived (`.shots/world-batch-1/rejected-first-drafts-2026-09-07.tar.gz`).

## What shipped

| World | Route | Commit | Parity with the approved study | Route JS, gzip, incl. shared chunks | Images |
|---|---|---|---|---|---|
| Shared foundation (+ `10aabd4` fix) | none | `4fe17da` | n/a | n/a | n/a |
| MedRAG / The Theatre of an Answer | `/work/medrag/world/` | `3fa071a` | 0 of 24 frames differ | 2,947 B | 268 KB |
| SecondSelf / A Little Further, Together | `/work/secondself/world/` | `ae78baa` | 0 of 24 frames differ | 3,572 B | 821 KB |
| QueryPilot / The Cartographer’s Fold | `/work/querypilot/world/` | `3a03526` | 26 of 27 identical; 1 differs 0.075% (em-dash fix) | 4,087 B | 209 KB |
| Order Supervisor / Inside the Night Watch | `/work/order-supervisor/world/` | `fc1b9c2` | 0 of 24 frames differ | 3,074 B | none |
| UPI Fraud Engine / The Narrow Harbour | `/work/upi-fraud-engine/world/` | `cf9487b` | 23 of 24 identical; 1 differs 3.6% (em-dash fix re-centres one paragraph at 800 px) | 3,141 B | none |

Home and `/work` now open each of these projects through its world, with a composed
1440x900 still in the paper backlight; each world's final chapter hands off to the unchanged
paper case study. The five routes add five sitemap entries.

## Architecture

- **Dedicated routes.** Each illustrated world owns `src/pages/work/<slug>/[world].astro`,
  a one-path route that emits only while its record is published. A page receives the CSS
  of every component it imports, and the approved studies style `header`, `section` and `h1`
  globally, so no two worlds may share a page. The shared `/work/[slug]/world/` route keeps
  BeatMind, Vivid and Tathya (`sharedRouteWorldSlugs`). Built output confirms each world page
  loads exactly one stylesheet and no other page references it.
- **One DOM lifecycle.** `src/worlds/shared/lifecycle.ts` ports the two study engines:
  `mountScrollScenes` (continuous, chapter plus local progress from section offsets) and
  `mountEventScenes` (Order Supervisor: scroll selects a chapter, one 2.8 s eased event, then
  rest). Both add the site contract: 30fps ceiling, hidden-tab pause, `pagehide` and
  `world:destroy` teardown, reduced-motion composition, focus on `#world-title` after the
  Sheet Fault transition, and `data-world-*` instrumentation. Chapter offsets are cached and
  refreshed by a `ResizeObserver`, so frames never force a synchronous layout (the study read
  every offset every frame; the first load's layout measured 45-99 ms and is now reported
  separately as `layoutMeasure`).
- **Content and data.** Scene copy lives in `src/content/worlds/<slug>.json` (optional
  `lead` and `note`; `\n` breaks a line and a whole `*line*` is emphasis). Facts live in
  `src/data/worlds/<slug>-world-v1.json`, validated by `src/worlds/<slug>/schema.mjs`. Large
  study drawings are extracted verbatim (`atlas.svg`, `watch.svg`, `harbour.svg`) and injected
  unchanged.
- **Claims at build time.** Each page requires its verified claim records and refuses to
  build if the data, the copy or the drawing counts disagree: MedRAG (`medrag-refusals`,
  `medrag-query-outcomes`, scenery count, citation marks), SecondSelf (`secondself-ragas`,
  including the prose date), QueryPilot (`querypilot-correction`, `querypilot-hard-001`,
  70 atlas tiles), UPI (`upi-heldout`, `upi-replay`, `upi-replay-counts`, 85 and 616 drawn
  points; the schema also requires the seven daily rows to sum to every total), Order
  Supervisor (terminal-event copy against the source record).
- **Preview stills.** `staticFrame.preview: true` opts a world's still into the paper
  backlight. `npm run worlds:stills` captures it from the real production page.

## Evidence

Commands were run under Node 24.16.0 (see Environment).

- **Baseline before any change:** `npm run phase6:tathya-gate` on `main` at `f1d479e`:
  84 PASS, 0 FAIL, exit 0. Sheet Fault measured 16.7 ms p95 at all widths, so the
  2026-09-08 timing failure did not reproduce.
- **Source re-verification (read-only):** MedRAG queries 1 and 7 and 4 of 20 refusals at
  `a741897`; QueryPilot `hard_001` (all seven fields) and the 63-to-67 of 70 core ledger with
  12 adversarial kept separate at `1b75476`; Order Supervisor terminal events, completion
  gating and activity-log-only actions at `ba544e0`; UPI daily replay rows at `dbc43ad`,
  zero budget violations and 85/616 from the replay summary, and 85,429 held-out rows at
  92.06% / 12.81% (XGBoost production baseline, 22 January 2026) from `4ff41b6`.
- **Pixel parity:** `npm run worlds:parity` loads each study and its production route at
  390, 800 and 1440, scrolls both to every chapter with an instant jump, waits for the
  chapter to settle and diffs the frames. A pixel counts as changed above 40/255 on any
  channel, which absorbs WebP encoding of the paintings. Repeated captures of one page differ
  by 0.000%. Diff images are written to `.shots/world-parity/<slug>/` for any frame above
  0.5%. Results are in the table above; both non-zero frames were inspected and contain only
  the em-dash sentence.
- **Per-world gate:** `node scripts/phase6-world-port-gate.mjs` passed every world at 390, 800
  and 1440: chapter activation for every chapter, every control's pressed state and announced
  result, zero idle drawing, keyboard focus and an unobstructed case-study link at the ending,
  30fps ceiling, per-frame draw at or under 5.4 ms, `world:destroy` teardown, no runtime
  requests, no console errors, no-JavaScript and reduced-motion at 390 and 1440, print, focus
  on arrival from `/work` and exact Back restoration. Evidence: `.shots/phase6-worlds/`.
- **Inspected renders:** phone and desktop frames of every world were composed and looked at
  (openings, turning points and endings) and match the studies.
- **Combined gate:** `npm run phase6:worlds-gate` on the final commit `cf9487b` exited 0 with
  135 PASS and 0 FAIL: 16 verified public claims, no em dash across 8 world records, 37 HTML
  pages with full metadata, a 36-route sitemap, the ten-door Home, Sheet Fault at all widths,
  BeatMind, Vivid, Tathya and the five illustrated worlds. Two Sheet Fault p95 measurements
  (800 px Home and 1440 px `/work`) were 33.4 ms against the 34 ms limit: passing, but close.
  The same suite had already passed (135/0) on the world commits before the claim records
  were folded in; the rewritten branch is byte-identical to that tree plus the claims.

- **Independent revert:** in a temporary worktree each world commit reverted cleanly on its
  own, and all five reverted together. Every world commit touches only its own files; claim
  records were folded into their worlds' commits so no later commit edits a world's page.
  With MedRAG reverted, the content check (15 claims), build (35 routes), case-study batch
  gate, static-site gate (ten doors, MedRAG back on its paper route) and the other four world
  gates all passed. With all five reverted the tree builds the original 31-route sitemap,
  passes the static-site gate, and the world harness reports nothing to prove. That run found
  one defect, now fixed in `10aabd4`: the harness crashed when git removed the empty
  `scripts/world-gates/` directory.

## Deliberate differences from the studies

- The em dashes in QueryPilot's ending and UPI's arrival become commas (standing copy rule).
- Order Supervisor's footer "Motion study II · 08 September 2026" becomes the source revision.
- UPI's recorded-day readout keeps "1 June 2025" style after a click (the study switched to
  "2025-06-01").
- Eyebrow labels are stored in sentence case and capitalised by CSS; the pixels are identical
  and assistive technology no longer reads all-caps text.
- Chapter links are labelled from the scene records (MedRAG's study labelled chapter 1 "The
  empty stage").
- Paintings ship as WebP quality 88 at their original 1536x1024 (PSNR 36-39 dB; a 1:1 crop is
  indistinguishable). The PNG originals stay in `design/directions/assets`.
- `noindex`, study titles and relative study paths are replaced by the shared site metadata.

## Open, deferred and unverified

- **Owner review of the production routes** (as opposed to the studies) is open, so the
  BUILD_PLAN items stay unticked. Merging to `main` and pushing (which triggers the Vercel
  production deploy) need the owner's explicit go.
- **Vivid and Tathya** are flagged to revisit. **OncoVerse and Spur Chat** have no world.
- **Typography exception:** MedRAG, SecondSelf and UPI use Georgia, as approved. Where
  Georgia is not installed (most Android devices) the browser substitutes another serif, so
  pixel fidelity holds on Windows and macOS only.
- **Payload:** SecondSelf's two paintings are 821 KB together, the heaviest world route.
- **No type checker** is installed (`astro` and `playwright` only), so no gate
  machine-checks the strict TypeScript. The ports compile through Astro's build.
- **Phase 3** deferred items (mobile arrival review, five-person test, preview deployment)
  remain open and are unaffected.

## Environment

A global npm package `node@22.5.1`, installed on 2026-09-22, shadows the system Node 24.16.0
on PATH, and Astro 7 refuses to build under it. The first baseline attempt failed at the
build for that reason. Every result above ran with `C:\Program Files\nodejs` first on PATH.
The owner may remove the shim with `npm uninstall -g node`.

## Possible improvements, not done

Proposed for a separate, owner-reviewed step; none is in this pass.

- Serve the paintings as AVIF with a WebP fallback (about 40% smaller) once the stage markup
  can take a `<picture>` without breaking the approved selectors.
- A responsive 960-wide painting for phones, where the stage is 40% of the viewport.
- Self-host a Georgia-like serif so the illustrated worlds render identically on Android.
- Per-world motion refinements the owner may want after seeing the worlds in context.

## Commands

```bash
npm run build
npm run phase6:worlds-gate           # every earlier gate, then all illustrated worlds
node scripts/phase6-world-port-gate.mjs --only=medrag
npm run worlds:parity -- medrag      # study versus production, every chapter and width
npm run worlds:media                 # re-encode the study paintings
npm run worlds:stills                # recapture the paper-preview stills (then rebuild)
node scripts/world-study-server.mjs  # the approved studies at http://127.0.0.1:4327/
```
