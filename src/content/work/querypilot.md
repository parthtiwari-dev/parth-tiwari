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
  "claimRefs": ["querypilot-correction"]
}
---
