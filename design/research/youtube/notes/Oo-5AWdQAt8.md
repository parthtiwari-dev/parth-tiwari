# Oo-5AWdQAt8

**Title** Use AI Like a Senior Designer (3 Workflows)
**Channel** UI Collective (playlist PL02)
**Duration** 14:19
**Grade** HIGH. Sourced from interviews with designers at Meta, Google and others rather than
from the presenter's own habits, and it contains the best critique prompt in Group B.

Three workflows: widget-before-page, persona-driven flow evaluation, reading-order handoff.

---

## Workflow 1: build the pieces before the page

The anti-pattern, named precisely:

> "we start off our AI design generation process by actually building out an entire page...
> And then when we don't like the result, we regenerated a couple times till we land on a
> concept that's semi-decent. And then we spend hours and hundreds of thousands of tokens
> prompting to refine."

The replacement:

> "they're not starting off with page generation. They're starting off with widget generation.
> And whatever that most important widget is on the page, that's where they start. And they
> produce dozens and dozens of different layouts and designs based off that widget before they
> even think about the rest of the page."

Then the widget leaves the AI surface. Screenshot into Figma, recreate as editable layers, apply
the design system, and compose the page by hand. The reasoning is not tooling preference:

> "when you're working in these big corporate enterprise settings, if you're relying AI to do
> the thinking for you, you're not going to make it very far."

Selectivity matters. He does not repeat the loop for every widget: "Only where he's stuck on
different treatments, where he's not too sure what the art of the possible is."

### The widget prompt, verbatim

> "I'm designing a banking dashboard where net worth is the primary widget. Create eight
> distinctively different versions of this widget exploring different layouts, chart styles,
> functionality, controls, insights, and ways of visualizing growth over time. Do not design the
> full dashboard, focus only on the full width net worth widget. Each concept should have a
> clearly different format, visual approach, and color scheme alternating clean, modern, light
> mode, and not overly busy."

Structure worth copying:

1. Name the widget and say it is primary
2. Give a count (**eight**, not "some")
3. Enumerate the **axes of variation** (layout, chart style, functionality, controls, insights,
   time visualisation), so the variation is structural not cosmetic
4. State the negative scope twice: "Do not design the full dashboard, focus only on the full
   width net worth widget"
5. Constrain the register at the end (clean, modern, light mode, not overly busy)

Value claim: "if I had asked Claude Design to build me a dashboard, it might have given me this.
But personally, this option here I really like... Can you imagine the amount of prompting that
you would have to do to go from this that it might have given you originally to something like
this?"

## Workflow 2: persona-driven flow evaluation (the critique loop)

Setup first. A **flow home base**: one page linking every flow to be tested, so the agent can
enter a flow, finish, return, and cross-compare.

> "sometimes what he sees happen is AI goes through one flow, it moves to the next flow, and then
> it realizes it needs to clarify something so that it exits that flow, and then moves back to
> the first flow in order to make sure that it captured what it needed to."

He runs it in Google Antigravity for browser control; the designer he interviewed uses Claude
Code. The agent drives a real browser against a real local URL.

### The prompt, verbatim, two halves

Persona half:

> "Browse both flows from the perspective of this persona on the URL above. The persona is a
> senior financial advisor managing a large book of high net worth clients, highly experienced
> with wealth platforms, time constrained, and focused on quickly finding great information,
> identifying risks, and has no incentive on switching tools."

Protocol half:

> "Review each flow independently before comparing them at every step. Explain what you believe
> is happening, what you expect to happen next, where you hesitate, what feels unclear, and your
> confidence on one to five. Ignore visual aesthetics unless they directly affect usability. Once
> complete, compare both flows and recommend which better supports the persona's goal citing
> specific moments from the experience."

Six mechanisms in the protocol half, each doing work:

- Independent pass before comparison, so the second flow is not judged against the first
- Per-step narration of belief ("what you believe is happening")
- Per-step prediction ("what you expect to happen next")
- Hesitation and confusion reported explicitly
- A **1 to 5 confidence number per step**, which makes the output scannable and diffable
- Aesthetics excluded unless load-bearing on usability, which forces functional critique
- Citation required ("citing specific moments from the experience")

Also note the persona includes a **disincentive**: "has no incentive on switching tools." That is
what stops the agent writing a satisfied review.

Output he got: a core recommendation with reasons, then per-flow step-by-step analysis with what
happened, what was expected, and where the persona hesitates.

### The honest caveat

> "I don't think you should ever take an AI suggestion and take it wholeheartedly. You should
> always double-check everything that it says."

And the case for doing it anyway: no instant access to users, no time to recruit before a
decision, and sometimes an executive wants a flow tested that you would not put in front of real
users.

## Workflow 3: reading order for developer handoff

The one handoff task the interviewed designers actually delegate.

> "the assumption that designers make is that the reading order is the logical order, and that's
> just not always the case. So, when designers are marking off reading order, they generally go
> left to right and then down."

Prompt: `identify the reading order based on this design` plus a Figma link. Screenshot works if
Figma MCP is unavailable.

Output: a numbered document broken out by region (navbar, hero, summary card, band four, asset
allocation). "when you have cards with a lot of different elements, that's where reading order
can actually start to drift."

He annotates by hand using the **web accessibility annotation kit by CVS Health** (Figma
community), and refuses to let the model annotate:

> "never ever ever just take the output that AI gives you, have AI add all the annotations, and
> then send it off to your developers. That's where mistakes can happen."

## Sections with nothing in them

- **Design system encoding**: not covered
- **Numbers**: none. One word, "contrast", in passing
- **Reference corpus**: Mobbin used only as a screenshot source for an illustration
- **Mobile and responsive**: absent entirely. Not one mention

## The Figma question

Figma appears in all three workflows and in each case as the place where a human works: the
widget is rebuilt there to be composed by hand, the reading order is annotated there by hand.
Figma is not doing anything a model does; it is where the delegation stops.
