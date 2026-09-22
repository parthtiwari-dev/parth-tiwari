# BUILD PLAN: Paper and Worlds

**Current state, 2026-09-23:** Phases 0-2, 4 and 5 are closed; Phase 3's final checks are
open; Phase 6 has eight of ten worlds live (see its checklist); Phases 7 and 8 have
not started. Dated checkpoints: [`BUILD_PLAN_HISTORY.md`](BUILD_PLAN_HISTORY.md); closed-phase detail:
[`BUILD_PLAN_CLOSED_PHASES.md`](BUILD_PLAN_CLOSED_PHASES.md).
World integration record: [`WORLD_INTEGRATION.md`](WORLD_INTEGRATION.md).

Revised 2026-08-29. This is the execution plan for the portfolio rebuild.

The public brand is **Parth Tiwari**. **Paper and Worlds** is the internal name of the
design system: one continuous sheet of real rag paper, a register of work printed on it,
and a project-specific world behind each entry.

This plan replaces the earlier six-phase draft. The order is binding. A later phase does
not begin until the current phase gate has been run, its evidence shown to the owner, and
the owner has approved moving on.

## 0. Working protocol

Every phase follows the same loop.

1. **Open the phase.** State its scope, exclusions, exact files likely to change, known
   risks, and the questions whose answers would materially change the result.
2. **Get the owner's decision.** For visual phases, show the reference lock, page
   structure or storyboard before production implementation. Do not interpret silence as
   approval.
3. **Build in reviewable slices.** Keep the owner updated after each named checkpoint.
   For visual work, show rendered evidence at 390px, 800px and 1440px, including the
   relevant hover, touch, keyboard, reduced-motion and no-JavaScript states.
4. **Run the gate.** A gate is command output, rendered evidence or a recorded human
   test. “Should pass” is not evidence.
5. **Stop.** Report what passed, what failed, what cannot be verified, and the current
   diff. Do not begin the next phase until the owner approves it.

Plan checkboxes are evidence markers. Tick an item only in the same commit that completes
and verifies it. A partially completed item stays unticked and receives a short note.

## 1. Stack

| Layer | Decision |
|---|---|
| Framework | **Astro 7.2.9**, exact pin verified from the npm registry in Phase 0 |
| Output | Static HTML. No server rendering in the public site |
| Language | TypeScript strict |
| Content | Astro build-time content collections; Markdown entries with schemas from `astro/zod` |
| Styling | Vanilla CSS with tokens in one file. No Tailwind |
| Motion | CSS and Web Animations API. No GSAP, Lenis or smooth-scroll engine |
| Worlds | Hand-written 2D canvas or DOM/SVG where simpler; one shared clock |
| Hosting | Static Vercel deployment, no adapter in the initial build |
| Public runtime dependencies | Target **one direct dependency: `astro`** |
| Analytics | Removed during Phase 0. Reconsidered in Phase 7 with a written privacy and dependency decision |

“One runtime dependency” means one direct production dependency in `package.json`, not
Astro's transitive dependency tree. Test, lint and build tools may be development
dependencies when they have a named gate to serve.

Astro is the right shape because the default artifact is HTML on disk. The sheet, routes,
case studies, notes and resume need no client runtime. The tear, backlight and world stages
are isolated enhancements. Next.js and Nuxt can emit static sites, but their application
runtime and conventions add no value to this content-first build. Plain HTML has appeal,
but hand-maintaining a growing project and notes archive would rot.

Any proposed public runtime dependency must first be recorded in `DECISIONS.md` with:

- the user-visible capability it enables;
- the measured cost in the relevant route bundle;
- the simpler alternatives tried;
- its no-JavaScript and reduced-motion behavior;
- its removal path.

## 2. Information architecture

There are **eight route families**, serving two readers without turning one page into a
compromise.

