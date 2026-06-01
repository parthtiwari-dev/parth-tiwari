# EVIDENCEBOUND — parth-tiwari Build Roadmap

---

## Confirmed Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Vue 3 (Composition API, `<script setup>`) | ^3.4.x |
| Build | Vite | ^5.x |
| Language | TypeScript | ^5.4.x |
| 3D | Three.js | ^0.165.x |
| 3D Vue wrapper | TresJS | pin to latest stable at init — document in README |
| Animation | GSAP (no Club plugins) | ^3.12.x |
| Scroll animation | GSAP ScrollTrigger | ^3.12.x |
| State | Pinia | ^2.x |
| Styling | Tailwind CSS | v4.x |
| Fonts | Spectral + Inter (Google Fonts CDN), Geist Mono (Vercel CDN) | — |
| Deployment | Vercel | free tier, static |

No SplitText. No Howler.js. No Temporal in frontend code (backend only, listed in capability map as skill). Audio deferred to v2.

---

## Full File and Folder Structure

```
parth-tiwari/
├── public/
│   ├── favicon.svg                        # EB hexagonal mark, generated as SVG code
│   └── og.png                             # 1200×630 static OG image — CRYO-GOLD field + EVIDENCEBOUND · Parth Tiwari in Spectral
│
├── src/
│   ├── types/
│   │   ├── project.ts                     # All project interfaces (canonical)
│   │   ├── slider.ts                      # CostOfIntelligence slider interface
│   │   └── node.ts                        # Constellation node spatial config
│   │
│   ├── data/
│   │   └── projects.ts                    # All 9 Project objects, typed. Single source of truth.
│   │
│   ├── stores/
│   │   ├── projectStore.ts                # Project data, active project, overlay state
│   │   ├── overlayStore.ts                # Film strip open/closed, active panel index
│   │   └── sliderStore.ts                 # 5 slider values, read by Three.js render loop
│   │
│   ├── composables/
│   │   ├── usePlainMode.ts                # Reads window.location.search at init, returns readonly isPlain
│   │   ├── useCharacterSplit.ts           # Manual char-split typewriter, no SplitText
│   │   ├── useBootSequence.ts             # Boot line stagger, skip logic, reduced-motion gate
│   │   ├── useCameraPath.ts               # CatmullRomCurve3 definition + ScrollTrigger scrub
│   │   ├── useParticleField.ts            # BufferGeometry points, simplex noise drift, cluster zones
│   │   ├── useNodeInteraction.ts          # Raycaster hover/click on constellation nodes
│   │   ├── useScrollTrigger.ts            # Shared ScrollTrigger registration/cleanup wrapper
│   │   └── useCountUp.ts                  # GSAP .to() count-up for metrics, gold sweep
│   │
│   ├── shaders/
│   │   ├── iridescent.vert.glsl           # Pass-through vertex shader for background plane
│   │   ├── iridescent.frag.glsl           # @property hue-shift iridescence on 3D background
│   │   ├── particle.vert.glsl             # Particle size, opacity, cluster brightness uniform
│   │   ├── particle.frag.glsl             # Soft circle point sprite
│   │   ├── refusalRipple.vert.glsl        # Radial wave displacement from world center
│   │   └── refusalRipple.frag.glsl        # Opacity envelope for ripple, uTime driven
│   │
│   ├── styles/
│   │   ├── tokens.css                     # All CRYO-GOLD CSS custom properties
│   │   ├── typography.css                 # Font-face imports, --text-* scale, role assignments
│   │   ├── glass.css                      # .glass-panel: backdrop-filter, @property shimmer
│   │   ├── cursor.css                     # cursor: none on html, custom cursor element styles
│   │   └── plain.css                      # ?plain=1 overrides — white bg, zero animation, Tailwind only
│   │
│   ├── components/
│   │   │
│   │   ├── boot/
│   │   │   └── BootSequence.vue           # Terminal lines, stagger, skip button, reduced-motion gate
│   │   │
│   │   ├── cursor/
│   │   │   └── CustomCursor.vue           # Global cursor element: crosshair / ENTER circle / ⊘
│   │   │
│   │   ├── hero/
│   │   │   ├── HeroSection.vue            # Full-viewport wrapper, name + tagline + scroll cue
│   │   │   ├── HeroName.vue               # Spectral 300 light, letter-spacing 0.08em
│   │   │   ├── HeroTagline.vue            # useCharacterSplit typewriter on mount
│   │   │   └── EvidenceDataBar.vue        # Fixed bottom bar, always visible after 1 scroll unit
│   │   │
│   │   ├── scene/
│   │   │   ├── SceneRoot.vue              # TresCanvas, renderer config, postprocessing if any
│   │   │   ├── ParticleField.vue          # useParticleField, BufferGeometry, particle shader
│   │   │   ├── IridescentBackground.vue   # Full-scene background plane, iridescent shader
│   │   │   ├── RefusalRipple.vue          # ShaderMaterial plane, uTime, 30s interval trigger
│   │   │   ├── ConstellationNodes.vue     # 9 instanced spheres, raycaster, hover/click states
│   │   │   ├── ConnectorLines.vue         # SVG-overlay lines between related nodes (DOM, not 3D)
│   │   │   └── NodeLabel.vue              # Per-node: name + tagline + [ENTER →], clip-path wipe
│   │   │
│   │   ├── constellation/
│   │   │   ├── ConstellationSection.vue   # Scroll container, camera path trigger, legend
│   │   │   └── ConstellationLegend.vue    # ● COMPLETE  ◎ ACTIVE  ○ EXPERIENCE — Geist Mono
│   │   │
│   │   ├── overlay/
│   │   │   ├── ProjectOverlay.vue         # Full-viewport overlay, clip-path entrance, close
│   │   │   ├── FilmStripHeader.vue        # EVIDENCEBOUND › [NAME] · [01/04] · [← →] · [✕]
│   │   │   ├── FilmStrip.vue              # Horizontal 4-panel container, scroll/key navigation
│   │   │   └── panels/
│   │   │       ├── PanelProblem.vue       # Spectral quote + SVG broken-flow animation
│   │   │       ├── PanelArchitecture.vue  # Animated architecture diagram, stack chips
│   │   │       ├── PanelProof.vue         # Metrics count-up OR milestone progress (status-gated)
│   │   │       └── PanelBoundary.vue      # Refusal line, will/refuses lists, cursor swap, links
│   │   │
│   │   ├── cost/
│   │   │   ├── CostOfIntelligence.vue     # Pinned section wrapper, glass panel, intro text
│   │   │   └── CostSlider.vue             # Individual slider: label, Geist Mono value, gold track
│   │   │
│   │   ├── experience/
│   │   │   └── ExperienceLog.vue          # Work timeline overlay, artifacts, public-safe boundaries
│   │   │
│   │   ├── training-data/
│   │   │   ├── TrainingData.vue           # Section header, card list
│   │   │   └── TrainingCard.vue           # Smaller glass card, institution, degree, chips
│   │   │
│   │   ├── capability-map/
│   │   │   ├── CapabilityMap.vue          # Section header, 5-column grid
│   │   │   └── CapabilityGroup.vue        # Group header + skill chips, hover → highlight nodes
│   │   │
│   │   ├── about/
│   │   │   ├── AboutSection.vue           # Two-column layout wrapper
│   │   │   ├── ThesisStatement.vue        # Spectral --text-xl thesis + 2×2 proof chips
│   │   │   ├── WhoamiTerminal.vue         # Geist Mono auto-type whoami output
│   │   │   └── ContactLine.vue            # Email + GitHub, copy-on-click, CopiedToast
│   │   │
│   │   └── shared/
│   │       ├── GlassPanel.vue             # backdrop-filter glass surface, @property shimmer
│   │       ├── GeistChip.vue              # Tiny Geist Mono pill — stack, metric, status variants
│   │       ├── MetricCountUp.vue          # useCountUp wrapper, gold sweep background-clip
│   │       ├── StatusBadge.vue            # [● ACTIVE] / [◎ IN FIELD] / [✓ COMPLETE]
│   │       └── CopiedToast.vue            # [copied] toast, 1.5s auto-dismiss
│   │
│   ├── App.vue                            # Root: BootSequence gate, CustomCursor, SceneRoot, sections
│   └── main.ts                            # createApp, Pinia, GSAP plugin registration
│
├── index.html                             # Font preconnect links, meta tags, canonical
├── vite.config.ts                         # glsl plugin, path aliases, build config
├── tsconfig.json
├── tailwind.config.ts
└── README.md                              # TresJS pinned version, build/deploy instructions
```

---

## TypeScript Data Model

### `src/types/project.ts`

