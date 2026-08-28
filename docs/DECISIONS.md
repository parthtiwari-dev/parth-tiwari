# Decision ledger

Revised 2026-08-28. This file contains current decisions and the reason each one exists.
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
| Work register may sort by recency and running status | Decided | Those fields have stable meanings | Unexplained novelty filters |
| Cost sorting requires a shared definition and sources | Owner review in Phase 1 | Money, time, compute and effort are not interchangeable | Shipping a misleading “cost” control |

## Landing and paper

| Decision | Status | Reason | Rejected or bounded alternative |
|---|---|---|---|
| One continuous scrolling rag-paper document | Decided | It supports a growing archive and keeps content readable without effects | Fixed viewport with an internally scrolling index |
| Use the real prepared paper stock | Decided | Procedural texture alone read as generated | CSS-only paper |
| Home includes every project in a simple editorial index | Decided | Every project remains an entry on the paper; `/work` owns exhaustive comparison and controls | Showing only selected work |
| A featured world may sit behind the first viewport | Decided with phase boundary | A still can enrich Phase 3; motion waits for the shared world system | A live canvas required for comprehension |
| Oxblood stays role-bound | Decided | Rare color makes the action and bleed meaningful | Accent used as general decoration |

## Preview and tear

| Decision | Status | Reason | Rejected or bounded alternative |
|---|---|---|---|
| Entry preview uses the project's approved world still first | Decided | Fast, stable and truthful before animated worlds exist | Starting every canvas on page load |
| Touch preview follows the centered entry during native scroll | Decided | It provides hover parity without adding a separate mobile interface | Tap-first hover emulation that traps the first tap |
| Tear visualizes navigation to a real route | Decided | Refresh, deep links and accessibility remain correct | Overlay-only world state |
| Production tear is chosen from motion studies | Owner review in Phase 4 | Material behavior needs visual comparison, not prose certainty | Copying the prototype timings and stock |
| Reduced motion skips the tear | Decided | The destination matters; the transition does not | A shorter but still disruptive tear |

## Worlds

| Decision | Status | Reason | Rejected or bounded alternative |
|---|---|---|---|
| Worlds are scroll-directed case stories | Decided | Scroll can reveal product causality while the DOM remains complete | Independent looping wallpapers |
| A world demonstrates rather than impersonates the product | Decided | Fake editors weaken trust and create inaccessible controls | Rebuilding twelve mini-apps |
| Storyboard approval precedes each implementation | Decided | The owner stays involved and narrative mistakes are cheaper to fix before code | One-shot world generation |
| BeatMind is the pilot | Decided | It exercises audio, stages, measurement, failure, retry and render | Building shared infrastructure inside an arbitrary first world |
| Optional audio is user-initiated | Decided | Sound can deepen BeatMind without blocking or surprising visitors | Autoplay |
| One shared world lifecycle | Decided | Prevents orphaned clocks and inconsistent reduced-motion behavior | A separate animation system per world |
| 2D or pre-rendered OncoVerse is the default | Decided | One sitewide Three.js dependency is not justified by one page | Adding Three.js before a measured comparison |

## Content and proof

| Decision | Status | Reason | Rejected or bounded alternative |
|---|---|---|---|
| Claims have source, context, verification date and `asOf` where changeable | Decided | User counts and deployments change | Permanent undated numbers in prose |
| BeatMind 17 users is owner-supplied as of 2026-08-27 | Evidence blocked | The owner says it is real; publication still needs the record and counting definition | Retaining the now-false zero-user claim |
| Vivid user count is a dated snapshot | Evidence blocked | The owner confirms evidence exists and the count may grow | Freezing “10+” forever |
| QueryPilot lift uses the 70-query core denominator | Evidence blocked pending final artifact link | Current repo evidence separates 70 core and 12 adversarial queries | Saying +5.7pp across all 82 |
| UPI evaluation and backtest metrics stay separate | Evidence blocked pending final wording | Different datasets answer different questions | One context-free precision claim |
| Oracle duration language stays unpublished | Evidence blocked | Retry behavior is visible; “months” and “longest” were not verified | Trusting remembered uptime |
| Hire shows a real price band | Owner review in Phase 1 | A ready client should not have to guess whether the work is in range | “Contact for pricing” only |

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
| Phase 3 deploys to a preview alias | Decided | The complete static site can be reviewed live without replacing v1 early | Production cutover before creative phases |
| Production cutover happens in Phase 7 | Decided | Domain and redirects move only after all gates | Conflating preview deployment with launch |

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

- Exact hero sentence
- Public price band
- Meaning and comparability of project cost
- Final claim wording and sources
- Which general Posts, if any, launch

### Phase 2

- Route-specific composition within the locked system
- Final responsive type and spacing tokens
- Coming-soon treatment

### Phase 4

- Production tear study
- Backlight strength, dwell and motion behavior

### Phase 5 and 6

- Storyboard and media decisions for each world
- Whether any optional interaction teaches enough to justify its complexity

### Phase 7

- Production domain
- Analytics
- Final public claim snapshots

### Phase 8

- Publishing/admin system
