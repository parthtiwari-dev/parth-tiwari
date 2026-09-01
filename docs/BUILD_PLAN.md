# BUILD PLAN: Paper and Worlds

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

### Planning lock completed before Phase 0

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

## 3. What is deleted and what survives

### Delete or replace in Phase 0

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

### Keep and port

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

### Phase 0: Clear the ground

**Owner review before work**

- Show the resolved delete manifest and dependency changes.
- Confirm the Astro 7.2.9 version that will be pinned. The owner approved replacing the
  earlier 6.4.8 plan after the Phase 0 audit found advisories with fixes only in Astro 7.
- Confirm the retained source/content files and whether any uncommitted work exists.

**Do**

- [x] Create `codex/rebuild-astro` from `redesign/v2`.
- [x] Delete the reviewed v1 files and packages in one revertable commit.
- [x] Scaffold Astro 7.2.9 with strict TypeScript and static output.
- [x] Create only minimal placeholder routes needed to prove the build pipeline.
- [x] Audit and adapt the browser/check scripts; remove v1-only contracts.
- [x] Rewrite `CLAUDE.md` for Astro and the phase protocol.
- [x] Add `docs/RULES.md` as the durable ask-before-assuming and documentation contract.
- [x] Update this checklist and any documentation made untrue by the work.

**Gate**

- `npm run build` exits zero and emits HTML to `dist/`.
- A local static server serves the built output.
- `curl` reads meaningful placeholder copy from a built HTML file without executing JS.
- `package.json` contains one direct production dependency, `astro`.
- `git diff` contains no content or design implementation from later phases.
- The Phase 0 commit can be reverted cleanly in a temporary worktree.

Show the complete command output and stop.

### Phase 1: Content and evidence, no design files

**Hard boundary:** do not open `design/directions/*`, do not create CSS, and do not build a
visual component. This phase has been skipped twice and is not skipped again.

**Owner review before work**

- Settle the public hero sentence and exact meaning of the two doors. The two-door meaning
  is approved; the working hero sentence is reviewed with the human-test results.
- Apply the owner's decision to show no price anywhere and sort the register by qualitative
  build effort.
- Review the claims queue, including BeatMind, Vivid, QueryPilot, UPI and Oracle.
- Publish Errata now; keep general Posts empty with the approved “Coming soon” state.

**Do**

- [x] Write all project case studies in `src/content/work/`, using the nine required beats.
- [x] Write the existing errata in `src/content/notes/`; no general Post is approved yet.
- [x] Write route copy for home, work, notes, about, resume and hire.
- [x] Create typed schemas for projects, notes, experience, services and claims.
- [x] Create a source-linked claim record for every public number.
- [x] Resolve the BeatMind scope conflict by excluding build-count snapshots and the
  owner-reported 18 Clerk accounts until the missing account record is attached.
- [x] Record Vivid's owner-known lower bound as blocked and exclude it from public copy.
- [x] Correct QueryPilot and UPI metric context and remove unverifiable Oracle language.
- [x] Verify every included public URL without assuming a deployment alias.
- [x] Complete the text-only ten-second-test artifact.

**Gate**

- Schemas reject a missing case-study beat, missing claim source and invalid link shape.
- Every public number maps to a provenance entry.
- `npm run phase1:gate` exits zero and includes the static Astro build.

The owner deferred the five-person text-only test on 2026-08-28 because participants are
not currently available. The test is not recorded as passed and the agent does not simulate
it. The next required comprehension test is the built static preview in Phase 3, where the
real page structure can be tested instead of blocking visual exploration indefinitely.

**Gate result, 2026-08-28:** automated gate passed. Human test explicitly deferred by the
owner. Phase 1 is complete under this amended gate.

### Phase 2: Design system and page architecture

This phase decides how the locked direction behaves across the full site. It does not build
the production pages.

