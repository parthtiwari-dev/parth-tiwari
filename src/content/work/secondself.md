---
{
  "title": "SecondSelf",
  "order": 7,
  "tier": "flagship",
  "effort": "flagship",
  "status": "running",
  "started": "2026-04",
  "startedSource": { "kind": "repository", "locator": "SecondSelf first Git commit", "public": false },
  "audience": ["employer", "client"],
  "summary": "An evidence-bound career system that prepares applications and stops at a human review queue before anything consequential is sent.",
  "arrival": { "sentence": "The system can prepare the application. It still has to wait for me." },
  "whatItIs": ["SecondSelf gathers job material, matches it against verified experience, and prepares an application packet.", "Outbound work enters a Telegram review queue, where a person can inspect and approve it."],
  "problem": ["Career automation is especially prone to turning weak evidence into confident claims.", "The hard part is not filling a form. It is maintaining one evidence contract across research, resume variants, generated answers, and the final action."],
  "architecture": {
    "decision": "Remove unsupported claims before drafting and make human review a durable state, not a pause in one process.",
    "paragraphs": ["Structured evidence feeds retrieval and drafting. A preparation record stores provenance, current stage, and the artifact awaiting review.", "Apply mode is deliberately gated. The system may automate preparation, but it does not get silent authority to represent me." ]
  },
  "measurement": { "claimIds": ["secondself-ragas"] },
  "boundary": {
    "will": ["Draft only from recorded experience and project evidence.", "Wait in a visible review queue before an outbound action."],
    "refuses": ["Invent a skill or result to improve a match.", "Describe human-gated apply mode as fully autonomous job application."]
  },
  "whatBroke": {
    "title": "Automation moved faster than the evidence",
    "paragraphs": ["Early flows treated a plausible answer as ready to send. That is the wrong threshold when the system speaks in my name.", "I moved evidence checks earlier and made the review queue a first-class state so unsupported material can be removed before an application exists."],
    "noteSlug": "secondself-human-gate"
  },
  "stackAndLinks": { "stack": ["Python", "PostgreSQL", "RAGAS", "Telegram", "browser automation"], "links": [] },
  "next": { "slug": "oncoverse", "label": "Next: OncoVerse" },
  "world": {
    "story": "Evidence enters, unsupported material drops away, a packet forms, and the sequence visibly waits at the human review queue.",
    "dataSources": ["evaluation log", "preparation state", "review queue events"],
    "storyboardStatus": "specced",
    "motionDeferred": true
  },
  "caseStudy": {
    "reviewedAt": "2026-08-31",
    "classification": "Evidence-bound career automation",
    "thesis": "SecondSelf prepares career work from verified evidence, removes unsupported material before drafting, and makes human review a durable state before consequential outbound action.",
    "credit": {
      "organization": "Personal project",
      "role": "Product and AI engineer",
      "contribution": "I built the evidence store, hybrid retrieval, gentle reranking, evidence-first drafting, RAGAS evaluation, preparation state, review workflow, browser-assistance boundary, and the safeguards around unsupported claims and outbound actions.",
      "contributionSummary": "Evidence model, retrieval, drafting, review, and automation"
    },
    "cover": {
      "proof": { "kind": "record", "label": "Safe evaluation record", "title": "Evidence reaches review before action", "sourceLabel": "Committed v2-dev at 4a1447c", "rows": [
        { "label": "Retrieval", "value": "Hybrid evidence search" },
        { "label": "Drafting", "value": "Unsupported material removed" },
        { "label": "State", "value": "Durable human-review queue", "tone": "pass" },
        { "label": "Private data", "value": "Excluded from this page", "tone": "blocked" }
      ] },
      "labels": ["Publication-safe record", "No personal KB or application data"]
    },
    "headings": {
      "overview": "The system prepares the work. It does not get to become me.",
      "problem": "Plausible career copy is still false when the evidence does not support it.",
      "architectureCaption": "Evidence retrieval to prepared packet to durable human review",
      "evidence": "Faithfulness was measured on 20 questions. Job outcomes were not."
    },
    "intendedUser": "A job seeker who wants assistance researching roles and preparing accurate applications while retaining final authority over every claim and outbound action.",
    "demo": {
      "kind": "record",
      "label": "Safe fixture trace",
      "title": "A packet stops at review",
      "sourceLabel": "Committed evaluation and test fixtures at 4a1447c",
      "rows": [
        { "label": "Request", "value": "Prepare an application packet" },
        { "label": "Evidence", "value": "Retrieve verified projects, skills, and experience" },
        { "label": "Filter", "value": "Remove unsupported material", "tone": "pass" },
        { "label": "Durable state", "value": "Awaiting human review", "tone": "warn" },
        { "label": "Outbound", "value": "Not sent automatically", "tone": "blocked" }
      ],
      "caption": "This DOM record uses publication-safe committed fixtures. Personal knowledge entries, applications, emails, credentials, and Telegram content are deliberately absent."
    },
    "workflow": [
      { "title": "Retrieve evidence gently", "description": "Hybrid search finds candidate material, then a bounded reranker improves ordering without turning weak similarity into a new fact.", "proof": { "kind": "record", "label": "Retrieval record", "title": "Evidence candidates", "sourceLabel": "Committed safe evaluation fixtures", "rows": [
        { "label": "Lexical", "value": "Exact skills and project terms" }, { "label": "Semantic", "value": "Related experience evidence" }, { "label": "Reranking", "value": "Gentle weighting, no invented claim" }
      ] } },
      { "title": "Prepare from support", "description": "Drafting receives evidence packets and removes material that cannot be traced to a verified record.", "proof": { "kind": "record", "label": "Draft record", "title": "Support before prose", "sourceLabel": "Committed drafting tests", "rows": [
        { "label": "Supported", "value": "Included with provenance", "tone": "pass" }, { "label": "Unsupported", "value": "Removed before packet", "tone": "blocked" }, { "label": "Output", "value": "Reviewable draft" }
      ] } },
      { "title": "Wait for a human", "description": "The prepared artifact and its provenance enter durable review state instead of relying on one paused process or hidden browser step.", "proof": { "kind": "record", "label": "Review record", "title": "Consequential action is pending", "sourceLabel": "Committed preparation-state fixtures", "rows": [
        { "label": "State", "value": "Awaiting review", "tone": "warn" }, { "label": "Reviewer", "value": "Human owner" }, { "label": "Action", "value": "Approve, revise, or reject" }
      ] } }
    ],
    "responsibilities": [
      { "label": "Knowledge", "detail": "Evidence schema, provenance, hybrid retrieval, reranking, and privacy boundaries." },
      { "label": "Application", "detail": "Research, packet preparation, evidence-first drafting, unsupported-claim removal, and review state." },
      { "label": "Automation", "detail": "Assisted form handling, browser boundaries, reCAPTCHA stop conditions, durable state, and safe failure semantics." }
    ],
    "research": [
      { "source": "Hybrid retrieval evaluation", "finding": "Exact terms and semantic similarity surface different useful evidence, while aggressive reranking can overstate a weak match.", "changed": "Retrieval combines lexical and semantic candidates with gentle reranking and keeps provenance attached." },
      { "source": "Evidence-first drafting tests", "finding": "A plausible sentence can introduce unsupported scope, ownership, or outcome even when the source packet is mostly correct.", "changed": "Unsupported material is removed before drafting and checked again before review." },
      { "source": "20-question RAGAS evaluation", "finding": "The retrieval-answer path recorded high faithfulness on a bounded internal set, but that says nothing about job outcomes.", "changed": "The metric is published with its 20-question denominator and no placement implication." },
      { "source": "Assisted application and browser failure review", "finding": "Brittle scraping, reCAPTCHA, and uncertain form state make fully autonomous submission an unsafe default.", "changed": "Preparation and assisted handling stop at durable human review, with uncertain outbound state treated as failure." }
    ],
    "decisions": [
      { "decision": "Use verified evidence packets before drafting.", "rejected": "Let the language model infer missing skills or outcomes from a job description.", "tradeoff": "Some applications are less expansive, while every public claim remains attributable." },
      { "decision": "Represent human review as durable state.", "rejected": "Pause one browser process and assume the user will return before it expires.", "tradeoff": "The workflow requires persistence and recovery, while approval can survive restarts and delays." },
      { "decision": "Keep application handling assisted at uncertain boundaries.", "rejected": "Bypass reCAPTCHA or guess whether a brittle page successfully submitted.", "tradeoff": "More work returns to the user, while the system avoids silently misrepresenting an outbound action." }
    ],
    "architectureSteps": [
      { "label": "Evidence store", "detail": "Verified experience and project records with provenance" },
      { "label": "Retrieval", "detail": "Hybrid candidate search and gentle reranking" },
      { "label": "Packet", "detail": "Role-specific support with unsupported material removed" },
      { "label": "Review state", "detail": "Durable prepared artifact awaiting a human decision" },
      { "label": "Assisted action", "detail": "Proceed only inside verified browser and submission boundaries" }
    ],
    "failures": [
      { "title": "Drafting outran the evidence", "symptom": "A plausible answer could include a skill or result that the stored record did not support.", "cause": "The generation prompt was asked to produce complete prose before unsupported material was removed.", "correction": "Evidence selection and unsupported-claim filtering moved ahead of drafting and remain visible in review.", "remainingRisk": "New prompt and document paths still need the same provenance tests." },
      { "title": "Fire semantics were unsafe", "symptom": "A retry could make an outbound action uncertain or duplicate because the system did not know whether the previous attempt completed.", "cause": "Preparation state and side-effect state were not separated strongly enough.", "correction": "Consequential work waits in durable review and uncertain action state is not reported as success.", "remainingRisk": "Every supported application platform needs an idempotent, observable completion contract." },
      { "title": "Browser automation met reCAPTCHA", "symptom": "The assisted application path could not reliably continue or prove completion on protected pages.", "cause": "The target platform intentionally requires human verification and changes its markup independently.", "correction": "The workflow stops and returns control instead of attempting to bypass verification or invent a submitted state.", "remainingRisk": "Scraping and page selectors remain brittle even before a verification challenge appears." }
    ],
    "limitations": [
      "The 0.9753 faithfulness result covers 20 internal questions and does not measure applications, interviews, offers, or job placement.",
      "Personal knowledge-base entries, applications, email, credentials, and Telegram content are private and absent from the rendered site.",
      "Browser-assisted application handling is vulnerable to markup changes, authentication, reCAPTCHA, and uncertain submission state.",
      "Committed v2-dev at 4a1447c is the source boundary; current personal KB working-tree changes are excluded and may only inform future work."
    ],
    "evidenceNote": "The published 0.9753 faithfulness score belongs to one 20-question internal RAGAS run. It is not evidence that SecondSelf improves job outcomes or can submit applications autonomously.",
    "future": [
      { "status": "planned", "title": "Publication-safe evidence export", "detail": "Create redacted evaluation fixtures that can be regenerated without touching personal knowledge, credentials, messages, or applications." },
      { "status": "investigating", "title": "Idempotent assisted actions", "detail": "Model action receipts and recovery so a retry cannot duplicate a consequential submission or hide an uncertain result." },
      { "status": "planned", "title": "Evidence coverage review", "detail": "Measure unsupported-claim removal and retrieval misses on a larger privacy-safe application set before adding outcome claims." }
    ],
    "sources": [
      { "label": "SecondSelf committed v2-dev source, tests, and evaluation", "locator": "private audit at v2-dev 4a1447c", "public": false },
      { "label": "Safe RAGAS evaluation record", "locator": "private committed artifact with personal material excluded", "public": false },
      { "label": "Portfolio claim record for faithfulness", "locator": "src/content/claims/secondself-ragas.json", "public": false }
    ],
    "relatedNoteLabel": "Read why the human gate is durable",
    "ending": {
      "heading": "The system can prepare the application. The person remains responsible for sending it.",
      "body": "SecondSelf is strongest when evidence, review, and action state stay visible. More automation is useful only when it preserves that authority.",
      "contactLabel": "Ask me about SecondSelf"
    }
  },
  "claimRefs": ["secondself-ragas"]
}
---
