# DECISIONS — the open register

Created 2026-08-23. **Nothing here is decided.** That is the point.

This is the Phase 0 agenda from [`REBUILD_BRIEF.md`](REBUILD_BRIEF.md) §6. Every surface of
the rebuild is listed as a question with no answer, because v1 failed by choosing a metaphor
first and fitting everything into it afterwards.

## How to use this file

Work **top to bottom**. The order is deliberate: §1 constrains §2, which constrains §3, and
so on. Deciding a radius before deciding what the site argues is how you end up with a
constellation.

For every row, record four things:

| | |
|---|---|
| **The answer** | What was chosen |
| **The alternatives** | What was considered and rejected |
| **Why** | The reason, in one sentence, that a stranger could disagree with |
| **The evidence** | What was looked at, measured or tested |

🔴 **A decision with no recorded reason will be re-litigated by the next session.** That is
not a rule about tidiness; it is why v1's own `DESIGN_LOCK.md` got overturned twice.

**Do not batch.** One decision, argued and written, then the next.

---

## §1 — Ideology. What is this site *for*?

Everything downstream is arbitrary until these are answered.

| # | Question | Notes |
|---|---|---|
| 1.1 | What is the single sentence a visitor should be able to repeat after ten seconds? | Test it out loud on five people **with no website at all**. If the sentence alone does not land, no design saves it |
| 1.2 | Who is the primary reader — a hiring manager, a client, or an agency owner? | They want the same first ten seconds and diverge on page two. Pick the primary; the others are secondary |
| 1.3 | What does the site want the reader to *do*? | One action. Book a call, send an email, read a case study. Not three |
| 1.4 | What is the argument? | "I ship end to end and measure it" is one candidate, not the answer. What else could it be? |
| 1.5 | What is deliberately **not** claimed? | v1's honesty about zero users was a strength. What is the v2 equivalent? |

### ✅ 1.1 — DECIDED 2026-08-26

**The answer.** The sentence a stranger should be able to repeat after ten seconds:

> **He builds AI products on his own and ships them. Three for a paying studio client in five months.**

This is the sentence in the visitor's head, not the hero copy. Hero copy is Phase 1 and may
not resemble it.

Two sub-choices settled with it:

| | Chosen | Why |
|---|---|---|
| Title | **"AI Engineer"**, no qualifier | "Intern" kills client conversion and undersells solo-shipped paid work. "Contract" is accurate but is the one claim a reference check catches while `parth-os/RESUME.md` §Open-decisions 1 is unresolved. "AI Engineer" describes the work rather than asserting an employment status, so it survives either answer to the offer-letter question |
| The client | **Unnamed** ("a paying studio client") | Owner's call. Costs some checkability, avoids needing Stick and Dot's consent to be referenced |

**The alternatives, and why each was rejected.**

| | Sentence | Rejected because |
|---|---|---|
| A — Shipping | *"He builds AI products by himself and actually ships them."* | Not rejected. **Fused into the answer** as its verb. Alone it is slightly generic: "solo, end to end" is scarce but widely claimed, so it relies on the reader believing him |
| B — Corrections | *"He builds AI products and publishes what broke."* | Highest recall and the strongest differentiator (`parth-os/docs/RULES.md` §6), but it answers *"what is my risk"* before *"is this person real"* and *"can they build"*. Devastating as the **second** thing a reader learns, strange as the first. **Held for page two, not discarded** |
| D — Niche | *"He builds AI for creative tools — music, video, storyboards."* | Highest recall, smallest market. Honest read of the last five months, since every paid product was a creative tool. Rejected by the owner 2026-08-26: the identity stays open because the goal is any work that pays and teaches, not a vertical |
| E — Category | *"Retrieval, agents, diffusion, and the plumbing that keeps them up."* | This is v1's failure mode in a milder costume. A list of abstract nouns is not a sentence anyone repeats |

**Why.** Neither his name nor his employer will do the proving, so the sentence has to carry
its own proof, and every word of this one is checkable in shape even with the client unnamed.

**The evidence.**

