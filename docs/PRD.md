# Product requirements

Revised 2026-08-27 for Paper and Worlds.

## 1. Product goal

The portfolio exists to generate qualified paid-project conversations and strong employment
opportunities. It must convince a skeptical visitor that Parth builds real products, measures
them honestly, understands failure and can be contacted without friction.

The primary commercial path is client work. The secondary path is employment. The site
serves both explicitly instead of forcing them through the same depth.

The public brand is **Parth Tiwari**. Paper and Worlds is the experience and design system.

## 2. Audience

### Client

A founder, small-business owner or agency lead arriving from cold outreach, usually on a
phone. They want:

- what Parth can build for them;
- evidence that he can finish and operate it;
- scope, process, fit and a direct conversation path, with no public pricing;
- a direct way to start.

### Employer

A recruiter, hiring manager or engineer. They want:

- engineering depth and decisions;
- evidence, measurements and boundaries;
- work experience, training and stack;
- a crawlable resume and PDF.

## 3. The ten-second contract

The first viewport contains:

- one plain sentence saying what Parth builds;
- **See the work**, leading to `/work`;
- **Start a project**, leading to `/hire`;
- a quiet proof cue;
- persistent access to About and Resume.

A decorative or animated world may sit behind the paper after the creative phases, but it
must not be required to answer what the site is about.

## 4. Information architecture

| Route | User job |
|---|---|
| `/` | Understand the offer and choose the right path |
| `/work` | Scan and compare all projects |
| `/work/[slug]` | Understand one project deeply through a case study and world |
| `/notes` | Browse Errata and Posts |
| `/notes/[slug]` | Read one complete sourced note |
| `/about` | Understand the person, experience and way of working |
| `/resume` | Parse, print or download the CV |
| `/hire` | Understand scope, process, fit and start a conversation without public pricing |

### Home

One long rag-paper sheet:

1. arrival and two doors;
2. portrait and first-person introduction;
3. every project in the editorial paper index;
4. dated, sourced proof;
5. three kinds of work;
6. latest Errata and Posts;
7. contact.

### Work

Every project appears on the home sheet in a simple editorial order. The register adds
comparison metadata and a meaningful default order. Controls may sort by recency and running
status. Cost sorting ships only after a comparable, sourced cost definition exists.

### Case studies

Every project contains:

1. arrival;
2. what it is;
3. the problem;
4. how it is built;
5. the measurement;
6. the boundary;
7. what broke;
8. stack and verified links;
9. next project.

The project world is a scroll-directed demonstration generated from real project material.
It does not replace the case study.

### Notes

Notes is both the trust surface and the future publishing surface.

- **Errata** compares what was expected with what happened.
- **Posts** holds broader writing.
- Each entry receives its own `/notes/[slug]` page.
- If there are no general posts at launch, Posts displays an intentional “Coming soon”
  state. Errata still ships.
- Published entries appear in RSS; drafts do not.

### About and experience

About contains the portrait, path, work-experience and training timeline, and operating
rules. It is first person. There is no separate Experience route because the same history
already has a human reading here and a structured reading on Resume.

### Resume

Real semantic HTML, printable and crawlable. The Bangalore PDF remains a download beside
the page. The Google Drive viewer is removed.

### Hire

The three kinds of work, scope boundaries, four-step process, fit guidance,
booking, email and WhatsApp. It does not use fake urgency, unsupported testimonials or
client logos.

## 5. World experience

A world should feel like entering the project, not reading another portfolio template.

- Native scroll advances a bounded story.
- The product workflow becomes the sequence.
- Real data controls the graphic.
- Copy and graphics reinforce the same beat.
- Optional interaction may teach a real tradeoff, but content and navigation remain
  ordinary DOM.
- Optional audio is user-initiated and has a visible stop.
- Reduced motion receives a composed final frame.
- JavaScript-off receives the world's complete concise narration, final still and direct
  action to the separate complete paper case study.
- One shared clock, a 30fps ceiling and offscreen suspension apply to all worlds.

BeatMind is the pilot because it exercises the full model: audio, stages, measurement,
failure, retry and render. Its success establishes the grammar for the remaining worlds.

## 6. Content and trust

Every public claim is checkable. Numeric claims include context, denominator, source,
verification date and an `asOf` date when changeable. The rules and current queue live in
`CONTENT_PROVENANCE.md`.

No invented:

- users;
- clients;
- testimonials;
- savings;
- timelines;
- benchmark results;
- deployment status.

The owner reports 17 BeatMind users as of 2026-08-27 and confirms Vivid's count is backed.
Both remain blocked from publication until their evidence and counting definitions are
attached.

## 7. Conversion requirements

- Contact is one tap away on every route and viewport.
- The first viewport presents one client door and one work door.
- The Hire page contains no public price or price band.
- Email, WhatsApp, booking and project links are tested on phone and desktop.
- No contact path is hidden behind a tear, canvas, menu-only interaction or login.

## 8. Accessibility and resilience

- All content and routes work with JavaScript disabled.
- Every pointer interaction has keyboard and touch parity.
- Focus is visible and predictable.
- Route changes move focus to an appropriate destination.
- Reduced motion produces a deliberately composed static experience.
- Native scrolling is never replaced or trapped.
- Text reflows at 320px and remains usable at 200% zoom.
- Meaning is not encoded through color or animation alone.
- Sound never autoplays.

## 9. Performance

- Static routes ship no unnecessary client framework.
- Eager JavaScript remains below the budget in `BUILD_PLAN.md`.
- World code loads only on routes that use it.
- Canvas pauses offscreen and when the document is hidden.
- Every animated system shares one lifecycle and cleans itself up.
- Images and fonts have explicit dimensions or stable slots to prevent layout shift.

## 10. Growth and publishing

Projects, Errata and Posts continue after launch. The initial source is typed Markdown in
Git, rebuilt through preview deployments. Content schemas are designed so a later editor or
CMS can use the same fields.

After the public site is stable, Phase 8 evaluates:

- a Git-backed editor;
- a headless CMS with static build hooks;
- a small separate admin application.

The chosen workflow must support drafts, previews, publication, rollback, media metadata and
claim provenance. Admin authentication and secrets never enter the public bundle.

## 11. Success criteria

### Comprehension

- Four of five new participants can state what Parth builds and a credible reason to hire
  him after ten seconds.
- A client and employer can identify their route from the first viewport.

### Content

- Every project satisfies the complete paper contract in `CASE_STUDY_CONTRACT.md`.
- Every public number maps to provenance.
- Errata has full individual pages.
- Posts has either real entries or an honest coming-soon state.
- About, experience, resume and hire are complete rather than links to external documents.

### Technical

- Every emitted page is static, crawlable and readable without JavaScript.
- Build, type, accessibility, screenshots, links and performance gates pass.
- Creative layers revert without breaking the site.
- Every world reverts independently and has a useful still frame.

### Commercial

- Booking and direct contact work from every route.
- The Hire page states scope, process, fit and a direct next step without public pricing.
- No unsupported proof is used to manufacture trust.

## 12. Out of scope before launch

- A custom CMS or admin panel
- Authentication in the public site
- A runtime database
- Comments, accounts or community features
- Autoplay sound
- A sitewide Three.js dependency
- Personalization or server-rendered routes
