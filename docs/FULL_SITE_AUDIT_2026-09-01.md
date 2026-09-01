# Full site audit — 2026-09-01

A visual and strategic review of the whole portfolio: every route at 390 / 800 / 1440,
the landing unroll intro, and the two standalone worlds. Requested by the owner alongside a
concrete commercial goal: **earn at least ₹1,00,000 in the next 30 days** and understand how
much the site can help.

This document is a review, not a phase. No source, plan checkbox or gate state changed.

## How this was produced

- Killed the two running Astro servers (`dev` on 4323, `preview` on 4325).
- Fresh `npm run build` (28 pages, clean), then `astro preview` on `127.0.0.1:4321` for
  captures and a fresh `astro dev` on `127.0.0.1:4322` for the owner.
- New reusable script `scripts/audit-capture.mjs` (uses `scripts/browser.mjs`): every route
  full-page + segmented scroll at the three review widths, the unroll intro as a frame
  sequence, and both `design/directions/*-world.html` studies as scroll sequences plus their
  reduced-motion and no-JS states.
- ~300 screenshots in `.shots/full-audit-2026-09-01/`. `report.json` there has the machine
  results: **0 layout overflow and 0 console errors across 19 routes × 3 widths.**

---

## 0. The one-paragraph verdict

**Local correction after this audit, 2026-09-01.** P0 items 1–4 are now implemented in the
working branch: the home register links every published case study and leaves the two
deferred utilities static; owner-only Phase 2 copy is removed; the mobile arrival scale and
copy are reduced with the goal of bringing its doors into the first viewport; and every emitted HTML page receives
canonical, Open Graph, Twitter, JSON-LD, favicon and RSS discovery metadata. The build now
emits a real 404, twelve-entry RSS feed and a generated 28-route sitemap. These changes pass
the local static gate but still require rendered owner review. P0 item 5, preview deployment,
remains open.

The concept is right and the content is genuinely strong. The execution has one systemic
problem — the type-and-space system is scaled for a three-page art object, not a
twenty-page technical portfolio — which makes the site read as loud and empty rather than
premium. As a passive lead generator in 30 days it will do almost nothing: the full site is
not deployed, shared links have no preview card, the mobile hero buries the call to action,
and the homepage project list is not even clickable. As a credibility asset behind active
outreach, once shipped, it is well ahead of almost any 22-year-old's portfolio. **The lakh
comes from outbound effort in the next 30 days; the site's job is to not lose the deal after
the first reply.** Fix five things, deploy, and start sending links.

---

## 1. The 30-day / ₹1 lakh question

### Can the site generate leads on its own in 30 days? No.

| Blocker | Detail |
|---|---|
| Not deployed | Only `/` is live (`parth-tiwari-1.vercel.app`). `/work`, every case study, `/hire`, `/about`, `/resume` are built but not public. There is nowhere to send anyone for depth. |
| No share preview | The landing `<head>` has charset, viewport, description, title — and nothing else. No Open Graph, no Twitter card, no `og.png` (the file does not exist), no canonical, no JSON-LD, no favicon. Every link pasted into WhatsApp / LinkedIn / email renders as a bare, broken-looking URL. This alone halves outreach click-through. |
| No SEO surface | `sitemap.xml` lists only `/`. A brand-new domain will not rank in 30 days regardless, so organic is not a 30-day channel anyway. |
| Mobile hero hides the CTA | The 15-word H1 at `14vw` is ~9 lines on a 390px phone — the two doors and any proof cue are entirely below the fold. The primary audience (founders on phones, per `PRD.md`) may bounce before seeing "Start a project". |
| Dead primary affordance | The homepage project list rows are `<li tabindex="0">` with **no link**. They have hover backlight, an `↗` arrow and "open the world" text, but clicking BeatMind does nothing. The one action a curious visitor wants is inert. |
| Promise gap | The hero says "Pick a project, enter its world" — there are no worlds in production and the list is not clickable. |