```typescript
export type ProjectStatus = 'complete' | 'active' | 'in-progress' | 'experience'

export type ProjectNodeKind =
  | 'personal-project'
  | 'work-experience'
  | 'utility'
  | 'current-build'

export type ProjectOrigin = 'personal' | 'work'

export type ProjectWeight = 'flagship' | 'major' | 'minor'

export type NodeSize =
  | 'large'
  | 'medium-large'
  | 'medium'
  | 'medium-small'
  | 'small'
  | 'tiny'

export interface ProjectMetric {
  label: string       // e.g. "RAGAS Faithfulness"
  value: number       // raw number for count-up: 0.9753
  display: string     // formatted display: "0.9753"
  unit?: string       // optional suffix: "%", "ms", "$"
}

export interface ProjectMilestone {
  label: string       // e.g. "MTC data"
  status: 'complete' | 'active' | 'roadmap'
  detail?: string     // e.g. "v0.2"
}

export interface ArchitectureNode {
  id: string
  label: string
  description: string        // shown on hover
  stackChips?: string[]      // chips floating near this box
  connections: string[]      // ids of nodes this connects to
  position: { x: number; y: number }  // percentage-based, 0–100
}

export interface BoundaryItem {
  side: 'will' | 'refuses'
  text: string
}

export interface PanelProblem {
  quote: string              // Spectral italic large quote
  brokenFlowId: string       // key for which SVG animation component to render
}

export interface PanelArchitecture {
  nodes: ArchitectureNode[]
  summary?: string
}

export interface PanelProof {
  // complete projects
  metrics?: ProjectMetric[]
  radialMetricId?: string    // which radial gauge SVG to render
  caveat?: string            // known-limitation chip
  // in-progress projects
  milestones?: ProjectMilestone[]
  progressPercent?: number
}

export interface PanelBoundary {
  items: BoundaryItem[]
}

export interface ProjectPanels {
  problem: PanelProblem
  architecture: PanelArchitecture
  proof: PanelProof
  boundary: PanelBoundary
}

export interface ProjectArtifact {
  id: string
  name: string
  label: string
  summary: string
  stack?: string[]
  proof?: string[]
  boundary?: string[]
}

export interface ProjectLinks {
  github?: string
  liveUI?: string
  liveAPI?: string
  apiDocs?: string
  demoVideo?: string
  caseStudy?: string
  docs?: string
  deployment?: string
}

export interface ConstellationNodeConfig {
  position: { x: number; y: number; z: number }  // world space
  size: NodeSize
  relatedIds: string[]   // project ids for connector lines
}

export interface SliderResponse {
  sliderId: SliderKey
  affects: 'color' | 'size' | 'both'
}

export interface Project {
  id: string                        // slug: 'secondself', 'medrag', etc.
  name: string                      // display name: 'SecondSelf'
  tagline: string                   // one-line label shown in node hover
  status: ProjectStatus
  nodeKind: ProjectNodeKind         // personal-project, work-experience, utility, current-build
  origin: ProjectOrigin             // personal or work evidence
  weight: ProjectWeight             // flagship, major, minor; maps to visual importance
  stack: string[]
  links: ProjectLinks
  panels: ProjectPanels
  artifacts?: ProjectArtifact[]     // child evidence under work/experience nodes
  node: ConstellationNodeConfig
  sliderResponse?: SliderResponse
}
```

### `src/types/slider.ts`

```typescript
export type SliderKey =
  | 'evidenceStrictness'
  | 'latencyBudget'
  | 'costPerQuery'
  | 'alertBudget'
  | 'automationVsControl'

export interface SliderConfig {
  key: SliderKey
  labelLeft: string
  labelRight: string
  metricLabel: string          // e.g. "precision"
  metricValue: string          // actual value from project: "92.06%"
  metricContext: string        // e.g. "at 0.5% alert budget"
  affectedProjectId: string    // which constellation node reacts
}
```

### `src/types/node.ts`

```typescript
export type NodeRingState = 'solid' | 'pulsing-amber' | 'blinking-live' | 'static-faint'

export interface NodeRuntimeState {
  projectId: string
  scale: number               // base scale, modified by slider
  colorState: 'gold' | 'teal-active' | 'ice-muted' | 'ice-faint' | 'amber'
  ringState: NodeRingState
  clusterBrightness: number   // 0.0–1.0
  hovered: boolean
  active: boolean             // camera has arrived here
}
```

## World Space Layout

### 9 Node Positions (Three.js XYZ)

Camera path: `(0,10,28) → (2,8,22) → (−1,5,15) → (0,2,6) → (0,1,−3)`
Camera flies in from high-and-behind, arcs down into the field, lands near SecondSelf.

| Project | x | y | z | Size |
|---|---|---|---|---|
| SecondSelf | 0 | 0 | 2 | large |
| Stick and Dot | −5 | 0.5 | 4 | large |
| QueryPilot | 5 | 0.3 | 4 | medium-large |
| UPI Fraud Engine | −4 | −0.3 | 8 | medium |
| MedRAG | 3.5 | 1.0 | 8 | medium |
| OncoVerse | 1.5 | 2.5 | 12 | medium-small |
| Order Supervisor | −6 | 0.2 | 16 | small |
| Fraud Risk Intel | 5.0 | −0.5 | 16 | small |
| Oracle Auto Provision | −2 | 1.5 | 20 | tiny |

### Connector Lines (SVG overlay, not 3D geometry)

| From | To | Rationale |
|---|---|---|
| SecondSelf | MedRAG | Evidence-grounded retrieval |
| SecondSelf | QueryPilot | Correction loop architecture |
| QueryPilot | UPI Fraud Engine | Constraint enforcement pattern |
| MedRAG | Fraud Risk Intel | Explainability focus |
| Stick and Dot | OncoVerse | Shared Three.js/diffusion tooling |
| Oracle Auto Provision | SecondSelf | Infrastructure dependency |

Connector opacity: 0.08, color: `--ice-faint`. Drawn as SVG `<line>` elements projected from 3D world coords to screen coords via `camera.project()` each frame.

**`isPaused` flag:** `SceneRoot.vue` exposes a boolean `isPaused` that is set to `true` when `overlayStore.isOpen === true`. While `isPaused`, the `camera.project()` SVG sync in `ConnectorLines.vue` is skipped — the overlay covers the constellation entirely, so projection is wasted work. Reset to `false` on overlay close.

---

## Phase 1.9 — Constellation Information Architecture Lock

This phase locks what each constellation node means before Phase 2 overlays are built.

### Node Kinds

Every node has a `nodeKind`:

| Kind | Meaning |
|---|---|
| `personal-project` | A self-owned system or portfolio project |
| `work-experience` | A company/internship/work container node with child artifacts |
| `utility` | A small infrastructure/tooling artifact |
| `current-build` | An active product direction still under construction |

### Node Weight

Every node has a `weight`:

| Weight | Meaning |
|---|---|
| `flagship` | Identity-level evidence; largest visual importance |
| `major` | Strong portfolio system evidence |
| `minor` | Supporting evidence, utility, or earlier/smaller work |

### Stick and Dot Work Node

`Stick and Dot` replaces `Vivid` as the standalone constellation node. `Vivid` remains a featured child artifact inside that work-experience node.

Stick and Dot node:

- `id`: `stick-and-dot`
- `nodeKind`: `work-experience`
- `origin`: `work`
- `weight`: `flagship`
- Tagline: `AI/ML Development Intern: Vivid storyboard AI + editorial platform.`
- Child artifacts:
  - `Vivid`
  - `Stick and Dot App`

Phase 2 overlays must support both project overlays and work-experience overlays. The Stick and Dot overlay uses:

1. Role/problem
2. Vivid architecture
3. Stick and Dot App/product evidence
4. Boundaries and what not to claim

### Constellation Readout

The scene includes a quiet readout:

```
CONSTELLATION INDEX
[gold dot] personal project
[teal dot] work experience
[amber dot] currently building
[ember dot] utility / tooling
bigger node = stronger evidence
```

Node color follows `nodeKind`; status remains lifecycle/proof state. This keeps `SecondSelf` gold as a personal flagship even while its status is `active`, and keeps `Stick and Dot` teal as work experience even when its evidence is complete.

No 10th node is added for Stick and Dot App. It is evidence under the Stick and Dot work node.

Sky-dome shader rule: large nebula and star layers must use direction-based or triplanar procedural coordinates, not sphere UV bands, so every camera angle has complete depth and no back-wall seam or pole convergence.

---

## CRYO-GOLD Token File

### `src/styles/tokens.css`

