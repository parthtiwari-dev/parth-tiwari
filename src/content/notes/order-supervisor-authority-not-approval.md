---
{
  "title": "Authority is not the same as approval",
  "type": "erratum",
  "publishedAt": "2026-08-28",
  "summary": "The portfolio diagram promised a universal human gate that the workflow did not implement.",
  "relatedProjects": ["order-supervisor"],
  "claimRefs": [],
  "sources": [{ "kind": "repository", "locator": "Order Supervisor workflow and action source", "public": false }],
  "state": "published"
}
---

The real architectural guarantee is that the model does not own order lifecycle state.
That is not the same as saying a human approves every transition.

The old copy blurred those two ideas. I removed the stronger claim. A universal approval
gate can return to the story only after it exists in the workflow and has tests around it.
