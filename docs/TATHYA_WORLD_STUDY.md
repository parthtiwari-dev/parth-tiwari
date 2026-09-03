# Tathya world — The Long Table

Started 2026-09-04 on branch `world/tathya`. Status: **published; `phase6:tathya-gate`
green; owner rendered review still open.**

Reads after `WORLDS.md` §03 and `DESIGN_LOCK.md` §7. This records the selected treatment,
the choreography, the data contract and the current proof. `BUILD_PLAN.md` Phase 6 step 4
(build only after approval) is satisfied by the standing Phase 6 work-order exception plus
the owner's 2026-09-04 instructions to start building, refine in place, and close the phase
by merging to `main`. The owner has directed the merge but has not separately signed off a
rendered review of the animated world; that review stays open and must not be reported as
done.

## Selected treatment: The Long Table

A dark archival table seen mostly from above, under a warm work-light. Sources are set
down as paper slips, tagged by kind (official / media / citizen) and corded back to their
origin at the table edge. Related slips are bound under a loose cord that never cinches. A
verdict — an oxblood slab on an arm above the table — descends and strikes the record
three times across the sequence and leaves no mark, then retracts for good.

The canvas carries **no words**. Every count, label and sentence is in the static HTML
beside it (the scene narration, the case-file `<dl>` ledger, the boundary block, the
corpus-absence note). The canvas is the physical metaphor only, so it can never be the
sole carrier of meaning.

Rejected treatments, recorded with the reason:

- **The Citation Field** — abstract points and edges on a dark field. Reads as generic data
  visualisation and as the architecture diagram rather than a place. A settled cluster also
  reads as *solved*, which the product refuses.
- **The Verdict That Isn't** — a balance scale rigged never to tip. A scale is an
  adjudication device; using it even to subvert it frames Tathya as a machine that decides.

Two earlier standalone artifacts (a storyboard memo, then a slow scroll-scrub animatic)
were reviewed by the owner and rejected for feel. The crawl was diagnosed as an
architecture problem: scroll-fraction mapped to a continuous eased progress, so every
visual was mid-ramp and nothing was ever a discrete event.

## The time model (why this one does not crawl)

Scroll selects the scene. It does **not** scrub inside a scene. When a scene becomes
current a local millisecond clock starts (`onActiveScene`), its events fire at fixed
offsets and complete in a few hundred ms with snap easings (`easeOutBack`, `easeInQuad`,
`easeOutExpo`), then the frame holds perfectly still — no idle drift. The shared
`world-lifecycle.ts` gained one backward-compatible change: `draw` may return `true` to
request more frames after the scroll position has settled; BeatMind and Vivid return
nothing and are unaffected (their gates pass unchanged).

Camera is a fixed framing per scene, hard-cut over ~180 ms on a scene change, then still.
The lamp is one soft warm ellipse clipped to the table surface; it eases toward the
scene's focus and dims slips that sit outside its pool.

## Scene contract

| # | id | framing | events (all wordless on canvas) |
|---|----|---------|---------------------------------|
| 1 | record | wide overhead | the day's other files flick in as faint dashed slots; the table is never empty |
| 2 | sources | file A left, close | two source slips carried in from the edge, set down, cords whip taut |
| 3 | standing | file A right, near top-down | two empty dashed slots appear beside the file where an official record and a citizen account would sit; the strike |
| 4 | ledger | file A left, cords sweeping right | ruled claim lines reveal on each slip; every cord whips taut to its origin rail |
| 5 | file | all three files, wide | a loose binding cord is drawn around each file; the strike |
| 6 | one-voice | all three files, thread crossing | one bright thread drawn from the media rail through every media slip in every file |
| 7 | boundary | files right, strike centred | a raised dogear tab on the open-question files; a struck green frame + tick under the file with verifiable facts; the hard strike; the slab retracts for good |
| 8 | handoff | pull back, table recedes | the record ghosts out; a blank ruled FINDING sheet sits lit at the front |

Reduced motion and no-JavaScript show the composed still
`public/media/tathya-world-still.svg` and the complete DOM narration, ledger and boundary
copy in ordinary HTML; the stage is hidden.

## Data contract

`src/data/worlds/tathya-world-v1.json`, validated by `tathyaWorldDataV1Schema`.

