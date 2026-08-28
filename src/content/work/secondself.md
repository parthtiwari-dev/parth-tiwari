---
{
  "title": "SecondSelf",
  "order": 7,
  "tier": "flagship",
  "effort": "flagship",
  "status": "running",
  "started": "2026-04",
  "startedSource": { "kind": "repository", "locator": "SecondSelf first Git commit", "public": false },
  "audience": ["employer", "client"],
  "summary": "An evidence-bound career system that prepares applications and stops at a human review queue before anything consequential is sent.",
  "arrival": { "sentence": "The system can prepare the application. It still has to wait for me." },
  "whatItIs": ["SecondSelf gathers job material, matches it against verified experience, and prepares an application packet.", "Outbound work enters a Telegram review queue, where a person can inspect and approve it."],
  "problem": ["Career automation is especially prone to turning weak evidence into confident claims.", "The hard part is not filling a form. It is maintaining one evidence contract across research, resume variants, generated answers, and the final action."],
  "architecture": {
    "decision": "Remove unsupported claims before drafting and make human review a durable state, not a pause in one process.",
    "paragraphs": ["Structured evidence feeds retrieval and drafting. A preparation record stores provenance, current stage, and the artifact awaiting review.", "Apply mode is deliberately gated. The system may automate preparation, but it does not get silent authority to represent me." ]
  },
  "measurement": { "claimIds": ["secondself-ragas"] },
  "boundary": {
    "will": ["Draft only from recorded experience and project evidence.", "Wait in a visible review queue before an outbound action."],
    "refuses": ["Invent a skill or result to improve a match.", "Describe human-gated apply mode as fully autonomous job application."]
  },
  "whatBroke": {
    "title": "Automation moved faster than the evidence",
    "paragraphs": ["Early flows treated a plausible answer as ready to send. That is the wrong threshold when the system speaks in my name.", "I moved evidence checks earlier and made the review queue a first-class state so unsupported material can be removed before an application exists."],
    "noteSlug": "secondself-human-gate"
  },
  "stackAndLinks": { "stack": ["Python", "PostgreSQL", "RAGAS", "Telegram", "browser automation"], "links": [] },
  "next": { "slug": "oncoverse", "label": "Next: OncoVerse" },
  "world": {
    "story": "Evidence enters, unsupported material drops away, a packet forms, and the sequence visibly waits at the human review queue.",
    "dataSources": ["evaluation log", "preparation state", "review queue events"],
    "storyboardStatus": "specced",
    "motionDeferred": true
  },
  "claimRefs": ["secondself-ragas"]
}
---
