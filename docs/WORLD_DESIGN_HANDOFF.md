# World design handoff

## Owner decisions — 2026-09-23

- Reviewed every world in the browser. Approved MedRAG, SecondSelf, QueryPilot, Order
  Supervisor and UPI Fraud Engine. Vivid and Tathya are not liked yet: revisit later.
- Integrate the approved previews now, pixel for pixel. This supersedes "finish designing
  first" below. Done on local branch `world/integration`; see `WORLD_INTEGRATION.md`.
- UPI Fraud Engine is an active world again; its figures are now verified against source.

## Owner decisions — 2026-09-09

- MedRAG / The Theatre of an Answer: owner says "I love them keep them". Preserve the
  illustrated HTML/CSS/JS and assets as the approved design.
- SecondSelf / A Little Further, Together: same approval. Preserve the illustrated design.
- Finish designing the remaining worlds first. Integrate the worlds into production in
  a later implementation pass; the owner may use Terra or Sol for that work. Do not switch
  models or start additional agents now.
- Owner delegated the choice between UPI Fraud Engine and QueryPilot. QueryPilot selected
  for its visible failure/correction story. Build a complete, distinct local world.

## Active design — QueryPilot / The Cartographer's Fold

Direction: a warm survey-paper atlas unfolds into ink-blue architectural districts.
Vermilion denotes a failed route; a redraw reconnects it. The question moves through the
map, but arrival only establishes execution, not semantic correctness. The map is an
editorial metaphor, never a reconstruction of query planning or actual database topology.

Reference lock: the owner's approved project-specific motion standard (Order Supervisor),
ustwo's Monument Valley architectural interaction premise (original architecture here,
no borrowed characters or levels), and Refero motion/typography craft. The Pudding's native
scroll progression supports the interaction lifecycle. Dominant look is tactile cartography,
not the theatre or coastal film scenes. Original generated paper is a texture; buildings,
folds, tracks and corrections are independently authored moving geometry.

Sources: https://ustwogames.co.uk/our-games/monument-valley/ and
https://pudding.cool/process/how-to-implement-scrollytelling/ plus local
.agents/skills/refero-design/references/motion.md and typography.md.

Evidence: reviewed QueryPilot case study and day6_full_results.json hard_001. The inspected
Day 5 correction file contains a successful separate run, not the rejected attempt implied
by older prose. Do not use it as a rejection trace. Do not fabricate intermediate SQL. Core
metric stays 63 to 67 of 70 execution successes, with 12 adversarial cases separate.

## Preserved state

QueryPilot's complete nine-chapter local design is built and passed its nine browser
configurations. Active URL: /design/directions/querypilot-world.html. Await owner design
review before treating it as approved. Gate and source notes: QUERYPILOT_WORLD_STUDY.md.

All work is local on world/batch-1. No deployment. No automatic compaction is claimed;
this file is the compact durable handoff for subsequent context or implementation work.
Approved prior worlds are not to be restyled during the QueryPilot build.
