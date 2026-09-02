# WORLDS — the spec for what is behind each tear

Written 2026-08-27. Reads after [`DESIGN_LOCK.md`](DESIGN_LOCK.md), which settles the
landing sheet. This file settles **what a world is**, and specifies all twelve.

A world is a scroll-directed product story. It is not a gallery, not a looping hero, not
a screenshot carousel, and not a miniature fake version of the product. It lets the
visitor watch a real workflow unfold while concise DOM narration explains why each step
exists. The separate paper case study provides the engineering deep dive.
It answers the question an employer or client is asking: *did this person build a real
thing, and can they explain what mattered.*

---

## 1. What every world has to do

**One rule above all the rest, carried over from `DESIGN_LOCK.md` §6:**

🔴 **The graphic is never the only control or the only source of information.** Native
scroll may advance its story and an optional labelled control may start sound or replay
a sequence, but route navigation and world narration remain ordinary DOM. Delete every
canvas on the site and the twelve complete paper case studies still remain on their
canonical routes. Break this and it is v1's constellation in new clothes.

### What is shared and what is not

Each world uses the project-specific scenes recorded below. It must arrive clearly,
demonstrate one causal workflow, include a real failure or boundary where specified, resolve
to a useful final frame and offer one explicit action into the full paper case study.
Worlds do not share a visual template.

Paper case studies do share a reading contract so missing evidence cannot hide behind
visual novelty. That contract lives in `CASE_STUDY_CONTRACT.md`.

### The rules a world obeys

1. **The static state is complete.** A world with JavaScript off shows a composed frame,
   the complete concise world narration and the case-study action. The paper route contains
   the full case study. Nothing required to understand or leave the world is gated behind
   motion.
2. **The graphic is drawn from that project's own material.** Real timings, real
   envelopes, real distributions. If a number in a graphic is invented, the graphic is
   a lie and the site's whole thesis goes with it.
3. **One accent per world, taken from the product.** Not chosen for the page.
   BeatMind's five current stem colours are BeatMind's own.
4. **Reduced motion gets the final frame**, composed to stand alone, not a shortened
   animation.
5. **30fps ceiling, paused off-screen and on hidden tabs.** One clock for the site.
6. **A world with no honest graphic yet says so.** A held slot beats a mock-up.
7. **Every claim in the copy is checkable** against the repo, the deployment, or the
   errata. No estimated metrics, no implied clients, no invented users.
8. **Native scroll controls time, not access.** A bounded sticky stage may progress as
   the world narration scrolls, but scroll is never hijacked and the user can always
   continue.
9. **It demonstrates, it does not impersonate.** Product actions may be rehearsed as a
   story, but a portfolio page does not pretend to be the production editor, dashboard
   or medical tool.
10. **Each world starts as a storyboard.** Before code, the owner reviews its scenes,
    real-data inventory, final still, mobile composition and unresolved claims.
11. **Audio is opt-in.** It starts only from a labelled user action, has a visible stop,
    and is never necessary to understand the case study.

### Type and ground inside a world

Dark: `--void #0B0C0E`, rule `#262A2F`, ink `#F2F3F0`, secondary `#9AA0A2`. The paper
frame stops at the tear; inside, the work is loud. Display is Bricolage Grotesque,
body Archivo, data DM Mono, exactly as the landing.

---

## 2. Build order

The shared lifecycle and BeatMind pilot are built first in Phase 5. The remaining worlds
follow in Phase 6, flagships first. Each project-specific world is **its own commit** and
must revert alone.

| Wave | Worlds | Why |
|---|---|---|
| A | BeatMind, Vivid, Tathya | The three flagships. The most material, the best captures |
| B | MedRAG, Order Supervisor, QueryPilot | Strong engineering stories, graphics already specced |
| C | SecondSelf, OncoVerse, UPI Fraud | Real substance, thinner assets |
| D | Spur Chat, Fraud Risk Intel, Oracle Auto Provision | Small and honest about being small |

---

## 3. The twelve

Status legend: **✅ built** means the validated production route and fallbacks pass their
automated gate. **🧪 prototyped** means the generator exists and has been seen running in an
artifact. **📐 specced** means designed here, not yet built.

