import type { Project } from '@/types/project'

/**
 * Whether a project can open on a visual instead of on a quote.
 *
 * "Show before telling" is a rule, not a preference (CLAUDE.md): a screenshot
 * outranks a paragraph and a working demo outranks a screenshot. The overlay
 * used to open on the Problem panel — a pull-quote — for every project,
 * including the ones with a live deployment a stranger could open. The
 * screenshot now goes first where one exists.
 *
 * It is deliberately conditional rather than a panel that renders empty. A
 * project with no capture (nothing deployed, or a deployment that cannot be
 * honestly captured) opens on Problem exactly as before. An empty showcase
 * would be decoration pretending to be evidence, which is the specific failure
 * this codebase exists to avoid.
 */
export function hasShowcase(project: Project): boolean {
  return Boolean(project.images?.length || project.video || project.outcome)
}

/** The four evidence panels plus Links, which every project has. */
const BASE_PANEL_COUNT = 5

/**
 * Panel count for this project. The single owner of that number.
 *
 * It was a module constant in two places — `filmStripPanelCount` for the header
 * and `maxPanelIndex` in the store — which is fine while every project has the
 * same panels and silently wrong the moment one does not: the store would clamp
 * navigation to five while the strip rendered six.
 */
export function panelCountFor(project: Project | null | undefined): number {
  if (!project) return BASE_PANEL_COUNT
  return hasShowcase(project) ? BASE_PANEL_COUNT + 1 : BASE_PANEL_COUNT
}
