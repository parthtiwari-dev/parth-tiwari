# DESIGN REVIEW — EPHEMERIS

`/design-pass audit` on 2026-08-14. Read-only pass against the live local dev server (`http://127.0.0.1:5183/`), not the deployed site — screenshots and findings below reflect the code on `main` as of this pass. Nothing in this file has been applied except where explicitly marked **APPLIED** below.

**Detector coverage:** none. No `design-kit` install (`vendor/impeccable`) is reachable in this environment — see `DESIGN_LOCK.md`'s closing section. Every finding here is judgment-based, cross-checked against real console output and source, not a deterministic scan. Treat this review as thorough but not exhaustive.

## Verdict

The site is genuinely well-crafted where it's been designed deliberately — the type role split, the reduced-motion discipline, the constellation itself. What's holding it back right now is composition, not craft: the newest conversion-layer pieces (`BookingCta`, `ProjectIndex`) were each built correctly in isolation by separate work, and nobody checked how they sit together on the same screen as the pieces that were already there.

## Screenshots

| 390 | 834 | 1440 |
|---|---|---|
| `.design-pass/before-390.png` | `.design-pass/before-834.png` | `.design-pass/before-1440-final.png` |

Not committed (gitignored per the skill's own convention) — regenerate with `npm run dev` + the Playwright script used for this pass, or ask for them directly.

## Detector findings

Not run. See Detector coverage above.

## Lock violations

Where the code disagrees with `DESIGN_LOCK.md`.

| Token | Lock says | Code does | Location | State |
|---|---|---|---|---|
| CTA shape | Banned: "Pill-shaped CTAs at marketing scale... keep the tighter, more rectangular radius" (borrowed from Warp, not Vercel) | `BookingCta` renders as a full pill (`border-radius: 999px` equivalent) | `src/components/conversion/BookingCta.vue` | **RESOLVED** — now `var(--radius-chrome)`, with the gradient fill and drop-shadow removed too |
| Data-surface treatment | Banned: "Card-grid layout for any evidence/proof/data surface... the observation log is the signature element specifically *because* it is not a card grid" | `ServicesBlock`, `ProjectIndex`, and the existing Proof panel all use card/list treatments, not the log motif | `ServicesBlock.vue`, `ProjectIndex.vue`, `PanelProof.vue` | **RESOLVED** — all three render through `ObservationLog` |
| Second accent in 2D chrome | Banned: `--teal-active` / `--amber` / `--utility` "stay inside the 3D legend only" | `ProjectIndex` coloured each row by node kind using `--bg-cyan`, `--amber-glow`, `--utility-glow` | `src/components/sections/ProjectIndex.vue` | **RESOLVED** — found while applying the log; kind and status moved into the log's status column |

Neither of the first two violations was a surprise — the lock was written *after* these components, specifically because building them first (Phase 0/1.5) and locking the visual language second was the right order for that work. They were recorded as the concrete backlog the lock creates, not as mistakes, and that backlog is now cleared. The third was found during the work rather than during the audit.

## Judgment findings

Ranked worst first.

### 1. `BookingCta` overlaps the constellation legend at every breakpoint ≥768px

- **What:** `BookingCta.vue:91-94` fixes itself to `bottom-right` (`right: clamp(0.75rem, 3vw, 2rem); bottom: max(clamp(...), safe-area-inset-bottom)`). `SceneRoot.vue:163` positions the constellation legend at `absolute bottom-6 right-6` with `hidden md:block` — meaning it renders at exactly the same corner, starting at exactly the breakpoint where it starts rendering at all. Visible directly in both the 834 and 1440 screenshots: the button sits on top of the legend's last two lines, obscuring "UTILITY / TOOLING" and the "bigger node = stronger evidence" note.
- **Why it matters here:** Both elements are correct individually — they were built by separate work that never rendered against each other. This is exactly the kind of composition gap this audit exists to catch. It doesn't block the conversion CTA (`z-index: 90` sits above the legend's `z-30`, so the button itself is fully clickable) — it degrades the legend, which is minor content, but it's the first thing a careful visitor notices, and "the new thing collides with the old thing" is a bad signal to send in the first three seconds.
- **Fix:** **APPLIED.** See below.

### 2. `ProjectIndex` is technically present but practically invisible

- **What:** The left-edge rail is a thin vertical strip (`9 SYSTEMS INDEX` in tiny rotated mono text) with no visible affordance that it expands. In the 1440 and 834 screenshots it reads as a stray label, not a navigation control.
- **Why it matters here:** `ProjectIndex` exists specifically to fix a total keyboard/screen-reader lockout (`docs/AUDIT.md` C2) — it is genuinely, technically reachable. But Ground also says a skeptical buyer needs to *find* the work fast on a 60-second budget, and right now a sighted mouse user would need to already know it's clickable to try it. Solving accessibility with something that reads as decoration to a sighted user is only half the fix.
- **Fix: APPLIED.** The rail now carries a chevron that rotates when the panel opens, brightens on hover/focus, and the toggle grows its right padding toward the page to hint that it opens outward. All three are suppressed under `prefers-reduced-motion`. The "default open on desktop" half was deliberately *not* taken — it would cover the constellation on first paint, which is the one thing the first three seconds are for.

