# Group A synthesis: the long-form workflow guides

Five videos, about 3 hours 47 minutes, all read end to end.

| Video | id | Duration | Grade |
|---|---|---|---|
| Web Design with Claude Code: The Complete Guide | `jO-wH4zgJV0` | 1:11:10 | **High** |
| Designing With AI: Claude, Codex, Figma | `j_ZPV10bu54` | 1:27:43 | **High** |
| Claude Code for Designers: All the Ways to Use It | `7AkUmYwTMOg` | 51:38 | **Medium** |
| How I Actually Use Claude Code in My Design Workflow | `TKScxZtESzs` | 13:24 | **Medium-thin** |
| Design with Claude Code: The Designer's Guide | `JMQ0X_si144` | ~24 min | **Thin** |

---

## 0. The finding that changes how to read the rest

**All five are the same channel and the same presenter.** UI Collective, hosted by a designer who calls himself Kirk. Group A is not five independent practitioners converging on a method; it is one practitioner's method recorded five times over what appears to be several months, since PL19 opens by referring to PL20 as "last week" and PL05 opens by saying part of it had to be refilmed because Claude shipped page-viewing between takes.

That has two consequences.

**Discount the convergence.** Where all five agree, that is one person being consistent, not a field reaching consensus. Cross-check anything load-bearing against Groups B and C.

**Raise the weight on the contradictions.** When the same person says opposite things in two videos, both positions survived his own filter, which usually means the boundary between them is real and he has not named it. Those are in §4 and they are the most informative part of the set.

He is a credible source on his own terms: he shows failures, refilms for fairness, screenshots token counts "just so it was fully honest", discloses the Mobbin affiliate link, and spends significant runtime arguing against uses of AI that would be easier to sell. He is a Figma design-systems specialist by trade, which is why three of the five videos are mostly about Figma and only one is really about building a website.

---

## 1. The workflow

Stripped of Figma, this is what the five describe. The spine is PL05; the others contribute stages.

### Stage 0. Evidence before direction

Audit the thing that exists before deciding what should replace it. Claude Code can now load and see rendered pages, so a URL is enough.

The rule that makes the audit useful is **two artefacts, not one**: a deliberately messy exhaustive markdown file, and a short client-facing document derived from it. Never collapse them. "Leave it up to me to decide what I'm going to include in a report."

**And the audit is not fed to the builder.** He keeps it out of the brand skill on purpose, so that he personally has to read every finding and decide how the new design answers it. The audit rejoins the process later, inside the QA skill, as the checklist the finished sections are tested against.

### Stage 1. Direction from real screens, not adjectives

Research is browsing actual shipped sites and extracting patterns, then narrowing to one named direction. The named direction is the important artefact: "editorial wealth", "warm humanist". A named direction with a paragraph of explanation is a thing a model can hold; a colour palette alone is not.

Deliverables at this stage: a mood board, a deep dive on the chosen theme, a competitive report. The deep dive's structure is a reusable template: **what to lean in on, what to hold back on, foundations, colours, layout and composition, imagery, dates and numbers, motion, voice and tone.**

### Stage 2. Encode the direction as a skill, with pictures in it

This is the pivot the whole method turns on, and it is stated the same way in PL05 and PL11 from different angles.

A written brand guardrail alone produces generic output. The fix is to put **screenshots inside the skill directory** and rewrite `skill.md` so that building anything requires consulting them. PL11 supplies the reason: "AI always works better from visuals", and the kitchen analogy about telling a builder you want it "dark".

The single most important line to copy into any such skill:

> **"Claude should look at all references and apply the treatment that makes sense, not one that matches an example one to one."**

with the resulting rule set: *translate, do not copy; these are other companies' brands; keep the composition and restraint; replace everything brand specific with this client's tokens.*

PL11 adds the layering: **variables and styles first, components second, and only then compositions**, each saved as its own skill, because each is the input to the next. And the reason to tokenise type before generating anything is mechanical rather than aesthetic: if the model invents a 15px paragraph, no later design-system pass will ever fix it, because there is nothing to match it to.

### Stage 3. Low fidelity on purpose

He wireframes for websites (and says so as a correction to having previously said he never wireframes, which was about product design). The reason is specific: a hi-fi first draft **contaminates** the build, because "if we were to take this as is [into] Claude Code, [it would] get really influenced by this design", and the generator's house style is recognisable. A wireframe "is not enough to get influenced by", so the visual language comes from your references instead.

### Stage 4. Build, one section at a time