---

### 01 · BeatMind — *flagship · live · ✅ built*

**The story.** A song goes in whole and comes back in parts. The interesting half is
not the model, it is that the pipeline survives its own workers dying.

**The graphic.** The **Sound Foundry**: one waveform travels through a continuous precision
machine and becomes five coloured stem lanes. The generated machinery is decorative; every
waveform, analysis mark and run state is drawn from BeatMind data. Production uses real
envelope data exported from a separated track, never `Math.random()` or generated data art.

**Scroll story.** Native vertical scroll moves down through one machine: specimen chamber,
separation gantry, worker loss, retry, analysis scanner, arrangement deck, mix chamber,
render press and a dark deep-dive handoff. No other input is required. The five stems remain connected to
one clock as the view changes. The failure and retry become factual only when a real
publishable trace replaces the labelled storyboard state. Reduced motion shows the composed
five-lane mixdown and the complete readable story.

**Accent.** BeatMind's current stem colours: vocals `#F0A2C0`, backing vocals `#C58FD6`,
drums `#F0955A`, bass `#5AA8F0`, other `#7DE3A8`.

**Second graphic, below the fold.** The **run trace**: eight stages with real
durations, including the `separate` stage failing, the worker being lost in red, and
the retry completing in green. This is the most distinctive single graphic on the whole
site and no competitor's portfolio has one.

**Verified content.** The current local web workspace passed 381 tests across 39 test
files on 2026-08-28. A documented fixed-input separation comparison records 97.2 seconds
on T4 and 56.5 seconds on L4 for one 120-second track; this is separation latency, not the
full pipeline. Conflicting duration, commit and line-count snapshots remain excluded.
The owner reports 18 Clerk accounts, but the attached Vercel Analytics screenshot does
not prove that count, so it remains unpublished.

**Errata.** The copyright tickbox that got deleted.

**Build notes.** The owner approved the Sound Foundry and current five-stem language on
2026-08-30. The Phase 2 animatic uses the owner-authored browser-synth score only to test
camera continuity and legibility. The Phase 5 read-only export produced real source and
five-stem envelope arrays plus analysis markers from BeatMind commit `ca55ad8`. No explicitly
correlated publishable failure/retry trace exists, so those scenes are omitted. The exporter
is isolated on BeatMind branch `codex/portfolio-world-export` at `30cab81`; it is not in the
product branch and has not been pushed or deployed. Use a licensed or owner-created audio
excerpt only after explicit approval. Audio is currently withheld. The world is a
storytelling demonstration, not a working mixer, and performs no runtime fetch.

---

### 02 · Vivid (Stick and Dot) — *flagship · live · ⚙️ production route awaiting owner review*

**The story.** A script becomes a shot-by-shot storyboard with one character who stays
the same person across every frame. A project-specific LoRA adapter supports the generation
experiments; this is not foundation-model training.

**The graphic.** A reference-first contact sheet: one neutral character anchor binds to
successive shots while the script becomes a readable sequence. Diffusion may remain one
chapter of the story, but its counter must come from the selected run's real inference
profile rather than a hard-coded number. The current `upgrade-flux` source uses 32 steps for
base storyboard renders and 8 for the pinned Turbo evaluation profile; neither number is a
permanent visual-design token.

**Scroll story.** Script beats become shots, references bind to characters, sampling
resolves each frame, consistency is checked, and the failed previous-frame conditioning
experiment becomes the turn in the story. Reduced motion shows the resolved storyboard
and the failed comparison side by side.

**Accent.** The production Story Loom uses dark wood, pottery amber, pale neutral thread and
one oxblood evidence-boundary mark. Colour is decorative; the real evaluation frames carry
the product evidence.

**Content.** The recorded completed LoRA run used 1,996 discovered images and finished
2,500 steps. A separate 42-shot Turbo comparison was 5.90 times faster but was rejected
after identity and text-scene regressions. The owner knows at least 10 people who used
Vivid, but no durable count source is attached, so the number remains unpublished.

**Errata.** Conditioning each shot on the previous shot's pixels made it worse: the
previous frame's hand pose overrode the text prompt and later shots ran roughly four
times slower.

