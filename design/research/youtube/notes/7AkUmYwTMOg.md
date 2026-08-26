# PL09 - Claude Code for Designers: All the Ways to Use It

| | |
|---|---|
| Video id | `7AkUmYwTMOg` |
| Channel | UI Collective (host Kirk) |
| Duration | 51:38 |
| Grade | **Medium signal.** Real work with real results, but the subject is Figma design-system operations, not web design. Roughly a quarter of it transfers to a portfolio rebuild |

**Why medium rather than high.** Everything shown works and he shows it working, including breaking a component on camera and watching the automation catch the change. But the value is concentrated in documentation upkeep and Figma variable plumbing. He is also the most useful of the five on *when not to use AI*, and that part transfers completely.

**Framing he opens with:** the objection is "AI design takes too long, AI design is too expensive", and his answer is not to deny it but to pick targets. "There are other targeted ways we can use AI that are always worth the time and the token investment." The targets he picks are all tasks that are boring, repeated, and verifiable.

---

## 1. The workflow, step by step

Five separate workflows rather than one pipeline.

**A. Documentation that stays current (his headline).**
1. Build a **skill** that defines what a component spec contains.
2. Generate the first spec with it, locally first, then push to Figma.
3. Build a **routine** (a saved, named, manually triggered instruction set) that diffs the component against its existing documentation frame and drafts an update.
4. Run the routine after real changes. Review the diff. Approve. Only then let it write to Figma.

Repeat the whole thing a second time for developer handoff docs, with different content and deliberately different wording so the two routines do not get confused.

**B. Consistency auditing.** Point the Figma `audit design system` skill at a frame; it reports which variables, components and instances are not applied.

**C. Accessibility.** Anthropic's `design` plugin has an `accessibility review` skill; run it on the frame.

**D. Type scale and variables.** Define the ladder in a prompt, build locally, review, then push variables and styles into Figma and link them.

**E. Token export.** Read a Figma variable library, emit a JSON file for developers.

**Where design sits relative to code:** this video inverts the others. Figma is the source of truth and Claude Code is the tool that reads it, writes documentation about it, and audits it. Nothing visual is being designed.

**Routine scheduling rule, stated as a general principle:** always manual, never on a timer.

> "Design is an iterative process. And what if you're just doing that iteration? You don't want all of a sudden a routine catching things... You move something and you run it again, it generates new documentation. It's just a complete waste. With some of these things, the call should always be manual."

---

## 2. Prompts, verbatim

### 2.1 The component spec skill

> "Please build me a Claude skill for component / design specs. Here are the details we need inside: what it is, one sentence definition; when to use it, specific scenarios; when not to use it, common misuse cases; variants, what each one is for; states, list all interactive states; anatomy, names for each part of the component; properties, properties inside of Figma available; usage rules, dos and don'ts; accessibility notes, keyboard and screen reader behavior; and related atom components if applicable."

What Opus produced beyond what he asked for, and why he rates it: not only `skill.md` with the ten sections, but **a fill-in template with placeholder variables, plus two worked examples (button and input field) so the model knows the quality bar when filling it out.**

> "This type of quality bar thing... is the kind of thing that would replace us having a dialogue with AI back and forth forever."

**That is a transferable prompt pattern:** ask for the schema, and let the model add worked examples that set the standard. Or ask for them.

### 2.2 The update routine (saved instructions, run manually)

> "Once I give you the component name, do the following.
> Step one: use the Figma MCP, find and read that component and all its variants and properties [link to the specific Figma file].
> Using the Figma MCP, find a documentation frame for that component.
> Identify what has changed: new variants, updated properties, new states, renamed tokens, new design, updated layout.
> Draft an updated doc entry in the exact same format as the existing documentation frame.
> Do not edit anything in Figma. Output the draft for my review only. We will then update Figma after my approval."

Two deliberate details. Always paste the **specific file link** ("especially if we've been using AI to dialogue with other Figma files, it's going to get confused"). And **identify what changed before drafting anything**, as separate steps, so you get a diff you can read rather than a replacement you have to trust.

Invocation, with a guard against skill collision:

> "Run the design spec routine for the button sample component. Do not use any component specific or design system specific Claude skills."

