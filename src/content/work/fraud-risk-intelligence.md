---
{
  "title": "Fraud Risk Intelligence",
  "order": 11,
  "tier": "minor",
  "effort": "focused",
  "status": "shipped",
  "started": "2025-12",
  "startedSource": { "kind": "repository", "locator": "Fraud Risk Intelligence first Git commit", "public": false },
  "audience": ["employer", "client"],
  "summary": "An earlier fraud modelling system where training, serving, and explanations share one frozen preprocessing contract.",
  "arrival": { "sentence": "The important artifact is not only the model. It is the preprocessing that cannot drift underneath it." },
  "whatItIs": ["Fraud Risk Intelligence compares supervised and unsupervised fraud models on a standard credit-card dataset.", "It serves predictions and SHAP explanations through the same frozen feature transformation used during training."],
  "problem": ["A model score cannot be reproduced when the API, notebook, and explanation layer each transform inputs differently.", "The project needed a single saved contract from raw row to feature vector and explanation."],
  "architecture": {
    "decision": "Freeze preprocessing as a versioned artifact and reuse it across training, inference, and explanation.",
    "paragraphs": ["The experiment bench compares models, records metrics, and saves the selected estimator with its transformers.", "FastAPI and the Streamlit demo load the same artifacts, while SHAP explains the exact feature representation the model received." ]
  },
  "measurement": { "claimIds": ["fraud-risk-heldout"] },
  "boundary": {
    "will": ["State that the dataset is standard and the system is an earlier project.", "Keep model, API, and explanation preprocessing aligned."],
    "refuses": ["Present a standard dataset as proprietary data.", "Position the project as stronger or newer than the UPI system."]
  },
  "whatBroke": {
    "title": "The explanation path could have scored a different input",
    "paragraphs": ["Separate notebook and API transformations made it possible for SHAP to explain a feature vector that did not match serving.", "I froze the preprocessing contract and loaded the same artifacts everywhere, turning reproducibility into part of the product rather than a notebook convention."],
    "noteSlug": "fraud-risk-frozen-preprocessing"
  },
  "stackAndLinks": {
    "stack": ["Python", "XGBoost", "PyTorch", "SHAP", "FastAPI", "Streamlit", "Docker"],
    "links": [{ "label": "View repository", "kind": "repository", "url": "https://github.com/parthtiwari-dev/Fraud-Risk-Intelligence-System", "verifiedAt": "2026-08-28" }]
  },
  "next": { "slug": "oracle-auto-provision", "label": "Next: Oracle Auto Provision" },
  "world": {
    "story": "Preprocessing freezes, transactions become comparable model inputs, and one flagged point keeps its explanation attached to the exact scored vector.",
    "dataSources": ["saved preprocessing artifact", "held-out metrics", "model explanation output"],
    "storyboardStatus": "specced",
    "motionDeferred": true
  },
  "claimRefs": ["fraud-risk-heldout"]
}
---
