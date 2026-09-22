# Illustrated worlds — full rebuild

**Production, 2026-09-23:** both worlds are ported to production routes; see
`WORLD_INTEGRATION.md`. This file remains the study delivery record.

2026-09-09. The owner authorized complete MedRAG and SecondSelf illustrated worlds,
superseding the earlier finite motion-proof recommendation. Work remains sequential,
without agents. The preserved realistic alternatives remain available unchanged.

## Reference and implementation decisions

The user-selected anime-influenced environment direction controls the art. The prior
research lock in WORLD_CREATIVE_DIRECTION.md supplies the process references: illustrated
storyboarding from The Boat and native-scroll graphic progression from The Pudding.
Original paintings are used as environments, with independent code-native moving layers.

MedRAG is The Theatre of an Answer: curtains part, eight pieces of scenery descend,
an abstract answer carries three citation marks, and a refusal leaves the centre empty.
The visitor can compare recorded queries 1 and 7. The numbered scenic objects are editorial
positions, not real chunk identities. No clinical advice or causal refusal claim is added.

SecondSelf is A Little Further, Together: the ambition to search and prepare like its owner
starts in a room, then a fictional companion follows an evidence trail into a coastal town
and returns with a packet. Search-path and evidence inspections accompany the journey.
Approve, revise, reject and reset are local rehearsals; no application or message is sent.
The character is a symbolic companion, not a depiction of the owner's physical likeness.

## Files and validation

Active previews: design/directions/medrag-world.html and secondself-world.html.
Shared native-scroll lifecycle: illustrated-scroll.js. Distinct world JS and CSS implement
stage reveals and lateral travel. Full semantic narration remains in HTML, including the
case-study handoff. Reduced motion and no-JS use an in-flow illustration and full narration.

Run scripts/illustrated-world-gate.mjs for both worlds at 390, 800 and 1440 widths, including
scroll progression, recorded-query controls, review rehearsal, idle rendering and fallbacks.
Evidence is written to .shots/illustrated-worlds. Do not infer a pass from this run command.

Final verification, 2026-09-09: scripts/illustrated-world-gate.mjs exited 0. All 18
configurations passed (2 worlds x 3 widths x animated/reduced/no-JS). Rendered captures
were inspected for MedRAG desktop citations and phone opening, plus SecondSelf desktop
search and review. The mobile navigation was moved below the header after inspection.
git diff --check passed; only pre-existing LF/CRLF conversion warnings were reported.
Original generated asset prompts are recorded in WORLD_ILLUSTRATED_ASSETS.md.

These are complete local review experiences. Public Astro route registration, production
cutover, and the historical Sheet Fault timing issue are separate and are not claimed closed.
