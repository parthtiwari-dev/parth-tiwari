# DESIGN LOCK: Paper and Worlds

Revised 2026-08-27. This is the visual and interaction direction that gets built.

The public name is **Parth Tiwari**. **Paper and Worlds** is the design system name, not
the masthead. It replaces the v1 constellation and the later denoise-wide direction.

`design/directions/paper.html` is a reference artifact. It proves the material, register,
backlight and tear idea and contains known defects. It is not production code and is not
ported line by line.

The direction is locked. Its execution is not presumed perfect. Every visual phase begins
with owner review, uses rendered evidence, and stops at its gate. “Locked” prevents the
project from changing metaphors again; it does not prevent improving spacing, hierarchy,
motion, accessibility, storytelling or world choreography.

## 1. The idea

**One long sheet of real rag paper. Every project is an entry on it. Tearing an entry opens
that project's own world.**

The landing is one continuous scrolling document printed on real paper stock. It carries the
arrival, the person, every project in an editorial index, evidence, services, errata and the
way to start. The paper
is the common frame. Each project world is allowed to abandon that frame and speak in the
product's own visual language.

The count is never hard-coded in prose or the brand. Projects and notes keep arriving.

## 2. Why the paper direction is right

The old constellation made the metaphor the information architecture. Paper reverses that:
the document remains readable before the creative layer loads. It also gives the growing
portfolio a natural form. New work is another entry; new writing is another note; an erratum
can sit beside the claim it corrects.

The paper has a specific job:

- make the site feel authored and physical without becoming nostalgic decoration;
- create one calm shared surface for two different readers;
- make the transition into a project world memorable;
- remain complete when backlight, tear and canvas are removed.

The paper is not perfect because the prototype is not perfect. Production work must improve
its mobile hierarchy, long-page rhythm, touch invitation, focus behavior, backlight legibility
and tear material. Those improvements happen in Phases 2 through 4 with owner review.

## 3. Two readers, eight route families

A client wants outcome, speed, scope and fit. An employer wants engineering depth,
decisions, evidence and a CV. The first viewport offers two doors without splitting the
brand into two sites:

- **See the work** leads to `/work`.
- **Start a project** leads to `/hire`.

`Hire me` is not a third competing hero action. Employment information remains one tap away
through the persistent navigation and the resume route.

| Route | Page contract |
|---|---|
| `/` | Arrival and two doors, portrait and introduction, every project in the paper index, verified proof, three kinds of work, latest errata and contact |
| `/work` | Complete register, with a meaningful default order and only evidence-backed controls |
| `/work/[slug]` | Complete project case study and project-specific world |
| `/notes` | Errata and Posts hub; Posts may honestly say “Coming soon” |
| `/notes/[slug]` | Full erratum or article with sources, related project and next reading |
| `/about` | Portrait, path, work-experience timeline, training and operating rules |
| `/resume` | Semantic HTML CV, print view and verified PDF download |
| `/hire` | Scope, process, fit, booking and direct contact; no public pricing |

No separate `/blog` page is needed. Posts and Errata are two types inside Notes. No separate
`/experience` route is needed. The human story belongs on About; the structured employment
record belongs on Resume.

Persistent chrome contains the Parth Tiwari wordmark, route links and one oxblood contact
action. Contact remains one tap away at every width.

## 4. The landing

### Arrival

The first viewport has one sentence, two doors and a quiet proof cue. It must answer what
Parth builds and why someone should continue within ten seconds. Nothing above the fold
depends on motion.

The final creative version may place a featured project's world behind the paper. Phase 3
uses its approved still frame. Phase 5 may animate it after the shared world system exists.
It never competes with the sentence or becomes a route control.

### Long-sheet flow

1. Arrival and two doors
2. Portrait and a short first-person introduction
3. Every project in a simple editorial paper index, plus a path to the full register
4. Verified proof, with dated and sourced numbers
5. Three kinds of work
6. Latest Errata and Posts
7. Contact and route close

Every project appears on the home sheet, which preserves the core metaphor and a stable
editorial order. `/work` adds comparison metadata, sorting and filtering; it is the working
register rather than a duplicate landing narrative.

### Stock

Use the real prepared stock at `public/media/paper-stock.jpg`, with its licence retained.
The production surface preserves the useful preparation already proven by
`design/make-stock.mjs`: crease removal, luminance flattening and a repeat-safe crop.

The CSS layer may add lighting and edge response. It must not repaint the photograph with
procedural stains until it reads synthetic again. Rendered contrast is measured on the
actual stock.

### Edges, depth and ink

- Seeded deckle edges remain stable between loads.
- Paper shadow is its own layer so transparency does not create a black hole.
- Oxblood `#8E2116` is reserved for the primary action, focus-worthy emphasis and paper
  bleed. It is not a general decoration color.
- Type and stock are separate layers. The paper may become translucent; the copy does not.

## 5. The register and preview

The default order is editorial and expresses which work matters most. Sorting is a useful
control only when its fields mean the same thing across every project.

The Phase 2 `/work` study uses three comparable ordering controls:

- Featured
- Build effort
- Most recent