### As a conversion asset behind outreach, once shipped: yes, strongly.

The case studies are the differentiator. "Here is the architecture through four system
boundaries, here is the measurement with its denominator and verification date, here is the
oxblood section on the four things that broke" is a posture that reads as seniority. Almost
no early-career portfolio has it. A cold email to a founder with a link to the *one* case
study that matches their problem will out-convert 95% of peers.

### What the 30 days should actually look like

1. **Days 1–5:** finish and deploy the complete static site to the preview alias. Fix the
   five P0 items in §3. Add `og.png`, favicon, canonical, Person JSON-LD. Pick one business
   email.
2. **Days 1–30:** outbound, 5–10 personalised touches per day — founders with a real AI
   need, "who wants X built" / "who's hiring" threads, roles that fit. Every message links a
   *specific* case study, not the homepage. Track every reply.
3. **Day ~10:** run the real five-person ten-second test on the deployed site (still never
   done; it gates Phase 3). Fix what it surfaces.
4. The design polish in §2 and the worlds in §6 matter for the six-month trajectory, **not
   the 30-day number.** Do not let a redesign block outreach.

₹1L in 30 days ≈ one focused build engagement or two small automations. That is found by
effort, with this site as the thing that makes the "yes" safe.

---

## 2. What is feeling off — the core diagnosis

**The type-and-space system is calibrated for a 3-page monograph. The content is a
20-page technical portfolio. The mismatch is what makes the site feel loud and empty.**

Evidence from the stylesheets:

| Token | Value | Rendered |
|---|---|---|
| `.case-masthead h1` | `clamp(5.5rem, 10vw, 11.5rem)` | up to **184px** |
| `.case-chapter h2` | `clamp(3.4rem, 6vw, 6.8rem)` | up to 109px |
| `.hire-arrival h1` | `clamp(5rem, 9.2vw, 10rem)` | up to 160px |
| `.notes-intro h1` | `clamp(4.8rem, 8vw, 9rem)` | up to 144px |
| `.arrival h1` (home) | `clamp(4rem, 5.5vw, 6.2rem)` on a 15-word sentence | ~99px, 6 lines |
| `.case-chapter` padding | `clamp(6rem, 10vw, 10rem)` top+bottom | up to 160px per chapter |
| mobile `.case-chapter h2` | `clamp(2.9rem, 13.5vw, 4.4rem)` + `overflow-wrap: anywhere` | can break mid-word |

Consequences visible in the captures:

- The MedRAG erratum (`.shots/.../routes/notes-medrag/desktop-1440-full.png`) is ~800 words
  over 3,300px of page. There is far more empty paper than text. It reads as "content did
  not load," not "editorial restraint."
- Every section on every page is `[tiny mono label] + [enormous headline that is ~40% of the
  section] + [content pushed down/right] + [acres of paper]`.
- The homepage is ~6,800px on desktop for seven short sections.
- The asymmetric label→heading split strands the tiny mono label far left with the giant
  heading far right and nothing between — the eye cannot connect them (`resume`, `about`,
  note articles all show this).

**This is fixable with a token diff, not a redesign:**

- Cut display sizes ~30–40%. Suggested: home/section H1 `clamp(2.6rem, 5.5vw, 4.6rem)`;
  section H2 `clamp(1.9rem, 3.6vw, 3rem)`; case masthead H1 `clamp(3rem, 6vw, 5.5rem)`.
- Cut section vertical padding ~35–40%.
- Clamp mobile `vw` units hard: hero H1 `clamp(2rem, 7.5vw, 2.9rem)`, and shorten the
  sentence or split it so the doors are guaranteed in viewport 1.
- Add a real body/list text step so ledgers and lists are not tiny relative to headings.
- Fix the stranded-label pattern: label directly above its heading, or a hairline that
  connects them.
- Re-shoot the 24-render matrix and re-run the Phase 2 gate after.

Secondary contributors to "off":

- The paper texture is a repeating tile; the huge empty fields expose the repeat, so it
  reads "background image" not "one continuous sheet."
