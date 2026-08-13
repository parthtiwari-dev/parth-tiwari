# CLAUDE.md

Working instructions for this repository. Read `docs/ARCHITECTURE.md` before touching the scene layer, and `docs/DESIGN.md` before touching anything visual.

---

## What this project is

A personal portfolio for Parth Tiwari, built as a navigable universe rather than a page of cards. Nine projects exist as objects in 3D space.

**It is a lead generator, not a CV.** The goal is paid client work at ₹50k–1L per project, with traffic arriving from cold outreach. Job offers are a real but secondary goal. When a decision trades off between impressing a recruiter and converting a client, **the client wins** — see `docs/PRD.md` §1 for why that ordering serves both.

The organising principle is stated in the site itself and governs code decisions too:

> Systems should act only after the evidence, schema, budget, and workflow state agree.

Practically, that means: **do not add a visual that does not encode something true.** A star's position, size, color, and motion each carry meaning. Decoration that pretends to be data is the specific failure mode this project exists to avoid.

### Two rules that follow from the commercial goal

**Never gate contact behind the experience.** A booking action stays one tap from every screen, at every breakpoint, in every mode. The universe impresses; it must never be the only route to hiring him.

**Show before telling.** A screenshot outranks a paragraph; a working demo outranks a screenshot. Projects open with a visual and an outcome — the problem/architecture/proof/boundary panels are the second layer, not the opening move.

---

## Commands

```bash
npm install          # from lockfile
npm run dev          # Vite dev server
npm run typecheck    # vue-tsc -b --noEmit
npm run build        # typecheck + production build
npm run preview      # serve the production build
```

Before any commit that touches source:

```bash
npm run typecheck && npm run build
```

There is no test runner and no linter configured. Type checking and a clean build are the only automated gates, so they are not optional.

---

## Hard constraints

**Do not upgrade `three` or `@tresjs/core`.** Both are pinned (`0.165.0` / `4.3.1`). The scene, shaders, and post-processing chain depend on current API behavior. If an upgrade becomes necessary, it is its own PR with a full visual QA pass — never a drive-by bump inside a feature change.

**`particle.vert.glsl` hardcodes `uniform float uClusterBrightness[9]`** and reads it through a 9-branch if-chain, because GLSL ES 1.0 forbids dynamic indexing. **Adding a 10th project breaks this silently.** If the project count changes, that array length and the branch chain must change with it.

**Never add a project link that is not confirmed public and safe.** Private repos, company endpoints, internal URLs, account data, and unreviewed deployments stay out. An empty links panel is correct behavior, not a bug to paper over.

**Never assume `<project>.vercel.app` is ours.** Short aliases are claimed globally. This has already bitten twice:

- `vivid.vercel.app` returns 200 and belongs to someone else; ours is `vivid-alpha.vercel.app`.
- **`parth-tiwari.vercel.app` is not ours either** — this very site lives at `parth-tiwari-1.vercel.app`. Every canonical, OG and JSON-LD URL pointed at the stranger's host until it was caught.

Always resolve the production alias from the Vercel project's `domains` array, confirm 200 without auth, and confirm ownership before linking.

**Never invent social proof.** No fabricated testimonials, no estimated metrics, no implied clients. The testimonial slot stays empty until a real quote exists. A site whose thesis is evidence cannot fake its own.

**The site URL lives in exactly one constant.** It feeds canonical, OG, Twitter, JSON-LD and the sitemap. `parthtiwari.com` is planned — do not scatter the URL across files again.

---

## Conventions

### Components
Vue 3 `<script setup lang="ts">` SFCs. Scoped styles. No Options API, no global component registration.

Scene components that drive Three.js imperatively use an **empty template** and do their work in `setup`. Keep that pattern — it is why the renderless controllers do not warn.

### Styling
All color and spacing comes from `src/styles/tokens.css`. Do not hardcode a hex or rgba that a token already defines.

This rule is currently violated heavily — `--ice` appears as a raw literal 35 times across 15 files. When you touch a file, replace the literals you find in it. Do not add new ones.

Tailwind's config carries no theme extension, so tokens are reached via the escape-hatch form: `text-[color:var(--ice)]`. If you extend the Tailwind theme to fix this, migrate call sites in the same change rather than leaving two idioms alive.

### The 3D layer must read the same palette as the DOM
Star colors are currently hardcoded hexes in `ConstellationNodes.vue` that do not match the legend swatches describing them. Any new scene color reads from tokens.

### Breakpoints
Nine distinct width thresholds exist today. Do not add a tenth. Use the shared breakpoint tokens; if the one you need does not exist, add it centrally rather than inline.

