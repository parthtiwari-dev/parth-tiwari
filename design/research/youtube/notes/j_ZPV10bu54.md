# PL11 - Designing With AI: Claude, Codex, Figma | Full Guide

| | |
|---|---|
| Video id | `j_ZPV10bu54` |
| Channel | UI Collective (host Kirk) |
| Duration | 1:27:43 |
| Grade | **High signal**, with a caveat: two thirds of it is Figma design-system work, not web design |

**Why high.** He runs a controlled comparison with recorded numbers, catches himself having run the two models at different reasoning levels and refilms the whole segment to fix it, and screenshots token counts before and after "just so it was fully honest". He then spends fifteen minutes arguing against the thing the video is nominally selling: that you should not use AI to build your variable library or your simple components. A video that talks you out of half its own premise is not narrating a feature list.

**Caveat for a portfolio rebuild.** The design-system half assumes Figma, a variable library, and a component set. If none of those exist, the transferable parts are §2.4 through §2.7 below: how to encode a design language as skills, and how to feed references so the output stops looking generated.

---

## 1. The workflow, step by step

His framing sentence: **"For designers, AI is not a tool. AI is a workflow."** And the corollary he repeats: you cannot get by knowing only one of these tools.

### The tool ladder, by stage of fidelity

| Stage | Tool | Why |
|---|---|---|
| Mid-fi exploration, internal alignment | Google Stitch | ~15 to 30 seconds per generation, effectively free, so you can burn twenty variants deciding *what data goes where* before spending a token elsewhere. "I'm not looking for polished designs. I'm looking for types of widgets, types of data that we might want to display" |
| High-fi first draft | Claude Design or Claude Code | Best-looking first output. "This is like senior level design" |
| Iteration and bulk edits | Codex | Three to four times fewer tokens for the same work |
| Manual layout tweaks, design-system application | Figma, via MCP | Push from Claude, tweak by hand, pull back |
| Final handoff | Claude | "Claude is the better coder. If you're working with developers, they're going to want to use Claude Code" |

**The loop he settles on:** generate initial designs in Claude → push to Figma → pull from Figma into Codex → iterate cheaply in Codex → push back to Figma → bring into Claude when you are ready for developers.

**But he immediately qualifies the loop.** Each hop costs tokens and effort, so "if you need to just change one color and move two things around, maybe it just does make sense to do it in Claude". And the strategic version: when something is off in one section, do not fix it immediately. **Build out all the other pages first, take stock of the full defect list, then decide whether the whole list is worth the round trip.**

### The design-system training sequence

Stated as a strict order, because each stage is the input to the next:

1. Train the AI on **variables and styles**.
2. Train it on **components and any related documentation**.
3. Only then use it to build **the larger modules, widgets, dialogues and layouts** that reuse steps 1 and 2.

"It's going to increase the chance that these here are built the very first time correctly, so we don't have to burn through a million and two tokens in 15 minutes to build something that wasn't using what was already in our design system."

Each stage is saved as a **skill**, so "what AI teaches itself, it can call on that knowledge a little bit later on... every time we build one of these, we don't want to have to revert back to step one".

**Where design happens relative to code:** both directions, continuously. Figma is the manual-adjustment station in the middle of a code loop, not the origin. He is explicit that the Figma hop is included because "this is the flow that designers are generally most comfortable with", and that more technical people would use a git repo instead.

---

## 2. Prompts, verbatim

### 2.1 Variables skill

> "Please study all of the Figma variables inside of this table. After coming to an elite understanding of the variables, their values, their naming, and when they are used, build a Claude skill that will help train Claude on when to use different variables for future designs. Do not include any type styles or type specific variables inside of this skill. Only focus on surface, border, text and icon variables."

Two patterns here. **"After coming to an elite understanding of X, build a skill that..."** is his standard shape: study, then encode. And the negative clause exists because "sometimes it does include type styles in this, but it's best to include another skill for the type styles".

The input was a Figma frame laid out as a table with four columns: **variable name, value on light mode, value on dark mode, and a description of when it is used**. He is emphatic that the when-it-is-used column is why you should build variables yourself: "If you ask AI to do it, AI is going to hallucinate. It might give wrong use cases."

Output shape he liked: separate `.md` files per group (border, icon, surface, text), each listing available variables and when to use them, plus common pairings, plus a `scale.md` explaining the axes and when to consult each file.

### 2.2 Type styles skill

> "Please study all the text styles available inside our design system above. Please take note of all the variables applied to the styles and their values on desktop and mobile. After coming to a complete understanding, please build a Claude skill which will inform Claude on which styles are available when building new designs."

**The reason this skill exists is the best argument in the video for tokenising type before you generate anything:**

