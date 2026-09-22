# Order Supervisor: The Night Watch

**Production, 2026-09-23:** owner approved Study II; ported to
`/work/order-supervisor/world/` on `world/integration`. Evidence: `WORLD_INTEGRATION.md`.
The study below remains the design record.

## Study II: Inside the mechanism, 2026-09-08

The owner rejected the first study's short, insufficiently immersive execution, retained
the watch premise, and explicitly requested a direct revision of Order Supervisor alone.
No agents are used. MedRAG is paused and its current treatment is rejected. The older
five-scene record below is retained as history, not the current build target.

### Reference lock and decisions

The existing Night Watch sculpture is the selected source to develop, following the
owner's request for a deeper mechanical journey. Refero's bundled motion guidance supplies
continuity and expressive, low-frequency narrative movement; the audited Pudding references
supply one persistent subject. There was no new live Refero research. This is a code-native
mechanical illustration, not a photoreal asset, real product screen or physical simulation.

| Decision | Source and purpose |
| --- | --- |
| Full-viewport mechanism with changing scale, rotation and framing | Owner's request to enter the watch; replaces the small beside-text instrument |
| Separated glass, bezel, housing, gear train and record | Existing watch concept; makes opening and descent visibly consequential |
| Eight chapters | Owner found five chapters too short; adds opening, persistent record and deliberate waiting |
| 2.8-second multi-stage scene events, then complete rest | Refero continuity guidance and source wait loop; timing is editorial |
| Delayed latch release and completion seal | Source authority boundary; a proposal cannot itself finish the workflow |
| Portrait top-stage composition, normal-flow fallback | Existing accessibility contract; no required meaning hidden in graphics |

### Current sequence

1. Enter the complete watch with a bounded establishing movement.
2. Lift the face and bezel away from the exposed movement.
3. Move closer to the continuous order record.
4. Turn the reasoning gears as an event arrives and a proposal appears.
5. Let the mechanism stop while the workflow stays open.
6. Move into the latch; the completion proposal approaches, contacts and rebounds.
7. A terminal event arrives, then the latch retracts and the completion mark appears.
8. Pull back to the final record and the engineering handoff.

Native scroll selects chapters; chapter links allow keyboard navigation and revisiting
sequences. Gear rotation, record travel, camera movement and completion changes share one
bounded 30fps scheduler. Reduced-motion changes, hidden pages and pagehide stop animation.
Every source claim remains in DOM. No new runtime dependency or production route is added.

Final revision validation: `node scripts/world-study-capture.mjs --slug=order-supervisor`
completed with exit 0 on 2026-09-08. All nine configurations passed: animation, no-JS and
reduced-motion at 390/800/1440. All eight active chapter indices were asserted; keyboard
handoff, local-only requests, zero errors, zero overflow and stopped idle draws passed.
The measured per-paint JS check stayed within 50ms; this does not measure complete browser
paint/compositor cost. Motion and settled captures are in `.shots/world-batch-1`.
Arrival, opening, latch contact, release and ending compositions were inspected. A clipped
mobile caption was corrected and the capture suite rerun. `git diff --check` passed.
No production integration, owner acceptance or full-site performance pass is claimed. Earlier 18-configuration
results cover Study I and must not be presented as evidence for Study II.

## Historical Study I

2026-09-07. **Standalone storyboard for owner review. Production is not implemented.**

The approved batch plan selects this premise as a storyboard base. The owner must see the
composed still, decisive motion beat and phone composition before production integration.
The study is isolated to `design/directions/order-supervisor-world.html` and its CSS/JS
companions. It has no production route, content registration or published world record.

## Research and reference lock

Used the repository's audited references in `PHASE_2_BEATMIND_WORLD_RESEARCH.md` and
`TATHYA_WORLD_STUDY.md`, plus Refero's local motion and craft guidance. This resumption
did not run a fresh live Refero search. The prior research supplies the following bounded
jobs; it is not evidence of new browser research.

| Decision | Source and bounded role | Application |
|---|---|---|
| One persistent subject | Pudding essays reviewed in the BeatMind research | The order record stays in one watch mechanism through all five beats. |
| Discrete event, then hold | Tathya's owner-reviewed rejection of crawling scroll-scrub | Scene selection starts a bounded 680ms editorial movement, then stops completely. |
| Recompose for portrait | Portrait/landscape precedent in the BeatMind research | Instrument above, narration below on phone/tablet; instrument right and narration left on desktop. |
| Material generated from code | Owner's Night Watch premise and source-behavior evidence policy | A watch aperture, paper record, proposal tongue and closure latch; no fake product screenshot. |
| Restrained source color | Committed product Tailwind `accent: #F5F0E8` | Pale neutral record and light; oxblood stays on the authority boundary. |
| Static semantic story | WORLDS and Refero accessibility guidance | All necessary claims, rule names and case-study link live in HTML. |

