import type { SliderKey } from './slider'

export type ProjectStatus = 'complete' | 'active' | 'in-progress' | 'experience'

export type ProjectNodeKind =
  | 'personal-project'
  | 'work-experience'
  | 'utility'
  | 'current-build'

export type ProjectOrigin = 'personal' | 'work'

export type ProjectWeight = 'flagship' | 'major' | 'minor'


export interface ProjectMetric {
  label: string
  value: number
  display: string
  unit?: string
}

export interface ProjectMilestone {
  label: string
  status: 'complete' | 'active' | 'roadmap'
  detail?: string
}

export interface ArchitectureNode {
  id: string
  label: string
  description: string
  stackChips?: string[]
  connections: string[]
  position: { x: number; y: number }
}

export interface BoundaryItem {
  side: 'will' | 'refuses'
  text: string
}

export interface PanelProblem {
  quote: string
  brokenFlowId: string
}

export interface PanelArchitecture {
  nodes: ArchitectureNode[]
  summary?: string
}

export interface PanelProof {
  metrics?: ProjectMetric[]
  radialMetricId?: string
  caveat?: string
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
  /**
   * Public deployment for this artifact specifically, where the parent project as
   * a whole does not have one. Only ever a URL confirmed public, reachable without
   * auth, and owned by this account (CLAUDE.md).
   */
  url?: string
}

/**
 * A screenshot of the product working. Layer 1 of the project model (DESIGN.md 2b)
 * — the opening move, ahead of the outcome line and the evidence panels.
 *
 * `alt` is required, not optional: an image with no alt text is a dead end for
 * screen readers and for plain mode, which is the SEO backstop.
 */
export interface ProjectImage {
  src: string
  alt: string
  caption?: string
}

/**
 * A short, silent screen recording of the real product being used.
 *
 * Silent and muted by default and looped: this sits inside an overlay a visitor
 * opened to read, and audio they did not ask for is a reason to close the tab.
 * `poster` is required so the panel has something to show before the file
 * arrives and for anyone who blocks media.
 *
 * Same evidence rule as `images`: recorded from a deployment confirmed public,
 * auth-free and ours (`scripts/capture-demos.mjs`). Never a mock-up, never a
 * prototype, never someone else's product.
 */
export interface ProjectVideo {
  src: string
  poster: string
  /** Described for anyone who cannot play it. Required for the same reason `alt` is. */
  description: string
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

/**
 * Nothing about a node is stated by hand any more.
 *
 * `position` and `size` went first (PLAN.md 3.1/3.3) — radius from maturity,
 * angle from `started`, size from evidence depth. `relatedIds` was the last
 * survivor, and the comment that used to sit here said the quiet part out loud:
 * "a relationship between two projects is a judgement, not a measurement.
 * Nothing in the data implies it."
 *
 * It was drawn as a flat SVG hairline pinned above the canvas at `z-20` —
 * constant 1.1px width and 0.32 opacity from a node four units away to one
 * twenty units away, unoccluded by the star it crossed, sliding across the
 * frame while everything else parallaxed. A 2D overlay pasted onto a 3D scene
 * reads as exactly that, and the thing it was drawing had no stated meaning to
 * justify the cost.
 *
 * `ConstellationNodes.vue` draws the orbit each node actually travels instead.
 * A ring is a measurement — it is the path, at the radius the derivation gave
 * it — and it lives inside the rig, so it takes perspective and depth like
 * everything else in the world.
 *
 * A portfolio arguing that systems should act only on evidence cannot place its
 * own stars by hand, and cannot draw its own relationships by hand either.
 */

export interface SliderResponse {
  sliderId: SliderKey
  affects: 'color' | 'size' | 'both'
}

export interface Project {
  id: string
  name: string
  tagline: string
  status: ProjectStatus
  nodeKind: ProjectNodeKind
  origin: ProjectOrigin
  weight: ProjectWeight
  /**
   * When work on this project started, as `YYYY-MM`. Drives orbital angle in
   * Phase 3 — position around the ring is a clock, so reading the system
   * clockwise reads the career (DESIGN.md 2).
   *
   * **Provenance: the first commit in the project's own repository.** Not
   * owner-recalled, not the idea's birthday — a verifiable, uniformly-derived
   * fact. It undercounts thinking time that happened before any code, and that
   * is the honest trade: one consistent rule beats ten remembered dates. Where a
   * repo is private the date comes from the local clone.
   */
  started: string
  stack: string[]
  /**
   * What it did, for whom, in plain language. Layer 2 of the project model
   * (DESIGN.md 2b) and the line a client reads instead of the tagline.
   *
   * Optional because it is owner-supplied copy (PRD.md 11.3) — an absent outcome
   * renders nothing. It is never inferred from the architecture panels, because a
   * guessed outcome is an invented claim.
   */
  outcome?: string
  /**
   * Screenshots of the product working. Layer 1 of the project model.
   *
   * Optional because captures are produced outside the codebase. Empty until real
   * files exist in `public/` — no placeholder paths.
   */
  images?: ProjectImage[]
  /**
   * A screen recording of the product working. Outranks a screenshot, which
   * outranks a paragraph (CLAUDE.md).
   *
   * Optional, and absent wherever a recording would misrepresent the thing: a
   * product whose backend is down records a hang, not a demo.
   */
  video?: ProjectVideo
  links: ProjectLinks
  panels: ProjectPanels
  artifacts?: ProjectArtifact[]
  sliderResponse?: SliderResponse
}
