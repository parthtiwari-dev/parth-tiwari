# Phase 5 gate: World foundation and BeatMind pilot

Run 2026-09-02 on `redesign/v2`. The automated gate passes. Owner visual approval is still
required before Phase 5 can close.

## What shipped locally

- Phase 4 Back-restoration repair: `a7fdb25`.
- Production storyboard lock: `9e0a4c8`.
- Shared validated world foundation: `43aa42b`.
- BeatMind Precision Descent Sound Foundry: `fcefde4`.
- BeatMind read-only exporter: isolated in the BeatMind repository on
  `codex/portfolio-world-export` at `30cab81`. BeatMind `hulk` remains aligned with
  `origin/hulk`; the exporter has not been pushed or deployed.

Home and `/work` route BeatMind to `/work/beatmind/world/`. The world ends with one primary
action to `/work/beatmind/`. Projects without a published world continue to open their paper
case studies. No placeholder world route is generated.

## Data boundary

The committed build artifact was exported from BeatMind application state `ca55ad8` and
reviewed on 2026-09-02. It contains:

- source, vocals, backing vocals, drums, bass and other;
- 256 fixed RMS and 256 peak bins for each signal on one shared normalization scale;
- `214.024` seconds, `82 BPM`, `C# minor`, 12 sections and 69 downbeats;
- no UUID, email, private path, storage URL, signed URL, raw prompt, raw error or audio bytes.

No explicitly correlated publishable failure/retry trace was found, so those scenes are
omitted. No cleared standalone excerpt and licence record exist, so the route emits no audio
element or media request.

## Command result

`npm run phase5:gate` passes:

1. Phase 1 schemas and content validation.
2. Phase 3 case-study, internal-link, metadata, sitemap, RSS and deferred-route checks.
3. Phase 4 Home and `/work` preview, Sheet Fault transition, real world-route navigation,
   destination focus, reduced-motion, no-JavaScript, enhancement-failure and Back-restoration
   checks at 390, 800 and 1440 pixels.
4. Phase 5 responsive world rendering, data/privacy, fallback, lifecycle, transfer and print
   checks.

Rendered evidence is in `.shots/phase5-beatmind-world/`. Each of the eight scenes plus the
final frame was captured at 390 × 844, 800 × 1024 and 1440 × 900. All three report zero
horizontal overflow, zero browser errors and zero runtime fetch, XHR or media requests.

| Viewport | Draw-rate result | Renderer-draw result |
|---|---:|---:|
| 390 × 844 | Below 30/s | Below 50 ms |
| 800 × 1024 | Below 30/s | Below 50 ms |
| 1440 × 900 | Below 30/s | Below 50 ms |

Exact measurements for the most recent run are written to
`.shots/phase5-beatmind-world/metrics.json`. Repeated final runs observed 12.6–17.3 draws per
second and 2.5–16.2 ms maximum renderer draws across the three widths. The phone screenshot
run also observed a 164–234 ms browser long task while Playwright captured evidence. The
renderer is measured separately around its own Canvas draw call and remains below the 50 ms
world-generated limit; draw frequency remains below the 30fps ceiling.

| Transfer class | Raw | Gzip |
|---|---:|---:|
| Eager world JavaScript | 7,945 B | 3,389 B |
| World CSS | 14,777 B | 4,048 B |
| Decorative WebP plate | 132,684 B | n/a |

The route has no runtime dependency beyond Astro and performs no runtime data request.

## Render inspection

Representative arrangement and final-handoff frames were visually inspected at 390, 800
and 1440 pixels after the final gate run. The phone composition uses its close crop without
losing the scene copy or case-study action; tablet and desktop retain the full machine and
signal hierarchy. No clipped narration, accidental paper section or simulated product UI was
observed. This internal inspection is not a substitute for the still-open owner visual
approval required by the phase gate.

## Resilience result

- JavaScript disabled: static frame, eight scene summaries and case-study action remain.
- Reduced motion: same complete static story; no abbreviated animation.
- Canvas context failure: static story remains and the sticky stage stays hidden.
- Resize/orientation: canvas resizes and remains overflow-free.
- Page hide/show: runtime tears down, restores once and does not duplicate listeners.
- Explicit teardown: draw count remains stable after later scroll and resize events.
- Back: exact BeatMind row focus and scroll position restore; zero torn panels, stale preview
  state or horizontal overflow.
- Print: static frame and all eight semantic scenes remain readable.

## Independent revert proof

The active checkout was not changed during the proof.

1. An isolated worktree at `fcefde4` applied `git revert --no-commit fcefde4`; the remaining
   shared foundation built 30 pages and a 29-route sitemap.
2. A direct isolated checkout of `43aa42b` built the same 30 pages and 29 routes.
3. That isolated foundation checkout then applied `git revert --no-commit 43aa42b`; the
   resulting Phase 4 site built 29 pages and its original 28-route sitemap.
4. Both temporary worktrees and their temporary `node_modules` junctions were removed after
   verification.

## Gate status

Automated gate: **passed**.

Owner visual review: **approved** by the owner on 2026-09-02. Phase 5 is closed. Phase 3's
deferred owner review remains independently open; the approval does not imply a production
cutover. No push, merge or deployment occurred during this phase.
