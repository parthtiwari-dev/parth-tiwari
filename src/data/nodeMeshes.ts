import type * as THREE from 'three'

/**
 * The pickable node meshes, registered once so anything that needs to raycast
 * the constellation can, without `ConstellationNodes` exporting its internals.
 *
 * Occlusion (PLAN.md 5.2) is the reason this exists. A label has to know whether
 * its own star is actually visible from the camera or hidden behind a nearer
 * one, and that is a raycast against these meshes and nothing else — not the
 * particle field, not the moons, not the sky. Raycasting the whole scene would
 * be both slower and wrong: an aura particle drifting in front of a star does
 * not occlude it in any sense a viewer would recognise.
 *
 * Same shape as `sceneRig.ts`, and for the same reason: one owner, module
 * scope, no reactivity. These are read inside a per-frame loop.
 */

export interface NodeMeshEntry {
  projectId: string
  mesh: THREE.Object3D
}

let entries: NodeMeshEntry[] = []

/** Called by `ConstellationNodes` on mount. Pass `[]` on unmount. */
export function registerNodeMeshes(next: NodeMeshEntry[]): void {
  entries = next
}

export function getNodeMeshes(): NodeMeshEntry[] {
  return entries
}