1. **The sentence that failed is on record.** v1 `src/components/sections/HeroSection.vue:13`:
   *"Systems that act only after the evidence, schema, budget, and workflow state agree."*
   Four abstract nouns in a list, no subject a reader recognises, no verb they can act on, no
   sign that hiring is possible. Every viewer reported not understanding the site.

2. **Three of the four references named in §4.1 use a pattern unavailable here.** Read
   directly, 2026-08-26:

   | Site | Verbatim first line | Pattern |
   |---|---|---|
   | `rauno.me` | "Rauno Freiberg is an Estonian interaction designer working with Vercel and Devouring Details" | identity + **borrowed** affiliation |
   | `paco.me` | "Crafting interfaces..." + "Webmaster at Linear" | identity + borrowed affiliation |
   | `jxnl.co` | "Developer Experience Engineer on the Codex team at OpenAI" | identity + borrowed affiliation |
   | `parlance-labs.com` | "Build AI that works in production." | outcome + category, standing on Hamel Husain's name |

   "Interaction designer at Vercel" works because Vercel does the proving. The affiliation
   here is "Stick and Dot", which nobody recognises, against 5 GitHub followers
   (`parth-os/docs/PRD.md` §1). A generic outcome line like Parlance Labs' also needs a known
   name behind it. Hence: the sentence must carry its own proof.

3. **The claim is backed.** `parth-os/docs/PRD.md` §3 and `docs/AUDIT.md`: ₹72,000 across five
   months, three products for one studio (BeatMind, Vivid, the editorial platform).
   `parth-os/case-studies/beatmind.md`: BeatMind solo in 24 days, 307 commits, ~30,500 lines,
   ₹50,000, **zero users**. The sentence claims shipping, not traction, so zero users does not
   break it. A sentence implying usage would be false.

4. **Web-search results on "portfolio headline formulas" were discarded** as SEO filler with
   no evidence behind them. The four hero lines above were read from the live sites.

**Flagged, not resolved.**

- **Factual conflict.** BeatMind is 19 days / 194 commits / 27,000 lines in
  `parth-os/RESUME.md`, and 24 days / 307 commits / ~30,500 lines in
  `parth-os/case-studies/beatmind.md`. The case study is later and more precise. Settle before
  any number ships (blocks §2.4).
- **The numbers named in §2.4** below (500s→56s, 5.9x, $2.81→$0.48) **appear nowhere in either
  repo.** The measured figures that do exist are 70s → 23.4s on stem separation and the
  Vivid cost work. Verify or drop before §2.4.
- **`parth-os/docs/DESIGN.md` §3 is stale.** It says "The design system already exists and is
  good. Do not redesign it. Four changes only." The rebuild supersedes it. Fix in this pass.
- Round 0 of [`TEN_SECOND_TEST.md`](TEN_SECOND_TEST.md) is still empty. Not a blocker for 1.1;
  a blocker for Phase 1. The real test of this sentence is saying it aloud to five people with
  no website at all.


---

## §2 — Content. What actually goes on it?

Decided before form (`REBUILD_BRIEF.md` §3).

| # | Question | Notes |
|---|---|---|
| 2.1 | How many projects? | v1 had twelve and nobody understood it. Two? Three? Five? What is the reasoning, not the number |
| 2.2 | Which ones, and why those? | Selection criteria first, then the list |
| 2.3 | What is the shape of a project entry? | Problem, solution, scale, obstacle? Something else? Does every entry take the same shape or do they vary? |
| 2.4 | Do the measured numbers appear, and where? | 500s→56s, 5.9x, $2.81→$0.48. Hero, inline, footnote, or absent |
| 2.5 | Does the site say what went wrong? | The "6x I did not ship" story is the strongest thing in the resume. Does it belong here |
| 2.6 | Is there writing on it — a blog, notes, a changelog? | Or nothing |
| 2.7 | Where do the resume and the CV live? | Linked, embedded, or absent |

---

## §3 — Structure. How is it arranged?