- `provenance: 'public-snapshot'` — the guard. Real values are `'committed-export'` (a
  read-only export from the Tathya repo) or `'public-snapshot'` (a dated read of the
  deployed public record). `'placeholder'` cannot ship: `phase6:tathya-gate` fails on it
  and the world entry stays `published: false`.
- `snapshot` — `takenAt: '2026-09-04'`, `surface: 'https://tathya-1.vercel.app/'`, and the
  meaning of the read. This is the same class of evidence the paper case study cites.
- `feed` — `caseFileCount: 13`, `handPickedCount: 0` (literal), and the real
  source-count histogram (`4×1`, `7×2`, `2×3`).
- `caseFiles[]` (anonymised `Subject A/B/C`) — `sourceCount`, `composition`
  (`official`/`media`/`citizen`), `claimCount`, `verifiableFacts`, `openQuestion`.
  Composition sums are schema-checked against `sourceCount`; a file may not claim
  verifiable facts with no official source, and may not be both a confirmed record and an
  open question.
- `sharedMediaSource` — the real finding that the independent-media side of every inspected
  file traced to one publisher; the world shows source counts, not the name.
- `openQuestions[]` — the record's own verbatim open-question sentence, per file.
- `integrity` — `historyNeverRewritten`, `extractionIssueReportable`.
- `corpusBenchmark.available: false` — no corpus size, coverage or clustering score is
  shown; the paper case study's `measurement.absence` stays untouched.

The three case files carry the real, directly-read source compositions from the
`tathya-1.vercel.app` public feed and topic pages on 2026-09-04 (`Subject A` = 2 media, 0
official, 0 citizen, open question; `Subject B` same; `Subject C` = 1 official + 2 media,
verifiable facts). Labels are anonymised; no subject, publisher or ingested URL is
reproduced.

## Why `public-snapshot` is legitimate

`WORLDS.md` rule 7 allows a public claim to be checked "against the repo, the deployment,
or the errata". A dated read of the deployed public record is the deployment case, the
same class of evidence as BeatMind's "381 tests on 2026-08-28". The repo export from
`bf4606f` remains the stronger source and can replace this later; the dated snapshot is
the honest interim and does not block the world. Recorded in `DECISIONS.md`.

## Files

- `src/content/schemas.mjs` — `tathyaWorldDataV1Schema` (+ `provenance` guard, `feed`,
  `sharedMediaSource`, `openQuestions`, `integrity`)
- `src/lib/worlds.ts` — artifact registration and `loadValidatedWorldData` branch
- `src/data/worlds/tathya-world-v1.json` — the dated public-snapshot export
- `src/content/worlds/tathya.json` — world entry, `published: true`
- `src/components/TathyaWorld.astro` — the route component (ledger, boundary, corpus note)
- `src/scripts/tathya-world.ts` — the renderer (wordless canvas)
- `src/pages/work/[slug]/world.astro` — the `tathya` branch
- `src/scripts/world-lifecycle.ts` — the `draw` return contract
- `src/styles/world-foundation.css` — `.tathya-*` and `.world-shared-source` rules
- `public/media/tathya-world-still.svg` — the composed still (three files, one thread)
- `scripts/phase6-tathya-world-gate.mjs` — the gate; `phase6:tathya-gate` npm script

## Proof

- `npm run phase6:tathya-gate` green: the full Phase 1–5 static and world chain, the Vivid
  world gate, then the Tathya gate — data provenance guard, composition sums, feed
  `handPickedCount 0`, corpus benchmark absent, no `Math.random`, no `<audio>`, no runtime
  requests, no console errors, `ready`/`animated`, 8 scenes, one `h1`, no overflow, draw
  rate ≤ 30.5/s, no-JavaScript / reduced-motion / forced-canvas-failure fall back to the
  still, and the `/work` → world route with Back restoration.
- Rendered frames at 390 and 1440 captured via `scripts/_tathya-capture.mjs` (gitignored)
  and inspected during the build.
- Home and `/work` route Tathya's door to `/work/tathya/world/` automatically through
  `projectDoorHref`; the final world action opens `/work/tathya/`.

## Open

- **Owner rendered review** of the animated world at 390 / 800 / 1440. Directed to merge;
  not separately signed off.
- A read-only export from the Tathya repo at `bf4606f` can later replace the dated
  snapshot (`provenance: 'committed-export'`); not blocking.
- Deferred, non-blocking polish: the mobile strike briefly crosses the heading before the
  scrim; the loose binding cords read faintly on the dark table.
