# ojS5pcjs3xQ

**Title** Designing With Claude: The No-Nonsense Guide
**Channel** UI Collective (playlist PL01)
**Duration** 17:18
**Grade** HIGH. Its value is in the negative results. He runs an experiment that fails and shows
the failure, which is rare in this corpus.

---

## The controlled experiment: Claude Design versus Claude Code

Same prompt in both surfaces:

> "build me a modern finance dashboard that gives users a clear overview of their financial
> health at a glance. include total net worth, cash, investments, debt, recent transactions,
> spending by category, monthly income versus expenses, and a net worth trend over time. Clean,
> plenty of white space."

Result: near-identical output. The only differences were metric placement and whether cards had
a white background or were transparent.

> "it really doesn't matter what you use because you're going to get very similar outputs."

Cause: the `/design` skill inside Claude Code carries the Claude Design behaviour, canvas
functionality included (accent colour swap, light/dark toggle, chart type swap, frame drag).

## 1. Encoding a design language

He does not build one here, but he states the shape a system-encoding skill set should take,
which matches PL03 exactly:

> "things like your design system rules, your styles, when to use particular tokens or
> variables, when to use particular components. So you kind of break up your skills into
> different component groups and like one skill for all your spacing and shape variables."

And the hard ceiling on how far this gets you: **85%**.

> "this is the preferred workflow is to build a design in Claude and try to get it as close to
> matching your brand styles as closely as possible, but doesn't really need to. And then when
> you push it to Figma using Figma MCP, it's going to start to leverage all of your components
> and your tokens because you've trained Claude correctly on your design system... it's not
> going to be perfect, but it can get you like 85% of the way there."

## The negative result: do not build the design system itself in Claude

He had Claude build a **button component set**. Measured cost: **22 minutes and about 90,000
tokens**, still running.

> "If you know anything about design systems, you'll be able to build not just a button, not
> just a field or input or menu component, but like 10 components in 22 minutes."

Four reasons he gives, all worth carrying:

1. **Variant naming is invented and unstable.** It produced primary, accent, secondary, ghost,
   destructive, inverse. "How do you know that these are the correct terms for your variants...
   How do you know that when it starts building other components that it's going to use the same
   terminology?"
2. **Completeness is unverifiable.** "How do you know that these are all the variants that you
   need? Is it just because Claude gave it to you?"
3. **Edits cost another full run.** "let's say you need to make changes to your component. And
   this is the easiest component of all of them. What are you going to do? Wait another half an
   hour?"
4. **It does not respect its own components.** He then had it build a modal from those
   components: "the cancel button is way bigger, but the delete project button is a completely
   different size... Even when it's using components that it built inside the actual page, it's
   all over the place."

Blunt version: "Cloud is not built in a way to iterate on designs with your design system
connected. It's just not."

On `design sync` and similar repo-sync features: "They're still not great at consuming a design
system... I have not found really really good results even with some of these sync processes."

## 2. The exact prompts

**Widget-first, options-not-styles:**

> "Give me four different options for a line graph showing how my investments have performed
> over time. Focus on different ways to lay out and present the data, not just different visual
> styles. And keep the overall design consistent across all four."

The clause "not just different visual styles" is the working part. Without it you get four
recolours of one layout.

**Reference corpus query (Mobbin MCP), pattern extraction before generation:**

> "use Mobbin to identify common patterns and best practices for graph widgets and finance apps.
> focus on how leading products structure, present, and interact with financial data. Then
> generate four options."

Output shape: a written report of "five patterns that repeat" with the competitors each came
from, then the generations with rationale above each.

## 3. Design system specifics with real numbers

None given. The video is about process, not values.

## 4. The Figma question

The clearest statement of the Figma position in the group, and it is a firm yes for anyone who
already works in Figma:

> "I'm just going to build use Claude for my design system, build all my components inside of
> Claude and remove Figma from the equation entirely. Don't absolutely do not do that. That is
> going to be a headache of a workflow for you."

His stated reason for the round trip is *thinking*, not tooling. He takes the chosen widget into
Figma as editable layers and lays out around it:

> "We need to do that thinking in terms of layout in terms of what data points do we want shown.
> This is where the thinking happens then... they look at the widget and say okay what could I
> change? They think okay what's logically goes above this? What should go beneath it?"

Three named routes from Claude output into Figma: Figma MCP, screenshot then Figma agents
recreate, or export HTML and use a plugin.

Honest read for someone who does not already use Figma: the *function* being described is a
deliberate stop where a human decides page composition. Figma is where he happens to do it. That
function can be performed anywhere; the point is that it is not delegated.

## 5. Reference-driven design

Mobbin MCP, "I think it's like 650,000 app screens." Available as a Claude connector, no manual
MCP config: "just under connectors, you just search Mobbin, it should be there."

What he uses it for, beyond generation: "to understand how companies are treating particular
patterns, what's common, what's not common, and compare it against your own designs."

The ethics line, stated twice:

> "you never want to copy a design one for one. Mobbin MCP is not meant for you to copy existing
> screens that are out there and pass them off as your own. It's meant for help with inspiration,
> help with layout, help with research, not for copying."

## 6. What makes AI output look generated

He calls the `/design` skill's own output "very obviously AI generated. It's pretty obvious that
this is something that was done by Claude" and does not diagnose why. No values, no fixes.

On the general claim:

> "one prompting, a perfect design in Claude, it's complete clickbait. It doesn't happen. I see
> it all the time where it's like, oh, this one word one-line prompt gave me this like
> world-class design. It doesn't happen. It's clickbait."

And the strategy that follows:

> "the best way to eliminate AI slop. It's not by prompting AI more and more and more and more
> and more, but some of these skills can help us reduce it as much as possible."

**Impeccable** (free, open source, "the missing design vocabulary for our AI agents") is the tool
he names. Install via a single command from its docs. Commands are verbs, and `distill` is the
one he demonstrates: "essentially just gets rid of everything that's unnecessary... it removes
everything that shouldn't be there and just makes the card design feel a little bit more
natural."

Usage rule: "it's not as easy as just saying impeccable fix this design. Become familiar with all
the different commands that are available inside of this skill."

## 7. Critique loops

The main loop here is human, not model. Generate options at the widget level, pick one, move it
out of the AI surface, compose around it by hand, return to the AI only for the next stuck
widget.

The anti-pattern he names:

> "you're going to end up getting a dashboard that you don't like and you're going to burn
> through a ton of time and tokens and then you're almost going to get stuck trying just trying
> to improve this dashboard and this loop of prompting and iteration."

## 8. Mobile and responsive

One passing clause ("made tweaks to make sure everything's that responsive") inside a description
of Figma work. Nothing else. Recorded as absent.
