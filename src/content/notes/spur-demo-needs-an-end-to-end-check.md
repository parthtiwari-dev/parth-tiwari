---
{
  "title": "A live shell is not a working demo",
  "type": "erratum",
  "publishedAt": "2026-08-28",
  "summary": "Spur Chat's public client could load while its backend interaction remained unverified.",
  "relatedProjects": ["spur-chat"],
  "claimRefs": [],
  "sources": [{ "kind": "public-url", "locator": "https://support-core-nine.vercel.app", "public": true }],
  "state": "published"
}
---

An HTTP success proves that the page exists. It does not prove that the support flow can
retrieve context and finish a streamed answer.

This audit records the URL as reachable and nothing more. The complete interaction must
pass during the static-site build before the site labels the take-home demo functional.
