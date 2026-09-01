# Decision ledger

Revised 2026-08-29. This file contains current decisions and the reason each one exists.
It is not an open questionnaire. Historical v1 reasoning remains in the superseded docs.

When this file and `DESIGN_LOCK.md` disagree, the design lock wins and this file is fixed
in the same commit.

## Status vocabulary

- **Decided:** implementation may rely on it.
- **Owner review:** a named choice is required before its phase proceeds.
- **Evidence blocked:** the direction is known but publication needs proof.
- **Deferred:** deliberately scheduled after launch.

## Product and brand

| Decision | Status | Reason | Rejected or bounded alternative |
|---|---|---|---|
| Public brand is **Parth Tiwari** | Decided | A portfolio should make the person legible immediately | Paper and Worlds as a public studio name |
| **Paper and Worlds** is the internal design-system name | Decided | It names the organizing idea without hard-coding a project count | “Twelve Worlds” and EPHEMERIS |
| Primary goal is qualified paid-project conversations; employment is secondary | Decided | A strong client case also serves employers, while a CV-first site underserves clients | Recruiter-only portfolio |
| No invented proof | Decided | Trust is the product | Placeholder testimonials, client logos and round user counts |

## Information architecture

| Decision | Status | Reason | Rejected or bounded alternative |
|---|---|---|---|
| Eight route families | Decided | Clients and employers need different depths, and notes need durable article URLs | One-page SPA |
| First viewport has **See the work** and **Start a project** | Decided | One door for employer depth and one for client conversion | Three equal primary CTAs |
| `/notes` contains Errata and Posts | Decided | One publishing system avoids a duplicate blog taxonomy | Separate `/blog` route |
| Every note has `/notes/[slug]` | Decided | Full pages are linkable, crawlable and suitable for future publishing | Modal or accordion-only articles |
| Posts may say “Coming soon” at launch | Decided | Honest absence is better than filler | Invented launch posts or an empty nav destination |
| Experience lives on About and Resume | Decided | One human narrative and one structured employment record cover the need without duplication | Separate `/experience` route |
| About balances education and work in one chronology | Owner decided 2026-08-30 | Both changed what the owner could build next; neither should read as a footnote | A work-only biography or a second ATS resume |
| About uses a casual first-person voice and the real candid portrait | Owner decided 2026-08-30 | The page is the human check, while Resume owns formal parsing | Corporate third-person biography and generic values cards |
| Resume is semantic HTML backed by current verified records | Owner decided 2026-08-30 | Recruiters, crawlers and assistive technology need a real page; project numbers must follow the current evidence collection | A PDF viewer as the page or copying stale numbers from the supplied artifact |
| Resume B remains the unchanged local download | Owner decided 2026-08-30 | The owner named this artifact as the resume source; preserving its bytes keeps the handoff exact | Re-exporting or silently rewriting the supplied PDF |
| Google Drive is an optional external resume link | Owner decided 2026-08-30 | A public env-configured link can point to a later copy without making the static HTML or local download depend on Google | Drive embed, build-time download, API key or required runtime fetch |
| Hire uses service scope, risk-first process, explicit fit and direct contact | Owner review 2026-08-31 | The route should qualify a real conversation without manufacturing trust or requiring a polished brief | Pricing table, long inquiry form, testimonials, client logos and fake urgency |
| Work register may sort by recency and running status | Decided | Those fields have stable meanings | Unexplained novelty filters |
| Work may sort by qualitative build effort | Decided | `flagship`, `substantial` and `focused` communicate scope without inventing hours or money | A misleading cost control |
| Work has no Personal/Company split | Owner decided 2026-08-29 | The owner's flexible employment context makes a binary register taxonomy reductive; projects should be compared by the work itself | Ownership filters and company badges on every row |
| Verified employment context belongs inside a case study | Decided | Role, organization and contribution need project-specific explanation and publication permission | Inferring ownership from repository location or adding an unsourced global label |
| Fraud Risk Intelligence and Oracle Auto Provision stay in the register as focused work | Owner confirmed after review 2026-09-01 | Fraud Risk shows the earlier reproducible modelling and explanation layer before UPI's operational alert-budget system; Oracle is a small self-use automation with safe retry and duplicate-guard lessons | Removing smaller work solely to shorten the register or presenting either as flagship work |

