# mwq70TpWQkA

**Title** Claude Code for Designers (Full Overview)
**Channel** UI Collective (playlist PL15)
**Duration** 26:24
**Grade** MEDIUM. Perhaps a third of the runtime is clicking through connector and plugin install
UI. What survives is three genuinely useful things: one precise failure mechanism, one audit
workflow worth stealing, and a clear statement of when to push to Figma.

---

## The one precise failure mechanism (best thing in the video)

Why a model silently produces a design with no styles applied:

> "it's not smart enough yet to adjust. Doesn't matter if you're using Claude, doesn't matter if
> you're using Cursor... if you have a 12-pixel font, but that 12-pixel font and its properties
> don't match an existing style, it's just not going to apply any style at all, instead of
> applying maybe a style that has a 14-pixel font. So, when I say it's not smart enough to adjust
> yet, what it does is it takes the design that the AI produced and looks for a one-to-one match
> in your variables and styles. If it can't find anything, it just doesn't know what to do, so it
> just skips over it."

**Token application is exact-match, and a near miss produces a raw value, not the nearest token.**

The implication is a design-language rule, not a tooling one: the generation step has to be
constrained to the scale up front. If the model is free to pick 12px and your scale has 14, the
mapping step drops the token silently and you get a hardcoded value that nothing catches. Constrain
the scale at generation, not at mapping.

## The audit workflow

The Figma skill he says is the only one worth adopting today: **audit design system**, which
"audits Figma screens for design system integration drift."

> "Can you audit the results for any design system drift?" plus a direct link to the result

Sample findings it returned, and these are exactly the class of defect a screenshot cannot show:

> "button row has fixed height instead of hug. Heading uses H2 semi-bold instead of hero text
> style."

His verdict: "in terms of the Figma skill that I'm getting most use of right now inside Claude
code, it's this audit design system skill where it checks designs for any integration drift."

Also available, from Anthropic's own design plugin (installed via browse plugins): get feedback on
a design, generate handoff specs, run WCAG audits, write UX copy. He demonstrates the
accessibility audit:

> "Run an accessibility audit for this design" plus a link

Output was severity-graded (critical, major, minor).

## 1. Encoding a design language

He builds a reference-image skill here, the same pattern PL18 does at greater length:

> "Please build me a reusable skill where every time a design is being generated, Claude looks at
> the examples in this skill to better match the styling, formatting, layouts we are looking for.
> Store these screenshots inside of a folder inside of the skill called examples."

Result acknowledged as weak, with the correct diagnosis:

> "the design it came back with, it's still not great because the skill wasn't great. We just
> generated it quickly. We didn't provide a ton of examples and be specifics on things that we
> liked."

**The output quality tracks the skill quality, not the prompt.** He estimates the real investment:
"Imagine if you took like half a day to really tweak that process to be your own."

His closing recommendation, which is the thesis of PL03 stated as advice:

> "because these skills are so inconsistent, create a skill with all the rules of your design
> system and variables. When to use certain variables, when not to. When to use certain
> components, when not to."

And on the vendor skills: "Look at these skills as more starting points... you can modify these
skills as much as you want to."

## 2. The exact prompts

**Scoped build, with the only responsive instruction in Group B:**

> "Please build me a hero layout for a modern SaaS task management software. We are not building
> an entire landing page, just a hero layout... Ensure proper responsiveness across device sizes."

**Reference skill creation:** quoted above.

**Apply the skill to existing output:**

> "Review the UI style design skill and update the design accordingly. Just run it locally for
> now. No need to push to Figma."

**Component documentation from a Figma link:**

> "Based on the button components found here, build me some documentation around components
> overviews, variant overviews, accessibility guidelines and usage guidelines."

**Retrofit the design system onto existing output:**

> "Apply the correct design system variables, styles and components to this page."

**Build against a design system, scoped:**

> "Please build me a simple hero for a SaaS task management landing page. We are not building the
> landing page, just the hero block. Use the variables, components, and styles in the above Figma
> link. Be sure to push it to Figma when complete."

**Audit:** `Can you audit the results for any design system drift?`
**Accessibility:** `Run an accessibility audit for this design`

Note the repeated negative scoping in three of these: "We are not building an entire landing page,
just a hero layout." Stated as a negation plus a restatement, both times.

## 4. The Figma question

The most useful operational rules in the group.

**When to push:**

> "they'll only push to Figma when that design is ready. When they're happy with the result that
> they're seeing in Claude code. That's when they push to Figma. Because if you're iterating in
> Claude, then you push to Figma, and you make changes in Figma, and then bring it back to Claude,
> that's where the workflow can start to get messy."

**What you get without Figma skills, MCP alone:** auto layout partly working, base styling,
"although it's not going to give us this client ready design, this is still enough for us to work
with and recreate ourselves a little bit quicker." No components, no variables, no styles; raw hex.

**What Figma skills cost:**

> "whenever these skills are applied, the result takes sometimes like six times longer than it
> would be normally."

So he toggles them: "I find myself oftentimes turning on and off the Figma skills, and only using
Figma MCP depending on what it is that I'm doing."

**What Figma skills actually deliver:** inconsistent. He shows the retrofit output where a heading
got a variable but no text style, and calls out the marketing directly:

> "You're going to see a lot of information out there where it's like Figma skills work perfectly.
> I was able to build this insane design in 10 minutes with Figma skills and Claude code, and all
> my variables are applied perfectly... Not accurate. They're still wildly inconsistent, so you're
> going to get different results each time, regardless if you use the same prompt and the same
> file."

**Operational gotchas:**

- Do not work in the Figma file while the model is working in it. "it generally does not work as
  well."
- If a skill upload is rejected, quit and reopen the client. "Claude sometimes with skills can be
  very, very buggy."
- Bulk plugin zip upload used to fail and now works, inconsistently.

**Bottom line on whether Figma skills replace design work:**

> "AI with Figma skills cannot yet replace a designer. I could have spun up that sample design in
> about 45 seconds."

## 3. Numbers

Two, both incidental: a 12px font versus a 14px style in the exact-match example. No scale, no
ratio, no spacing base.

## 5. Reference-driven design

Mobbin screenshots into a skill's `examples/` folder. Same as PL18, less developed.

## 6, 7, 8

- **What makes output look generated**: "A real standard-looking AI-generated design" with no
  diagnosis. He attributes it to the absence of references, not to any specific treatment
- **Critique loops**: the audit skill is the loop, and it runs against a Figma artefact rather than
  the model's own reasoning
- **Mobile and responsive**: one prompt clause ("ensure proper responsiveness across device
  sizes") and two spot-checks. No breakpoints, no mobile-first ordering, no touch targets
