# BUILD PLAN — v2

> ⚠️ **Partly superseded 2026-08-27.** Two of this plan's decisions did not survive
> contact: the scroll-scrubbed pin and the kinetic-type fusion are both gone, because each
> gated the message behind a gesture. Read [`SESSION_HANDOFF.md`](SESSION_HANDOFF.md) §4
> for the corrections and §6 for what to do next. The sequence in §4 below still stands.

Written 2026-08-27, after Phase 0 research closed. This supersedes the open questions in
`DECISIONS.md` §4 for the direction choice only. Everything else in that register stands.

The decision: **Denoise is the signature, and it absorbs Kinetic rather than sharing the
stage with it.** Research stops here except for one background job.

---

## 1. Why not combine all five

Three studios that do spectacular work for a living say the same thing independently, for
craft reasons rather than budget ones:

| Source | The line |
|---|---|
| field.io | "One or two key WebGL moments is the recipe, not the whole page" |
| Active Theory | "One big set-piece is the recipe, not five small ones" |
| Resn | "Fewer, better beats. The recipe needs a payoff scene" |

Five signature moments is noise. But the five directions were never five of the same kind of
thing, which is what made "combine them" tempting and confusing at once:

| Direction | What it actually is | Conflicts with Denoise |
|---|---|---|
| D8 Denoise | a reveal mechanic, how things arrive | — |
| D11 Kinetic | a type system, how type behaves | **Yes.** Both are motion |
| D9 Citation | a content discipline | No. Not a visual |
| D10 Contact Sheet | one component | No. One page |
| D7 Weightless | a palette and density stance | No. It is the base |

Only one real conflict. The rest stack.

### The fusion, which is the actual idea

Denoising is resolution from disorder to order. A variable font settling its axes is
resolution from one state to another. **They are the same gesture**, so they become one
motion rather than two effects.

The headline starts wide, light and grained. It resolves to tight, heavy and clean in a
single pass. `wght` and `wdth` interpolate on the same curve that drives the noise decay.
One mechanic, and it happens to be both of the things the owner liked.

---

## 2. The committed stack

| Layer | Decision |
|---|---|
| **Signature** | The fused denoise-and-settle. Once, on arrival. Nothing else on the site moves like this |
| **Base** | D7's discipline. Hierarchy from scale rather than weight, body at 200, zero cards, zero borders, one accent used only on the thing meant to be clicked |
| **Substrate** | D9's footnoting. Every claim sourced. Invisible until touched, so it costs no visual budget |
| **One component** | D10's contact sheet, on the Work index only, not sitewide |
| **Dropped** | D11 as a standalone system, D6's particle field, D5 entirely |

### Pages

Four. Decided by what there is to say, not by a template.

| Page | Job |
|---|---|
| `/` | The sentence, the three figures, the work, one contact action |
| `/work` | The contact sheet. Five real captures, each opening a case |
| `/notes` | Writing, including the corrections record |
| `/stack` | The tools he actually uses day to day |

---

## 3. The three rules that keep the signature safe

Denoise is an arrival effect, and arrival effects get old. A returning visitor gets nothing.
A fast scroller gets nothing. The bad case is a founder on a phone with poor signal seeing
noise when they wanted an answer, inside a ten-second budget.

1. **The headline is real text, readable before the effect starts.** Never gated behind it.
   This is Meng To's rule: the static first frame is complete on its own.
2. **Under 1.2s, once per session.** `sessionStorage`, not on every scroll into view.
3. **`prefers-reduced-motion` and no-JS both get the resolved frame immediately.** Not a
   shortened animation. The final state.

A fourth, from the repo's own rules: **the noise canvas is never a control.** Nothing is
clicked through it, no content lives inside it, no legend explains it. That is the line v1
crossed.

---

## 4. Sequence

Unchanged from `REBUILD_BRIEF.md` §6. The point of the order is that Phase 3 ships before
Phase 4 exists.

| Phase | Work | Gate |
|---|---|---|
| **1** | Copy only. Every word of all four pages in plain Markdown, no design | The ten-second test passes **on the text alone** |
| **2** | `DESIGN_LOCK.md` via `/design-pass init`, naming denoise as the signature and carrying the numbers from `design/CRAFT-VALUES.md` | Tokens exist before any component |
| **3** | Build all four pages. Static-HTML readable, **no denoise** | Ten-second test passes. **Ship it live** |
| **4** | Add the fused signature in one commit | `git revert` still leaves a working site |
| **5** | Domain cutover, redirect v1 | Test passes at 4/5 |

---

## 5. Research: closed, with one exception

Committed under `design/`: 29 videos transcribed and mined, nine skill repos, the craft
values with sources, the asset inventory, eleven directions with live demos.

**The remaining sweeps are validation, not generation.** They would tell us whether ambitious
sites convert. They would not change what gets built, and waiting on them delays the only
test that matters.

The one exception is the **Reddit practitioner sweep**, because it is the single thing that
could show this direction repels the buyer. It runs in the background after the rate limit
clears and the build does not block on it.

Also still open and cheap to finish later: the twenty-site reference sweep, and the Group B
synthesis on design-system encoding.

---

## 6. What is still owner homework, and still gating

None of this is fixed by design.

1. **The §1.1 sentence has never been said to five people.** No amount of denoise saves a
   sentence that does not land. `TEN_SECOND_TEST.md` Round 0 is still empty.
2. **The BeatMind figures conflict.** 19 days / 194 commits / 27,000 lines in
   `parth-os/RESUME.md` against 24 / 307 / ~30,500 in its own case study. The case study is
   later and more precise and every demo built so far uses it. One number, everywhere.
3. **The job title.** Plain "AI Engineer" is the working answer and survives either reading
   of the offer letter, but the offer letter has still not been checked.
4. **Refero captures**, if we want them: the MCP needs a paid subscription and the skill will
   not scrape a site whose robots.txt disallows every AI crawler. Six screenshots into
   `design-kit/inbox/refero/` is the manual route.

---

## 7. Budget, and the one place it is under pressure

`REBUILD_BRIEF.md` §4 proposes 4,000 lines, 15 components, 4 runtime dependencies.

The lines and components are comfortable for four pages. **Dependencies are the tight one.**
The awwwards bar assumes GSAP plus exactly one smooth-scroll engine, never two. With a
framework that is three of four before anything else is added.

The fused signature needs neither. It is one canvas, one variable font file, and a
`requestAnimationFrame` loop, which is how the published demo already works. **If the build
starts reaching for GSAP, Lenis and a framework at once, that is the moment to argue the
budget up on the record rather than quietly exceed it.**