> "If you just ask it to generate initial designs as a mockup, it might use a size that's like 15, a font size for paragraph that's 15, and then when you want to apply your design system to it, it never applies the design system to that one style, because it's looking for something in the text styles that matches, and when there's no match there it just defaults to not applying anything."

### 2.3 Components skill

> "Please study the following component groupings: form elements, navigation, data display. Do not move to navigation elements unless you have a mastery of form elements. The same with data display. Only move on once you have mastered the prior group. After coming to an elite understanding of all components, build a Claude skill around which components are available and when to use them. Inside of the skill, have different .md files talking about form elements, navigation, data display more in-depth."

Why the forced order, in his words: told simply to "study my components", the model "tries to go in a methodical order, but then all of a sudden if there's atom components on a page, it's going to analyze the first component, realize there's atom components that needs to study, it's going to jump to the atom component, but then it's going to forget to work its way back".

**His own stated correction:** the prompt should have read "after coming to an elite understanding of all components, **properties, variants**, and anything else associated with it". He nearly lost variant coverage.

### 2.4 Generating a screen from references

> "Using the screenshot attached along with the variables, type styles and component skills, please build a page like this using our design system. Here is our design system file if you need it, but all info should be encompassed inside the Claude skills. Do not push to Figma yet, simply just generate it locally."

Three deliberate parts: name the skills explicitly ("especially [if] we have a lot of skills, sometimes it might just skip over like a text style skill"), attach the source file as a fallback, and forbid the Figma push until you have looked at the result.

> "Here is another example I like. Can you tweak the design to match?"

> "Please push this to Figma. Remember to follow the design system and reference the type styles, variables and components rules."

### 2.5 Cross-tool portability

> "I need the design system components, variables, and text style skills in separate zip folders complete with all sub folders associated with those skills."

Then he uploads the zips into Codex and has it recreate the skills there, so both tools obey the same design language. "If we need to make changes in Claude, they'll follow our design system, and if we need to make those changes in Codex, then it'll also follow our design system."

### 2.6 Alternate directions via image model

Into plain ChatGPT (GPT-5.5 thinking), with a reference screenshot attached:

> "generate me some alternate options of a screen like this"

He calls this underused: "GPT 5.5 is really good at generating designs based on even just a prompt... it's fast, it's included in your ChatGPT plan." He then feeds the generated variant back to Claude Code so the build is not a one-to-one copy of the original reference.

### 2.7 Figma variable library, three-tier (shown, then argued against)

> "Build me a complete Figma variable library. We use a three-tier approach: brand, alias, map collection. Brand has raw hex codes and groupings. Alias determines primary, secondary, error. Map has all of the surface, text, icon and border variables. Inside alias collection there will be a second mode for a second brand. Inside of map is a second mode for dark mode."

> "Please build me type styles H1, H2, H3, H4, H5, H6, paragraph, paragraph medium, paragraph large, paragraph small inside of this Figma file. Inside each style there should be variables. This file above is empty, so you will need to build the variables and styles."

---

## 3. File and doc structure

- **A skill per layer of the design language**: variables, type styles, components. Kept separate on purpose.
- **Multi-file skills.** Each skill is a `skill.md` plus one `.md` per group, with the top-level file explaining when to consult which. He asked for this shape explicitly and it is the structure he praises.
- **Skill descriptions are capped at 1024 characters.** He hit the limit on camera and had to shorten one.
- **Component groups: form elements, navigation, data display.** Offered as three broad, near-exhaustive buckets rather than a flat list. "You don't have to use these same categories, but it's a way to approach it."
- **A variables reference frame** with name, light value, dark value, and when-used description, as the training input.
- Skills exported as **zips** to move between Claude and Codex.

---

## 4. Numbers

These are measurements, not rules of thumb, and are the most useful hard data in Group A.

| Measurement | Value |
|---|---|
| Codex token cost vs Claude for the same work | **3 to 4 times fewer** |
| Same four edits (light mode, add search, full width, swap two cards): Claude | **12 minutes, 38,000 tokens** |
| Same four edits: Codex | **4 minutes, 17,000 tokens** |
| One button component set built in Figma by Claude | **6 minutes, 5,400 tokens**, and it still missed variants |
| Claude Design weekly usage burned by one dashboard | **8%** |
| After a second prompt | **15%** |
| Google Stitch generation time | ~15 to 30 seconds |
| Time to film the first half of this video | 7 hours, stated as an aside |

Caveat he supplies himself: the 12-vs-4-minute comparison is not apples to apples, because Claude built from scratch while Codex imported an existing Figma design.

**Design values:** almost none. The only concrete visual specification is the type-style ladder he asks for (hero, H1 to H6, paragraph large / medium / small) and the three-tier variable architecture (brand, alias, map, with modes for second brand and dark). No spacing scale, no radii, no durations, no easings, no contrast targets. He does flag a contrast failure by eye on a generated button ("this one absolutely wouldn't [pass]") without measuring it.