### 3. Two Vue lifecycle warnings appear on every desktop mount, and one screenshot pass showed the hero tagline stalling for 25+ seconds

- **What:** `[Vue warn] provide() can only be used inside setup()` and `[Vue warn] onUnmounted is called when there is no active component instance` both fire during `SceneRoot`'s mount. No app code calls `provide()` in the scene tree, and every `onUnmounted()` call in `src/components/scene/` is correctly placed at the top level of its own `<script setup>` — the source is almost certainly internal to `@tresjs/core`'s `<TresCanvas>` setup, and `enable-provide-bridge="false"` (`SceneRoot.vue:118`, already set, presumably as a prior workaround for related friction) doesn't suppress it.
- **What I do NOT know:** whether this is cosmetic or causally connected to the stalled tagline I observed in one screenshot pass (desktop hero stuck at `"Systems that act only a_"` for 25+ seconds against a `setTimeout`-driven chain that should complete in under a second). That specific run also showed repeated `GL Driver Message: GPU stall due to ReadPixels` from Chromium's SwiftShader software WebGL renderer, and this sandboxed environment has no GPU acceleration and broken outbound network to the Google Fonts / Geist Mono CDN — both of which are environment artifacts, not app bugs, and could plausibly account for the severity on their own.
- **Why it matters here:** *If* this reproduces on real hardware with real GPU acceleration — even at a fraction of the severity — it directly threatens Ground: a skeptical buyer giving the site sixty seconds on a real but modest device is exactly the visitor a main-thread stall during scene startup would lose first.
- **Fix:** **Not applied.** This needs verification on a real, GPU-accelerated browser before it's treated as confirmed — I'd want to use Claude-in-Chrome (the user's actual browser) rather than headless Playwright for that specific check, since headless/software-WebGL is the prime suspect for the exaggerated severity here. If it reproduces for real, the fix is almost certainly in how `SceneRoot`'s async chunk resolves relative to TresJS's Canvas setup — possibly wrapping the async component in `<Suspense>`, or investigating whether `@tresjs/core` has documented friction with `defineAsyncComponent`. I did not attempt a speculative fix because it touches the 3D scene's actual render path, which is much higher-risk than anything else in this pass, and I have not root-caused it with confidence.

## Ranked plan

Token-level first — a `:root` change often clears twenty component findings at once.

| Order | Change | Level | Expected effect | State |
|---|---|---|---|---|
| 1 | Move `BookingCta` off the legend's corner, or give the legend a reserved bottom offset that clears it | component (CSS position) | Removes the only visible defect a careful visitor would notice in the first screen | APPLIED |
| 2 | Verify the tagline-stall finding on real Chrome, not headless | investigation | Either closes the finding as environment-only, or surfaces a real Ground-relevant bug before a client ever hits it | **still open** — needs a GPU-accelerated browser, not this sandbox |
| 3 | Give `ProjectIndex` a discoverable affordance | component | Converts "technically accessible" into "actually used" | APPLIED |
| 4 | Bring `ServicesBlock`, `ProjectIndex`, and the Proof panel into the observation-log signature element | component, then possibly token | This is the bulk of `DESIGN_LOCK.md`'s actual payoff and is intentionally sequenced last — it's the biggest, most visible change and the one most worth the owner seeing a concept preview of first | APPLIED |

## What applying item 4 turned up

Two things worth recording, because neither was visible from the audit.

**A shared `ObservationLog` component now owns the motif** (`src/components/common/ObservationLog.vue`) rather than each surface re-implementing it. It takes `as="table"` for genuine data surfaces and `as="list"` for the index rail. That distinction is deliberate: the rail is navigation, and announcing a list of buttons as a table would make it *worse* for a screen reader while looking identical. The lock governs the visual shape; it does not get to override correct semantics.

**The entrance animation nearly shipped a blank page.** The obvious form — `opacity: 0` plus `animation: … forwards` — is unsafe in this codebase, because `plain.css` applies `animation: none !important` under `.plain-mode`. That combination made the whole Services block and every Proof metric permanently invisible at `?plain=1`, the crawlable and accessible backstop. **Typecheck and build were both clean**; only rendering the page and reading computed styles caught it. The safe form keeps the hidden state inside the keyframes with `backwards` fill. Recorded as a durable rule in `docs/MEMORY.md`.

This is also a caveat on this document's own method: a judgment-based audit reading source will not find that class of defect. It needs a rendered DOM.

## Deliberately not changing

| Thing | Why it stays |
|---|---|
| The glass-panel treatment (blur, saturation, crack/refraction overlay) | `DESIGN_LOCK.md`'s Rejected findings section already covers this — it's part of the existing identity and a candidate for a future pass, not a violation to fix now. |
| `--bg`'s literal near-black hex | Explicitly not borrowed from Warp's warmer tone — see `DESIGN_LOCK.md` Target. Core to the existing constellation identity. |
| Everything inside the WebGL scene itself | Out of this lock's scope; governed by `docs/DESIGN.md`. |