## Landing and paper

| Decision | Status | Reason | Rejected or bounded alternative |
|---|---|---|---|
| One continuous scrolling rag-paper document | Decided | It supports a growing archive and keeps content readable without effects | Fixed viewport with an internally scrolling index |
| Use the real prepared paper stock | Decided | Procedural texture alone read as generated | CSS-only paper |
| Home includes every project in a simple editorial index | Decided | Every project remains an entry on the paper; `/work` owns exhaustive comparison and controls | Showing only selected work |
| A featured world may sit behind the first viewport | Decided with phase boundary | A still can enrich Phase 3; motion waits for the shared world system | A live canvas required for comprehension |
| Oxblood stays role-bound | Decided | Rare color makes the action and bleed meaningful | Accent used as general decoration |
| Scroll ends use broad paper folds, not parchment cylinders | Owner-approved refinement direction | The folds must belong to the site's rag-paper system rather than resemble the supplied reference image | Brown rolled rods and a traced reference silhouette |
| Arrival has no persistent navigation | Owner decided 2026-08-28 | The headline and two doors need to read as the complete first arrival | A paper nav visible before the hero |
| Navigation unfolds after the hero and then sticks | Owner decided 2026-08-28 | The fold becomes a continuation of the sheet instead of chrome placed above it | A permanently visible top roll |
| Edge damage uses stable generated fibre segments | Owner-approved refinement direction | Three distinct transparent profiles per side avoid a page-height repeating polygon and remain identical between reloads | Random damage per load and one stretched sawtooth |
| Japanese references contribute restraint and pacing only | Owner decided 2026-08-29 | Ma, material light and reveal order can sharpen the paper system without turning culture into decoration | Japanese script, symbols or ornamental iconography |
| Landing paper motion is bounded and one-shot | Owner-approved refinement direction | Opening light, sticky-fold shadow and ink settling support continuity, then stop | Infinite ambience and full-sheet grain parallax |
| Hand-made character comes from sparse marginalia and damaged edges | Owner review in Phase 2 | Readable display, body and data typography still has to serve clients, recruiters and assistive technology | Replacing interface copy with handwriting fonts |
| Landing sections are content-driven after the hero | Owner-approved refinement direction | The page should read as one continuous old message, not one empty viewport per section | Forcing every section to fill the screen |
| The first viewport explains **Paper → World → Case study** | Owner refinement 2026-08-30 | The headline says what Parth builds; the supporting sentence and contained BeatMind plate must also explain what this portfolio is and how to use it | A product screenshot whose relationship to the portfolio is implicit |

## Preview and tear

| Decision | Status | Reason | Rejected or bounded alternative |
|---|---|---|---|
| Entry preview uses the project's approved world still first | Decided | Fast, stable and truthful before animated worlds exist | Starting every canvas on page load |
| Home and `/work` receive the same eventual preview-and-tear behavior | Owner decided 2026-09-01 | Both registers are doors into the same projects and should not teach two interaction grammars | Shipping the enhancement on only one register |
| A real published proof may temporarily stand in when no approved world still exists | Owner decided 2026-09-01 | The fallback keeps the preview truthful while later worlds are still unbuilt; it must be visibly labelled as proof | Generated placeholder worlds, simulated screenshots or an empty black aperture |
| Touch preview follows the centered entry during native scroll | Decided | It provides hover parity without adding a separate mobile interface | Tap-first hover emulation that traps the first tap |
| Tear visualizes navigation to a real route | Decided | Refresh, deep links and accessibility remain correct | Overlay-only world state |
| Production tear uses the Sheet Fault composition | Owner selected 2026-09-01 | The full-sheet opening makes the world-behind-paper idea clearest | Row Rip or Edge Peel as the final material story |
| Sheet Fault production uses two transform-only paper panels plus inert clones of the selected rendered row | Implemented and measured 2026-09-01 | It preserves the approved composition at 16.7-16.8 ms p95 without a full-root snapshot | Shipping the study's janky full-page raster transition |
| Pointer preview dwell is 180 ms and the tactile handoff is capped at 500 ms | Owner decided 2026-09-01 | The preview should feel intentional while navigation remains immediate enough to trust | Instant hover flicker or a decorative transition that delays the route |
| Reduced motion skips the tear | Decided | The destination matters; the transition does not | A shorter but still disruptive tear |

