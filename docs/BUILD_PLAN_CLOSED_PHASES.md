# BUILD PLAN: closed phases

Frozen text moved out of [`BUILD_PLAN.md`](BUILD_PLAN.md) on 2026-09-23 by the doc-hygiene pass,
so the live plan holds only current state and open work. This file holds the full owner-review lists, checklists (the original evidence markers), checkpoints and gate text of Phases 0, 1, 2, 4 and 5. Text is verbatim as it stood
in `BUILD_PLAN.md` at commit `9af2d16`; only heading levels inside each moved block are demoted
one step so they nest under this file's sections. It is history: never edit it to reflect
newer facts; the live plan states what is true now.

## Phases 0, 1 and 2 (full text at closure)

#### Phase 0: Clear the ground

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

#### Phase 1: Content and evidence, no design files

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

#### Phase 2: Design system and page architecture

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

**Deferred visual-polish pass, 2026-09-03:** the owner directed the deferred polish to run
as a nine-point refinement on branch `refine/design-system-9point`, in three build runs
plus a mobile-review run. It is permitted inside `DESIGN_LOCK.md`. All four runs are
complete and gate-green (`phase6:vivid-gate` 76 PASS, `a11y`, `perf:scroll`), each an
independently revertable commit: Run 1 foundations (black-flash, world-init resilience,
token layer, `--ink-quiet` 7.77:1); Run 2 wired the tokens in; Run 3 made the registers
span the full width and hardened the worlds and landing reveal; Run 4 brought the mobile
heading scale down. Scope, decisions and evidence: `docs/DESIGN_REFINEMENT.md`.
Outstanding, non-blocking: deckle-PNG regeneration, the UPI chart restyle, the
wide-viewport paper-texture repaint cost. `main` is untouched until the owner merges.

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

## Phases 4 and 5 (full text at closure)

#### Phase 4: Paper signature, backlight and tear

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

#### Phase 5: World foundation and BeatMind pilot

Worlds are scroll-directed product stories, not looping hero decoration and not miniature
copies of the real products. Native document scroll advances a bounded visual stage. The
world's own narration and final frame remain understandable without animation, then one
explicit action opens the separate complete paper case study.

**Owner review before work**

- [x] Approve the shared world grammar and BeatMind storyboard before code. The owner
  approved the Phase 5 plan on 2026-09-01 and selected Precision Descent.
- [x] Review each BeatMind scene: ingest, separation, analysis, arrangement/mix, render,
  failure and retry, measurement and boundary.
- [x] Decide which real audio excerpt may ship and its licence. No excerpt is currently
  cleared, so BeatMind starts with audio withheld and no media element.

**Do**

- [x] Build one shared world lifecycle: clock, visibility pause, resize, reduced motion,
  static-frame fallback and cleanup. The BeatMind pilot exercises the lifecycle and its
  teardown/restoration checks at all three target widths.
- [x] Define a data contract that separates project facts from drawing code. The shared
  world collection, versioned BeatMind data schema, build-time artifact loader and route
  resolver passed the static build on 2026-09-02; the animated lifecycle is proven by the
  automated world gate.
- [x] Implement BeatMind from real source/five-stem envelopes and analysis data. Failure and
  retry are omitted because no explicitly correlated publishable job trace exists.
- [x] Make scrolling demonstrate the product story without requiring interaction. Native
  vertical document scroll drives eight readable scenes without capture or snapping.
- [x] Keep audio honest. No excerpt is cleared, so the world emits no audio element or media
  request; the explicit-control requirement applies when a licensed excerpt exists.
- [x] Keep mixing and rendering as a narrative demonstration, not a fake production editor.
- [x] Record measured frame rate, bundle cost and teardown behavior. `phase5:gate` records a
  30fps ceiling, renderer draw cost, transfer by asset class and lifecycle cleanup.

**Gate**

- BeatMind tells a coherent story with canvas removed, JS disabled and reduced motion enabled.
- The visual sequence uses only verified project data.
- The shared engine holds the 30fps ceiling, pauses off-screen and stops on page hide.
- The foundation and BeatMind commits revert independently to the Phase 4 site.
- Owner approves the full scroll story on phone, tablet and desktop.

Show the storyboard comparison, measurements and gate output, then stop.

**Automated checkpoint, 2026-09-02:** `npm run phase5:gate` passes the earlier content,
static-site and Phase 4 suites plus the BeatMind world suite. Phone, tablet and desktop have
zero horizontal overflow. The world performs no runtime data or audio request; no-JavaScript,
reduced-motion, forced-Canvas-failure and print states remain complete. Independent revert
proof passes for both the BeatMind implementation and shared foundation. Owner visual
approval was recorded on 2026-09-02, so Phase 5 is closed. Phase 3's deferred owner review
remains separately open.