| Route | Purpose | Primary reader |
|---|---|---|
| `/` | Arrival, two doors, person, the complete paper index, proof, services, errata and contact | Both |
| `/work` | Complete register with honest sorting and filtering | Both |
| `/work/[slug]` | One complete paper case study; its separate project world enters through the Paper and Worlds transition | Employer depth |
| `/notes` | Errata and writing hub; a clear coming-soon state if no general posts exist | Both |
| `/notes/[slug]` | One full erratum or article with sources and related work | Both |
| `/about` | Portrait, path, work-experience timeline and operating rules | Human check |
| `/resume` | Crawlable HTML CV with PDF download and print styles | Employer and ATS |
| `/hire` | Scope, process, fit and direct contact; no public pricing | Client conversion |

The initial number of generated HTML pages is not called “eight routes” in a gate. The
gate enumerates the files Astro actually produced: the fixed pages, every project slug,
every published note slug, the 404 page, sitemap and feeds.

No separate `/blog` route is added. `/notes` is the publishing system. It has two content
types, **Errata** and **Posts**, with individual pages under `/notes/[slug]`. If Posts has
no entries at launch, the hub says “Coming soon” while Errata remains useful. No empty
navigation destination ships.

No separate `/experience` route is added. Work experience appears once as a human timeline
on `/about` and once as structured employment on `/resume`. These are different readings of
the same source data, not duplicate content stores.

## 3. What was deleted and what survived

Phase 0 executed the reviewed delete-and-keep manifest. The manifest is preserved in
[`BUILD_PLAN_HISTORY.md`](BUILD_PLAN_HISTORY.md).

## 4. Content contracts established before components

The public site will continue to grow. Phase 1 therefore creates stable content contracts
rather than hard-coding today's count into pages.

### Project entry

Each project contains identity, tier, status, dates, audience, summary, nine case-study
beats, verified links, media, world storyboard, world data source and claim references.
Sorting fields are typed. The owner rejected cost sorting and chose qualitative build
effort: `flagship`, `substantial` or `focused`. The labels describe repository and system
scope, never invented hours or money.

### Note entry

Each note contains type (`erratum` or `post`), date, summary, body, related projects,
sources, publication state and optional updated date. Drafts do not enter static routes,
sitemap or RSS.

### Claims

Every number shown publicly has a claim record with context, source, verification date and
an `asOf` date when it can change. Counts are published as snapshots, never implied to be
live. The working register is [`CONTENT_PROVENANCE.md`](CONTENT_PROVENANCE.md).

## 5. Phases

### Closed phases

Their full owner-review lists, checklists, checkpoints and gate text are frozen in
[`BUILD_PLAN_CLOSED_PHASES.md`](BUILD_PLAN_CLOSED_PHASES.md). All their checklist items are ticked.

| Phase | Result | Evidence |
|---|---|---|
| 0. Clear the ground | Gate passed; v1 removed, Astro 7.2.9 static scaffold | Git history, `CLAUDE.md` |
| 1. Content and evidence | Passed 2026-08-28 under an owner-amended gate. The text-only human test was deferred, not passed, and may never be reported otherwise | `PHASE_1_EVIDENCE_AUDIT.md` |
| 2. Design system and page architecture | Passed 2026-08-31; the deferred polish later ran as the nine-point refinement, merged 2026-09-03 | `PHASE_2_GATE.md`, `DESIGN_REFINEMENT.md` |
| 4. Paper signature, backlight and tear | Passed and owner-closed 2026-09-01 (Sheet Fault). The owner waived personal render inspection; never report it as having occurred | `PHASE_4_GATE.md` |
| 5. World foundation and BeatMind pilot | Closed 2026-09-02 on owner approval of the rendered world; failure/retry and audio withheld for lack of publishable evidence | `PHASE_5_GATE.md` |

### Phase 3: Complete static site

No canvas. No tear. No animated world. The result is a complete, useful portfolio by itself.
It deploys to a verified preview alias. The approved interim Phase 2 root may already be
public for feedback, but the complete multi-route site does not replace that checkpoint on
production until Phase 7.

Build in reviewable route slices. Each slice receives screenshots, owner review and its own
commit with the matching plan items ticked.

#### 3A. Shell and home

- [x] Persistent navigation, contact action, footer, skip link and responsive shell.
- [x] Home flow: arrival and two doors, portrait and short introduction, every project
  in an editorial paper index, verified proof, services, latest errata and contact.
- [ ] Above the fold contains one sentence, two doors and no content that requires motion.

#### 3B. Work register and case-study pages

