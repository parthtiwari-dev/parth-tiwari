# Content provenance

Created 2026-08-27. This is the publication queue for factual claims. It is not the
final site copy.

A statement may be true and still be unpublishable if its scope, denominator or date is
unclear. Phase 1 turns this register into typed claim records consumed by the content
collections.

## Publication rule

Every public number, user count, comparison, client statement and deployment claim needs:

- a stable claim ID;
- exact public wording;
- context and denominator;
- source path, URL, export or owner-held record;
- the date it was verified;
- an `asOf` date when the value can change;
- whether the evidence may be made public;
- status: `blocked`, `verified`, `published` or `retired`.

Owner testimony can establish where to look. A changing product count is published as a
dated snapshot, not as an undated live fact.

## Current queue

The machine-readable records are in `src/content/claims/`. The detailed inspection record
is [`PHASE_1_EVIDENCE_AUDIT.md`](PHASE_1_EVIDENCE_AUDIT.md).

| Claim group | Status | Publication decision |
|---|---|---|
| BeatMind tests and fixed-input separation benchmark | Verified | Publish with the dated working-tree and benchmark boundaries |
| BeatMind contribution and qualitative case-study record | Owner-approved and repository-audited | Name Stick and Dot, end-to-end design and implementation, feedback-led refinements, audited failures, limitations and future states; do not expose private repository paths or user material |
| Vivid LoRA training and rejected Turbo evaluation | Verified | Publish as an adapter run and a rejected speed experiment, not foundation-model training |
| MedRAG refusals | Verified | Publish as 4 of 20 in the named final recorded evaluation |
| QueryPilot correction | Verified | Publish 63 to 67 of 70 core queries; keep 12 adversarial queries separate |
| SecondSelf internal RAGAS faithfulness | Verified | Publish with the 20-question denominator and no job-outcome implication |
| OncoVerse content scope | Verified | Publish 1 complete of 5 and the needs-review state |
| UPI held-out evaluation and operational replay | Verified | Publish as two separate claims with separate denominators |
| Fraud Risk held-out evaluation | Verified | Publish with the held-out denominator and standard-dataset limitation |
| Oracle schedule and duplicate guard | Verified | Publish as configuration, not uptime or automatic stop |
| BeatMind accounts | Blocked | Owner reports 18 Clerk accounts; exclude until the Clerk record and definition are attached |
| Vivid users | Blocked | Owner knows at least 10 people; exclude until a durable counting record is attached |
| Public project links | Verified where included | All included URLs returned HTTP 200 on 2026-08-28; the timed-out QueryPilot backend URL is excluded |
| Portfolio interim deployment | Verified | `https://parth-tiwari-1.vercel.app/` returned the new Astro landing with HTTP 200 on 2026-08-29 after Vercel marked the `main` deployment successful |
| Public pricing | Retired by owner decision | Do not display a price, price band, or cost estimate anywhere on the site |

## Claims that do not ship

- Round user counts with no record
- “Used by” language that counts the owner, test accounts or unverified signups
- A benchmark percentage without its denominator and dataset
- A live or shipped badge based only on a remembered deployment URL
- “Client,” “testimonial” or logo placement without permission and source
- “Longest,” “first,” “best,” “months” or similar comparisons without a defined comparison
- A number copied from an old resume after the underlying project changed

## Phase 1 completion condition

Every number selected for the site has a verified record. Every blocked row is either
resolved or excluded from the public copy. The owner reviews the final wording and snapshot
dates before the text-only ten-second test.