> "Sometimes whenever you call routines manually, it still picks up skills and it kind of messes things up, especially if your skills and your routines are closely named."

### 2.3 The developer handoff skill

> "Please build me a Claude skill for developer handoff specs. The emphasis here is for developers to make sense of the component and its parts, and not for designers and its usability.
> Parts: what the component is made up of.
> Sizing: width, height, padding, gap, radius.
> Tokens. States. Behavior. Accessibility. Responsive rules.
> Edge cases like long text, missing content, overflows, empty states.
> Composition and atom components: which smaller components it uses and what they're for."

He duplicated the routine for this rather than reusing one, purely so the wording stays developer-flavoured "so it doesn't confuse the two documents".

### 2.4 Audit and accessibility

> "Audit this Figma frame [link]"

Auto-invokes the Figma community `audit design system` skill. Output: a verdict ("needs work"), a confidence figure (85%), a summary, numbered findings with priority, detail per finding, and recommendations. What it caught in his sample: the component instances were fine, but "the documentation chrome around it, do/don't cards, numbered step badges, token chips" were "built as raw frames with hard-coded hex values".

> "Check for accessibility [link]"

Uses the `accessibility review` skill from Anthropic's `design` plugin.

### 2.5 Type scale

> "Please build me a type scale, run locally before we push to Figma, and build the variables and styles. Styles we need: hero, H1, H2, H3, H4, H5, H6, paragraph large, paragraph medium, paragraph small. Font Inter for hero and H tags, Roboto for paragraph text. We also need a mobile variation as well. **Please keep all font attributes to a multiple of four.**"

The multiple-of-four clause is the single most portable specification in this video. His stated reason: "What this does is it stops Claude Code from introducing something that's like a multiple of three that doesn't necessarily work with what it is that we're going for."

Then, after realising he had not specified structure:

> "Collection setup. Brand: font weights and font family string variables. Alias collection: font family string variables aliased from the brand collection. Map collection: empty for now. Responsive collection: holds variables for font size, line height, paragraph spacing, tracking."

### 2.6 Colour variables (shown, then argued against)

> "Please build the rest of the variable library. Brand: raw colour scales with just pure hex codes. Alias: where we define the colours from brand into primary, secondary, error, success. Mapped: these are the variables we apply to components; inside mapped are the groupings for surface, text, icon and border variables."

### 2.7 Token export for developers

> "Study all of the Figma variables inside of this file, then please generate me a JSON file I can share with my developers."

He calls this prompt deliberately bad, and the point is the capability rather than the wording: "every company is going to want to structure their variables a little bit differently... it's a lot about educating your developers on what's possible."

---

## 3. File and doc structure

- **Skill for the shape, routine for the upkeep.** The skill defines what a document contains; the routine detects change and drafts the delta. Skills are the standard, routines are the maintenance.
- Skills contain `skill.md` + **a fill-in template** + **two worked examples** that set the quality bar.
- Two parallel document families per component: **design spec** (for designers, usability oriented) and **developer handoff spec** (implementation oriented). Same component, different audience, never merged.
- Figma variable collections: **brand → alias → map**, plus a fourth **responsive** collection holding font size, line height, paragraph spacing and tracking across desktop and mobile.
- Name routines and skills distinctly enough that a routine call does not drag in a similarly named skill.

---

## 4. Design rules with numbers

| Rule | Value | Note |
|---|---|---|
| **All font attributes a multiple of 4** | 4 | Stated as a prompt constraint to keep the model off multiples of 3 |
| Smallest paragraph size | Generated 12px; **he would raise it to 14** and add a separate 12px caption style | "Personally, I'd probably put that to 14. We could introduce a caption size, that's 12" |
| Letter spacing | He dislikes -1% and -2% tracking: **"The user just can't really even tell a difference"** | An argument for leaving tracking at 0 unless it is doing real work |
| Type ladder he asks for | hero, H1 to H6, paragraph large / medium / small (10 styles) | Plus a full mobile variation |
| Audit confidence figure | 85% on his sample | Produced by the skill, not a rule |
| Time to build the variable library and styles | 9 to 10 minutes | "One of the most tedious tasks of building a design system" |
| Consistency audit | claimed 5 hours of manual work down to about 10 minutes | His estimate |

