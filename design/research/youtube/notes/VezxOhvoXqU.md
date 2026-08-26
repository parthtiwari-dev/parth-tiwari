# VezxOhvoXqU

**Title** Train Claude on Your Design System (Advanced Workflow)
**Channel** UI Collective (playlist PL03)
**Duration** 26:19
**Grade** HIGH. The single most valuable video in Group B for the encoding question. Real
consulting practice, states its failure modes, and shows the exact skill-generation prompts.

The speaker's day job is making enterprise design systems machine-readable: "my partners and I,
we make a living building design systems and most notably right now helping larger enterprises
make their design systems AI ready." Everything here is that method compressed.

---

## 1. How to encode a design language so a model holds it

### The shape: not one document, six or seven skills

He never produces a single `DESIGN.md`. He produces a set of narrow skills, each scoped to one
slice, so the model loads only what the current task needs:

| Skill | Scope | Prescriptive? |
|---|---|---|
| Design system rules and debt | When a component may and may not be used; what is broken and must stay broken | Yes, heavily |
| Form elements | Every form component, its variants, properties, use cases | Yes |
| Navigation elements | Same, for navigation | Yes |
| Data display | Same, for data display | Yes |
| Colour variables / design tokens | Every token, both modes, when to apply each | Yes |
| Type styles | Every style, its font, weight, size, line height, letter spacing, and the variables inside it | **No.** Explicitly no usage rules |
| Spacing and shape | Radius, border width, drop shadows, layout variables | **No.** Explicitly no usage rules |

The prescriptive/non-prescriptive split is the most transferable decision in the video, and he
gives a reason for each side of it. See section 3.

### What goes in the rules skill: two questions, not a template

> "ask yourself two questions. What do I have to tell a new designer about our design system?
> And what do we want to change that we simply just can't? Well, you just answered the
> questions, you have your rules, and you have your debt."

**Rules** are conditional component choices, not definitions. His examples:

- Radio button versus checkbox at more than four options versus fewer than four
- A menu with only four options does not need a search field inside it, because all options
  show on expand
- Which card variant for which case, which modal variant for which case

> "I'm not talking about basic components like a button or versus like a link, but something
> like an accordion, an expandable, a drop-down menu search, more complex components that have
> very specific use cases."

**Technical debt** is the part almost nobody writes down: things that are wrong and will stay
wrong. His example is a button variant whose colour contrast fails WCAG AA, which has shipped
for fifteen years and cannot be fixed for political or cost reasons.

> "You need to inform the AI the same way you would a new designer on your team to say hey I
> know these links are really small but we can absolutely not fix it due to these specific
> reasons."

Without it: "AI drifts away from that design system and starts making changes to layouts and
inventing UX treatments that aren't found in other designs at your enterprise."

### What is deliberately left out

