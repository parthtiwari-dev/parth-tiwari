# Build-session prompt

Use this prompt in a fresh session while the Vivid Phase 6A production gate remains open.

```text
Read these in order before taking action:

1. docs/RULES.md
2. docs/DESIGN_LOCK.md
3. docs/WORLDS.md
4. docs/BUILD_PLAN.md
5. docs/CONTENT_PROVENANCE.md
6. docs/DECISIONS.md
7. docs/PHASE_5_DATA_AUDIT.md
8. docs/PHASE_5_GATE.md
9. CLAUDE.md

Begin with git status and diff. Preserve all current work.

The portfolio is Paper and Worlds on Astro 7.2.9 with static output and one direct runtime
dependency: Astro. Phases 0, 1, 2 and 4 are closed. Phase 3 route implementation is present
and its automated static gate passes, but its owner visual review, five-person comprehension
test and verified preview deployment remain open. The owner authorized Phases 4 and 5 under
an explicit work-order exception; this does not close Phase 3.

Phase 5 now has a shared validated world foundation and the BeatMind Precision Descent world
at /work/beatmind/world/. Home and /work enter that world first. Its final primary action
opens the complete canonical paper case study at /work/beatmind/. Projects without a
published world continue directly to their paper case studies.

The BeatMind world uses a sanitized committed artifact exported from application state
ca55ad8. It contains real source and five-stem envelopes, BPM, key, sections and downbeats.
No correlated publishable failure/retry trace was available, so those scenes are omitted.
No cleared audio excerpt and licence record exist, so the world has no audio element or
media request. Never replace either omission with invented or inferred data.

The developer-only exporter exists only in the BeatMind repository on isolated branch
codex/portfolio-world-export at 30cab81. BeatMind hulk remains aligned with origin/hulk. The
exporter has not been pushed or deployed and must not be merged into a product branch without
a separate deliberate decision.

The Phase 4 Back-navigation regression is repaired. pagehide/pageshow reset stale transition
state, restore exact row focus and scroll position, and leave zero torn panels or previews.

npm run phase5:gate passes all prior content/static/Phase 4 checks and the Phase 5 responsive,
data/privacy, no-JavaScript, reduced-motion, forced-Canvas-failure, lifecycle, transfer,
print and Back-restoration checks. The BeatMind and foundation commits also pass independent
revert proofs. Evidence is in .shots/phase5-beatmind-world/ and docs/PHASE_5_GATE.md.

The owner approved BeatMind at 390, 800 and 1440 pixels on 2026-09-02, closing Phase 5.
Phase 6A is limited to Vivid's Story Loom. It uses a cleared Kyoto pottery evaluation anchor
and four frames, states its missing pose-comparison boundary in text, and explicitly retains
the unresolved commercial model-licence boundary. Complete its fresh gate and owner review
before beginning any other world. Do not push, merge or deploy without a separate explicit
instruction.
```

## Drift checks

Stop the session if:

- a public claim or animated value has no provenance record;
- BeatMind product-branch work is proposed as required production application code;
- an omitted trace or audio excerpt is replaced with invented data;
- Phase 5 is described as open despite recorded owner visual approval;
- another Phase 6 world begins before Vivid's gate and owner review;
- a gate is described as passing without current output.
