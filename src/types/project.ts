import type { SliderKey } from './slider'

export type ProjectStatus = 'complete' | 'active' | 'in-progress' | 'experience'

export type NodeSize =
  | 'large'
  | 'medium-large'
  | 'medium'
  | 'medium-small'
  | 'small'
  | 'tiny'

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

export interface ProjectLinks {
  github?: string
  liveUI?: string
  liveAPI?: string
}

export interface ConstellationNodeConfig {
  position: { x: number; y: number; z: number }
  size: NodeSize
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
  stack: string[]
  links: ProjectLinks
  panels: ProjectPanels
  node: ConstellationNodeConfig
  sliderResponse?: SliderResponse
}
