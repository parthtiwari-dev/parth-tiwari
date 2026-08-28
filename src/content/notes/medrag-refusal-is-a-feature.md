---
{
  "title": "A refusal is part of the MedRAG result",
  "type": "erratum",
  "publishedAt": "2026-08-28",
  "summary": "Fluent answers initially received more attention than evidence sufficiency.",
  "relatedProjects": ["medrag"],
  "claimRefs": ["medrag-refusals"],
  "sources": [{ "kind": "artifact", "locator": "Evidence-Bound-Drug-RAG/data/evaluation/ragas_results.json", "public": false }],
  "state": "published"
}
---

Early evaluation made the answered cases look like the main event. In a medical retrieval
system, the unsupported cases matter just as much.

I separated retrieval quality, answer faithfulness, and refusal behaviour. A polished
sentence can no longer compensate for missing evidence, and the refusal stays visible as
an outcome rather than disappearing from the average.
