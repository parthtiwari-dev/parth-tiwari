---
{
  "title": "QueryPilot",
  "order": 6,
  "tier": "major",
  "effort": "substantial",
  "status": "shipped",
  "started": "2026-02",
  "startedSource": { "kind": "repository", "locator": "QueryPilot first Git commit", "public": false },
  "audience": ["employer", "client"],
  "summary": "A natural-language-to-SQL API that retrieves schema context, validates generated SQL, and gives failed queries one bounded correction loop.",
  "arrival": { "sentence": "A question becomes SQL only after the schema, critic, and database agree it can run." },
  "whatItIs": ["QueryPilot lets a person ask a PostgreSQL question in plain language and inspect the SQL that ran.", "It links the question to relevant schema, generates SQL, checks it, executes read-only, and retries with the failure reason when needed."],
  "problem": ["Text-to-SQL can produce valid-looking queries that reference the wrong table, expose sensitive intent, or fail only when the database plans them.", "A reliable system needs bounded correction and an honest definition of what its benchmark actually measures."],
  "architecture": {
    "decision": "Return database and critic failures as structured correction context, with a fixed attempt limit.",
    "paragraphs": ["A schema linker narrows the context, the generator writes SQL, and the critic applies static and safety checks before read-only execution.", "Execution failures can re-enter one correction path. The evaluation records execution success, not semantic correctness of the business answer." ]
  },
  "measurement": { "claimIds": ["querypilot-correction"] },
  "boundary": {
    "will": ["Show the exact SQL and correction count.", "Block destructive and sensitive intent with documented guardrails."],
    "refuses": ["Describe execution success as semantic accuracy.", "Combine the core and adversarial denominators into one lift claim."]
  },
  "whatBroke": {
    "title": "I put the right percentage on the wrong denominator",
    "paragraphs": ["The old portfolio attached the correction lift to all benchmark queries. The artifact shows that it belongs to the core set only.", "The corrected story keeps the adversarial set separate and says plainly that a successful query may still answer the business question incorrectly."],
    "noteSlug": "querypilot-denominator"
  },
  "stackAndLinks": {
    "stack": ["Python", "FastAPI", "LangGraph", "PostgreSQL", "ChromaDB", "Docker"],
    "links": [{ "label": "View repository", "kind": "repository", "url": "https://github.com/parthtiwari-dev/querypilot", "verifiedAt": "2026-08-28" }]
  },
  "next": { "slug": "secondself", "label": "Next: SecondSelf" },
  "world": {
    "story": "A question moves through schema retrieval, generation, rejection, correction, and execution, with the rejected and corrected SQL visible together.",
    "dataSources": ["core evaluation artifact", "query attempt records", "schema profiles"],
    "storyboardStatus": "specced",
    "motionDeferred": true
  },
  "caseStudy": {
    "reviewedAt": "2026-08-31",
    "classification": "Text-to-SQL system",
    "thesis": "QueryPilot turns a question into read-only SQL only after schema retrieval, static criticism, database execution, and one bounded correction path have all had a chance to reject it.",
    "credit": {
      "organization": "Personal project",
      "role": "AI engineer",
      "contribution": "I built the schema linker, SQL generator, critic and safety checks, read-only execution layer, bounded correction loop, FastAPI surface, benchmark datasets, and the denominator audit behind the published correction result.",
      "contributionSummary": "Retrieval, generation, validation, correction, and evaluation"
    },
    "cover": {
      "proof": { "kind": "image", "src": "/media/querypilot-desktop.jpg", "alt": "The real QueryPilot FastAPI documentation showing the served text-to-SQL API surface", "width": 2880, "height": 1800, "fit": "contain" },
      "labels": ["Real API capture", "Surface evidence, not query-quality proof"]
    },
    "headings": {
      "overview": "The useful result is the SQL, its checks, and the path that produced it.",
      "problem": "A query can execute successfully and still answer the wrong question.",
      "architectureCaption": "Question to schema context to critic to bounded correction",
      "evidence": "Correction improved execution on the 70-query core set. Nothing more is implied."
    },
    "intendedUser": "A developer or analyst who needs inspectable read-only PostgreSQL queries from natural language and wants failure, correction, and safety boundaries visible.",
    "demo": {
      "kind": "record",
      "label": "Committed correction trace",
      "title": "hard_001 needed three attempts",
      "sourceLabel": "Day 6 full results plus the matching Day 5 failure record",
      "rows": [
        { "label": "Question", "value": "Find customers who placed more orders than the average customer" },
        { "label": "Schema context", "value": "orders, customers, order_items, products" },
        { "label": "Rejected attempt", "value": "Invalid multi-CTE SQL with incorrect join syntax", "tone": "warn" },
        { "label": "Correction", "value": "Subquery-based average order count" },
        { "label": "Attempts", "value": "Three" },
        { "label": "Execution", "value": "Succeeded", "tone": "pass" }
      ],
      "caption": "This is a readable rendering of committed evaluation artifacts. The API screenshot proves the surface exists; this trace carries the primary system evidence."
    },
    "workflow": [
      { "title": "Retrieve only relevant schema", "description": "The question is embedded against isolated schema profiles so generation receives the likely tables and relationships instead of the whole database.", "proof": { "kind": "record", "label": "Schema record", "title": "Context for hard_001", "sourceLabel": "day6_full_results.json", "rows": [
        { "label": "Primary", "value": "orders and customers" }, { "label": "Additional", "value": "order_items and products" }, { "label": "Isolation", "value": "Schema-scoped retrieval", "tone": "pass" }
      ] } },
      { "title": "Reject and correct once", "description": "Static checks and database failures become structured feedback, while normalised comparison prevents cosmetic rewrites from consuming the retry budget.", "proof": { "kind": "record", "label": "Correction record", "title": "Failure becomes context", "sourceLabel": "Committed correction loop and evaluation docs", "rows": [
        { "label": "Failure", "value": "Invalid join structure", "tone": "warn" }, { "label": "Feedback", "value": "Database and critic reason" }, { "label": "Guard", "value": "Bounded attempts plus normalised SQL comparison" }
      ] } },
      { "title": "Execute read-only", "description": "Only checked SQL reaches PostgreSQL, and the result keeps the generated statement and attempt count visible.", "proof": { "kind": "image", "src": "/media/querypilot-desktop.jpg", "alt": "The real QueryPilot API documentation for the read-only query and schema endpoints", "width": 2880, "height": 1800, "fit": "contain" } }
    ],
    "responsibilities": [
      { "label": "Retrieval", "detail": "Schema profiles, isolated vector retrieval, table selection, and database context boundaries." },
      { "label": "Agent graph", "detail": "Generation, critic validation, safety checks, bounded correction, and retry comparison." },
      { "label": "Evaluation", "detail": "Core and adversarial sets, execution records, denominator correction, and failure taxonomy." }
    ],
    "research": [
      { "source": "Schema-linking experiments", "finding": "Generation quality depended more on complete, relevant schema context than on adding more prompt prose.", "changed": "Schema profiles and retrieval became a first-class stage before SQL generation." },
      { "source": "Critic and database validation", "finding": "Static validity and actual PostgreSQL execution expose different errors.", "changed": "Both checks feed one structured correction context rather than being reported as the same failure." },
      { "source": "Day 6 core and adversarial evaluation", "finding": "The 70 core questions and 12 adversarial questions test different contracts and cannot share one success denominator.", "changed": "The published lift is attached only to the core set and adversarial behaviour stays separate." },
      { "source": "Safety-correction failure review", "finding": "A correction loop can repair syntax by weakening the guard that rejected an unsafe query.", "changed": "Safety intent is rechecked after correction instead of trusting a query because the database now accepts it." }
    ],
    "decisions": [
      { "decision": "Give failed SQL a bounded correction path.", "rejected": "Retry indefinitely or return every first failure to the user.", "tradeoff": "Some recoverable queries still fail after the limit, while latency and behaviour remain bounded." },
      { "decision": "Keep core and adversarial evaluations separate.", "rejected": "Combine 82 questions into one headline success rate.", "tradeoff": "The result is less compact, but the correction and safety denominators stay truthful." },
      { "decision": "Reapply safety after correction.", "rejected": "Treat a corrected, executable query as safe by definition.", "tradeoff": "A technically valid query may still be blocked, while correction cannot silently erase the original guard." }
    ],
    "architectureSteps": [
      { "label": "Question", "detail": "Natural language enters with one database scope" },
      { "label": "Schema link", "detail": "Retrieve relevant tables, columns, and relationships" },
      { "label": "Generate and critic", "detail": "Write SQL, apply static and safety validation" },
      { "label": "Correct", "detail": "Use structured failure feedback within a fixed attempt budget" },
      { "label": "Execute", "detail": "Run read-only and return SQL, result, and trace metadata" }
    ],
    "failures": [
      { "title": "The correction number had the wrong denominator", "symptom": "Portfolio copy attached the lift to all evaluated queries.", "cause": "The 70-query core set and 12-query adversarial set were collapsed in the summary.", "correction": "The public claim now says 63 to 67 of 70 and keeps the adversarial set separate.", "remainingRisk": "Execution success still does not establish semantic correctness." },
      { "title": "Correction could weaken safety", "symptom": "A failed query could become executable after rewriting the structure that originally triggered a guard.", "cause": "Syntax recovery and intent safety were treated as one pass.", "correction": "Safety is checked again after correction and remains independent of database acceptance.", "remainingRisk": "Adversarial coverage is finite and does not prove resistance to every unsafe formulation." },
      { "title": "A corrected query still answered the wrong thing", "symptom": "A statement could run successfully while using a semantically unsuitable table, join, or aggregation.", "cause": "The evaluation's success field records execution, not business-answer correctness.", "correction": "The case study names the metric as execution success and refuses to call it semantic accuracy.", "remainingRisk": "A gold-answer or human semantic evaluation is still needed." }
    ],
    "limitations": [
      "The published result measures execution success on one 70-query core set, not semantic answer accuracy.",
      "The 12 adversarial questions are separate and are not included in the correction-lift denominator.",
      "The system is bounded to read-only PostgreSQL patterns and a known schema profile.",
      "The API capture proves the served interface, not that every endpoint or external deployment is currently available."
    ],
    "evidenceNote": "The 63-to-67 result is a four-query recovery on the 70-query core set. The 12 adversarial queries remain separate, and a successful execution may still be semantically wrong.",
    "future": [
      { "status": "planned", "title": "Semantic answer review", "detail": "Add gold results or human review so execution success can be separated from whether the query answered the intended business question." },
      { "status": "investigating", "title": "Safety-preserving correction", "detail": "Expand tests where a syntax fix changes sensitive intent, table access, or the meaning of a previous rejection." },
      { "status": "planned", "title": "Inspectable trace export", "detail": "Persist schema context, rejected SQL, failure feedback, corrected SQL, and result in one publication-safe trace artifact." }
    ],
    "sources": [
      { "label": "QueryPilot committed repository and Day 6 evaluation", "locator": "private audit at main 1b75476", "public": false },
      { "label": "QueryPilot public repository", "locator": "https://github.com/parthtiwari-dev/querypilot", "public": true },
      { "label": "Real served API capture", "locator": "publication-cleared portfolio media", "public": false }
    ],
    "relatedNoteLabel": "Read the denominator correction",
    "ending": {
      "heading": "A query that runs is evidence of execution, not proof of meaning.",
      "body": "QueryPilot's useful contract is inspectable SQL, bounded correction, and clear failure categories. The next gate is semantic review, not a larger execution headline.",
      "contactLabel": "Ask me about QueryPilot"
    }
  },
  "claimRefs": ["querypilot-correction"]
}
---
