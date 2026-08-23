# REBUILD BRIEF — v2

Written 2026-08-21. **This supersedes the constellation site.** Read it before any design
or code decision on `redesign/v2`.

---

## 1. Why, in one line of evidence

**Every person shown the current site has said they do not understand it.** The sharpest
version came from a UI/UX designer — design lead at Apps for Bharat, now at Times of India:

> *"Nothing is clear. I don't know which were projects, what it does, or what the concept
> is. It's really hard to grab."*

The same person said BeatMind's site looks great and made him want to try the product. Same
builder, same taste. **So craft is not the variable.**

### The actual diagnosis, which is not "it looks like AI slop"

Slop is generic. The constellation is the opposite — **over-specific**. It fails because it
makes the visitor learn a legend before they can read anything: node size means evidence
weight, node colour means project type, twelve stars mean twelve projects. The interaction
*is* the information architecture, so there is no content until you interact.

The failure mode is documented and it is not about beauty: portfolios get dismissed when
*"the experience of viewing it requires too much effort"* — **not because the work lacks
merit**. That sentence is this site.

### The root cause, stated so it is not repeated

**The metaphor was chosen first, and twelve projects were fitted into it.** That is why a
legend exists. Everything in §3 exists to stop that happening twice.

---

## 2. Decided — do not re-litigate

| | |
|---|---|
| Rebuild, not patch | The constellation *is* the IA; patching means fighting it |
| **No** constellation, stars, glass panels, nebulae, orbit metaphors | Final |
| **No** borrowing BeatMind's look | Its channel-strip grammar belongs to that product |
| **Multi-page**, not one long scroll | Pages can be *aimed* — an agency pitch links a case study, not a homepage |
| **3 case studies**, not 12 projects | Twelve is why nothing is clear |
| The **numbers are the hero** | 500s → 56s · 5.90× less GPU · $2.81 → $0.48 |
| **10-second comprehension is the acceptance gate** | Not a hope. A test, run on real people |
| Creativity is **required** — but as a removable layer | See §3 |
| Serves **two** buyers: clients *and* hiring managers (12–15 LPA) | They want the same first 10 seconds and diverge on page 2 |

### The five-second answer, to be tested before it is designed

> **I build AI products end to end, and I make them fast enough to ship.**

Nobody at this level has measured before/after figures. That, not a metaphor, is the brand.
The one line that does the most work, and it is true:

> *"I had a 6× speedup and I didn't ship it, because the measurements said it made the
> output worse."*

---

## 3. 🔴 The rule that prevents the repeat

**The creative layer must be deletable.**

The constellation happened because the creative idea was load-bearing — remove it and there
was no site. That is the trap, and willpower does not fix it. Structure does.

> **Build the boring version first and ship it. Then add exactly one creative layer, in its
> own commit, that can be reverted without breaking anything.**
>
> The test is literal: `git revert` the creative commit. If what remains is a working,
> clear, complete site — you are safe. If it isn't, the creative thing has become the
> information architecture again. Stop and restructure.

The owner's own instinct already found this: **a default mode that is clear, and a toggle
into something playful.** That instinct is correct and should be followed. The default is
the site. The toggle is the play. If the toggle broke tomorrow, nothing is lost.

### The four supporting rules

1. **Content before form.** Write every word in plain Markdown first. Test the copy for
   clarity with no design at all. Only then design. This is the direct fix for
   metaphor-first.
2. **One signature moment, not a signature system.** `DESIGN_LOCK.md` already had this idea;
   the mistake was applying it to the entire site instead of one moment.
3. **Every page must read as static HTML with JavaScript off.** Fixes the crawler gap the
   old site has, and forces the content to carry itself without interaction.
4. **A hard budget, written down before starting.** §4.

---

## 4. The budget

The old site is not too ugly. It is **too much**. Measured on `main` @ `bc9e977`:

| | v1 (constellation) | **v2 ceiling** |
|---|---:|---:|
| `src/` lines | **18,572** | **≤ 4,000** |
| Components | **49** | **≤ 15** |
| Runtime dependencies | **8** — `three`, `@tresjs/core`, `gsap`, `lenis`, `postprocessing`, `pinia`, `vue`, analytics | **≤ 4** |
| Pages | 1 + overlays | **5** |

Treat the ceiling like a deadline. **If a creative idea cannot fit inside it, the idea is
wrong for this site — not the budget.**

Five pages: `/` · `/work/[slug]` ×3 · `/about` (resume) · `/contact`. Services live on `/`.

---

## 5. The gate

Run after **every** phase, on five people who have not seen it:

1. Open the site. **Close it after 10 seconds.**
2. Ask: *"What does he do? Would you hire him? For what?"*
3. Write the answers **verbatim**. Do not paraphrase, do not explain the site afterwards.

**Ship when four of five answer correctly without prompting.** Until then it is not done,
regardless of how it looks.

Log every round in `docs/TEN_SECOND_TEST.md` with the date and the raw answers. A round
recalled from memory is worthless.

---

## 6. Owner's research — do this before the build session

Nothing here needs code. It needs taste, decided deliberately instead of by default.

| # | Assignment | Output |
|---|---|---|
| **1** | Run §5's test on the **current** site, 5 people | Baseline verbatim answers. This is the number the rebuild has to beat |
| **2** | Say the five-second answer aloud to 5 people **with no website at all**. If the sentence alone does not land, no design saves it | A sentence that works |
| **3** | Collect **15–20 sites you would be proud to have built**. Pull them from Awwwards' **typography** and **editorial-layout** collections, and from `rauno.me`, `paco.me`, `emilkowal.ski`, `joshwcomeau.com`, **By-Kin**. ⚠️ **Deliberately not the 3D/WebGL collections** — that is where v1 came from | A folder of screenshots |
| **4** | For each: *what did you understand in 10 seconds, and what one device made that work?* | One sentence each |
| **5** | Pick the **3 closest** to what you want. Not to copy — to find the pattern they share | 3 references + the pattern |
| **6** | Name **one** interaction you want. One. The BeatMind cassette toggle is the right *size* of idea | One sentence |
| **7** | Look at the sites of the agencies you are pitching — Atomic Smash, MadeByShape, Bespoke Digital (`parth-os/outreach/agency-list.md`) | What *your buyers* think good looks like |

If exploring a genre — retro terminal, print/editorial, brutalist, technical-manual,
instrument-panel — run it through §5 before committing. **A genre that needs explaining is
the constellation again in a new costume.**

---

## 7. Open — the owner decides, after §6

Deliberately unanswered here. These are taste calls and pre-deciding them would repeat v1's
mistake of handing down a metaphor.

- The genre / theme
- The one signature interaction, and what the toggle reveals
- Type pairing (display + body + mono for the numbers)
- Colour, including whether it commits to one theme or supports both

---

## 8. Sequence

| Phase | Do | Gate |
|---|---|---|
| **0** | Owner's §6 research | 15–20 refs, 3 picks, one sentence, one interaction |
| **1** | Copy only. Every word, plain Markdown, no design | §5 passes **on the text alone** |
| **2** | Design lock: type, colour, spacing, motion budget. **One** signature moment named | Written down before any component |
| **3** | Build the boring site. 5 pages, static-HTML-readable, no creative layer at all | §5 passes. **Ship it live** |
| **4** | Add the one creative layer, in its own revertable commit | `git revert` still leaves a working site |
| **5** | Cut over the domain, redirect the old site | §5 passes at 4/5 |

**Phase 3 ships before Phase 4 exists.** That is not caution — it is the mechanism that
makes Phase 4 safe to attempt.
