# Craft values

Every concrete number the research produced, with where it came from. Written 2026-08-26.

This file exists because of a split that only became obvious after reading everything: **the
video corpus teaches workflow and the repo corpus teaches craft.** Across 27 videos and
roughly ten hours there is no spacing scale, no radius scale, no easing curve, no contrast
target and no breakpoint value. The numbers below are almost all from the GitHub skill repos.
Anyone reaching for "what should the duration be" should start here and skip the videos.

Reusable on any project, not just this one.

---

## Motion

From `emilkowalski/skills`, the highest-credibility source in the haul. Emil Kowalski wrote
Sonner and Vaul, so these are values from shipped libraries rather than opinion.

### Should it animate at all

The gate runs before any value is picked, and it is allowed to return "no".

| Frequency | Decision |
|---|---|
| 100+ times a day (keyboard shortcuts, command palette) | **No animation, ever.** Raycast has no open/close animation and that is correct |
| Tens of times a day (hover, list navigation) | Near-imperceptible only |
| Occasional (modals, drawers, toasts) | Standard animation |
| Rare or first-time (onboarding, success) | The delight budget lives here, and only here |

Then name the purpose in one word: feedback, spatial consistency, state indication, preventing
a jarring change, explanation, or delight. Cannot name it, do not build it.

### Durations

| Element | Duration |
|---|---|
| Button press feedback | 100-160ms |
| Tooltips, small popovers | 125-200ms |
| Dropdowns, selects | 150-250ms |
| Modals, drawers | 200-500ms |
| Stagger between list items | 30-80ms |

**Anything over 300ms on a UI element needs a reason.** Default back to 150-250ms.

### Curves and springs

| Case | Value |
|---|---|
| A deliberate animation, not a default | `cubic-bezier(0.23, 1, 0.32, 1)` |
| Default UI spring | critically damped, no overshoot: `damping 1.0`, `response 0.3-0.4` |
| Momentum or flick | under-damped: `damping ~0.8`, `response 0.3-0.4` |
| Reduced motion | cross-fade, never slide or spring |

### Rules

- **Exit faster than enter.** Same speed both ways is a defect.
- **Never `transition: all`.** Name the properties: `transition: transform 200ms ease-out`.
- Reduced-motion and hover gating ship with the animation, not as a follow-up.
- Cheapest tool that works. Do not install a motion library for a fade.
- Data a user is reading or acting on does not move for style.

---

## Typography

From `Owl-Listener/designer-skills`, cross-checked against the video corpus where it had
anything to say.

### Scale

Built on a ratio, typically 1.25 (major third) or 1.333 (perfect fourth).

| Role | Size |
|---|---|
| Caption | 12px |
| Body small | 14px |
| Body | 16px base |
| Subheading | 20px |
| Heading 3 | 24px |
| Heading 2 | 32px |
| Heading 1 | 40px |
| Display | 48-64px |

**Limit to 4-5 sizes in regular use.** Body minimum 16px, and keep it 16px on mobile rather
than scaling it down; scale the headings instead.

### Line height and tracking

| Role | Value |
|---|---|
| Headings | 1.2 |
| Body | 1.5 |
| Long-form reading | 1.75 |
| Tracking, large headings | -0.02em |
| Tracking, body | 0 |
| Tracking, uppercase labels | +0.05em |

**Contested.** PL09 in the video corpus argues against bothering with -1% or -2% tracking at
all: "the user just can't really even tell a difference." That is one presenter's opinion
against every type specimen ever cut. Recorded, not adopted.

### Measure

**45-75 characters per line, 66 ideal.** Use `max-width: 65ch` as the proxy, then count a real
paragraph to check, because `ch` is approximate. Tighter, 50-60, for sustained reading.

Wide faces need narrower columns. Display type and short UI strings are exempt.

### From the video corpus

| Rule | Value | Source |
|---|---|---|
| Every font attribute a multiple of 4 | 4 | PL09, as a prompt constraint to keep the model off multiples of 3 |
| Smallest paragraph size | Model produced 12px; he raises it to **14px** and moves 12 to a separate caption style | PL09 |
| Type ladder | hero, H1-H6, paragraph large/medium/small, each with a mobile variant | PL09, PL11 |

**Tokenise type before generating anything.** The reason is mechanical, not aesthetic: if the
model invents a 15px paragraph, no later design-system pass will fix it, because there is
nothing for it to match against.

---

## Spacing

From `Owl-Listener/designer-skills`. A 2/4/8 progression.

| Step | Value |
|---|---|
| 2xs | 2px |
| xs | 4px |
| sm | 8px |
| md | 16px |
| lg | 24px |
| xl | 32px |
| 2xl | 48px |
| 3xl | 64px |

Related items take smaller steps, distinct sections take larger ones. Compact views drop one
step, reading-focused views add one. **Never an arbitrary value off the scale.**

---

## Colour and contrast