The 768–820px range is a known dead zone (desktop scene + mobile nav + no mobile content). Any responsive change must be checked at 800px.

### Motion
Every animation needs a `prefers-reduced-motion: reduce` path, and it must be a *real* fallback — final state shown immediately, not just a shorter duration. This is already done well across the codebase; keep the standard.

### Accessibility
New overlays need: `role="dialog"`, `aria-modal`, focus moved in on open, **focus trapped while open**, **focus restored to the trigger on close**, and Escape to dismiss. The first two exist today; the trap and restoration do not — do not ship a new overlay that repeats that gap.

Never use `outline: none` without an equally visible replacement focus indicator.

Any interaction reachable by hover must also be reachable, **and dismissable**, by touch. `CapabilityMap` currently fails this — chips can be selected by tap but only cleared by `mouseleave`.

---

## Content

`src/data/projects.ts` is the single source of truth for the nine projects. Node metadata, panel copy, stack, links, and artifacts all live there. Prefer changing data over changing components.

Supporting data files: `about.ts`, `training.ts`, `capabilities.ts`, `socialLinks.ts`, `resume.ts`, `projectLinks.ts`.

The project count appears as hardcoded prose in `EvidenceTopBar.vue` and `MobileFooterDock.vue` ("9 SYSTEMS"). `BootSequence` derives it correctly from `projectStore.projectCount` — follow that example.

---

## Known dead code

Do not build on these; remove them when you are in the neighbourhood:

- `isOverlayReadyProject` — always returns `true`; three call sites branch on it as if it gates something.
- `CopiedToast` — mounted with a literal `:show="false"`.
- `RefusalRipple` — renders at alpha ×0.004 on an unconnected 30-second timer.
- `GlassPanel`, `GeistChip`, `StatusBadge`, `MetricCountUp` — reachable only via `?debug=1`.
- Tokens `--bg-lift`, `--bg-bridge`, `--bg-nebula`, `--surface-glass`, `--surface-glass-hover`, `--teal-deep`, `--cold`.
- `NodeRuntimeState.ringState` / `colorState` — written every frame, read by nothing.

**Used but undefined** (silently no-ops, should be fixed not removed): `--active-glow`, and `--font-mono` / `--font-display` / `--font-body` in `PlainExperience.vue`.

**Dormant but not dead:** `sliderStore`, `sliderConfigs`, and `sliderResponse` are unused today but are being revived as the Cost of Intelligence control inside the Proof panel (`docs/PLAN.md` 3.8). Do not delete them.

---

## Naming

The site is **EPHEMERIS**. `EVIDENCEBOUND` is retired — if you find it in the boot sequence, top bar, overlay eyebrows, `index.html` metadata, or `og.png`, it is stale and should be updated.

An ephemeris is a table of computed positions of celestial bodies. The name states the design rule: positions are derived from data, never placed by hand.

---

## Routes and modes

There is no router. Three modes, all on `/`:

| Mode | Trigger | Purpose |
|---|---|---|
| Full | default | The universe |
| Plain | `?plain=1` | Static, crawlable, printable. No 3D, no animation. |
| Debug | `?debug=1` | Legacy console surface |

**Plain mode must stay complete.** It is the accessibility and SEO backstop — every piece of content reachable in the full experience must also be reachable there. When you add content, add it to `PlainExperience.vue` too.

---

## Performance

The sky shader (`iridescent.frag.glsl`) runs roughly 84 noise evaluations per fragment, fullscreen, every frame, and is not quality-tiered. It is the largest GPU cost in the app. Treat any addition to it as a performance decision.

Known leak to respect when editing `ConstellationNodes.vue`: `onUnmounted` disposes geometries and materials but **not the `PointLight`s**.

`ConnectorLines` reallocates an array of objects every frame, triggering full Vue reactivity per rAF — for all pairs, even though lines only render on hover.

Four independent animation clocks currently run (GSAP ScrollTrigger, TresJS `useLoop`, raw rAF in DOM overlays, and a separate rAF in `MobileStarWorld`). `ScenePauseController` pauses only the TresJS one. Do not add a fifth.

---

## Git

Work on feature branches. Commit messages are lowercase, imperative, prefixed by type (`feat:`, `fix:`, `polish:`, `docs:`, `chore:`) — match the existing history.

Do not open a pull request unless asked.

---

## Deployment

Vercel, project `parth-tiwari`, static SPA off `main`. `vercel.json` handles the SPA rewrite and asset cache headers. No environment variables are required.

Web Analytics is **not currently enabled**, so there is no real usage data behind any UX claim. Treat assertions about "how people use the site" as untested until it is.
