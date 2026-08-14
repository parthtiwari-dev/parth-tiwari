# DESIGN REVIEW — <project>

`/design-pass audit` on <date>. Read-only pass; nothing in this file has been applied.

## Verdict

<Two sentences. What is genuinely good, and the single biggest thing holding it back.>

## Screenshots

| 390 | 834 | 1440 |
|---|---|---|
| `.design-pass/before-390.png` | `.design-pass/before-834.png` | `.design-pass/before-1440.png` |

## Detector findings

`node vendor/impeccable/scripts/detect.mjs <target>` — <n> failures, <n> advisory.

| # | Rule | Location | Fix |
|---|---|---|---|

## Lock violations

Where the code disagrees with `DESIGN_LOCK.md`.

| Token | Lock says | Code does | Location |
|---|---|---|---|

## Judgment findings

What the detectors cannot see. Ranked worst first. Each needs a concrete fix, not an
adjective.

### 1. <finding>
- **What:**
- **Why it matters here:** <tie to Ground, not to general principle>
- **Fix:**

## Ranked plan

Token-level first — a `:root` change often clears twenty component findings at once.

| Order | Change | Level | Expected effect |
|---|---|---|---|
| 1 | | token | |

## Deliberately not changing

| Thing | Why it stays |
|---|---|
