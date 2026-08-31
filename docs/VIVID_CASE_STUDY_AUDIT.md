# Vivid case-study audit

Audited 2026-08-31. This is the internal source map for the static paper case study at
`/work/vivid/`. It is not the Vivid world storyboard and it does not authorize a production
world implementation.

## Repository scope inspected

The Vivid repository was read without changing it.

- `main`: 15 commits from `c452334` to `2be4f26`.
- `upgrade-flux`: 53 commits in total through `9ea913d`, plus the owner's current uncommitted
  Phase 4 Part A work.
- Current live documents: `docs/PLAN.md`, `docs/PRD.md`, `docs/ARCHITECTURE.md`,
  `docs/audit.md`, `docs/RULES.md`, and the accepted evaluation baselines.
- The current dirty Vivid worktree was treated as evidence, not modified, committed, or
  presented as deployed behaviour.

The history was read from the first clean code commit forward rather than treating the latest
README as a complete account. That matters because several older capabilities and claims were
removed, repaired, or deliberately not promoted.

## History that shapes the case study

1. **Initial product.** Vivid began as a React storyboard interface backed by a FLUX.1
   generation path, PuLID experiments, stacked LoRA styles, reference scoring, a planner, and
   PDF export.
2. **FLUX.2 migration.** `upgrade-flux` replaced incompatible FLUX.1 surfaces with one
   quantised FLUX.2 pipeline. Native image references replaced the separate image-to-image
   path, and a manual text-encoder shard merge solved a real quantisation-metadata failure.
3. **Product expansion.** Chat, planned Generate, Script, regenerate, semantic edit,
   multi-character references, session recovery, warmup, and dynamic shot handling arrived
   without replacing the existing React product.
4. **Audit and foundations.** The August audit removed dead paths, aligned the deployment
   mirror, repaired actor key and PDF contracts, pinned the environment, and established the
   phased rebuild documents.
5. **Measurement.** A fixed 12-scene, 42-shot evaluation, CPU ArcFace identity scoring,
   structured VLM review, timing, cost, VRAM, resumable JSONL, and visual review replaced
   showcase-image judgement.
6. **Rejected speedup.** Turbo used 5.90 times less accepted GPU time on the fixed set but
   duplicated people and regressed a text-heavy identity scene. It remains iteration-only;
   base remains production.
7. **Rejected prompt promotion.** Deterministic prose improved aggregate signals but failed
   the fixed tram scene's human cast-count gate. Phase 3 closed with legacy prompting still
   serving.
8. **Current Phase 4 boundary.** Named single-reference and multi-reference candidates exist
   in the owner's current source checkpoint. They have no deployed A/B or paid visual proof,
   so the case study labels them as investigating rather than achieved.

## Current truth versus intended outcome

The product direction is stable: a written idea becomes a sequence of photographs that reads
as one story, with the same people recognisable from shot to shot. The target is a complete
warm story in one to three minutes without regressing identity, adherence, or realism.

That target is not presented as achieved. The accepted base identity score is 0.3528 against
a target above 0.70. The proven faster profile was rejected, production still uses one legacy
reference anchor, the new reference candidates remain source-only, and FLUX.2 dev licensing is
a commercial-launch blocker.

## Published evidence used

- `vivid-pre-rebuild-evaluation`: accepted fixed baseline, 12 scenes and 42 shots.
- `vivid-turbo-evaluation`: 5.90-times accepted-GPU speedup, explicitly not shipped.
- Real browser product capture already held in `public/media/`.
- Two unchanged real frames from the accepted local evaluation sequence, copied into
  `public/media/` for the paper proof sequence.

The owner-known lower bound of ten Vivid users remains excluded because no durable analytics
record or counting rule exists. The old 2,500-step LoRA record remains valid as an adapter
training fact but is not used as the primary product outcome.

## Durable update path

The page layout is shared. Vivid-specific facts live in `src/content/work/vivid.md`; changing
evidence lives in `src/content/claims/`. `src/pages/work/[slug].astro` now emits any project
whose validated content contains `caseStudy`, so another case study does not require another
hard-coded route or component fork.

When Vivid changes:

1. update the Vivid source repository and its own plan first;
2. attach a stable artifact or public URL to any new quantitative claim;
3. update the Vivid content record and claim record;
4. replace media only with real, publication-cleared output;
5. run the content check, static build, and 390, 800, and 1440 render review;
6. update this audit when the production boundary or intended outcome changes.

An editor or CMS may write the same schema later. Phase 8 chooses that authoring layer after
real publishing frequency, preview, authentication, media, backup, and rollback needs are
known. The static public site does not gain an admin runtime now.

## Still owner-reviewed later

- Minute visual polish remains part of the later full-site review.
- Publication clearance for future Vivid sequences must be explicit.
- The Story Loom animatic remains a separate world study, not page chrome for the paper case.
- The complete Phase 3 gate remains open until every project route and sitewide output passes.

## Portfolio validation

- `npm.cmd run phase1:gate` passed the schema tests, all 12 base project records, both
  complete case-study contracts, all 12 notes, all 13 published claim records, the public
  copy check, and the Astro static build. The build emitted 20 pages, including
  `/work/beatmind/` and `/work/vivid/`.
- The built Vivid route passed the reusable case-study capture at 390, 800, and 1440 pixels
  with zero horizontal overflow, ten chapters, two verified measurements, three product
  frames, and no browser errors. The no-JavaScript capture retained all ten chapters, both
  measurements, four ending links, four still images, and one video.
- Render evidence is stored in `.shots/phase3-vivid-case-final/` and was visually inspected
  at all three widths. A product-proof image sizing defect found during inspection was fixed
  before the final capture.
- The owner has intentionally deferred a deep visual review. That deferral does not convert
  the Vivid world storyboard or the complete Phase 3 gate into approved work.
- The public Vivid URL was not reverified on 2026-08-31. Its recorded 2026-08-28 verification
  date remains historical evidence, not a claim of current uptime.
