# Phase 2 shared case-study review

Revised 2026-08-30. This is the owner-review record for the shared `/work/[slug]/`
paper structure. It is not the Phase 3 implementation record and it does not authorize an
animated project world.

## Reference lock

**Primary direction:** the approved full-width Paper and Worlds rag sheet, used here as an
evidence-led technical document rather than as a landing-page repeat.

**Preserve:** blunt Bricolage display type, readable Archivo body copy, DM Mono evidence,
thin ruled structures, rare oxblood, torn stable edges, asymmetry and real product media.

**Borrow only:**

- Work & Co's progression from product overview through outcomes, architecture and
  after-launch work;
- ustwo's candid challenge, process, tool limits and future implications;
- the compact sticky index used by long-form editorial case studies.

**Reject:** a dark-world masthead, generic SaaS cards, a screenshot carousel, a fake mixer,
invented traces, technology-logo wallpaper, scroll snapping and trapped scroll.

**Media rule:** the BeatMind pilot uses the real `beatmind.webm` product recording, current
public product capture and three real workflow captures. Dark product UI may appear inside
media frames, but it does not become the page surface. The Sound Foundry still is not used
as product proof.

The reusable content order is locked in
[`CASE_STUDY_CONTRACT.md`](CASE_STUDY_CONTRACT.md).

## Owner decisions represented

- The paper page starts on paper. BeatMind's dark Sound Foundry is a separate experience
  that ends with an explicit deep-dive action.
- BeatMind is identified as work built at Stick and Dot. The public contribution record
  says Parth designed and built it end to end; founder and early-user feedback shaped later
  refinements; no one else contributed to the implementation.
- The case study may publish the four audited failure stories.
- The repository remains private. The public page names internally audited source groups
  without exposing repository paths, identifiers, user data or private audio.
- The current account count remains absent because a durable Clerk record and a definition
  of user are not attached to the portfolio claim record.
- Product media is user-controlled. The recording is muted and never autoplays.
- The recording uses `preload="none"`; the 1.3 MB WebM transfers only after the visitor
  chooses to play it.

## Implemented pilot

The BeatMind pilot at `/work/beatmind/` now contains ten visible chapters:

1. product and intended user;
2. real product proof and workflow;
3. problem, responsibility and contribution;
4. development research and changed decisions;
5. architecture;
6. decisions, rejected alternatives and trade-offs;
7. verified evidence;
8. four failures using symptom, cause, correction and remaining risk;
9. current limits, deliberate boundaries and status-labelled future work;
10. stack, public sources and internally audited source groups.

The masthead, proof strip and close sit around those chapters. A small first-party script
updates reading progress and current chapter only. It does not control navigation or access
to content.

## Final built-output evidence

The final paper build passed typed schema checks, cross-content validation and the static
Astro build. Responsive evidence is in
`.shots/phase2-beatmind-case-paper-final/`. The 390, 800 and 1440 capture reported:

- HTTP 200;
- ten chapters and two published measurements;
- one real WebM recording and three workflow frames;
- no dark world masthead;
- zero horizontal overflow, missing image alternatives, unnamed controls or page errors;
- the same ten chapters, two measurements, four ending links, four stills and one video
  source with JavaScript disabled.

The normal-viewport screenshots were visually inspected. The earlier tall element
screenshots exposed a Playwright stitching artifact in which the sticky navigation appeared
inside an off-screen section. They were replaced rather than treated as final evidence.
The first normal-viewport inspection also exposed black compositing gaps caused by applying
one polygon clip-path to the complete long sheet. The full-height mask was removed. The
three fixed fibre assets continue to carry the damaged paper edge without promoting or
clipping the complete document.

Final checks against the same built output:

```text
PASS content:test-schemas
PASS content:check
PASS build: 3 static routes
PASS phase2:case-capture at 390, 800 and 1440
PASS no-JavaScript: 10 chapters, 2 measurements, 4 ending links, 4 stills, 1 video source
PASS a11y at 390, 800 and 1440
PASS craft with complete no-JavaScript and reduced-motion copy
PASS perf: 0 script transfer bytes, 767,660 resource bytes before optional video playback
PASS perf:scroll: 16.7-16.8 ms p95, 0 frames above 20 ms at all three widths
```

## Still open

- The owner must inspect and approve the final paper page.
- The other eleven entries still need their own evidence audit and typed `caseStudy`
  content before Phase 3. The schema is intentionally optional until then.
- The real BeatMind envelope, analysis and failure-trace exports remain inputs to the
  Phase 5 Sound Foundry, not omissions from this paper case study.
- Exact production routing between a project world and its canonical paper page remains a
  later implementation decision. No broken placeholder world link is published here.