## Worlds

| Decision | Status | Reason | Rejected or bounded alternative |
|---|---|---|---|
| Worlds are scroll-directed case stories | Decided | Scroll can reveal product causality while the DOM remains complete | Independent looping wallpapers |
| A world demonstrates rather than impersonates the product | Decided | Fake editors weaken trust and create inaccessible controls | Rebuilding twelve mini-apps |
| Storyboard approval precedes each implementation | Decided | The owner stays involved and narrative mistakes are cheaper to fix before code | One-shot world generation |
| BeatMind is the pilot | Decided | It exercises audio, stages, measurement, failure, retry and render | Building shared infrastructure inside an arbitrary first world |
| BeatMind's world is the **Sound Foundry** | Owner decided 2026-08-30 | One continuous precision machine keeps every effect attached to BeatMind's waveform, stems, analysis and run state | The first diagram-and-card study, a robot mascot, fantasy world or unrelated effects per scene |
| BeatMind follows the current five-stem product language | Owner decided 2026-08-30 | Current source defines vocals, backing vocals, drums, bass and other; the world should not preserve a stale four-stem specimen | The older four-stem storyboard |
| Generated BeatMind machinery is decorative only | Decided | Atmosphere can be generated, but waveforms, analysis and traces must remain code-drawn from real project data | Generated product screenshots, invented data graphics or simulated evidence |
| BeatMind uses vertical native scroll as its only required input | Owner decided 2026-08-30 | It preserves the continuous foundry descent and composes cleanly for phone without scroll capture | Horizontal traversal, drag, sound gate or mandatory controls |
| BeatMind's world ends before the paper case study | Owner decided 2026-08-30 | The world should remain fully inside its own visual language and offer one explicit deep-dive action | Appending a paper section below the animatic or visually blending both surfaces |
| Optional audio is user-initiated | Decided | Sound can deepen BeatMind without blocking or surprising visitors | Autoplay |
| Project world and paper case study are separate experiences | Owner revised 2026-08-30 | The world demonstrates what the product does and ends with a deep-dive action; the paper explains product, proof, decisions, failures and limits without borrowing the world's page chrome | A dark-world masthead attached to the paper article or one blended surface |
| Case-study desktop navigation combines chapter index and reading progress | Owner selected 2026-08-29 | Long technical stories need orientation without scroll capture | Scroll snapping and a floating table-of-contents panel |
| Phone case studies stack and use only compact sticky reading progress | Owner-directed Phase 2 refinement | The chapter rail disappears, while a short paper strip preserves orientation without covering the argument | Copying the desktop chapter rail onto mobile or removing orientation entirely |
| What broke is an inserted oxblood correction | Owner selected 2026-08-29 | Failure should interrupt the victory narrative rather than look like another feature section | A normal chapter or a second dark-world scene |
| BeatMind audio stays disabled until its excerpt is approved | Evidence blocked | The repository has a screen recording but no standalone licensed or owner-created audio source with publication permission | Extracting or assuming rights to the recording soundtrack |
| Every paper case study follows one evidence contract | Owner decided 2026-08-30 | Employers and clients need a repeatable path through proof, responsibility, research, architecture, trade-offs, failures and limits even though every project world is visually unique | Letting visual novelty erase required evidence or forcing every world into one visual template |
| Paper case-study routes are generated from the validated content contract | Implemented 2026-08-31 | BeatMind, Vivid and later projects should share one readable paper system while their facts, media, headings, architecture and evidence remain project-specific | A hard-coded component or route fork for every continuously changing project |
| Vivid's case study separates current proof from the rebuild target | Implemented 2026-08-31 | The accepted baseline, rejected Turbo arm and current legacy reference path are proven; named reference candidates, identity target and speed target remain gated future work | Writing the current `PLAN.md` target as if it were already achieved |
| BeatMind contribution names Stick and Dot and end-to-end implementation | Owner confirmed 2026-08-30 | Parth states that he designed and built the implementation; founder and early-user feedback shaped refinements; no other person contributed to implementation | Leaving the organization unnamed or implying that user feedback was code contribution |
| One shared world lifecycle | Decided | Prevents orphaned clocks and inconsistent reduced-motion behavior | A separate animation system per world |
| 2D or pre-rendered OncoVerse is the default | Decided | One sitewide Three.js dependency is not justified by one page | Adding Three.js before a measured comparison |