**Build notes.** The owner cleared one Kyoto pottery evaluation sequence for portfolio use:
one neutral anchor and four ordered real frames. Its production Story Loom is a static Astro
export with no runtime Vivid request. The decorative loom plate is not product output. A
publishable pose-copying comparison is still unavailable, so that failure stays text-only.
Vivid's commercial product-model licence is unresolved; the route states that boundary.

---

### 03 · Tathya — *flagship · in progress · 🧪 prototyped*

**The story.** An autonomous record of a government that issues no verdict. Every claim
carries its source and the reader decides.

**The graphic.** Sources arriving as scattered points and settling into clusters. The
readout counts case files as they form.

**Scroll story.** A source arrives, becomes a claim, joins a case file, receives its
citation and stops before a verdict. Later scenes show conflicting sources coexisting
without a ranking. Reduced motion shows the sourced, unresolved case file.

**Accent.** `#4FD39B` for a resolved cluster, `#39424A` for one still arriving.

**Content.** The hard part is **deciding nothing.** The temptation is to summarise into
a conclusion; it states what each source said and stops.

**Boundary.** This is the strongest boundary section on the site and should be written
at length: no verdict, no ranking, no sentiment score.

**Build notes.** Cluster counts and source counts come from the live database at build
time, so the graphic's numbers are the real ones.

---

### 04 · MedRAG — *major · shipped · 🧪 prototyped*

**The story.** A retrieval system whose feature is refusing to answer.

**The graphic.** An embedding space. A query point pulls citations from nearby
documents with drawn links; then a second query lands where nothing is close enough and
is marked **refused** in red, with its evidence radius empty.

**Scroll story.** The first question retrieves enough evidence and answers with citations.
The second lands outside the evidence radius and refuses. The refusal is the final scene,
because it is the argument.

**Accent.** `#4FD39B` cited, `--oxblood` refused.

**Content.** The final evaluation recorded 4 refusals in 20 cases. Publish that denominator
and evaluation name rather than an unqualified “roughly 20%.”

**Boundary.** The whole page is the boundary. Lead with it.

**Build notes.** Project real embeddings to 2D once, at build time, and ship the
coordinates. Do not fake the geometry.

---

### 05 · Order Supervisor — *minor · shipped · 🧪 prototyped*

**The story.** An agent handles the conversation and never owns the order state.

**The graphic.** The Temporal state machine as nodes and edges, with the human gate lit
and every model-proposed transition shown arriving at a gate rather than at the state.

**Scroll story.** A customer message becomes a proposed action, authoritative order state
is checked, deterministic workflow code accepts or rejects the action, and the event is
recorded. The current source does not guarantee human approval for every transition, so
the world does not depict one. Reduced motion parks the proposal at the authority boundary.

**Accent.** One colour for the machine, `--oxblood` for the gate.

**Content.** Lifecycle authority stays outside the model, which is the shortest path
not taken.

---

### 06 · QueryPilot — *major · shipped · 📐 specced*

**The story.** Natural language to SQL, with a critic that validates before the query
touches the database and a correction loop when it fails.

**The graphic.** The loop, drawn as a loop: question → schema retrieval → generated SQL
→ critic → either execute, or back round with the failure reason attached.

**Scroll story.** A question retrieves schema, generates SQL, fails the critic with a
readable reason, returns through correction and executes only after acceptance. Reduced
motion shows the rejected and corrected queries together.

**Accent.** Blue for the forward path, `--oxblood` for the rejection edge.

**Content.** The current evidence supports a +5.7 percentage-point lift on the 70-query
core set. The 12 adversarial queries are reported separately. Do not describe the lift as
being measured across all 82 unless later evidence proves that denominator.

**Build notes.** 🔴 **The current capture is a Swagger docs page**, which proves an API
exists rather than a product. Either re-shoot against a real client, or let the graphic
carry the page and drop the capture.

---

### 07 · SecondSelf — *flagship · live · 📐 specced*

**The story.** A career system that gates every outbound action on evidence, and stops
for a human before anything is sent.

**The graphic.** A pipeline that runs, reaches a review queue, and **waits** — visibly,
with a queue depth that does not clear until a decision arrives.