New chat per phase. The skill is what restores context in the new chat, and that, not reuse across projects, is the actual reason to build one: "you can't build an entire website or project inside of the exact same Claude chat" before the context window degrades.

Per section: pull fresh references **for that section only**, apply, review, QA, move on. Not the whole page at once. "If we start rebuilding all parts of our website at a time, it's going to turn into a bit of a mess."

### Stage 5. QA against a written standard, per section

A second skill that complements the first. Its designed behaviour is worth copying exactly:
- it screenshots the result
- **if it cannot get a screenshot it stops and asks rather than guessing**
- it reports, then offers to fix, and **never edits unprompted**
- output is a verdict table plus a saved `.md`

The commercial argument for it: without it, the drift surfaces "at the 11th hour, [when] someone from brand or marketing takes a look at the website and gives you a list of everything that you need to change".

### Stage 6. Ship and narrate

Deploy through GitHub to Vercel. Keep every chat and every artefact in one Claude Project, then have it summarise the project into a deck explaining how the audit findings became the design. He rates this the part designers most often skip: "you can't just say, here's the website that I designed."

### The two constraints that sit over the whole thing

**One-shot does not exist.** Stated in three of the five. "One prompting a world-class website, that concept does not really exist." And "don't expect AI to give you something perfect in 10 minutes either. A lot of designers get discouraged where they play around with AI for 20 minutes and then they just quit."

**You do the thinking; it does the making.** The clearest statement of it, from PL05:

> "Addressing those opportunities should be up to us... eventually someone's going to ask you, how does your current website design solve that problem? And if you have Claude do all the thinking for you, it's going to give you a good output, but you're not going to know the reason why."

---

## 2. The prompts, collected

Quoted as spoken. Bracketed text is caption reconstruction.

### The three that carry the most weight

**1. The brand guardrail skill** (PL05). Everything downstream reads this.

> "We need a Claude skill for a client that Claude will reference whenever it designs pages, websites, landing pages or product experiences for them.
> Audience: [...]
> Primary message: [...]
> Conversion goal: [...]
> Creative direction: use the attached PDF as a source of truth.
> Create a practical and reusable design skill that tells Claude how to approach design work for this client. It should translate the audience, message, conversion goal and creative direction into clear guidance for the overall design approach and feeling.
> Do not create a client-facing brief or conduct any research. Do not include personas, competitive analysis, market data, or unsupported assumptions. The output should read as an internal design instruction set for Claude. Specific enough to influence real design decisions, but flexible enough to apply consistently across future pages and components."

**2. Bolting references onto that skill** (PL05), with the correction that made it work:

> "I want to adjust this skill so it holds examples of designs the client likes. In the future as Claude code reads the skill to build sections, I want it to check the treatments found in these screenshots. Adjust the skill as needed."

> "Claude should look at all references and apply the treatment that makes sense, not one that matches an example one to one."

**3. The brief format** (PL05, spoken into Claude Design but the shape is what matters):

> "Build a landing page for a consulting firm. [...]
> **Two things must land at once**: we are serious, we are on your side. Warm humanist earns that. It reads an established firm that respects your craft, not an AI startup selling magic.
> **Northstar**: warm, never soft. Warmth is the accent, not the argument. The argument is always expertise plainly stated.
> **Feeling to hit**: considered, warm, assured, human, unhurried.
> [From the audit] we need a way to book a call directly on this page, and to show client proof closer to the top.
> **Lean into**: soft cornered surfaces on a firm grid, plain expert first person plural voice.
> **Hold back**: rounded bubbly pill everything UI, hype buzzwords."

Four transferable devices: a tension the model must hold rather than average away; a northstar phrased as a corrective pair; a feeling list of five adjectives; and two explicit lists, *lean into* and *hold back*, where the hold-back list is where anti-slop lives.

### Auditing

> "Build a reusable Claude skill called website audit. The skill should deeply audit a live website, local codebase, or both. Then create a raw markdown file called website audit.md. This should be an intentionally messy, extremely detailed first pass audit. Do not worry about making it polished, concise, client ready, or perfectly organized. Capture as much useful information as possible so we can refine, restructure it later. [...] For every finding, include as much as possible. What you noticed, where it appears. Use headings, bullets, tables, notes, questions, rough ideas, and unfinished thoughts freely. Include duplicate or overlapping findings when useful. Do not remove detail just to make the report cleaner. **Do not invent facts or analytics. Clearly label assumptions. Do not change the website.** Only generate the detailed markdown audit."

