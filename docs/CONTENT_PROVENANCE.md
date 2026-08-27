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

| Claim | Current evidence | Status | Required before publication |
|---|---|---|---|
| BeatMind build duration, commits and source size | Earlier resume snapshot says 19 days, 194 commits and 27,000 lines; later case study says 24 days, 307 commits and about 30,500 lines | Blocked | Define the date range and repository scope for each snapshot, then choose or label the intended one |
| BeatMind tests | Later case study says 299 tests across four tiers | Blocked | Reproduce or cite the dated test inventory |
| BeatMind separation speed | 70s to 23.4s is present in project records | Blocked | Attach benchmark command, input conditions and dated output |
| BeatMind users | Owner reports 17 users on 2026-08-27 | Blocked | Attach the source record, define what counts as a user and record the snapshot date |
| Vivid training | 2,250 LoRA steps appears in project records | Blocked | Attach the training log or checkpoint record and exact run |
| Vivid users | Owner confirms the current count is backed and may increase | Blocked | Attach the record, counting definition and `asOf` date before choosing public wording |
| Vivid previous-frame experiment | Project source records worse prompt adherence and about four-times slower later shots | Blocked | Attach the measured comparison and conditions |
| MedRAG refusal | Final evaluation records 4 refusals in 20 cases | Blocked | Name the evaluation and publish the denominator with the percentage |
| QueryPilot correction lift | 63/70 to 67/70 on the core set, a +5.7 percentage-point lift; 12 adversarial queries are separate | Blocked | Attach the benchmark artifact and keep the two sets distinct |
| UPI precision | 92.06% appears in a named model evaluation at a 0.5% alert budget; a separate operational backtest reports another overall precision | Blocked | Name both datasets and decide which claim serves the case-study beat |
| Oracle duration and uptime | Source confirms retry behavior; “months” and “longest uptime” were not verified | Blocked | Attach dated logs or remove the duration/comparison |
| Live deployments | Existing documentation lists candidate Vercel URLs | Blocked | Re-check ownership, status, authentication and route behavior immediately before publication |
| Hire price band | Existing PRD frames engagements at ₹50,000 to ₹1,00,000 | Owner review | Confirm whether this remains the public band and what is included |

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
