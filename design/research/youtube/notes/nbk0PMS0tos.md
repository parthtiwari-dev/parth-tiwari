# nbk0PMS0tos

**Title** Generate Better AI Designs in Claude Code
**Channel** UI Collective (playlist PL18)
**Duration** 11:00
**Grade** HIGH for its length. It is one method demonstrated as a controlled before/after with the
same prompt on both sides, which no other video in Group B does. Eleven minutes, no padding.

---

## The experiment

**Before.** Cold prompt, nothing loaded:

> "Please build me a landing page for a crypto bank."

Result: "basically what every standard AI design looks like. An aggressive use of gradients, you
know, basic metrics... there's nothing really like special about it."

**Intervention.** Build a `design-inspiration` skill, put six screenshots in it.

**After.** The **identical prompt**, rerun.

> "this is just with that one-line prompt and those six sample screenshots and no other
> instructions. This came back with a landing page that looks a little bit more like something
> that we might actually want to build."

The control is what makes this worth reading: prompt held constant, only the skill added. Six
screenshots from two sites moved the output.

## 1. Encoding a design language: reference images as the encoding

This is the lightest encoding method in Group B and the only one that carries no prose rules at
all. The design language is the image set.

### The skill-creation prompt, verbatim

> "Please build a Claude skill called design inspiration. Here, every time a design is created or
> modified, Claude will look at the files inside of this skill, which will include visual
> references of designs I want to mimic. This will help create designs more closely aligned with
> the look and feel we are going for."

Three parts: the name, the **trigger condition** ("every time a design is created or modified"),
and the purpose. He is explicit that "mimic" is not "copy".

What the model wrote unprompted: sections for how to use the skill, visual references, and **how
to interpret the references** ("Again, I didn't write any of this. Claude just did it on its
own"), plus an `images/` folder.

He is honest that he did not polish it: "In an ideal world, you might want to spend some time
polishing this skill, making sure it makes sense."

### Populating and organising it

> "Please add these to the images folder for reference."

Then, and this is the part that scales:

> "Can you put the linear screenshots inside a linear folder and the same with rocks as well just
> for better organization. Also, name the images better."

Filenames matter because the model reads the tree before it reads the pixels. Descriptive names
plus per-source folders make the corpus queryable.

### The growth path, stated as a directory structure

> "The more you populate your Claude skill, the better the output is going to get. The more
> competitors you add, you can break out your competitor screenshots into different folders based
> on different features or functionality or layouts. Things like a hero, you can have folder for
> your hero inspiration, for your footer, for different content blocks, different layouts."

Two axes, and he switches between them mid-sentence without noticing:

- **By source**: `images/linear/`, `images/rocks/`
- **By section**: `images/hero/`, `images/footer/`, `images/content-blocks/`

Inferred: the section axis is the more useful one once the set is large, because a build prompt
asks for a hero, not for Linear. Source folders answer "who does this well"; section folders
answer "what should this part look like". Nothing in the video resolves which to pick, and doing
both means duplicating images.

## 2. Prompts, collected

1. `Please build me a landing page for a crypto bank.` (used twice, as the control)
2. The skill-creation prompt above
3. `Please add these to the images folder for reference.`
4. `Can you put the linear screenshots inside a linear folder and the same with rocks as well just for better organization. Also, name the images better.`

## 5. Reference-driven design

Corpus is Mobbin, "sites" section rather than the mobile app section, because the target is a
landing page. He picks two sites, **Rocks** and **Linear**, three screenshots each, all dark mode
because the target is dark mode.

Selection is not random. He picks the sites first by look, then takes multiple sections from each,
which gives the model a consistent language rather than six unrelated frames. Same rule PL14
states explicitly.

**Six images was enough.** That is the useful quantity in this video.

Verification that the mechanism fired: "you can see here, while it's going, that it studied the
references that were inside of that skill that we just created, which is exactly what we want to
see."

## 6. What makes AI output look generated

One signature, named: **"An aggressive use of gradients"** on the cold output. Also "the cards
aren't that bad, but they just look a little AI-generated", with no diagnosis offered.

The fix here is entirely reference substitution. No vocabulary, no rules, no values.

## The honest framing

> "what I'm trying to get at here is not to build something where it's wow, oh my goodness, you
> did that in 10 minutes, but to show you the power of that workflow."

And he does not oversell the result: "this here is a first draft."

## Sections with nothing in them

- **Numbers**: none
- **Figma**: not mentioned at all
- **Critique loops**: none
- **Mobile and responsive**: absent
- **Design system**: no tokens, no components. Deliberate. This method assumes you have neither