```css
:root {
  /* ── BACKGROUND ── */
  --bg:                #0c1a20;
  --surface-glass:     rgba(240, 244, 247, 0.06);
  --surface-glass-hover: rgba(240, 244, 247, 0.10);

  /* ── ICE SCALE ── */
  --ice:               #d8eaf0;
  --ice-muted:         #7fa8b8;
  --ice-faint:         #2e4f5e;

  /* ── TEAL DEPTH ── */
  --teal-deep:         #0d3d47;
  --teal-active:       #1a6b7a;

  /* ── GOLD ── */
  --gold:              #c9a84c;
  --gold-glow:         #e8c86a;

  /* ── COLD / REFUSAL ── */
  --cold:              #2a3d4a;
  --cold-text:         #4a6070;

  /* ── AMBER (in-progress only) ── */
  --amber:             #d4956a;
  --amber-glow:        #e8b08a;

  /* ── TYPOGRAPHY SCALE ── */
  --text-hero:         clamp(3rem, 8vw, 8rem);
  --text-2xl:          clamp(2rem, 4vw, 3.5rem);
  --text-xl:           clamp(1.5rem, 2.5vw, 2.5rem);
  --text-base:         1rem;
  --text-sm:           0.875rem;
  --text-xs:           0.75rem;

  /* ── TIMING ── */
  --ease-out-expo:     cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in-out:       cubic-bezier(0.4, 0, 0.2, 1);
}

@property --shimmer-pos {
  syntax: '<percentage>';
  inherits: false;
  initial-value: -100%;
}
```

---

## Typography Assignments

| Role | Font | Size Token | Weight | Context |
|---|---|---|---|---|
| Display / Hero | Spectral | `--text-hero` | 300 | Site name, hero headline |
| Section titles | Spectral italic | `--text-2xl` | 400 | Project names, section heads |
| Thesis / About | Spectral | `--text-xl` | 300 | About statement |
| Body / UI | Inter | `--text-base` | 400/500 | Descriptions, bullets, body |
| Code / Metrics | Geist Mono | `--text-sm` | 400 | Stack names, metric values, status |
| Labels / Stamps | Inter uppercase | `--text-xs` | 600 | STATUS: LIVE, badge text |
| Typewriter output | Geist Mono | `--text-sm` | 400 | Boot sequence, whoami terminal |

---

## Phase 0 — Design System

**Goal:** All tokens, typography, glass surface, primitive shared components, and data model defined and committed before any 3D or section work begins.

**Effort:** 2–3 days

### Deliverables

1. `src/styles/tokens.css` — full CRYO-GOLD token set
2. `src/styles/typography.css` — `@import` Google Fonts, Geist Mono, all role assignments
3. `src/styles/glass.css` — `.glass-panel` class: `backdrop-filter: blur(12px)`, `background: var(--surface-glass)`, `@property` shimmer on `::after`
4. `src/styles/cursor.css` — `html { cursor: none }`, custom cursor element, state classes
5. `src/styles/plain.css` — `?plain=1` full override: `--bg: #ffffff`, all animations to `none`, Tailwind-only layout
6. `vite.config.ts` — `vite-plugin-glsl` for shader imports, `@` alias to `src/`
7. `src/types/project.ts`, `src/types/slider.ts`, `src/types/node.ts` — all interfaces
8. `src/data/projects.ts` — all 9 `Project` objects populated to 100% (data-first rule)
9. `src/composables/usePlainMode.ts`
11. Shared components: `GlassPanel.vue`, `GeistChip.vue`, `MetricCountUp.vue`, `StatusBadge.vue`, `CopiedToast.vue`
12. `public/favicon.svg` — EB hexagonal mark

### EB Logo SVG Specification

Hexagon with flat top. 6 vertices. One edge on the lower-right has a 2px break — a diagonal line cuts across it at 45° inward, representing the refusal boundary. `EB` centered in Geist Mono inside. Monochrome: stroke `var(--ice)`, fill transparent. Renders cleanly at 16px and 400px.

### `src/composables/usePlainMode.ts`

```typescript
import { readonly, ref } from 'vue'

const isPlain = ref(false)

export function usePlainMode() {
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search)
    isPlain.value = params.has('plain') && params.get('plain') === '1'
  }
  return { isPlain: readonly(isPlain) }
}
```

### Acceptance Criteria — Phase 0

- [ ] All CSS variables render correctly in browser DevTools
- [ ] `.glass-panel` shimmer animates on a test div
- [ ] `usePlainMode()` returns `true` at `localhost:5173?plain=1`, `false` otherwise
- [ ] All 9 `Project` objects pass TypeScript strict compile with zero `any`
- [ ] `favicon.svg` renders at 16px and 32px without aliasing
- [ ] `public/og.png` exists at 1200×630, readable at thumbnail size

---

## Phase 1 — Core 3D Infrastructure

**Goal:** Three.js world alive and stable. Particle field drifting. Camera path defined. Shaders compiling. No content yet — just the world.

**Effort:** 5–7 days

### Build Order

1. `SceneRoot.vue` — TresCanvas, renderer settings (antialias, alpha, tone mapping)
2. `IridescentBackground.vue` — full-scene background plane with iridescent fragment shader
3. `useParticleField.ts` + `ParticleField.vue` — particle counts by hardware tier
4. `RefusalRipple.vue` — ShaderMaterial, uTime, 30s interval
5. `useCameraPath.ts` — CatmullRomCurve3, ScrollTrigger scrub
6. `ConstellationNodes.vue` — 9 instanced spheres at defined world positions, size mapping
7. `useNodeInteraction.ts` — Raycaster, hover state, click dispatch

### Particle Count by Hardware Tier

```typescript
function getParticleCount(): number {
  const cores = navigator.hardwareConcurrency ?? 4
  if (cores >= 12) return 10_000
  if (cores >= 6)  return 5_000
  return 2_000
}
```

### GLSL Shader Contracts

**`iridescent.frag.glsl`**
- Uniforms: `uTime: float`, `uHueShift: float` (driven by CSS `@property` value read via JS at 60fps)
- Output: Subtle iridescent shimmer on a dark `#0c1a20` base. Hue cycles 0°→360° over 8s. Max saturation 15% to stay subliminal.
- Technique: `mix(baseColor, hsl(uHueShift, 0.15, 0.12), 0.3)`

**`particle.vert.glsl`**
- Attributes: `position`, `aClusterIndex`
- Uniforms: `uTime`, `uClusterBrightness[9]` (per-cluster brightness for hover effect), `uPointSize`
- Output: Simplex noise drift on position, size by cluster importance

**`refusalRipple.frag.glsl`**
- Uniforms: `uTime`, `uActive: float` (0 or 1, set to 1 every 30s for 3s duration)
- Output: Radial wave from `vec2(0.5, 0.5)`, opacity envelope max 0.08

### Camera Path

```typescript
// src/composables/useCameraPath.ts
import * as THREE from 'three'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const CONTROL_POINTS = [
  new THREE.Vector3(0, 10, 28),
  new THREE.Vector3(2, 8, 22),
  new THREE.Vector3(-1, 5, 15),
  new THREE.Vector3(0, 2, 6),
  new THREE.Vector3(0, 1, -3),
]

export function useCameraPath(camera: THREE.Camera) {
  const curve = new THREE.CatmullRomCurve3(CONTROL_POINTS)
  const progress = { t: 0 }

  ScrollTrigger.create({
    trigger: '#constellation-section',
    start: 'top top',
    end: 'bottom bottom',
    scrub: 1.5,
    onUpdate: (self) => {
      progress.t = self.progress
      const point = curve.getPoint(progress.t)
      camera.position.copy(point)
      // Camera always looks toward SecondSelf node (0, 0, 2) with slight offset
      const lookTarget = new THREE.Vector3(0, 0, 2)
      camera.lookAt(lookTarget)
    }
  })

  return { curve, progress }
}
```

### Node Size to Three.js Radius Mapping

| Size | Sphere Radius |
|---|---|
| large | 0.35 |
| medium-large | 0.28 |
| medium | 0.22 |
| medium-small | 0.18 |
| small | 0.14 |
| tiny | 0.09 |

Renderer rule: keep data sizes as above, but apply a small-size visibility floor after `NODE_VISUAL_SCALE` so `medium-small`, `small`, and `tiny` nodes remain distinguishable from the star field. This preserves the evidence-weight hierarchy while preventing minor nodes from disappearing in dense space scenes.

### Acceptance Criteria — Phase 1

- [ ] Scene renders at 60fps on target hardware (Chrome, 1080p, mid-tier laptop)
- [ ] Particle field drifts visibly without jitter
- [ ] Camera travels along path as user scrolls through constellation section
- [ ] All 9 nodes visible at correct positions
- [ ] Node hover: scale 1.4×, cluster brighten, label appears (stub label, content later)
- [ ] Refusal ripple fires every 30s, opacity never exceeds 0.08
- [ ] Iridescent background hue-shifts subtly over 8s loop
- [ ] No console errors. Zero TypeScript errors.

