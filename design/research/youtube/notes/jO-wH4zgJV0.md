# PL05 - Web Design with Claude Code: The Complete Guide

| | |
|---|---|
| Video id | `jO-wH4zgJV0` |
| Channel | UI Collective (host refers to himself as Kirk; surname not stated on the recording) |
| Duration | 1:11:10 |
| Grade | **High signal** |

**Why high.** He builds one real site end to end (his own agency's neglected consulting site) and shows every artefact: the audit markdown, the client report, the mood board, the guardrail skill, three wireframes, the first draft, the corrections, the QA verdict table, the deploy, the pitch deck. He shows failures on camera and keeps them in: the first Claude Code draft "still feels a little AI generated", the mood board's first output was useless because it linked to Mobbin instead of embedding images, he forgot to save the skill and had to redo a run, and he admits he taught the Claude Project step too late in the video to get a good final output. He states plainly that "one prompting a world-class website" does not exist. This is the single most transferable video in Group A for a portfolio rebuild, because the subject is a marketing site with a conversion goal, not a design system.

---

## 1. The workflow, step by step

His five-stage map, stated at the top and followed for the rest of the video:

**Audit the opportunity → define the direction → set the brand guardrails → design and QA → tell the story and pitch.**

Expanded into what he actually does:

1. **Audit the existing site.** Claude Code can now browse and see rendered pages, not just source. He runs a bare `Audit this website` first, gets "a very generic audit", and rejects it as too surface level.
2. **Build a `website audit` skill** so the audit is deep and repeatable rather than different every time. Output is a deliberately messy markdown file.
3. **Build a second skill that turns that markdown into a client-ready document.** Two skills, because he wants the raw detail preserved and the client version derived from it, not instead of it.
4. **Research direction** against real sites (Mobbin MCP), and produce three client artefacts from it: a mood board, a named-theme deep dive, a competitive report. Save every one as PDF or Word.
5. **Turn the research into a brand guardrail skill.** Audience, primary message, conversion goal, creative direction. This skill is the thing that survives across chats.
6. **Add visual references into that skill.** Screenshots go in an `assets` folder inside the skill; the skill instructs Claude to check them when building a section.
7. **Wireframe in Claude Design** (wireframe template, not hi-fi), with a short prompt assembled by quoting lines out of the guardrail skill.
8. **Bring the wireframe into Claude Code and make it real**, then go **section by section**, one section at a time, each with fresh visual references pulled for that section only.
9. **Run a QA skill after each section** to catch drift from the direction.
10. **Deploy to Vercel** via GitHub.
11. **Summarise the whole Claude Project into a pitch deck.**

**Where design happens relative to code.** Design happens as code, in the browser, from step 7 onward. There is no Figma stage at all in this video. The only pre-code visual artefacts are the mood board and the wireframe, and the wireframe is deliberately low fidelity so it will not contaminate the visual result.

**The first artefact is the audit, not the tokens.** Tokens appear late and almost by accident: the guardrail skill "also provided like a token file", and he says "probably not something I would integrate this early on".

**Order of artefacts:** audit markdown → client report → mood board → theme deep dive → competitive report → guardrail skill → reference screenshots inside the skill → wireframe → first draft → section passes → QA audits → deploy → deck.

---

## 2. Prompts, verbatim

Transcribed from him reading his own typing, so wording is his; obvious caption noise is marked `[sic]`.

### 2.1 The audit skill

> "Build a reusable Claude skill called website audit. The skill should deeply audit a live website, local codebase, or both. Then create a raw markdown file called website audit.md. This should be an intentionally messy, extremely detailed first pass audit. Do not worry about making it polished, concise, client ready, or perfectly organized. Capture as much useful information as possible so we can refine, restructure it later. Audit anything relevant, including [all the standard website areas]. For every finding, include as much as possible. What you noticed, where it appears [and so on]. Use headings, bullets, tables, notes, questions, rough ideas, and unfinished thoughts freely. Include duplicate or overlapping findings when useful. Do not remove detail just to make the report cleaner. Do not invent facts or analytics. Clearly label assumptions. Do not change the website. Only generate the detailed markdown audit."

The generated skill set its own volume guardrail, which he reads out approvingly: **"a real site should produce 60 to 120 findings"**, plus "rules that do not bend" and a severity scheme.

Rationale in his words: "I don't just want that initial output with a couple things to improve on... what I want is absolutely everything. Leave it up to me to decide what I'm going to include in a report."

### 2.2 The client report skill

> "Build a Claude skill that takes a markdown website audit and turns into a polished client ready word document. Identify the most important findings. Rewrite them in a clear client-friendly language and prioritize what matters most. Structure the document as [title page, executive summary, and so on]. The final file should feel professional [and] strategic and easy for a client to review. Avoid copying the audit word for word or including unnecessary technical detail."

### 2.3 Research prompts (Mobbin MCP)

> "research leading finance websites on Mobbin and identify the design patterns that they have in common"

> "I am building a finance website. Browse the screens on Mobbin and build me a mood board with dozens of looks and feels of websites I can share with a client"

> "I need more images and not just links to Mobbin. As if I was to share this with a client, as right now I can't see the screens."

He calls that last one "horrible prompt, but whatever" and the fix "probably not how I would have done it". Honest, and worth copying as a warning: the first mood board was unusable as a deliverable.

> "My client is an established consulting firm that is drawn to the look and feel of editorial wealth. Break down the visual direction into distinct themes and provide additional detail on each to help inform our strategic direction later on."

Output sections of that deep dive, which is effectively his template for a design direction document: what to lean in on, what to hold back on, foundations (fonts and type scale), colours, layout and composition, imagery and illustration, dates and numbers, motion, voice and tone.

> "I'm building a competitive report on websites in the banking ecosystem. Browse Mobbin and provide a report."

### 2.4 The brand guardrail skill (the load-bearing one)

> "We need a Claude skill for a client that Claude will reference whenever it designs pages, websites, landing pages or product experiences for them.
> Audience: design system designers, design leaders and teams within large enterprises.
> Primary message: we can make your design system AI ready.
> Conversion goal: book a free consultation.
> Creative direction: use the attached PDF as a source of truth.
> Create a practical and reusable design skill that tells Claude how to approach design work for this client. It should translate the audience, message, conversion goal and creative direction into clear guidance for the overall design approach and feeling [and] how to communicate expertise to enterprise design system teams [...].
> Do not create a client-facing brief or conduct any research. Do not include personas, competitive analysis, market data, or unsupported assumptions. The output should read as an internal design instruction set for Claude. Specific enough to influence real design decisions, but flexible enough to apply consistently across future pages and components."

He notes he had AI help him write this prompt, and that one skill per client lets you toggle clients on and off so their languages do not bleed.

Sections the resulting skill contained: design direction, why this direction fits the client, voice and tone, message hierarchy and CTA, type scale, foundations, colours, layout and composition, imagery and illustration, UI styling and components.

### 2.5 Putting visual references inside the skill

> "I want to adjust this skill so it holds examples of designs the client likes. In the future as Claude code reads the skill to build sections, I want it to check the treatments found in these screenshots. Adjust the skill as needed."

Plus the structural instruction: store the screenshots in an `assets` folder inside the skill, and update `skill.md` so that when Claude builds something it does not only read `skill.md` but also checks the references folder.

**The correction he had to make**, and the most useful sentence in the video:

> "Claude should look at all references and apply the treatment that makes sense, not one that matches an example one to one."

Because the first version had decided "oh, if we have this footer example here, our footer should match that". The rewritten skill then contained rules he reads aloud: **"translate, do not copy, these are other companies' brands, keep the composition and restraint, replace everything brand specific with this client's tokens"**.

### 2.6 The wireframe prompt (Claude Design, wireframe template)

Assembled by lifting lines out of the guardrail skill:

> "Build a landing page for a consulting firm. The firm makes enterprise design systems ready for AI. Two things must land at once: we are serious, we are on your side. Warm humanist earns that. It reads an established firm that respects your craft, not an AI startup selling magic.
> Northstar: warm, never soft. Warmth is the accent, not the argument. The argument is always expertise plainly stated.
> Feeling to hit: considered, warm, assured, human, unhurried.
> [From the original website audit] we need a way to book a call directly on this page, and to show client proof closer to the top.
> Lean into: soft cornered surfaces on a firm grid, plain expert first person plural voice.
> Hold back: [...] rounded bubbly pill everything UI, hype buzzwords."

He also attached an image of the hex codes rather than typing them.

Three structural patterns worth stealing:
- **"Two things must land at once"** forces the model to hold a tension instead of averaging it away.
- **Northstar as a corrective pair**: "warm, never soft. Warmth is the accent, not the argument."
- **"Lean into" / "Hold back"** as two explicit lists. The hold-back list is where anti-slop lives.

### 2.7 Building it

> "[invoke skill] this is the first draft of the wireframe to support the design for the client mentioned in this skill. Make it come to life." + pasted wireframe

He calls "make it come to life" deliberately loose and says the alternatives are "build the wireframe exactly as is, then go section by section" or "take this wireframe and do an initial first draft".

The first result adhered too tightly to the wireframe. His unstick prompt:

> "You're still too close to the wireframe which is hindering progress. It's okay to drift away from the wireframe to explore new options that make sense."

That worked: "I think the issue was before it was just adhering too much towards that low-fi wireframe... when we told it to remove the guard rails, it started to work."

### 2.8 Section by section

Research for one section only:

> "Please take a look at this skill and the references inside of this skill and find me other companies on Mobbin that have a similar look and feel. We are going to focus on the hero to start."

His reasoning: "I don't want examples for everything. If we start rebuilding all parts of our website at a time, it's going to turn into a bit of a mess."

Then apply:

> "Adjust the hero to have this kind of type treatment. Provide a navbar that fits as well."

He notes he should have separated the navbar from the hero. Take the note, not the shortcut.

Total effort after the first draft: **"It only took me about like five prompts."**

### 2.9 The QA skill

> "I want to build a skill that complements that original skill that we built earlier. Every time we complete a web design section in Claude code, we will invoke this new skill to ensure that we did not drift from our design direction."

The generated skill's behaviour, which he reads out and approves:
- it takes a screenshot
- **"if no screenshot can be produced, it stops and asks rather than guessing"**
- it reports, then offers to fix; **"it never edits unprompted"**
- output is an inline verdict table plus a saved `.md` audit you keep

Invocation: `[invoke skill] please check the services section`. Result was a pass/fail table where two rows failed ("space and measurement", "data in motion").

His framing of why this matters commercially: normally "you get to the 11th hour, someone from brand or marketing takes a look at the website and then gives you a list of everything that you need to change".

### 2.10 Deploy and pitch

> "Please prep this file for Vercel and provide me steps to deploy."

He says the correct setup is push to GitHub and connect Vercel to the repo, and that the raw deploy is only for sharing an early preview.

> "Based on everything inside this project and screenshots of the final designs [...] build me a small PowerPoint documenting my journey. Use filler content if you need to and fill in gaps where required in order to showcase the possibilities."

Ten slides in about eight minutes, from a Claude Project that had the audit, the skills and the chats in it.

---

## 3. File and doc structure he recommends

- One **Claude Project per client**, holding every chat plus the audit report and every `.md` the engagement produced. This is the memory. "Every convo we have with Claude should actually be inside of a Claude project dedicated towards that client."
- One **brand guardrail skill per client**, toggled on and off so clients do not contaminate each other.
- Inside that skill: `skill.md` plus an **`assets/` (or `references/`) folder of screenshots**, with `skill.md` instructing the model to consult the folder on every build.
- A separate **`website-audit` skill** and a separate **audit-to-report skill**.
- A separate **QA skill** that complements the guardrail skill, invoked per section.
- `website-audit.md` kept as a raw artefact and reused later inside the QA skill so QA checks the build against the original findings.

Note his deliberate choice **not** to fold the audit into the guardrail skill: "I need to understand everything that's in that audit... and then make those fixes on my own."

---

## 4. Design rules with numbers

Thin. This video is process, not specification. What is actually numeric:

| Value | Source |
|---|---|
| 60 to 120 findings for a real site audit | guardrail inside the generated audit skill |
| Three wireframe variants per Claude Design run | observed |
| Roughly five prompts to finish all sections after the first draft | his count |
| Ten slides, about eight minutes, for the pitch deck | his count |
| A two-day audit process compressed to about 20 minutes | his claim, agency experience cited as comparison |
| Opus responses "sometimes it can take like 10 minutes" | observed |
| "Book a 30 minute call" as the CTA | copy in his wireframes |

The one composition rule with a number: **"I know that 2x2 grids usually lead to something that looks a little bit AI generated."**

---

## 5. Tools named

| Tool | Used for | Real result? |
|---|---|---|
| Claude Code (Opus 4.8 throughout) | audit, all building, QA, deploy prep | Yes, the whole site |
| Claude Code web browsing | seeing rendered pages, not just source | Yes; it replaced a custom screenshot tool he had built on the Claude API and had to refilm the section |
| Claude Design | wireframes only | Yes, but deliberately limited; see §6 |
| Mobbin + Mobbin MCP | competitor research, mood boards, per-section references | Yes, repeatedly, and it is an affiliate link. Discount disclosed |
| Claude Projects | per-client memory, source for the pitch deck | Yes, though he admits he set it up too late in this video |
| Vercel | deploy | Yes, live URL shown |
| Dribbble | what he used before, "so overwhelming", no filtering | Named as replaced |
| Figma | not used in this video at all | n/a |

---

## 6. What makes AI output look generated, and his fixes

| Tell | Fix |
|---|---|
| A guardrail document alone still yields "a very generic basic output" | Put screenshots inside the skill and force the model to check them per section |
| Claude Design's house style. "You can always kind of tell what is a Claude Design [design], just the way the font is" | Use Claude Design for wireframes only, and finish in Claude Code so the visual language comes from your references. Feeding the skill and screenshots into Claude Design still produced "you can still tell it's Claude Design" |
| The draft hugging the wireframe | Explicitly authorise drift |
| 2x2 grids | Avoid; he specifically declines the 2x2 services grid his own wireframe proposed |
| Copying a reference one to one | The "translate, do not copy" rule, plus reference multiple sources |
| Drift accumulating across many section edits | The QA skill after every section |

His single best demonstration of the fix working: he fed a Wise case-study screenshot that is "completely different, it's not like that green", and the guardrail skill did not copy it. "It took that design, read that skill, and then made it on brand... So this here took one prompt instead of me having to iterate, iterate, iterate."

---

## 7. How he iterates

- **One section at a time.** Never rebuild the whole page.
- **Fresh references per section**, pulled deliberately for that section.
- **New chat per phase.** "You can't build an entire website or project inside of the exact same Claude chat" because the context window gets overpopulated and "Claude's just going to get confused". The skill is what re-injects the context in the new chat, which is the actual reason to build a skill.
- **QA gate per section**, against a written standard rather than open taste.
- **Correct the instruction, not the output.** When the draft was too close to the wireframe he edited the constraint rather than hand-fixing the page.
- **Keep the discarded variants.** "Whenever I'm [sending] things [to] Claude Code, I always just make a copy of that original file, so I always have that original set of wireframes to reference."
- **He does the thinking on the opportunities, not Claude.** The strongest passage in the video:

> "Addressing those opportunities should be up to us. We should not have Claude go through and do all the thinking... eventually someone's going to ask you, okay, you've identified all these opportunities... how does your current website design solve that problem? And if you have Claude do all the thinking for you, it's going to give you a good output, but you're not going to know the reason why."

- **Expectation setting, stated twice.** "One prompting a world-class website... that concept does not really exist." And: "Don't expect AI to give you something perfect in 10 minutes either. A lot of designers get discouraged where they play around with AI for 20 minutes and they're not getting what they're looking for and then they just quit."

He also explicitly refuses to prescribe a starting point: one-prompt-then-refine, section by section from a blank page, Claude Design first, or Figma first. "Every single one of those methods that you saw is going to get you to the exact same outcome." Then he shows his own, which is Claude Design wireframe into Claude Code.

---

## 8. Mobile and touch

**Nearly nothing.** The word responsive appears twice, both times as a category to audit ("what's not responsive?") and never as a technique. He never resizes the browser on camera, never mentions breakpoints, touch targets, or a mobile-first order of work. The QA skill he builds checks brand drift, not viewports.

This is a real gap in the source, not an omission in these notes. Anyone following this workflow for a mobile-critical site has to add the viewport gate themselves.
