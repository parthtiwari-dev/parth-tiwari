# Divergence

The stage that stops this kit producing a worse copy of a famous website.

Every design skill on the market converges. Feed five of them a reference and you get a
competent imitation — which is the single most common failure of AI-assisted design, and
the reason "AI slop" is a recognisable look. This stage exists to fight that deliberately.

## The rule

**Reference → abstract → mutate → build. Never reference → build.**

The abstraction step is mandatory and it must be written down. If a pattern cannot be
stated in words without naming the source brand, it has not been abstracted — it has been
traced.

## Step 1 — Extract the pattern, not the pixels

From the target (`refs/design-md-all/<brand>/DESIGN.md`, or the user's captures), write
down **at most five** structural facts. Structural means it survives translation to a
completely different palette and subject.

Good abstractions:
- "One interactive colour only. Everything else is ink, surface or hairline."
- "Chrome recedes to near-invisible so imagery carries all the weight."
- "Display type is tightly tracked and negative-spaced; body type is not."
- "Exactly one shadow exists in the whole system, and it means *resting on a surface*."
- "Sections alternate light and dark full-bleed, so scrolling feels like turning pages."

Not abstractions (these are tracings):
- "Use `#0066cc`"
- "SF Pro Display at 56px"
- "Looks like Apple"

## Step 2 — Abstract away the source

Rewrite each of the five without any brand-identifying detail. If you cannot, drop it.

The test: hand your five lines to someone who has never seen the reference. Could they
build something coherent? If instead they would need to go look at the source, you have
written a pointer, not a pattern.

## Step 3 — Mutate. Apply at least two operators.

This is the "be weird about it" step, and it is not optional. Pick two or more, and record
which ones in the lock.

### 1. Invert the axis
The reference organises horizontally → organise vertically. It scrolls → it stacks. Its
rhythm is regular → its rhythm is syncopated.

### 2. Displace the signature
Take their signature move and apply it to a different element than they did. Apple's single
resting-shadow belongs under product photography; put it under a *timeline scrubber* and it
means something new.

### 3. Change the material
Keep the structure, swap the physical metaphor. Paper → glass → brushed metal → phosphor →
tape → vinyl → blueprint. This alone usually carries 70% of the distinctiveness, because
material drives shadow, edge, translucency and motion all at once.

### 4. Shift the register
Same layout, different emotional temperature. Clinical → warm. Corporate → underground.
Reverent → irreverent. Register lives in copy, tracking, and how much whitespace you are
willing to waste.

### 5. Constrain harder
Remove one thing the reference relies on and solve without it. No imagery. No colour beyond
two. No motion. Forced constraint produces more originality than added freedom, reliably.

### 6. Borrow from outside the category — **strongest operator**
Do not take the motif from another website. Take it from the most characteristic object in
the subject's own world.

| Project | Weak reference | Strong reference |
|---|---|---|
| BeatMind | Spotify's UI | a mixing desk, a spectrogram, the Camelot wheel, tape splice marks, a patch bay |
| Vivid | another AI image tool | a storyboard pad, a film contact sheet, a shot list, a light meter |
| the portfolio | another dev portfolio | a star chart, an ephemeris table, an observation log |

This is where the good stuff is. A music tool whose visual language comes from **harmonic
mixing notation** rather than from other music websites will not look like anything else,
because nothing else started there.

## Step 4 — Justify

For each mutation, write one line: what changed, and why it serves Ground. A mutation that
is weird but fights the product's job is worse than the copy would have been. Weird has to
earn its place; "different" is not a goal on its own.

## Step 5 — The clone check

Before build, answer honestly:

> If the target brand's designer saw this, would they recognise it as derived from their
> work?

- **"No, but I see the shared logic"** — correct, ship it.
- **"Yes, obviously"** — go back to Step 3 and apply another operator.
- **"No relation at all"** — you abstracted past the point of usefulness. The reference was
  chosen for a reason; recover the structural logic.

Record the answer in `DESIGN_LOCK.md` under `## Target`.

## Why no source images in context

The skill deliberately does not hold reference screenshots while building. Visual context
biases toward reproduction — measurably so. Captures are read **once** at `init`, converted
to the five written abstractions, and then discarded from working context.

Everything after that stage builds from the words, not the pictures. That is what makes the
output original rather than a competent forgery.
