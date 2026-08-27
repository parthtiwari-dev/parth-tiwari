# DESIGN LOCK — v2

Logged 2026-08-27, on `redesign/v2`. **This is what gets built.**

Supersedes the root `DESIGN_LOCK.md` (v1, the constellation) and `BUILD_PLAN.md` §2
(the denoise signature). Both are dead. Where this file and `DECISIONS.md` disagree,
this file wins and `DECISIONS.md` should be corrected in the same commit.

Three artifacts carry the detail. Read them before touching anything visual:

| Artifact | What it holds |
|---|---|
| The design lock | Seven routes, the world system, four live specimens, tokens, build order |
| The register | The index as a working page, re-sortable, with real captures |
| The paper sheet | The landing: rag stock, backlit index, tear into a world |

---

## 1. The idea

**One sheet of paper. Every project is an entry on it. Tearing an entry opens that
project's world.**

The landing is a single sheet of aged rag stock. It does not scroll the page; the
index scrolls inside it. Each entry opens into a full, dark, immersive case study
built in that project's own visual language.

**The count is never stated.** Projects keep arriving. Adding one is adding a row,
and nothing in the copy, the masthead or the design says how many there are. This
is already a repo rule (`CLAUDE.md`: *never hardcode the project count in prose*)
and it now governs the landing too. The working name is **Paper and Worlds**, not
"Twelve Worlds", for exactly this reason.

## 2. Why multi-page

The site has to win a **job** and a **client**. Those are two readers who want
different depths: a client wants outcome, speed and price; an employer wants
engineering decisions, tradeoffs and a CV. One page cannot serve both without
becoming a compromise that serves neither. That is the argument for many pages,
and it is an argument rather than a preference.

## 3. Routes

| Route | Job | Reader |
|---|---|---|
| `/` | The sheet. Masthead, one sentence, the index, one action | Both |
| `/work` | The register: every project, re-sortable by cost, recency, still-running | Both |
| `/work/[slug]` | One world per project. The case study lives here | Employer |
| `/notes` | Errata and writing. Predicted next to measured | Both |
| `/about` | The person, the path, how he works | Employer |
| `/resume` | Real HTML CV. **Not the Drive embed** | Employer |
| `/hire` | Scope, process, price band | Client |

**Persistent chrome:** wordmark, four links, one red action. Contact is one tap from
every route at every width.

**Never built:** a hamburger that hides the action, a cookie banner, a newsletter
modal, a testimonial slot before a real quote exists, a page whose only content is a
link to another page.

**On `/resume`:** the source of truth is `parth-os/resume/Parth_Tiwari_Resume_B.pdf`,
the Bangalore variant. The current Google Drive embed is invisible to crawlers, to
recruiter search and to ATS parsers, which is the only audience that page has. Real
HTML page, PDF as the download beside it.

## 4. The landing sheet

**Stock.** Warm rag paper `#EAE3D5`. Fibre and flecks are a canvas tile drawn once
and repeated. **Foxing is not in the tile** — a 240px tile turned seven stains into a
visible grid of blobs. Staining is a whole-sheet property and lives in a
non-repeating CSS layer.

**Edges.** Seeded deckle polygon, generated once so the sheet has the same torn edge
every load. Rolled top and bottom edges, lit on top and creased into shadow beneath.

**Shadow.** Its own layer, not `filter: drop-shadow()` on the sheet. `drop-shadow`
derives its shape from the element's alpha, so the moment the stock thins, the hole
grows its own shadow and fills itself with black.

**Ink.** One oxblood `#8E2116`, doing exactly two jobs: the hover bleed and the one
action. Bleed uses `feTurbulence` + `feDisplacementMap` so the edge feathers like ink
in fibre rather than drawing a clean shape.

**The invitation, and it is the important part.** Hovering an entry **backlights the
whole sheet**: the stock drops to 62% and the world running behind it comes up. You
see the world before you decide to enter it.

A small porthole was tried first and failed for a reason worth recording: most of
these worlds are sparse and dark, so a 240px window had almost nothing in it and read
as a stain. Backlighting the whole sheet shows the entire world at once and never
looks like damage. **The type is a separate layer from the stock**, so it stays fully
opaque while the paper goes translucent.

**Arrival.** The sheet settles once, then the entry names lay down like ink, left to
right, 62ms apart. The sheet leans a degree or so toward the pointer so it has weight.
None of it is scroll-driven.

## 5. The tear

Clicking an entry splits the sheet along a seeded jagged seam. The two halves leave in
opposite directions with a slight rotation and the world is behind them.

**Nothing is gated behind it.** The case study is real DOM underneath; the tear can
fail and the world still opens. Reduced motion skips straight to the world.

## 6. The worlds

Each case study renders a hero generated from **that project's own material**. This is
the creative system and the part that cannot be copied off a reference board.