- No usage guidelines for type styles (they backfire, see below)
- No usage guidelines for radius or border width ("it's rare to have concrete rules around your
  radius. Believe it or not, it is pretty rare")
- Unmapped variables. Only the tokens actually applied to components get documented: "everything
  else doesn't really matter because you don't really have usage guidelines for these"
- No shared or borrowed skill. "no two design systems are exactly the same. Your rules and your
  debt will be 100% unique to you and your enterprise... Don't look at what others are doing."

### The component-grouping failure mode (the reason for three component skills)

This is a concrete, mechanical reason not to hand the model a flat list. Told as a traversal
bug:

> "AI is going to go from the button, read the button, document the button, then go to the data
> table, and then it's going to realize that there's this atom component that has a checkbox
> inside of it. Then what it will do is it's going to skip the radio button and then the menu
> component and proceed... right to the checkbox component because it realized that there was a
> checkbox atom component inside of it."

A nested child pulls the traversal out of order and the siblings between are never documented.
The fix is to fence each pass: "Do not review components from any other grouping."

His three groups: **form elements, navigation elements, data display**. Loader sits in form
elements because of submit states. He is explicit that the grouping itself is arbitrary and the
fencing is what matters.

### The token documentation format

Four columns, and the fourth is the load-bearing one:

| Token | Light mode | Dark mode | Description |
|---|---|---|---|

> "The description here is super important because that's what's going to inform AI on when to
> use which like a surface page as an example, background token for main page level containers.
> It can be something as simple as that. But without this description, AI is not going to know
> when to apply the surface default versus the surface page."

## 2. The exact prompts

**Rules and debt skill** (he types the rules and debt in as a list, spreadsheet or document):

> "We need a skill that informs AI on the rules of our design system and the technical debt
> within it. What is wrong but has to remain the same for product Y... for product Y build a
> skill that captures all of the following so the designs we produce do not drift away from our
> guidelines."

Naming the product is deliberate: "you don't want when you're building with AI AI to get mixed
up around which design system needs to be used for which product."

**Component group skill** (run once per group):

> "study the components within the form elements page grouping. Become familiar with every
> component, including its variance [variants], properties, and intended use cases. Do not
> review components from any other grouping. Create a skill that teaches AI which components are
> available within this group, how they should be used, and when each one is appropriate"

plus a link to the design system frame.

**Colour token skill:**

> "study all color specific Figma variables and design tokens with defined within the file...
> become familiar with each variable collection mode, token naming convention, value, and
> intended use case. Create a skill that teaches AI which variables and design tokens are
> available, how they should be applied, and when each one is appropriate."

He warns to say "color specific" or the pass will drag in number variables and text styles from
the same documentation frame.

**Type style skill** (note the inverted instruction):

> "study all type styles defined within the Figma file. Please become familiar with each with
> every available type style including its name, font, family, weight, size, line height, letter
> spacing, any variable applied within it. Do not create usage guidelines and recommendations
> for when each type style should be used. Create a skill that teaches AI which type styles are
> available and documents the variables associated with each one."

**Spacing and shape skill:**

> "Study all radius, border, width, and layout variables defined within the Figma file. Do not
> create usage guidelines or recommendations for when each variable should be used. Create a
> skill that teaches AI which variables are available."

**The test prompt, deliberately small:**

> "Please build me a contact us section design leveraging our design system."

## 3. Design system specifics with real numbers

There are almost none, and that is itself the finding. The numbers that do appear:

- **Type**: a system that forbids 16px for anything except paragraph text is described as
  actively harmful, because the model then invents a size outside the scale. "it either
  introduces like a brand new size or it uses something that's totally outside the norm of what
  it would normally use and things just get a little bit messed up."
- **Radius**: "you might want to add a two pixel radius to that card or even, you know, a 16
  pixel if it's on sort of a 1920 dashboard type size." Radius scales with canvas width, and
  that is the only radius rule offered.
- **Border width**: no rules needed, because the model will not do something absurd. "It's not
  going to apply a 16 pixel border width even then. Why would you even have that to a small
  button? **AI has more taste than you probably realize.**"
- **Spacing**: a flat numeric scale (his example goes up to 400) is called broken because it has
  no responsive mode. See layout variables below.
- **Shadows**: do not get their own skill. "I don't think drop shadows need their own skill at
  all." They ride along in spacing and shape.

The governing principle for how much to specify:

> "the more that you add, the more AI is eventually going to get confused."

## 4. The Figma question

Figma is assumed throughout. Figma MCP is the transport for every skill-generation prompt, and
the design system lives in Figma variables and published components. But the *authored artefact*
is a documentation frame he built by hand or with Figma agents, not the raw variable panel:

> "if I open up the sidebar, let's just go to our variables here... it's your mapped collection,
> which is where the variables are housed that are actually applied to components."

He points the model at a curated frame, not the file. That distinction is what makes this work
and is portable to a repo with no Figma at all: build the four-column table, point at the table.

Prerequisite he insists on: freeze the system first. "before you start to train AI and your
design tokens, make sure you have you're 100% confident in what's there. One change every six
months, not a problem. But if you're making changes every couple weeks, big issue."

## 5. Reference-driven design

Not covered. This video is all internal-system encoding, no external corpus.

## 6. What makes AI output look generated

Framed as drift rather than aesthetics: the model invents UX treatments that exist nowhere else
in the product. The fix is the rules skill, not a style instruction.

## 7. Critique loops

One rule, and it is about generation scope rather than critique:

> "Too many designers attempt to jump right to the entire page. This is where it starts to
> hallucinate... if you really want good results, focus on card by card, section by section."

And: preview locally before pushing to Figma, so the correction loop is cheap.

## 8. Mobile and responsive

**This is the only substantive responsive idea in all of Group B, and it is good.**

The problem with a plain numeric spacing scale: a token named `16` cannot hold two values.

> "how do I know what the 16 is going to be? If this is on desktop, how do I know what the 16
> will be on mobile? What's the other issue with that approach is even if you add another mode
> here, the page margin might be 16 on desktop but then 14 on mobile but maybe we use this 16
> pixel for like gap between card components but it's 12 on mobile."

His answer, which he calls **layout variables** (previously "jumper variables"):

- Name the token by **use case and step**, not by pixel value: `xxs`, `xs`, `s`, `s-to-xs`
- Each token carries a desktop value and a mobile value
- The same desktop value can appear in several tokens that collapse differently on mobile,
  which a numeric scale cannot express because two tokens cannot both be named `16`

He is honest that this does not get applied correctly first time: "It's very rare that AI gets it
perfect when it comes to spacing variables the first time around."

## Other notes

- He observed the newer model being *worse* at exhaustive component capture: "Opus 5, I've
  noticed when compared against running the same workflow with Opus 4.8 is not always as good at
  picking up each component." Version numbers are likely caption garble; the point stands that he
  verifies the enumeration by hand.
- If the model's local preview is off-brand but the Figma push is on-brand, remind it the skills
  exist. "Usually when you push to Figma, that's when that translation happens."
- Result of one prompt with all skills loaded: correct component instances, correct text styles,
  no raw hex codes. "there's no raw hex codes applied."
