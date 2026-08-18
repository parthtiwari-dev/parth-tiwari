import * as THREE from 'three'

/**
 * The scene rig: the one object the constellation hangs off, and the one place
 * that knows how local node coordinates become world coordinates.
 *
 * **Why a rig at all.** Free-orbit is implemented by rotating the scene, not the
 * camera (DESIGN.md §4, after 100,000 Stars). The camera then reduces to a
 * single `position.z` plus a field of view, which is dramatically less math than
 * maintaining an orbit camera *and* a scripted path camera that have to agree
 * with each other at the moment control hands over.
 *
 * **Why this module exists rather than a `ref` in a component.** `nodeMotion.ts`
 * is the single owner of where a node is *in constellation space*; three
 * consumers read it every frame (the meshes, the label projector, the connector
 * projector) precisely so they cannot drift apart by a frame. Adding a rotating
 * parent would have re-introduced exactly that bug in a new place: the meshes
 * get the rig transform for free because they are its children, while the two
 * DOM projectors compute screen positions by hand and would have kept using
 * untransformed coordinates. Labels would detach from their stars the instant
 * anyone dragged.
 *
 * So the rig is registered here once, and `toWorld` is the only way anything
 * converts. Nothing else should read `rig.matrixWorld`.
 */

let rig: THREE.Object3D | null = null

/** Called by the component that owns the group. Pass `null` on unmount. */
export function registerSceneRig(object: THREE.Object3D | null): void {
  rig = object
}

export function getSceneRig(): THREE.Object3D | null {
  return rig
}

/**
 * Local constellation coordinates → world coordinates.
 *
 * Writes into `out` and returns it; called once per node per frame by two
 * projectors, so it allocates nothing.
 *
 * With no rig registered — or before its first render — this is the identity,
 * which is correct: an unrotated rig at the origin *is* the identity, and the
 * guided path relies on that.
 */
export function toWorld(local: THREE.Vector3, out: THREE.Vector3): THREE.Vector3 {
  out.copy(local)
  if (rig) out.applyMatrix4(rig.matrixWorld)
  return out
}
