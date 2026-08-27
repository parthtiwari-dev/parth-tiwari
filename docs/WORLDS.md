# WORLDS — the spec for what is behind each tear

Written 2026-08-27. Reads after [`DESIGN_LOCK.md`](DESIGN_LOCK.md), which settles the
landing sheet. This file settles **what a world is**, and specifies all twelve.

A world is a case study. It is not a gallery, not a hero with a screenshot, and not a
list of features. It is the answer to the only question an employer or a client is
actually asking: *did this person build a real thing, and can they explain it.*

---

## 1. What every world has to do

**One rule above all the rest, carried over from `DESIGN_LOCK.md` §6:**

🔴 **The graphic is never a control.** Nothing is clicked through it, no content lives
inside it, no legend explains it. Delete every canvas on the site and twelve complete,
readable case studies remain. Break this and it is v1's constellation in new clothes.

### The skeleton, identical for all twelve

Same shape everywhere, so a reader who has read one knows how to read the next, and so
a missing section is visibly missing rather than quietly absent.

| # | Beat | What it does | Length |
|---|---|---|---|
| 1 | **Arrival** | Full-bleed graphic, the name, one sentence. The graphic runs on its own | 1 screen |
| 2 | **What it is** | Plain language. What a person gets, not which library was used | 2-4 sentences |
| 3 | **The problem** | Why it was hard, concretely. Not "AI is complex" | 3-5 sentences |
| 4 | **How it is built** | The architecture, and the one decision that mattered | 4-8 sentences, one diagram if it earns it |
| 5 | **The measurement** | A number with a denominator, or an honest absence | 1-6 figures |
| 6 | **The boundary** | What it refuses to do, and why that is a feature | 2-4 sentences |
| 7 | **What broke** | The errata entry for this project. First person | 3-5 sentences |
| 8 | **Stack and links** | Real, verified public URLs only | a row |
| 9 | **Next** | Sideways to another world. Never a dead end | a line |

### The rules a world obeys

1. **The static frame is complete.** A world with JavaScript off shows a still first
   frame of its graphic and the entire case study. Nothing is gated behind motion.
2. **The graphic is drawn from that project's own material.** Real timings, real
   envelopes, real distributions. If a number in a graphic is invented, the graphic is
   a lie and the site's whole thesis goes with it.
3. **One accent per world, taken from the product.** Not chosen for the page.
   BeatMind's four stem colours are BeatMind's own.
4. **Reduced motion gets the final frame**, composed to stand alone, not a shortened
   animation.
5. **30fps ceiling, paused off-screen and on hidden tabs.** One clock for the site.
6. **A world with no honest graphic yet says so.** A held slot beats a mock-up.
7. **Every claim in the copy is checkable** against the repo, the deployment, or the
   errata. No estimated metrics, no implied clients, no invented users.

### Type and ground inside a world

Dark: `--void #0B0C0E`, rule `#262A2F`, ink `#F2F3F0`, secondary `#9AA0A2`. The paper
frame stops at the tear; inside, the work is loud. Display is Bricolage Grotesque,
body Archivo, data DM Mono, exactly as the landing.

---

## 2. Build order

Flagships first, because they carry the most weight and are the most likely to be the
only one a visitor opens. Each world is **its own commit** and must revert alone.

| Wave | Worlds | Why |
|---|---|---|
| A | BeatMind, Vivid, Tathya | The three flagships. The most material, the best captures |
| B | MedRAG, Order Supervisor, QueryPilot | Strong engineering stories, graphics already specced |
| C | SecondSelf, OncoVerse, UPI Fraud | Real substance, thinner assets |
| D | Spur Chat, Fraud Risk Intel, Oracle Auto Provision | Small and honest about being small |

---

## 3. The twelve

Status legend: **✅ prototyped** means the generator exists and has been seen running
in an artifact. **📐 specced** means designed here, not yet built.

---

### 01 · BeatMind — *flagship · live · ✅ prototyped*

**The story.** A song goes in whole and comes back in parts. The interesting half is
not the model, it is that the pipeline survives its own workers dying.

**The graphic.** Four stem envelopes in coloured lanes with a playhead sweeping left to
right, played bars saturated and unplayed bars grey. Drawn from real envelope data
exported from a separated track, not from `Math.random()`.

**Animation.** The playhead loops over 6s. Bars near the playhead swell. On arrival the
lanes draw in top to bottom, 90ms apart. Reduced motion: playhead parked at 40%, all
four lanes fully drawn.

**Accent.** BeatMind's own stem colours: vocals `#E86A8A`, drums `#E8913C`,
bass `#4F9BE8`, other `#4FD39B`.