---

## Phase 2 — Sections

**Goal:** All 11 content sections built, populated with real data, and rendering correctly. 3D interactions connected. No micro-interactions yet — those are Phase 3.

**Effort:** 7–10 days

### Build Order (strict — data-before-components rule)

1. Boot Sequence
2. Hero + EvidenceDataBar
3. Constellation section wrapper + legend
4. Project/Experience Overlay + FilmStrip (all 9 nodes × 4 panels)
5. Cost of Intelligence (sliders + reactive 3D binding)
6. Experience Overlay
7. Training Data
8. Capability Map
9. About + Contact

---

### Section 1 — Boot Sequence

**Component:** `BootSequence.vue`

Lines pulled dynamically from `projects.ts`:

```
> initializing evidence field...    ████████░░  80%
> loading [n] systems...            ████████████ 100%
> all gates standing by
```

Where `[n]` is `projects.length` from the store.

- `prefers-reduced-motion: reduce` → skip directly to world, no boot
- `usePlainMode().isPlain === true` → skip directly to world
- Skip button appears at 0.5s, positioned bottom-right, Geist Mono `--text-xs`
- On skip: `gsap.to(bootEl, { opacity: 0, duration: 0.3 })` then `display: none`
- GSAP timeline: each line `opacity: 0 → 1`, stagger 200ms, starts at page load

---

### Section 2 — Hero

**Components:** `HeroSection.vue`, `HeroName.vue`, `HeroTagline.vue`

- `HeroName.vue`: `PARTH TIWARI` in Spectral 300, `--text-hero`, letter-spacing `0.08em`. No entrance animation — exists on world snap.
- `HeroTagline.vue`: Uses `useCharacterSplit` — on mount, types each character at 18ms interval. `isPlain` gates: render full string immediately.
- Scroll indicator: `↓ scroll to enter the field` in Geist Mono `--text-xs`, `--ice-faint`. Pulsing `opacity: 0.4 → 1.0 → 0.4` at 2s interval. Removed on first `wheel` or `touchmove` event.

**`useCharacterSplit.ts`**

```typescript
export function useCharacterSplit(
  text: string,
  msPerChar: number,
  onComplete?: () => void
) {
  const displayed = ref('')
  let i = 0
  const tick = () => {
    if (i < text.length) {
      displayed.value += text[i++]
      setTimeout(tick, msPerChar)
    } else {
      onComplete?.()
    }
  }
  return { displayed, start: tick }
}
```

---

### Section 3 — Evidence Data Bar

**Component:** `EvidenceDataBar.vue`

- Fixed, bottom of viewport. `position: fixed; bottom: 0; left: 0; right: 0; z-index: 100`
- Hidden until user scrolls 1 scroll unit (`ScrollTrigger` with `start: 'top -1px'`)
- `backdrop-filter: blur(8px)` behind it
- Content (static copy, manually updated):

```
[FIELD ONLINE]  avg faithfulness 0.91  ·  9 systems  ·  4 refusals enforced  ·  $0.17 total inference cost
```

- Numbers: `--gold`. Text: `--ice-faint`. All Geist Mono `--text-xs`.
- On page load, numbers count up once from 0 using `useCountUp`. After that, static.
- `isPlain` gates: render as static text div, `background: #f9f9f9`, no blur.

---

### Section 4 — Project / Experience Overlay (Film Strip)

**Components:** `ProjectOverlay.vue`, `FilmStrip.vue`, `FilmStripHeader.vue`, panels ×4

Triggered by clicking any constellation node via `overlayStore.open(projectId)`. The overlay label and copy adapt to `project.nodeKind`, so personal projects and work-experience nodes use the same film-strip shell without pretending they are the same kind of evidence.

**Work-experience node rule:** A `work-experience` node can include `artifacts[]`. For `stick-and-dot`, Vivid and Stick and Dot App are child artifacts inside the one work node, not additional constellation nodes.

**Stick and Dot panel mapping:**
- Panel 1: role/problem
- Panel 2: Vivid architecture
- Panel 3: Stick and Dot App/product evidence
- Panel 4: boundaries/what not to claim

**Entrance animation (Phase 3):** `clip-path: inset(100% 0 0 0) → inset(0 0 0 0)`, 400ms `--ease-out-expo`.

**Film strip navigation:**
- Desktop: ← → arrow keys, mouse scroll within overlay
- Mobile: swipe gesture (touch delta threshold 50px)
- Panel counter in header: `[01 / 04]` updates reactively

**Panel transitions:** `clip-path: inset(0 100% 0 0) → inset(0 0 0 0)`, 400ms `--ease-out-expo`.

**PanelProblem.vue:**
- Left 50%: Spectral italic at `--text-2xl`, `--cold` temperature. Quote pulled from `panels.problem.quote`.
- Right 50%: SVG broken-flow animation keyed by `panels.problem.brokenFlowId`. Each project has its own SVG component: `BrokenFlowHallucination.vue`, `BrokenFlowSQLFail.vue`, `BrokenFlowFraud.vue`, etc.
- SVG animation: `stroke-dashoffset` from `stroke-dasharray` length → 0 on panel enter

**PanelArchitecture.vue:**
- Positioned boxes from `panels.architecture.nodes[*].position` (percentage-based)
- Connecting lines: SVG `<line>` elements between box centers
- Stagger entrance: GSAP `stagger: 80ms` per box, then lines draw
- Stack chips: Geist Mono `--text-xs`, `--gold` border, float near their node
- Hover a box: scale `1.05`, show `.description`

**PanelProof.vue — Status gate:**

```typescript
const isInProgress = computed(() =>
  props.project.status === 'in-progress' || props.project.status === 'active'
)
```

- `isInProgress === false`: 3 metrics as giant Geist Mono, count-up on panel enter, radial gauge SVG in --gold, caveat chip in `--cold-text` if `caveat` exists
- `isInProgress === true`: milestone list with status indicators + progress bar in `--gold`/`--amber`

**PanelBoundary.vue:**
- Full bleed. Horizontal refusal line at vertical center, `--gold`, 1px stroke
- Pulse: `opacity: 0.6 → 1.0 → 0.6`, 2.4s infinite
- Left column: "will do" list in Spectral
- Right column: "refuses" list in Geist Mono with strikethrough
- On `mouseover` of the refusal line: 200ms flash to full `--ice`, cursor becomes `⊘`
- On `cursor: ⊘` zone: `cursor: not-allowed` CSS class applied to the line hit area
- Links: GitHub / Live API / Live UI in Geist Mono `--text-xs`, `--gold` on hover, only rendered if `links[key]` exists

---

### Section 5 — Cost of Intelligence

**Components:** `CostOfIntelligence.vue`, `CostSlider.vue`

**ScrollTrigger config:**
```javascript
ScrollTrigger.create({
  trigger: '#cost-section',
  start: 'top top',
  end: '+=120%',
  pin: true,
  anticipatePin: 1,
  // Separate instance from camera path — no overlap
})
```

**5 Sliders — Full Specification:**

| sliderId | labelLeft | labelRight | metricLabel | metricValue | metricContext | affectedProjectId |
|---|---|---|---|---|---|---|
| evidenceStrictness | Permissive | Bounded | refusal rate | ~20% | adversarial inputs | medrag |
| latencyBudget | Fast | Accurate | correction depth | +5.7pp | on 82-query benchmark | querypilot |
| costPerQuery | Cheap | Rich | cost per storyboard | $0.04–0.08 | RunPod A40 | stick-and-dot |
| alertBudget | Aggressive | Conservative | precision | 92.06% | at 0.5% alert budget | upi-fraud |
| automationVsControl | Autonomous | Supervised | apply mode | human-gated | Telegram review queue | secondself |

**Reactive 3D binding:**
- `sliderStore` holds 5 values (0.0–1.0)
- Three.js render loop reads `sliderStore` directly each frame via Pinia
- `ConstellationNodes.vue` maps slider value to node scale delta (±0.3×) and color lerp
- No Vue reactivity in the render loop — store values read as raw refs

---

### Section 6 — Experience Overlay

**Component:** `ExperienceLog.vue`

Opened from `[EXPERIENCE]` in the top evidence bar. This is a same-world overlay, not a standalone section below the constellation.

Initial work entry:
```
[CURRENT]    Stick and Dot                      Mar 2026 ->
AI and ML Development Intern  ·  Remote  ·  Early-stage AI

At Stick and Dot, I worked on creative AI workflows and product surfaces.

Artifacts:
- Vivid: storyboard generation system
- Stick and Dot App: role-based editorial platform
```