## Content and proof

| Decision | Status | Reason | Rejected or bounded alternative |
|---|---|---|---|
| Claims have source, context, verification date and `asOf` where changeable | Decided | User counts and deployments change | Permanent undated numbers in prose |
| BeatMind's 18 registered-account statement remains unpublished | Evidence blocked | The owner reports the Clerk count, but the supplied screenshot is Vercel Analytics and does not prove it | Calling visitors or remembered signups users |
| Vivid's owner-known lower bound remains unpublished | Evidence blocked | No durable analytics or counting record is attached | Freezing “10+” into prose |
| QueryPilot lift uses the 70-query core denominator | Decided and verified | The artifact separates 70 core and 12 adversarial queries | Saying +5.7pp across all 82 |
| UPI evaluation and replay metrics stay separate | Decided and verified | Different datasets answer different questions | One context-free precision claim |
| Oracle duration and automatic-stop language stay unpublished | Decided after source audit | Retry configuration is visible; uptime is not, and the stop helper lacks its token | Trusting remembered uptime or unwired code |
| No public price anywhere | Owner decided 2026-08-28 | The owner wants scope and fit to lead into a direct conversation | Price bands, starting prices and cost estimates |
| Phase 1 text-only human test is deferred, not passed | Owner decided 2026-08-28 | Five participants are not currently available; blocking visual exploration adds little value | Simulating participants or recording a false pass |

The detailed evidence queue is `CONTENT_PROVENANCE.md`.

## Technical

| Decision | Status | Reason | Rejected or bounded alternative |
|---|---|---|---|
| Astro 7.2.9, exactly pinned in Phase 0 | Decided | Static HTML, typed content and isolated enhancements match the product; the owner approved replacing 6.4.8 after `npm audit` found advisories whose maintained fix is Astro 7 | Floating versions or knowingly starting on the unmaintained, advisory-affected Astro 6 line |
| Static output and strict TypeScript | Decided | Crawlability and content validation should be structural | Client-rendered SPA |
| Astro build-time content collections and `astro/zod` | Decided | Projects and notes need typed, growing content without another direct dependency | Hand-maintained HTML |
| Vanilla CSS | Decided | The visual system is small and bespoke | Tailwind runtime conventions |
| CSS and Web Animations API | Decided | Tear and page motion do not justify GSAP or a smooth-scroll engine | GSAP and Lenis |
| One direct public runtime dependency, `astro` | Decided | Keeps the public architecture legible | Convenience dependencies without a recorded case |
| Static Vercel deployment without an adapter | Decided for initial build | The public site has no server feature | Adapter installed by habit |
| Remove analytics in Phase 0 | Decided | It conflicts with the one-dependency static baseline | Carrying half-configured analytics through the rewrite |
| Reconsider analytics at cutover | Owner review in Phase 7 | Measurement may earn a bounded addition after the real site exists | Treating analytics as permanently forbidden |
| Phase 3 deploys to a preview alias | Decided | The complete static multi-route site needs live review independently of the interim root release | Treating the root-only release as the Phase 3 preview gate |
| Phase 4 may begin under an explicit owner exception while Phase 3 remains open | Owner decided 2026-09-01 | The owner deferred the remaining rendered review and asked to continue; the exception changes work order but does not turn unrun gates into evidence | Reporting Phase 3 as passed, deleting the deferred checks or treating Phase 4 output as their substitute |
| An interim root-only landing may replace v1 during Phase 2 | Owner decided and deployed 2026-08-29 | The reviewed landing is useful now and `parth-tiwari-1.vercel.app` can collect feedback while the remaining route architecture is designed | Reporting Phase 2, Phase 3 or Phase 7 complete because one route is public |
| Complete-site production cutover happens in Phase 7 | Decided with interim exception | Domain, redirects and every route move only after all full-site gates; the Phase 2 release is only the reviewed root landing | Conflating an interim landing with the complete launch |
| Continue directly on local `redesign/v2` after Phase 0 | Owner decided 2026-08-28 | The owner prefers one visible local line of work; phase commits and gates still provide rollback | Creating a new `codex/*` branch for every phase by default |
| The maintained Phase 2 landing stub lives at `/` | Owner decided 2026-08-28 | Refinement happens on the real entry URL without maintaining a second review-mode route | Keeping `/` as a placeholder and duplicating the landing under `/review/phase-2/` |

