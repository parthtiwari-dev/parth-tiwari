# Pipeline

Full stage detail. `SKILL.md` has the summary; this has the exact moves.

## Stage 0 — Ground (always first, never skipped)

Read, in order, whichever exist: `PRD.md`, `PRODUCT.md`, `docs/PRD.md`, `README.md`,
`CLAUDE.md`. Extract three things and write them down:

- **What this is** in one sentence, in the product's own words
- **Who lands on it**, and in what state of mind
- **The page's single job** — the one action or understanding it must produce

If these cannot be found, ask. Do not infer a product from its CSS.

Ground outranks every other stage. A finding that improves the page but fights Ground is
rejected, and the rejection is recorded in the lock so it is not raised again.

## Stage 1 — Target

`references/refero-intake.md` if `inbox/refero/` has captures, otherwise
`references/reference-picking.md`. Output: a short paragraph in the lock describing the
structural qualities being borrowed, plus the source.

## Stage 2 — Dials

`references/dials.md`. Output: three integers with a one-line justification each.

## Stage 3 — Candidates (on demand only)

`vendor/ui-ux-pro-max/data/` is CSV. **Grep it, never load it wholesale** — it is 3 MB and
loading it will eat the context window for no benefit.

```bash
KIT="C:/great learning self paced/z Final Projects/design-kit"
grep -i "<style-or-industry>" "$KIT/vendor/ui-ux-pro-max/data/colors.csv" | head -20
grep -i "<mood>" "$KIT/vendor/ui-ux-pro-max/data/google-fonts.csv" | head -20
```

Treat every hit as a *candidate*. It encodes the statistical average of good SaaS design,
and the average is the enemy of a distinctive site. Each candidate must survive Stage 5's
critique against Ground before it enters the lock.

## Stage 4 — Detect

`references/detectors.md`. Run before reasoning. Deterministic and free — there is no
excuse for skipping it, and doing so means arguing from memory about things a script can
answer.

## Stage 5 — Method

Use the built-in `frontend-design` skill for the two-pass structure, and `apple-design`
when motion, material or physicality is in scope.

The non-negotiable part of the method is the **critique between plan and build**. Write the
plan, then attack it: does any element resemble a generic default? If yes, change it and
say what changed and why. Skipping the critique is how every source in this kit degrades to
the same template.

## Stage 6 — Verify

Three breakpoints: **390** (mobile), **834** (tablet), **1440** (desktop).

```js
// Playwright, already a dependency in beatmind
for (const w of [390, 834, 1440]) {
  await page.setViewportSize({ width: w, height: 900 });
  await page.screenshot({ path: `.design-pass/after-${w}.png`, fullPage: true });
}
```

Re-run detectors with `--quiet` and report the delta:

```
findings: 23 → 6   (-17)
```

If the count went **up**, say so plainly and explain which change caused it. A verify step
that only reports improvements is not a verify step.

## Output locations

| File | Committed? | Purpose |
|---|---|---|
| `DESIGN_LOCK.md` | yes, repo root | single source of truth |
| `DESIGN_REVIEW.md` | yes, repo root | latest audit, overwritten each pass |
| `.design-pass/*.png` | no, gitignore | screenshots |