**Second graphic, below the fold.** The **run trace**: eight stages with real
durations, including the `separate` stage failing, the worker being lost in red, and
the retry completing in green. This is the most distinctive single graphic on the whole
site and no competitor's portfolio has one.

**Content it already has.** 24 days solo, 307 commits, ~30,500 lines, 299 tests across
four tiers, 70s → 23.4s on stem separation after root-causing a missing
`libcublasLt.so.13`, and **zero users, which stays on the page.**

**Errata.** The copyright tickbox that got deleted.

**Build notes.** Export a real envelope array and a real job trace to JSON at build
time. The canvas reads the JSON. No fetch at runtime.

---

### 02 · Vivid (Stick and Dot) — *flagship · live · ✅ prototyped*

**The story.** A script becomes a shot-by-shot storyboard with one character who stays
the same person across every frame. He trained the model it runs on.

**The graphic.** Diffusion. Noise resolving into a composed frame over 28 steps, with a
step counter and a progress rule. **This is the one place the v2 denoise idea is true**:
it is literally what the product does, on the one page that is about it.

**Animation.** 8s cycle, resolve over the first 70%, hold the finished frame for the
rest, the way a real sampler ends. Reduced motion: the resolved frame, step 28 of 28.

**Accent.** The dusk palette of the frame it resolves to.

**Content.** 2,250 LoRA training steps, the dataset pipeline, CLIP scoring for prompt
alignment and face consistency.

**Errata.** Conditioning each shot on the previous shot's pixels made it worse: the
previous frame's hand pose overrode the text prompt and later shots ran roughly four
times slower.

**Build notes.** The resolved frame is generated, not photographed, so there is no
licensing question and no asset to ship. 🔴 **The current capture is an empty state**
("READY TO RENDER" with four blank slots). Re-shoot it showing generated shots before
this world ships.

---

### 03 · Tathya — *flagship · in progress · ✅ prototyped*

**The story.** An autonomous record of a government that issues no verdict. Every claim
carries its source and the reader decides.

**The graphic.** Sources arriving as scattered points and settling into clusters. The
readout counts case files as they form.

**Animation.** 9s settle with a per-point stagger so it looks like arrival rather than
a transition. Reduced motion: fully settled.

**Accent.** `#4FD39B` for a resolved cluster, `#39424A` for one still arriving.

**Content.** The hard part is **deciding nothing.** The temptation is to summarise into
a conclusion; it states what each source said and stops.

**Boundary.** This is the strongest boundary section on the site and should be written
at length: no verdict, no ranking, no sentiment score.

**Build notes.** Cluster counts and source counts come from the live database at build
time, so the graphic's numbers are the real ones.

---

### 04 · MedRAG — *major · shipped · ✅ prototyped*

**The story.** A retrieval system whose feature is refusing to answer.

**The graphic.** An embedding space. A query point pulls citations from nearby
documents with drawn links; then a second query lands where nothing is close enough and
is marked **refused** in red, with its evidence radius empty.

**Animation.** Alternates cited and refused on a 9s cycle. Reduced motion: the refused
state, because that is the argument.

**Accent.** `#4FD39B` cited, `--oxblood` refused.

**Content.** Roughly 20% of adversarial inputs refused rather than answered.

**Boundary.** The whole page is the boundary. Lead with it.

**Build notes.** Project real embeddings to 2D once, at build time, and ship the
coordinates. Do not fake the geometry.

---

### 05 · Order Supervisor — *minor · shipped · ✅ prototyped*

**The story.** An agent handles the conversation and never owns the order state.

**The graphic.** The Temporal state machine as nodes and edges, with the human gate lit
and every model-proposed transition shown arriving at a gate rather than at the state.

**Animation.** A single order walks the machine, pauses visibly at the gate, then
proceeds. Reduced motion: parked at the gate.

**Accent.** One colour for the machine, `--oxblood` for the gate.

**Content.** Lifecycle authority stays outside the model, which is the shortest path
not taken.

---

### 06 · QueryPilot — *major · shipped · 📐 specced*

**The story.** Natural language to SQL, with a critic that validates before the query
touches the database and a correction loop when it fails.

**The graphic.** The loop, drawn as a loop: question → schema retrieval → generated SQL
→ critic → either execute, or back round with the failure reason attached.

**Animation.** One query goes round twice: rejected on the first pass with the critic's
reason readable, accepted on the second. Reduced motion: the accepted pass.

**Accent.** Blue for the forward path, `--oxblood` for the rejection edge.

**Content.** +5.7pp correction depth on an 82-query benchmark. 🔴 Verify this figure
against the repo before it ships; `DECISIONS.md` flags several numbers as unsourced.

