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
  "caseStudy": {
    "reviewedAt": "2026-08-31",
    "classification": "Durable agent workflow",
    "thesis": "Order Supervisor lets a model interpret a customer message while Temporal and deterministic workflow code retain authority over the order lifecycle.",
    "credit": {
      "organization": "Personal project",
      "role": "Full-stack engineer",
      "contribution": "I built the Next.js product surface, FastAPI boundary, Temporal order workflow, model proposal path, event classification, rolling memory, action validation, and recovery-oriented lifecycle tests.",
      "contributionSummary": "Workflow architecture, agent boundary, API, and interface"
    },
    "cover": {
      "proof": { "kind": "record", "label": "Workflow record", "title": "Authority remains outside the model", "sourceLabel": "Committed main at ba544e0", "rows": [
        { "label": "Customer input", "value": "Message or order event" },
        { "label": "Model output", "value": "Proposed action" },
        { "label": "Authority", "value": "Temporal workflow state", "tone": "pass" },
        { "label": "Universal approval", "value": "Not implemented", "tone": "warn" }
      ] },
      "labels": ["Committed workflow evidence", "No invented product outcome"]
    },
    "headings": {
      "overview": "The model can propose. The workflow still decides what is valid.",
      "problem": "Long-running orders outlive requests, processes, and conversational memory.",
      "architectureCaption": "Message to proposal to authoritative workflow event",
      "evidence": "The architecture is inspectable. Production outcome evidence is absent."
    },
    "intendedUser": "An operations or support team handling orders that may wait, resume, receive messages out of sequence, and require an auditable state transition.",
    "demo": {
      "kind": "record",
      "label": "Lifecycle trace",
      "title": "Message becomes a checked event",
      "sourceLabel": "Committed workflow and event types at ba544e0",
      "rows": [
        { "label": "01 Message", "value": "Classified as instruction, interruption, status, or ordinary conversation" },
        { "label": "02 Proposal", "value": "Model returns an action from a bounded vocabulary" },
        { "label": "03 Check", "value": "Workflow compares the proposal with authoritative state", "tone": "pass" },
        { "label": "04 Result", "value": "Accepted or rejected event is persisted" }
      ],
      "caption": "This record renders real source-level lifecycle types and boundaries. It is evidence of the committed architecture, not a simulated order dashboard."
    },
    "workflow": [
      { "title": "Classify the event", "description": "Messages and system events are separated so an interruption, resume, or termination does not become ordinary chat context.", "proof": { "kind": "record", "label": "Event record", "title": "Typed inputs", "sourceLabel": "Committed event classification", "rows": [
        { "label": "Conversation", "value": "Customer message" }, { "label": "Control", "value": "Interrupt, resume, or terminate" }, { "label": "System", "value": "Timer or lifecycle event" }
      ] } },
      { "title": "Validate the proposal", "description": "The model proposes from an allowlist, then deterministic workflow state accepts or rejects the action.", "proof": { "kind": "record", "label": "Authority record", "title": "Proposal is not state", "sourceLabel": "Committed action allowlist and workflow", "rows": [
        { "label": "Proposal", "value": "Bounded model action" }, { "label": "Validation", "value": "Current lifecycle rules", "tone": "pass" }, { "label": "Rejected path", "value": "Recorded without transition", "tone": "warn" }
      ] } },
      { "title": "Persist before signalling", "description": "State and event history are committed before downstream signals so a retry can recover without inventing a transition.", "proof": { "kind": "record", "label": "Durability record", "title": "Write before wake", "sourceLabel": "Committed persistence and signal ordering", "rows": [
        { "label": "First", "value": "Persist lifecycle event", "tone": "pass" }, { "label": "Then", "value": "Signal or resume workflow" }, { "label": "Recovery", "value": "Replay durable state after restart" }
      ] } }
    ],
    "responsibilities": [
      { "label": "Workflow", "detail": "Temporal lifecycle, signals, timers, retries, transitions, event history, and recovery." },
      { "label": "Agent", "detail": "Model proposal contract, bounded actions, rolling memory, and deterministic validation." },
      { "label": "Product", "detail": "Next.js order surface, API boundary, status visibility, and corrected authority copy." }
    ],
    "research": [
      { "source": "Temporal durable execution", "finding": "A workflow can wait for hours or days and recover state without keeping a web request or process alive.", "changed": "One durable workflow became the authority for each order lifecycle." },
      { "source": "Thin API boundary review", "finding": "HTTP should start, inspect, or signal work rather than duplicate lifecycle state in the web process.", "changed": "FastAPI remains a transport edge while Temporal owns the long-running state machine." },
      { "source": "Event classification and rolling-memory tests", "finding": "Control events and old conversation turns need different retention and handling rules.", "changed": "Inputs became typed events and conversational context received a bounded rolling window." },
      { "source": "Persist-before-signal failure analysis", "finding": "Signalling before durable state is stored can wake a workflow that cannot reproduce the action it was asked to take.", "changed": "Authoritative records are persisted before the corresponding workflow signal." }
    ],
    "decisions": [
      { "decision": "Use one Temporal workflow per order.", "rejected": "Keep lifecycle state in a synchronous chat request or application memory.", "tradeoff": "The system needs workflow infrastructure, while retries and long waits become explicit." },
      { "decision": "Keep model output advisory and validate it against workflow state.", "rejected": "Let the model mutate order status directly from conversational intent.", "tradeoff": "Some plausible actions are rejected, while the lifecycle remains deterministic and auditable." },
      { "decision": "Claim authority separation, not universal human approval.", "rejected": "Describe every accepted action as human-approved when the committed source does not enforce that gate.", "tradeoff": "The public story is less reassuring, but it matches the implemented contract." }
    ],
    "architectureSteps": [
      { "label": "Message", "detail": "Customer, system, or control event enters through the API" },
      { "label": "Proposal", "detail": "The model proposes a bounded action with rolling context" },
      { "label": "Workflow check", "detail": "Temporal compares the proposal with authoritative lifecycle state" },
      { "label": "Event log", "detail": "Accepted or rejected result is persisted before signalling" },
      { "label": "Resume", "detail": "The workflow continues from durable state after waits or restarts" }
    ],
    "failures": [
      { "title": "The diagram invented a human gate", "symptom": "Portfolio copy said every consequential transition waited for human approval.", "cause": "A desirable product boundary was mistaken for behaviour enforced by the committed workflow.", "correction": "The claim now states only what source proves: lifecycle authority remains outside the model.", "remainingRisk": "A universal human approval gate still requires product design, implementation, and tests." },
      { "title": "Signals could outrun persistence", "symptom": "A workflow could receive a wake-up before the corresponding durable event existed.", "cause": "The side-effect order treated signalling and persistence as interchangeable operations.", "correction": "The lifecycle path persists authoritative state before emitting the signal.", "remainingRisk": "Every new event type still needs the same ordering and replay tests." },
      { "title": "Conversation memory could grow without bound", "symptom": "Long-lived orders accumulated more context than the model needed to make the next proposal.", "cause": "Workflow history and model prompt memory were treated as the same retention surface.", "correction": "The durable event log remains complete while model context uses a bounded rolling memory.", "remainingRisk": "Summarisation quality and context loss have no publishable benchmark yet." }
    ],
    "limitations": [
      "Universal human approval is not implemented and is not claimed.",
      "No production order volume, customer outcome, latency, or recovery benchmark has been recorded.",
      "The model can still make an unsuitable proposal; the safety boundary is that workflow code may reject it.",
      "The committed local product surface was not promoted as live evidence in this batch."
    ],
    "evidenceNote": "There is no publishable order outcome or usage number. The case study therefore proves the source-level workflow contract and names the missing operational evidence.",
    "future": [
      { "status": "planned", "title": "Explicit human-review policy", "detail": "Define which actions require approval, model that state in the workflow, and test every bypass and recovery path." },
      { "status": "planned", "title": "Recovery benchmark", "detail": "Record interrupted, delayed, duplicated, and restarted orders with denominators before publishing reliability claims." },
      { "status": "investigating", "title": "Memory quality", "detail": "Measure whether bounded context preserves the facts needed for later order decisions without replaying the full conversation." }
    ],
    "sources": [
      { "label": "Order Supervisor committed repository and lifecycle tests", "locator": "private audit at main ba544e0", "public": false },
      { "label": "Order Supervisor public repository", "locator": "https://github.com/parthtiwari-dev/order-supervisor", "public": true },
      { "label": "Authority correction erratum", "locator": "src/content/notes/order-supervisor-authority-not-approval.md", "public": false }
    ],
    "relatedNoteLabel": "Read the authority-versus-approval correction",
    "ending": {
      "heading": "The agent can reason about the order. It does not become the order system.",
      "body": "The next proof has to come from recovery and approval behaviour under real lifecycle pressure, not from a more polished chat transcript.",
      "contactLabel": "Ask me about Order Supervisor"
    }
  },
  "claimRefs": []
}
---