| # | Question | Notes |
|---|---|---|
| 3.1 | One page, or many? | Argue both. Many pages can be *aimed* at one reader; one page is harder to lose someone in |
| 3.2 | If many: which pages, and what is on each? | |
| 3.3 | What is the navigation, if any? | |
| 3.4 | What happens on mobile? | Not "responsive". What is the actual mobile experience |
| 3.5 | What does a visitor see in the first viewport, before any scroll? | |
| 3.6 | Is there a boot or loading state? | v1 had one. Was it earning its place |

---

## §4 — Genre and reference

⚠️ **Do this after §1–§3, never before.** Choosing a genre first is exactly the v1 failure.

| # | Question | Notes |
|---|---|---|
| 4.1 | Collect 15–20 sites worth being proud of | Pull from Awwwards **typography** and **editorial-layout** collections, plus `rauno.me`, `paco.me`, `emilkowal.ski`, `joshwcomeau.com`, **By-Kin**. 🔴 **Deliberately not the 3D/WebGL collections** — that is where v1 came from |
| 4.2 | For each: what did you understand in ten seconds, and which single device made that work? | One sentence each |
| 4.3 | Which three are closest, and what pattern do they share? | The pattern matters more than the three |
| 4.4 | Also look at the buyers' own sites | Atomic Smash, MadeByShape, Bespoke Digital (`parth-os/outreach/agency-list.md`). What do the people who might hire you think good looks like |
| 4.5 | Is there a genre? Editorial, technical-manual, print, brutalist, terminal, something with no name | 🔴 **Run any candidate through the ten-second gate before committing. A genre that needs explaining is the constellation in a new costume** |
| 4.6 | What is explicitly banned? | v1's ban list was useful. What is v2's |

### ✅ §4 — DIRECTION CHOSEN 2026-08-27

**Denoise is the signature, and it absorbs Kinetic rather than sharing the stage.**
The full reasoning, the committed stack, the three rules that keep it safe, and the build
sequence are in [`BUILD_PLAN.md`](BUILD_PLAN.md). Research is closed except for the Reddit
sweep, which runs in the background and does not gate the build.

Round one (D1-D6) and round two (D7-D11) are preserved as published artifacts and as
`design/directions/proofs.html` and `round-two.html`. The research that produced them stands
below.

### 🟡 §4 — the research behind it, done 2026-08-26

**Research is complete and committed. No direction is chosen yet.**

Everything gathered lives in [`../design/`](../design/):

| Where | What |
|---|---|
| `design/research/youtube/` | 29 videos, ~10 hours, transcribed with `yt-dlp` and mined. 27 per-video notes plus the Group A synthesis |
| `design/research/skills-repos/raw/` | Nine design-skill repos cloned: emilkowalski, ConardLi/garden-skills, MengTo, jakubkrehel, Owl-Listener, codeswithroh/tastemaker, elayadesign, petergyang/no-ai-slop, haowjy |
| `design/CRAFT-VALUES.md` | Every concrete number found, with its source |
| `design/ASSET-INVENTORY.md` | What exists to design with, and the four recipes that kills |
| `design/directions/DIRECTIONS.md` | The five directions in prose |
| `design/directions/proofs.html` | The six directions with live specimens, published as an artifact |

**4.1-4.3, the reference sweep: still outstanding.** The agent doing the twenty-site sweep was
killed by a rate limit and wrote nothing. Four hero lines were read directly and are recorded
under §1.1. The rest of §4.1 has not been done.

**The Reddit practitioner sweep is also outstanding**, same cause.

**4.5, candidate genres.** Six, drawn from `garden-skills`'s six-school taxonomy and filtered
against what we can actually build:

| | Direction | School | Verdict |
|---|---|---|---|
| D1 | The Spec Sheet | Information architecture | **Recommended as the base** |
| D2 | Product Page for a Person | Modern tool | Safest commercially, highest slop risk |
| D3 | The Logbook | Warm humanist | Most distinctive, weakest at ten seconds |
| D4 | The Monograph | Editorial minimalist | Not recommended. Needs imagery we lack |
| D5 | The Instrument | Motion, disciplined | **Recommended as the creative layer** |
| D6 | The Void | Dark void, modelled on Dala | Owner's own reference. Argued honestly below |