## Publishing

| Decision | Status | Reason | Rejected or bounded alternative |
|---|---|---|---|
| Git-managed Markdown is the launch authoring workflow | Decided | It is versioned, previewable and requires no public runtime | Building admin before the portfolio |
| Content schemas anticipate an editor | Decided | Projects and notes will continue to grow | Hard-coded page content |
| Admin/CMS is Phase 8 | Deferred | Real publishing frequency should choose the tool after launch | Premature custom admin |
| Compare Git-backed editor, headless CMS and separate admin app | Deferred decision | Auth, preview, media and rollback matter more than brand familiarity | Selecting a CMS now |
| Admin secrets never enter the public bundle | Decided | Public static delivery and private editing are separate security boundaries | Client-side admin credentials |

## Typography and color

| Decision | Status | Reason |
|---|---|---|
| Bricolage Grotesque for display | Decided | Distinctive without relying on decorative serif contrast |
| Archivo for body and interface | Decided | Readable and capable of compact hierarchy |
| DM Mono for data roles | Decided | Clear provenance, dates and measurements |
| Self-host and subset fonts | Decided | Predictable rendering and controlled weight |
| Paper, ink and oxblood system | Decided | Grounded in the approved prototype and real stock |
| Product accents remain inside their worlds | Decided | Each world keeps its own visual language |

## Open decisions by phase

### Phase 1

No open Phase 1 decisions. The current hero is a working draft and receives final owner
review with the Phase 2 arrival demos.

### Phase 2

- Route-specific composition within the locked system
- Final responsive type and spacing tokens
- Coming-soon treatment
- Final approval of the single scroll landing, checkpoint by checkpoint

Phase 2 review proceeds one route at a time by owner decision on 2026-08-28. Answers given
before rendered comparison are design inputs and may change; they are not recorded as final
visual decisions merely because an option was selected in chat.

The owner rejected the complete A, B and C landing directions on 2026-08-28. The replacement
direction is one full-width rag-paper scroll with no navigation in the arrival, a folded paper
nav that appears after the hero, a physical lower fold and a contained hero project study.
Paper floating in a dark gutter and product UI
behind the sheet are rejected. Direction C contributes only its illustrated introduction,
proof grid, service grid and starting split composition. The owner-supplied watermarked scroll
image is a structural reference only and is not shipped. Refinement proceeds on this one route
instead of creating more alternatives.

The working hero sentence is `I build AI products, break them, fix them, and write down what
actually happened.` It is the validated Phase 1 sentence and the most direct of the three
owner-approved candidates.

The owner liked the overall single-scroll landing on 2026-08-28 and approved the refined
landing checkpoint for an interim public release on 2026-08-29. The literal cylindrical
scroll ends, excess viewport-height spacing, quiet project-row hover and insufficient
hand-made edge detail were not approved. The maintained stub is now on `/`. The current
refinement replaces cylinders with directional folded-paper CSS, tightens later sections,
uses three stable generated fibre profiles per side, and keeps the torn-ink hover/focus state.
Generated transparent oxblood sheets supply sparse proofreader marks; they do not replace the
locked readable font roles. Opening-light, nav-fold and ink-settle motion each run once and
then stop. Full-sheet grain parallax was rejected because it would require repainting a
background on scroll or promoting a page-height layer. The landing structure is now
approved. At that checkpoint Phase 2 remained open for shared tokens, rendered contrast and
the remaining route structures; those later closed on 2026-08-31.

