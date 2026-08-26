# Five directions

Drafted 2026-08-26 for `docs/DECISIONS.md` §4. Nothing here is chosen. Each direction is
described so it can be rejected for a reason rather than a feeling.

## The frame every direction has to fit

Six constraints, none negotiable, all from evidence rather than taste.

1. **The base has to work with the creative layer deleted.** `REBUILD_BRIEF.md` §3. So every
   direction below is written in two parts: the base, and the one layer that `git revert`
   removes. A direction that cannot be split that way is not a direction, it is v1 again.
2. **The ten-second sentence has to land.** `DECISIONS.md` §1.1: *"He builds AI products on
   his own and ships them. Three for a paying studio client in five months."*
3. **We have screenshots and numbers, not photography.** See
   [`../ASSET-INVENTORY.md`](../ASSET-INVENTORY.md). This rules out `monocle-magazine` and
   `stripe-press` whatever their merits, because both need commissioned photography to work.
4. **It has to read as worth ₹50k-1L.** Which rules out `are-na`, a recipe that explicitly
   rejects premium signalling.
5. **Mobile is mandatory.** Which rules out `tufte-dataink` as a whole-site direction. Its own
   recipe says "don't use when the medium is mobile": 12-14px body plus margin notes does not
   fit a phone.
6. **It must not read as generated.** The design-kit detectors already flagged `Inter` and
   `Geist Mono` as overused faces on this repo. Neither appears in any direction below.

## How to read the dials

From `vendor/taste-skill` via `design-pass`. Three integers, 0-10: **VARIANCE** (how far
layout may drift from a predictable grid), **MOTION**, **DENSITY**. The rule that matters:
pushing all three high produces noise. Each direction below pushes exactly one.

---

## D1 — THE SPEC SHEET

> A person documented the way serious hardware is documented.

**School:** Information Architecture. **Anchors:** Tufte's data-ink rule, Vignelli, Braun
under Rams, Linear's changelog. Nothing borrowed literally. The shared logic is that the
document is the design.

**First viewport.** Name. The sentence. Three numbers set large in mono, each carrying its
denominator. One annotated product capture. No decoration above the fold at all.

**The base.** Numbered sections, real tables, figures with captions, hairlines doing the work
shadows do elsewhere. This degrades to readable HTML with the stylesheet off, which closes
v1's crawler gap by construction rather than by promise.

**The creative layer, deletable.** Annotation callouts that draw themselves onto a capture
over roughly 400ms on reveal, and figures that number themselves. Revert gives static labels
and hardcoded numerals. Nothing moves, nothing breaks.

**Concretely.** Ground warm paper, ink warm near-black. One accent, plus at most two data
colours that only ever encode a real dimension. Radius 0. No shadows. Display in a structured
grotesk (Archivo), every number and label in JetBrains Mono. Spacing 4/8/12/16/24/48.

**Dials.** VARIANCE 2 · MOTION 3 · **DENSITY 7**.

**Ten-second test.** Strongest of the five. The sentence and three numbers are the entire
fold, so there is nothing to decode.

**Risks.** Reads cold. A founder who wanted warmth gets a datasheet. Mitigation: the outcome
line leads each section and the spec sits underneath, never the reverse.

**Why it is not v1.** v1 also claimed every visual encoded something true. The difference is
that here the encoding lives in a table a person can read, not in a legend they must learn
first.

---

## D2 — THE PRODUCT PAGE FOR A PERSON

> Treat "Parth Tiwari" as the product, and use the grammar founders already read fluently.

**School:** Modern Tool / Builder SaaS. **Anchors:** Linear, Vercel, Raycast, Resend.

**First viewport.** Two-line headline, subhead, one button, and BeatMind's real recording
playing at size. The graphics are the product captures shown large, not as thumbnails.

**The base.** Hero, proof strip, three offers, five case studies, contact. Every section is
static HTML with a real image in it.

**The creative layer, deletable.** The autoplaying hero recording and scroll-triggered device
framing. Revert leaves the poster frame, which is a real screenshot and says the same thing.

**Concretely.** Near-black canvas, off-white ink. One accent on interactive elements only,
never decoratively. Hairline borders in low-opacity white. Display in Schibsted Grotesk or
Instrument Sans, captions in IBM Plex Mono. Radius small and consistent, 6-8px.

**Dials.** VARIANCE 3 · **MOTION 4** · DENSITY 5.

**Ten-second test.** Strong. This is the genre the target buyer reads every day.

**Risks.** The largest of the five, and specific: **this is the most-imitated look of 2026.**
Dark canvas, one violet-ish accent, hairline cards and a grotesk headline is precisely the
shape people now recognise as generated. Choosing it means committing to hard divergence, not
merely executing it well.

---

## D3 — THE LOGBOOK

> The site is a working record. Dated entries, revisions visible, what changed and why.

**School:** Warm Humanist crossed with Information Architecture. **Anchors:** an engineering
logbook with errata, NYT's dateline discipline, Tufte's marginalia.

**First viewport.** A fixed head carrying the sentence, then the most recent entries, dated,
newest first.