The overlay uses a timeline layout so future internships/jobs can be added without adding more constellation nodes or page sections.

The experience entry expands the same `stick-and-dot` work-experience node from the constellation. `Vivid` and `Stick and Dot App` stay as child artifacts/evidence, not separate nodes.

---

### Section 7 — Training Data

**Component:** `TrainingData.vue`, `TrainingCard.vue`

Section header: `// TRAINING DATA` — Geist Mono, `--text-xs`, `--ice-faint`

Two smaller glass cards:

```
Great Learning · Bangalore                    Jul 2025 – Feb 2026
Post Graduate Program · Data Science · GenAI
[specialization: GenAI] [PGP certified]
```

```
IPS Academy · Indore                               2021 – 2025
B.Tech Computer Science · AI and ML
[CGPA: 6.4] [work speaks louder]
```

---

### Section 8 — Capability Map

**Component:** `CapabilityMap.vue`, `CapabilityGroup.vue`

Section header: `CAPABILITY MAP` — Spectral italic `--text-2xl`

**5 Groups (Geist Mono group headers, Inter skill chips):**

| Group | Skills |
|---|---|
| GENAI + LLMS | LangGraph, LangChain, RAG hybrid+BM25, RAGAS eval, multi-agent orchestration, prompt engineering, Groq, OpenAI API |
| DIFFUSION + VISION | FLUX.1-dev, PuLID, LoRA fine-tuning, img2img pipelines, Diffusers, PyTorch, CLIP scoring |
| ML ENGINEERING | XGBoost, Isolation Forest, Autoencoder, SHAP, backtesting, leakage-safe feature engineering, ROC-AUC, class imbalance handling |
| SYSTEMS + INFRA | FastAPI, Docker, PostgreSQL, Qdrant, ChromaDB, DuckDB, SentenceTransformers, Temporal, n8n, GitHub Actions, Python, SQL |
| FRONTEND | Next.js, React 19, Vue 3, TresJS, Three.js/R3F, Tailwind CSS v4, Supabase, Streamlit |

**Hover on any chip:**
- Highlight (scale 1.1×, `--gold` border) the chip
- Simultaneously highlight the constellation nodes for projects that use that skill
- Node highlight: ring brightens to `--teal-active`, 400ms transition, auto-resets

**Cross-reference map (in `projects.ts`):**
Each `Project` has a `stack: string[]`. `CapabilityGroup.vue` reads all projects, filters by skill name match, dispatches node highlight via `projectStore`.

---

### Section 9 — About + Contact

**Components:** `AboutSection.vue`, `ThesisStatement.vue`, `WhoamiTerminal.vue`, `ContactLine.vue`

**Left column — ThesisStatement.vue:**
Thesis text in Spectral `--text-xl`. Beneath: 2×2 grid of proof chips (Geist Mono `--text-sm`):
```
9 systems shipped            0 hallucinations in SQL evals
$0.168 total RAG cost        Mar 2026 → Present
```

**Right column — WhoamiTerminal.vue:**
Uses `useCharacterSplit`. Auto-types on scroll enter. No age composable; output stays direct and public-safe.

```
> whoami
Parth Tiwari, Bengaluru
B.Tech CSE AI/ML · Great Learning GenAI PGP
AI/ML Intern @ Stick and Dot (Mar 2026 → )
> cat interests.txt
evidence-grounded RAG · agent workflows
diffusion inference · production pragmatism
```

**ContactLine.vue:**
Two lines, Geist Mono `--text-sm`:
- `parthti2003@gmail.com` — click copies, shows `CopiedToast`
- `github.com/parthtiwari-dev` — click copies, shows `CopiedToast`

---

### Acceptance Criteria — Phase 2

- [ ] All 9 film strip overlays open and navigate correctly
- [ ] All 5 panels render for all 9 projects with real data
- [ ] Links / Launch panel renders only confirmed safe public links
- [ ] Top Evidence Bar appears only after the hero scroll/fade handoff
- [ ] Experience opens as an overlay, not a standalone section below the constellation
- [ ] In-progress projects (OncoVerse) show milestone panel not metrics panel
- [ ] Cost of Intelligence is deferred into project-panel tradeoff treatment
- [ ] All overlay headers use correct naming (EXPERIENCE, TRAINING DATA, CAPABILITY MAP)
- [ ] CGPA chip renders as specified
- [ ] All live links render only when `links[key]` exists (no broken anchors)
- [ ] Zero TypeScript errors. Zero missing data fields.

---

## Phase 2 Realignment Addendum - Single-World Evidence Interface

**Decision:** The constellation remains the full portfolio stage. Do not add standalone scroll sections after the constellation. Experience, Training Data, Capability Map, About, Resume, and future Cost of Intelligence work open as overlays or direct actions from the same constellation world.

This addendum supersedes the placement of Sections 5-9 as standalone page sections. The original section specs remain useful for content, tone, and data, but their rendering surface changes from "below the constellation" to "over the constellation."

### Realigned Phase 2 Build Order

1. Project overlays become 5-panel film strips.
2. Top Evidence Bar appears after the hero scrolls away and stays fixed over the constellation.
3. Experience becomes a work timeline overlay opened from the top bar.
4. Training Data and Capability Map become top-bar overlays.
5. About opens as a constellation-native human signal, not as another card/grid overlay, and carries contact/social links.
6. Resume is a top-bar action, not a scroll section, and stays disabled until a confirmed Drive source exists.
7. Cost of Intelligence is deferred into future per-project panel tradeoff treatment, not a standalone section.

### Project Overlay Panel 5 - Links / Launch

The project film strip changes from 4 panels to 5:

1. Problem
2. Architecture
3. Proof
4. Boundary
5. Links / Launch

Panel 5 renders only confirmed safe public links from `project.links`. It must not invent links, expose private URLs, or render empty buttons. Supported link kinds may expand beyond the current `github`, `liveUI`, and `liveAPI` fields to include demo video, case study/write-up, docs, deployment, or resume reference.

### Top Evidence Bar

The top evidence bar is not visible during the hero-first moment. It appears once the hero has faded or the user has entered the constellation.

Layout:

```text
EVIDENCEBOUND / 9 SYSTEMS      [EXPERIENCE] [TRAINING] [CAPABILITY] [ABOUT] [RESUME]
```

Behavior:
- Fixed to the top of the viewport over the constellation.
- Low-height glass/mono rail; it should feel like an instrument surface, not a marketing navbar.
- Buttons open overlays above the constellation.
- Current implementation enables `[EXPERIENCE]`, `[TRAINING]`, `[CAPABILITY]`, `[ABOUT]`, and `[RESUME]`. Contact/social links live inside About rather than as a separate top-bar overlay.
- `RESUME` opens a Drive-backed PDF renderer once a confirmed resume file/link exists.
- `?plain=1` renders equivalent plain links/content without glass or animation.

### Experience Overlay

Experience is opened from `[EXPERIENCE]`, not rendered below the constellation.

Initial content is the Stick and Dot work-experience entry:

```text
// EXPERIENCE

[CURRENT]   Stick and Dot                      Mar 2026 ->
AI/ML Development Intern  ·  Remote  ·  Early-stage AI

At Stick and Dot, I worked on creative AI workflows and product surfaces.

Artifacts:
- Vivid: storyboard generation system
- Stick and Dot App: role-based editorial platform

Boundary:
- Private company data, endpoints, keys, account details, and internal strategy omitted.
```

The Experience overlay may also surface confirmed public links, but only when safe public URLs exist. Vivid and Stick and Dot App remain child artifacts under the `stick-and-dot` work node, not separate constellation nodes. If real deployment/release history becomes useful later, it can become its own separate overlay.

### Training / Capability Overlays

Training and Capability use the same-world evidence overlay shell as Experience:

- Training renders the Great Learning and IPS Academy records as compact glass timeline cards. The CGPA chip is included exactly as a training proof chip, not hidden or overexplained.
- Capability renders five skill groups. Skill hover maps against `project.stack`, shows matching projects inside the overlay, and dispatches `projectStore.highlight(projectIds)` so matching constellation nodes glow subtly behind the glass.

Performance behavior:

- Experience and Training pause the 3D scene while open.
- Capability keeps the render loop active only so hover highlights are visible.
- About freezes the constellation at the clicked scroll frame, leaves the top bar above it, and scrolls the human signal layer over the stopped field.
- Pointer interaction and connector projection remain paused for all evidence overlays.

### About Signal

About is not rendered in the regular glass evidence shell. It appears as a human signal over the constellation itself:

