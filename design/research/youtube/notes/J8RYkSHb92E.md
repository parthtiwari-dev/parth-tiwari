# J8RYkSHb92E

**Title** I Gave Claude Code & Codex Access to 600,000 UI Designs
**Channel** UI Collective (playlist PL10)
**Duration** 14:12
**Grade** MEDIUM. Four good prompt shapes and an honest limitations list, but the mechanism is
thin: install an MCP, then ask. No measurement of whether output improved, only assertion. It is
the assigned video for the reference-corpus question, so it is graded on that.

Corpus is **Mobbin**, not Refero. The mechanism transfers exactly: a hosted MCP over a large
library of shipped product screens, queried in natural language.

---

## 5. Reference-driven design: the actual mechanism

Setup: Mobbin account, settings, MCP, copy the command. The command **differs per client**
(Claude, Cursor, Codex, Lovable each get a different string). First call triggers a browser
OAuth.

The stated problem it solves:

> "The biggest limitation when you're designing with AI is that it guesses because it's not an
> expert on how competitors are maybe using different patterns to display different pieces of
> information... It's not an expert on type treatments... It's not an expert on layout,
> positioning different pieces of data, sort of organizing the information architecture on a page
> to group the most important pieces of data together."

That is a precise claim about *what* a corpus supplies: pattern inventory, type treatment, layout,
and information architecture. Not colour, not motion, not copy.

### Four query shapes, all verbatim

**1. Pattern extraction then generation** (the default):

> "I'm designing a dashboard for a banking application. Extract common patterns from Mobbin and
> generate me three options."

Output: three named directions with their sources attributed. "clean and big typography, lots of
white space" from one set, "a vibrant hero card" from another, "premium dark... inspired by
Revolut and Mercury".

His one complaint is the most actionable line in the video, and it is a prompt fix:

> "One thing I would love here is for it to give a little bit more specifics around, okay, quick
> actions row. This was specific from this competitor and this competitor only or both of these
> competitors that we looked at. That's likely something we can fix via prompting."

**Ask for per-element attribution, not per-direction attribution.** Otherwise the citation is
decorative.

**2. Benchmark an existing design** (attach a screenshot of your own work first):

> "Please compare this against all the other banking dashboards inside of Mobbin. Come back with
> an analysis and recommendations and why."

Output sections: what every competitor has that we do not, what we are doing well, ranked
recommendations, **and what not to copy**. That last section is the one that makes this a critique
tool rather than a conformity tool.

**3. Competitive report:**

> "I am building a competitive report on dashboards in the banking ecosystem, on mobile dashboards
> in the banking ecosystem. Browse Mobbin and provide a report."

Basis: "25-plus app screens spanning neo banks and incumbents." Report structure returned:
distinct patterns, anatomy of a home screen, how balances are presented, navigation and
information architecture, insights and analytics, differentiators worth flagging, recurring UX
details, strategic takeaways.

Claimed saving: a four-hour research and formatting task in five to ten minutes.

**4. Mood board:**

> "I am building a banking application. Using the screens in Mobbin, can you build me a mood board
> with dozens of different looks and styles of apps grouped so I can share with clients?"

Output grouped into named visual directions (minimal editorial, dark and focused, and others).
Took about eight minutes. He calls it "basically almost client ready right away".

## Better output, or more derivative output?

The video does not test this, and he does not claim it does. What it does say:

> "just because Claude dialogues with Mobbin MCP or Codex and extracts patterns and gives you
> designs back, does not always guarantee that they're going to be 100% unique. So, always make
> sure you go through and you do that due diligence to make sure that what it's giving you is not
> a direct copy of someone else's dashboard."

Reading across Group B, the pattern is: the **report and benchmark** shapes are safe and clearly
additive, because their output is prose you then act on. The **"build something like X"** shape is
where derivative output happens (see PL04, where a first Mobbin build "matches too closely to the
original design"). The extraction step is what makes the difference: asking for patterns first and
generating second puts an abstraction layer between the corpus and the artefact.

## Limitations at time of recording

Stated as MCP feature gaps, all plausibly fixed since, all worth re-testing on any corpus MCP:

- **Similar-screens is not callable.** The web UI has a "find similar screens" button; the MCP
  could not use it.
- **Per-app analysis is weak.** "it's not great with individual apps right now, but more of like a
  larger search across all the screens."
- **Saved collections are not callable.** Curated project collections in the web UI are invisible
  to the MCP.

That third one matters most for a portfolio build: you cannot curate a shortlist in the web UI and
have the model read only that. Curation has to happen by screenshotting into a local folder
instead, which is exactly what PL18 does.

## Model comparison

Same prompt in Codex with GPT-5.5: it returned **images, not HTML**. Sections: patterns, dashboard
banking concepts, inspiration map with Mobbin references, extracted patterns, why each fits, and
source links.

> "Codex is cheaper in terms of time and also tokens... You can get a lot of value with the Mobbin
> MCP with less tokens and with less time using GPT 5.5 inside of Codex. But just know it's going
> to generate you images. You ask it to generate you actual HTML prototypes and things like that.
> That's where the design starts to not be as good."

Useful split: cheap model for the research and mood-board deliverables, expensive model for the
build.

## Everything else

- **Design system encoding**: not covered
- **Numbers**: none
- **Figma**: not mentioned
- **What makes output look generated**: named in passing only. "they all have like that gradient
  inside of it. They all have that really bold, super bold font."
- **Critique loops**: query shape 2 (benchmark against corpus) is a real critique loop, and its
  "what not to copy" section is the interesting half
- **Mobile and responsive**: absent, other than the corpus being filterable to mobile screens
