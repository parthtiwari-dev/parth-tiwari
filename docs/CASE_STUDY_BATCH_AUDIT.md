# Eight-project case-study batch audit

Reviewed 2026-08-31. This is the internal source boundary for the approved Phase 3 batch.
Only committed repository state may support current-product copy. A dirty working tree is
listed so it cannot silently enter the public account.

| Project | Audited source | Working-tree boundary | Proof decision | Batch state |
| --- | --- | --- | --- | --- |
| Tathya | `main` at `bf4606f` | Modified `shared/config.py` excluded | Existing real video and responsive captures plus a DOM boundary record | Implemented |
| MedRAG | `main` at `a741897` | Untracked `system_architecture.md` excluded | Committed evaluation and retrieval records; no fabricated service-dependent capture | Implemented |
| Order Supervisor | `main` at `ba544e0` | Clean | Workflow event, allowlist and lifecycle DOM records | Implemented |
| QueryPilot | `main` at `1b75476` | Clean | Existing API capture plus one committed Day 6 correction trace | Implemented |
| SecondSelf | `v2-dev` at `4a1447c` | Personal KB changes excluded | Safe evaluation and test-fixture DOM records only | Implemented |
| OncoVerse | `main` at `f8bdbd3` | Current anatomy work excluded | Committed atlas asset, content directory and MTC record | Implemented |
| UPI Fraud Engine | `main` at `dbc43ad` | Clean | Real evaluation visualisations and separate raw held-out/replay records | Implemented |
| Spur Chat | `main` at `562ca32` | Clean | Real desktop/mobile captures; frontend 200, backend suspended, no successful answer claimed | Implemented |

Fraud Risk Intelligence and Oracle Auto Provision are outside this batch. Their work-register
rows remain visible and non-clickable as **Case study in development**. This document records
source state, not owner visual approval, deployment, or completion of Phase 3.

## Live verification exception

On 2026-08-31, the Spur Chat frontend returned HTTP 200. The Render health endpoint and
message endpoint returned a **Service Suspended** response, so a complete chat turn could not
run. The public action is therefore **View the interface**, and the page labels interaction
unverified. This check does not alter or deploy either service.

## Revertable implementation commits

| Scope | Commit |
| --- | --- |
| Shared proof contract, deferred-route state and capture contract | `ec1b8b3` |
| Tathya | `0bd5eaa` |
| MedRAG | `8d0e658` |
| Order Supervisor | `7f96c1d` |
| QueryPilot | `a2aa617` |
| SecondSelf | `9403ab2` |
| OncoVerse | `e36b618` |
| UPI Fraud Engine | `144cced` |
| Spur Chat | `3649e92` |

## Route and link matrix

| Register record | Output | Register behavior |
| --- | --- | --- |
| BeatMind | `/work/beatmind/` | Linked |
| Vivid | `/work/vivid/` | Linked |
| Tathya | `/work/tathya/` | Linked |
| MedRAG | `/work/medrag/` | Linked |
| Order Supervisor | `/work/order-supervisor/` | Linked |
| QueryPilot | `/work/querypilot/` | Linked |
| SecondSelf | `/work/secondself/` | Linked |
| OncoVerse | `/work/oncoverse/` | Linked |
| UPI Fraud Engine | `/work/upi-fraud-engine/` | Linked |
| Spur Chat | `/work/spur-chat/` | Linked |
| Fraud Risk Intelligence | No route | Non-clickable, Case study in development |
| Oracle Auto Provision | No route | Non-clickable, Case study in development |

Previous, next, Notes-related and Resume links resolve only to emitted routes or `/work/`.
The static link gate enumerates every internal built link rather than relying on this table.

## Gate evidence

Run against the built Astro output on 2026-08-31:

- `npm run phase3:case-batch-gate` validates schemas, claim provenance, exactly ten
  published case-study records, exactly two deferred records, the static build, four proof
  surfaces and ten chapters per route, media accessibility, every internal link and
  private-path exclusions.
- `npm run phase2:case-capture` was run for all ten published routes against the fresh static
  preview at 390, 800 and 1440 pixels. Every route returned HTTP 200 with zero horizontal
  overflow, ten chapters, four proof surfaces, named controls and no browser errors.
- The same ten-route run passed no-JavaScript completeness, reduced-motion rendering,
  visible keyboard focus and an 800-pixel print composition with zero overflow.
- Rendered evidence is under `.shots/phase3-batch-final-<slug>/`. Arrival and product-proof
  contact sheets for all three widths were inspected after the final shared mobile-title and
  proof-label refinements. Long mobile titles remain complete and readable.

The eight pages are built and batch-gate checked. Owner visual approval, the two deferred
case studies, the Phase 3 ten-second test, the complete static-site gate and deployment remain
open. No push or deployment occurred in this batch.
