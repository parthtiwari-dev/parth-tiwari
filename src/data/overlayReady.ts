import { projects } from '@/data/projects'

const overlayReadyProjectIds = projects.map((project) => project.id)

export function isOverlayReadyProject(projectId: string) {
  return overlayReadyProjectIds.includes(projectId)
}

export { overlayReadyProjectIds }
