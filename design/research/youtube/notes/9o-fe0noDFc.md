# 9o-fe0noDFc

**Title** Figma Skills Explained
**Channel** UI Collective (playlist PL16)
**Duration** 17:08
**Grade** MEDIUM. Two thirds is install mechanics for a GUI that will have changed by the time
anyone reads this. The third that matters is a measured negative result and a clean verdict.

---

## 4. The Figma question: the clearest verdict in Group B

Stated up front, before the demo, and then earned by the demo:

> "Figma skills are wildly inconsistent in terms of the results and don't really speed up my
> workflow yet."

> "I'm seeing a lot of claims where it's like, 'These changed the game. I've never worked more
> efficient as a designer.' I personally have not found those claims to be truthful. I've tried a
> bunch of different prompting structures, and the results are just wildly inconsistent."

### The measurement

One SaaS onboarding page, built with all Figma skills installed, against his own design system.

> "this took 10 minutes and a ton of Claude tokens for this result. And I could have built this on
> my own in less than 5 minutes."

Element by element on the result:

- Page: no variable applied
- Card: no variable applied
- Text: no text style, no variable
- Components: correctly used

He then ran the audit skill, then asked it to fix what the audit found, and re-inspected:

- Page variable: **still missing**
- Card surface variable: **still missing**
- Stroke and drop shadow style: now applied
- Text: variables correct, **text style still missing**
- Components: still correct

**The critique-and-fix loop closed about half the gap and then stopped.** That is a useful data
point about the limits of "audit then fix" as a loop: it converges partially, not fully.

Non-determinism, stated flatly:

> "I've ran the exact same workflow that we just went through in this video together on my own and
> it's worked perfectly before, where it got every radius, every spacing, every component, every
> style, every text style, every drop shadow style, every variable perfectly. But here you can see
> it's not working."

### The verdict

> "is it worth adopting Figma skills into your workflow right now? Probably the only one that I see
> you actually adopting is that audit design system skill."

With a hedge about the future that is fair: they will improve, and knowing them has career value
even if you do not use them daily.

And a pointed question worth repeating:

> "start asking yourself if someone's really pushing you to use Figma skills. Are they asking you
> to use Figma skills at work because they want to show that they're adopting AI? Because this
> isn't an efficient workflow."

## What a Figma skill is

> "Figma skills are structured files that guide AI on how to work with Figma... They define how to
> do specific actions, things like creating components, generating layouts, or syncing variables."

Install order matters. `figma-use` is the prerequisite: "a foundational skill that teaches our AI
agents what tokens, variables, styles, and components are, how to necessarily use them on the
canvas." Nothing else works properly without it.

The skills he names as worth downloading:

| Skill | What it does |
|---|---|
| `figma-use` | Prerequisite. Teaches the agent what tokens, variables, styles and components are |
| `figma-generate-design` | Create new designs using existing components and variables |
| spacing skill | "applies hierarchical spacing with variables and fallbacks" |
| `audit-design-system` | Audits Figma screens for design system integration drift |
| `apply-design-system` | Connects existing Figma designs to published design system components |

On the spacing skill, an observation worth keeping: "whenever I'm building a design using skills,
the spacing variables are not always applied. But if I have this skill actually installed, they're
applied a little bit more consistently." **Spacing is the token category most likely to be dropped
and needs its own reinforcement.**

## 1. Encoding a design language

Skill packaging mechanics, which do transfer to any skill you write:

- The folder structure in your client must **mirror the source repository**: `SKILL.md`, then
  `references/`, then `references/working-with-design-systems/`
- Reference `.md` files are loaded by the top-level skill, not inlined into it. Progressive
  disclosure by directory
- Name the file `SKILL.md`. "Claude will still let you upload it, but it's best practice just
  rename it to skill in all capitals"

The gap-filling recommendation, credited to a community member:

> "you can also build your own skills that complement Figma skills... Things like for design system
> documentation, when to apply specific variables, when not to apply specific variables... when do
> you use a checkbox versus a radio button in the context of your design."

That is PL03's rules skill again, arrived at from the opposite direction: the generic skills know
the *mechanics* of Figma, and know nothing about *your* rules, so the rules have to be authored.

## 2. The exact prompts

**The build, with inline guidelines:**

> "Please build me a simple SaaS onboarding page inside of Figma [design system URL]. Guidelines:
> white background, form in center of page, form inside of card, use input components and not field
> components."

Two things worth copying from this shape:

- **"inside of Figma" must be said.** He calls it out: "The inside of Figma is really important to
  specify"
- A **negative component instruction**: "use input components and not field components." Where two
  components in your system are near-synonyms, disambiguate in the prompt rather than hoping

**The audit:** `please run an audit of this page`
**The fix:** `please fix the design`

## 3. Numbers

None.

## 5, 6, 7, 8

- **Reference-driven design**: not covered
- **What makes output look generated**: not covered
- **Critique loops**: audit then fix, and its partial convergence is measured. See above
- **Mobile and responsive**: absent