> "Build a Claude skill that takes a markdown website audit and turns into a polished client ready word document. Identify the most important findings. Rewrite them in a clear client-friendly language and prioritize what matters most. [...] Avoid copying the audit word for word or including unnecessary technical detail."

> "Audit this Figma frame [link]" / "Check for accessibility [link]" (PL09; invoke the `audit design system` and `accessibility review` skills)

### Research

> "research leading finance websites on Mobbin and identify the design patterns that they have in common"

> "I am building a finance website. Browse the screens on Mobbin and build me a mood board with dozens of looks and feels of websites I can share with a client"

> "My client is an established consulting firm that is drawn to the look and feel of editorial wealth. Break down the visual direction into distinct themes and provide additional detail on each to help inform our strategic direction later on."

> "Please take a look at this skill and the references inside of this skill and find me other companies on Mobbin that have a similar look and feel. **We are going to focus on the hero to start.**"

> "generate me some alternate options of a screen like this" (PL11, into an image model, to break a one-to-one copy)

### Teaching it your language

The repeated shape is **"After coming to an elite understanding of X, build a Claude skill that..."**

> "Please study all of the Figma variables inside of this table. After coming to an elite understanding of the variables, their values, their naming, and when they are used, build a Claude skill that will help train Claude on when to use different variables for future designs. Do not include any type styles or type specific variables inside of this skill. Only focus on surface, border, text and icon variables."

> "Please study the following component groupings: form elements, navigation, data display. **Do not move to navigation elements unless you have a mastery of form elements.** The same with data display. Only move on once you have mastered the prior group. After coming to an elite understanding of all components [, properties, variants and anything else associated with them], build a Claude skill around which components are available and when to use them. Inside of the skill, have different .md files talking about form elements, navigation, data display more in-depth."

> "Study this design system documentation page sample [...]. Look at the contents, contents length, and frame formatting. **Goal here is just to get familiar. We will not make any edits or changes.** Once you are familiar, we will build documentation for other component sets." (PL19; study and apply as two separate turns)

### Building and steering

> "Using the screenshot attached along with the variables, type styles and component skills, please build a page like this using our design system. Here is our design system file if you need it, but all info should be encompassed inside the Claude skills. **Do not push to Figma yet, simply just generate it locally.**"

> "[invoke skill] this is the first draft of the wireframe to support the design for the client mentioned in this skill. Make it come to life."

> **"You're still too close to the wireframe which is hindering progress. It's okay to drift away from the wireframe to explore new options that make sense."**

> "I am working on a complex data visualization table component with potentially 50,000 rows of data. Build me a clean table component with advanced filtering and column management." (PL19; state the load the design must survive)

### QA, upkeep, shipping

> "I want to build a skill that complements that original skill that we built earlier. Every time we complete a web design section in Claude code, we will invoke this new skill to ensure that we did not drift from our design direction."

> "Identify what has changed: new variants, updated properties, new states, renamed tokens, new design, updated layout. Draft an updated doc entry in the exact same format as the existing documentation frame. **Do not edit anything in Figma. Output the draft for my review only.** We will then update Figma after my approval." (PL09 routine)

> "Run the design spec routine for [X]. **Do not use any component specific or design system specific Claude skills.**" (guard against a routine dragging in a similarly named skill)

> "Please prep this file for Vercel and provide me steps to deploy."

> "Based on everything inside this project and screenshots of the final designs, build me a small PowerPoint documenting my journey. Use filler content if you need to and fill in gaps where required."

### Prompt devices worth extracting from the above

| Device | Example |
|---|---|
| Two turns: study with edits forbidden, then apply | PL19 documentation |
| Forced sequential mastery | "Do not move to navigation unless you have a mastery of form elements" |
| Negative scope clause on every skill build | "Do not include any type styles"; "Do not include personas, competitive analysis, market data" |
| Withhold the write | "Do not push to Figma yet"; "Do not change the website"; "for my review only" |
| Name the skills to consult explicitly | Because with many installed "sometimes it might just skip over a text style skill" |
| Attach the source file as a fallback even when the skill should cover it | "Here is our design system file if you need it, but all info should be encompassed inside the Claude skills" |
| Diff before draft | "Identify what has changed" as a step before "draft an updated entry" |
| Ask for the quality bar, not just the schema | Opus volunteered a fill-in template plus two worked examples; ask for them |
| Label uncertainty | "Do not invent facts or analytics. Clearly label assumptions" |

---

## 3. Concrete rules and numbers