`Active now` is a separate state filter, not another ordering mode. It means `live`,
`running` or `in-progress`. The owner approved that control and meaning on 2026-08-29.
No price or cost control appears on the site.

Hovering or focusing an entry backlights the sheet and reveals that project's approved world
frame behind it. Motion may begin after a deliberate dwell only if it improves recognition
and passes the performance budget.

Touch has no hover. On coarse pointers the entry nearest the viewport center becomes the
preview candidate as the user scrolls. This must not capture or alter native scrolling.
The preview is an invitation, not the only way to open a project.

## 6. The tear

Selecting an entry opens its real `/work/[slug]` URL. The tear visualizes that navigation;
it does not own navigation state.

The production tear must improve on the prototype:

- it tears the rendered paper or a faithful captured layer, not generic substitute stock;
- the seam, fibre edge, paper weight, shadows and exit motion are tuned together;
- the source entry remains the correct back-navigation and focus-restoration target;
- focus moves to the destination heading after navigation;
- touch, keyboard and pointer all have complete paths;
- reduced motion and failed enhancement navigate immediately;
- hidden controls are not focusable.

Phase 4 begins with two or three motion studies using the real paper and a real project still.
The owner approves one before production implementation.

## 7. Worlds

A world is a **scroll-directed product story** generated from the project's real material.
It is not a looping wallpaper, a feature carousel, a fake app or a control surface.

The visual stage may demonstrate a workflow as the document scrolls. BeatMind, for example,
can move through ingest, separation, analysis, arrangement, mixing, rendering, failure and
retry. The visitor experiences what the product does without being asked to operate a fake
editor. Optional sound is user-initiated and never required.

The DOM carries the full case study. If every canvas and animation is deleted, the page
still contains the problem, architecture, measurement, boundary, what broke, links and next
case. Reduced motion gets a deliberately composed final frame.

`WORLDS.md` defines the shared grammar and every project's narrative material. Each world
receives an owner-approved storyboard before implementation.

## 8. Visual system

### Paper

- paper: `#EAE3D5`
- ink: `#1A1613`
- secondary ink: `#4E463C`
- quiet ink: `#6B6153`
- oxblood: `#8E2116`

### Worlds

- void: `#0B0C0E`
- rule: `#262A2F`
- ink: `#F2F3F0`
- secondary: `#9AA0A2`
- project accents come from the product's real interface or data

### Type

- Bricolage Grotesque: display
- Archivo: body and interface
- DM Mono: dates, numbers, labels, stack and provenance

Fonts are self-hosted and subset. Their rendered roles and budget are approved in Phase 2.

### Banned defaults

- Inter or a generic system font presented as brand character
- gradient headlines
- decorative italic word swaps
- a letter in a colored rounded square as a logo
- reflexive hero, feature-card grid, testimonial, CTA templates
- `transition: all`
- scroll hijacking or a smooth-scroll engine
- animation that changes layout continuously
- a project accent reused as global brand chrome
- fake product screenshots or invented data graphics

## 9. Motion and accessibility

| Moment | Starting budget |
|---|---|
| Tear | One deliberate heavy transition, tuned in Phase 4 |
| Backlight | Fast enough to preserve cause and effect; measured in the motion study |
| Ink bleed | Secondary to legibility |
| Arrival | Runs once and never delays reading |
| Interface feedback | 150–250ms unless a measured reason requires more |
| Worlds | 30fps ceiling, one shared clock, paused off-screen and on hidden tabs |

Exact paper-transition values are no longer locked from the prototype. They are chosen from
rendered motion studies in Phase 4. Reduced motion gets immediate navigation and the final
composed world frame. Native scrolling remains available at all times.

## 10. Build order

1. Clear v1 and prove Astro static output.
2. Write and verify every word without opening design files.
3. Lock the system and page architecture with the owner.
4. Build and preview the complete static site with no canvas, tear or animated world.
5. Perfect the paper preview and tear as a revertable enhancement.
6. Build the shared world system and BeatMind pilot.
7. Build the other worlds one reviewed story at a time.
8. Cut over production.
9. Add a publishing/admin workflow after the public site is stable.

The detailed gates are in `BUILD_PLAN.md`.

## 11. Known prototype defects

- The prototype says “Hover” on touch devices.
- Nav links are in-page anchors instead of routes.
- World state has no deep-link URL.
- Opening a world does not move focus into the destination.
- The hidden close control remains keyboard focusable.
- The tear uses plain stock rather than the rendered sheet.
- The mobile register allows narrow project names to collide with metadata.
- The resume download is not wired.

These are production requirements, not reasons to polish `paper.html`.

## 12. Open evidence, not open direction

- The ten-second test has not been run.
- BeatMind's conflicting build-count snapshots stay excluded. The owner reports 18 Clerk
  accounts as of 2026-08-28, but the Clerk record and counting definition are still missing.
- Vivid has an owner-known lower bound of 10 people but no durable count source; do not
  publish it yet.
- QueryPilot and UPI metrics need their exact denominators and evaluation context.
- Oracle uptime language remains unpublished until evidence exists.
- Vivid and QueryPilot need useful product captures before their worlds ship.
- The owner rejected public pricing and cost sorting. The register uses qualitative build
  effort: flagship, substantial and focused.
