# Phase 2 shared case-study review

Revised 2026-08-29. This is the owner-review record for the shared `/work/[slug]`
structure. It is not the Phase 3 implementation record and it does not authorize an
animated project world.

## Reference lock

**Primary direction:** the approved Paper and Worlds system. The world owns the dark
arrival; the paper owns the complete readable case study.

**Preserve:** one project-specific accent, a real product still, the nine-beat content
skeleton, native scrolling, editorial type scale, thin ruled evidence and an honest static
fallback.

**Borrow only:** the compact progress/index pattern used by long-form editorial case studies.
The progress treatment is sticky on desktop and remains in normal document flow on phone so
it cannot cover the reading surface.

**Reject:** a generic SaaS case-study card stack, a screenshot carousel, a fake mixer, an
invented data trace, scroll snapping, trapped scrolling and any company badge in the global
register.

**Media rule:** the Phase 2 BeatMind pilot uses the real local
`beatmind-stems-clean.png` capture. The eight-stage strip is labelled as a storyboard path,
not measurement. The real run trace still requires the export specified in `WORLDS.md`.

## Owner decisions represented

- The dark opening occupies roughly 80% of a desktop viewport and leaves a visible cue of
  the paper below it.
- The opening carries the title, one-sentence arrival, status, unnamed working context,
  compact stack and one verified result.
- Desktop uses a sticky chapter index, reading-progress line and static world still beside
  the chapters. Phone stacks the complete story and keeps progress out of the sticky chrome.
- Measurement gives one result more visual weight while keeping every denominator and
  verification date attached.
- Architecture leads with the decision and earns one plain system diagram.
- What broke is an inserted oxblood correction rather than a normal content section.
- Working context says only `Built as part of my current role`; the organization is not named.
- The ending contains next project, register, erratum, contact and a small feedback prompt.
- Audio remains opt-in. The control is shown disabled because the repository contains no
  approved standalone owner-created or licensed excerpt. A screen recording is not treated
  as audio provenance.

## Review implementation

The single Phase 2 pilot is generated at `/work/beatmind/` by
`src/pages/work/[slug].astro`. Its `getStaticPaths()` intentionally emits BeatMind only.
That proves the shared structure without implementing all twelve Phase 3 routes early.

The DOM contains all required reading beats, two published verified measurements, the real
static still, the architecture decision, boundary, erratum, verified public link, next-case
link and back-to-register path. A small first-party enhancement updates reading progress and
the current desktop chapter. It does not control navigation or access to content.

## Rendered evidence

Final screenshots are under `.shots/phase2-beatmind-case-final/`:

- `phone-390-*`
- `tablet-800-*`
- `desktop-1440-*`

Each width has arrival, reading, architecture, measurement, erratum and ending captures.
The final scripted capture reported HTTP 200, seven chapters, two published measurements,
zero horizontal overflow, zero page errors, named controls and complete image alternatives
at all three widths. With JavaScript disabled it still found seven chapters, two
measurements, six ending links and two static stills.

Final local checks against the rebuilt static output:

```text
npm.cmd run build
npm.cmd run phase2:case-capture -- --url http://127.0.0.1:4323 --tag phase2-beatmind-case-final
npm.cmd run a11y -- --url http://127.0.0.1:4323/work/beatmind
npm.cmd run craft -- --url http://127.0.0.1:4323/work/beatmind
npm.cmd run perf -- --url http://127.0.0.1:4323/work/beatmind
npm.cmd run perf:scroll -- --url http://127.0.0.1:4323/work/beatmind
```

The accessibility baseline passed at 390, 800 and 1440 pixels. The static-fallback checks
passed. Script transfer stayed below the existing 30 KiB ceiling. The deterministic scroll
pass reported a 16.7-16.8 ms p95 across the three widths, with no frames above 20 ms. These
automated results do not substitute for the owner visual review or the final textured-surface
contrast gate.

## Still blocked or deferred

- Owner approval of this rendered structure is still required.
- A real BeatMind run-trace JSON export is still required before the run trace can be drawn.
- A licensed or owner-created audio excerpt and its publication permission are still required
  before the audio control can be enabled.
- The other eleven case-study routes, including Vivid, remain intentionally unbuilt in
  Phase 2.
- Animated separation, mixing, worker failure and retry remain Phase 5 work after storyboard
  approval.
