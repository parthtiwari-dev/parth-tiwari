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
  "caseStudy": {
    "reviewedAt": "2026-08-31",
    "classification": "Public-interest information system",
    "thesis": "Tathya preserves who said what, where it came from, and what remains unresolved without pretending that a language model can issue the final verdict.",
    "credit": {
      "organization": "Personal project",
      "role": "Product engineer",
      "contribution": "I designed and built the source ingestion, duplicate handling, topic identity, claim clustering, case-file workflow, product interface, and the boundary that removes verdicts and source ranking from the product contract.",
      "contributionSummary": "Product, ingestion, evidence model, and interface"
    },
    "cover": {
      "proof": { "kind": "image", "src": "/media/tathya-desktop.jpg", "alt": "The real Tathya interface showing a public case-file feed with dated source material", "width": 2880, "height": 1800 },
      "labels": ["Real product capture", "Committed main at bf4606f"]
    },
    "headings": {
      "overview": "A case file that keeps the source trail attached.",
      "problem": "Organising disagreement is useful. Pretending to settle it is not.",
      "architectureCaption": "From source intake to an unresolved cited record",
      "evidence": "The product exists. A stable quality denominator does not yet."
    },
    "intendedUser": "Readers, researchers, journalists, and civic teams that need a sourced record of institutional and editorial claims without receiving an opaque truth score.",
    "demo": {
      "kind": "video",
      "src": "/media/tathya.webm",
      "poster": "/media/tathya-desktop.jpg",
      "durationLabel": "Real product recording",
      "caption": "A real recording of the committed Tathya product surface. It proves the feed and case-file interface, not corpus completeness or editorial quality."
    },
    "workflow": [
      {
        "title": "Ingest distinct sources",
        "description": "Official and editorial material enter as separate source records so provenance survives later grouping.",
        "proof": { "kind": "image", "src": "/media/tathya-desktop.jpg", "alt": "Tathya desktop feed showing distinct dated records and their visible source context", "width": 2880, "height": 1800 }
      },
      {
        "title": "Keep the reader's path intact",
        "description": "The mobile surface preserves the same source-first reading path without collapsing disagreement into a score.",
        "proof": { "kind": "image", "src": "/media/tathya-mobile.jpg", "alt": "Tathya mobile feed showing the same source-led case-file reading experience", "width": 1170, "height": 1992 }
      },
      {
        "title": "End without a verdict",
        "description": "A case file may group related claims and citations, but the unresolved state stays visible when the evidence cannot support a conclusion.",
        "proof": { "kind": "record", "label": "Evidence record", "title": "Case-file boundary", "sourceLabel": "Committed Tathya source and mission contract", "rows": [
          { "label": "Input", "value": "Official and editorial source records" },
          { "label": "Grouping", "value": "Duplicate handling, stable topic identity, and cited claims" },
          { "label": "Output", "value": "Sourced case file", "tone": "pass" },
          { "label": "Not produced", "value": "Verdict, ranking, or sentiment score", "tone": "blocked" }
        ] }
      }
    ],
    "responsibilities": [
      { "label": "Product", "detail": "Mission boundary, reader workflow, case-file structure, and the removal of verdict language." },
      { "label": "Data", "detail": "Source ingestion, normalisation, duplicate handling, stable topic identity, claims, citations, and database workflow." },
      { "label": "Interface", "detail": "Responsive public record, source visibility, unresolved states, and failure-facing copy." }
    ],
    "research": [
      { "source": "Official and editorial source separation", "finding": "Publisher role is part of the evidence context and should not disappear during normalisation.", "changed": "The source model preserves provenance and source type instead of flattening every item into interchangeable text." },
      { "source": "Mission and ethics review", "finding": "A truth score would transfer editorial authority to a system whose evidence can be partial, duplicated, or stale.", "changed": "Verdicts, sentiment ranking, and publisher scoring were removed from the product contract." },
      { "source": "Stable topic identity and duplicate failure review", "finding": "Repeated ingestion could create stale duplicate claims and split one continuing subject across several case files.", "changed": "Duplicate handling and durable topic identity became upstream requirements rather than presentation cleanup." },
      { "source": "Generation error and promotable-gate audit", "finding": "Silently swallowed generation failures and a suppressive promotable gate could hide records rather than explain why they were incomplete.", "changed": "The gate was removed from the publishing contract and incomplete processing now belongs in visible workflow state." }
    ],
    "decisions": [
      { "decision": "Preserve source roles and citations through every transformation.", "rejected": "Flatten all retrieved text before clustering and restore provenance at the end.", "tradeoff": "The data model and ingestion work are heavier, but the reader can inspect the actual record." },
      { "decision": "Group evidence without producing a final verdict.", "rejected": "Generate a confidence score or true-or-false label for each case file.", "tradeoff": "The product gives less immediate closure, but it does not manufacture authority the sources cannot support." },
      { "decision": "Treat incomplete generation as workflow state.", "rejected": "Suppress failed records behind an internal promotable flag.", "tradeoff": "The interface must explain more operational uncertainty, while silent disappearance becomes less likely." }
    ],
    "architectureSteps": [
      { "label": "Source intake", "detail": "Collect and preserve official or editorial provenance" },
      { "label": "Identity", "detail": "Normalise records, handle duplicates, and retain stable topic identity" },
      { "label": "Clustering", "detail": "Group related claims without merging away disagreement" },
      { "label": "Case file", "detail": "Attach citations, dates, processing state, and unresolved evidence" },
      { "label": "Reader", "detail": "Inspect the record and decide without a generated verdict" }
    ],
    "failures": [
      { "title": "Some source jobs failed silently", "symptom": "A source could disappear from the visible record without a useful explanation.", "cause": "PIB and other source failures were swallowed inside generation or ingestion paths.", "correction": "Failure state was separated from editorial eligibility and included in the workflow audit.", "remainingRisk": "Source-specific reliability still needs stable operational monitoring." },
      { "title": "Repeated ingestion created stale claims", "symptom": "Duplicated or outdated material could survive beside a newer version of the same claim.", "cause": "Topic identity and duplicate handling were not strong enough across repeated collection runs.", "correction": "Stable identity and duplicate handling moved ahead of clustering and publication.", "remainingRisk": "No publishable corpus-quality benchmark yet proves the policy across the full record." },
      { "title": "A gate suppressed more than it explained", "symptom": "The promotable flag could keep a record out of view without making the underlying failure legible.", "cause": "Publishing eligibility and processing health were coupled into one suppressive field.", "correction": "The suppressive gate was removed from the product contract and incomplete state remains visible.", "remainingRisk": "Database workflow gaps still need explicit recovery tests before the record can be called operationally complete." }
    ],
    "limitations": [
      "There is no stable public corpus export or quality benchmark, so no corpus size, freshness, or clustering score is published.",
      "Source availability and publisher formatting can still break ingestion in project-specific ways.",
      "The current product is a public-record organiser, not a newsroom, fact-checking authority, or substitute for primary-source reading.",
      "Committed main at bf4606f is the source boundary; current working-tree configuration changes are excluded."
    ],
    "evidenceNote": "The real product recording and captures establish that the source-led interface exists. They do not establish coverage, neutrality, or correctness across a stable corpus, so those numbers are absent.",
    "future": [
      { "status": "planned", "title": "Stable corpus audit", "detail": "Produce a repeatable export with source, duplicate, freshness, and unresolved-record denominators before publishing coverage claims." },
      { "status": "investigating", "title": "Source-specific recovery", "detail": "Make source failures visible, retryable, and attributable without turning operational health into an editorial ranking." },
      { "status": "planned", "title": "Database workflow repair", "detail": "Close the known persistence and lifecycle gaps, then verify a complete source-to-case-file run from committed state." }
    ],
    "sources": [
      { "label": "Tathya committed repository history and product docs", "locator": "private audit at main bf4606f", "public": false },
      { "label": "Real Tathya product recording and responsive captures", "locator": "publication-cleared portfolio media", "public": false },
      { "label": "Published Tathya product", "locator": "https://tathya-1.vercel.app", "public": true }
    ],
    "relatedNoteLabel": "Read why Tathya does not issue a verdict",
    "ending": {
      "heading": "The record can organise evidence. The conclusion stays with the reader.",
      "body": "Tathya is most useful when the source trail remains stronger than the interface around it. The next work is operational proof, not a more confident verdict.",
      "contactLabel": "Ask me about Tathya"
    }
  },
  "claimRefs": []
}
---
