export type NodeRingState = 'solid' | 'pulsing-amber' | 'blinking-live' | 'static-faint'

export interface NodeRuntimeState {
  projectId: string
  scale: number
  colorState: 'gold' | 'teal-active' | 'ice-muted' | 'ice-faint' | 'amber' | 'ember'
  ringState: NodeRingState
  clusterBrightness: number
  hovered: boolean
  active: boolean
}
