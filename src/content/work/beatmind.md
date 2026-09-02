---
{
  "title": "BeatMind",
  "order": 1,
  "tier": "flagship",
  "effort": "flagship",
  "status": "live",
  "started": "2026-07",
  "startedSource": { "kind": "repository", "locator": "BeatMind first Git commit", "public": false },
  "audience": ["employer", "client"],
  "summary": "A music workspace that separates a song, understands its structure, lets people rearrange it, and survives failed workers.",
  "arrival": { "sentence": "A song goes in whole and comes back in parts you can actually work with." },
  "whatItIs": [
    "BeatMind is a browser-based music workspace for separating a track into stems, reading its musical structure, arranging sections, mixing the result, and rendering a new version.",
    "The visible editor is only half the product. Under it is a long-running pipeline built to keep its state honest when remote workers fail or return late."
  ],
  "problem": [
    "Audio generation jobs do not finish inside a normal request. Separation, analysis, arrangement, and rendering each have different runtimes and failure modes, so a single loading screen quickly becomes a lie.",
    "The hard problem was deciding which system owns each stage, how retries remain idempotent, and what the person sees after a refresh or interrupted worker."
  ],
  "architecture": {
    "decision": "Treat every expensive stage as durable work with its own state, attempt identity, and recovery path.",
    "paragraphs": [
      "The web application owns projects and user-facing state. Independently deployed Python services own generation, separation, analysis, and rendering.",
      "Attempt tokens fence late callbacks, operation locks stop duplicate expensive work, and the UI reveals completed layers instead of inventing cosmetic progress."
    ]
  },
  "measurement": { "claimIds": ["beatmind-current-tests", "beatmind-separation-benchmark"] },
  "boundary": {
    "will": ["Show durable job state and recovery truthfully.", "Let a person hear and edit the separated result."],
    "refuses": ["Call a timed-out browser request a failed remote job.", "Publish account counts without the Clerk record and a counting definition."]
  },
  "whatBroke": {
    "title": "I removed a consent gate while cleaning up the upload flow",
    "paragraphs": ["A copyright confirmation looked like friction, so I deleted it. That made the interface cleaner and the product less responsible.", "The correction was to restore explicit consent and treat legal and user-trust constraints as product requirements, not optional copy."],
    "noteSlug": "beatmind-copyright-consent"
  },
  "stackAndLinks": {
    "stack": ["Next.js", "TypeScript", "Python", "PostgreSQL", "Modal", "Cloudflare R2"],
    "links": [{ "label": "Open BeatMind", "kind": "live", "url": "https://www.beatmind.tech", "verifiedAt": "2026-08-28" }]
  },
  "next": { "slug": "vivid", "label": "Next: Vivid" },
  "world": {
    "story": "Native scroll moves from one track through five separated stems, analysis, arrangement, render, a dead worker, and a successful retry.",
    "dataSources": ["real exported stem envelopes", "analysis markers", "durable job trace"],
    "storyboardStatus": "built",
    "motionDeferred": false
  },
  "caseStudy": {
    "reviewedAt": "2026-08-31",
    "classification": "Music systems",
    "thesis": "BeatMind turns a generated or uploaded track into musical material a person can inspect, rearrange, mix, and render without lying about work still happening in the background.",
    "credit": {
      "organization": "Stick and Dot",
      "role": "AI/ML Intern",
      "contribution": "I designed and built BeatMind end to end. Founder and early-user feedback shaped later product refinements; no one else contributed to the implementation.",
      "contributionSummary": "Design and engineering, end to end"
    },
    "cover": {
      "proof": { "kind": "image", "src": "/media/beatmind-desktop.jpg", "alt": "BeatMind's real public product page showing a five-stem record visualization", "width": 2880, "height": 1800 },
      "labels": ["Real product surface", "Five-stem model"]
    },
    "headings": {
      "overview": "More control than a prompt box. Less friction than starting in a DAW.",
      "problem": "The browser can stop waiting. The work cannot pretend it stopped.",
      "architectureCaption": "One durable path, with late work fenced out",
      "evidence": "Two measurements I can defend. No adoption theatre."
    },
    "intendedUser": "Electronic music makers who want more control than a prompt box without beginning every idea inside a full digital audio workstation.",
    "demo": {
      "kind": "video",
      "src": "/media/beatmind.webm",
      "poster": "/media/beatmind-desktop.jpg",
      "durationLabel": "10.7-second product capture",
      "caption": "A real capture of the current BeatMind product. It shows the public product surface; it is not a simulated interface or an animated world frame."
    },
    "workflow": [
      {
        "title": "Begin with intent",
        "description": "Start from a prompt or bring an existing track. Both paths become durable project work rather than a browser request that must stay open.",
        "proof": { "kind": "image", "src": "/media/beatmind-create.jpg", "alt": "BeatMind's real dark Create screen with prompt, lyrics, duration, and mode controls", "width": 1552, "height": 784 }
      },
      {
        "title": "Pull the track apart",
        "description": "Separation produces practical vocals, backing, drums, bass, and other lanes, then analysis maps sections, chords, tempo, key, and energy.",
        "proof": { "kind": "image", "src": "/media/beatmind-editor.jpg", "alt": "BeatMind's real editor showing separated coloured stem lanes and musical controls", "width": 1552, "height": 784 }
      },
      {
        "title": "Work section by section",
        "description": "The arrangement turns musical structure into an editable section-by-stem grid before the result is mixed and rendered.",
        "proof": { "kind": "image", "src": "/media/beatmind-arrangement-clean.png", "alt": "BeatMind's real arrangement workspace with sections and five stem families", "width": 1904, "height": 972 }
      }
    ],
    "responsibilities": [
      { "label": "Product", "detail": "Workflow, interaction model, feedback-led refinements, and rights boundary." },
      { "label": "Frontend", "detail": "Creation, library, editor, arrangement, mixing, rendering, and truthful state." },
      { "label": "Systems", "detail": "Generation, separation, analysis, storage transport, durable jobs, retries, and recovery." }
    ],
    "research": [
      {
        "source": "BandLab, Splice, Suno, and Udio",
        "finding": "Generation tools made starting fast, while production tools exposed more control after the first result.",
        "changed": "BeatMind was framed around the handoff from whole track to editable musical parts instead of another prompt-only generator."
      },
      {
        "source": "ElevenLabs Music and Moises",
        "finding": "People need clear identity, progressive disclosure, and visible structure while expensive audio work continues.",
        "changed": "The interface reveals completed layers and keeps project state durable across refreshes instead of showing cosmetic progress."
      },
      {
        "source": "ACE-Step and source-separation model trials",
        "finding": "One model did not cover generation, reference conditioning, separation, repainting, and instrument-level work equally well.",
        "changed": "The system split generation, separation, analysis, and rendering into independently deployable services with explicit boundaries."
      },
      {
        "source": "Founder and early-user feedback",
        "finding": "The product needed clearer progress, safer upload language, and a path from an initial track into meaningful editing.",
        "changed": "Later refinements restored the rights gate, clarified long-running state, and tightened the path into the arrangement."
      }
    ],
    "decisions": [
      {
        "decision": "Make every expensive stage a durable operation with attempt identity and recovery.",
        "rejected": "Hold one browser request open until generation or separation finishes.",
        "tradeoff": "The state machine is more work to build, but refreshes and late workers can no longer silently rewrite the current project state."
      },
      {
        "decision": "Send audio directly between the browser and object storage.",
        "rejected": "Route large audio files through the application host.",
        "tradeoff": "Direct transfer needs careful signed URLs and CORS rules, but it avoids using the web server as an expensive byte pipe."
      },
      {
        "decision": "Use polling for the current small-pilot operating target.",
        "rejected": "Add sockets and a queue before the product needed them.",
        "tradeoff": "Updates are not instant to the millisecond, but the recovery model stays simpler and inspectable while the product is still learning."
      }
    ],
    "architectureSteps": [
      { "label": "Browser", "detail": "Uploads directly and reads committed project state" },
      { "label": "Web application", "detail": "Creates the operation and exposes honest progress" },
      { "label": "Audio service", "detail": "Generates, separates, analyses, or renders" },
      { "label": "Fenced commit", "detail": "Accepts the current attempt and refuses late work" }
    ],
    "failures": [
      {
        "title": "Regenerate finished, but playback did not change",
        "symptom": "The interface reported a completed regeneration while the player still used the original audio and showed a mismatched duration.",
        "cause": "Overlapping playback and result-selection defects hid each other, so fixing one symptom did not repair the visible experience.",
        "correction": "I traced the complete result path, corrected which asset became current, and made duration follow the selected audio rather than stale state.",
        "remainingRisk": "Every new render path still needs an end-to-end playback check, not only a worker success response."
      },
      {
        "title": "The website survived while the pipeline died",
        "symptom": "The application stayed available, but a completed worker could not commit its result and the project never became usable.",
        "cause": "A callback followed an unexpected POST redirect while object-storage CORS separately blocked the browser transfer path.",
        "correction": "I corrected the callback target and storage policy, then treated application health and pipeline health as separate release checks.",
        "remainingRisk": "An HTTP-success smoke test cannot prove that remote audio work completes, commits, and reloads correctly."
      },
      {
        "title": "Musical bars cut through sung phrases",
        "symptom": "Technically aligned section cuts landed inside vocal phrases and sounded broken when rearranged.",
        "cause": "Bar boundaries were treated as sufficient even when the vocal energy around the boundary said otherwise.",
        "correction": "Section edges moved toward quieter vocal points and gained short fades so musical edits did not sound like raw array slices.",
        "remainingRisk": "Automatic boundaries remain an assistive first pass; difficult material still needs a person to listen."
      },
      {
        "title": "I removed the upload consent gate",
        "symptom": "The upload flow became cleaner while the product stopped asking the person to confirm their right to use the audio.",
        "cause": "I treated a trust and rights requirement as removable interface friction.",
        "correction": "I restored explicit consent and made rights lineage part of the product boundary rather than optional copy.",
        "remainingRisk": "A consent checkbox cannot establish ownership by itself, so export rules still have to follow the track's origin."
      }
    ],
    "limitations": [
      "Separation is most dependable as vocals, backing, drums, bass, and other; lead instruments and pads can still collapse into the other lane.",
      "The backing-vocal path can retain lead-vocal bleed, especially when the source already has dense effects or stacked voices.",
      "Energy is currently understood at project level rather than as a separately editable curve for every stem.",
      "Groove and sound-palette controls stay out of the product until their timing and timbre data can be verified and wired honestly.",
      "This is still a small pilot, not evidence of broad multi-user adoption, and some touch targets still need a dedicated device pass."
    ],
    "evidenceNote": "I am not publishing a user count here. The account record and the definition of user need to agree before that number belongs in a case study.",
    "future": [
      {
        "status": "planned",
        "title": "Whole-track lane generation",
        "detail": "Generate a missing musical lane across the complete arrangement while preserving section boundaries and project lineage."
      },
      {
        "status": "planned",
        "title": "A broader pilot",
        "detail": "Test the complete create, separate, arrange, render, retry, and reload path with more people before making adoption claims."
      },
      {
        "status": "investigating",
        "title": "Groove editing",
        "detail": "Expose timing feel only after microtiming measurements survive real material and do not reduce groove to a decorative control."
      },
      {
        "status": "blocked",
        "title": "Sound-palette matching",
        "detail": "This remains blocked until useful timbre embeddings can support a result that is explainable and repeatable."
      }
    ],
    "sources": [
      { "label": "BeatMind product repository and release records", "locator": "private BeatMind repository", "public": false },
      { "label": "BeatMind architecture, product, and research documents", "locator": "private BeatMind docs", "public": false },
      { "label": "Published BeatMind product", "locator": "https://www.beatmind.tech", "public": true },
      { "label": "Portfolio claim records", "locator": "src/content/claims", "public": true }
    ],
    "relatedNoteLabel": "Read the consent-gate erratum",
    "ending": {
      "heading": "The product is live. The record stays open.",
      "body": "BeatMind will change. When the evidence changes, this page should change with it.",
      "contactLabel": "Ask me about BeatMind"
    }
  },
  "claimRefs": ["beatmind-current-tests", "beatmind-separation-benchmark"]
}
---
