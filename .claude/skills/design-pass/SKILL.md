---
name: design-pass
description: Review and level up the visual design of a web project — audit a live page or component against a chosen reference design language, produce a ranked DESIGN_REVIEW.md and a concrete token diff, then apply and verify with before/after screenshots. Use when asked to make a site look better, more premium, more like Apple/Linear/Stripe, to critique a UI, to build a design system for a project, or to review a page's visual quality. Triggers on "make this look better", "design review", "premium feel", "looks generic", "design system", "polish the UI", "make it look like <brand>".
---

# design-pass

One pipeline, six sources, no arguments between them.

Five design skills pointed at the same page will contradict each other and produce mush.
This skill gives each source exactly one job and resolves every conflict **once**, into a
committed `DESIGN_LOCK.md`. After the lock exists, nothing re-litigates it.

## Source roles — never overlap these

| Stage | Source | Its one job | Cost |
|---|---|---|---|
| 0 Ground | the project's own PRD / PRODUCT.md / README | what this is, who it's for, the page's single job | free |
| 1 Target | `refs/design-md-all/<brand>/DESIGN.md` + the user's refero captures | the visual north star, as concrete tokens | 1–2 files |
| 2 Dials | `vendor/taste-skill` | VARIANCE, MOTION_INTENSITY, VISUAL_DENSITY as explicit numbers | 3 integers |
| 3 Candidates | `vendor/ui-ux-pro-max/data/*.csv` | *proposes* palettes and font pairs. Never authoritative. | on demand, grep only |
| 4 Detect | `vendor/impeccable/scripts/detector/` | deterministic anti-pattern findings | free, no API call |
| 5 Method | `frontend-design` / `apple-design` built-ins | plan → critique → build → critique | free |
| 6 Verify | Playwright | before/after screenshots at 3 breakpoints | ≤3 images per pass |

**Precedence when two sources disagree:** Ground > Lock > Detect > Target > Dials >
Candidates. Ground always wins — a rule that makes the page prettier but wrong for the
product loses.

## Commands

### `/design-pass init`
Run once per project. Produces `DESIGN_LOCK.md` at the repo root.

1. Read the project's own docs first. Never guess the product.
2. Ask the user for the **target**: one or two brands from `refs/design-md-all/`. Show the
   shortlist relevant to their domain (see `references/reference-picking.md`). If they have
   refero captures, read `references/refero-intake.md` instead — captures beat brand files.
3. Set the three dials with the user (`references/dials.md`).
4. Emit `DESIGN_LOCK.md` from `templates/DESIGN_LOCK.md`: 4–6 named colors with hex, a type
   scale, spacing, motion budget, the signature element, and an explicit banned list.
5. Stop. Do not write any code during `init`.

### `/design-pass audit [url | path]`
Read-only. Never edits.

1. Screenshot at 390 / 834 / 1440 px. Three images, no more — images are tokens.
2. Run the impeccable detectors (`references/detectors.md` has the exact invocation). These
   are deterministic Node scripts, no API cost — always run them before reasoning.
3. Diff the observed tokens against `DESIGN_LOCK.md`.
4. Emit `DESIGN_REVIEW.md`: findings ranked worst-first, each with file:line where locatable,
   what it violates, and the concrete fix. No prose padding.

### `/design-pass plan`
Turn the audit into an ordered change list. Group by token-level (cheap, high leverage)
before component-level before layout-level. State what will visibly change.

### `/design-pass apply`
Execute the plan. Token changes first — a palette fix at the `:root` level often resolves
twenty component findings at once.

### `/design-pass verify`
Re-screenshot the same three breakpoints, re-run detectors, and report before → after with
the delta in findings count. If findings went up, say so.

## Rules

1. **Never skip `init`.** Auditing without a lock produces generic advice, which is the exact
   failure this skill exists to prevent.
2. **Detectors before opinions.** They are free and they are right about the mechanical
   things. Spend model reasoning on what they cannot see.
3. **Three screenshots per pass, hard cap.** Screenshots are the dominant cost here.
4. **ui-ux-pro-max proposes, the critique pass disposes.** Its CSVs encode the statistical
   average of good SaaS design. The average is the enemy of a distinctive site. Grep it for
   candidates, then justify or reject each against Ground.
5. **One bold move per page.** Spend the boldness in a single place and keep everything
   around it quiet. Both `frontend-design` and `apple-design` say this; it is the single
   highest-leverage rule in the whole kit.
6. **No new dependencies** without asking. Most findings are CSS.
7. **Never scrape a reference site.** See `references/refero-intake.md` — the user supplies
   captures, this skill never fetches them.

## Where things live

This skill expects `design-kit` at a known path. Resolve in this order:

1. `./design-kit/` in the current repo
2. `../design-kit/` (sibling)
3. `C:/great learning self paced/z Final Projects/design-kit/`

Repo-local installs ship only `refs/design-md/` — a curated slice for that project, not the
full corpus. If a needed brand file is missing, fall back to the canonical path above, and
if that is unreachable, say so rather than inventing token values.

## References

- `references/pipeline.md` — the full stage-by-stage with exact commands
- `references/dials.md` — VARIANCE / MOTION_INTENSITY / VISUAL_DENSITY, and what each does
- `references/reference-picking.md` — which brand file to target, by project type
- `references/refero-intake.md` — the human-curated refero workflow
- `references/detectors.md` — running the impeccable detectors
- `templates/DESIGN_LOCK.md` — the lock template
- `templates/DESIGN_REVIEW.md` — the review output shape