**Active checkpoint, 2026-08-29:** the owner rejected the complete A/B/C landing studies and
approved maintaining one full-width paper-scroll stub. After reviewing the final phone,
tablet and desktop craft evidence, the owner approved this landing checkpoint for an interim
public release so the old v1 can be replaced and the shared URL can collect feedback. It now
lives at `/`; the obsolete
`/review/phase-2/` route is removed. Root placement does not promote the stub into Phase 3:
the other routes, production shell contract and Phase 3 gate remain unbuilt. The current
craft pass tightens arrival restraint, uses one shared asymmetric split, replaces repeated
edge polygons with three stable generated fibre segments per side, improves directional
fold lighting and prototypes three bounded one-shot paper motions. The rendered slice
evidence is in `.shots/phase2-a1-restraint`, `.shots/phase2-a2-edge-fibres`,
`.shots/phase2-a3-paper-folds` and `.shots/phase2-a4-paper-motion`. The worlds-animation
memo is research only. The final built-preview evidence is in `.shots/phase2-final-built`;
its `a11y`, `craft` and `perf` checks pass, but owner approval and the full gate are still
required before any new Phase 2 checklist item is treated as complete.

The interim root-only production release is a deliberate plan exception, not a phase-gate
shortcut. It does not mark Phase 2 complete, does not create the missing route families and
does not satisfy the Phase 3 preview or Phase 7 full-site cutover gates.

**Interim release evidence, 2026-08-29:** `main` fast-forwarded to the reviewed Astro line
and Vercel reported deployment success. A cache-bypassed request to
`https://parth-tiwari-1.vercel.app/` returned HTTP 200, the new landing title and hero, and no
old EPHEMERIS marker. Live `a11y`, `craft` and `perf` checks passed at 390, 800 and 1440.

**Landing scroll craft evidence, 2026-08-29:** a deterministic frame-paced pass isolated the
full-sheet CSS `drop-shadow()` as the scroll bottleneck. With it present, p95 frame intervals
were 33.4 ms at 390px, 66.6 ms at 800px and 83.4 ms at 1440px. Removing only that filter
brought the same local pass to 16.7-16.8 ms p95 at all three widths, with no frames over 50
ms. Paper depth remains local to the generated edge fibres and fold shadows. This is a craft
fix to the approved landing checkpoint, not a newly completed Phase 2 architecture item.

**`/work` review checkpoint, 2026-08-29:** a real `/work/` composition demo now exists on
`redesign/v2` only. It renders all twelve content-collection entries as one continuous
register, with scope hierarchy carried by row density, three qualitative ordering modes and
a separate active-state filter. The owner approved the opening, hierarchy and controls, but
rejected the first desktop BeatMind panel because it covered row content. The revised static
study uses a faint under-row aperture shared across phone, tablet and desktop; its owner
review is pending. Production hover/focus behaviour, centred-row mobile preview, tear
navigation and case-study routes are still deferred to their assigned phases. Evidence in
`.shots/phase2-work-register-review`
covers the initial study; `.shots/phase2-work-detail-refinement` and
`.shots/phase2-route-audit` cover the refinement and Home-to-Work flow. This checkpoint is
awaiting owner review and does not tick a Phase 2 item, satisfy Phase 3 or authorize
production publishing.

**BeatMind paper case-study checkpoint, 2026-08-30:** the first complete typed
`caseStudy` record and paper-first pilot now exist at `/work/beatmind/`. The stale dark
world masthead, four-stem still, disabled audio placeholder and invented story-path strip
were removed. Real product media now leads into responsibility, development research,
architecture, rejected alternatives, two publishable measurements, four audited failures,
limitations, status-labelled future work and source boundaries. The reusable reading and
publication rules are locked in `docs/CASE_STUDY_CONTRACT.md`. Initial 390, 800 and 1440
structural captures pass with no overflow or page errors. The exact built output also passes
schema, content, build, accessibility, craft, transfer and deterministic scroll checks; the
scroll pass holds 16.7-16.8 ms p95 with no frames above 20 ms. The owner approved the pilot
by asking to begin Notes on 2026-08-30. This checkpoint still does not tick the combined
route-family item or start Phase 3.

**Notes review checkpoint, 2026-08-30:** `/notes/` now renders all twelve Errata at equal
weight and keeps general Posts as an explicit `Coming soon` shelf. All twelve
`/notes/[slug]/` routes render their concise audited Markdown, related project, any
publishable measurement, honest source boundary and previous/next paths. The reference lock,
route structure and evidence are in `docs/PHASE_2_NOTES_REVIEW.md`. The exact built output
passes the Notes capture, all article links, no-JavaScript, accessibility, craft, transfer
and deterministic scroll checks at 390, 800 and 1440 pixels. The owner then supplied the
About route decisions and asked work to continue. The combined route-family checklist item
stays unticked until all route reviews and owner visual approvals are complete.

