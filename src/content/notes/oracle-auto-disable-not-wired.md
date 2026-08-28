---
{
  "title": "The auto-disable path was not wired",
  "type": "erratum",
  "publishedAt": "2026-08-28",
  "summary": "Oracle Auto Provision had a stop helper in code but not the token it needed in the workflow.",
  "relatedProjects": ["oracle-auto-provision"],
  "claimRefs": ["oracle-schedule"],
  "sources": [{ "kind": "repository", "locator": "oracle-auto-provision/.github/workflows/retry.yml and create_instance.py", "public": false }],
  "state": "published"
}
---

The Python helper can disable the GitHub Actions workflow after success. The workflow does
not pass the GitHub token that helper expects.

The old portfolio described an automatic stop. The verified instruction is manual disable,
so that is what the case study says. Code that cannot run in the deployed contract is not a
shipped feature.
