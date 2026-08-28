---
{
  "title": "Tathya",
  "order": 3,
  "tier": "flagship",
  "effort": "flagship",
  "status": "in-progress",
  "started": "2026-07",
  "startedSource": { "kind": "repository", "locator": "Tathya first Git commit", "public": false },
  "audience": ["employer", "client"],
  "summary": "A sourced public record that groups what institutions and publishers said without turning the system into a judge.",
  "arrival": { "sentence": "Sources arrive, claims form, and the system stops before telling you what to think." },
  "whatItIs": ["Tathya collects material from official and editorial sources and organises it into cited case files.", "The reader can inspect the source trail instead of receiving a synthetic truth score."],
  "problem": ["Summarisation systems are rewarded for collapsing disagreement into one answer. Political records often need the opposite: sources kept distinct, dates preserved, and uncertainty left visible.", "The product has to remain useful without silently ranking publishers or manufacturing a verdict."],
  "architecture": {
    "decision": "Make the source and claim graph the product, and remove verdict generation from the contract.",
    "paragraphs": ["Collectors normalise source material into records, claims link back to citations, and case files group related evidence.", "Conflicting sources coexist. The interface can organise and quote them, but the final conclusion belongs to the reader."]
  },
  "measurement": { "claimIds": [], "absence": "No stable public corpus count or quality benchmark is published yet. The case study reports the architecture and its boundary without inventing a score." },
  "boundary": {
    "will": ["Show who said what and where it came from.", "Keep disagreement and missing evidence visible."],
    "refuses": ["Issue a true-or-false verdict.", "Rank sources or assign sentiment as a substitute for evidence."]
  },
  "whatBroke": {
    "title": "The first brief wanted a fact checker",
    "paragraphs": ["That framing pushed the system toward confidence scores and a final answer, even when the source material did not support one.", "I changed the product contract from deciding truth to preserving a sourced record. The unresolved part is now visible by design."],
    "noteSlug": "tathya-no-verdict"
  },
  "stackAndLinks": {
    "stack": ["Python", "FastAPI", "PostgreSQL", "source ingestion", "citation graph"],
    "links": [
      { "label": "Open Tathya", "kind": "live", "url": "https://tathya.vercel.app", "verifiedAt": "2026-08-28" },
      { "label": "View repository", "kind": "repository", "url": "https://github.com/parthtiwari-dev/tathya", "verifiedAt": "2026-08-28" }
    ]
  },
  "next": { "slug": "medrag", "label": "Next: MedRAG" },
  "world": {
    "story": "Source points settle into cited claim clusters while disagreements remain separate and the sequence ends without a verdict.",
    "dataSources": ["source registry", "claim records", "citation edges"],
    "storyboardStatus": "prototyped",
    "motionDeferred": true
  },
  "claimRefs": []
}
---
