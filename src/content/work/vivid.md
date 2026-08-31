---
{
  "title": "Vivid",
  "order": 2,
  "tier": "flagship",
  "effort": "flagship",
  "status": "live",
  "started": "2026-07",
  "startedSource": { "kind": "repository", "locator": "Vivid first Git commit", "public": false },
  "audience": ["employer", "client"],
  "summary": "A script-to-storyboard system that plans a scene as a sequence and tries to keep the same people recognisable from shot to shot.",
  "arrival": { "sentence": "A script becomes a sequence, and the same character has to survive every frame." },
  "whatItIs": [
    "Vivid turns a written idea, scene, or screenplay into an ordered sequence of generated photographs. A planner establishes the world, cast, camera language, and continuity before the image worker renders each shot.",
    "The product has three entry points: one-off image generation, a planned scene of two to six shots, and a longer script broken into scenes. Every sequence can be reviewed, regenerated shot by shot, edited with language, colour-graded, and exported.",
    "Continuity is the product. A beautiful isolated frame is not a successful result if the next frame loses the person, invents another actor, or repeats the previous pose."
  ],
  "problem": [
    "Image generators are good at making one persuasive frame. A storyboard asks for something harder: the same people, world, light, and visual intent across a sequence while every shot still moves the story forward.",
    "References can preserve identity and still damage the result. A previous frame may drag its pose and composition forward, a single anchor may omit a second character, and a faster model may improve aggregate scores while creating an obvious duplicate person.",
    "The engineering problem is therefore not generation alone. It is planning, reference binding, measurable evaluation, human review, GPU economics, and a release rule that can reject an attractive speedup."
  ],
  "architecture": {
    "decision": "Keep one generation engine, make continuity explicit in the plan, and require evidence before a new profile can become production.",
    "paragraphs": [
      "A React and Vite browser app calls thin FastAPI routes on Modal. A Groq planner writes a world bible, character bible, structured shots, and continuity notes. One bounded L40S worker loads the FLUX.2 pipeline and generates each shot serially.",
      "The production path still uses one legacy character reference. Named single-reference and multi-reference candidates now exist in source, but they remain behind a gated evaluation sequence and have not replaced production.",
      "Evaluation records identity, prompt adherence, realism, creativity, time, cost, and provenance. Automated scores narrow the search; a human visual gate still decides whether duplicated people, missing cast, pose copying, or broken hands make a result unshippable."
    ]
  },
  "measurement": { "claimIds": ["vivid-pre-rebuild-evaluation", "vivid-turbo-evaluation"] },
  "boundary": {
    "will": [
      "Show real evaluation frames and the numbers attached to their fixed test set.",
      "Keep a slower production profile when a faster result fails the visual gate.",
      "Separate proven production behaviour from source-only experiments and future targets."
    ],
    "refuses": [
      "Call one attractive frame evidence of sequence continuity.",
      "Promote an aggregate score when a person is visibly duplicated or missing.",
      "Present source-only Phase 4 reference work as deployed quality.",
      "Treat non-commercial model weights as a solved launch licence."
    ]
  },
  "whatBroke": {
    "title": "The faster pipeline lost the person",
    "paragraphs": [
      "Turbo reduced accepted GPU time by 5.90 times across the fixed 42-shot evaluation, and its aggregate identity and realism scores rose. Visual review still found systematic duplicated people, while one text-heavy scene lost identity.",
      "I did not promote it. Turbo remains an iteration profile, the slower base path remains production, and the rejected result became part of the evaluation record instead of being edited out of the story."
    ],
    "noteSlug": "vivid-faster-was-worse"
  },
  "stackAndLinks": {
    "stack": ["React", "Vite", "Python", "FastAPI", "PyTorch", "FLUX.2", "Groq", "Modal", "ArcFace"],
    "links": [{ "label": "Open Vivid", "kind": "live", "url": "https://vivid-alpha.vercel.app", "verifiedAt": "2026-08-28" }]
  },
  "next": { "slug": "tathya", "label": "Next: Tathya" },
  "world": {
    "story": "A screenplay moves through a story loom: scene cards establish the world, character anchors bind the cast, contact sheets resolve into several visual treatments, and the rejected fast result is exposed beside the selected baseline.",
    "dataSources": ["generation evaluation JSON", "LoRA training log", "generated storyboard frames"],
    "storyboardStatus": "prototyped",
    "motionDeferred": true
  },
  "caseStudy": {
    "classification": "Generative imaging",
    "thesis": "Vivid turns a written scene into a sequence of photographs, then treats continuity, visual review, and the decision not to ship a faster but worse model as first-class product work.",
    "credit": {
      "organization": "Stick and Dot",
      "role": "AI/ML Development Intern",
      "contribution": "At Stick and Dot, I rebuilt and evaluated Vivid's generation path across the FLUX.2 migration, planning and reference conditioning, the fixed evaluation harness, deployment behaviour, and the browser workflow. This page describes my contribution without claiming ownership of the company product.",
      "contributionSummary": "Generation pipeline, evaluation, and product delivery"
    },
    "cover": {
      "src": "/media/vivid-eval-shot-04.jpg",
      "alt": "A real Vivid evaluation frame showing the recurring ceramic artist holding a blue bowl in her workshop",
      "width": 1152,
      "height": 640,
      "labels": ["Real evaluation frame", "Fixed sequence, not a mockup"]
    },
    "headings": {
      "overview": "The frame is not the product. The sequence is.",
      "problem": "Every new shot has to change the picture without changing the person.",
      "architectureCaption": "One story plan, one serial image worker, one evidence trail",
      "evidence": "The baseline is measured. The best speedup was still rejected."
    },
    "intendedUser": "Filmmakers pitching a scene, writers pre-visualising a script, and small creative teams that need a coherent visual sequence before they have a camera, cast, or production budget.",
    "demo": {
      "src": "/media/stick-and-dot.webm",
      "poster": "/media/stick-and-dot-desktop.jpg",
      "durationLabel": "10.1-second product capture",
      "caption": "A real recording of Vivid's browser workflow. It proves the product surface and controls, not current generation quality; the fixed evaluation frames below carry that evidence."
    },
    "workflow": [
      {
        "title": "Describe the scene",
        "description": "The browser accepts a scene, seed, style, and generation mode. Planning can turn the same input into a structured sequence instead of one disconnected image.",
        "media": "/media/stick-and-dot-desktop.jpg",
        "alt": "The real Vivid generation interface with scene, seed, style, planning, and render controls",
        "width": 2880,
        "height": 1800,
        "fit": "contain"
      },
      {
        "title": "Establish the person",
        "description": "The first evaluated shot establishes the recurring ceramic artist, workshop, wardrobe, light, and visual texture that later shots must preserve.",
        "media": "/media/vivid-eval-shot-01.jpg",
        "alt": "A real Vivid evaluation frame establishing a ceramic artist seated in a wooden workshop",
        "width": 1152,
        "height": 640
      },
      {
        "title": "Advance the story",
        "description": "A later shot changes framing and action while keeping the person and workshop recognisable. The sequence remains evaluation evidence, not a claim that identity is solved.",
        "media": "/media/vivid-eval-shot-04.jpg",
        "alt": "A later real Vivid evaluation frame showing the same ceramic artist presenting a blue bowl",
        "width": 1152,
        "height": 640
      }
    ],
    "responsibilities": [
      { "label": "Product", "detail": "Three entry modes, script-to-shot workflow, regeneration, semantic editing, review, and export behaviour." },
      { "label": "Generation", "detail": "FLUX.2 migration, prompt planning, character anchors, reference selection, warmup, memory limits, and deployment path." },
      { "label": "Evaluation", "detail": "Fixed scenes, deterministic seeds, identity and VLM metrics, resumable evidence, cost tracking, and mandatory visual review." }
    ],
    "research": [
      {
        "source": "The complete main-to-upgrade-flux repository history",
        "finding": "The product evolved from FLUX.1 with PuLID and stacked LoRA experiments into one FLUX.2 pipeline with native image references and a hand-merged quantised text encoder.",
        "changed": "The rebuild kept the planner and product workflow, removed incompatible model paths, and concentrated generation in one measured engine instead of carrying parallel legacy implementations."
      },
      {
        "source": "The fixed 12-scene, 42-shot evaluation set",
        "finding": "Broad lighting and environment quality were often strong, while identity, exact cast count, text, hands, and Indian-context details exposed repeatable failures.",
        "changed": "Identity, adherence, realism, creativity, speed, cost, and provenance became explicit gates instead of relying on a handful of attractive outputs."
      },
      {
        "source": "Human review beside structured VLM and ArcFace scores",
        "finding": "An automated judge missed an obvious extra person, and Turbo's aggregate scores hid visible duplication in individual scenes.",
        "changed": "Every promotion now requires per-scene inspection and exact people-count review; automated metrics can reject a candidate but cannot approve one alone."
      },
      {
        "source": "FLUX.2 reference-conditioning experiments",
        "finding": "Rendered prior shots carry useful identity and harmful pose or composition. A single unnamed anchor also cannot bind two or three recurring people reliably.",
        "changed": "The current plan tests named one-person and multi-person reference profiles within a fixed image-area budget, while production remains on the measured legacy path."
      }
    ],
    "decisions": [
      {
        "decision": "Keep one serial L40S worker and one bounded executor per container.",
        "rejected": "Introduce a queue, WebSockets, multi-GPU sharding, or parallel generation before the product needs them.",
        "tradeoff": "A story is not realtime, but the operating model stays understandable, memory-bounded, and honest at the current scale."
      },
      {
        "decision": "Make production selection a fixed-plan evaluation and visual-review gate.",
        "rejected": "Promote a profile from aggregate scores, one showcase image, or a faster local run.",
        "tradeoff": "Evaluation is slower and costs real GPU time, but a visible identity failure cannot hide behind an average."
      },
      {
        "decision": "Keep the slower base profile in production after Turbo failed visual review.",
        "rejected": "Ship the 5.90-times speedup because its headline timing and aggregate scores looked better.",
        "tradeoff": "The current product remains too slow, but it does not exchange a recurring character for a more marketable latency number."
      },
      {
        "decision": "Preserve the React product and rebuild the wrong backend surfaces in phases.",
        "rejected": "Rewrite the entire product while changing the model, evaluator, prompts, references, and interface together.",
        "tradeoff": "The product remains visually unfinished in places, but each quality change can be traced to one isolated decision."
      }
    ],
    "architectureSteps": [
      { "label": "Browser", "detail": "Collects a scene, screenplay, actor references, style, and review actions" },
      { "label": "Planner", "detail": "Writes the world bible, character bible, structured shots, and continuity notes" },
      { "label": "References", "detail": "Binds the current production anchor or a gated named-reference candidate" },
      { "label": "FLUX.2 worker", "detail": "Generates each shot serially on one L40S and records timing provenance" },
      { "label": "Evaluation", "detail": "Pairs identity and VLM metrics with human visual review before promotion" }
    ],
    "failures": [
      {
        "title": "Uploaded actors disappeared before generation",
        "symptom": "The browser accepted an actor image, but the planned character still used an invented reference.",
        "cause": "The upload path named characters char_A and char_B while the planner and generation path expected char_1 and char_2, so the images were silently discarded.",
        "correction": "The product now enforces one char_1 through char_N contract and the deployed actor path received a real four-shot visual gate.",
        "remainingRisk": "Phase 4 still has to prove the same binding across multiple people, regeneration, and session reloads."
      },
      {
        "title": "Regeneration forgot the character",
        "symptom": "Regenerating an individual shot ran without the reference chain used by the original sequence.",
        "cause": "The regenerate path looked for the wrong reference key and a zero chain-reference limit excluded the intended fallback.",
        "correction": "Reference selection was repaired and generation plus regeneration now share one selection path with recorded provenance.",
        "remainingRisk": "The production selector still supplies only one legacy anchor until the named-reference candidate passes live evaluation."
      },
      {
        "title": "The faster profile duplicated people",
        "symptom": "Turbo cut accepted GPU work sharply, yet several scenes gained duplicated or substituted people and one text-heavy scene lost identity.",
        "cause": "Aggregate improvements did not protect every scene, exact cast count, or visible reference-to-person binding.",
        "correction": "Turbo stayed iteration-only, production stayed on base, and the gate gained per-scene identity plus mandatory visual people-count review.",
        "remainingRisk": "Production still misses the one-to-three-minute target, so speed work has to continue without reopening this quality regression."
      },
      {
        "title": "Better prose still failed the photograph",
        "symptom": "A deterministic prose prompt improved aggregate adherence and realism but added an extra man in the fixed tram sequence.",
        "cause": "The rewritten prompt changed too many visual relationships for the automated aggregate to expose one scene's cast error.",
        "correction": "Phase 3 concluded with no promotion. Legacy prompting remains production and later prompt arms were not run without a valid selected prerequisite.",
        "remainingRisk": "Prompt fidelity and reference binding remain coupled in people-heavy scenes and must be isolated before another paid comparison."
      }
    ],
    "limitations": [
      "The measured base identity score is 0.3528 against a target above 0.70, so recognisable continuity is not solved.",
      "Production still uses one legacy reference anchor; named single-person and multi-person reference candidates exist only as an unmeasured source checkpoint.",
      "The current base path is far outside the one-to-three-minute warm target, while the proven faster profile is not good enough to ship.",
      "Quality scores live in the evaluator rather than the product, so a person cannot yet ask Vivid to regenerate the objectively weakest shot.",
      "FLUX.2 dev weights are non-commercial. A paid launch needs a commercial licence, a licensed API provider, or a different model path.",
      "There is no account system, database, billing layer, or production analytics because those systems are not yet justified by the product's scale."
    ],
    "evidenceNote": "No Vivid user count appears here. The owner knows at least ten people who used it, but there is no durable analytics record or agreed counting rule, so the number remains unpublished.",
    "future": [
      {
        "status": "investigating",
        "title": "Named multi-person references",
        "detail": "Run the locked legacy, named-single, and named-multi sequence, then promote nothing until exact cast, binding, identity, VRAM, and visual gates all pass."
      },
      {
        "status": "planned",
        "title": "Speed without the Turbo regression",
        "detail": "Continue warmup, reference-budget, resolution, caching, and pipeline work toward a complete warm story in one to three minutes."
      },
      {
        "status": "planned",
        "title": "A higher-fidelity identity tier",
        "detail": "Evaluate per-character LoRA and the Vivid Indian fine-tune only after the reference path and speed gates are stable."
      },
      {
        "status": "planned",
        "title": "Expose evaluation in the product",
        "detail": "Surface shot-level quality signals and make the weakest frame easier to inspect and regenerate without rebuilding the existing frontend."
      },
      {
        "status": "blocked",
        "title": "Commercial model path",
        "detail": "Choose a commercial self-host licence, licensed provider, or permissive model before Vivid can become a paid product."
      }
    ],
    "sources": [
      { "label": "Vivid main and upgrade-flux repository history", "locator": "private Vivid repository, 53 audited commits", "public": false },
      { "label": "Current Vivid rebuild plan, architecture, PRD, audit, and evaluation baselines", "locator": "private Vivid docs and eval artifacts", "public": false },
      { "label": "Published Vivid product", "locator": "https://vivid-alpha.vercel.app", "public": true },
      { "label": "Portfolio claim records", "locator": "src/content/claims", "public": true }
    ],
    "relatedNoteLabel": "Read why the speedup was rejected",
    "ending": {
      "heading": "The goal is clear. The evidence says it is not finished.",
      "body": "Vivid already plans and renders complete sequences. The work now is to make the same people survive every shot, reach the time target without hiding quality loss, and keep this record current as each gate closes.",
      "contactLabel": "Ask me about Vivid"
    }
  },
  "claimRefs": ["vivid-pre-rebuild-evaluation", "vivid-turbo-evaluation"]
}
---
