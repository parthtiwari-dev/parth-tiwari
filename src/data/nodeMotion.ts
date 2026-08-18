import * as THREE from 'three'
import { projects } from '@/data/projects'
import { layoutFor, type ScaleMode } from '@/data/layout'

/**
 * The single owner of where nodes actually are right now (PLAN.md 3.2).
 *
 * `layout.ts` gives each node its resting place. Once nodes orbit, that resting
 * place is only the t=0 pose, and four layers need the *current* one: the meshes,
 * the label projector, the connector projector and the ambient particle field.
 * Each recomputing it independently is how they drift apart by a frame and the
 * label detaches from its own star.
 *
 * So one module computes it once per frame and everyone reads. Deliberately
 * plain mutable Vector3s, not reactive state: these change every frame and only
 * the render loop reads them.
 */

/**
 * Resting positions as real vectors, keyed `mode:id`.
 *
 * `layout.ts` returns plain `{ x, y, z }` on purpose — importing `three` there
 * dragged the whole engine into the eager entry chunk (see the note on `Vec3`).
 * This is the boundary where the derivation becomes scene geometry, so the
 * wrapping happens here, once, at module load rather than per frame.
 */
const resting = new Map<string, THREE.Vector3>()

function restingVector(projectId: string, mode: ScaleMode): THREE.Vector3 {
  const key = `${mode}:${projectId}`
  let at = resting.get(key)
  if (!at) {
    const { position } = layoutFor(projectId, mode)
    at = new THREE.Vector3(position.x, position.y, position.z)
    resting.set(key, at)
  }
  return at
}

/** Current world position per project id. */
const live = new Map<string, THREE.Vector3>()

/** Current displacement from the node's resting position, for the shader. */
const offsets = new Map<string, THREE.Vector3>()

for (const project of projects) {
  live.set(project.id, new THREE.Vector3())
  offsets.set(project.id, new THREE.Vector3())
}

/** Ordered to match `projects`, so a cluster index maps straight to an offset. */
export const clusterOffsets: THREE.Vector3[] = projects.map(
  (project) => offsets.get(project.id)!,
)

let elapsed = 0

/**
 * Advances the orbit and rewrites every live position.
 *
 * Motion means attention — an active project visibly moves and a dormant one is
 * nearly still (DESIGN.md §2). Speeds are slow on purpose: 0.055 rad/s is about
 * three degrees a second, noticeable over a visit without being a carousel.
 */
export function advanceNodeMotion(delta: number, mode: ScaleMode): void {
  elapsed += delta

  for (const project of projects) {
    const base = layoutFor(project.id, mode)
    const angle = base.angle + base.speed * elapsed

    const at = live.get(project.id)!
    at.set(
      Math.cos(angle) * base.orbitRadius,
      base.position.y,
      Math.sin(angle) * base.orbitRadius,
    )

    // Rigid translation, not a rotation of each particle about the origin. A
    // particle sitting slightly outside its node would sweep a larger arc and
    // the aura would visibly shear away over a minute or two.
    offsets.get(project.id)!.subVectors(at, restingVector(project.id, mode))
  }
}

/**
 * Where this node is now. Falls back to the resting position before the first
 * frame has run, so a label rendered on mount is not placed at the origin.
 */
export function livePosition(projectId: string, mode: ScaleMode): THREE.Vector3 {
  const at = live.get(projectId)
  if (!at || (at.x === 0 && at.y === 0 && at.z === 0)) {
    return restingVector(projectId, mode)
  }
  return at
}