Honest assessment first: **Group A is thin on design specification.** Across nearly four hours there is no spacing scale, no radius scale, no motion duration, no easing curve, no stated contrast ratio, and no breakpoint value. The presenter is a systems and process specialist, and the numbers he gives are about cost and cadence, not about pixels. If numeric design rules are what the rebuild needs, they will have to come from Groups B and C.

### Design values actually stated

| Rule | Value | Source |
|---|---|---|
| **All font attributes a multiple of 4** | 4 | PL09. Prompt constraint, to keep the model off multiples of 3 |
| Smallest body size | Model produced 12px; **he raises it to 14px** and moves 12 to a separate caption style | PL09 |
| Letter spacing | Do not bother with -1% or -2% tracking. "The user just can't really even tell a difference" | PL09 |
| Type ladder | hero, H1 to H6, paragraph large / medium / small (10 styles), each with a mobile variation | PL09, PL11 |
| Responsive type storage | one **responsive collection** holding font size, line height, paragraph spacing and tracking, with desktop and mobile as modes. One variable, two modes, not two sets of styles | PL09 |
| Colour architecture | three tiers: **brand** (raw hex) → **alias** (primary, secondary, error, success; second mode per brand) → **map** (surface, text, icon, border; second mode for dark) | PL11, PL09 |
| Component grouping | three buckets: **form elements, navigation, data display** | PL11 |
| Composition | **avoid 2x2 grids**; they "usually lead to something that looks a little bit AI generated" | PL05 |
| Audit volume | a real site should produce **60 to 120 findings** | PL05, generated guardrail |
| Skill description limit | **1024 characters** | PL11, hit on camera |

### Cost and cadence numbers

These are measured, and they are the most reliable data in Group A.

| Measurement | Value |
|---|---|
| Codex vs Claude token cost for the same work | **3 to 4x fewer** |
| Four identical edits in Claude | **12 minutes, 38,000 tokens** |
| The same four edits in Codex | **4 minutes, 17,000 tokens** (not apples to apples: Claude built from scratch, Codex imported) |
| One button component set into Figma | **6 minutes, 5,400 tokens**, and it still missed variants |
| Claude Design weekly allowance, one dashboard | **8%**; two prompts, **15%** |
| Google Stitch generation | 15 to 30 seconds, effectively free |
| Opus response time | "sometimes it can take like 10 minutes" |
| Sections to finish after the first draft | about **5 prompts** |
| Figma type variables and styles built | 9 to 10 minutes |
| Claimed compressions | a 2-day audit into ~20 minutes; a 5-hour consistency audit into ~10 minutes |

### The eight things they say make output look generated

1. Describing a look in prose instead of attaching pictures. The base failure.
2. One reference, so the output is a copy of someone's brand. Always feed several so the model "finds synergies".
3. A guardrail document with no images attached to it. Produces "a very generic basic output".
4. Letting a hi-fi generator's house style through. "You can always kind of tell what is a Claude Design design, just the way the font is." Fix: wireframe there, finish elsewhere.
5. Hugging the wireframe. Fix: explicitly authorise drift.
6. 2x2 grids.
7. Silent token overrides. His own generated page "said it used the button, but it overrode the corner radius variables on that button to make it round". Fix: audit for it, do not eyeball it.
8. Cumulative drift across many section edits. Fix: the QA skill after every section.

---

## 4. Where they disagree

Since it is one presenter, these are contradictions within one body of work. Each marks a boundary he has not named, and the inferred boundary is the useful part.

### 4.1 Let AI build your foundations, or never

**PL09 §2.5** cheerfully has Claude build the entire type scale, the variables, and the styles, links them, and calls it "a really great place to start" when you have a new client with no existing brand. Nine minutes of work.

**PL09 §2.6 and PL11**, at length and with feeling, say never let it build your variable library. "Do you know when a subtle should be applied versus a muted? ... You don't know what you don't know." And on components: "Buttons are the easiest component of a design system to build, full stop", and it took six minutes and 5,400 tokens to get an incomplete one.

**The unstated boundary, inferred:** a type ladder is a mechanical progression you can verify by looking at it, so generation is safe. Semantic colour naming encodes decisions only the brand owner can make, and a wrong one is invisible until it has propagated. **Generate what you can verify by inspection. Author by hand what you can only verify by using.**

### 4.2 AI must not critique design, except when it must

**PL09:** "Using AI to audit designs for UX and UI issues is not the best approach... It just creates this endless cycle of feedback, revisions, feedback, second-guessing yourself."

