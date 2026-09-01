# Phase 5 BeatMind data and route audit

Recorded 2026-09-02 for the shared world foundation.

## Publication boundary

The BeatMind world uses one owner-reviewed, sanitized build artifact committed to this
portfolio at `src/data/worlds/beatmind-world-v1.json`. It contains analysis values and 256
fixed RMS/peak bins for the source plus vocals, backing vocals, drums, bass and other. It
contains no audio bytes and the public site performs no runtime data request.

The source application state was audited at BeatMind commit `ca55ad8`. The read-only export
tool is preserved separately at BeatMind branch `codex/portfolio-world-export`, commit
`30cab81`. BeatMind's local `hulk` branch was restored to `origin/hulk`; the exporter is not
part of that product branch and has not been pushed or deployed.

## Verified export

- Duration: `214.024` seconds.
- Analysis: `82 BPM`, `C# minor`, 12 sections and 69 downbeats.
- Signals: source plus five core stem lanes, with 256 RMS and 256 peak bins each.
- Normalization: one shared export scale, preserving relative signal levels.
- Failure/retry trace: unavailable because no explicitly correlated publishable trace was
  found. The two scenes are omitted rather than inferred.
- Audio: withheld because no standalone excerpt and licence record are cleared.

The sanitized artifact was scanned before integration. No UUID, email, private path, signed
or storage URL, raw prompt, raw error or audio payload is present.

## Route contract

The route resolver derives every project door from validated content:

- a project with a published world opens `/work/[slug]/world/`;
- a project without a published world opens its published paper case study;
- a project without either record remains non-clickable;
- the world ends with one explicit link to `/work/[slug]/` for the complete case study.

At this checkpoint BeatMind is the only published world. Static build output confirms that
Home and `/work` link BeatMind to `/work/beatmind/world/`, while the world and the BeatMind
paper page link to each other. No placeholder world route is emitted for another project.

## What the implementation proves

The foundation commit proves the content schemas, sanitized data contract, build-time
resolver and static route independently. The subsequent Sound Foundry implementation passes
`phase5:gate`: responsive animated composition, native scrolling, the 30fps ceiling,
off-screen/hidden-page pauses, restoration, cleanup, no-JavaScript, reduced-motion,
Canvas-failure and print fallbacks. Owner visual approval and the independent revert proof
remain the final Phase 5 closeout conditions.