- Decorative red ink marks (`.ink-print`, `.about-beat::after` marginalia) render as stray
  smudges beside the nav, not intentional seals.
- `.finish-seal` in the footer renders as an **empty oxblood square outline** — looks like a
  broken image.
- The footer prints `Paper and Worlds / Bengaluru`, surfacing the internal design-system
  codename as a public tagline. `DECISIONS.md` is explicit that the public brand is *Parth
  Tiwari* and "Paper and Worlds" is internal only.

---

## 3. Bug and weakness list, prioritised

### P0 — fix before sending anyone the link

| # | Item | Fix |
|---|---|---|
| 1 | Homepage project rows are not links (`<li tabindex="0">`, no `<a>`). Dead affordance on the primary content. | Wrap each published-project row in `<a href="/work/[slug]/">`; make deferred rows non-focusable and drop the arrow. |
| 2 | `/work` ships owner scaffolding copy: eyebrow "The complete register / Phase 2 review" and footer "This is a Phase 2 architecture demo. Complete case-study routes arrive in Phase 3." | Replace with real visitor copy. Grep the build for "Phase 2" / "architecture demo" before deploy. |
| 3 | Mobile hero buries the doors (15-word H1 at `14vw` ≈ 9 lines). | Shorten the sentence and/or cut mobile display size; guarantee both doors + one proof cue in viewport 1. |
| 4 | Landing `<head>` has no OG / Twitter / canonical / JSON-LD / favicon; `og.png` does not exist. | Add them. Generate a real `og.png`. Pull this forward from the Phase 3 gate. |
| 5 | Full site not deployed — only `/` is live. | Finish Phase 3, deploy the complete static site to the preview alias. |

### P1 — the polish pass