No spacing scale, no radii, no motion durations, no easings, no contrast ratios given as numbers. Contrast is delegated to the accessibility skill rather than specified.

---

## 5. Tools named

| Tool | For | Real result? |
|---|---|---|
| Claude Code, **Opus 4.7 throughout** | everything here | Yes. Model choice justified: these tasks run rarely, so pay for the best reasoning. "It's really good about thinking about how we can maintain the quality of results in the future" |
| Claude routines (local) | scheduled or manual re-runs | Yes, demonstrated catching real changes. Local routines only run while the computer is awake |
| Figma MCP | reading files and frames | Yes |
| Figma `Figma use` plugin / skill bundle | teaching the model to use the Figma canvas | Yes, install shown |
| Figma `audit design system` skill | consistency audit | Yes, and he calls it his favourite Figma skill |
| Figma `apply design system` skill | connecting existing designs to a system | Installed, "generally less frequently" used |
| Anthropic `design` plugin, `accessibility review` skill | contrast and a11y | Yes, "really good results", with the caveat in §6 |
| Rest of the `design` plugin's skills | handoff specs, usability feedback, research synthesis | **Explicitly rejected.** See §7 |
| Supernova, Zeroheight | acknowledged as where docs actually live for many teams | Named only |

---

## 6. What makes output untrustworthy, and his fixes

This video is about wrong output rather than ugly output.

| Problem | Fix |
|---|---|
| **The accessibility skill throws false positives** | Read them. His two examples: it flagged a colour pair "if this is paired on a dark background" when that pairing never occurs, and it flagged missing pressed and loading states which "was left out on purpose" because developers asked for them to be excluded |
| Documentation drifting from the component | The routine, run manually after real changes |
| A routine picking up a similarly named skill | Name them apart, and disable skills in the invocation |
| Generated documentation reading generically | Give the skill two worked examples so it has a quality bar |
| Generated components arriving as raw frames with hardcoded hex | The `audit design system` skill catches exactly this |

---

## 7. How he iterates, and where he refuses to

**The strongest content in the video is the refusals.** Three, each argued.

**Do not ask AI for UI or UX critique.**

> "Using AI to audit designs for UX and UI issues is not the best approach. The reason being is AI does not have the context to your project... It just creates this endless cycle of feedback, revisions, feedback, second-guessing yourself. I need feedback on my UI and my UX. Claude's going to provide suggestions. You're going to implement those suggestions. Then you're going to realize it's wrong... Then it's just a never-ending cycle."

His replacement: a human who knows the project. Note that **auditing for consistency is the exception he endorses**, because consistency is checkable against a fixed standard while taste is not. "Where audits generally come into play then is auditing for consistency. Winner, winner, chicken dinner."

**Do not have AI build your colour and semantic variable library.**

> "Within our surface grouping, we have subtle, muted, strong, and default. Do you know when a subtle should be applied versus a muted? ... Just because Claude Code can generate you a variable library does not mean that it's right. It's missing fundamental gaps in your brand, how things should be structured, your naming conventions. And even if you're just getting started from scratch, you don't know what you don't know."

Note the tension with §2.5, where he happily has it build the **type** scale and variables. The distinction he is drawing, inferred: a type ladder is a mechanical progression you can verify by looking at it, while semantic colour naming encodes decisions only the brand owner can make.

**Do not automate progress reports or change detection.** "It can do it, but this is one of those ones where just write it out on its own." And for accidental changes: "lock your layers, guys."

**On out-of-the-box skills generally:**

> "These are great starting skills, but in order to take your design to the next level you need some more custom skills. You need to know the why behind the skills, not just installing a skill and hoping that it does everything for you."

---

## 8. Mobile and touch

Three mentions, all structural rather than practical.

1. The type scale prompt asks for **"a mobile variation as well"**, and the output shows a desktop and a mobile column of the same ten styles.
2. The **responsive collection** holds font size, line height, paragraph spacing and tracking with desktop and mobile modes. This is the cleanest model in Group A for how responsive type should be stored: one variable name, two modes, not two sets of styles.
3. The developer handoff spec includes **"responsive rules"** and edge cases (long text, overflow, empty states) as required sections.

Nothing on touch targets, gestures, or breakpoint values.