- No card, panel, left rule, blur, or dark replacement screen sits behind the About copy.
- The frozen constellation itself remains the background; text readability comes from typography and shadow only.
- Social links for GitHub, LinkedIn, Email, and X sit inside About as a prominent link band. Do not invent the X URL; keep it disabled until confirmed.
- A short human note introduces Parth in first person.
- Compact signal facts replace the old whoami terminal treatment so the lower section feels designed rather than command-line filler.
- Close works through Escape and the visible `[x]` control.
- The layer begins below the fixed top bar and remains internally scrollable.

The tone should stay human, specific, and non-corporate. Avoid generic "passionate developer" resume language.

### Resume Renderer

Resume is configured through `src/data/resume.ts`.

- `driveSource` may be a Google Drive file ID, a `/file/d/.../view` link, or a Drive URL with an `id=` parameter.
- The renderer uses `https://drive.google.com/file/d/{id}/preview`.
- The iframe mounts only when the Resume overlay opens.
- The top-bar Resume button remains disabled until a valid Drive file ID is resolved; once configured, the preview URL is derived from the source rather than hardcoded.

---

## Phase 3 — Interactions and Micro-interactions

**Goal:** Every interaction described in the brief is implemented. Custom cursor, hover states, count-ups, typewriter, refusal line behavior, scroll milestones, film strip keyboard nav.

**Effort:** 3–5 days

---

### Animation Timeline Map

#### Boot Sequence (0.0s → 2.2s, wall clock)

| Time | Event | Trigger |
|---|---|---|
| 0.0s | Black screen | Page load |
| 0.2s | Line 1 fades in | GSAP timeline, delay 200ms |
| 0.4s | Line 2 fades in | Stagger +200ms |
| 0.6s | Line 3 fades in | Stagger +200ms |
| 0.5s | Skip button appears | `setTimeout(500)` |
| 2.2s | Terminal fades out | GSAP `opacity: 0`, 300ms |
| 2.5s | World snaps in | Boot complete event |
| Skip | Terminal fades 300ms | Click or keydown |
| reduced-motion | World immediate | `prefers-reduced-motion` check |

#### Hero (after world snap)

| Event | Animation | Trigger |
|---|---|---|
| World snap | Name renders — no animation | Immediate |
| World snap + 100ms | Tagline typewriter starts | `useCharacterSplit.start()` |
| Scroll indicator | Opacity pulse 0.4→1.0→0.4, 2s | CSS keyframes, auto-start |
| First scroll | Scroll indicator fades | `wheel` / `touchmove` event |
| Scroll 1 unit | Evidence data bar slides up | ScrollTrigger |

#### Constellation (scroll-driven)

| Event | Animation | Trigger |
|---|---|---|
| Scroll into constellation section | Camera begins moving along path | ScrollTrigger scrub |
| Node enters viewport (camera approach) | Node opacity 0→1, 600ms | Distance threshold from camera |
| Hover node | Scale 1.4×, cluster +40%, label wipe | Raycaster `onPointerEnter` |
| Un-hover node | Scale back 1×, cluster reset | Raycaster `onPointerLeave` |
| Hover node | Gold ring expands + fades outward | CSS keyframe on label DOM element |
| Click node | Camera lerps to node, 600ms | `onPointerDown` |
| Click node | Overlay slides up, 400ms | After camera lerp completes |
| Each 25% scroll | Particle field hue offset ±2° | ScrollTrigger milestone callbacks |

#### Project Overlay

| Event | Animation | Trigger |
|---|---|---|
| Open | `clip-path: inset(100%→0)`, 400ms | `overlayStore.open()` |
| Panel enter | `clip-path: inset(0 100%→0 0)` | Panel index change |
| Architecture panel enter | Boxes appear, stagger 80ms | Panel visible |
| Architecture lines | `stroke-dashoffset` draw | After box stagger completes |
| Proof panel enter | Metric count-up 0→value | `IntersectionObserver` |
| Gold sweep on count-up | `background-clip: text` gradient left→right | Alongside count-up GSAP tween |
| Boundary line | `opacity: 0.6→1.0→0.6`, 2.4s infinite | Panel visible |
| Cursor over boundary | Flash to `--ice`, cursor → `⊘` | `mouseover` on line hit area |
| Close | `clip-path: inset(0→100%)`, 300ms | `overlayStore.close()` or ✕ or Escape |

#### Cost of Intelligence

| Event | Animation | Trigger |
|---|---|---|
| Scroll into pin zone | Glass panel slides up from bottom | ScrollTrigger pin entrance |
| Slider drag | Pinia store update | `input` event, 60fps |
| Store update | Three.js node color/scale lerp | Render loop reads store |
| Metric readout | Updates instantly on drag | Computed from slider value |

#### DOM / Overlay Sections (EXPERIENCE, TRAINING DATA, CAPABILITY MAP, ABOUT)

| Event | Animation | Trigger |
|---|---|---|
| Section enters viewport | Cards fade + translate-Y 24px→0, stagger 150ms | `IntersectionObserver` |
| Capability chip hover | Scale 1.1×, `--gold` border | CSS `:hover` |
| Chip hover | Matching constellation nodes ring brightens | `projectStore` dispatch |
| Contact line click | Copy to clipboard | `navigator.clipboard.writeText()` |
| Contact copy | `CopiedToast` appears, 1.5s, fades | Toast mount + auto-unmount |
| WhoamiTerminal enters viewport | Typewriter starts | `IntersectionObserver` |
| Proof chips enter viewport | No count-up — static | Fade-in only |

#### Custom Cursor (`CustomCursor.vue`)

State machine — 3 states:

| State | Appearance | Condition |
|---|---|---|
| Default | `+` crosshair, 20px, `--ice` | Anywhere |
| Enter | Circle 40px + `ENTER` in `--text-xs` | Over hoverable element (`.cursor-enter`) |
| Refuse | `⊘` symbol, `--cold-text` | Over refusal line (`.cursor-refuse`) |

Implementation: one `<div id="custom-cursor">` in `App.vue`, positioned via `mousemove` with `transform: translate(x, y)`. State toggled by event delegation — elements add class `.cursor-enter` or `.cursor-refuse`. CSS transitions on width/height for the circle expansion.

---

### Scroll Milestone Hue Offsets

```typescript
ScrollTrigger.create({
  trigger: '#constellation-section',
  start: 'top top',
  end: 'bottom bottom',
  onUpdate: (self) => {
    // Every 25% scroll increment, nudge particle field hue
    const milestone = Math.floor(self.progress * 4) / 4
    particleStore.setHueOffset(milestone * 8) // 0°, 2°, 4°, 6° — imperceptible
  }
})
```

---

### Acceptance Criteria — Phase 3

- [ ] Custom cursor tracks mouse precisely, no lag
- [ ] Cursor state transitions correctly for all 3 states
- [ ] Boot sequence skippable via click and keypress
- [ ] Typewriter runs correctly in hero and whoami terminal
- [ ] Constellation hover/click states behave as specified
- [ ] Camera path scrub has no jitter
- [ ] Film strip ← → key navigation works; swipe works on mobile
- [ ] Architecture SVG lines draw on panel enter
- [ ] Metric count-up fires on Proof panel enter, not before
- [ ] Refusal line pulse and cursor swap work
- [ ] Cost sliders update 3D scene in real time, no perceptible lag
- [ ] Capability chip hover highlights correct constellation nodes

---

## Phase 4 - Mobile Identity, Plain Mode, and Performance

**Goal:** Preserve the EVIDENCEBOUND identity on phones without forcing the desktop WebGL constellation into a small viewport. Mobile should feel like the same living evidence field translated into a handheld dossier. `?plain=1` must be complete, printable, white, and animation-free. Performance and cross-browser fallbacks are finalized.

**Effort:** 4-6 days

---

### Phase 4 Realignment - Mobile Identity

Desktop remains the full cinematic constellation: boot, hero, 3D field, node overlays, evidence overlays, custom cursor, and Phase 3 micro-interactions.

Mobile is not a plain fallback and not a generic card page. It becomes a **living starfield dossier**:

- boot sequence still opens the field unless `?plain=1` or reduced-motion is active
- hero appears first and keeps the same name/tagline identity
- a mobile-friendly animated star background stays behind the whole journey
- projects and experience scroll over that starfield
- evidence navigation becomes phone-native
- project overlays remain available, but their layout is polished for touch
- a minimal footer dock repeats the important actions for users who scroll naturally

`?plain=1` is separate from mobile. It is the practical export/low-power mode: white background, complete content, no boot, no 3D, no animation.

### Recruiter and Simple User Lens