**4.6, the ban list, derived from the research.** Beyond the owner's existing bans:

- `Inter` and `Geist Mono`. The design-kit detectors flagged both as overused **on this repo**
- 2x2 grids. Named in the video corpus as reading "a little bit AI generated"
- Indigo-to-purple and blue-to-cyan gradients, and `background-clip: text` gradient headlines
- A single letter in a rounded coloured box as a logo
- Centred-everything heroes: eyebrow, headline, lede and CTA all on one axis
- Hand-drawn fake browser, phone or IDE chrome. Use a real screenshot or omit it
- The reflexive hero, three feature cards, testimonial, CTA, footer template
- Flat zero-chroma neutrals, outside a deliberately monochrome technical build
- A section headline outside the hero reaching hero scale. Cap at 50-65%

**On D6 and Dala.** The owner named `dala.craftedbygc.com` as a site he loves, after the
research. Recorded rather than adopted, with three findings:

1. Its own Refero summary line is *"constellation floating on black velvet"*, and the
   signature is a particle constellation. That is the one visual v1 has already burned.
2. Its own reference sheet lists **Linear, Vercel, Anthropic and Runway** as similar brands,
   and `#8052ff` on pure black is the exact pattern the anti-slop research flags as the most
   recognisable generated look.
3. **It is also the best argument in the corpus for `REBUILD_BRIEF.md` §3.** Delete Dala's
   constellation and the page still reads completely: headline, body, one violet pill. The
   constellation is decoration in the right half of a hero, not navigation. v1 failed not
   because it had a constellation but because you had to click it.

Three things from it are worth taking to any palette: **hierarchy from scale rather than
weight** (every headline at 400, the same weight as body), **weight-200 body copy**, and the
refusal of cards, borders and shadows entirely.

**Blocked on the owner:** pick a direction; supply six Refero captures into
`design-kit/inbox/refero/` (the MCP needs a paid subscription and the skill will not scrape
the site, whose robots.txt disallows every AI crawler); settle the BeatMind figures; run the
ten-second test on the §1.1 sentence with no website.


---

## §5 — Typography

The largest single lever on how a text-led site feels. Decide it properly.

| # | Question | Notes |
|---|---|---|
| 5.1 | Display face | What personality, and does it survive at 14px as well as 72px |
| 5.2 | Body face | Reading comfort at the actual measure and size used |
| 5.3 | Mono face, if any | For numbers, code, labels. Or none |
| 5.4 | Is a variable font justified, or is it weight for its own sake? | |
| 5.5 | The type scale | Ratio, number of steps, and whether it is fluid or stepped |
| 5.6 | Measure | Characters per line for body copy |
| 5.7 | Leading, per role | Headings and body do not share a value |
| 5.8 | Tracking | Especially uppercase labels and large display sizes |
| 5.9 | Optical sizing | Does the chosen face support it, and is it used |
| 5.10 | Numerals | Tabular where digits align. Which contexts |
| 5.11 | Licensing and hosting | Self-hosted, Google Fonts, or purchased. What does it cost, and what is the fallback stack |
| 5.12 | Total font weight budget in KB | |

---

## §6 — Colour

| # | Question | Notes |
|---|---|---|
| 6.1 | How many themes? | One committed look, or light and dark |
| 6.2 | The ground | Not `#fff`, not `#000`, unless argued |
| 6.3 | The neutral ramp, and how many steps | |
| 6.4 | Is the neutral warm, cool or true? | A pure mid-grey reads as unconsidered |
| 6.5 | Accent — how many, and what is it *for* | v1's lock had one interactive colour. Is that right here |
| 6.6 | Semantic colours, if any | Success, warning, error. Separate from the accent |
| 6.7 | Contrast floor | AA is a floor, not a target. **Measure on rendered output, not by computing from tokens** — v1's lock was wrong twice by asserting ratios it never computed |
| 6.8 | What is colour *not* allowed to do? | |