The seven `📐 specced` worlds have a research-only data and accent inventory in
`PHASE_2_WORLDS_ANIMATION_MEMO.md`. It does not satisfy the owner-approved storyboard gate and
does not authorize world implementation.

The `/work` review slice on 2026-08-29 interprets the owner's route-only answers as follows:

- the opening uses a human sentence and keeps the controls visible in the first viewport,
  while retaining enough scale and empty paper to feel editorial;
- the twelve projects remain one continuous register. Flagship, substantial and focused
  scope is expressed through row density instead of repeated tier headings;
- `Featured`, `Build effort` and `Most recent` are ordering modes. `Active now` is a
  separate filter meaning `live`, `running` or `in-progress`;
- every row shows title, summary, status, qualitative effort, sourced start date and route
  affordance. Only flagship rows may surface one already-published verified claim;
- the localised BeatMind composition is explicitly a static preview study. Hover/focus,
  centred-row mobile behaviour and tear navigation remain assigned to Phase 4;
- the real `/work` URL is built on `redesign/v2` for local owner review. It is not part of
  the interim production landing and does not satisfy Phase 3.

The owner approved the opening, continuous hierarchy, controls and filter on 2026-08-29.
The first desktop BeatMind study was rejected because its dark panel covered row content.
The next review replaces that panel with the same faint under-row aperture used on phone,
increases register copy sizes and applies one shared paper-menu treatment to Home and Work.
The revised preview remains a Phase 2 static study; production reveal behaviour remains in
Phase 4.

The Notes review slice on 2026-08-30 keeps all twelve Errata at equal weight. BeatMind is not
pinned as a featured mistake. The hub uses the casual working line `Things went wrong. I
wrote them down.` and prints the shared publication date once instead of repeating it on
every row. Individual records remain concise and evidence-led; they are not expanded with
invented detail or padded prose. General Posts remain empty and receive an intentional
Writing `Coming soon` state. Private source paths are described as internally reviewed but
are not published.

The `/hire` review slice uses the three validated service records, their boundaries and a
four-step risk-reduction path. Booking is the first contact action; email and WhatsApp stay
equally visible as direct alternatives. The page has no price or sales form. This is the
current rendered proposal.

On 2026-08-31 the owner accepted the current Home, Work, case-study, Notes, About, Resume and
Hire designs as the Phase 2 review baseline and asked to close the phase without another
approval round. This is an explicit acceptance-for-now decision: minute visual refinement
is deferred, not declared unnecessary or complete. The shared render, state and contract
gates pass and `PHASE_2_GATE.md` records the evidence. Phase 2 is closed.

The Vivid planning audit on 2026-08-31 found that photographic continuity is the verified
current product direction; the older anime, watercolour and illustration LoRAs were removed
during the FLUX.2 migration and cannot be presented as current modes. Three generated
preview-only directions were reviewed: Continuity Darkroom, Story Loom and Latent Cinema.
After Story Loom was recommended, the owner authorized its implementation. The resulting
standalone animatic uses the generated loom only as decorative art direction and unchanged
real Vivid evaluation frames as the foreground evidence. This selects Story Loom for owner
storyboard review, not for production publication; `VIVID_WORLD_STUDY.md` records the evidence
and blockers. No concept image is product evidence and no production world implementation is
authorized before the build-plan phase that owns it.

### Phase 4

- The owner selected Sheet Fault. Production backlight, centred-row touch behavior, real
  routing, destination focus, Back restoration, reduced motion and failure fallback are
  implemented and pass the automated gate at 390, 800 and 1440 pixels.
- Final owner approval of the production renders and the independent revert check remain the
  Phase 4 stop conditions.

### Phase 5 and 6

- Storyboard and media decisions for each world
- Whether any optional interaction teaches enough to justify its complexity

### Phase 7

- Production domain
- Analytics
- Final public claim snapshots

### Phase 8

- Publishing/admin system
