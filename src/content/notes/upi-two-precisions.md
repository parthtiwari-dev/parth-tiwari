---
{
  "title": "UPI had two precision numbers",
  "type": "erratum",
  "publishedAt": "2026-08-28",
  "summary": "A held-out model test and a seven-day replay were collapsed into one result.",
  "relatedProjects": ["upi-fraud-engine"],
  "claimRefs": ["upi-heldout", "upi-replay"],
  "sources": [
    { "kind": "artifact", "locator": "upi-fraud-engine/models/production/pipeline_results.json", "public": false },
    { "kind": "artifact", "locator": "upi-fraud-engine/evaluation/backtest_results/backtest_results.json", "public": false }
  ],
  "state": "published"
}
---

Both results were valid inside their own experiments. They were not interchangeable.

The held-out evaluation and the operational replay now have separate claim records, each
with its own denominator, threshold context, precision, and recall. The site will never
borrow the stronger number while describing the other dataset.