**About review checkpoint, 2026-08-30:** `/about/` now renders the real portrait, casual
first-person introduction, one typed chronology with two education records and the current
role, three current-work lines and five operating rules. Its built-output capture passes at
390, 800 and 1440 pixels with zero overflow, browser errors or client scripts, and the full
route remains present without JavaScript. Reference limits and evidence are recorded in
`docs/PHASE_2_ABOUT_REVIEW.md`. Resume followed as the next review slice; this does not tick the
combined route-family item or begin Phase 3.

**Resume review checkpoint, 2026-08-30:** `/resume/` now emits a semantic HTML CV from one
validated resume profile plus the shared experience, education, work and claim collections.
The supplied Resume B PDF is served unchanged as the stable download. An optional
`PUBLIC_RESUME_GOOGLE_DRIVE_URL` adds a separately labelled HTTPS Drive link at build time;
there is no embed or runtime fetch. The final route capture passes at 390, 800 and 1440
pixels, the no-JavaScript document remains complete, the local PDF returns the expected byte
length, and the inspected print proof is two clean A4 pages. Evidence and the stale-PDF-claim
boundary are recorded in `docs/PHASE_2_RESUME_REVIEW.md`. Hire followed as the next route
review; the combined route-family item remains unticked.

**Hire review checkpoint, 2026-08-31:** `/hire/` now renders the three typed service
records with explicit boundaries, a four-step risk-reduction path, balanced fit and
not-fit guidance, and direct booking, email and WhatsApp paths. The page contains no public
pricing, form, testimonial, client logo, urgency claim or client script. Built-output
captures pass at 390, 800 and 1440 pixels with zero overflow or page errors, and the full
route remains available without JavaScript. The configured Cal.com and WhatsApp URLs also
returned HTTP 200 during read-only checks. Evidence and reference limits are recorded in
`docs/PHASE_2_HIRE_REVIEW.md`. All route structures now have review implementations; owner
visual approval and the shared token, state and contrast closeout remain before the Phase 2
gate can run.

**Phase 2 gate result, 2026-08-31:** the owner accepted the current route designs as the
review baseline and deferred further polish. The shared system now names paper, ink, type,
spacing, grid, focus, motion and world roles. The consolidated gate passed all eight route
families at 390, 800 and 1440 pixels, plus no-JavaScript, reduced-motion, touch-menu,
keyboard-focus, contrast, font-budget and static-boundary checks. The lowest paper contrast
is quiet ink at 4.88:1. Representative captures were inspected. Exact evidence and commands
are in `docs/PHASE_2_GATE.md`. Phase 2 is complete; the acceptance does not claim that the
deferred visual-polish pass is complete.

**Owner review before work**

- Show a reference lock for the paper system, dark world system, editorial notes and
  conversion page.
- Show low-fidelity page structures for all route families at phone and desktop widths.
- Review one route at a time, beginning with the landing page. Within that route, group
  related questions around rendered evidence instead of mixing unrelated pages together.
- Home and `/work` have completed their Phase 2 structure reviews. The register remains one
  merit-based catalogue without a Personal/Company split. The next review slice is the
  shared `/work/[slug]` case-study structure, using BeatMind as the real-content pilot.
- The BeatMind paper pilot now has its complete contract and final 390, 800 and 1440
  built-output evidence. The owner approved it by asking to begin Notes. Real trace and standalone
  audio inputs belong to the separate Sound Foundry world, not the paper page.
- The owner approved the **Sound Foundry** premise, nine-scene order and current five-stem
  language on 2026-08-30. A replacement standalone animatic now tests the continuous machine,
  failure/retry interruption, separate phone composition and a dark case-study handoff. It has final 390,
  800, 1440, no-JavaScript and reduced-motion evidence and remains outside the Astro build.
  It does not authorize Phase 5 or tick its implementation checklist. Real separated-track
  envelopes, analysis markers, a publishable failure trace and an approved audio excerpt
  remain blocked inputs.
