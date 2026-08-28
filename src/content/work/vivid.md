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
  "summary": "A script-to-storyboard system that turns scenes into shots while trying to keep each character recognisable across the sequence.",
  "arrival": { "sentence": "A script becomes a storyboard, and the same character has to survive every frame." },
  "whatItIs": ["Vivid turns a written script into a shot list and then into generated storyboard frames.", "It combines scene planning, named character references, diffusion generation, evaluation, and a reviewable product workflow."],
  "problem": ["A good frame is not enough. Later shots must follow the new prompt while preserving the identity established earlier.", "Conditioning too strongly on the previous image can keep identity while dragging forward the wrong pose, composition, and mistakes."],
  "architecture": {
    "decision": "Separate identity references from previous-frame pixels, and promote generation changes only after visual review.",
    "paragraphs": ["The pipeline parses a script into scenes and shots, binds named references, generates frames, and records evaluation provenance.", "A LoRA adapter training pipeline supports style and character experiments. Production remains on the slower baseline when a faster profile loses identity or prompt alignment."]
  },
  "measurement": { "claimIds": ["vivid-lora-training", "vivid-turbo-evaluation"] },
  "boundary": {
    "will": ["Describe the completed LoRA adapter run precisely.", "Keep a slower production profile when the faster result looks worse."],
    "refuses": ["Call LoRA adapter training a foundation-model training run.", "Publish a remembered user count without durable evidence."]
  },
  "whatBroke": {
    "title": "The faster pipeline lost the person",
    "paragraphs": ["Turbo looked decisive in timing data, but the generated sequence lost identity and text-scene fidelity.", "I did not ship the faster profile. The failed result became part of the evaluation record instead of being edited out of the story."],
    "noteSlug": "vivid-faster-was-worse"
  },
  "stackAndLinks": {
    "stack": ["Python", "PyTorch", "FLUX", "LoRA", "Modal", "FastAPI", "Next.js"],
    "links": [{ "label": "Open Vivid", "kind": "live", "url": "https://vivid-alpha.vercel.app", "verifiedAt": "2026-08-28" }]
  },
  "next": { "slug": "tathya", "label": "Next: Tathya" },
  "world": {
    "story": "Script beats become shots, references bind to characters, noise resolves into frames, and a faster rejected profile appears beside the production result.",
    "dataSources": ["generation evaluation JSON", "LoRA training log", "generated storyboard frames"],
    "storyboardStatus": "prototyped",
    "motionDeferred": true
  },
  "claimRefs": ["vivid-lora-training", "vivid-turbo-evaluation"]
}
---