- [x] `/work` lists every project without a hard-coded count in prose.
- [x] Sorting controls operate on real typed fields and preserve a meaningful default order.
- [x] BeatMind and Vivid use one content-driven paper case-study component and validated
  project-specific evidence records.
- [x] The shared proof contract accepts real video, real image and accessible evidence-record
  variants; empty measurements state their absence instead of rendering blank space.
- [x] Route availability is derived from a validated `caseStudy` record. Deferred register
  rows are non-clickable and related Notes links return to the register.
- [x] Tathya, MedRAG, Order Supervisor, QueryPilot, SecondSelf, OncoVerse, UPI Fraud Engine
  and Spur Chat receive audited `caseStudy` records in the approved batch.
  - [x] Tathya: committed source, real product recording and captures, source-to-case-file
    story, failures, explicit no-measurement state, limits and sources.
  - [x] MedRAG: bounded-corpus retrieval, supported/refused evaluation traces, verified
    refusal denominator, clinical boundary and service-dependent capture limitation.
  - [x] Order Supervisor: durable lifecycle, bounded model proposal, authoritative workflow
    validation, persistence ordering, honest no-measurement state and approval correction.
  - [x] QueryPilot: real API surface, committed correction trace, core/adversarial
    denominator separation, safety-correction failure and semantic-accuracy boundary.
  - [x] SecondSelf: safe committed fixtures only, evidence-to-review workflow, verified
    faithfulness denominator, personal-data exclusion and assisted-action boundaries.
  - [x] OncoVerse: committed atlas asset and content inventory, MTC acceptance record,
    verified scope denominator, medical-review boundary and dirty anatomy exclusion.
  - [x] UPI Fraud Engine: real evaluation visualisations, time-aware pipeline, fixed
    alert-budget story, separate held-out/replay records and risk-score boundary.
  - [x] Spur Chat: real desktop/mobile captures, SSE and recovery architecture, fictional
    take-home boundary, frontend/backend split failure and current suspended-backend state.
- [x] Fraud Risk Intelligence and Oracle Auto Provision remain explicitly deferred as
  **Case study in development** until their later audits.
- [x] Every emitted `/work/[slug]` page satisfies `CASE_STUDY_CONTRACT.md`, including real
  product proof, contribution, research, trade-offs, evidence, failures and limits.
- [x] Previous/next and back-to-register links prevent dead ends; navigation omits the two
  deferred routes.

#### 3C. Notes and errata

- [x] `/notes` separates Errata and Posts without making either feel secondary.
- [x] `/notes/[slug]` renders complete articles, sources and related work.
- [x] RSS includes published notes only.
- [x] If Posts is empty, the approved “Coming soon” state ships while Errata remains live.

#### 3D. About and experience

- [x] Portrait and first-person introduction.
- [x] Work-experience and training timeline from one typed source.
- [x] Operating rules and working style, with no invented endorsements.

#### 3E. Resume

- [x] Real semantic HTML suitable for crawlers and ATS parsing.
- [x] Verified PDF download, print styles, email and route metadata.
- [x] No Drive embed.

#### 3F. Hire

- [x] Three kinds of work, scope boundaries, four-step process and a direct conversation path; no public price.
- [x] Booking, email and WhatsApp paths verified on phone and desktop.
- [x] No unsupported testimonial, client logo or urgency claim.

**Status:** every route item except the rendered first-viewport assertion is present and
`npm run phase3:static-gate` passes. The gate stays open: the owner's rendered review of the
mobile arrival and route matrix, the real five-person ten-second test and a verified preview
deployment. Phases 4 onward ran under an explicit owner exception (2026-09-01), which is not a
Phase 3 pass.

**Gate**

- Build, type, accessibility, screenshot, link and craft checks pass.
- Every emitted HTML page is enumerated and readable with JS disabled.
- Canonical, Open Graph, JSON-LD, sitemap, RSS and 404 output are verified.
- The ten-second test passes on the built site.
- The complete static site is deployed to a verified preview alias, not the production
  domain.

Show the route matrix, screenshots, command output and preview evidence, then stop.

### Phase 6: Remaining worlds, reviewed pairs

