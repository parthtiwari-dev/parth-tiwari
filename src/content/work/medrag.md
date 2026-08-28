---
{
  "title": "MedRAG",
  "order": 4,
  "tier": "major",
  "effort": "substantial",
  "status": "shipped",
  "started": "2026-01",
  "startedSource": { "kind": "repository", "locator": "Evidence-Bound-Drug-RAG first Git commit", "public": false },
  "audience": ["employer", "client"],
  "summary": "A drug-information retrieval system designed to cite the evidence it has and refuse questions it cannot support.",
  "arrival": { "sentence": "The useful answer is sometimes a citation. Sometimes it is a refusal." },
  "whatItIs": ["MedRAG retrieves from a bounded collection of FDA and NICE drug documents and writes an answer with citations.", "When the retrieved evidence does not support the question, the system is designed to stop instead of filling the gap."],
  "problem": ["Medical language makes a fluent unsupported answer more dangerous, not more useful.", "The system needed a retrieval and refusal contract that could be evaluated separately from how confident the prose sounded."],
  "architecture": {
    "decision": "Make evidence sufficiency a gate before generation, and keep the cited source beside every supported answer.",
    "paragraphs": ["The pipeline combines lexical and semantic retrieval over a bounded corpus, reranks evidence, and produces cited answers only when the evidence clears the gate.", "Evaluation records faithfulness, relevance, context precision, and refusals as separate outcomes."]
  },
  "measurement": { "claimIds": ["medrag-refusals"] },
  "boundary": {
    "will": ["Answer from the indexed drug guidance and show citations.", "Refuse when the evidence boundary is not met."],
    "refuses": ["Diagnose a person or replace a clinician.", "Treat one internal evaluation as proof of medical safety."]
  },
  "whatBroke": {
    "title": "A good-looking answer was not enough",
    "paragraphs": ["Early evaluation focused too much on whether the answer read well. That did not establish whether the supporting context was present.", "I separated retrieval quality, answer faithfulness, and refusal behaviour so a smooth sentence could no longer hide a missing source."],
    "noteSlug": "medrag-refusal-is-a-feature"
  },
  "stackAndLinks": {
    "stack": ["Python", "FastAPI", "RAGAS", "ChromaDB", "BM25", "Streamlit"],
    "links": [{ "label": "View repository", "kind": "repository", "url": "https://github.com/parthtiwari-dev/Evidence-Bound-Drug-RAG", "verifiedAt": "2026-08-28" }]
  },
  "next": { "slug": "order-supervisor", "label": "Next: Order Supervisor" },
  "world": {
    "story": "One query finds cited neighbours in the evidence space; another lands outside the supported radius and ends in a visible refusal.",
    "dataSources": ["recorded evaluation cases", "retrieved document identifiers", "project embeddings exported at build time"],
    "storyboardStatus": "prototyped",
    "motionDeferred": true
  },
  "claimRefs": ["medrag-refusals"]
}
---