**Build target:** The Night Watch, a persistent lifecycle record in a dark mechanical aperture.
Preserve the circular engraved housing, continuous pale record, one short model-attention
sweep, proposal stopped outside the record, and reserved text zone. Bricolage is display,
Archivo is narrative, DM Mono is provenance. No colored dashboard, node-edge flowchart,
repeated feature cards, ticking clock, elapsed-time counter, random particles or idle drift.
The instrument is an explanatory metaphor, not the actual product UI or a simulated order.

## Source truth

Read committed Order Supervisor `ba544e0`, specifically `backend/temporal/workflow.py`,
`backend/agent/actions.py` and `frontend/tailwind.config.ts` on 2026-09-07.

- One workflow instance supervises an order. The initial agent cycle runs before its wait loop.
- The loop waits for pending events or its scheduled timeout, with interrupt and terminate
  handling. It snapshots events before the next agent cycle.
- `recommend_complete` does not independently complete the workflow.
- `delivered`, `refund_resolved` and `order_cancelled` are terminal event types. The
  source determines terminal presence, runs the agent cycle, then enters completion.
- Manual termination and maximum workflow age are separate completion paths. There is
  no universal human approval requirement.
- `_complete` persists the completion reason and invokes the final-summary activity.
- Business action functions write activity-log rows. They do not send to external services.

No recorded run, restart-recovery measurement, uptime, response time, actual customer,
order identifier or external-send outcome is claimed. Animation timing and ruling marks
are artistic composition, not data or runtime measurement. Source paths stay in this
internal study document; the preview contains only the short revision and boundary text.

## Five scenes

| Scene | Narration and visual turn | Held result |
|---|---|---|
| Record | “The model can sleep. The order stays open.” Establish the continuous record. | Quiet unclosed record; no moving clock. |
| Wake | An agent cycle starts, then waits. The watch sweep changes position and a proposal appears. | Proposal remains outside the record. Log-only action boundary in DOM. |
| Recommendation | The proposal approaches the oxblood closure latch and stops. | `recommend_complete` cannot end supervision by itself. |
| Terminal | A separate event arrives on the opposite side. The record's completion lines appear. | Terminal events are enumerated in DOM; manual/max-age alternatives remain explicit. |
| Authority | Event retracts, proposal stays outside, complete record holds. | Workflow owns the ending. Explicit engineering-story link. |

The default inline SVG is the final authority composition. With JavaScript disabled or
reduced motion, the stage is a normal-flow figure followed by all five concise chapters.
Under enhancement it is fixed in a reserved visual region, while ordinary document scroll
selects a scene. The graphic is decorative explanatory material; its text alternative
and the full narrative preserve the argument without it.

## Implementation and capture contract

- No dependencies, runtime product calls, audio, scroll capture or layout animation.
- One bounded requestAnimationFrame loop, capped at 30 draws/second. It stops after the
  transition, on document hide and on page hide. Returning restores the current scene.
- Scroll scene checks coalesce to one animation-frame callback and do not run an idle loop.
- Reduced-motion changes are handled live and produce the final composed frame.
- Capture hooks: `[data-study-stage]`, `[data-study-static]` (inline SVG),
  `[data-study-scene]` and `[data-study-ending]`. The scene index is `body.dataset.scene`.
- `window.__orderStudy` exposes draw count, active scene and bounded-loop running state
  for the development capture harness. This is not a production API.
- Expected review widths are 390, 800 and 1440. Inspect arrival, recommendation, terminal
  and ending, plus no-JavaScript and reduced-motion. Verify zero horizontal overflow,
  no overlap, keyboard handoff, no network requests beyond local assets, and idle draw stop.

## Coordinated browser checkpoint: 2026-09-08

The combined capture run passed all 18 configurations across both studies: animated,
no-JavaScript and reduced-motion at 390/800/1440. It checked scene count, heading,
overflow, local assets, console errors and keyboard handoff. Representative rendered
arrival, turning point, ending and fallback frames were inspected. Evidence is in
`.shots/world-batch-1`. This supersedes the capture-pending note above.
Full performance and rendered contrast measurement are not claimed by this storyboard
check. Owner storyboard selection remains open.

Final desktop handoff typography was reduced after image review so the replay link clears the chapter navigation. A focused 1440 capture verified the replay at y646-678 within the 900px viewport.

## Ending refinement after owner screenshot

The owner flagged both the watch and the last-screen layout. The final exploded offset
was incorrectly 0.25; it is now zero, so face and bezel fully register. The watch is
slightly smaller, the heading is shorter, the copy is reduced and the replay link is
secondary. Numeral backings prevent the top/bottom dial labels colliding with the record.
Focused captures at 1903/1440/390 verified chapter 8, no overflow and the reassembled
face. Mobile remains normally scrollable for the final links.