**Scroll story.** Evidence enters, a job packet is assembled, unsupported claims are
removed, the application reaches the review queue and waits. A human decision is shown
as a distinct later event. Reduced motion holds at the review gate.

**Accent.** One flow colour, `--oxblood` on the queue.

**Content.** Human-gated apply mode, Telegram review queue.

**Build notes.** No capture exists. The graphic carries this page entirely, which is
fine and is the argument for generated worlds in the first place.

---

### 08 · OncoVerse — *major · in progress · 📐 specced*

**The story.** A 3D cancer education atlas whose claims are bounded by sources.

**The graphic.** The atlas itself: one slowly rotating body region, source-backed
regions highlighted and unsourced ones deliberately dimmed.

**Scroll story.** The atlas reveals one region, attaches its source boundary, compares
what is known with what is not sourced and returns to the whole. Reduced motion uses a
static three-quarter view with the boundary visible.

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

**Scroll story.** Transactions enter, scores form a distribution, an alert budget cuts
the distribution, and the measurement changes with the threshold before settling on the
documented operating point. Reduced motion shows the final distribution and labelled
threshold.

**Accent.** One colour for legitimate, `--oxblood` for flagged.

**Content.** 92.06% is currently supported for a named model evaluation at a 0.5% alert
budget. A separate operational backtest reports a different overall precision. Both may
be useful, but their datasets and contexts must never be collapsed into one claim.

**Note.** This is the one world where a threshold control might genuinely teach the
tradeoff. It may be proposed during storyboard review only if keyboard, touch and a
non-interactive explanation remain complete. It is never required to read the result.

---

### 10 · Spur Chat — *minor · shipped · 📐 specced*

**The story.** A streaming support agent scoped to one brand's catalogue and policies,
built to a company brief.

**The graphic.** A token stream arriving, with the retrieved catalogue scope shown
alongside so the answer is visibly bounded rather than open-ended.

**Scroll story.** A question arrives, catalogue scope is retrieved, unsupported material
is excluded and the bounded answer streams. Reduced motion shows the scope and final answer.

**Content.** Be plain that this was a take-home. Honesty about scale is the site's
whole posture and a small project stated small costs nothing.

---

### 11 · Fraud Risk Intel — *minor · shipped · 📐 specced*

**The story.** An earlier, explainable fraud system with frozen preprocessing.

**The graphic.** Reconstruction error plotted against the anomaly boundary, normal
points inside and anomalies outside.

**Scroll story.** Preprocessing freezes, transactions become reconstruction errors, the
boundary separates normal from anomalous and the explanation attaches to one flagged point.
Reduced motion shows the settled distribution.

**Content.** Frozen preprocessing is the point: the same input scores the same way
tomorrow. Say why that matters.

---

### 12 · Oracle Auto Provision — *minor · running · 📐 specced*

**The story.** A small provisioning automation whose value is retrying safely after a
failed run. It is configured to retry every five minutes and checks for an existing
instance first. Duration and uptime remain unpublished until evidence is attached.

**The graphic.** A cron heartbeat: a long row of run ticks, most green, with the failed
attempts and the retry that finally landed marked in red.

**Scroll story.** Scheduled runs accumulate, one fails, the retry waits, and the later
attempt lands. Reduced motion shows the failed and successful attempts together.

**Content.** Keep the scope small and state what the retry protected. Do not claim
“months” or “longest uptime” until logs establish the duration and comparison. The code
contains an auto-disable helper, but the current workflow does not pass its required token;
manual disable is the verified operating instruction.

---

## 4. What is not built yet

Several projects have no useful product capture. That does not block the static case-study
shell, because a sourced world still can carry the arrival. It does block claiming the
product has been visually demonstrated when it has not. Each storyboard inventory states
whether it relies on a capture, generated data graphic or both.

Two existing captures remain unsuitable for their final worlds: Vivid's old empty state is
used only as workflow evidence in the paper case and still must be replaced by an
owner-approved real generated sequence for the world, and QueryPilot's Swagger
page must be replaced by a real correction trace.

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
- The prototype loops graphics independently of the reading sequence. Production worlds
  are scroll-directed narratives with composed static endpoints.
