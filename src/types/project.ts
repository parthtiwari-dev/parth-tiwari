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
 * What the constellation still needs stated by hand.
 *
 * `position` and `size` used to live here as typed coordinates and a t-shirt
 * size. Both are derived now (`data/layout.ts`, PLAN.md 3.1/3.3) — radius from
 * maturity, angle from `started`, size from evidence depth. A portfolio arguing
 * that systems should act only on evidence cannot place its own stars by hand.
 *
 * `relatedIds` stays because a relationship between two projects is a judgement,
 * not a measurement. Nothing in the data implies it.
 */
export interface ConstellationNodeConfig {
  relatedIds: string[]
}

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
  links: ProjectLinks
  panels: ProjectPanels
  artifacts?: ProjectArtifact[]
  node: ConstellationNodeConfig
  sliderResponse?: SliderResponse
}