- The landing arrival clarity pass keeps the approved headline and two doors, identifies Parth
  in normal reading text, and explains that projects move from paper to a world to a case study.
  Its contained BeatMind plate carries the same three-step grammar over a 67 KB static frame
  captured from the approved Sound Foundry animatic. Final built-output evidence at 390, 800
  and 1440 pixels is in `.shots/phase2-arrival-world-still-built`; this refinement does not
  start Phase 3 or add landing-page canvas motion.
- Notes, About, Resume and Hire are accepted as the current review baseline. Further visual
  polish is intentionally deferred and does not reopen the completed Phase 2 gate by itself.

**Do**

- [x] Define tokens for paper, ink, type, spacing, grid, focus, motion and world surfaces.
- [x] Self-host and subset Bricolage Grotesque, Archivo and DM Mono. The four approved
  WOFF2 files total 55,916 bytes and loaded in rendered phone and desktop review pages.
- [x] Define the reusable paper primitives without copying `paper.html` line by line.
- [x] Define route wireframes and content hierarchy for home, work, case study, notes hub,
  note article, about, resume and hire.
- [x] Define responsive, keyboard, touch, reduced-motion and no-JavaScript states.
- [x] Define the visual treatment for “Coming soon” so it is honest and useful, not an
  empty card.
- [x] Run rendered contrast checks on the actual paper stock and world ground.

**Gate**

- Tokens exist before page components.
- Reference lock and route structures are approved by the owner.
- Stub renders at 390px, 800px and 1440px have no overflow, clipped text or unreadable
  contrast.
- Fonts remain within the recorded budget.
- No tear, backlight or animated world has been implemented.

**Gate: passed 2026-08-31.** Evidence: `docs/PHASE_2_GATE.md` and
`.shots/phase2-gate-final`. Stop before Phase 3.

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

**Gate**

- Build, type, accessibility, screenshot, link and craft checks pass.
- Every emitted HTML page is enumerated and readable with JS disabled.
- Canonical, Open Graph, JSON-LD, sitemap, RSS and 404 output are verified.
- The ten-second test passes on the built site.
- The complete static site is deployed to a verified preview alias, not the production
  domain.

Show the route matrix, screenshots, command output and preview evidence, then stop.

### Phase 4: Paper signature, backlight and tear

This phase perfects the transition between paper and world without making it navigation.

**Owner review before work**

- Show two or three motion studies built from the real paper stock and a real world still.
- Compare tear seam, paper weight, exit direction, backlight strength, hover dwell and the
  coarse-pointer equivalent.
- Get explicit approval for one study before production implementation.

**Motion-study checkpoint, 2026-09-01:** `design/directions/phase-4-paper-transition.html`
compares Row Rip, Edge Peel and Sheet Fault with the real paper stock and approved BeatMind
world still. All three were captured at 390, 800 and 1440 pixels, including preview, mid-tear,
final and reduced-motion states. The capture gate found zero overflow or browser errors and
zero tear pieces under reduced motion. Fresh-page measurements keep Row Rip at 16.7-16.8 ms
p95 at all three widths; Sheet Fault rises to 83.3 ms at 800 pixels and 166.7 ms at 1440
pixels, so it is not a production candidate in its current form. Evidence and the comparison
are recorded in `docs/PHASE_4_MOTION_STUDIES.md` and `.shots/phase4-motion-studies/`.
The owner selected Sheet Fault on 2026-09-01. Its expensive full-root snapshot mechanism was
rejected, not its visual idea. Production recreates the chosen full-sheet opening with two
transform-only paper panels and sanitized clones of only the selected rendered row. The
result retains the Sheet Fault composition while removing the source of the study's broad
repaint cost.

**Do**

- [x] Backlight an entry using that project's approved still frame by default.
- [x] Add low-cost motion only after it proves useful and remains within budget.
- [x] On coarse pointers, preview the entry nearest the viewport center without blocking
  normal scrolling.
- [x] Tear from the real rendered sheet or a faithful captured layer, not plain substitute
  stock.
- [x] Navigate to the real project URL. The visual transition never owns routing state.
- [x] Move focus to the destination heading and preserve a correct back-navigation target.
- [x] Skip the tear under reduced motion and when enhancement fails.
- [x] Keep all hidden controls out of the tab order and accessibility tree.