**PL05:** builds a QA skill whose entire job is to critique each finished section and hand back a pass/fail table.

**The boundary, and he almost states it in PL09:** "Where audits generally come into play then is auditing for consistency." Open-ended taste feedback has no fixed target and spirals. Conformance to a standard **you wrote down first** terminates, because there is a defined pass condition. The QA skill is legitimate precisely because the brand skill exists to check it against.

### 4.3 Which tool starts the work

**PL05:** offers four starting points, says "every single one of those methods is going to get you to the exact same outcome", then uses Claude Design wireframes into Claude Code. Codex is never mentioned in the entire video.

**PL11:** Google Stitch for cheap exploration, Claude for the good first draft, **Codex for all iteration** because it is 3 to 4x cheaper, Figma in the middle for manual work, Claude at the end for developers.

These are not reconcilable as stated; PL11 has an extra tool and a cost argument PL05 ignores. PL11 also supplies the escape clause that mostly dissolves it: each hop costs tokens and effort, so "if you need to just change one color and move two things around, maybe it just does make sense to do it in Claude". For a single small site, PL05's simpler loop is the one that applies.

### 4.4 Claude Design: import your system, or do not

**PL11:** demonstrates the design-system import inventing variants he does not have (`ghost`, `danger`), dropping H3, H5, H6, body large and body medium, and concludes "it does not work as intended", with advice to show that clip to any manager who says "just import the design system".

**PL05:** uses Claude Design anyway, but only for wireframes, and specifically notes that feeding it the full skill and references still produced output where "you can still tell it's Claude Design".

Not a contradiction so much as PL05 having quietly designed around the PL11 defect. **The resolution is the useful part: use a hi-fi generator at low fidelity, so its limits cannot reach the final visual.**

### 4.5 Wireframing

He says in an earlier video that he never wireframes, then wireframes here, and flags the change himself: the never-wireframe position was about product design, where "clients don't like looking at wireframes" and teams "just jump right to hi-fi". For websites, the wireframe earns its place as a contamination guard (§1 stage 3). A self-correction rather than a disagreement, but worth knowing if the earlier video turns up in Group B.

---

## 5. Mobile: what Group A actually says

Close to nothing, and the silence is consistent enough to be a finding.

Everything said across all five videos:

- **"There's still issues with perfect responsiveness. Like all the other AI tools, they don't really get it responsive perfectly first try... not development handoff ready out of the box."** (PL20)
- "It might not be perfectly responsive." (PL19)
- Google Stitch is **much better at mobile than desktop**; the identical prompt for desktop came back "way worse... super AI generated". (PL11)
- Type styles should carry desktop and mobile values, held as **modes on one responsive collection**. (PL09, PL11)
- Developer handoff specs must include a **"responsive rules"** section and edge cases: long text, missing content, overflow, empty states. (PL09)
- The audit skill lists "what's not responsive?" as a category to check. (PL05)
- **Render width is an instruction.** "Don't condense [the browser] down to fit things on one screen. Use two monitors, or else Claude will get confused around maybe you want a tighter look, you want to adjust the padding." (PL20)

Nothing on touch targets, gestures, tap versus hover, breakpoint values, mobile-first ordering, or testing at a real device viewport. No one resizes a browser on camera in nearly four hours. The QA skill checks brand drift and takes one screenshot, at one width.

**Consequence for anyone following this method on a mobile-critical site:** the workflow has no viewport gate. It has to be added. The natural place is the QA skill from PL05 §2.9, extended to screenshot at more than one width and to fail on horizontal overflow and undersized touch targets, using the same "report, offer to fix, never edit unprompted" contract it already has.

---

## 6. The shortest usable version of the method

1. Audit what exists. Two files: exhaustive and messy, then short and client-facing. Read the exhaustive one yourself.
2. Collect real screenshots of sites in the direction you want. Several, never one.
3. Name the direction, and write what to **lean into** and what to **hold back**.
4. Write that into a skill, and put the screenshots in a folder inside it, with `skill.md` instructing that they be consulted and **translated, not copied**.
5. Tokenise type before generating anything, so nothing arrives at 15px with no home.
6. Wireframe, deliberately rough, so the generator's own taste cannot get in.
7. Build section by section. New chat per phase; the skill restores the context.
8. Write a second skill that QAs each finished section against the first, reports without editing, and stops rather than guesses.
9. Fix what the audit found yourself, on purpose, so you can explain every decision.
10. Ship, then narrate the trail from findings to design.
