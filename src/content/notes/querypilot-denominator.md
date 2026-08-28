---
{
  "title": "The right lift, the wrong denominator",
  "type": "erratum",
  "publishedAt": "2026-08-28",
  "summary": "QueryPilot's correction result belonged to the core set, not the combined benchmark.",
  "relatedProjects": ["querypilot"],
  "claimRefs": ["querypilot-correction"],
  "sources": [{ "kind": "artifact", "locator": "querypilot/backend/evaluation_results/day6_full_results.json", "public": false }],
  "state": "published"
}
---

The correction loop moved the core result from 63 successful executions to 67. The
denominator for that comparison is 70 core queries.

I had previously placed the lift beside the total that also included 12 adversarial
queries. The percentage was arithmetically correct for the core run and contextually wrong
where I used it. The two sets now stay separate.
