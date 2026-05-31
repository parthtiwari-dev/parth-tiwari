const overlayReadyProjectIds = ['secondself', 'stick-and-dot'] as const

export function isOverlayReadyProject(projectId: string) {
  return overlayReadyProjectIds.includes(projectId as (typeof overlayReadyProjectIds)[number])
}

export { overlayReadyProjectIds }
