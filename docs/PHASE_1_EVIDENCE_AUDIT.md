# Phase 1 evidence audit

Verified 2026-08-28. This records what was actually inspected for the content rewrite. It
does not make private repositories, dashboards, or local artifacts public.

## Repository boundary

The audit used Parth-owned repositories under:

- `C:/great learning self paced/z Final Projects/`
- `C:/great learning self paced/Stick and dot/`

`Understand-Anything` was excluded because its Git remote points to another owner's
repository. Dirty working trees in Vivid and Tathya were read but not changed. Claims use
committed artifacts or name the working-tree boundary explicitly.

## Corrected claims

| Project | Publishable result | Source boundary |
|---|---|---|
| BeatMind | 381 passing tests across 39 test files in the current local web workspace | `apps/web: npm.cmd test`, run 2026-08-28 |
| BeatMind | 97.2 seconds on T4 versus 56.5 seconds on L4 for one fixed 120-second separation input | `beatmind/docs/PLAN.md` section 2.3c |
| Vivid | One completed LoRA adapter run: 2,500 steps over 1,996 discovered images | `Vivid` main, `lora_training/runp.txt` |
| Vivid | Turbo was 5.90 times faster across 42 shots in 12 scenes and was not promoted after visual regressions | `evals/baselines/2026-08-phase2-turbo.json` |
| MedRAG | 4 refusals in a 20-question final recorded evaluation | `data/evaluation/ragas_results.json` |
| QueryPilot | Core execution success moved from 63 to 67 of 70; the 12 adversarial queries remain separate | `backend/evaluation_results/day6_full_results.json` |
| SecondSelf | 0.9753 faithfulness on a 20-question internal RAGAS run | `backend/eval/logs/ragas_20260514_213310.json` |
| OncoVerse | 1 complete entry in a 5-entry directory; the complete entry still needs medical review | repository content JSON and README |
| UPI Fraud Engine | 92.06% precision and 12.81% recall on 85,429 held-out rows at a 0.5% alert budget | `models/production/pipeline_results.json` |
| UPI Fraud Engine | 75.22% precision and 12.13% recall over a 22,071-transaction, seven-day replay with no budget violation | `evaluation/backtest_results/backtest_results.json` |
| Fraud Risk Intelligence | 0.8499 PR-AUC on a 56,962-row held-out split | `experiments/metrics/XGboost_metrics.json` |
| Oracle Auto Provision | Five-minute configured retry cadence and a duplicate-instance guard | workflow and provisioning source |

## Blocked and excluded

- BeatMind's owner-reported 18 Clerk accounts are not public copy. The attached screenshot
  is Vercel Analytics and shows visitors and pageviews, not Clerk accounts. A Clerk export
  or screenshot plus the account definition is still required.
- Vivid's owner-known lower bound of 10 people is not public copy. No durable analytics or
  named counting record is attached.
- BeatMind duration, commit, and line-count snapshots are excluded because their scopes
  conflict.
- Oracle uptime, duration, and automatic workflow-disable claims are excluded. The helper
  needs a token the workflow does not currently pass.
- Tathya, Order Supervisor, and Spur Chat publish an honest absence instead of a performance
  number.

## Public URL check

Direct HEAD requests were run on 2026-08-28. Every URL included in Phase 1 content returned
HTTP 200. GET checks also matched the expected live page titles: BeatMind, Storyboard AI
Cinematic Engine for Vivid, Tathya Fact Checker, and Lumio Support Chat for Spur Chat.
QueryPilot's Render health URL timed out and is therefore excluded.

The included links are BeatMind, Vivid, Tathya, Spur Chat, and the verified public GitHub
repositories for Tathya, MedRAG, Order Supervisor, QueryPilot, UPI Fraud Engine, Spur Chat,
OncoVerse, and Fraud Risk Intelligence. Private or 404 repositories are not linked.