| # | Item |
|---|---|
| 6 | Global type scale + section padding too large (see §2). Token diff. |
| 7 | `parth-portrait-drawn-phase2-768.png` is **849 KB** on the landing (highest-traffic page). Optimise to <150 KB or use the real photo. |
| 8 | Homepage uses the stiff hand-drawn portrait; the real, warmer photo of Parth is buried on `/about`. Swap, or at least use the real photo on the homepage. |
| 9 | Mobile `featured-world` plate: the 3-cell grammar overlay covers most of the image and reads as a broken dropdown; "A song enters whole" is clipped. Redesign the mobile plate. |
| 10 | Mobile `.quiet-proof p { display: none }` leaves bare numbers "97.2s to 56.5s", "63 to 67 of 70" with zero context. Show a one-line caption or drop the numbers on mobile. |
| 11 | Proof numbers wrap awkwardly ("63 to 67 of / 70", "97.2s to / 56.5s"). `text-wrap: nowrap` / smaller / shorter display strings. |
| 12 | `SITE_NAME = 'EPHEMERIS'` in `src/config/site.ts` — retired brand, unused, a landmine. Delete it (and the stale `index.html` comment block in that file). |
| 13 | `.env.example` contains a real Google Drive resume URL. Replace with a placeholder. |
| 14 | `sitemap.xml` is hand-written and lists only `/`. Generate from routes before the full site is public. |
| 15 | `design/directions/beatmind-world.html` has a hardcoded `http://127.0.0.1:4322/work/beatmind/` link. Make it relative. |
| 16 | 12 non-interactive `<li tabindex="0">` focus stops on the landing register. Remove `tabindex` from non-links. |
| 17 | Footer tagline "Paper and Worlds / Bengaluru" surfaces the internal codename. |
| 18 | `.finish-seal` and decorative ink marks render as stray / broken-looking smudges. |
| 19 | Homepage has ~400px dead zones between sections (falls out of §2's padding fix). |

### P2 — later

| # | Item |
|---|---|
| 20 | No `404.html`, no RSS (Phase 3 gate). |
| 21 | Case-study "diagrams" are 4-box lists — they satisfy the contract but do not show the real mechanism (fencing tokens, retry path, the critic loop). |
| 22 | All 12 errata evidence rows say "1 internally audited source" — no public artifact link on a single one. The trust surface rests entirely on "trust me." Add a real commit / diff / eval link where safe. |
| 23 | Two contact emails float around (`parth.secondself@`, `parthti2003@`, `CONTACT_EMAIL`). Pick the business one and use it everywhere. |
| 24 | `/hire` on mobile: contact actions sit below the headline + note card. The sticky "Start a project" button on `/hire` links to `/hire` (no-op). |
| 25 | Vivid world ending CTA goes to `/work/` ("Return to the work register"); BeatMind's goes to the case study ("Read the full case study"). Make Vivid's point at `/work/vivid/`. |

### What is already good — keep it

- **0 overflow, 0 console errors** across 19 routes × 3 widths. The responsive engineering is solid.
- Content: real numbers with denominators, honest failure sections, no invented proof. This is the differentiator.
- The case-study template — sticky chapter rail, proof strip, oxblood "what broke" block, previous/next — is a strong, repeatable system.
- Accessibility fundamentals: skip links, visible focus rings, reduced-motion final states, complete no-JS reading order.
- The two worlds (§6) are a genuine "wow."

---

## 4. The concept — is it right?

Mostly yes.

**What is right**

- **"Paper and Worlds"** is a strong organizing idea: a calm readable document as the shared
  frame, each project free to abandon it for its own visual language. It fixes v1's failure
  (the metaphor became the information architecture).
- **The evidence thesis** — every number carries its denominator, every case study has a red
  "what broke" section — is the real product. Keep it dead centre.
- **No invented proof.** Rare and correct.
- **The worlds** are where the identity and the "wow" live.

**What is risky or unresolved**

- **Art object vs. hire-me.** The current execution leans art object — huge type, acres of
  space, a loading curtain, a hand-drawn portrait — at the cost of "this person will build
  my thing and it will hold up." For the stated primary goal (paid client work) the *paper*
  should feel like a capable studio; let the *worlds* be the art.
- **The headline voice.** "I build AI products, break them, fix them…" reads as rigour to an
  engineer and as "ships bugs" to a founder. Consider leading with the outcome ("AI products
  that hold up after the demo") and keeping "break them, fix them, write it down" as line two.
- **The promise gap.** The homepage promises an experience ("enter its world") that is not in
  production and a list that is not clickable. Until worlds ship, the copy should describe
  what is actually there (a still frame and a written case study).
- **Paper overhead.** Torn edges everywhere, fibre spans, ink smudges, a finish seal, an
  unroll intro — a lot of "paper cost" for little payoff, and several pieces render as
  artifacts. Dial the texture back to *excellent stock + one real deckle edge + great type*,
  and move the craft budget to the worlds.

---

## 5. The unroll / loading animation

**Current:** a beige sheet expands vertically from a centre line to full height on black,
~0.9s, with top/bottom creases, a light sweep and a mono line "A working record, unrolled,"
then the black overlay holds to ~1.25s and fades by 1.65s. CSS-only; reduced-motion skips it.

**Critique**

- It reads as a letterbox opening / a blind being raised — **not a scroll unrolling.** No
  spindle, no curl, no leading edge. (Literal cylinders were rejected, correctly, but the
  abstract result loses the manuscript feeling entirely.)
- It **delays the headline** by up to ~1.5s for zero information. `DESIGN_LOCK.md` §9 says
  arrival motion "never delays reading." This does.
- On mobile / slow connections the first beat is a near-black screen with a thin line and
  tiny text — momentarily looks like an error state, and the paper texture may not have
  loaded so the "sheet" is a flat fill.
- The label is too small and too fast to read.
- It does no *work* — it is a curtain, then a content swap.

**How to make it better — pick one**

**A. Fast, and reveal instead of cover (recommended, low effort).**
- Cap the whole thing at ~450–550ms.
- The sheet unrolls **from the top downward** (`transform-origin: top; scaleY(0)→1`, a soft
  leading drop-shadow, a 2–4px darker leading-edge line). That reads as a scroll.
- The hero content is **printed on the sheet** and revealed line by line by the advancing
  bottom edge (clip/mask): eyebrow → headline → doors. The animation *is* the arrival.
- Never blocks: if `paper-stock.jpg` is not decoded within ~200ms, snap to the final state.
- Keep the mono line, or promote "A working record" to the permanent eyebrow.

**B. Sumi-e brush gesture (fits the Japanese direction, see §7).**
- Replace the light sweep with a single confident **ink downstroke** that draws the left
  deckle edge / a vertical rule; the sheet wipes in behind the wet leading edge of the
  stroke. One gesture, ~600ms, ends on a settled frame.

**C. If a real "curtain" is wanted:** a genuine paper unroll — thin cylinder shadow at the
top, the sheet dropping with a subtle `perspective` curl at the leading edge that flattens
as it settles, ~700ms. More work, closer to the rejected cylinder — only if the owner wants
it overt.

**Regardless of direction: the intro must not hold a black overlay over a readable
headline.** Fix that first.

---

## 6. The two worlds

Both are in `design/directions/` as standalone studies — **not in the production site.**
Both carry visible scaffolding ("PHASE 2 ANIMATIC" / "REVIEW ANIMATIC · NATIVE SCROLL
ONLY"). Both are a large quality jump over the paper pages.

### 6.1 BeatMind — Sound Foundry

**Strengths.** The circular → linear waveform is a genuinely distinctive graphic. The five
stem lanes and the run trace are drawn on canvas from real BeatMind beat data. Clear
nine-scene arc (whole → separate → worker loss → recover → analyse → arrange → mix → render
→ deep-dive). Borderless cinematic type. The opening frame (circular oscilloscope ring with
"A song enters whole." inside it) is the best single frame in the whole project.

**Problems.**
- **Text / graphic collision in almost every scene.** The `.scene-copy` radial-gradient
  backdrop is not strong enough; headings sit directly on waveforms and on the readout
  labels. `desktop-1440-seg04` ("The job does not disappear with it.") and `seg15` are the
  worst.
- **Scaffolding baked into the canvas** — "REAL TRACE REQUIRED BEFORE PRODUCTION",
  "WORKER LOST", and the top-bar "PHASE 2 ANIMATIC".
- **The failure / retry trace is a placeholder.** `WORLDS.md` calls the run trace "the most
  distinctive single graphic on the whole site" — and it currently has no real durations.
- The ending CTA ("Read the full case study") is a thin outlined box on a busy field — weak
  for the world's single most important action.
- The decorative "foundry plate" background photos are so dark they add noise, not
  atmosphere.

**How to improve.**
1. Give scene copy a real containing surface (a consistent dark scrim panel, or a fixed
   left/right gutter the graphic never enters). Solve collision once.
2. Export a **real** job trace from BeatMind (8 stages, real ms, the failed `separate`, the
   worker loss, the retry that lands) to JSON at build time and draw it. This is the money
   shot.
3. Make the ending a full-bleed dark card with the waveform behind and **one large oxblood
   CTA**.
4. Blur or drop the foundry photo plates; let the canvas carry it.
5. Strip all "PHASE 2 ANIMATIC" text before it is a production world.

### 6.2 Vivid — Story Loom

**Strengths.** The real character-consistency evaluation shots (Kyoto ceramicist — 01
establish / 02 enter / 03 shape / 04 resolve) are compelling *real* evidence; the same
person is believable across four different compositions. The ending frame (`seg15`) and the
no-JS fallback are clean.

**Problems.**
- **The central graphic is decorative AI concept art**, not project data. This breaks the
  `WORLDS.md` rule ("the graphic is drawn from that project's own material") harder than
  BeatMind does. It is a pretty wallpaper with real photos layered on top.
- **Layout collision bug in the "Generate" scene** (`desktop-1440-seg07`): the narration box
  covers shot cards 01 and 02, and the caption "These foreground frames come from a real
  local Vivid evaluation run" runs across both — making the two cards *and* the caption
  unreadable. That scene is the whole point (seeing identity hold across shots).
- Multiple overlapping copies of shot imagery (concept-art frames + real cards + background
  rows) make some frames visually chaotic.
- Border-box narration is more generic than BeatMind's borderless type.
- Ending CTA only returns to `/work/`.

**How to improve.**
1. Rebuild the graphic around the **real contact sheet**: the neutral character anchor on
   one side, the four real shots resolving in sequence, and the failed "pixel-chained"
   comparison as the turn. Reduce the loom concept art to a faint texture, or cut it.
2. Fix the collision — narration and the shot stack need non-overlapping zones.
3. Make "faster was worse" (the rejected Turbo run: 5.9× faster, identity and text-scene
   regressed) a real side-by-side. That erratum is one of the strongest on the site.
4. Point the ending CTA at `/work/vivid/`.

### 6.3 Principles for worlds 3–12 (and to retrofit into 1–2)

1. **The graphic is the data.** BeatMind is the model. Vivid drifted. If a world's central
   graphic is not drawn from a JSON export of real project numbers, it is a held slot, not a
   world.
2. **One reserved text zone the graphic never enters** — solved once, in the shared world
   lifecycle, not per world.
3. **One accent from the product, one oxblood failure mark.** Already the rule; enforce it.
4. **The failure scene is the spine.** MedRAG's refusal, QueryPilot's critic rejection,
   UPI's moving threshold, SecondSelf's review queue that visibly waits — each world's turn
   is a real limitation shown honestly.
5. **The ending is one big action, not a link.** Full-bleed, one oxblood CTA into the paper
   case study.
6. **Build three (BeatMind real trace, Vivid contact sheet, Tathya clustering) as Wave A
   before touching the rest.** Do not spread thin.
7. **Ship the shared world lifecycle first** — clock, visibility pause, reduced-motion final
   frame, no-JS narration, the reserved text zone. This is Phase 5 as planned.
8. **Worlds are Phase 5–6.** Until one ships, the homepage must not promise "enter its
   world." Restore the promise when the first world is live.

---

## 7. The Japanese / anime direction

`DECISIONS.md` (2026-08-29) already ruled: *"Japanese references contribute restraint and
pacing only — Ma, material light and reveal order — Rejected: Japanese script, symbols or
ornamental iconography."* The Vivid world audit separately removed the old anime / watercolour
LoRAs as non-current and forbade presenting them as a capability.

There are two different things "a more Japanese anime theme" could mean:

**1. Anime as ornament** — cel-shaded characters, speed lines, sakura, katakana, glowing UI,
a mascot. This breaks the design lock and, more to the point, works *against* the goal. The
site's entire thesis is sober evidence and honest failure. Anime styling on top of that
reads as a fan project, and for a founder deciding whether to trust you with ₹1L it is a
trust *cost*. **Recommendation: do not theme the site anime.**

**2. Japanese as discipline** — which the repo already chose and has not finished executing.
This is the good version and it is compatible with everything:

- **Ma used with intent.** Right now the negative space is *uncontrolled* — it is huge
  because the type is huge. Real ma is composed: a small, precisely placed element in a
  large calm field. Fix the type scale (§2) first, then place things deliberately.
- **Material light.** One soft light source, one directional shadow, no procedural noise.
  Reduce the paper "stuff" to one or two exquisitely done moments.
- **Reveal order (jo-ha-kyū).** A deliberate slow–fast–slow arrival rhythm — the unroll
  intro is where this belongs, as one calm gesture.
- **One brush gesture as the signature.** A single sumi-e downstroke for the intro, section
  dividers and the deckle edge — decisive, imperfect, done once. This is the one manga /
  anime borrow that fits: the confident single ink line. Not screentone, not speed lines.
- **The hanko (seal).** Oxblood as a seal accent is already a Japanese move — execute it
  properly (it currently renders as an empty red box).
- **Vertical meta labels.** The BeatMind world's vertical `INPUT / SEPARATE / MAP / RENDER`
  spine already does a tategaki nod well; the tiny mono labels elsewhere could borrow it.
- **Worlds may go further, per project, when the product's assets justify it.** A world is
  allowed its own language. Vivid is the obvious candidate for a manga-panel / ukiyo-e /
  anime-cel treatment — **only once real anime-style Vivid outputs exist** (they do not yet).

**Recommendation.** Do not theme the site anime. *Finish* the Japanese-restraint direction
the repo already committed to — it is half-done, and the §2 type/space fix is most of it.
Add exactly one overt brush-gesture signature. Quarantine any louder anime expression inside
individual worlds where the product's own assets justify it, and record that boundary in
`DESIGN_LOCK.md`.

---

## 8. The plan

Anchored to the existing phase structure (mid Phase 3B: the case-study batch is built, owner
review + the two deferred projects + the Phase 3 gate are open).

### Track 1 — Ship and earn (next 30 days; runs in parallel with everything)

- **Days 1–5:** finish Phase 3 static site → deploy to the preview alias. Fix P0 items 1–5.
  Add `og.png` + favicon + canonical + Person JSON-LD. Choose one business email; add a
  "what to send me" line to `/hire`.
- **Days 1–30:** outbound — 5–10 personalised touches/day, each linking a *specific* case
  study. Log every reply.
- **Day ~10:** run the real five-person ten-second test on the deployed site. Fix what it
  surfaces. Record it in `TEN_SECOND_TEST.md` (Round 2).
- The lakh comes from this track.

### Track 2 — Craft pass (weeks 2–5; does not block Track 1)

- Type + space token diff (§2). One revertable PR. Re-shoot the 24-render matrix, re-run the
  Phase 2 gate.
- Portrait: optimise or swap to the real photo on the homepage.
- Remove dead paper decoration (stray ink marks, broken seal); keep one deckle edge + good
  stock.
- Rework the mobile `featured-world` plate and the mobile proof strip.
- New intro animation (direction A or B from §5).
- Housekeeping: footer tagline, `SITE_NAME`, `.env.example`, sitemap generation.

### Track 3 — Worlds (Phase 4 → 5 → 6, per the build plan)

- Phase 4: paper signature + tear (as planned).
- Phase 5: ship the shared world lifecycle including the reserved text zone; BeatMind pilot
  with a **real** exported job trace.
- Phase 6 Wave A: Vivid (real contact-sheet rebuild + collision fix), Tathya.
- Retrofit the collision / scaffolding fixes into the two existing studies.
- Keep the homepage copy honest about worlds until the first one is live.

### Track 4 — Finish the Japanese-restraint direction (folded into Track 2)

- The type/space fix is most of it.
- Add the single brush-gesture signature (intro + dividers + deckle).
- Execute the hanko seal properly.
- Add to `DESIGN_LOCK.md`: "anime expression is per-world and asset-gated."

---

## 9. Evidence index

- `.shots/full-audit-2026-09-01/routes/<slug>/` — `<width>-full.png` for every route;
  `<width>-segNN.png` for home, work, the two flagship case studies, notes, about, resume,
  hire.
- `.shots/full-audit-2026-09-01/unfurl/` — the intro as `desktop-1440-tNNNN.png` /
  `phone-390-tNNNN.png` and `-navfold-` frames.
- `.shots/full-audit-2026-09-01/worlds/beatmind-sound-foundry/` and `/vivid-story-loom/` —
  scroll sequences plus `-reduced` and `-nojs`.
- `.shots/full-audit-2026-09-01/report.json` — per-capture status, overflow, console errors.
- `scripts/audit-capture.mjs` — rerun with `node scripts/audit-capture.mjs --base <url>
  --tag <name>` (optionally `--only routes|unfurl|worlds`).
