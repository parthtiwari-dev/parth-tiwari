# Phase 2 Notes review

Recorded 2026-08-30. This is the reference lock, route structure and rendered evidence for
the `/notes` and `/notes/[slug]` Phase 2 review slice. It does not mark Phase 2 complete or
authorize Phase 3 production work.

## Owner decisions

- All twelve Errata have equal weight. BeatMind is not pinned or marketed as a featured
  mistake.
- The opening voice is casual and first person. The working headline is `Things went wrong.
  I wrote them down.`
- The initial articles stay concise and evidence-led. They are not padded into essays and
  no repository is re-audited merely to make a page longer.
- General Posts remain empty. Writing has an intentional `Coming soon` state rather than
  fake topics or empty cards.

## Reference lock

**Primary direction:** the existing Paper and Worlds rag sheet, type system, edge fibres,
navigation fold and oxblood roles.

**Borrowed, with narrow roles:**

- [Linear Changelog](https://linear.app/changelog/page/1) contributes chronological scan
  density and clear separation between major entries and small fixes. It does not contribute
  Linear's dark product chrome.
- [Maggie Appleton's garden](https://maggieappleton.com/) contributes honest separation
  between different kinds of writing and permission for a publishing surface to grow over
  time. It does not contribute illustration or garden metaphors.
- [Cloudflare postmortems](https://blog.cloudflare.com/tag/post-mortem/) contribute the
  expectation, failure, correction and remediation logic used by individual records. They
  do not contribute incident severity theatre or corporate blog styling.

**Memorable move:** Errata rows receive an oxblood proofreader mark only during hover or
keyboard focus. The mark carries correction status; it is not general decoration.

**Rejected:** featured mistakes, generic blog cards, invented post thumbnails, fabricated
topics, repeated identical dates on every row, private repository paths and long articles
created by padding the current audited records.

## Route structure

### `/notes`

1. Shared paper navigation.
2. Casual first-person arrival and derived publishing totals.
3. Enhanced-only `All`, `What went wrong` and `Writing` filters.
4. One equal-weight correction ledger with project, summary and honest source boundary.
5. A real Writing shelf that says there are no general Posts yet.
6. Paths back to Work and forward to About.

All twelve Errata currently share one publication date, so the hub prints that date once as
an archive heading. It does not pretend the publication date is the date each mistake was
discovered.

### `/notes/[slug]`

1. Erratum type, publication date, title, summary and related project.
2. The complete concise Markdown record.
3. Any attached publishable measurements with their denominator.
4. A source ledger. Public URLs remain clickable; private repositories and artifacts are
   described as internally reviewed without publishing their paths.
5. Previous, next and back-to-Notes paths.

The route remains complete without JavaScript. The hub filters disappear without JavaScript
while both the correction ledger and Writing state remain readable.

## Rendered evidence

The built static output was captured in `.shots/phase2-notes-review-final` at 390px, 800px
and 1440px. The captured states include the first viewport, full correction ledger, Writing
empty state, article masthead, article body and attached measurement.

The route-specific browser gate reports:

- 12 equal-weight entries and 12 working article routes;
- one meaningful H1 on the hub and every inspected article;
- zero horizontal overflow, page errors, missing alternatives or unnamed controls;
- working Writing filter with a zero-record state;
- complete hub and article content without JavaScript.

The shared gates report:

- accessibility passes at 390px, 800px and 1440px;
- complete copy under no-JavaScript and reduced-motion modes;
- 447,895 transferred bytes and zero transferred script bytes in the initial route load;
- deterministic scroll p95 of 16.7-16.8ms at all three widths, with zero frames over 20ms.

These checks prove a reviewable static structure. Owner visual approval remains required
before the route-family architecture is called approved.
