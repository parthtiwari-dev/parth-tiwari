---
{
  "title": "BeatMind",
  "order": 1,
  "tier": "flagship",
  "effort": "flagship",
  "status": "live",
  "started": "2026-07",
  "startedSource": { "kind": "repository", "locator": "BeatMind first Git commit", "public": false },
  "audience": ["employer", "client"],
  "summary": "A music workspace that separates a song, understands its structure, lets people rearrange it, and survives failed workers.",
  "arrival": { "sentence": "A song goes in whole and comes back in parts you can actually work with." },
  "whatItIs": [
    "BeatMind is a browser-based music workspace for separating a track into stems, reading its musical structure, arranging sections, mixing the result, and rendering a new version.",
    "The visible editor is only half the product. Under it is a long-running pipeline built to keep its state honest when remote workers fail or return late."
  ],
  "problem": [
    "Audio generation jobs do not finish inside a normal request. Separation, analysis, arrangement, and rendering each have different runtimes and failure modes, so a single loading screen quickly becomes a lie.",
    "The hard problem was deciding which system owns each stage, how retries remain idempotent, and what the person sees after a refresh or interrupted worker."
  ],
  "architecture": {
    "decision": "Treat every expensive stage as durable work with its own state, attempt identity, and recovery path.",
    "paragraphs": [
      "The web application owns projects and user-facing state. Independently deployed Python services own generation, separation, analysis, and rendering.",
      "Attempt tokens fence late callbacks, operation locks stop duplicate expensive work, and the UI reveals completed layers instead of inventing cosmetic progress."
    ]
  },
  "measurement": { "claimIds": ["beatmind-current-tests", "beatmind-separation-benchmark"] },
  "boundary": {
    "will": ["Show durable job state and recovery truthfully.", "Let a person hear and edit the separated result."],
    "refuses": ["Call a timed-out browser request a failed remote job.", "Publish account counts without the Clerk record and a counting definition."]
  },
  "whatBroke": {
    "title": "I removed a consent gate while cleaning up the upload flow",
    "paragraphs": ["A copyright confirmation looked like friction, so I deleted it. That made the interface cleaner and the product less responsible.", "The correction was to restore explicit consent and treat legal and user-trust constraints as product requirements, not optional copy."],
    "noteSlug": "beatmind-copyright-consent"
  },
  "stackAndLinks": {
    "stack": ["Next.js", "TypeScript", "Python", "PostgreSQL", "Modal", "Cloudflare R2"],
    "links": [{ "label": "Open BeatMind", "kind": "live", "url": "https://www.beatmind.tech", "verifiedAt": "2026-08-28" }]
  },
  "next": { "slug": "vivid", "label": "Next: Vivid" },
  "world": {
    "story": "Native scroll moves from one track through four separated stems, analysis, arrangement, render, a dead worker, and a successful retry.",
    "dataSources": ["real exported stem envelopes", "analysis markers", "durable job trace"],
    "storyboardStatus": "prototyped",
    "motionDeferred": true
  },
  "claimRefs": ["beatmind-current-tests", "beatmind-separation-benchmark"]
}
---
