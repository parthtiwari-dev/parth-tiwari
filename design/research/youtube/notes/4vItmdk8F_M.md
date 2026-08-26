# 4vItmdk8F_M

**Title** Turn Claude Into a SENIOR Designer in 3 Simple Steps
**Channel** UI Collective (playlist PL04)
**Duration** 18:10
**Grade** HIGH. Clickbait title, real method underneath. It is the only video in Group B that
shows the whole chain: reference corpus, then image generation, then a slop-removal skill, then a
hand-rolled brand skill, then a build that uses all four at once.

The three steps: connect MCPs that carry taste, install a slop-vocabulary skill, then build your
own brand skill so the first two do not drag you off-brand.

---

## 6. What makes AI design output look generated (this video's strongest section)

He dates the signatures:

> "It started out originally with these purple blue gradients and overuse of emojis. Now with
> Claude design, it's transitioned to something like this with these beige backgrounds, specific
> type treatments, and cards that feel a little bit out of place."

One more, caught live while reviewing a good output:

> "there appears to be like this drop shadow glow around some of the elements. And that's
> usually a sign of AI generation."

**The current slop signature list from this video: beige backgrounds, gradient-heavy heroes,
emoji, a soft glow rendered as a drop shadow, and cards whose contents do not justify the card.**

The framing for the fix is worth keeping:

> "Defeating AI slop is all about giving AI taste. And I'm not talking about just giving it
> screenshots of examples and saying, 'Oh, I really like this.' That's a very junior workflow."

## Impeccable, and why he moves off it

Free skill set, install with one command from its docs. Called "the missing design vocabulary for
our AI agents". Commands are verbs. Two he shows:

- `clarify` — the AI version says "your request is being processed"; the clarified version shows
  a loading bar while saving changes. Concrete state instead of a status sentence.
- `distill` — remove elements that are not doing work.

Invocation is a slash call plus an instruction, never a bare "fix this":

> "/impeccable distill this design"

> "it's important that you don't just say Impeccable fix this. Give it some instructions. Become
> familiar with the different commands, understand what it is that you want to change about your
> design."

The `distill` result, described concretely: dropped the tag and the top image, replaced a plain
progress bar with a lesson count, and turned a heavy button into a text link. That is a usable
recipe on its own. **Remove the badge, remove the decorative image, replace the abstract progress
indicator with the real count, downgrade the button to a link.**

Three reasons he then builds his own skill instead:

1. Token cost. "it can be very, very token intensive. And if you're on a lower plan... you might
   start running into issues."
2. It does not hold a rigid brand. "it's not always the best at following a more rigid brand
   guideline."
3. It cannot be installed at an enterprise. "if I tried to download this... I would have
   compliance emailing me and calling me being like, what on earth are you doing?"

## 1. Encoding a design language: the two-step mini system

This is the cheapest encoding method in Group B and the one that fits a project with no existing
design system.

**Step one, generate a brand guideline as a document:**

> "The product I'm building is a finance product in light mode. Minimal bright colors, soft
> neutral tones, plenty of white space. Please build me a brand guideline based on competitors in
> Mobbin, provide a locally ran version and a PDF version I can download. Thank you."

The prompt has three parts: the register (light mode, minimal bright colours, soft neutral tones,
plenty of white space), the corpus to derive from (competitors in Mobbin), and two output formats
so the artefact survives outside the session.

What came back: colour, typography, spacing and layout, and components. Components enumerated:
**button, input, badge, segmented control, metric tile, transaction row, data table, empty
state.** Eight, and several are domain-specific rather than generic.

**Step two, convert the document into a skill:**

> "Build a Claude skill that ensures every UI design for Vantage stays aligned with the guideline
> in this document. The skill must be referenced whenever a Vantage interface is created or
> updated, helping maintain brand consistency, enforce our design standards and prevent the work
> from drifting into the generic AI generated design patterns."

Three clauses doing work: name the product, state the trigger condition ("whenever a Vantage
interface is created or updated"), and state the negative goal explicitly ("prevent the work from
drifting into the generic AI generated design patterns").

### The size ceiling, stated with numbers

> "Why this is not a true design system is because we had about 20 colors or even less, not 80.
> We had about six components, not 50."

**Roughly 20 colours and six to eight components is the size at which one skill still works.** At
80 colours and 50 components, he says this approach fails and you need the split-skill method of
PL03:

> "If you had a full design system, it would be too much information here for AI to build one
> skill around. And that's a completely different workflow."

And a claim that cuts the other way from most marketing: a real design system makes slop *harder*
to avoid, not easier, because of the volume the model has to hold.

> "if you have a true design system... it's very difficult to steer away from AI slop given the
> amount of information AI actually needs to consume."

## 2. The exact prompts

**Reference-driven build, first attempt:**

> "I really like the connectors page within Mistral AI. Can you please build something similar?"

Result critique, and the risk he names: "Sometimes in the past when I've used Mobbin MCP, it
matches too closely to the original design that we don't always want."

**Reference-driven build with a deliberate divergence, plus asset generation:**

> "I really like the background treatment in Mistral AI's hero section. Can you create something
> with a similar feel, then use the Higgsfield MCP to generate a complimentary background image.
> Use a gray palette instead of orange, so it feels inspired by the reference without being a
> one-to-one copy."

**The single instruction that separates inspiration from copying is a forced palette change.**
"Use a gray palette instead of orange" is the whole mechanism, and it worked: layout carried
over, image did not.

**The composed build, using every layer at once:**

> "build me a dashboard for Vantage inspired by Stripe."

Six words, because the corpus MCP and the brand skill are already loaded. He narrates the chain:
"Claude browsed the Stripe design via Mobbin MCP, read the Vantage skill to build a design that
was on brand with that initial mini design system... and also had a lot of that inspiration from
Stripe."

## 5. Reference-driven design

Mobbin MCP, "about 620,000 real world UIs". His argument for it over Dribbble is the quality bar,
not the size:

> "I'm talking actual designs that are shipped in production, are from the best design teams in
> the world, have gone through user testing. So there's that quality bar that all the screens in
> Mobbin have. It's not like Dribbble where a lot of the designs are futuristic. They're cool
> treatments, but you don't know how good they would work in a real world setting."

**Higgsfield MCP** is the second corpus, for imagery rather than layout. His reasoning for
counting it as taste rather than decoration:

> "when it comes to giving AI taste, half the battle is honestly giving it access to create these
> really cool animations, these cool videos, these cool images that fit in nicely with a landing
> page."

Does it produce better output or just more derivative output? His own evidence says both are
possible, and the difference is whether the prompt forces a divergence. Prompt one ("build
something similar") risked a near-copy. Prompt two (same reference, different palette, own
generated image) did not.

## 3. Numbers

None. Colour count (20 vs 80) and component count (6 vs 50) are the only quantities, and they are
about system size not design values.

## 4. Figma

Not mentioned once. This is the one video in Group B that runs the entire loop without Figma, and
it does so because the premise is a product with no existing design system.

## 7. Critique loops

No model-critiques-itself loop. The loop is: generate, notice a specific defect, call the
matching Impeccable verb. Human names the defect, skill supplies the fix vocabulary.

## 8. Mobile and responsive

Absent.
