# CLAUDE.md

Working instructions for the Paper and Worlds portfolio rebuild.

## Current state, 2026-09-23

One line per item; the stories live in `docs/CHECKPOINT_HISTORY.md` and
`docs/WORLD_INTEGRATION.md`.

- Phases 0-2, 4 and 5 are closed. Phase 3 is built with its final checks open. Phases 7 and 8
  have not started.
- Worlds live on production: BeatMind, Vivid, Tathya, MedRAG, SecondSelf, QueryPilot, Order
  Supervisor and UPI Fraud Engine. The last five went live when `4acbfe8` was pushed from this
  machine on 2026-09-23; all five routes were verified live.
- The owner does not like Vivid and Tathya yet (flagged to revisit) and sees "a lot of room to
  improve" across the worlds, deferred to a later pass.
- No world yet: OncoVerse, Spur Chat. Deferred with no case study: Fraud Risk Intelligence,
  Oracle Auto Provision.

**Next:** the owner chooses between Phase 7 launch work (domain, social previews, analytics
decision, live ten-second test), the two worlds not yet designed (OncoVerse, Spur Chat) and
the improvement pass, including the Vivid and Tathya revisit. See `docs/SESSION_PROMPT.md`.

**Environment:** a global npm package `node@22.5.1` installed on 2026-09-22 shadows the
system Node 24.16.0 on PATH, and Astro 7 refuses to build under 22.5.1. Until the owner
removes it (`npm uninstall -g node`), run commands with `C:\Program Files\nodejs` first on
PATH.

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

There is no Vue application, SPA rewrite, Three.js scene, Tailwind layer, analytics runtime,
or client-side router. The current root landing uses small progressive-enhancement scripts
for post-hero navigation, bounded paper motion and the Sheet Fault route transition. The
BeatMind, Vivid and Tathya worlds use dependency-free Canvas2D on the shared
`/work/[slug]/world/` route and `src/scripts/world-lifecycle.ts`. The illustrated DOM/SVG
worlds (MedRAG, SecondSelf, QueryPilot, Order Supervisor, UPI Fraud Engine) each own a
dedicated `src/pages/work/<slug>/[world].astro` so their approved global CSS never shares a
page, and share `src/worlds/shared/lifecycle.ts`. Every world keeps its complete narration,
composed final state and case-study handoff in static HTML.

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
- Case-study mastheads also retain a 1920-pixel regression check for rendered title and proof
  collisions after the SecondSelf false-positive overflow gate found on 2026-09-01.
- Browser checks accept `--url`; run them against the built static output for gates.
- Screenshots are evidence only when someone inspects them. A successful capture command
  does not prove the page looks correct.
- `npm run worlds:parity [slug]` diffs an approved `design/directions` study against its
  production world at every chapter and width, and writes diff images for any frame that
  moved. Use it whenever a ported world changes.

## Gates

- `npm run phase1:gate` runs negative schema tests, cross-content provenance checks and the
  static Astro build with telemetry disabled for restricted environments.
- `npm run phase3:case-batch-gate` validates exactly ten published case studies, exactly two
  deferred records, the static build, proof variants, chapter contracts, internal links and
  private-path exclusions.
- `npm run phase3:static-gate` extends that proof to shared metadata, the Home route links,
  generated sitemap, RSS, 404 and removal of visitor-facing Phase 2 scaffolding copy.
- `npm run phase4:study-capture` renders the three non-production paper-transition studies
  at 390, 800 and 1440 pixels, checks overflow and browser errors, verifies reduced motion
  and records comparative frame timing.
- `npm run phase5:gate` reruns all earlier static and Phase 4 checks, then verifies the
  BeatMind world at 390, 800 and 1440 pixels across animated, no-JavaScript, reduced-motion,
  Canvas-failure, print, lifecycle, Back-restoration, privacy and transfer states.
- `npm run phase6:vivid-gate` runs `phase5:gate` then the Vivid Story Loom world gate.
- `npm run phase6:tathya-gate` runs `phase6:vivid-gate` then the Tathya Long Table world
  gate: the `provenance` guard (no `placeholder`), real case-file composition sums, feed
  `handPickedCount 0`, absent corpus benchmark, no `Math.random`, no `<audio>`, no runtime
  requests, animated / no-JavaScript / reduced-motion / Canvas-failure states, and the
  `/work` route with Back restoration at 390, 800 and 1440 pixels.
- `npm run phase6:worlds-gate` runs `phase6:tathya-gate` then every illustrated world spec in
  `scripts/world-gates/`: record, routing and claim checks, no em dash, chapter activation,
  controls, 30fps ceiling, idle stop, keyboard handoff, `world:destroy`, no-JavaScript,
  reduced motion, print, focus on arrival, Back restoration and the 30 kB script budget.
  With no published illustrated world it passes with nothing to prove, so each reverts alone.

## Rules carried from closed phases

One line each; the dated narratives they came from are in `docs/CHECKPOINT_HISTORY.md`.

- Phase 1's text-only human test was deferred, not passed, and may never be reported otherwise.
- Phase 3 stays open until the owner reviews the rendered mobile arrival and route matrix, the
  real five-person test runs and a verified preview deployment exists. Phases 4 onward ran under
  an explicit owner exception; that is not a Phase 3 pass.
- The owner waived personal render inspection of Phase 4; never report it as having occurred.
- BeatMind's world keeps its dark ending and explicit case-study action; no paper section appears
  below it, and `/work/beatmind/` stays the canonical case study.
- The Vivid source worktree is read-only portfolio evidence; never modify it from this repository.
- Tathya's paper case study keeps `claimRefs` empty and its `measurement.absence` line; its world
  data may never ship with `provenance: 'placeholder'` (see `docs/DECISIONS.md`).
- Non-blocking design leftovers: deckle-PNG regeneration, the UPI chart restyle and the
  wide-viewport paper-texture repaint cost (`docs/DESIGN_REFINEMENT.md`).

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
- report anything that remains unverified or intentionally deferred;
- keep "Current state" to one line per item and put the dated story in history
  (`docs/RULES.md` §8, rule 11).

Do not call work complete while the source, commands, checklist, and live documentation tell
different stories.