---

## 5. Tools named

| Tool | For | Real result? |
|---|---|---|
| Google Stitch | fast mid-fi variants for internal alignment | Yes, and honestly graded: "these aren't production-level designs. I wouldn't take these and show it to a client" |
| Claude Design | high-fi first draft | Yes. Best-looking output of the set, but slow and expensive |
| Claude Code | building, Figma push, skill authoring | Yes, throughout |
| Codex | cheap bulk iteration | Yes, with numbers. But its from-scratch design output was "horrible... for designs out of the box, Codex is not your best option" |
| Figma MCP + Figma skills | two-way sync | Yes. Claude "is more accurate with using Figma attributes when pushed to Figma", specifically auto layout and fill/hug |
| Figma `audit design system` skill | finding unapplied variables and components | Named his favourite of the Figma community skills |
| Figma `apply design system` skill | connecting existing designs to a system | Mentioned, "I don't use it a ton" |
| Mobbin | screenshot references | Yes, heavily. Affiliate link disclosed |
| ChatGPT GPT-5.5 image generation | alternate visual directions from a reference | Yes, small but genuinely novel result |
| Figma's own AI / Figma Make | dismissed | "Figma's AI is incredibly underwhelming... their general AI just produces really generic results." Design system sync applies "your error states to absolutely everything" |

---

## 6. What makes AI output look generated, and his fixes

**The core diagnosis, and the best analogy in Group A:**

> "AI always works better from visuals. Pretend you're building a kitchen. You tell whoever's building your kitchen 'I want my kitchen to be dark'. They might give you this [wrong] look... Unless the people building your kitchen had a specific visual, there would be no way for them to realize that this is what you wanted. They were just taking an accurate guess. Too often we assume that AI is going to make the right call, and we end up burning through tokens."

| Tell | Fix |
|---|---|
| Describing a look in prose | Attach screenshots. "How difficult would the prompt be to sort of describe what we're looking for here... It'd be one hefty prompt and a whole lot of back and forth" |
| One reference, so the output is a copy of someone's brand | **Always feed several.** "You always want to feed AI multiple different examples... it's going to find some synergies between those examples", and explicitly instruct that you do not want a one-to-one. He flags this as a mistake he made on camera: "You shouldn't just provide mobile screenshots and have Claude copy it one-to-one, because that's someone else's design" |
| Overriding your own tokens without saying so | Watch for it. His generated page "said it used the button, but it overrode the corner radius variables on that button to make it round" |
| Stitch widgets | "This is clearly an AI generated widget" |
| Claude Design imports of a design system | Verify. On his own system it invented a `ghost` and a `danger` variant that do not exist, missed several real ones, invented a `display` type size he does not have, and dropped H3, H5, H6, body large and body medium. "Just because you can import your design system, in theory you can, but it doesn't mean it's ready" |

---

## 7. How he iterates

- **Do not iterate in the expensive tool.** Stitch informs the Claude Design prompt. The point is "ultimately, your goal is just to reduce the number of edits you need in Claude Design. The closer you can get to it first try, the better."
- **Batch the defects.** Do not chase a single wrong corner radius across a tool boundary. Finish the pages, list everything wrong, then price the round trip.
- **Polish in Figma before crossing a boundary.** "If you ever have to push a design to Figma, try to polish it as much as you can in Figma before you bring it back."
- **Read what the model gives you.** He says out loud that he is skipping this: "I'm going to make the assumption it did it right. You should not do that, though. You should always read through it."
- **The reverse-engineering trap**, stated three times and clearly his central belief:

> "If AI just gives you an output, but you don't know the rationale behind the output, how can you expect to succeed in your day-to-day design role when you're applying variables that you didn't build, when you're using components that you didn't build?"

> "You're going to spend more time trying to figure out what it is that AI gave you than it would be to learn how to build your variable library properly."

- **His allocation rule:** "Use your tokens and time to build the larger, more complex widgets, modules, dialogues, more complex layouts. Don't spend the time building the easy components."

---

## 8. Mobile and touch

Two things only.

1. **Stitch is markedly better at mobile than desktop.** "Whenever it comes to working with Google Stitch, you are going to get way better results working with mobile designs than you are on desktop." The desktop run of the identical prompt was "way worse... super AI generated, not great." Inferred implication: if you use a fast generator for early layout exploration, explore the mobile layout there and derive desktop yourself.
2. **Type styles carry desktop and mobile values**, and the skill is told to record "their values on desktop and mobile".

Nothing on touch targets, gestures, breakpoints, or testing at a real viewport.