Each world repeats this loop (the 2026-09-07 paired-batch process is in `WORLD_BATCH_1.md`):

1. Show the real-data inventory and unresolved claims.
2. Present the scroll storyboard and static final frame.
3. Ask the owner the project-specific questions.
4. Build only after approval.
5. Review phone, tablet, desktop, keyboard, reduced-motion and no-JavaScript output.
6. Commit the world alone and tick its plan item in that commit.
7. Run its revert and performance gates before starting the next batch.

The illustrated worlds were integrated as recorded in `WORLD_INTEGRATION.md`. A box is ticked
when a world has a production route, its gate and the owner's sign-off or merge direction.

- [ ] Vivid — production implementation is committed. Fresh `phase6:tathya-gate` includes a passing Vivid browser gate on 2026-09-07. On 2026-09-23 the owner reviewed it and does not like it yet: flagged to revisit later.
- [x] Tathya — The Long Table. Built and `published: true` on branch `world/tathya`.
  Wordless event-driven canvas; a dated public-record snapshot
  (`provenance: 'public-snapshot'`, `2026-09-04`) with three anonymised case files carrying
  their real source compositions; the `provenance` guard and `phase6:tathya-gate` refuse a
  placeholder. `npm run phase6:tathya-gate` green; an isolated revert proof passes; the
  owner directed the merge to `main`. On 2026-09-23 the owner reviewed the rendered world
  and does not like it yet: flagged to revisit later. The tick records the route and gate,
  not an owner acceptance. Scope, scene contract and data contract:
  `TATHYA_WORLD_STUDY.md`; rationale for `public-snapshot`: `DECISIONS.md`.
- [x] MedRAG — The Theatre of an Answer. Owner approved the illustrated design 2026-09-09
  and the integration 2026-09-23. Now a dedicated production route on `world/integration` (2026-09-23), gate-green in `phase6:worlds-gate`; 0 of 24 parity
  frames differ from the study. Owner directed the merge 2026-09-23 (`02b5669`) and notes
  room to improve later. See `WORLD_INTEGRATION.md` and `MEDRAG_WORLD_STUDY.md`.
- [x] Order Supervisor — Inside the Night Watch (Study II). Owner approved 2026-09-23. Now a
  dedicated production route on `world/integration` (2026-09-23), gate-green in `phase6:worlds-gate`; 0 of 24 parity frames differ. Owner directed the merge 2026-09-23 (`02b5669`) and notes
  room to improve later. See `WORLD_INTEGRATION.md`.
- [x] QueryPilot — The Cartographer's Fold. Owner approved 2026-09-23. Now a
  dedicated production route on `world/integration` (2026-09-23), gate-green in `phase6:worlds-gate`; 26 of 27 parity frames identical, the
  last differing only by the required em-dash fix. Owner directed the merge 2026-09-23 (`02b5669`) and notes
  room to improve later. See `WORLD_INTEGRATION.md`.
- [x] SecondSelf — A Little Further, Together. Owner approved 2026-09-09 and the integration
  2026-09-23. Now a dedicated production route on `world/integration` (2026-09-23), gate-green in `phase6:worlds-gate`; 0 of 24 parity frames
  differ. Owner directed the merge 2026-09-23 (`02b5669`) and notes
  room to improve later. See
  `WORLD_INTEGRATION.md`.
- [ ] OncoVerse — not started.
- [x] UPI Fraud Engine — The Narrow Harbour. Owner approved 2026-09-23. Every figure was
  verified against source for the first time (see `WORLD_INTEGRATION.md`). Now a
  dedicated production route on `world/integration` (2026-09-23), gate-green in `phase6:worlds-gate`; 23 of 24 parity frames identical, the last
  differing only by the required em-dash fix. Owner directed the merge 2026-09-23 (`02b5669`) and notes
  room to improve later.
- [ ] Spur Chat — not started.
- [ ] Fraud Risk Intelligence — not started.
- [ ] Oracle Auto Provision — not started.

OncoVerse defaults to a 2D or pre-rendered treatment. Three.js is considered only after a
measured prototype proves the case study loses essential meaning without it and the runtime
dependency decision is approved.

**Gate per world**

