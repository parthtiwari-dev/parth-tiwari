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
- vanilla CSS beginning in Phase 2
- one direct production dependency: `astro`
- Playwright as development-only browser tooling

There is no Vue application, SPA rewrite, Three.js scene, canvas, Tailwind layer, analytics
runtime, or client-side router in the current Phase 1 foundation.

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

## Current Phase 1 gate

- `npm run phase1:gate` runs negative schema tests, cross-content provenance checks and the
  static Astro build with telemetry disabled for restricted environments.
- The automated portion passes. The remaining gate is the five-person text-only test in
  `docs/TEN_SECOND_TEST.md`.
- An agent cannot simulate the participants or start Phase 2 before the owner approves the
  recorded result and the final hero sentence.

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