---

## §7 — Space and shape

The "how round should the radius be" layer. It matters, and it is the last thing to decide.

| # | Question | Notes |
|---|---|---|
| 7.1 | Spacing scale | Base unit and progression |
| 7.2 | Grid | Columns, gutters, max width, or no grid at all |
| 7.3 | Vertical rhythm | Is there one, and is it enforced |
| 7.4 | **Border radius** | One value, a small set, or zero. What does a radius *mean* here |
| 7.5 | Borders and hairlines | Weight, colour, and whether they do the work shadows do elsewhere |
| 7.6 | Elevation | Shadows, or inset rings, or nothing |
| 7.7 | Iconography | A set, custom, or none. If a set, which and why |
| 7.8 | Imagery | Screenshots, video, illustration, or nothing. What is the treatment |

---

## §8 — Motion

| # | Question | Notes |
|---|---|---|
| 8.1 | What is motion *for* on this site? | Orientation, feedback, delight, or nothing |
| 8.2 | The motion budget | How many animated things can be on screen at once |
| 8.3 | Duration and easing tokens | How many, and what does each mean |
| 8.4 | Scroll behaviour | Native, smoothed, or scroll-driven. What does smoothing cost |
| 8.5 | The one signature moment | What is it, and where |
| 8.6 | `prefers-reduced-motion` | Mandatory. What exactly does the reduced version show |
| 8.7 | What is banned? | Parallax, marquees, auto-playing anything |

---

## §9 — The creative layer

`REBUILD_BRIEF.md` §3 requires this to be deletable. What it *is* remains open.

| # | Question | Notes |
|---|---|---|
| 9.1 | Is there a toggle, or is the creative layer always present but non-load-bearing? | |
| 9.2 | What does the toggle reveal? | The owner's own comparison was BeatMind's cassette and sound toggle. That is the right *size* of idea |
| 9.3 | How is it discovered? | A visible control, a keyboard shortcut, an easter egg |
| 9.4 | What is the state if it fails to load? | |
| 9.5 | Prove the revert test passes before merging it | |

---

## §10 — Technical

| # | Question | Notes |
|---|---|---|
| 10.1 | Framework | v1 was Vue 3 + Vite. Keep, change, or none at all |
| 10.2 | Is a framework justified for five-ish pages of mostly static content? | Argue it honestly. Astro, plain HTML, and a static generator are all real answers |
| 10.3 | Styling | Tailwind v4, vanilla CSS with tokens, or something else |
| 10.4 | How is static HTML guaranteed? | v1 claimed a crawlable fallback and did not have one. **Verify by `curl`, not by belief** |
| 10.5 | Hosting and domain | `parthtiwari.com` was proposed. Buy it or not |
| 10.6 | Analytics | Any, and what specifically is being measured |
| 10.7 | Performance budget | KB shipped, LCP, and how it is checked |
| 10.8 | Accessibility floor | v1 had a real a11y suite. What carries over |
| 10.9 | Which v1 scripts are worth keeping? | `shots.mjs`, `a11y-check.mjs`, `perf-check.mjs`, `craft-check.mjs` all exist and work |

---

## §11 — What gets reused from v1

v1 is not worthless. Naming what survives prevents rebuilding it by accident.

| # | Question |
|---|---|
| 11.1 | Which content in `src/data/*.ts` carries over as written? |
| 11.2 | The copy passed a no-AI-slop audit (zero banned words, zero em dashes). Does it carry over? |
| 11.3 | Which check scripts move across? |
| 11.4 | Is any of the v1 CSS token layer worth keeping? |
| 11.5 | What is deleted with no replacement? |

---

## Open questions nobody has asked yet

Add to this list as they surface. An unasked question is more dangerous than an undecided one.

- Does this site need to work for someone who arrives from a resume PDF link, versus someone
  who arrives from a Google search? Are those the same page?
- What does the site look like in a LinkedIn or WhatsApp unfurl? That may be the first thing
  most people see of it.
- Is the name "Parth Tiwari" the brand, or is there a studio name?
