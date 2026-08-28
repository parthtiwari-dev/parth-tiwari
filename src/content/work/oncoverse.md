---
{
  "title": "OncoVerse",
  "order": 8,
  "tier": "major",
  "effort": "substantial",
  "status": "in-progress",
  "started": "2026-05",
  "startedSource": { "kind": "repository", "locator": "OncoVerse first Git commit", "public": false },
  "audience": ["employer", "client"],
  "summary": "A cancer education atlas that makes anatomy and disease progression visible while keeping every explanation inside a source boundary.",
  "arrival": { "sentence": "A visual atlas where the unsourced regions stay dim on purpose." },
  "whatItIs": ["OncoVerse is an educational atlas for patients, families, students, and educators.", "It connects anatomy and plain-language explanations to source-backed content rather than offering diagnosis or treatment advice."],
  "problem": ["Immersive health graphics can make thin content feel authoritative.", "The product needs to show what is sourced, what is incomplete, and what still needs medical review without letting visual polish erase those boundaries."],
  "architecture": {
    "decision": "Treat content status and medical review as data that controls what the atlas may reveal.",
    "paragraphs": ["Each directory entry carries structured content, source references, completion state, and review state.", "The visual layer must read those fields directly so incomplete or unreviewed material cannot accidentally look finished." ]
  },
  "measurement": { "claimIds": ["oncoverse-content-scope"] },
  "boundary": {
    "will": ["Explain sourced anatomy and cancer concepts in plain language.", "Mark incomplete and unreviewed content visibly."],
    "refuses": ["Diagnose, recommend treatment, or accept a medical report.", "Use three-dimensional polish to imply a finished medical product."]
  },
  "whatBroke": {
    "title": "The product shape got ahead of the content",
    "paragraphs": ["The atlas concept suggested a broad catalogue while the repository contained one complete entry and four stubs.", "I am keeping the current scope explicit. More anatomy is not a design task; it needs sourced content and medical review first."],
    "noteSlug": "oncoverse-one-complete-entry"
  },
  "stackAndLinks": {
    "stack": ["TypeScript", "structured medical content", "3D research", "source metadata"],
    "links": [{ "label": "View repository", "kind": "repository", "url": "https://github.com/parthtiwari-dev/oncoverse", "verifiedAt": "2026-08-28" }]
  },
  "next": { "slug": "upi-fraud-engine", "label": "Next: UPI Fraud Engine" },
  "world": {
    "story": "One sourced region becomes visible while incomplete regions remain dim and the medical-review boundary stays attached to the content.",
    "dataSources": ["atlas content JSON", "source metadata", "review-state fields"],
    "storyboardStatus": "specced",
    "motionDeferred": true
  },
  "claimRefs": ["oncoverse-content-scope"]
}
---
