---
{
  "title": "Spur Chat",
  "order": 10,
  "tier": "minor",
  "effort": "focused",
  "status": "take-home",
  "audience": ["employer", "client"],
  "summary": "A small streaming support assistant built to a take-home brief and bounded to one fictional brand's catalogue and policies.",
  "arrival": { "sentence": "A deliberately small support assistant that answers from one brand's material." },
  "whatItIs": ["Spur Chat was a take-home project for a fictional direct-to-consumer brand.", "It retrieves catalogue and policy context, then streams a bounded support response in the browser."],
  "problem": ["A generic assistant can answer smoothly while ignoring the catalogue and policy constraints it is supposed to represent.", "The useful scope was narrow: show retrieval, response streaming, and a visible boundary without pretending the exercise was a deployed client system."],
  "architecture": {
    "decision": "Keep retrieval scope visible beside the streamed answer.",
    "paragraphs": ["The client sends the support question, the backend retrieves the relevant brand material, and the response streams with that scope attached.", "The public story names the project as a take-home and makes no user, client, or production-scale claim." ]
  },
  "measurement": { "claimIds": [], "absence": "No benchmark, user count, or production support volume was recorded for this take-home project." },
  "boundary": {
    "will": ["Answer from the supplied catalogue and policy material.", "State that the work was a take-home exercise."],
    "refuses": ["Imply that the fictional brand was a client.", "Add a usage number that was never measured."]
  },
  "whatBroke": {
    "title": "The deployment outlived its backend",
    "paragraphs": ["A previous capture showed a polished client while the backend was unavailable, which made the link over-promise the working product.", "The live URL is kept only because it returned successfully during this audit. Phase 3 must test the complete interaction before calling the demo functional."],
    "noteSlug": "spur-demo-needs-an-end-to-end-check"
  },
  "stackAndLinks": {
    "stack": ["TypeScript", "streaming responses", "retrieval", "web client"],
    "links": [
      { "label": "Open take-home", "kind": "live", "url": "https://support-core-nine.vercel.app", "verifiedAt": "2026-08-28" },
      { "label": "View repository", "kind": "repository", "url": "https://github.com/parthtiwari-dev/support-core", "verifiedAt": "2026-08-28" }
    ]
  },
  "next": { "slug": "fraud-risk-intelligence", "label": "Next: Fraud Risk Intelligence" },
  "world": {
    "story": "A question arrives, the permitted catalogue scope appears beside it, and the answer streams without leaving that boundary.",
    "dataSources": ["take-home brief", "catalogue records", "retrieval trace"],
    "storyboardStatus": "specced",
    "motionDeferred": true
  },
  "claimRefs": []
}
---