**The base.** A reverse-chronological document. The four corrections in
[`../ASSET-INVENTORY.md`](../ASSET-INVENTORY.md) stop being a page and become the form: each
entry states what was predicted, what was measured, and what changed.

**The creative layer, deletable.** A marginal rail that tracks reading position and pins the
current date. Revert leaves a plain date on each entry.

**Concretely.** Warm paper ground. Serif body at 18px for reading (Newsreader or Source Serif
4), mono for every date, delta and measurement. Rules between entries, no cards. Radius 0.

**Dials.** VARIANCE 4 · MOTION 2 · DENSITY 6.

**Ten-second test.** Weakest of the five as written, and that is the thing to fix before
choosing it. A visitor may read "blog" in two seconds and leave. It passes only if the fixed
head does the whole job.

**Why it is tempting anyway.** `parth-os/docs/RULES.md` §6 argues the corrections record is
the actual differentiator, and almost nobody publishes the measurement that killed their own
hypothesis. This is the only direction where that becomes the structure rather than a section.

---

## D4 — THE MONOGRAPH

> One idea per screen, enormous type, slow confident pacing.

**School:** Editorial / Minimalist. **Anchors:** Apple's product pages, MUJI, By-Kin.

**First viewport.** The sentence at 96-120px, and nothing else.

**The base.** Sequential full-height sections, each with one claim and one image.

**The creative layer, deletable.** Cross-fades between sections and a slow scale on captures.
Revert gives hard cuts.

**Concretely.** Either near-white or near-black, committed to fully. A high-contrast display
face (Instrument Serif, or Fraunces using its optical-size axis) at sizes where its character
shows. Almost no body copy. Enormous whitespace.

**Dials.** **VARIANCE 5** · MOTION 4 · DENSITY 1.

**Ten-second test.** Passes trivially, because there is one sentence on screen.

**Risks.** Two, both structural. Twelve projects do not fit "one idea per screen", so the
direction forces a cut to three or four, which is a §2.1 decision being made by the design
rather than by the argument. And the recipe needs imagery that does not exist: five
screenshots stretched over gallery pacing reads as empty rather than confident.

---

## D5 — THE INSTRUMENT

> An ordinary, legible page, with one live graphic that is genuinely his.

**School:** Motion / Experimental, kept on a short leash. **Anchor:** deliberately not another
website. Divergence operator 6 says take the motif from the most characteristic object in the
subject's own world.

His world has an obvious one. Every system he builds is a pipeline that emits stages, timings
and failures. BeatMind runs an eight-stage job state machine with lease tokens, per-stage
timeouts and fencing tokens. **The signature graphic is a run trace:** a horizontal timeline of
real stages with real durations, including the retry, drawn from an actual job.

**First viewport.** A conventional hero carrying the sentence, with the run trace beneath it,
animating once through a real 23.4-second separation.

**The base.** A normal page. The trace's data rendered as a table.

**The creative layer, deletable.** The trace itself. The cleanest split of all five, because
the graphic is a self-contained section rendered from a JSON file of measured timings.

**Concretely.** Dark technical ground, mono-led. One accent for the success path, one for the
retry, no third colour. Display in Space Grotesk or Bricolage Grotesque, everything else
JetBrains Mono.

**Dials.** VARIANCE 4 · **MOTION 7** · DENSITY 5.

**Ten-second test.** Passes on the hero, then the trace does something no competitor's site
does: it shows a real system running, including the part where it failed and retried.

**Risks.** Closest of the five to how v1 died, and the guard has to be explicit: **the trace
is never a control.** It cannot be clicked to navigate, it gates no content, and no legend is
required to read the page. Break any of those and it is the constellation in new clothes.

---

## Where this leaves us

**Recommendation: D1 as the base, D5 as the creative layer.**

They are the architecture the brief demands, already split. The Spec Sheet passes the
ten-second test on text alone, which is the Phase 1 gate, and it survives having every moving
thing removed because it was a document to begin with. The Run Trace is the one signature
moment, it is animated and graphic and unlike anyone else's site, and it lives in a section
that one commit can delete.

It also resolves the tension in the brief honestly. The ask is a site that is creative and
animated; the constraint is that the creative layer must be deletable. D1+D5 is the only pair
here where the creative thing is genuinely additive rather than load-bearing.

**The alternative worth arguing for: D2.** Safest commercial choice, the target buyer reads it
fluently, and the captures already exist. It carries the highest risk of reading as generated,
and that risk is manageable only with deliberate divergence.

**D3 is the most distinctive and the least safe.** Worth revisiting once the ten-second test
has a baseline number, not before.

**D4 is not recommended.** It needs imagery that does not exist, and it would settle §2.1 by
aesthetics.

## What has to be settled before any of this is locked

`DECISIONS.md` §2 and §3 are still open, and three of those rows change the answer:

- **§2.1, how many projects.** D4 needs three or four. D1 and D3 scale to twelve. D2 needs
  about five, which is how many real captures exist.
- **§3.1, one page or many.** D1 and D2 work either way. D3 is a single scroll by nature.
- **§2.5, does the site say what went wrong.** If yes, D3 stops being a long shot.
