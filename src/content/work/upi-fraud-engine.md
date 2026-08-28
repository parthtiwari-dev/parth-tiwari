---
{
  "title": "UPI Fraud Engine",
  "order": 9,
  "tier": "major",
  "effort": "substantial",
  "status": "shipped",
  "started": "2026-01",
  "startedSource": { "kind": "repository", "locator": "UPI Fraud Engine first Git commit", "public": false },
  "audience": ["employer", "client"],
  "summary": "A real-time fraud scoring system evaluated at a fixed alert budget instead of optimising a model metric in isolation.",
  "arrival": { "sentence": "Fraud scoring only matters after the alert queue has a size the team can handle." },
  "whatItIs": ["The UPI Fraud Engine scores transactions and turns the highest-risk fraction into alerts.", "The operating point is constrained by an alert budget, so precision and recall are reported at the threshold the team could actually review."],
  "problem": ["Fraud datasets are imbalanced, and a strong ROC-AUC can still produce an unusable queue.", "The model, temporal features, threshold, and replay all need separate evidence so an offline score is not mistaken for operational performance."],
  "architecture": {
    "decision": "Choose and evaluate the threshold under an explicit alert budget, then replay it across time.",
    "paragraphs": ["The pipeline builds temporal and behavioural features, trains the model, freezes production artifacts, and scores transactions through an API.", "A separate replay measures the chosen operating point across consecutive days. Its result is never merged with the held-out test result." ]
  },
  "measurement": { "claimIds": ["upi-heldout", "upi-replay"] },
  "boundary": {
    "will": ["Report precision and recall together at the chosen budget.", "Keep held-out evaluation and time replay as separate claims."],
    "refuses": ["Call a risk score a final fraud verdict.", "Hide recall to make precision look stronger."]
  },
  "whatBroke": {
    "title": "Two correct precision numbers became one misleading claim",
    "paragraphs": ["The model evaluation and the operational replay used different datasets and produced different precision values.", "Earlier copy collapsed them. The correction names each dataset, denominator, threshold context, and recall beside precision."],
    "noteSlug": "upi-two-precisions"
  },
  "stackAndLinks": {
    "stack": ["Python", "XGBoost", "FastAPI", "feature engineering", "backtesting"],
    "links": [{ "label": "View repository", "kind": "repository", "url": "https://github.com/parthtiwari-dev/upi-fraud-engine", "verifiedAt": "2026-08-28" }]
  },
  "next": { "slug": "spur-chat", "label": "Next: Spur Chat" },
  "world": {
    "story": "Transaction scores settle into a distribution, an alert-budget threshold cuts the tail, and the paired precision-recall result appears at that operating point.",
    "dataSources": ["held-out pipeline results", "seven-day replay results", "threshold configuration"],
    "storyboardStatus": "specced",
    "motionDeferred": true
  },
  "claimRefs": ["upi-heldout", "upi-replay"]
}
---