From `jakubkrehel/skills`, which gives both the WCAG ratios and the newer APCA `Lc` numbers.
APCA models perceived contrast better, especially for dark backgrounds where WCAG is known to
be over-permissive.

### WCAG

| Content | AA | AAA |
|---|---|---|
| Normal text, under 24px | 4.5:1 | 7:1 |
| Large text, 24px+ | 3:1 | 4.5:1 |
| UI components and graphical objects | 3:1 | n/a |

### APCA

| Content | Minimum | Preferred |
|---|---|---|
| Body text | Lc 75 | Lc 90 |
| Non-body text, labels, headlines | Lc 60 | Lc 75 |
| Large text, 36px+ | Lc 45 | Lc 60 |
| UI components | Lc 30 | n/a |

### The traps

- **Mid-lightness grounds cap what is reachable.** On a background near 75% perceived
  lightness, even pure black text only reaches about Lc 60. Body text needs a ground near one
  extreme. If the ground is mid-range, the ground is the thing that has to change.
- **Measure the rendered result, not the declaration.** `color-mix()`, relative colour syntax
  and opacity modifiers all resolve at render time.
- **A pair that passes in light mode can fail in dark.** The palettes are not mirror images.
- **Translucent surfaces shift with whatever scrolls behind them.** Test against the lightest
  and darkest content they can sit over.
- Light ground above ~90% lightness wants foreground below ~35%. Dark ground below ~25% wants
  foreground above ~90%.

### Architecture

Three tiers, from PL11 and PL09:

**brand** (raw hex) → **alias** (primary, secondary, error, success) → **map** (surface, text,
icon, border, with a second mode for dark).

Neutrals should be tinted toward the anchor hue rather than pure zero-chroma grey, which reads
flat and disconnected. The exception is a deliberately monochrome technical build, the
Stripe and Linear school, where zero-chroma is the point.

---

## The tells that make work read as generated

Two independent lists, from the video corpus and from `codeswithroh/tastemaker`. Where they
agree, the signal is strongest.

### Both lists agree on

1. **Prose instead of pictures.** Describing a look in words rather than attaching references.
   Named as the base failure in the videos.
2. **One reference, so the output is a copy.** Feed several so the model finds what they share.
3. **Everything on the grid, evenly spaced, perfectly safe.** Human work usually has one
   deliberate break. If there is not one, the page is too safe.

### From the video corpus

4. A guardrail document with no images attached produces "a very generic basic output".
5. Letting a hi-fi generator's house style through. "You can always kind of tell what is a
   Claude Design design, just the way the font is." Fix: wireframe there, finish elsewhere.
6. Hugging the wireframe. Fix: explicitly authorise drift.
7. **2x2 grids.** They "usually lead to something that looks a little bit AI generated".
8. Silent token overrides. His generated page "said it used the button, but it overrode the
   corner radius variables on that button to make it round". Audit for it, do not eyeball it.
9. Cumulative drift across many section edits. Fix: a QA pass after every section.

### From tastemaker

10. **Text-wall sections.** Each section should be something to look at with text as caption,
    not a heading plus two sentences with a decorative icon. Called the highest-leverage
    anti-slop check there is: a beautiful palette on a wall of text still reads as slop.
11. **The reflexive template.** hero → 3 feature cards → testimonial → CTA → footer.
12. **Indigo-to-purple or blue-to-cyan gradients**, and `background-clip: text` gradient
    headlines. Named as the single most recognisable signal.
13. **A single letter in a rounded coloured box as a logo.** The logo equivalent of the indigo
    gradient.
14. **Centred-everything heroes.** Eyebrow, headline, lede and CTA all on one centred axis.
    Centre at most two; break alignment for the rest.
15. Hand-drawn fake browser, phone or IDE chrome. Use a real screenshot or omit it.
16. Flat zero-chroma neutrals, outside the monochrome-technical case.
17. A section headline outside the hero reaching hero scale. Cap at 50-65%.

### Contrast failures that ship most often

- Button text within ~5% OKLCH lightness of its fill. The black-on-black bug.
- A dark panel left with ink-on-ink because children did not inherit the swapped text colour.
- An accent used as a text-bearing fill with no verified on-accent colour.

---

## Applied to this repo

Three of these are already live rules in `CLAUDE.md`, arrived at independently, which is worth
noting because it means the standard here is not being invented from scratch:

- Every visual encodes something true. Same instinct as Tufte's data-ink rule and as
  tastemaker's restraint axis.
- `styles/focus.css` owns the focus ring for the whole app, after twelve components each set
  `outline: none` and relied on a glow several of them did not render.
- Contrast is computed on rendered output, not asserted from tokens. `npm run a11y` measures
  the real composited ratio for every visible text node.

Two are new and should be adopted:

- **APCA `Lc` alongside the WCAG ratio.** The existing a11y gate checks 4.5:1. Adding Lc 75 for
  body would catch the dark-ground cases WCAG lets through.
- **The animation frequency gate.** Nothing in this repo currently asks whether a thing should
  animate at all before asking how.
