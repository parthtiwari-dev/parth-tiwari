# NAumQObJEwM

**Title** Turn Claude into a Design Genius... Just Watch
**Channel** Jack Roberts
**Duration** 17:55
**Grade** MEDIUM. One technique in here is the best single idea in Group C. The rest is a
product demo for his paid community.

The good idea: **make Claude diff your site against a site you admire and output the gap as
named properties with paired values.** It converts "it looks better than mine" into a change
list.

---

## The slop tells, categorised

> "Why is slop so apparent? ... you'll find these certain tells that appear everywhere else. And
> there are literally five things that you'll notice. **It's typography, imagery, hierarchy,
> color, spacing.** Some classic telltale signs."

Five categories, no values. Combined with `z9CwM-DAe5Q` (purple gradient, Inter, three cards)
that is the complete slop taxonomy from this channel.

He also quotes a framing worth keeping: models "make bad designs because they've never seen what
good or great design looks like."

## Level 1: the comparison teardown

He uses an unnamed website ("over 2,000 designs of what excellent looks like") that publishes,
per site, a design hierarchy explainer, colour palette, typography, Tailwind config, CSS
variables and design tokens. Sites he names from it: Linear, Phantom, Whisperflow, Slosh, Apple.
**The site's name is never spoken and is on-screen only.** Do not guess it; find it before
relying on this section.

The prompt, verbatim, is the part that transfers:

> I would like you to use the below website to look at this page and compare it with mine. I
> want you to be **ruthless** in understanding the design differences and how I can improve mine
> based on the aesthetics and everything. [his site] [the reference site] Hey, this is a design
> system. You can also go to Linear's website directly, utilize screenshots. **I would like the
> output as a beautiful HTML breakdown. Keep it concise and simplistic.**

Three things make this prompt work and all three are copyable:
1. Both URLs, plus permission to screenshot the live reference rather than trusting the token
   dump.
2. "Be ruthless."
3. An **artefact** as the output, not chat prose. He gets an HTML page with an interactive
   slider that animates between his value and the reference's value for a given property.

### What the teardown returned

Three headline gaps, verbatim:
- **"The letter spacing is too loose."**
- **"There's no elevation ladder."**
- **"The hero art competes with the product."**

Then a property-by-property table. The properties he reads out: **shadows, accents, frequency,
border radius, vocabulary, the values side by side, the display weight**, plus **line height**,
**letter spacing**, **corner radius** and **amount of white space** mentioned in his commentary.
The values themselves are on-screen only and are never spoken, so this note cannot record a
single number from the most numerically specific segment in Group C.

His framing of why this matters is the strongest sentence in the video:

> "knowing what's happening is one thing, but being able to articulate it is something else.
> Sometimes we just know it looks good, but we can't explain it. **And that doesn't help
> Claude.**"

And his caveat: "it's not to say that Linear is the peak of design, but it is a billion-dollar
company and their website is gorgeous."

**Action step he states:** pick a site you think is excellent and run the comparison against
your own.

## Level 2: the design loop (covered properly in jq9LRwE0-GQ)

Introduced here, demonstrated fully in the sibling video. Summary from this one:

> "you provide it with a benchmark ... Claude creates a couple of different agents. One is like
> a critic, which goes round and round through various different stages and levels, all
> validating it. So, for example, one might say, does it hit the [brief]? The second critic
> might say, is the design great? And the third critic might be visual impact. So, it creates
> three different sub-agents, and it basically goes round and round the loop until it hits the
> desired mark."

Attribution: he calls it the design loop, "It was called the gauntlet loop by [the] gentleman who
discovered it." Credits **George Harley** for a collection of HTML email campaigns from real
brands used as benchmarks.

Worked prompt, verbatim:
> Go ahead and recreate this product launch for me in HTML such that if I were to paste it into
> an email, it would look beautiful. This is for the launch of [product] on Windows. **I want you
> to pay close attention to the luminosity divide, the energy.**

Result: one shot, HTML email, and he then sent it to himself through a Zapier connection and
confirmed the button worked. That last step is a real verification, and it is more than most of
these videos do.

Rationale for Zapier as the connector hub, verbatim: "you can, inside Claude, connect to all the
tools, but the problem is you need to do this in every single app, in Codex and then
Anti-Gravity ... If you connect to Zapier, you can use all these same things."

## Level 3: his Design OS

A local application he built by prompting, sold through his community. Features shown:
- Provider picker for image and video generation: **Higgsfield, KIE, OpenRouter, OpenAI**.
- Per-generation credit cost displayed before you commit. **Stated prices: two 2K 16:9 images
  cost 12 cents**, so roughly 6 cents an image, matching the KIE figure in `z9CwM-DAe5Q`.
- A local image library that indexes every image on the machine by content, not filename, so
  "burger" finds pictures of burgers with no metadata. He calls the indexer a "Karuchi model"
  (transcription is unreliable; probably a CLIP-style embedding model, inferred).
- "Style recipes": a named description plus reference images, reused to keep a series
  consistent. His example is YouTube thumbnails.

This section is a product pitch. The transferable part is the idea of a **named style recipe
carried across every asset**, which is what a tokens file already does for a website.

## Mobile and responsive

**Absent.** Zero mentions.

## Concrete design values

- Image generation cost: **6 cents per 2K 16:9 image** (12 cents for two).
- Property names, no values: letter spacing, line height, corner/border radius, elevation
  ladder, shadows, accents, display weight, white space.

## Honest read

The title is farming. Level 3 is an advertisement. But the level 1 comparison prompt is the
highest-value thirty seconds in Group C, because it is the only technique here that produces a
**measured** design change list instead of a vibe. Run it once against a reference and the output
is a tokens diff.
