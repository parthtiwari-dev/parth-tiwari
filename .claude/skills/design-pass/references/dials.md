# Dials

Three integers, set once at `init`, recorded in `DESIGN_LOCK.md`. Distilled from
`vendor/taste-skill`. They exist so "make it better" becomes a decision instead of a vibe.

## VARIANCE — 0 to 10

How far layout may drift from a predictable grid.

- **0-2** — strict grid, every section the same rhythm. Dashboards, docs, admin.
- **3-5** — mostly regular with two or three deliberate breaks. Most marketing sites.
- **6-8** — asymmetry is the point. Editorial, portfolio, agency.
- **9-10** — every section is its own composition. Very hard to keep coherent; needs a
  strong repeated motif or it reads as chaos.

## MOTION_INTENSITY — 0 to 10

- **0-2** — state changes only. Fades, no travel.
- **3-5** — purposeful entrance and hover motion, 150-300ms, ease-out.
- **6-8** — scroll-linked motion, parallax, staged reveals. Needs a motion budget.
- **9-10** — motion is the content. WebGL, scroll-scrubbed timelines. Expensive to get
  right and brutal on mobile and on `prefers-reduced-motion`.

Any value above 5 requires an explicit `prefers-reduced-motion` fallback in the lock. Not
optional.

## VISUAL_DENSITY — 0 to 10

- **0-2** — one idea per screen, enormous whitespace. Apple product pages.
- **3-5** — comfortable reading rhythm.
- **6-8** — information-dense, tight leading. Linear, Stripe docs.
- **9-10** — terminal-grade. Bloomberg, trading UIs.

## Setting them

Ask the user, or infer from the target brand file and confirm. Write the numbers into the
lock with a one-line justification each. When a later finding conflicts with a dial, the
dial wins unless Ground overrides it.

A common failure: setting all three high. High variance plus high motion plus high density
is noise. Pick one to push and keep the other two mid or low.
