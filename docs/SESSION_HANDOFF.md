> ⛔ **Superseded 2026-08-27.** This handed off the Phase 0 research session.
> Everything it left open has since been answered: the direction is
> `docs/DESIGN_LOCK.md`, the worlds are `docs/WORLDS.md`, the plan is
> `docs/BUILD_PLAN.md`, and the prompt for the next session is
> `docs/SESSION_PROMPT.md`. Kept because its section 5, the mistakes made
> twice, is still the most useful page in this folder.

# Handoff — end of the Phase 0 session

Written 2026-08-27. Read this before `BUILD_PLAN.md`, which is partly stale and is
corrected below.

This session ran long and produced real work, but it also drifted off the sequence the
brief set. This file exists so the next session starts from what was learned rather than
from what was last built.

---

## 1. The honest state

**Decided and recorded:** §1.1 (the sentence) and §4 (direction). Two of eleven sections.

**Still open, never touched:** §2 content, §3 structure, §5 typography, §6 colour, §7 space
and shape, §8 motion, §9 the creative layer, §10 technical, §11 reuse from v1.

**Built anyway:** three published artifacts and a working four-route page with a hero, a
sideways work rail, and five real product captures.

That ordering is backwards and it is the main finding of the session.

---

## 2. What went wrong, stated plainly

**We skipped §2 and §3 and went straight to visuals.**

The brief is explicit: *"§1 constrains §2, which constrains §3. Deciding a radius before
deciding what the site argues is how you end up with a constellation."* And: *"Content
before form. Every word in plain Markdown first, tested for clarity with no design at all."*

Every page built this session runs on copy invented in the moment. The gap section, the
four process steps, the three service blurbs, the section headings, the stack descriptions:
none of it was decided, researched, or tested on anyone. The owner said five times across
the session that the result felt generic. It felt generic because the words were improvised
and no amount of motion fixes that.

**The next session should not open a design file.** Phase 1 is copy only.

---

## 3. What is genuinely settled, and worth keeping

### The sentence (§1.1)

> **You can describe the product. I get it live.**
> Three AI products in five months, working alone.
> **Every one is live. So is the record of what broke.**

First person. Still **never tested on five people**, which is the Phase 1 gate.

### The four routes (§3, implied but not formally recorded)

`/` home, `/work`, `/notes`, `/stack`. Owner confirmed all four, with `/` and `/work`
shipping first and the other two days later.

### The captures

`public/media/` now holds real, current captures of the running BeatMind app, including two
the owner took by hand because the audio will not render under automation:

| File | What it shows |
|---|---|
| `beatmind-stems.png` | Four coloured stem waveforms, 82 bpm, C# minor, retune controls |
| `beatmind-arrangement.png` | 68 bars as section cards with chords and per-stem lanes |
| `beatmind-create.jpg` | The prompt page |
| `beatmind-library.jpg` | Three real saved projects |
| `beatmind-desktop.jpg` | The cream marketing page |

The arrangement view is the strongest single frame available and should lead any showcase.

### The research

`design/` carries 13,000+ lines: 29 transcribed videos, nine skill repos, `CRAFT-VALUES.md`
with every concrete number and its source, `ASSET-INVENTORY.md`, and eleven design
directions with live demos. **None of it needs redoing.** Start there rather than
re-searching.

---

## 4. Corrections to `BUILD_PLAN.md`

That file was written mid-session and two of its claims are now false.

| It says | Actually |
|---|---|
| The signature is a scroll-scrubbed denoise across a 340vh pin | **Removed.** The pin gated the message behind a gesture, so a visitor who did not scroll saw no headline, no lede and no CTA. Replaced by a window that cycles five real product screens on its own |
| Kinetic type fuses into the scrub | **Removed.** Scroll-driven glyph scrambling left the headline unreadable at rest. The type now assembles once on load, starting 35% resolved |

What survived from that plan: one signature and not five, the deletable-layer architecture,
and the rule that the message is readable before any effect starts.

---

## 5. Mistakes made twice, so the next session does not make them a third time

1. **Shipping without looking.** Two published versions had a broken hero and a broken
   mobile rail. Numeric checks passed both times: `scrollWidth === clientWidth` cannot see
   copy clipped inside its own container, and it cannot see a headline reading `5M+]*59`.
   **Screenshot the actual first frame at 390 and 1440 before publishing, every time.**
2. **Gating content behind an effect.** Done twice. Once with `sessionStorage`, which made
   the signature invisible after the first load. Once with a scroll pin, which hid the
   headline and CTA entirely. **The arrival state is the only frame guaranteed to be seen.**
3. **Reaching for the default page shape.** Hero left, image right, vertical stack of
   labelled sections, card grid. Rebuilt three times before the shape itself changed. The
   research names this: the Feature Stack is *"the right answer surprisingly often and the
   wrong answer to reach for reflexively."*
4. **Editing HTML by anchoring on tokens already substituted.** Two of five window screens
   silently pointed at elements that did not exist, so the frame froze while captions moved
   on. Generate repeated markup from one data structure instead.

---

## 6. What the next session should do, in order

**Phase 1. Copy only. No design file is opened.**

1. Write every word of `/`, `/work`, `/notes` and `/stack` in plain Markdown under
   `docs/copy/`. Real sentences, not placeholders.
2. Answer `DECISIONS.md` §2 while writing: how many projects, in what shape, whether the
   measured numbers appear, whether the corrections have their own page.
3. Answer §3: what is in the first viewport, what the navigation is, what mobile does.
4. **Run the ten-second test on the text alone**, five people, verbatim answers into
   `TEN_SECOND_TEST.md`. This has still never been done and it gates everything.

Only after that: §5-§8 into a `DESIGN_LOCK.md`, then rebuild.

---

## 7. Owner homework still outstanding

- **The ten-second test.** Never run. Highest-value hour available.
- **The BeatMind figures.** `parth-os/RESUME.md` says 19 days / 194 commits / 27,000 lines.
  `case-studies/beatmind.md` says 24 / 307 / ~30,500. Everything built so far uses the case
  study. Settle it to one number.
- **The job title.** Working answer is plain "AI Engineer". The 2026-03-17 offer letter has
  still not been checked.
- **Refero captures**, if wanted: the MCP needs a paid subscription and the skill will not
  scrape a site whose robots.txt disallows AI crawlers. Six screenshots into
  `design-kit/inbox/refero/` is the manual route.

---

## 8. Research still unfinished

Two sweeps died to a rate limit and never wrote to disk. Neither blocks Phase 1.

- **The Reddit practitioner sweep.** The one thing that could still show whether an
  ambitious portfolio repels the buyer.
- **The twenty-site reference sweep**, re-aimed at sites that are spectacular *and* legible.

The Group B synthesis on design-system encoding is also missing, though its per-video notes
landed.
