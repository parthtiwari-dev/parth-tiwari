# lwOIVNRHndM

**Title** Design in Claude Code Like This
**Channel** UI Collective (playlist PL14)
**Duration** 15:51
**Grade** HIGH. The tightest statement of the whole method in Group B. Three skills, one prompt,
one result inspected element by element. It is PL03 compressed with the reference layer added.

---

## The three-part model

Stated plainly, and it is the organising frame for all of Group B:

> "First off, does AI understand your tokens? We can check that off. Then does AI understand your
> components? We can check that off. But one thing we still need to check off is whether or not it
> understands what it is that we actually want to design."

Tokens, components, intent. The first two are encoded as skills. The third is supplied as
reference images, per build.

The failure that motivates part three:

> "the worst thing you can ever do when you're building AI designs, hey, build me this dialogue
> box, build me a modal, make it look better, that kind of thing. It's too vague. AI is not good
> at generating designs when the instructions are really vague."

## 1. Encoding a design language

### Why the raw variable panel does not work

> "What I see a lot of designers doing is they're in whatever Figma file has their variables and
> they copy a link to the file and just provide it to the AI. What's the issue with that? The
> issue is we go into our variables and all we have is the variable name and its explicit value.
> And if for whatever reason our variables are even remotely vague in terms of their naming, the
> AI is not going to know which to apply when."

**A token list without prose is not an encoding.** The name plus the value is not enough
information to choose between two tokens with similar names.

### The token documentation format

Four columns. Same as PL03, stated more compactly, with a time budget:

> "you have the variable name, you have its value light mode, value and dark mode, and a brief
> description, like a one-line description on when that variable is going to be used... spend an
> hour, real simple template, just the variable name, its value on light mode, value on dark mode,
> and description."

**One hour, four columns, one line of prose per token.** That is the whole cost he quotes for the
foundational artefact.

### The component grouping

Identical to PL03: form elements, navigation, data display, each with its components nested under
it.

> "It just helps keep the AI on track a little bit and helps to organize its thinking. Again, it
> doesn't matter the types of groups that you have."

Scaling note he flags mid-recording:

> "depending on the complexity of your design system, you may actually need individual skills for
> each of your component groupings depending on how many components you have. In order to help
> keep our skills a little bit more lightweight, a little bit more readable, and a little bit more
> manageable."

He does it as one skill here for time, and gets a useful structure anyway: the model produced a
top-level skill file plus **separate reference files per grouping** (data display, form elements,
navigation) on its own. That is progressive disclosure emerging from the grouping.

## 2. The exact prompts

**Token skill:**

> "Please review all of the design tokens and Figma variables found inside that Figma frame linked
> above. After reviewing and mastering when each variable should be used, build a Claude skill
> that will inform Claude on when to use each token when building design and when not to use each
> token."

The trailing clause matters: **"and when not to use each token."** He asks for the negative case
explicitly.

**Component skill:**

> "Please review all of the form elements, navigation, and data display components. Come to an
> elite understanding of all components available and when each component should be used. After
> doing so, build a Claude skill on all of the components inside of this design system, inside of
> those component groupings, and when AI should use each."

He notes on camera that he forgot to say variants and properties out loud, and that the model
picked them up regardless. PL03's version of this prompt does say them; prefer PL03's.

**The build prompt, with all three parts loaded:**

> "Based on the attached examples of designs that I like, along with the information stored inside
> of the design tokens and design system component skills, please build me a HTML paywall for a
> finance application. We are going to push to Figma inside of this file later on. Again, start
> with the design locally before we push to Figma."

Structure: reference images first, skills named second, artefact third, destination declared
fourth, and the order of operations pinned last.

Note that he still pastes the design system link even though the skills are installed: "if you
have multiple design systems installed, is it still best to provide the link, even if you do have
some of those skills installed. Just best practice."

**The push:**

> "Ensure you use all components, variables, and styles where needed."

## 5. Reference-driven design

Screenshots from Mobbin, three of them, for a paywall screen. The selection rule:

> "you kind of want your whenever you're feeding AI example designs, try to keep them as similar
> as possible. Again, they don't need to be one-to-one, but something similar to this in terms of
> style, in terms of feel."

**Three references, chosen to agree with each other.** A spread of contradictory references
averages into nothing.

He also uses the corpus's own similarity feature to build the set: pick one screen he likes, then
"see similar screens that are like this."

## Result, inspected

He clicks through the Figma push element by element and reports honestly:

- Correct surface page variable, correct button component, correct close component, correct badge
  component
- Text: style and variable both correct in most places
- One miss: "we missed a style on this one, but we have a variable applied"
- Responsiveness: "Responsiveness looks pretty good"

His explanation for the misses, which is the general rule:

> "when it comes to AI-generated designs, the more complex the design, the more it's going to
> miss, regardless of what your skills have."

## 4. The Figma question

Figma is the source of the documentation and the destination of the output. The ordering rule is
the useful part:

> "the reason why I asked it to build it first before we push to Figma is it's easier to iterate
> in Claude code instead of pushing something to Figma right away, realizing you don't like the
> result, then tweaking it in Claude code. It's just a workflow thing."

**Iterate in code. Push once, when done.** Same rule as PL15.

He also states the delta this method buys over the off-the-shelf Figma skills, which is the honest
comparison:

> "if you played around with Figma skills already, you're going to notice that for most of your
> variables, most of your components, things get missed. But with the addition of the workflow,
> the skills that I showed here, AI gives you a better result first time around."

That is the reconciliation for the apparent contradiction with PL16 and PL17, which say Figma
skills are not worth adopting: the generic skills alone underperform, the generic skills plus
hand-authored token and component skills work.

## 3. Numbers

None.

## 6, 7, 8

- **What makes output look generated**: not addressed directly. He removes one icon by taste ("I
  think it looks a little bit out of center") with no rule behind it
- **Critique loops**: none. Single pass, then manual inspection
- **Mobile and responsive**: one spot-check ("let's do a responsiveness check"). Nothing authored