**Build notes.** 🔴 **The current capture is a Swagger docs page**, which proves an API
exists rather than a product. Either re-shoot against a real client, or let the graphic
carry the page and drop the capture.

---

### 07 · SecondSelf — *flagship · live · 📐 specced*

**The story.** A career system that gates every outbound action on evidence, and stops
for a human before anything is sent.

**The graphic.** A pipeline that runs, reaches a review queue, and **waits** — visibly,
with a queue depth that does not clear until a decision arrives.

**Animation.** Items flow, accumulate at the gate, and hold. The stall is the point;
resist the urge to drain it. Reduced motion: items held at the gate.

**Accent.** One flow colour, `--oxblood` on the queue.

**Content.** Human-gated apply mode, Telegram review queue.

**Build notes.** No capture exists. The graphic carries this page entirely, which is
fine and is the argument for generated worlds in the first place.

---

### 08 · OncoVerse — *major · in progress · 📐 specced*

**The story.** A 3D cancer education atlas whose claims are bounded by sources.

**The graphic.** The atlas itself: one slowly rotating body region, source-backed
regions highlighted and unsourced ones deliberately dimmed.

**Animation.** A slow rotation, one axis. Reduced motion: static three-quarter view.

**Accent.** One highlight colour for sourced, grey for not.

**Build notes.** ⚠️ **The only world that would justify Three.js**, and it is a
`client:visible` island on one route rather than a sitewide dependency. If it threatens
the budget, ship a pre-rendered turntable sprite sheet instead. **Decide before
building, not during.**

---

### 09 · UPI Fraud Engine — *major · shipped · 📐 specced*

**The story.** Real-time fraud scoring under an alert budget, which is a constraint
most demos pretend does not exist.

**The graphic.** A score distribution with the alert-budget threshold as a line that
moves, and precision updating as it moves. Move the line, watch the tradeoff.

**Animation.** The threshold sweeps its useful range and settles at 0.5%. Reduced
motion: parked at 0.5% with the number stated.

**Accent.** One colour for legitimate, `--oxblood` for flagged.

**Content.** 92.06% precision at a 0.5% alert budget.

**Note.** This is the one world where a control would be genuinely tempting. **Do not
add one.** It animates; it is not a slider. Same rule as every other world.

---

### 10 · Spur Chat — *minor · shipped · 📐 specced*

**The story.** A streaming support agent scoped to one brand's catalogue and policies,
built to a company brief.

**The graphic.** A token stream arriving, with the retrieved catalogue scope shown
alongside so the answer is visibly bounded rather than open-ended.

**Animation.** One answer streams in at realistic cadence, then holds. Reduced motion:
the completed answer.

**Content.** Be plain that this was a take-home. Honesty about scale is the site's
whole posture and a small project stated small costs nothing.

---

### 11 · Fraud Risk Intel — *minor · shipped · 📐 specced*

**The story.** An earlier, explainable fraud system with frozen preprocessing.

**The graphic.** Reconstruction error plotted against the anomaly boundary, normal
points inside and anomalies outside.

**Animation.** Points arrive and sort themselves relative to the boundary. Reduced
motion: settled.

**Content.** Frozen preprocessing is the point: the same input scores the same way
tomorrow. Say why that matters.

---

### 12 · Oracle Auto Provision — *minor · running · 📐 specced*

**The story.** A small piece of automation that has quietly worked for months.

**The graphic.** A cron heartbeat: a long row of run ticks, most green, with the failed
attempts and the retry that finally landed marked in red.

**Animation.** The row fills left to right, then holds. Reduced motion: filled.

**Content.** The smallest project here, and the one with the longest uptime. That
contrast is worth stating rather than hiding.

---

## 4. What is not built yet, and blocks nothing

Seven of twelve have no capture, and that is now **fine by design** — the worlds are
generated from data, not photographed. Captures are a bonus, not a dependency. This is
the direct payoff of the generated-world system and it is why the capture pass moved
after the design rather than before it.

Two captures that do exist should be replaced before their world ships: Vivid's empty
state, and QueryPilot's Swagger page.

## 5. Known gaps in the prototype, carried forward

Recorded so the rebuild does not inherit them silently.

- **Touch has no hover, so the backlight never fires on a phone.** The landing's central
  invitation is currently desktop-only. `CLAUDE.md` requires any hover interaction to be
  reachable and dismissable by touch. **Fix in Phase 4**: on coarse pointers, the entry
  nearest the viewport centre backlights as you scroll.
- Nav links are in-page anchors in the prototype. They become real routes.
- The tear uses plain stock rather than a clone of the page. Acceptable, recorded.
- `Download the resume` points nowhere yet.
- The BeatMind figures conflict is still unresolved and gates that world's numbers.
