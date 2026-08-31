# Phase 2 Hire review

Recorded 2026-08-31. This is the route-structure and craft review for `/hire/`. It does
not complete Phase 2 or begin the animated Vivid world.

## Route contract

The route serves a potential client who wants to understand what Parth can build, how a
project begins, whether the working relationship fits, and how to start a direct
conversation. It contains no public price, inquiry form, testimonial, client logo, user
count, urgency device or unsupported outcome.

The validated source material is:

- the three typed service records in `src/content/services/`;
- the approved Hire heading and introduction in `src/content/site/routes.json`;
- the service boundaries and operating rules already used by Home and About;
- the verified booking, email and WhatsApp configuration in `src/config/site.ts`.

## Reference lock

The Paper and Worlds sheet, typography, oxblood role and shared route navigation remain the
visual source of truth. Three outside references have deliberately narrow roles:

- [thoughtbot Services](https://thoughtbot.com/services) contributes only the separation
  of different engagement shapes and the emphasis on validating the useful first version;
- [thoughtbot's pre-product validation playbook](https://thoughtbot.com/playbook/strategy/design-sprints/02-pre-product-validation)
  contributes only the risk-first sequence of testing a focused assumption before a large
  build;
- [Josh Comeau's contact page](https://www.joshwcomeau.com/contact/) contributes only the
  direct, human explanation of what a useful first message contains.

No outside visual language is copied. The page rejects a generic card grid, long sales
form, pricing table, fake social proof and decorative sales illustration.

## Route structure

1. A direct `Have something real to build?` arrival with booking, email and WhatsApp.
2. A small paper note explaining that an unpolished first message is enough.
3. Three ruled service records with useful scope and explicit boundaries.
4. A four-step risk-reduction path: define the problem, prove the risky assumption, build
   the smallest useful version, then ship, measure and leave a clear handoff.
5. Equal `Likely a fit` and `Probably not a fit` ledgers.
6. A repeated direct-contact ending with no form or price gate.

The process wording is framed as the default way Parth would begin, not a duration,
guarantee or fixed commercial package. Home's two Start a project actions now lead to the
real `/hire/` route instead of the old contact anchor.

## Rendered evidence

`npm run phase2:hire-capture -- --url http://127.0.0.1:4323 --tag phase2-hire-review`
passed against the built static output at 390, 800 and 1440 pixels:

- one `h1`, three service records, four process steps and four entries on each side of the
  fit ledger;
- two booking, two email and two WhatsApp paths on every viewport;
- zero horizontal overflow, unnamed controls, missing image alternatives, browser errors,
  public-price language or unsupported sales-proof language;
- zero client scripts and the same complete route with JavaScript disabled;
- at least two direct Home-to-Hire links in the built landing.

The first screen, services, process, fit and contact ending were visually inspected at all
three widths. Screenshots are in `.shots/phase2-hire-review`. The phone composition stacks
the note, contact actions, service scope and fit ledgers without hiding the direct contact
path behind the mobile menu.

Read-only HTTP checks on 2026-08-30 returned HTTP 200 for the configured Cal.com page and
for the WhatsApp destination after its expected redirect. A `mailto:` link cannot prove
mailbox delivery; only its public syntax and placement were verified.

Owner visual approval remains before the combined Phase 2 route-hierarchy checklist can
close. The next work is the Phase 2 system closeout and gate, not a Vivid world.