| User mindset | What they need fast | Phase 4 response |
|---|---|---|
| Simple visitor | "What is this site and what should I do?" | Hero first, then a clear systems list over the same starfield mood. No hidden puzzle required. |
| Recruiter on phone | Name, role signal, proof, links, resume, and skim speed | Project cards expose evidence immediately; overlays remain for depth; resume/about/training/capability stay one tap away. |
| Technical reviewer | Evidence that claims are bounded and real | Cards surface proof/boundary/links; project overlay keeps problem/architecture/proof/boundary/links. |
| Low-power phone user | Smooth enough to read, no overheating | No Three.js/WebGL on mobile; use capped 2D canvas/CSS starfield with reduced-motion fallback. |
| Time-poor user | Quick exits after browsing | Bottom footer dock repeats About, Experience, Training, Capability, Resume. |

This direction keeps the creative identity but reduces cognitive load. The user sees the spectacle first, then receives a readable sequence of evidence.

### Responsive Strategy

| Viewport | Treatment |
|---|---|
| ≥ 1280px (Desktop) | Full experience. All 3D, all animations, film strip overlay. |
| 768px - 1279px (Tablet) | Prefer full experience if performance holds; reduce DPR/particles and ensure overlays become vertical/touch-safe. |
| < 768px (Mobile) | Do not mount the Three.js scene. Render the mobile starfield dossier with all projects, evidence navigation, and mobile-polished overlays. |
| `?plain=1` | Pure static content, `--bg: #ffffff`, zero JS animation, zero 3D/starfield. For PDF export / low-power devices. |

### Mobile Starfield Dossier

Create a mobile-specific background instead of forcing WebGL:

- `MobileStarField.vue`
- fixed behind page content
- lightweight 2D `<canvas>` star layer plus CSS nebula gradient
- target 150-300 stars depending device width and hardware
- rare cyan/gold bright stars, mostly cold micro-stars
- slow twinkle and subtle scroll parallax
- DPR capped around `1.25`
- no new dependencies
- reduced-motion: render one static frame and stop animation loop

The mobile starfield should feel alive, but content must stay readable. It is atmosphere, not the primary interaction.

### Legacy Mobile Canvas Replacement (Superseded)

When `window.innerWidth < 768`:
- `SceneRoot.vue` renders `null` (conditional render, not `display: none`)
- A CSS gradient background replaces it:

```css
.mobile-bg {
  background: linear-gradient(135deg, #0c1a20 0%, #0d3d47 50%, #0c1a20 100%);
  animation: shimmer-drift 8s ease-in-out infinite;
}

@keyframes shimmer-drift {
  0%, 100% { background-position: 0% 50%; }
  50%       { background-position: 100% 50%; }
}
```

### Mobile Content Flow

1. **Boot**
   - Same brand moment as desktop.
   - Skip for `?plain=1` and reduced-motion.

2. **Hero**
   - `PARTH TIWARI`
   - same tagline
   - minimal scroll cue
   - starfield visible behind it

3. **Mobile Evidence Rail**
   - compact horizontal pill rail after the hero has begun scrolling
   - actions: Experience, Training, Capability, About, Resume
   - no full desktop top bar on narrow screens
   - active state remains gold-accented

4. **Systems / Projects**
   - all 9 projects render as premium mobile cards
   - cards preserve node kind, weight, status, proof, stack, and links
   - flagship/major/minor weight is visible through card hierarchy, not huge layout shifts

5. **Work/Experience Emphasis**
   - Stick and Dot remains readable as work experience
   - Vivid and Stick and Dot App stay as child artifacts/evidence under that work node

6. **Footer Dock**
   - small final action area for users who scroll to the bottom
   - About, Experience, Training, Capability, Resume
   - social links may live here too if About does not fully cover the need

### Mobile Project Cards

Each mobile card is the skim layer. It does not replace the project overlay, which remains the depth layer. Each card:
- `GlassPanel.vue` base
- `StatusBadge.vue` top-left
- Project name in Spectral `--text-xl`
- Tagline in Inter `--text-sm`
- node kind, status, and evidence weight treatment
- Stack chips row in Geist Mono
- Key metric or first milestone in `--gold`
- GitHub/Live links as `<a>` tags, Geist Mono `--text-xs`
- Tap to open the same project overlay, mobile-polished
- Optional inline expand: shows problem quote + boundary summary
- No 3D and no camera on mobile

### Mobile Project Overlay Polish

Keep the same-page overlay model, but make it touch-safe:

- full-viewport mobile sheet
- smaller header and tighter title scale
- panel tabs become horizontal scroll chips
- architecture panel becomes vertical flow
- proof, boundary, and links remain readable
- wheel/keyboard navigation disabled on mobile
- touch/swipe and explicit buttons remain
- no horizontal overflow

### Evidence Overlays on Mobile

Experience, Training, Capability, About, and Resume remain same-world overlays/sheets:

- Experience becomes a vertical timeline
- Training stays two compact records
- Capability stays chip-based but with larger tap targets
- About remains text over the starfield identity, not a generic bio card
- Resume opens the Drive preview if configured, with an external-open fallback

### `?plain=1` Mode

`usePlainMode().isPlain === true` gates:
1. Boot sequence: skipped entirely
2. `SceneRoot.vue`: not mounted
3. All GSAP animations: not registered
4. `CustomCursor.vue`: not mounted (system cursor restored)
5. `MobileStarField.vue`: not mounted
6. `plain.css` applied: white background, black text, standard font sizes
7. Full content renders as pure HTML/Tailwind: hero, about, all 9 projects, project proof/boundary/links, experience, training, capability, and resume link/preview fallback

Realigned requirement: plain mode must render the complete current portfolio content, including hero, about, all 9 projects, project proof/boundary/links, experience, training, capability, and resume link/preview fallback.

This mode is linkable: `evidencebound.dev?plain=1`. Suitable for PDF print via browser `Ctrl+P`.

### `@supports` Guard for `@property`

```css
@supports not (background: paint(something)) {
  /* Safari < 15.4 fallback */
  .glass-panel::after {
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255,255,255,0.03) 50%,
      transparent 100%
    );
    animation: none;
  }
}
```

Also guard `backdrop-filter` so older Safari/browser contexts still render usable glass:

```css
@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
  .glass-panel {
    background: color-mix(in srgb, var(--bg) 86%, black);
  }
}
```

---

### Performance Budget per Section

| Section | Budget | Primary cost | Mitigation |
|---|---|---|---|
| Boot | < 50ms paint | None — text only | — |
| Hero + Particle field | < 4ms/frame (3D) | BufferGeometry 10k pts | Hardware-tiered particle count |
| Constellation (scroll) | < 4ms/frame | Raycaster, camera path | Raycaster runs on `pointermove` not every frame |
| Film strip overlay | < 200ms open | clip-path GPU composite | Use `will-change: clip-path` on overlay element |
| Cost of Intelligence | < 2ms/frame | Slider → store → render loop | Store reads are direct ref access, no reactivity in loop |
| EXPERIENCE | < 100ms enter | Overlay open + timeline/card stagger | Cards stagger avoids layout thrash |
| CAPABILITY MAP | < 100ms enter | Chip hover dispatches | Debounce node highlight at 50ms |
| About | < 50ms | Typewriter interval | `clearTimeout` on unmount |
| Total JS bundle | < 350KB gzipped | Three.js is large | Code-split 3D chunk separately |
| Three.js chunk | < 600KB gzipped | Core + TresJS | Tree-shake, no unused Three.js modules |
| Fonts | < 80KB | 3 font families | `font-display: swap`, preconnect in `<head>` |

Realigned Phase 4 additions:

| Surface | Budget | Primary cost | Mitigation |
|---|---|---|---|
| Mobile starfield | < 2ms/frame target | 2D canvas twinkle | Cap stars, cap DPR, pause when hidden, static under reduced-motion |
| Mobile cards | No layout jank | Card stack and chips | Use CSS grid/flow, no heavy observers |
| Mobile project overlay | < 200ms open | Scrollable panel/tabs | Active panel only; keyboard nav off on mobile |
| Plain mode | Static | None | No animated mounts; no 3D/starfield |
| Cost of Intelligence | Deferred | Standalone section removed | Future placement is inside project overlays, not a Phase 4 route section |

### Vite Build Config

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import glsl from 'vite-plugin-glsl'
import { fileURLToPath } from 'url'

