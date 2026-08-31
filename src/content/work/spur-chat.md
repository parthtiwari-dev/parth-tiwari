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
      { "label": "View the interface", "kind": "live", "url": "https://support-core-nine.vercel.app", "verifiedAt": "2026-08-31" },
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
  "caseStudy": {
    "reviewedAt": "2026-08-31",
    "classification": "Take-home support assistant",
    "thesis": "Spur Chat is a bounded streaming support interface for Lumio, a fictional brand, built as a take-home and presented without pretending its suspended backend is a working live assistant.",
    "credit": {
      "organization": "Take-home assignment",
      "role": "Full-stack engineer",
      "contribution": "I built the responsive chat interface, Node and TypeScript API, retrieval scope, PostgreSQL session history, SSE stream parser, request deduplication, failure taxonomy, feedback controls, and deployment documentation.",
      "contributionSummary": "Interface, API, streaming, retrieval, and recovery"
    },
    "cover": {
      "proof": { "kind": "image", "src": "/media/support-core-desktop.jpg", "alt": "The real Spur Chat desktop interface showing Lumio's greeting and support conversation surface", "width": 2880, "height": 1800, "fit": "contain" },
      "labels": ["Real interface capture", "Greeting state, interaction unverified"]
    },
    "headings": {
      "overview": "A deliberately small support surface for a fictional brand.",
      "problem": "A polished chat shell does not prove that the backend can complete a turn.",
      "architectureCaption": "Question to scoped retrieval to buffered SSE to recovered session",
      "evidence": "The interface is reachable. The backend and complete turn are not."
    },
    "intendedUser": "A shopper asking catalogue or policy questions inside a small direct-to-consumer support widget, and an evaluator inspecting a bounded take-home implementation.",
    "demo": {
      "kind": "image",
      "label": "Real desktop capture",
      "src": "/media/support-core-desktop.jpg",
      "alt": "The real deployed Spur Chat entry state before a successful streamed support answer",
      "width": 2880,
      "height": 1800,
      "fit": "contain",
      "caption": "The frontend returned HTTP 200 on 2026-08-31. The Render backend reported Service Suspended, so this capture proves only the interface and no successful streamed answer is fabricated."
    },
    "workflow": [
      { "title": "Enter through the real interface", "description": "Desktop and mobile surfaces expose the fictional Lumio assistant, conversation list, input, and recovery affordances.", "proof": { "kind": "image", "src": "/media/support-core-mobile.jpg", "alt": "The real Spur Chat mobile interface showing the fictional Lumio support assistant", "width": 1170, "height": 2532, "fit": "contain" } },
      { "title": "Parse a buffered stream", "description": "The frontend reads POST response chunks, buffers incomplete lines, and handles chunk, done, and error SSE events without requiring WebSockets.", "proof": { "kind": "record", "label": "Stream record", "title": "POST over fetch and ReadableStream", "sourceLabel": "Committed frontend API service at 562ca32", "rows": [
        { "label": "Transport", "value": "Server-Sent Events over POST" }, { "label": "Parser", "value": "Buffered line framing" }, { "label": "Events", "value": "chunk, done, and error", "tone": "pass" }
      ] } },
      { "title": "Report the live failure honestly", "description": "The frontend remains available, but health and message requests cannot complete while the backend service is suspended.", "proof": { "kind": "record", "label": "Live verification", "title": "Interaction unavailable", "sourceLabel": "Read-only checks on 2026-08-31", "rows": [
        { "label": "Frontend", "value": "HTTP 200", "tone": "pass" }, { "label": "Backend health", "value": "Service Suspended", "tone": "blocked" }, { "label": "Complete chat turn", "value": "Could not run", "tone": "blocked" }
      ] } }
    ],
    "responsibilities": [
      { "label": "Frontend", "detail": "Responsive chat, buffered SSE parsing, typing and error states, session recovery, feedback, and request deduplication." },
      { "label": "Backend", "detail": "Node and TypeScript API, retrieval scope, PostgreSQL history, stream events, health check, and failure handling." },
      { "label": "Delivery", "detail": "Separate Vercel and Render deployment, exact-origin CORS diagnosis, documentation, and truthful live-state reporting." }
    ],
    "research": [
      { "source": "SSE versus WebSockets", "finding": "The product needs one-way incremental output after a POST body, not a permanent bidirectional socket.", "changed": "The client uses fetch plus ReadableStream and parses SSE frames from the POST response." },
      { "source": "Buffered stream parsing tests", "finding": "Network chunks do not align with event or line boundaries, so parsing each received chunk independently loses or corrupts data.", "changed": "The client carries an incomplete-line buffer and only parses complete data frames." },
      { "source": "Bounded context and session recovery", "finding": "A support conversation needs enough history to remain coherent without resending an unbounded transcript.", "changed": "History is persisted by session and the model receives a bounded context window." },
      { "source": "Deployment failure taxonomy", "finding": "A healthy frontend, suspended backend, exact CORS-origin mismatch, mid-stream loss, and malformed event are different failures.", "changed": "User-visible errors and docs distinguish reachability, configuration, and stream completion instead of showing one generic typing state." }
    ],
    "decisions": [
      { "decision": "Use SSE over a streamed POST response.", "rejected": "Use WebSockets or wait for one blocking JSON reply.", "tradeoff": "The parser must handle partial frames, while the transport matches one-way answer streaming without socket infrastructure." },
      { "decision": "Persist sessions and deduplicate requests.", "rejected": "Treat every message as an isolated stateless completion.", "tradeoff": "The backend and database contract grow, while refresh recovery and duplicate-send handling become possible." },
      { "decision": "Label the live action as View the interface.", "rejected": "Call the suspended deployment a working demo or fabricate a streamed answer.", "tradeoff": "The public proof is weaker, while the current live state is accurate." }
    ],
    "architectureSteps": [
      { "label": "Chat client", "detail": "Sends a message and optional session identifier" },
      { "label": "Support API", "detail": "Validates, deduplicates, retrieves bounded Lumio context" },
      { "label": "SSE stream", "detail": "Emits chunk, done, or error events over the POST response" },
      { "label": "Session store", "detail": "Persists messages for refresh and later history recovery" },
      { "label": "Feedback", "detail": "Attaches an up or down record to an AI message" }
    ],
    "failures": [
      { "title": "Frontend and backend were deployed separately", "symptom": "The interface loaded while the assistant could not complete a reply.", "cause": "Vercel continued serving the client after the Render backend became unavailable and is now suspended.", "correction": "The public action now says View the interface and the case study labels interaction unverified.", "remainingRisk": "The live assistant remains unusable until a backend and database are restored and checked end to end." },
      { "title": "One trailing slash broke CORS", "symptom": "Browser requests failed even while the backend health endpoint responded.", "cause": "CORS origin matching is byte-exact, and the configured frontend URL included a trailing slash.", "correction": "Deployment docs require the exact origin without a trailing slash and separate health from browser-origin checks.", "remainingRisk": "Future domain or preview URLs still need explicit allowed-origin verification." },
      { "title": "A stream could close without done", "symptom": "The interface could remain in a typing state after the connection ended mid-response.", "cause": "Transport completion was treated as equivalent to receiving a semantic done event.", "correction": "The parser tracks completion and reports a specific error when the stream closes before done.", "remainingRisk": "The unavailable backend prevented a fresh production completion check in this batch." }
    ],
    "limitations": [
      "Lumio is fictional, and Spur Chat was a take-home assignment rather than a client product.",
      "The frontend returned HTTP 200 on 2026-08-31, but the backend service was suspended and one complete chat turn could not be verified.",
      "The current captures show the genuine entry state and do not prove answer quality, retrieval quality, users, customers, or traffic.",
      "Separate frontend and backend deployment leaves availability, CORS, and database state as independent failure surfaces."
    ],
    "evidenceNote": "No user, customer, traffic, answer-quality, or support-outcome number is published. Current proof is limited to source architecture, real interface captures, frontend reachability, and a failed backend health check.",
    "future": [
      { "status": "blocked", "title": "Restore backend service", "detail": "Re-establish the API and PostgreSQL, then rerun health, exact-origin preflight, one complete streamed turn, history recovery, and feedback." },
      { "status": "planned", "title": "Capture a verified complete turn", "detail": "Replace the entry-state-only proof after a successful chunk-to-done stream is observed and recorded without private data." },
      { "status": "investigating", "title": "Co-located deployment", "detail": "Evaluate whether one deployment boundary would reduce CORS and split-availability failures without overbuilding the take-home." }
    ],
    "sources": [
      { "label": "Spur Chat committed repository, tests, and deployment docs", "locator": "private audit at main 562ca32", "public": false },
      { "label": "Spur Chat public repository", "locator": "https://github.com/parthtiwari-dev/support-core", "public": true },
      { "label": "Published interface", "locator": "https://support-core-nine.vercel.app", "public": true },
      { "label": "Read-only live health and chat checks", "locator": "2026-08-31 frontend 200; backend suspended", "public": false }
    ],
    "relatedNoteLabel": "Read the end-to-end deployment correction",
    "ending": {
      "heading": "The interface is visible. The assistant is not currently a working live demo.",
      "body": "The source shows a careful streaming and recovery contract. A complete public proof waits for the backend to return and one real turn to finish.",
      "contactLabel": "Ask me about Spur Chat"
    }
  },
  "claimRefs": []
}
---
