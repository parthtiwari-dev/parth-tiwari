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
  "caseStudy": {
    "reviewedAt": "2026-08-31",
    "classification": "Evidence-bound retrieval",
    "thesis": "MedRAG answers from a bounded drug-guidance corpus, keeps citations attached, and treats refusal as a valid result when the retrieved evidence is insufficient.",
    "credit": {
      "organization": "Personal project",
      "role": "AI engineer",
      "contribution": "I built the document parsing, chunking, vector and BM25 retrieval experiments, evidence gate, cited generation path, Streamlit surface, API, and the recorded 20-question RAGAS evaluation.",
      "contributionSummary": "Retrieval, evaluation, refusal policy, and application"
    },
    "cover": {
      "proof": { "kind": "record", "label": "Recorded evaluation", "title": "Evidence before answer", "sourceLabel": "Committed RAGAS run, 2026-02-03", "rows": [
        { "label": "Corpus", "value": "Bounded FDA and NICE drug guidance" },
        { "label": "Retrieval", "value": "Vector search with recorded cited chunks" },
        { "label": "Evaluation", "value": "20 questions", "tone": "pass" },
        { "label": "Refusals", "value": "4 recorded", "tone": "warn" }
      ] },
      "labels": ["Real evaluation record", "Committed main at a741897"]
    },
    "headings": {
      "overview": "The answer is allowed only inside the evidence boundary.",
      "problem": "Fluent medical prose is dangerous when the supporting context is missing.",
      "architectureCaption": "A bounded path from guidance document to cited answer or refusal",
      "evidence": "Four refusals are observed. They are not proof of clinical safety."
    },
    "intendedUser": "A reader exploring drug guidance who needs the supporting document context kept beside the answer and a visible stop when that context is not available.",
    "demo": {
      "kind": "record",
      "label": "Evaluation trace",
      "title": "One supported question, one refusal",
      "sourceLabel": "data/evaluation/ragas_results.json at a741897",
      "rows": [
        { "label": "Query 01", "value": "Common side effects of warfarin" },
        { "label": "Retrieved", "value": "8 chunks; 3 cited", "tone": "pass" },
        { "label": "Query 07", "value": "Ibuprofen with lisinopril" },
        { "label": "Retrieved", "value": "8 chunks; 0 cited" },
        { "label": "Outcome", "value": "Refused", "tone": "warn" }
      ],
      "caption": "This is a DOM rendering of the committed evaluation metadata, not simulated product UI. It shows the system's supported and refused paths without publishing medical advice."
    },
    "workflow": [
      { "title": "Bound the corpus", "description": "FDA and NICE documents are parsed into source-aware chunks before any question is answered.", "proof": { "kind": "record", "label": "Workflow record", "title": "Document boundary", "sourceLabel": "Committed ingestion and corpus source", "rows": [
        { "label": "Sources", "value": "FDA and NICE guidance" }, { "label": "Parsing", "value": "Document text with source metadata" }, { "label": "Output", "value": "Bounded chunks", "tone": "pass" }
      ] } },
      { "title": "Retrieve and test", "description": "Lexical and semantic paths were compared; hybrid retrieval was not accepted as automatically better because mixed context could contaminate an answer.", "proof": { "kind": "record", "label": "Retrieval record", "title": "Candidate evidence", "sourceLabel": "Committed retrieval scripts and evaluation", "rows": [
        { "label": "Candidate A", "value": "Vector retrieval" }, { "label": "Candidate B", "value": "BM25 lexical retrieval" }, { "label": "Risk", "value": "Hybrid context contamination", "tone": "warn" }
      ] } },
      { "title": "Answer or refuse", "description": "Generation is downstream of evidence sufficiency, and every supported response keeps citations attached.", "proof": { "kind": "record", "label": "Policy record", "title": "Evidence gate", "sourceLabel": "Committed generation and refusal path", "rows": [
        { "label": "Enough evidence", "value": "Generate with citations", "tone": "pass" }, { "label": "Insufficient evidence", "value": "Refuse", "tone": "warn" }, { "label": "Not allowed", "value": "Unsupported medical completion", "tone": "blocked" }
      ] } }
    ],
    "responsibilities": [
      { "label": "Corpus", "detail": "Source selection, parsing, chunking, metadata, and bounded retrieval context." },
      { "label": "Retrieval", "detail": "Vector and BM25 comparison, reranking experiments, evidence sufficiency, and citation retention." },
      { "label": "Evaluation", "detail": "Recorded RAGAS run, refusal observation, query metadata, and honest interpretation limits." }
    ],
    "research": [
      { "source": "FDA and NICE document boundaries", "finding": "The system can only support what its indexed guidance contains, regardless of how plausible a broader answer sounds.", "changed": "The corpus boundary and citation source became visible parts of the answer contract." },
      { "source": "Parsing and chunking experiments", "finding": "Document structure and source metadata affect whether retrieval returns a usable evidence unit.", "changed": "Parsing and chunk provenance were treated as retrieval architecture, not preprocessing trivia." },
      { "source": "Vector versus BM25 tests", "finding": "Semantic retrieval and lexical matching fail differently, while combining them can also introduce unrelated context.", "changed": "Retrieval methods were evaluated separately and hybrid contamination remained an explicit risk." },
      { "source": "RAGAS and refusal review", "finding": "Answer quality metrics do not replace an evidence-sufficiency decision for questions outside the retrieved support.", "changed": "Refusal became a first-class outcome and is reported separately from fluent answer quality." }
    ],
    "decisions": [
      { "decision": "Gate generation on retrieved support and retain citations.", "rejected": "Let the model answer from general knowledge when the bounded corpus is thin.", "tradeoff": "More questions end without an answer, while unsupported completion becomes less likely." },
      { "decision": "Evaluate retrieval and generation as separate surfaces.", "rejected": "Use one aggregate answer score as proof that the entire pipeline works.", "tradeoff": "The evaluation is harder to summarise, but failure location stays visible." },
      { "decision": "Keep hybrid retrieval as an experiment, not an assumed upgrade.", "rejected": "Merge semantic and lexical results and call the larger context better by default.", "tradeoff": "The selected path may miss useful context, while contamination is easier to reason about." }
    ],
    "architectureSteps": [
      { "label": "Guidance", "detail": "Bounded FDA and NICE documents with source metadata" },
      { "label": "Chunks", "detail": "Parsed evidence units stored for lexical and semantic retrieval" },
      { "label": "Retriever", "detail": "Selects and reranks candidate evidence for the question" },
      { "label": "Evidence gate", "detail": "Allows cited generation or returns a refusal" },
      { "label": "Evaluation", "detail": "Records per-query support, citations, refusal, and RAGAS metrics" }
    ],
    "failures": [
      { "title": "Readable answers hid weak support", "symptom": "An answer could sound complete even when the retrieved context did not establish it.", "cause": "Early review weighted prose quality more heavily than evidence sufficiency.", "correction": "Retrieval quality, faithfulness, citations, and refusal were separated into explicit outcomes.", "remainingRisk": "The recorded evaluation is internal and does not establish clinical safety." },
      { "title": "More retrieval could make context worse", "symptom": "Hybrid retrieval could add related-looking but unsuitable chunks to the answer context.", "cause": "Lexical and semantic results were combined without assuming every additional chunk improved support.", "correction": "Vector and BM25 behaviour were compared independently and contamination stayed visible in the decision record.", "remainingRisk": "The best retrieval policy is not proven across a larger medically reviewed test set." },
      { "title": "The application depends on external services", "symptom": "A committed local surface cannot be treated as a durable public demo without its model and retrieval services.", "cause": "Generation and evaluation use external model services beyond the static portfolio boundary.", "correction": "This page uses the committed evaluation artifact as the primary proof instead of fabricating a successful live answer.", "remainingRisk": "A fresh end-to-end local capture remains unverified in this batch." }
    ],
    "limitations": [
      "MedRAG is not clinically validated, is not a diagnostic tool, and must not replace a clinician or primary guidance.",
      "The 20-question internal evaluation is too small to establish broad medical reliability.",
      "The published refusal count is an observed outcome, not proof that every unsupported question will be refused.",
      "The local Streamlit application was not used as publication proof when external services could not be verified."
    ],
    "evidenceNote": "Only the 4-of-20 refusal observation is published here. Other aggregate metrics remain in the source artifact and are not promoted without separate claim records and interpretation review.",
    "future": [
      { "status": "planned", "title": "Clinician-reviewed evaluation", "detail": "Create a larger question set with reviewed support and refusal expectations before making stronger quality claims." },
      { "status": "investigating", "title": "Retrieval contamination tests", "detail": "Test vector, BM25, and bounded hybrid policies against cases where adjacent drug context could mislead generation." },
      { "status": "planned", "title": "Reproducible local evidence capture", "detail": "Package a service-independent recorded path that demonstrates citations and refusal without exposing credentials or medical user data." }
    ],
    "sources": [
      { "label": "MedRAG committed repository, evaluation, and retrieval artifacts", "locator": "private audit at main a741897", "public": false },
      { "label": "MedRAG public repository", "locator": "https://github.com/parthtiwari-dev/Evidence-Bound-Drug-RAG", "public": true },
      { "label": "Portfolio claim record for the final refusal count", "locator": "src/content/claims/medrag-refusals.json", "public": false }
    ],
    "relatedNoteLabel": "Read why refusal is a product feature",
    "ending": {
      "heading": "A citation can support an answer. A refusal can protect the boundary.",
      "body": "The next meaningful improvement is not more confident language. It is a larger reviewed evidence set and clearer proof of when the system should stop.",
      "contactLabel": "Ask me about MedRAG"
    }
  },
  "claimRefs": ["medrag-refusals"]
}
---