export default defineConfig({
  plugins: [vue(), glsl()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'three':  ['three', '@tresjs/core'],
          'gsap':   ['gsap'],
          'vendor': ['pinia', 'vue'],
        }
      }
    }
  }
})
```

### Implementation Order

1. Add viewport mode detection.
2. Gate `SceneRoot` off for mobile and plain mode.
3. Build `MobileStarField.vue`.
4. Build `MobileExperience.vue` with hero, evidence rail, project cards, and footer dock.
5. Polish project overlay mobile layout.
6. Build/complete `PlainExperience.vue`.
7. Add Safari/support fallbacks.
8. Run performance/build/Lighthouse checks.

### Acceptance Criteria - Phase 4 Realigned

- [ ] Desktop experience remains visually unchanged unless a bug fix is required
- [ ] Mobile opens with boot -> hero -> living starfield dossier
- [ ] Mobile does not mount the Three.js scene below 768px
- [ ] Mobile layout renders all 9 projects as readable cards at 375px width
- [ ] Mobile project cards expose proof, stack, kind, status/weight, and confirmed links
- [ ] Mobile project overlay is usable by touch with no horizontal overflow
- [ ] Mobile evidence rail and footer dock expose Experience, Training, Capability, About, Resume
- [ ] `?plain=1` shows complete content with zero animation, white background, and no 3D/starfield
- [ ] `@supports` fallbacks render without error in older Safari/browser contexts
- [ ] Lighthouse Performance score >= 85 on desktop
- [ ] Lighthouse Performance score >= 70 on mobile
- [ ] `prefers-reduced-motion` skips boot and disables twinkle, typewriter, count-up, and looping decorative motion
- [ ] No horizontal scroll at any viewport width
- [ ] Film strip keyboard nav disabled on mobile; touch/successive buttons remain

Legacy acceptance criteria from the initial roadmap:

- [ ] Mobile layout renders all 9 projects as cards at 375px width
- [ ] `?plain=1` shows all content with zero JS animation, white background
- [ ] `@supports` fallback renders without error in Safari < 15.4
- [ ] Total JS bundle < 350KB gzipped (audited with `npx vite-bundle-visualizer`)
- [ ] Lighthouse Performance score ≥ 85 on desktop
- [ ] Lighthouse Performance score ≥ 70 on mobile
- [ ] `prefers-reduced-motion` skips boot, disables particle drift, disables count-up
- [ ] No horizontal scroll at any viewport width
- [ ] Film strip keyboard nav disabled on mobile (touch only)

---

## Phase 5 — Deploy

**Goal:** Site live on Vercel, meta tags correct, README complete.

**Effort:** 1 day

### `index.html` Head

```html
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>EVIDENCEBOUND — Parth Tiwari</title>
  <meta name="description"
    content="Systems that act only after the evidence agrees. AI Engineer, GenAI Application Developer." />
  <meta property="og:title" content="EVIDENCEBOUND — Parth Tiwari" />
  <meta property="og:description"
    content="Systems that act only after the evidence agrees." />
  <meta property="og:url" content="https://parth-tiwari.vercel.app" />
  <meta property="og:image" content="https://parth-tiwari.vercel.app/og.png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <link rel="canonical" href="https://parth-tiwari.vercel.app" />
  <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
  <!-- Font preconnects -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="preconnect" href="https://cdn.jsdelivr.net" />
</head>
```

### `vercel.json`

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    }
  ]
}
```

### README Sections

1. Project name, tagline, live URL
2. TresJS pinned version and why it is pinned
3. `npm install` + `npm run dev`
4. `npm run build` + `npm run preview`
5. `?plain=1` usage note
6. Environment variables (none in v1 — site is fully static)
7. Deploy: push to `main` → Vercel auto-deploys
8. v2 roadmap items: audio, custom domain, OG image

### Acceptance Criteria — Phase 5

- [ ] Site live at `parth-tiwari.vercel.app`
- [ ] `og:title`, `og:description`, and `og:image` render correctly in link previews (test with [opengraph.xyz](https://www.opengraph.xyz))
- [ ] `favicon.svg` displays in browser tabs
- [ ] `Cache-Control: immutable` on all hashed asset files
- [ ] `README.md` contains TresJS pinned version

---

## Known Risks and Mitigations (Confirmed)

| Risk | Description | Mitigation | Status |
|---|---|---|---|
| RISK 1 | 10k particles + shader + ScrollTrigger on mid-tier | `hardwareConcurrency`-tiered particle count: 10k/5k/2k | Accepted |
| RISK 2 | TresJS breaking changes between minor versions | Pin to latest stable at project init, document in README | Accepted |
| RISK 3 | Film strip built before project data complete | TypeScript data model and all 9 project objects fully populated before any film strip component build begins | Accepted |
| RISK 4 | Nested scroll: camera path + pinned section | Separate ScrollTrigger instances, explicit start/end, no overlap, `anticipatePin: 1` | Accepted |
| RISK 5 | `@property` no-support in Safari < 15.4 | `@supports` guard with static gradient fallback | Accepted |
| RISK 6 (new) | Raycaster runs every `mousemove` — expensive with 9 nodes | Raycaster only tests against the 9 node meshes, not the particle field. Throttle to every other `pointermove` event. | Mitigated |
| RISK 7 (new) | Connector lines require 3D→2D projection every frame | Project connector lines via SVG overlay using `camera.project()` in the render loop. 6 lines only — negligible cost. | Mitigated |
| RISK 8 (new) | Film strip keyboard navigation conflicts with browser default scroll | `e.preventDefault()` on ← → keys only while overlay is open. Overlay tracks `overlayStore.isOpen`. | Mitigated |

---

## Build Execution Order (Strict)

```
Phase 0:
  tokens.css → typography.css → glass.css → cursor.css → plain.css
  → vite.config.ts
  → src/types/* (all 3 type files)
  → src/data/projects.ts (all 9 projects, 100% populated)
  → src/composables/usePlainMode.ts
  → shared components (GlassPanel, GeistChip, MetricCountUp, StatusBadge, CopiedToast)
  → public/favicon.svg
  → GATE: TypeScript compile with zero errors before Phase 1 begins

Phase 1:
  SceneRoot.vue → IridescentBackground.vue → shaders (all 6)
  → useParticleField.ts → ParticleField.vue
  → RefusalRipple.vue
  → useCameraPath.ts
  → ConstellationNodes.vue
  → useNodeInteraction.ts
  → GATE: 60fps confirmed on target hardware

Phase 2:
  BootSequence.vue
  → HeroSection + HeroName + HeroTagline
  → EvidenceDataBar.vue
  → ConstellationSection + ConstellationLegend
  → ProjectOverlay + FilmStrip + all 4 panel components
  → CostOfIntelligence + CostSlider (sliders first, 3D binding second)
  → ExperienceLog
  → TrainingData + TrainingCard
  → CapabilityMap + CapabilityGroup
  → AboutSection + ThesisStatement + WhoamiTerminal + ContactLine
  → GATE: all 9 overlays render with real data, zero broken links

Phase 3:
  CustomCursor.vue
  → useCharacterSplit.ts → typewriter in HeroTagline + WhoamiTerminal
  → useBootSequence.ts → boot stagger + skip
  → useCountUp.ts → EvidenceDataBar count-up + PanelProof count-up
  → All hover states (nodes, chips, cards)
  → Film strip keyboard + swipe navigation
  → Scroll milestone hue offsets
  → Refusal line cursor swap
  → IntersectionObserver section entrances
  → GATE: every interaction in brief is implemented and tested

Phase 4:
  Mobile layout (< 768px) — canvas off, project cards
  → Tablet layout (768px – 1279px) — reduced particles, vertical film strip
  → usePlainMode gates applied to all components
  → plain.css complete
  → @supports guard
  → Performance audit: bundle size, Lighthouse, frame rate
  → GATE: all acceptance criteria met

Phase 5:
  index.html meta tags
  → vercel.json
  → README.md
  → Vercel deploy
  → GATE: site live, link preview correct, favicon visible
```

---

## Pinia Store Interfaces

### `projectStore.ts`

```typescript
interface ProjectStoreState {
  projects: Project[]
  highlightedProjectIds: string[]  // from capability chip hover
}
```

### `overlayStore.ts`

```typescript
interface OverlayStoreState {
  isOpen: boolean
  activeProjectId: string | null
  activePanelIndex: number  // 0–3
}
```

### `sliderStore.ts`

```typescript
interface SliderStoreState {
  values: Record<SliderKey, number>  // all 0.0–1.0
}
```

---

## Estimated Total Effort

| Phase | Days |
|---|---|
| Phase 0 — Design System | 2–3 |
| Phase 1 — Core 3D | 5–7 |
| Phase 2 — Sections | 7–10 |
| Phase 3 — Interactions | 3–5 |
| Phase 4 — Polish + Mobile | 3–4 |
| Phase 5 — Deploy | 1 |
| **Total** | **35–40 days** |

Adjusted from the initial 21–30 day estimate to account for concurrent job search, SecondSelf v2 maintenance, and ongoing debugging work. Full-time uninterrupted focus was the original assumption — that condition does not hold. 35–40 days at realistic pacing. Each phase gate still enforced.
