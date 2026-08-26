# bBlY5YOsKN8

**Title** How To Use Claude Design To Build Beautiful Sites
**Channel** AI LABS
**Duration** 18:33
**Grade** HIGH SIGNAL. The most methodical video in Group C and the **only one that treats
responsiveness as a real problem**.

No clickbait in the title, no hype in the delivery, and the presenter states costs, limits and
failure modes rather than results only. It is also the only Group C video that ships a real
application rather than a demo page.

---

## The five stages

### Stage 1: write `design.md` before opening the design tool

The core argument, verbatim, and it is the single most useful paragraph in Group C:

> "the main reason you want to start with a predefined design file is that all these models
> output designs that look identical. **If you let Claude Design build the design system on its
> own, it just falls back to the generic colors and styles that the Opus models use
> everywhere.** And because of that, your site ends up looking like every other AI built site
> out there. But if you hand it a design.md to base the design system on, that file tells it
> exactly what you want. So it's way more controlled and doesn't fall back to those defaults."

On what `design.md` is: "This is a format that Google started and it holds all the details of
your brand's design. Your AI coding agent reads that file before it writes anything. So every
screen it gives you comes out on brand. It never has to guess so it never goes off brand."

Their skill for producing one: distributed on GitHub, **link in the description, URL not
spoken**. What it does, verbatim: "It interviews you and plans out the product's visual identity
with you in detail. And once it's got everything, it writes out the whole design.md. And it also
validates that against Google standards by running the scripts. **This skill also holds
anti-slop references, which are basically all the common patterns that give a site away as AI
built.**" (The references themselves are not enumerated on camera.)

Install path if you do not have a `.claude/skills` folder: "you can just tell Claude Code in the
prompt box that you need to install skills in the project, and it's going to set it up for you."

### Stage 2: visualise the design.md before spending tokens on it

The reasoning is the kind of thing the rest of Group C never says:

> "that Google format is easy for the AI model to understand, but it's hard for you to actually
> picture the designs that are going to be generated from this ... **But don't test it inside
> Claude Design.** You generate your designs there. And let's suppose you don't like them. Now,
> you have to go back into the design.md, change it, and generate everything again. **Every one
> of those rounds costs you tokens.**"

Tools named:
- **designmd.space** (spoken "design MD.space") to render a `design.md` as a visual page.
- **getdesign.md** (spoken "getdesign.md") which "lists a lot of brands and all their styles as
  design.md files that you can go and get yourself". A second source for the same thing the
  Jack Roberts videos call Awesome Design.
- **Coolors** (https://coolors.co) for the palette. Export, Code, paste the output straight into
  Claude Code and it lands in the `design.md`.

On copying: "copying one as a reference is what a lot of people already do. You take it in as a
starting point and make changes to make it your own. Just like how a lot of people have taken
Notion's simple look and worked it into their own designs after a few tweaks."

### Stage 3: wireframe before visual design

> "you could just straight up build the site instead, but that causes problems. You'd have to
> wait a long time because Claude Design is slow to create designs. And if after all that, the
> design isn't what you need, you'd have to redo the whole thing."

Method: select the design system, choose the Wireframe option, prompt with the screen count, and
ask for **multiple variants per screen** so you can pick. Iterate with the **comment tool**
rather than reprompting.

Why the comment tool is better, verbatim: "A comment basically sends the exact details of that
element along with your prompt. So Claude knows exactly which area needs changing and how. That
makes it way better than just prompting and letting Claude figure out which area you mean on its
own."

Batching rule: "You could send them one by one, but **it's better to group them and send them
all at once** so it resolves them together and fixes everything in one go. That keeps your wait
time to a minimum."

### Stage 4: visual design on top of the wireframe

- Select the chosen variant by its code number.
- Prompt: turn these screens into full-detail designs, **keep the layout and structure from the
  wireframe**, clean spacing and hierarchy.
- **Two named failure modes of the output:**
  1. "it tends to not pick button colors properly. Some buttons need to grab attention and
     should be in a bold color to stand out."
  2. "because it builds on top of the wireframe, the site comes out a little blank on its own
     with just the basic parts added in over the rough sketch. So, you can ask it to add
     textures and elements for a fuller look."
- Use direct canvas edits for trivial changes: "if you've got a minor change, like deleting some
  element, you can do it directly on the design without prompting Claude for it. That way, the
  change gets applied without you waiting around and wasting tokens on something that small."
- Finish with a polish prompt: "you can ask Claude Design to polish the overall look and it makes
  these subtle, meaningful changes."

### Stage 5: animations, then handoff

Animation brief, paraphrased by the narrator but specific about restraint:

> "a prompt to add animations across all the screens like things scrolling into view or any
> other small touches that make the site feel more alive. And we told it to **keep them subtle
> and not make anything too springy since that can feel off**."

Handoff: Claude Design and Claude Code talk through the **Claude Design MCP**, and it is
bidirectional: "you can move your designs from Claude Design into Claude Code and bring them back
over the same way too."

---

## The responsiveness finding, which is the reason to keep this note

This is the only place in Group C where mobile is treated as a defect class:

> "we asked it for a deep review and it started checking the design.md against what it actually
> built to see if the two matched up. And **this review caught multiple issues like
> responsiveness problems, which just means the app wasn't looking right on different screen
> sizes such as mobiles or tablets. What Claude Design builds tends to have this problem because
> it's still an early version. So whatever it designs comes out best for the exact thing it was
> made for. A design made for a website will look great there but not always on other screen
> sizes.** So we ran the fixes and after that the visual part of the app was working and
> responsive."

Two things follow. First, **a Claude Design export is not responsive by default** and the person
who has shipped the most with it says so plainly. Second, the mechanism that caught it was a
**deep review that diffs the built output against the `design.md`**, not a screenshot pass. That
is a gate, and it is cheap to reproduce.

## Model and cost guidance (the only such guidance in Group C)

- "We use Opus 5 ... on **medium effort** for our design tasks because it lets us design easily
  without wasting too many tokens."
- Fable exists in the picker but with limited access. Opus is "still the best for designing, but
  the problem with these Opus models is that they just burn through a lot of tokens." Haiku
  "doesn't use nearly as many but might need more refining."
- "Claude Design runs on a 5-hour limit, but it isn't just for your designs. Everything else you
  do on Claude counts toward the same one."
- Repeated warning: "Claude Design is still very token hungry."

## Backend, for completeness

Supabase, via the official Supabase agent skill bundle (two skills: the Supabase skill, which
triggers on any database or auth task, and a best-practices skill that triggers on the words
"optimize performance"). The skill is instructions only, so it requires the Supabase CLI or MCP
alongside it to actually touch the project. They chose the MCP "because it's easier to set up and
we wouldn't have to deal with the keys."

## Concrete design values

**None numeric**, but three qualitative rules that are actionable:
- Keep animations subtle, avoid springy easing.
- Buttons that need attention need a bold colour; the model will not do this on its own.
- Wireframe-derived pages come out under-filled and need texture added deliberately.

## Honest read

The best video in Group C. No inflated claims, real limits stated, the workflow is ordered by
what it costs to get wrong (write the file, visualise the file, wireframe, design, animate,
review), and it is the only one that has looked at a phone.
