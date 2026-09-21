# Phase 6: first paired world batch

**Current owner authorization, 2026-09-09:** Build both complete illustrated worlds,
sequentially without agents. This supersedes the finite-proof proposal and historical
pauses below. Active previews are MedRAG / The Theatre of an Answer and SecondSelf /
A Little Further, Together. Versioned realistic alternatives are preserved. Read
docs/ILLUSTRATED_WORLDS_DELIVERY.md (ILLUSTRATED_WORLDS_DELIVERY.md from docs) for implementation
and verification. No production cutover is implied by local preview completion.


## Current checkpoint: generated animated worlds, 2026-09-08

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

Opened 2026-09-07 on `world/batch-1`, from `main` at `a051c02`.

## Owner-approved execution

The owner approved seven remaining worlds first, reimagining their treatments while keeping
their verified product stories. Fraud Risk Intelligence and Oracle Auto Provision remain
deferred and route-less. Each pair gets storyboard review before production coding, two
isolated implementation agents, sequential integration, and a separate revertable commit
and rendered acceptance for each world. This replaces the older one-world-at-a-time work
order without waiving any evidence, accessibility or owner-review gate.

| Batch | Worlds | Creative research brief |
| --- | --- | --- |
| 1 | MedRAG, Order Supervisor | The Unwritten Answer; The Night Watch |
| 2 | QueryPilot, SecondSelf | The Proof Press; The Unsent Letter |
| 3 | OncoVerse, UPI Fraud Engine | The Unfinished Atlas; The Narrow Gate |
| 4 | Spur Chat | The Broken Line, then complete integration checks |

Only the first two premises were selected as storyboard bases. Later titles are research
briefs, not approved storyboards. Major projects get about 5–7 scenes; focused projects
get 3–5. Shared lifecycle does not mean shared visual composition.

## This checkpoint

- [x] Inspect clean `main`, its merge history and the prior saved evidence.
- [x] Create isolated local batch and per-world worktrees.
- [x] Refresh the baseline `phase6:tathya-gate`: exit 0 on 2026-09-07, including
  content/static checks, Sheet Fault, BeatMind, Vivid and Tathya.
- [x] Build and inspect both standalone storyboards at 390/800/1440.
- [ ] Owner selects the rendered storyboards for production.
- [ ] Implement and validate each production world in an independent commit.
- [ ] Prove independent removal and run the combined regression gate.
- [ ] Owner accepts each rendered production story.

No MedRAG or Order Supervisor world is published by this storyboard checkpoint.

## Existing-world closeout

Preserve BeatMind. Preserve Vivid's Story Loom and its real Kyoto frames, text-only missing
failure comparison and unresolved commercial-model licence boundary. Tathya retains The
Long Table and its 2026-09-04 public snapshot. Do not reopen their concepts.

Fresh baseline captures confirm Tathya's bright slips behind mobile narration and faint
binding cords. The bounded fix gives Tathya's narration an opaque centre with feathering
outside the text area and makes the loose cord more legible. The capture gate now samples
the actual strike and settled frame instead of only 220ms after scene selection. Post-fix
evidence is recorded below; owner review stays separate.

## Evidence rules

MedRAG uses `ragas_results.json` at `a741897`: query 1 has eight retrieved chunks and
three cited; query 7 also retrieves eight but cites none and refuses. Four of twenty
recorded queries refuse. These counts do not establish chunk identities, embedding
coordinates, medical answer text or clinical safety. Motion duration is editorial.

Order Supervisor uses source at `ba544e0`. Completion recommendations are advisory;
terminal events, manual termination or max age own completion. Its business-action methods
record activity-log rows, not external messages. The world is a labelled source-behavior
demonstration, not a recorded order or measured recovery run.

The owner accepts explicitly labelled committed source demonstrations and safe fixtures
where runtime traces do not exist. SecondSelf must exclude private applications, email,
knowledge entries and Telegram content. OncoVerse defaults to committed 2D assets, with
content completeness separate from medical review. UPI gets a keyboard/touch threshold
control only if actual scores or threshold records support every displayed value; otherwise
show documented operating points. Spur must not fabricate a successful live reply.

## Integration ownership and gate

World agents own only their assigned study/world component, renderer, scoped styles, still,
artifact and study document. The coordinator owns schemas, loader, explicit route dispatch,
package commands, shared lifecycle, prior-world fixes and live documentation. Shared edits
are integrated sequentially with each world. No new runtime dependency or product request.

Each production world must keep complete static DOM, final still, paper handoff, no-JS,
reduced-motion, failed-canvas and print states; native scrolling, visible focus, Back
restoration, resize and hidden-page cleanup; measured 30fps/50ms and 30kB gzip JS budgets.
Inspect actual arrival, turn, ending and mid-event frames. Run one combined regression
after the pair and prove either world can be reverted without removing another world or
its paper case study. Unsupported data may not be replaced with plausible graphics.

## Deferred work

Phase 3 owner review, real comprehension test and preview verification remain open.
Paper redesign, the two deferred case studies, CMS, analytics and Phase 7 cutover are not
this batch. No push, merge to `main`, or deployment is authorized by the batch instruction.

## Local review

Run `node scripts/world-study-server.mjs` and open `http://127.0.0.1:4327/`.
The local review server keeps study files outside the Astro route set and also serves built
Vivid/Tathya pages for comparison. Storyboard and production review are separate checkpoints.

## Saved evidence: 2026-09-08

Both studies are integrated in this branch. The combined study capture completed with
exit 0 and 18 passing configurations. See [MedRAG](MEDRAG_WORLD_STUDY.md) and
[Order Supervisor](ORDER_SUPERVISOR_WORLD_STUDY.md). Tathya's post-fix focused metrics
have no failures and include strike/settled captures. The stronger narration scrim
conceals more artwork behind dense mobile copy; owner rendered review remains open.
Owner storyboard selection is next. No new production world routes were added.

### Fresh combined regression attempt

On 2026-09-08, `npm.cmd run phase6:tathya-gate` exited 1 at the Phase 4 Sheet Fault
performance check: desktop home p95 116.7ms and work p95 50ms exceeded its 34ms limit.
Static build, content, links, navigation, focus and fallback checks passed. The chain did
not reach the world gates on this attempt. This is not a combined regression pass, even
though the earlier baseline passed. Focused follow-up results are recorded separately.

The direct post-fix Tathya browser gate completed with exit 0 on 2026-09-08: all three
widths, no-JavaScript, reduced-motion, forced canvas failure and Back restoration passed.
Maximum measured draw cost was 6.1ms; the Tathya script measured 5,466 gzip bytes.

The isolated Phase 4 retry also exited 1: desktop home p95 83.4ms still exceeded 34ms;
desktop work passed at 33.4ms. Navigation/fallback assertions all passed. This is a
repeatable timing-gate failure in the current environment, with cause not established.
No threshold was relaxed and no unrelated Sheet Fault source was changed. Investigate
this before declaring the combined integration gate closed.

Order Supervisor Study II passed its final nine-configuration capture run on 2026-09-08
(exit 0), including eight active chapter assertions and idle-stop checks. Only the study
and review tooling changed in this revision; the prior Sheet Fault timing issue remains
open. MedRAG is paused; no agents were used for this revision.
