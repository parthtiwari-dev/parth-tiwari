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
  metricLabel: string
  metricValue: string
  metricContext: string
  affectedProjectId: string
}
