# BUILD PLAN history

Frozen text moved out of [`BUILD_PLAN.md`](BUILD_PLAN.md) on 2026-09-23 by the doc-hygiene pass,
so the live plan holds only current state and open work. This file holds the superseded checkpoints and notes; the closed phases are in [`BUILD_PLAN_CLOSED_PHASES.md`](BUILD_PLAN_CLOSED_PHASES.md). Text is verbatim as it stood
in `BUILD_PLAN.md` at commit `9af2d16`; only heading levels inside each moved block are demoted
one step so they nest under this file's sections. It is history: never edit it to reflect
newer facts; the live plan states what is true now.

## The 2026-09-23 checkpoint as first written

**2026-09-23 integration checkpoint:** The owner reviewed every world in the browser, approved
MedRAG, SecondSelf, QueryPilot, Order Supervisor and UPI Fraud Engine, flagged Vivid and
Tathya to revisit later, and directed pixel-faithful integration now. All five are on
dedicated production routes on local branch `world/integration`, one revertable commit each,
with `npm run phase6:worlds-gate` and a study-to-production pixel-parity record. Merged into
`main` (`02b5669`) on the owner's direction the same day; not yet pushed or deployed. See WORLD_INTEGRATION.md; this supersedes the design-first checkpoint
below.

## Stacked checkpoints from the top of BUILD_PLAN.md (2026-08-29 to 2026-09-09)

**2026-09-09 design checkpoint:** Owner approved illustrated MedRAG and SecondSelf. Preserve
them. QueryPilot / The Cartographer’s Fold is the next local design. Complete remaining
world designs before the later production integration pass. See WORLD_DESIGN_HANDOFF.md
and QUERYPILOT_WORLD_STUDY.md; this supersedes historical finite-proof proposals below.

**Current owner authorization, 2026-09-09:** Build both complete illustrated worlds,
sequentially without agents. This supersedes the finite-proof proposal and historical
pauses below. Active previews are MedRAG / The Theatre of an Answer and SecondSelf /
A Little Further, Together. Versioned realistic alternatives are preserved. Read
docs/ILLUSTRATED_WORLDS_DELIVERY.md (ILLUSTRATED_WORLDS_DELIVERY.md from docs) for implementation
and verification. No production cutover is implied by local preview completion.


**Latest creative steering:** The owner wants illustrated, anime-influenced realism and
scroll choreography, and finds the current photo/zoom structures too similar. Preserve
both current versions. Read docs/WORLD_CREATIVE_DIRECTION.md (from docs, omit docs/).
The next recommendation is a small alternate MedRAG theatre motion proof, followed by a
SecondSelf companion/search narrative if it improves the experience. This is a proposed
experiment, not approval to replace all worlds or discard current alternatives.

### Current checkpoint: generated animated worlds, 2026-09-08

The owner authorized direct creative execution and original image generation for MedRAG,
then SecondSelf. Both now have eight-chapter animated local studies, built sequentially
without agents. MedRAG is The Uncarved Answer; SecondSelf is The room before send.
Each has original generated environmental artwork, distinct scene choreography and local
interactive controls grounded in the reviewed project records. Order Supervisor's revised
ending remains preserved. See `MEDRAG_WORLD_STUDY.md`, `SECONDSELF_WORLD_STUDY.md` and
`WORLD_GENERATED_ASSETS.md` in docs. Older premise-selection holds below are superseded.

These are local visual studies, not newly registered public Astro world routes. No push,
merge or deployment occurred. Production integration and the earlier Sheet Fault timing
gate remain separate work. Current evidence lives in `.shots/cinematic-studies`.

**Latest owner steering, 2026-09-08:** Work on Order Supervisor alone, without agents.
MedRAG's current treatment was rejected and is paused. The watch premise is retained;
Study II expands it into an eight-chapter mechanical journey with longer staged movement.
This supersedes the earlier statement that both first drafts were ready for selection.
See `ORDER_SUPERVISOR_WORLD_STUDY.md` in docs for the current revision and evidence.

Revised 2026-08-29. This is the execution plan for the portfolio rebuild.

**Current checkpoint, 2026-09-08:** Phase 6 now proceeds in owner-approved pairs.
`WORLD_BATCH_1.md` records the accepted seven-world sequence and current checklist.
MedRAG and Order Supervisor have browser-checked standalone storyboards awaiting owner selection.
Tathya is merged to `main` at `a051c02`; fresh Vivid and Tathya browser gates pass,
but their owner rendered reviews remain open. Older dated checkpoints below are history.

## Planning lock completed before Phase 0

#### Planning lock completed before Phase 0

The 2026-08-27 documentation commit completed this planning pass:

- [x] Set the public brand to Parth Tiwari and kept Paper and Worlds as the design name.
- [x] Reconciled the route model, including full note pages and no duplicate Blog or
  Experience route.