- Static frame stands alone.
- All claims and visual data have provenance.
- 30fps ceiling, offscreen pause and cleanup pass.
- The world reverts alone without breaking its case-study route.
- Owner approves the rendered story.

After the final world, run the complete route, accessibility, performance and link suites.
Show the results and stop.

### Phase 7: Complete-site production cutover

The owner-authorized Phase 2 root-only release does not satisfy this phase. Phase 7 replaces
that interim landing with the complete reviewed site and verifies every public route.

**Owner review before work**

- Confirm the production domain and redirect map.
- Confirm whether analytics earns its privacy, dependency and maintenance cost.
- Approve final metadata, social preview and public claim snapshots.

**Do**

- [ ] Re-verify every external URL and deployment ownership.
- [ ] Create the production deployment from the reviewed commit.
- [ ] Point the chosen domain and redirect v1 only after the new deployment is healthy.
- [ ] Verify canonical URLs, social previews, sitemap, RSS and robots on the live domain.
- [ ] Run the live ten-second test and record results.
- [ ] Add analytics only if the Phase 7 decision is approved and the plan budgets are updated.

**Gate**

- Every public route returns the expected status and is readable without authentication.
- Four of five new participants pass the ten-second test on the live domain.
- Phone contact and booking paths work without an interstitial.
- Rollback to the last production deployment is documented and tested where the platform
  permits it.

Show the live evidence and stop.

### Phase 8: Publishing and admin workflow

This phase happens after the public site is stable. It does not block launch. Until then,
new projects and notes are added through reviewed Markdown commits and preview deployments.

**Research before choosing a system**

Compare a Git-backed editor, an external headless CMS with build hooks, and a small separate
admin application. Decide based on the actual publishing frequency, draft/review needs,
media handling, authentication, preview quality, backup and rollback. Do not add an admin
runtime to the public site by default.

**Required capabilities**

- Create and edit projects, errata and posts using the Phase 1 schemas.
- Draft, preview, publish, unpublish and roll back.
- Upload media with alt text, licence and source metadata.
- Require provenance for numeric claims before publication.
- Trigger a static preview build, then a production build after approval.
- Keep admin authentication and secrets out of the public bundle.
- Preserve Git or exportable content as the recovery path.

**Gate**

- A non-technical editing pass creates a draft note, previews it, publishes it and rolls it
  back without touching source code.
- Invalid claims and missing accessibility metadata are rejected before publish.
- The public route remains static and within the same performance budgets.

## 6. Budgets and stop conditions

| Measure | Ceiling or rule |
|---|---|
| Direct public runtime dependencies | 1 until a recorded decision changes it |
| Eager JavaScript, gzip, per static route | 30 kB maximum |
| World animation | 30fps ceiling, one shared clock, paused when not visible |
| Fonts | 180 kB total target, measured after subsetting |
| Static content | Complete without JavaScript |
| Motion | Transform and opacity by default; exceptions measured and documented |
| Claims | Source, context, verification date and `asOf` date where changeable |

The previous `src/` line and component counts remain useful warning signals, not quality
targets. If the shared shell begins approaching v1's size or a world requires a sitewide
framework, stop and review the architecture before adding more.

## 7. Current blockers and owner-supplied facts

- The text-only ten-second test was not run and was explicitly deferred by the owner. The
  built static preview still requires a real five-person test in Phase 3.
- BeatMind's conflicting build-count snapshots are excluded. The owner reports **18 Clerk
  accounts** as of 2026-08-28; publication still requires the Clerk record and exact
  counting definition. The attached Vercel screenshot does not prove this count.
- The owner knows at least 10 Vivid users, but no durable analytics or counting record was
  attached. The count remains unpublished.
- QueryPilot's `+5.7pp` belongs to the 70-query core set; the 12 adversarial queries are
  reported separately unless new evidence establishes another denominator.
- UPI's model-evaluation precision and operational backtest precision must not be collapsed
  into one number.
- Oracle duration and uptime language remains unpublished until evidence exists.
- QueryPilot's world draws its own atlas from a committed trace, so no product capture blocks
  it. Vivid's world is live but the owner flagged it to revisit (2026-09-23).
- The owner decided that no price or price band appears anywhere on the public site.