| Project | Its world |
|---|---|
| BeatMind | Stem envelopes, four lanes, a playhead |
| Vivid | Diffusion resolving a frame over 28 steps |
| BeatMind / Order Supervisor | A run trace with the failed stage and its retry drawn |
| MedRAG | An embedding space that cites, then refuses |
| Tathya | Sources settling into case files |
| QueryPilot | Query → AST → critic → SQL, as a correction loop |
| UPI Fraud | Score distribution with the alert budget as a moving line |
| SecondSelf | A pipeline that stops at a review queue and waits |
| OncoVerse | The 3D atlas, one rotating region |
| Spur Chat | A token stream scoped to a catalogue |
| Fraud Risk Intel | Reconstruction error against the anomaly boundary |
| Oracle Auto Provision | A cron heartbeat and the retry that landed |

**A project with no world yet says so** and shows a held slot. An empty slot beats a
mocked-up one.

🔴 **The rule that stops this becoming v1: no world is ever a control.** Nothing is
clicked through it, no content lives inside it, no legend explains it. Delete every
canvas and a complete set of readable case studies remains.

## 7. Tokens

**Frame:** paper `#EAE3D5`, ink `#1A1613`, secondary `#4E463C`, quiet `#6B6153`,
oxblood `#8E2116`.
**Worlds:** void `#0B0C0E`, rule `#262A2F`, ink `#F2F3F0`. Accents come from the
product, never chosen — BeatMind's four stem colours are BeatMind's own.

**Type, three faces, three jobs:**
- **Bricolage Grotesque** — display. Has a designer's hand in it at 90px; Inter does not.
- **Archivo** — body and UI. Its width axis carries hierarchy alongside size.
- **DM Mono** — numbers, dates, stack, labels. Never body copy.

Rag paper + heavy grotesk + oxblood is a **printer's** register. Cream paper with a
high-contrast serif and a terracotta accent is the exact combination the anti-slop
research flags as the current generated default, so it is avoided on purpose.

**Banned:** Inter, Geist Mono, gradient headlines, italic headings, a letter in a
coloured box as a logo, `transition: all`, animating anything but transform and
opacity, a section headline reaching hero scale.

## 8. Motion budget

| Moment | Value |
|---|---|
| The tear | 900ms, `cubic-bezier(.3,.05,.2,1)`. The only heavy motion |
| Backlight | 460ms |
| Ink bleed | 620ms |
| Arrival settle | 1000ms once, then 62ms per entry |
| UI feedback | 150–250ms. Longer needs a reason |
| Worlds | Canvas, 30fps ceiling, paused off-screen and on hidden tabs |

One clock. Reduced motion gets the **final frame** of every world and no tear.

## 9. Build order

Ships before it is decorated. That ordering is what makes the worlds safe.

1. Seven routes as static HTML, real copy, no canvas. Gate: `curl` every route.
2. The register and twelve case shells written out. Gate: ten-second test, 4 of 5.
3. **Ship it live.** Domain cutover, v1 redirected.
4. The tear, in one commit. Gate: `git revert` leaves a working site.
5. The worlds, one commit each, flagships first. Gate: each reverts alone.

## 10. Still open

- The ten-second test has never been run. It gates step 2.
- BeatMind's figures conflict: 19/194/27,000 in `parth-os/RESUME.md` against
  24/307/~30,500 in its case study. Settle to one number before any of them ship.
- Seven projects have no capture. Not a blocker: worlds are generated, not photographed.
- Vivid's existing capture is an empty state and QueryPilot's is a Swagger page.
  Both want re-shooting whenever the capture pass happens.

---

## 11. Corrections, 2026-08-27

Four faults found by the owner on the first sheet. Recorded here rather than quietly
fixed, because each one came from me over-committing to a shape nobody asked for.

**The seven routes are not on the landing.** §3 specifies them and the sheet ships an
index and one action. There is no nav, no `/about`, no `/hire`, no `/resume`, no
`/notes`. A visitor cannot reach five of the seven routes. This is the largest gap.

**The sheet does not scroll, and there was no reason for it.** I held the landing to a
single fixed viewport with the index scrolling inside it, and defended that shape
across three iterations. The owner never asked for it. **The landing scrolls.** That
unlocks everything below.

**There is no flow, and no person in it.** A landing page is not an index. A visitor
arrives, works out who this is, what he is about, what he has built, why to believe
it, and how to start. The sheet does the fourth of those and skips the rest. There is
currently no element about Parth on it at all.

**The stock still reads as generated.** A canvas fibre tile plus CSS staining is a
convincing texture and not a convincing photograph. The fix is a real scanned sheet,
embedded, with the procedural layer kept only for the parts that must respond to
hover. Owner's call and it is the right one.

### What this changes

- §4 is a description of the **sheet as a material**, and it stands. It is no longer a
  description of the whole landing page.
- The landing becomes a scrolling document **printed on that stock**: arrival, the
  person, the work index, the proof, the way in. The routes live in persistent chrome
  at the top and in the close.
- Content gets decided before the next build. `DECISIONS.md` §2 has been open since the
  register was written and it is now the blocking item, not the design.