- [x] Updated the stack to Astro 7.2.9, defined the dependency rule and removed
  analytics from the initial baseline.
- [x] Added the phase opening, owner-review, checkpoint, evidence and stop protocol.
- [x] Separated Phase 3 preview deployment from Phase 7 production cutover.
- [x] Added the shared-world foundation and BeatMind pilot before the remaining worlds.
- [x] Upgraded worlds from looping graphics to owner-reviewed scroll stories.
- [x] Added claim provenance and dated handling for changing user counts.
- [x] Added the post-launch publishing/admin phase without adding it to the public runtime.

## Section 3: what was deleted and what survived (Phase 0 manifest)

### 3. What is deleted and what survives

#### Delete or replace in Phase 0

- `src/components/**`
- `src/shaders/**`
- `src/composables/**`
- `src/stores/**`
- `src/utils/**`
- `src/data/{layout,cameraPath,nodeMotion,nodeMeshes,sceneRig,labelLod,screenRegions}.ts`
- Vue/Vite entry files and configuration: `src/App.vue`, `src/main.ts`, `index.html`,
  `vite.config.*`, Vue environment declarations and Vue-specific TypeScript configs
- `tailwind.config.ts` and the old scene token layer
- the direct dependencies `@tresjs/core`, `@vercel/analytics`, `gsap`, `lenis`, `pinia`,
  `postprocessing`, `three` and `vue`
- root `DESIGN_LOCK.md` and `DESIGN_REVIEW.md`, after confirming they are the superseded
  v1 artifacts named in `docs/README.md`
- the Google Drive resume embed and any query-parameter-only navigation contract

Before deletion, Phase 0 prints an exact resolved path list and the dependency diff. Nothing
is deleted from a glob whose resolved targets have not been reviewed.

#### Keep and port

| Source | Purpose |
|---|---|
| `src/data/projects.ts` | Source inventory only; becomes validated project content, not a runtime module |
| `src/data/{about,services,training,capabilities,socialLinks,projectLinks}.ts`, `src/config/site.ts`, `src/types/{project,slider}.ts` | Audited inputs and the types they currently require for Phase 1; every sentence and legacy field is rechecked before reuse |
| `public/media/**` | Captures, portrait, paper stock and licensed media |
| `scripts/browser.mjs` | Existing browser launch/proxy solution; preserve unless a current check proves it obsolete |
| `scripts/{shots,a11y-check,perf-check,craft-check}.mjs` | Audit and adapt to real routes; do not blindly copy v1 assumptions |
| `scripts/capture-demos.mjs` | Maintains the verified project captures in `public/media/**`; it is evidence tooling, not a v1 rendering contract |
| `design/**` | Research, direction artifacts, prototype and material tools |
| `docs/**` | Project memory and gates |

`CLAUDE.md` is rewritten in Phase 0. It keeps only stack-independent rules and the working
protocol in §0. Every constellation, shader, Vue and v1 command rule is removed.

## Phase 3 status narratives (2026-09-01)

**Local static closeout, 2026-09-01:** all Phase 3 route implementation items above except
the rendered first-viewport assertion are present. `npm run phase3:static-gate` verifies the typed content, static build, case-study
contracts, internal links, metadata, generated sitemap, RSS and 404 output. The gate below
remains open because the revised mobile arrival still needs rendered owner review, the real
five-person ten-second test remains deferred, and the complete site has not been deployed to
the preview alias.

**Owner-directed phase exception, 2026-09-01:** the owner chose to begin Phase 4 without
performing the remaining Phase 3 rendered review. This does not pass or waive the Phase 3
gate. The mobile arrival review, complete-route visual review, five-person test and verified
preview deployment remain open and must be reported as deferred until they are actually run.
Phase 4 may proceed only through its own owner-review checkpoints and must not be used as
evidence that the underlying static-site gate passed.

## Phase 6 opening sentence (2026-09-07 batch wording)

Follow the owner-approved batches in `WORLD_BATCH_1.md`. Each world repeats this loop;
the two production builds may run in parallel after both storyboards are approved:

## Phase 6 note on the 2026-09-22 catch-up

All local design work below (MedRAG, SecondSelf, Order Supervisor, QueryPilot, UPI Fraud
Engine) was uncommitted through 2026-09-09, then committed and merged to `main` on
2026-09-22 as a version-control catch-up (see `CLAUDE.md`). None of it registers a
production route; `design/directions/*` sits outside `src/` and `public/` and is not part
of the built site. Checkboxes below stay unticked until a world has a production route,
its gate, and owner sign-off.

## Section 7 blocker superseded 2026-09-23

- QueryPilot still needs a useful product capture before its world ships. Vivid now has one
  real browser capture and a real evaluation sequence in its paper case study; world media
  approval remains a separate gate.
