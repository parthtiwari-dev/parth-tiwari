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
| OncoVerse | `main` at `f8bdbd3` | Current anatomy work excluded | Committed atlas asset, content directory and MTC record | Audited, pending implementation |
| UPI Fraud Engine | `main` at `dbc43ad` | Clean | Existing real evaluation visualisations and separate raw held-out/replay records | Audited, pending implementation |
| Spur Chat | `main` at `562ca32` | Clean | Existing real desktop/mobile captures; successful streamed answer not claimed | Audited, pending implementation |

Fraud Risk Intelligence and Oracle Auto Provision are outside this batch. Their work-register
rows remain visible and non-clickable as **Case study in development**. This document records
source state, not owner visual approval, deployment, or completion of Phase 3.
