# REBUILD BRIEF — v2

Rewritten 2026-08-23. **This version decides less than the first one did, on purpose.**

The first draft of this file settled multi-page vs single-page, the number of case studies,
the organising idea and the five-second answer. The owner's instruction is that **nothing is
decided yet** — every surface, down to a border radius, gets researched and argued before it
is chosen. Those calls have moved to [`DECISIONS.md`](DECISIONS.md) as open questions.

What remains here is only what is **evidence**, plus the **method** and the **guards**. If a
line in this file is a taste preference, it is in the wrong file.

---

## 1. The evidence

**Every person shown the current site has said they do not understand it.** Sharpest version,
from a UI/UX designer (design lead at Apps for Bharat, now Times of India):

> *"Nothing is clear. I don't know which were projects, what it does, or what the concept
> is. It's really hard to grab."*

The same person said BeatMind's site looks great and made him want to try the product. Same
builder, same taste. **Craft is not the variable.**

### The diagnosis, which is not "it looks AI-generated"

Slop is generic. The constellation is **over-specific**. It makes a visitor learn a legend —
node size means evidence weight, colour means project type — before they can read anything.
The interaction *is* the information architecture, so there is no content until you interact.

Portfolios get dismissed when *"the experience of viewing it requires too much effort"* —
**not because the work lacks merit.**

### The root cause, written down so it is not repeated

**The metaphor was chosen first, and twelve projects were fitted into it.** That is why a
legend exists. Everything in §3 is a guard against that happening twice.

---

## 2. The only two things settled

1. **v1 is replaced, not patched.** The constellation *is* the IA; patching means fighting it.
2. **No constellation, stars, glass panels, orbit metaphors, or borrowed BeatMind grammar.**
   Ruled out by the owner, final.

Everything else — genre, structure, type, colour, motion, radii, stack, page count, what the
site even argues — is **open**. See [`DECISIONS.md`](DECISIONS.md).

---

## 3. 🔴 The rule that prevents the repeat

**The creative layer must be deletable.**

The constellation happened because the creative idea was load-bearing: remove it and there
was no site. Willpower does not fix that. Structure does.

> Build the plain version first and ship it. Then add **one** creative layer, in its own
> commit, that can be reverted without breaking anything.
>
> The test is literal: `git revert` the creative commit. If what remains is a working, clear,
> complete site, you are safe. If it is not, the creative thing has become the information
> architecture again. Stop and restructure.

The owner's own instinct already found the right shape: **a clear default, and a toggle into
something playful.** The default is the site. The toggle is the play. If the toggle broke
tomorrow, nothing is lost.

### Supporting rules

1. **Content before form.** Every word in plain Markdown first, tested for clarity with no
   design at all. This is the direct fix for metaphor-first.
2. **One signature moment, not a signature system.** `DESIGN_LOCK.md` in v1 had this idea;
   the mistake was applying it to the whole site instead of one moment.
3. **Every page must read as static HTML with JavaScript off.** Closes v1's crawler gap and
   forces the content to carry itself.
4. **Decide nothing without writing down why.** Every choice lands in `DECISIONS.md` with the
   options considered and the reason. A decision with no recorded reason gets re-litigated by
   the next session.

---

## 4. The budget — a starting constraint, not a design decision

v1 measured on `main` @ `bc9e977`:

| | v1 | proposed v2 ceiling |
|---|---:|---:|
| `src/` lines | **18,572** | ≤ 4,000 |
| Components | **49** | ≤ 15 |
| Runtime dependencies | **8** — `three`, `@tresjs/core`, `gsap`, `lenis`, `postprocessing`, `pinia`, `vue`, analytics | ≤ 4 |

**The right column is a proposal, open to argument in Phase 0.** What is *not* open is that a
ceiling exists and is written down before the first line of code. v1 is not too ugly; it is
too much, and the failure mode was that no number said stop.

---

## 5. The gate

Run after **every** phase, on five people who have not seen it.

1. Open the site. **Close it after 10 seconds.**
2. Ask: *"What does he do? Would you hire him? For what?"*
3. Record the answers **verbatim**. Do not paraphrase, do not explain afterwards.

**Ship when four of five answer correctly with no prompting.** Until then it is not done,
however it looks.

Log every round in [`TEN_SECOND_TEST.md`](TEN_SECOND_TEST.md) with the date and raw answers.
A round recalled from memory is worthless.

---

## 6. Sequence

| Phase | Do | Gate |
|---|---|---|
| **0** | **Research and decide.** Work `DECISIONS.md` top to bottom. No code | Every row has an answer and a recorded reason |
| **1** | Copy only. Every word, plain Markdown, no design | §5 passes **on the text alone** |
| **2** | Design lock written from the Phase 0 answers | Tokens exist before any component |
| **3** | Build the plain site. Static-HTML-readable, no creative layer | §5 passes. **Ship it live** |
| **4** | Add the one creative layer, in its own revertable commit | `git revert` still leaves a working site |
| **5** | Cut the domain over, redirect v1 | §5 passes at 4/5 |

**Phase 3 ships before Phase 4 exists.** That is the mechanism that makes Phase 4 safe.

**Phase 0 is the whole point of the next session.** Do not let it collapse into "let's just
start building and figure it out" — that is precisely how v1 happened.
