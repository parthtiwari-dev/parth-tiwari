---
{
  "title": "The explanation needs the same input",
  "type": "erratum",
  "publishedAt": "2026-08-28",
  "summary": "Separate transformations could make the API score and the explanation disagree.",
  "relatedProjects": ["fraud-risk-intelligence"],
  "claimRefs": [],
  "sources": [{ "kind": "repository", "locator": "Fraud Risk Intelligence preprocessing and serving source", "public": false }],
  "state": "published"
}
---

A useful fraud explanation has to describe the feature vector the model actually scored.
Notebook-specific transformations made that guarantee too easy to break.

The correction was to freeze preprocessing with the selected model and load the same
artifacts in training, serving, and SHAP. Reproducibility became a shared contract instead
of a convention each entry point could interpret differently.
