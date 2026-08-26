# design/

Research and design decisions for the v2 rebuild. Opened 2026-08-26, Phase 0.

Everything a stranger's site, video, repo or thread taught us lands here rather than in a
chat log, because the chat log does not survive the session and this does. If a later
project needs the same groundwork, it starts from this folder instead of redoing it.

## Why this exists

v1 was a Three.js constellation portfolio. Every person shown it said they did not
understand it. The rebuild rule from [`../docs/REBUILD_BRIEF.md`](../docs/REBUILD_BRIEF.md)
§3 is that the creative layer must be deletable: build the clear site, ship it, then add one
creative layer in its own commit that `git revert` can remove without breaking anything.

That rule governs this folder too. Research is collected to inform a decision, and the
decision is written into [`../docs/DECISIONS.md`](../docs/DECISIONS.md) with its reason. A
finding with no decision attached is a note, not a commitment.

## Layout

```
design/
  research/
    youtube/           29 videos, ~10 hours, transcribed and mined
      INDEX.md         the catalogue, with the yt-dlp command to reproduce it
      text/            deduplicated plain text, one file per video
      notes/           one note per video: grade, method, prompts, values
      GROUP-*.md       cross-video syntheses
    skills-repos/      the GitHub design-skill repos, and what rules each encodes
      FINDINGS.md
      raw/             the SKILL.md files worth keeping offline
    reddit/            practitioner threads, filtered for people who do the work
      FINDINGS.md
    reference-sites/   the ~20 site sweep for DECISIONS.md §4.1-4.4
      FINDINGS.md
  directions/          the candidate design directions, and the demo of the chosen one
```

## Evidence discipline

Carried over from `parth-os`. Every claim in here is graded:

| Mark | Means |
|---|---|
| verified | the source was read or the page was loaded, and the claim is quoted |
| inferred | reasoning from what was seen, not something anyone stated |
| unverified | recorded because it was said, not because it was checked |

A quote with no working URL is dropped rather than kept. A video that turns out to be thin
is recorded as thin; padding it would make the folder worse than empty.

## What is deliberately not here

Raw WebVTT. `.gitignore` excludes it. It is 6.5 MB, it repeats every line up to three times
in the rolling caption window, and `research/youtube/INDEX.md` carries the exact command
that regenerates it. The deduplicated text is the artifact worth keeping.
