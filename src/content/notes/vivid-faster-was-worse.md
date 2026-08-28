---
{
  "title": "The faster Vivid profile was worse",
  "type": "erratum",
  "publishedAt": "2026-08-28",
  "summary": "A large speed win failed the visual review that mattered.",
  "relatedProjects": ["vivid"],
  "claimRefs": ["vivid-turbo-evaluation"],
  "sources": [{ "kind": "artifact", "locator": "Vivid/evals/baselines/2026-08-phase2-turbo.json", "public": false }],
  "state": "published"
}
---

The Turbo profile was much faster in the recorded evaluation. It also lost character
identity, weakened text-scene alignment, and produced duplicate-person artifacts.

I kept the slower baseline in production. Timing is one part of the decision, not the
decision itself. The rejected profile remains in the record because removing it would hide
the most useful thing the evaluation discovered.
