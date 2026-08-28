---
{
  "title": "Order Supervisor",
  "order": 5,
  "tier": "minor",
  "effort": "focused",
  "status": "shipped",
  "started": "2026-05",
  "startedSource": { "kind": "repository", "locator": "Order Supervisor first Git commit", "public": false },
  "audience": ["employer", "client"],
  "summary": "A durable order workflow where the model can propose actions but never becomes the source of truth for the order lifecycle.",
  "arrival": { "sentence": "The agent can talk about the order. The workflow still owns what happens next." },
  "whatItIs": ["Order Supervisor handles customer conversations around long-running orders while Temporal keeps authoritative lifecycle state.", "The model proposes from a small allowlist; deterministic workflow code validates and records the action."],
  "problem": ["An order may wait for hours or days, receive messages out of sequence, and resume after a process restarts.", "Putting lifecycle authority inside a chat loop makes retries, audit history, and duplicate actions unsafe."],
  "architecture": {
    "decision": "Use one durable workflow per order and keep model reasoning advisory.",
    "paragraphs": ["Signals and timers wake the workflow. Activities read state, request a model proposal, validate it against an allowlist, and append the result to the event log.", "The product does not claim a blanket human approval step that the current source does not enforce." ]
  },
  "measurement": { "claimIds": [], "absence": "No outcome benchmark or production order volume has been recorded. The public case study treats this as an architecture project." },
  "boundary": {
    "will": ["Recover long-running order work after process restarts.", "Keep actions inside a deterministic allowlist and audit log."],
    "refuses": ["Let the model mark an order complete by itself.", "Invent a human-approval guarantee that the current workflow does not implement."]
  },
  "whatBroke": {
    "title": "The diagram promised a human gate the code did not have",
    "paragraphs": ["Earlier portfolio copy showed every transition waiting for human approval. The source only guarantees that lifecycle authority stays outside the model.", "I removed the stronger claim. If a universal human gate is added later, it has to appear in the workflow and its tests before it returns to the site."],
    "noteSlug": "order-supervisor-authority-not-approval"
  },
  "stackAndLinks": {
    "stack": ["Temporal", "FastAPI", "Next.js", "PostgreSQL", "OpenAI API", "Groq"],
    "links": [{ "label": "View repository", "kind": "repository", "url": "https://github.com/parthtiwari-dev/order-supervisor", "verifiedAt": "2026-08-28" }]
  },
  "next": { "slug": "querypilot", "label": "Next: QueryPilot" },
  "world": {
    "story": "A message becomes a proposed action, meets authoritative workflow state, and enters an event log without the model taking ownership of the lifecycle.",
    "dataSources": ["workflow event types", "action allowlist", "recorded lifecycle transitions"],
    "storyboardStatus": "prototyped",
    "motionDeferred": true
  },
  "claimRefs": []
}
---
