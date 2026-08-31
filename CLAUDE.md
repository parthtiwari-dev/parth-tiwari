# CLAUDE.md

Working instructions for the Paper and Worlds portfolio rebuild.

## Read first

Read these files completely, in order, before changing the project:

1. `docs/RULES.md`
2. `docs/DESIGN_LOCK.md`
3. `docs/WORLDS.md`
4. `docs/BUILD_PLAN.md`
5. `docs/CONTENT_PROVENANCE.md`
6. `docs/DECISIONS.md`

`docs/RULES.md` is the operating contract. The other files settle design, world content,
sequence, claims, and architecture. If they conflict, stop and ask the owner rather than
quietly choosing one.

## Current stack

- Astro 7.2.9, exactly pinned
- static output
- strict TypeScript
- validated content collections established in Phase 1
- vanilla CSS for the locked Phase 2 paper system
- one direct production dependency: `astro`
- Playwright as development-only browser tooling

There is no Vue application, SPA rewrite, Three.js scene, canvas, Tailwind layer, analytics
runtime, or client-side router. The current Phase 2 root landing uses one small progressive
enhancement script for post-hero navigation and bounded paper-motion states; its complete
content remains static HTML.

## Phase protocol

- Work one phase at a time in `docs/BUILD_PLAN.md`.
- Before implementation, state the phase scope, exclusions, expected files, and unresolved
  owner questions.
- Do not begin work whose answer could materially change based on an unconfirmed fact.
- Run the named gate. A gate passes only from command or rendered evidence produced in the
  current work, never because it should pass.
- Show the gate result and stop. Do not begin the next phase without owner approval.
- Tick plan items and repair affected documentation in the same commit as the work.
- Keep each phase revertable. Preserve unrelated user changes.

## Truth and content

- Never invent a number, testimonial, client, user count, price, outcome, benchmark, link,
  deployment, or ownership claim.
- Every public claim must satisfy `docs/CONTENT_PROVENANCE.md`.
- Ask the owner when a required fact is not in the repository or cannot be verified safely.
- Never hardcode a project count in prose. Derive it from validated content.
- Verify every external link is public, authentication-free, intended for publication, and
  owned by the claimed project before shipping it.
- The production site URL has one source of truth.
- No em dashes in user-facing copy. Code comments and internal documentation are exempt.

## Accessibility and resilience

- The complete reading experience exists in static HTML.
- Canvas and animation may enhance a case study but may never carry required meaning.
- Hover interactions must also work by keyboard and touch.
- Reduced motion receives a deliberately composed final state immediately.
- One shared stylesheet owns focus-ring behavior once CSS exists.
- Measure rendered contrast. Do not infer it from color tokens.
- Never use `transition: all`.

## Browser verification

- Launch Chromium through `scripts/browser.mjs`; do not call `chromium.launch()` with an
  ad hoc configuration.
- Required review widths are 390, 800, and 1440 pixels.
- Browser checks accept `--url`; run them against the built static output for gates.
- Screenshots are evidence only when someone inspects them. A successful capture command
  does not prove the page looks correct.

## Current phase

- `npm run phase1:gate` runs negative schema tests, cross-content provenance checks and the
  static Astro build with telemetry disabled for restricted environments.
- `npm run phase3:case-batch-gate` validates exactly ten published case studies, exactly two
  deferred records, the static build, proof variants, chapter contracts, internal links and
  private-path exclusions.
- Phase 1 is complete under its owner-amended gate. The text-only human test was deferred,
  not passed, and may never be reported otherwise.
- Phase 2 closed on 2026-08-31. The maintained landing stub is on `/`; its structure and interim public
  release were owner-approved on 2026-08-29 and are live at
  `https://parth-tiwari-1.vercel.app/`. `/work` architecture is approved. The single
  `/work/beatmind/` Phase 2 paper pilot now follows `docs/CASE_STUDY_CONTRACT.md`, uses
  real product media and has final responsive, accessibility, craft, transfer and scroll
  evidence. The owner approved it by starting Notes on 2026-08-30. `/notes` and all twelve
  concise `/notes/[slug]` Errata now have final responsive, accessibility, craft, transfer,
  no-JavaScript and scroll evidence. `/about/` now has its
  real portrait, typed education-and-work chronology, current-role detail, operating rules
  and final 390, 800, 1440 and no-JavaScript evidence, and
  Resume followed as the next review slice. `/resume/` now has semantic HTML, the unchanged
  local Resume B download, verified project claims, an optional env-configured Drive link,
  final responsive/no-JavaScript evidence and an inspected two-page A4 print proof.
  `/hire/` now has the three typed service scopes, boundaries, a four-step risk-reduction
  path, fit guidance and direct booking, email and WhatsApp, with final 390, 800, 1440 and
  no-JavaScript evidence. The owner accepted all current route designs as the Phase 2
  baseline and explicitly deferred another polish pass. The 24-render route matrix plus
  no-JavaScript, reduced-motion, touch, keyboard, contrast, font-budget and static-boundary
  checks pass; `docs/PHASE_2_GATE.md` records the evidence. The owner approved
  BeatMind's Sound Foundry
  storyboard and current five-stem language on 2026-08-30; its standalone verified animatic
  is a Phase 2 review artifact only. Its dark ending and explicit case-study CTA are locked;
  no paper section appears below the world. Production route implementation remains Phase 3 and
  production world implementation remains Phase 5.
- Do not treat Phase 2 review stubs as the complete Phase 3 static site. Production tear,
  backlight, canvas and animated-world implementation remain in their assigned later phases.
- Phase 3B is active. `/work/[slug].astro` emits a static page for each project with a
  validated `caseStudy` object. BeatMind, Vivid and the approved eight-project batch satisfy
  that full paper contract. Fraud Risk Intelligence and Oracle Auto Provision remain
  explicitly deferred, non-clickable and route-less. `docs/CASE_STUDY_BATCH_AUDIT.md`
  records the batch source boundaries and current gate evidence.
  `docs/VIVID_CASE_STUDY_AUDIT.md` records the Vivid repository history, current
  proof, unachieved plan targets and update workflow. The Vivid source worktree is read-only
  portfolio evidence and its current Phase 4 changes must not be modified from this repository.

## Dependencies and external actions

- Before adding a public runtime dependency, record and approve its case in
  `docs/DECISIONS.md` as required by `docs/BUILD_PLAN.md`.
- Ask before deletion outside an already approved manifest.
- Ask before deployment, domain changes, paid services, messages, account changes, or other
  external writes unless the owner explicitly authorized that exact action.

## Documentation closeout

At the end of every material work session, follow `docs/RULES.md`:

- inspect every file under `docs/` for truth status;
- update every affected live document;
- keep historical documents explicitly marked superseded;
- update `docs/README.md` and the active checklist;
- report anything that remains unverified or intentionally deferred.

Do not call work complete while the source, commands, checklist, and live documentation tell
different stories.
