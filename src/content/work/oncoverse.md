---
{
  "title": "OncoVerse",
  "order": 8,
  "tier": "major",
  "effort": "substantial",
  "status": "in-progress",
  "started": "2026-05",
  "startedSource": { "kind": "repository", "locator": "OncoVerse first Git commit", "public": false },
  "audience": ["employer", "client"],
  "summary": "A cancer education atlas that makes anatomy and disease progression visible while keeping every explanation inside a source boundary.",
  "arrival": { "sentence": "A visual atlas where the unsourced regions stay dim on purpose." },
  "whatItIs": ["OncoVerse is an educational atlas for patients, families, students, and educators.", "It connects anatomy and plain-language explanations to source-backed content rather than offering diagnosis or treatment advice."],
  "problem": ["Immersive health graphics can make thin content feel authoritative.", "The product needs to show what is sourced, what is incomplete, and what still needs medical review without letting visual polish erase those boundaries."],
  "architecture": {
    "decision": "Treat content status and medical review as data that controls what the atlas may reveal.",
    "paragraphs": ["Each directory entry carries structured content, source references, completion state, and review state.", "The visual layer must read those fields directly so incomplete or unreviewed material cannot accidentally look finished." ]
  },
  "measurement": { "claimIds": ["oncoverse-content-scope"] },
  "boundary": {
    "will": ["Explain sourced anatomy and cancer concepts in plain language.", "Mark incomplete and unreviewed content visibly."],
    "refuses": ["Diagnose, recommend treatment, or accept a medical report.", "Use three-dimensional polish to imply a finished medical product."]
  },
  "whatBroke": {
    "title": "The product shape got ahead of the content",
    "paragraphs": ["The atlas concept suggested a broad catalogue while the repository contained one complete entry and four stubs.", "I am keeping the current scope explicit. More anatomy is not a design task; it needs sourced content and medical review first."],
    "noteSlug": "oncoverse-one-complete-entry"
  },
  "stackAndLinks": {
    "stack": ["TypeScript", "structured medical content", "3D research", "source metadata"],
    "links": [{ "label": "View repository", "kind": "repository", "url": "https://github.com/parthtiwari-dev/oncoverse", "verifiedAt": "2026-08-28" }]
  },
  "next": { "slug": "upi-fraud-engine", "label": "Next: UPI Fraud Engine" },
  "world": {
    "story": "One sourced region becomes visible while incomplete regions remain dim and the medical-review boundary stays attached to the content.",
    "dataSources": ["atlas content JSON", "source metadata", "review-state fields"],
    "storyboardStatus": "specced",
    "motionDeferred": true
  },
  "caseStudy": {
    "reviewedAt": "2026-08-31",
    "classification": "Source-backed cancer education",
    "thesis": "OncoVerse uses anatomy as an educational interface, but content completion and medical review state decide what the atlas is allowed to reveal.",
    "credit": {
      "organization": "Personal project",
      "role": "Product engineer",
      "contribution": "I designed the atlas concept, structured content directory, source metadata, review-state contract, Medullary Thyroid Carcinoma entry, and the acceptance path that keeps unfinished medical content from looking complete.",
      "contributionSummary": "Atlas concept, content model, sourcing, and review states"
    },
    "cover": {
      "proof": { "kind": "image", "src": "/media/oncoverse-atlas.png", "alt": "The committed OncoVerse atlas artwork used by the source-backed cancer education interface", "width": 343, "height": 361, "fit": "contain" },
      "labels": ["Committed atlas asset", "Main at f8bdbd3"]
    },
    "headings": {
      "overview": "The anatomy is an interface. The review state is the guardrail.",
      "problem": "A beautiful health atlas can make incomplete content look medically complete.",
      "architectureCaption": "Directory state controls what the atlas may expose",
      "evidence": "One entry is complete out of five, and it still needs medical review."
    },
    "intendedUser": "Patients, families, students, and educators looking for plain-language cancer education tied to visible anatomy and explicit source and review boundaries.",
    "demo": {
      "kind": "record",
      "label": "Committed content inventory",
      "title": "The atlas shape is ahead of the content",
      "sourceLabel": "Committed main at f8bdbd3",
      "rows": [
        { "label": "Directory entries", "value": "Five" },
        { "label": "Complete entries", "value": "One", "tone": "warn" },
        { "label": "Complete topic", "value": "Medullary Thyroid Carcinoma" },
        { "label": "Medical review", "value": "Still required", "tone": "blocked" }
      ],
      "caption": "This is a readable rendering of the committed content directory. It is the primary product proof because the current uncommitted anatomy work is outside the audited source boundary."
    },
    "workflow": [
      { "title": "Choose anatomy as the index", "description": "The atlas connects a body region to plain-language disease material instead of beginning with a dense article list.", "proof": { "kind": "image", "src": "/media/oncoverse-atlas.png", "alt": "The committed OncoVerse atlas illustration used as the anatomy-led navigation surface", "width": 343, "height": 361, "fit": "contain" } },
      { "title": "Read structured content state", "description": "Each directory entry carries completeness, sourcing, and medical-review fields that the interface must obey.", "proof": { "kind": "record", "label": "Directory record", "title": "Visibility follows content state", "sourceLabel": "Committed content directory", "rows": [
        { "label": "Complete", "value": "May render with its sources" }, { "label": "Stub", "value": "Remains visibly incomplete", "tone": "warn" }, { "label": "Review pending", "value": "Cannot appear medically approved", "tone": "blocked" }
      ] } },
      { "title": "Accept content through a gate", "description": "A topic moves from draft to complete only after its structured sections and sources exist, then retains a separate medical-review state.", "proof": { "kind": "record", "label": "Acceptance record", "title": "Complete is not reviewed", "sourceLabel": "Committed MTC content entry", "rows": [
        { "label": "Topic", "value": "Medullary Thyroid Carcinoma" }, { "label": "Content state", "value": "Complete", "tone": "pass" }, { "label": "Review state", "value": "Needs medical review", "tone": "warn" }
      ] } }
    ],
    "responsibilities": [
      { "label": "Product", "detail": "Anatomy-led navigation, educational reading sequence, boundary copy, and incomplete-state treatment." },
      { "label": "Content system", "detail": "Structured cancer entries, source metadata, completeness, review state, and acceptance rules." },
      { "label": "Research", "detail": "Medical source boundaries, visual-authority risk, atlas feasibility, and staged 3D exploration." }
    ],
    "research": [
      { "source": "Anatomy-as-interface studies", "finding": "Spatial context can make disease location easier to understand than a flat directory, but it also increases perceived authority.", "changed": "Anatomy became navigation while source and review state stayed visible in the reading layer." },
      { "source": "Content inventory audit", "finding": "The ambitious atlas shape contained one complete entry and four stubs.", "changed": "The site now publishes the exact scope instead of letting the interface imply a full cancer catalogue." },
      { "source": "Medical source-boundary review", "finding": "Educational explanations need explicit sourcing and must not drift into diagnosis or treatment recommendation.", "changed": "Each entry carries sources and the product refuses report interpretation, diagnosis, and treatment advice." },
      { "source": "Model-acceptance pipeline design", "finding": "Visual completion, content completion, and medical review are separate states.", "changed": "The content model keeps those states separate so a polished render cannot promote an unreviewed entry." }
    ],
    "decisions": [
      { "decision": "Let content and review state control visibility.", "rejected": "Render every atlas region and add real content later.", "tradeoff": "The atlas looks sparse, while incomplete medical material cannot masquerade as finished education." },
      { "decision": "Keep the current case study static and paper-first.", "rejected": "Use Three.js polish as proof that the educational product is complete.", "tradeoff": "The page is less immersive, while proof remains tied to committed content rather than a world prototype." },
      { "decision": "Separate complete from medically reviewed.", "rejected": "Treat a filled content schema as equivalent to expert approval.", "tradeoff": "Even the strongest entry retains a warning until qualified review exists." }
    ],
    "architectureSteps": [
      { "label": "Directory", "detail": "Lists cancer topics, anatomy mapping, completion, and review state" },
      { "label": "Content entry", "detail": "Stores plain-language sections and attached medical sources" },
      { "label": "Acceptance", "detail": "Checks required structure without claiming medical approval" },
      { "label": "Atlas surface", "detail": "Reveals only what the content and review fields permit" },
      { "label": "Reader boundary", "detail": "Education only, with no diagnosis or treatment recommendation" }
    ],
    "failures": [
      { "title": "The atlas promised more than the repository contained", "symptom": "A broad visual catalogue suggested many finished cancer topics.", "cause": "The product shape and visual research advanced before the source-backed content inventory.", "correction": "The current scope is published as one complete entry across five, with four stubs left visibly incomplete.", "remainingRisk": "Adding regions faster than sourced content would recreate the same mismatch." },
      { "title": "Complete could be mistaken for reviewed", "symptom": "A structurally filled entry could look medically approved even while review was pending.", "cause": "Content completeness and expert review were initially easy to collapse into one status.", "correction": "The model now keeps completion and medical review as separate fields and interface states.", "remainingRisk": "The MTC entry still needs qualified medical review." },
      { "title": "Three-dimensional polish became a shortcut", "symptom": "3D exploration risked becoming the visible proof before content, accessibility, and medical review were ready.", "cause": "The immersive surface was easier to showcase than the less glamorous content pipeline.", "correction": "This case study uses committed static evidence; Three.js remains a later world decision.", "remainingRisk": "Future 3D work still needs performance, accessibility, and source-state parity gates." }
    ],
    "limitations": [
      "Only one of five directory entries is complete, and that Medullary Thyroid Carcinoma entry still needs medical review.",
      "OncoVerse is educational only and is not a diagnostic system, treatment recommender, or medical-report interpreter.",
      "The current static proof does not establish that the full atlas interaction or 3D research is production-ready.",
      "Committed main at f8bdbd3 is the source boundary; current uncommitted anatomy work is excluded and may only appear as future work."
    ],
    "evidenceNote": "The published 1-of-5 result is a repository content inventory. It describes scope, not medical quality, readership, completion velocity, or clinical validation.",
    "future": [
      { "status": "planned", "title": "Medical review for the MTC entry", "detail": "Have the complete entry reviewed before changing its review-state label or making stronger quality claims." },
      { "status": "planned", "title": "Source-backed directory expansion", "detail": "Add topics only through the same structured source and acceptance path, with the denominator updated in the claim record." },
      { "status": "investigating", "title": "Accessible spatial atlas", "detail": "Evaluate whether a later 3D world improves understanding while preserving keyboard, reduced-motion, mobile, and no-canvas reading paths." }
    ],
    "sources": [
      { "label": "OncoVerse committed repository, content directory, and MTC entry", "locator": "private audit at main f8bdbd3", "public": false },
      { "label": "OncoVerse public repository", "locator": "https://github.com/parthtiwari-dev/oncoverse", "public": true },
      { "label": "Portfolio content-scope claim record", "locator": "src/content/claims/oncoverse-content-scope.json", "public": false }
    ],
    "relatedNoteLabel": "Read the content-scope correction",
    "ending": {
      "heading": "The atlas becomes trustworthy one sourced, reviewed entry at a time.",
      "body": "The product does not need a larger visual promise. It needs more complete source-backed content and a review state that remains impossible to miss.",
      "contactLabel": "Ask me about OncoVerse"
    }
  },
  "claimRefs": ["oncoverse-content-scope"]
}
---