**Production checkpoint, 2026-09-01:** `npm run phase4:gate` passes the static-site gate and
the Home plus `/work` enhancement at 390, 800 and 1440 pixels. All six transition paths
measure 16.7-16.8 ms p95 with zero overflow or browser errors. Pointer, keyboard, centred-row
touch, reduced motion, no-JavaScript, forced-failure, real-route focus and Back restoration
checks pass. Responsive images are in `.shots/phase4-production/`. The shipped client cost is
5,184 bytes of transition JavaScript and 5,950 bytes of transition CSS before compression;
no runtime dependency was added. Reverting commit `9d195b0` in an isolated temporary worktree
and rerunning `npm run phase3:static-gate` also passes, proving the Phase 3 rollback target.

**Gate**

- Keyboard, pointer and synthesized touch paths pass at all three viewports.
- Reduced motion moves directly to the destination with a composed final frame.
- A temporary-worktree `git revert` leaves the Phase 3 site fully functional.
- Performance and screenshot checks pass with the enhancement enabled and disabled.
- Owner accepts the final paper, hover/backlight and tear behavior, or explicitly records a
  waiver of personal render inspection.

**Gate: passed and owner-closed 2026-09-01.** The automated, responsive, resilience and
independent-revert evidence is recorded in `docs/PHASE_4_GATE.md`. The owner explicitly
waived personal inspection of the final renders and directed promotion; do not describe that
waiver as a render review that occurred. Stop before Phase 5.

### Phase 5: World foundation and BeatMind pilot

Worlds are scroll-directed product stories, not looping hero decoration and not miniature
copies of the real products. Native document scroll advances a bounded visual stage. The
world's own narration and final frame remain understandable without animation, then one
explicit action opens the separate complete paper case study.

**Owner review before work**

- Approve the shared world grammar and BeatMind storyboard before code.
- Review each BeatMind scene: ingest, separation, analysis, arrangement/mix, render,
  failure and retry, measurement and boundary.
- Decide which real audio excerpt may ship and its licence. Sound is always user-initiated.

**Do**

- [ ] Build one shared world lifecycle: clock, visibility pause, resize, reduced motion,
  static-frame fallback and cleanup.
- [ ] Define a data contract that separates project facts from drawing code.
- [ ] Implement BeatMind from real envelope and job-trace data.
- [ ] Make scrolling demonstrate the product story without requiring interaction.
- [ ] Offer listening only through an explicit labelled control; never autoplay audio.
- [ ] Keep mixing and rendering as a narrative demonstration, not a fake production editor.
- [ ] Record measured frame rate, bundle cost and teardown behavior.

**Gate**

- BeatMind tells a coherent story with canvas removed, JS disabled and reduced motion enabled.
- The visual sequence uses only verified project data.
- The shared engine holds the 30fps ceiling, pauses off-screen and stops on page hide.
- The foundation and BeatMind commits revert independently to the Phase 4 site.
- Owner approves the full scroll story on phone, tablet and desktop.

Show the storyboard comparison, measurements and gate output, then stop.

### Phase 6: Remaining worlds, one reviewed story at a time

Follow the waves in `WORLDS.md`. Each world repeats this loop:

1. Show the real-data inventory and unresolved claims.
2. Present the scroll storyboard and static final frame.
3. Ask the owner the project-specific questions.
4. Build only after approval.
5. Review phone, tablet, desktop, keyboard, reduced-motion and no-JavaScript output.
6. Commit the world alone and tick its plan item in that commit.
7. Run its revert and performance gates before starting another world.

- [ ] Vivid
- [ ] Tathya
- [ ] MedRAG
- [ ] Order Supervisor
- [ ] QueryPilot
- [ ] SecondSelf
- [ ] OncoVerse
- [ ] UPI Fraud Engine
- [ ] Spur Chat
- [ ] Fraud Risk Intelligence
- [ ] Oracle Auto Provision

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
- QueryPilot still needs a useful product capture before its world ships. Vivid now has one
  real browser capture and a real evaluation sequence in its paper case study; world media
  approval remains a separate gate.
- The owner decided that no price or price band appears anywhere on the public site.
