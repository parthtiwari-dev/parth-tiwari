# Tathya world — The Long Table

Started 2026-09-04 on branch `world/tathya`. Status: **implementation in progress,
route unpublished, blocked on the real data export before it can ship.**

Reads after `WORLDS.md` §03 and `DESIGN_LOCK.md` §7. This records the selected treatment,
the choreography, the data contract and the open decisions. It is not an owner sign-off;
`BUILD_PLAN.md` Phase 6 step 4 (build only after approval) is satisfied by the standing
Phase 6 work-order exception plus the owner's 2026-09-04 instruction to start building and
refine in place. The route stays `published: false` until the owner reviews the rendered
world and the placeholder export is replaced.

## Selected treatment: The Long Table

A dark archival table seen mostly from above, under a warm work-light. Sources are set
down as paper slips, tagged by kind (official / media / citizen) and corded back to their
origin. Related slips are bound under a loose cord that never cinches. A verdict — an
oxblood slab on an arm above the table — descends and strikes the record three times and
leaves no mark, then retracts for good.

Rejected, recorded with the reason:

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
offsets and complete in 200–450 ms with snap easings (`easeOutBack`, `easeInQuad`,
`easeOutExpo`), and then the frame holds perfectly still — no idle drift. The shared
`world-lifecycle.ts` gained one backward-compatible change: `draw` may return `true` to
request more frames after the scroll position has settled; BeatMind and Vivid return
nothing and are unaffected.

Camera is a fixed framing per scene, cut over ~260 ms on a scene change, then still.

## Scene contract

| # | id | camera | events |
|---|----|--------|--------|
| 1 | table | wide overhead, empty | establish |
| 2 | intake | close, low | one slip carried in, set down, tagged, cord whips taut |
| 3 | identity | top-down tight | duplicate slip flicked off the table; survivor stays |
| 4 | citation | medium, cords to edges | every slip's cord whips taut; the uncited slip's cord lies slack |
| 5 | file | pull to see the file whole | loose binding cord drawn on; the count + composition write on; strike |
| 6 | conflict | straight overhead, tight | two slips squared parallel at equal weight; the hard strike; the rest quiet |
| 7 | boundary | low across the table | the failed source lifts straight out, clean rectangle left; "no verdict / no ranking / no sentiment score" ruled into the margin; the verdict retracts |
| 8 | handoff | pull back and up | the table recedes, the blank FINDING line at the front, one action into `/work/tathya/` |

Reduced motion and no-JavaScript show the composed still `public/media/tathya-world-still.svg`
and the complete DOM narration; scenes 5 and 7 also carry their numbers and the boundary
copy in ordinary HTML.

## Data contract

`src/data/worlds/tathya-world-v1.json`, validated by `tathyaWorldDataV1Schema`. Fields:
`caseFiles[].sourceCount` / `composition` / `claimCount` / `citedClaimCount`,
`sharedSources`, `conflicts`, `silentFailure`, `corpusBenchmark.available: false`. The
schema's `provenance` is the guard: `'placeholder'` today, must be `'committed-export'`
before the world publishes. Composition sums are schema-checked against `sourceCount`.

**The export does not exist.** It has to be produced read-only from the Tathya repo at
committed `bf4606f`, the way BeatMind's exporter lived on an isolated branch of its own
repo. The placeholder carries the same field shape so the real export is a drop-in.

## Open owner decisions

1. **Produce the export** from Tathya at `bf4606f`. Blocking; no default.
2. **Case-file labels.** The real snapshot's files are live Indian political subjects. The
   world's own new copy naming ministers, parties or contested claims would read as the
   site editorializing. Recommended: opaque ids with generic labels, or composition only.
3. **Per-file counts as a public claim.** Recommended yes, with a `tathya-*.json` claim
   record and a verification date against the snapshot.
4. **The placeholder artifact** — commit it on the branch (current choice) or keep it
   untracked until the real export lands.

## Files

- `src/content/schemas.mjs` — `tathyaWorldDataV1Schema` (+ `provenance` guard)
- `src/lib/worlds.ts` — artifact registration and `loadValidatedWorldData` branch
- `src/data/worlds/tathya-world-v1.json` — placeholder export
- `src/content/worlds/tathya.json` — world entry, `published: false`
- `src/components/TathyaWorld.astro` — the route component
- `src/scripts/tathya-world.ts` — the renderer
- `src/pages/work/[slug]/world.astro` — the `tathya` branch
- `src/scripts/world-lifecycle.ts` — the `draw` return contract
- `src/styles/world-foundation.css` — `.tathya-*` rules
- `public/media/tathya-world-still.svg` — the composed still

## Remaining before publish

- Owner render review of the animated world at 390 / 800 / 1440.
- Real committed export replaces the placeholder; `provenance: 'committed-export'`.
- `scripts/phase6-tathya-world-gate.mjs` and a `phase6:tathya-gate` npm script, wired after
  the Vivid gate; the same no-JavaScript / reduced-motion / 30fps / no-runtime-request
  assertions as the Vivid gate, plus a `provenance` check.
- Independent revert proof.
- Flip `published: true`; Home and `/work` then route Tathya's door to the world
  automatically via `publishedWorldHref`.
