import * as THREE from 'three'

/**
 * The camera path, as data (PLAN.md 2.2).
 *
 * It used to be two disconnected constants — five positions in one array, two
 * look-at points in another, and a `smoothstep` between hardcoded 0.48 and 0.82
 * deciding when the camera turned. Adding a stop meant editing three places and
 * re-deriving where the turn should now begin.
 *
 * A pose says everything about one moment on the track: where the camera is,
 * what it is looking at, and which project is the subject there. Interpolation
 * happens between adjacent poses, so the turn is a consequence of the data
 * rather than a magic number layered on top of it.
 *
 * `at` is scroll progress through `#constellation-section`, 0 → 1. Poses must be
 * ordered and the first must be 0, the last 1.
 */
export interface CameraPose {
  /** Scroll progress, 0–1. */
  at: number
  position: THREE.Vector3
  target: THREE.Vector3
  /**
   * The project this pose is framing, if any. Not yet consumed — Phase 3 uses it
   * to derive which node is "active" from camera position instead of from a
   * separate hover/selection path. Recorded now because it is knowable now.
   */
  activeNode?: string
}

export const CAMERA_POSES: CameraPose[] = [
  // Pose 0 looks left of centre so the constellation composes into the right of
  // frame, clear of the wordmark. The hand-typed node coordinates used to do
  // this framing implicitly by clustering everything stage-right; once positions
  // became derived (3.1) that job moved to the camera, which is where it
  // belonged — the layout encodes the data, the camera decides the shot.
  { at: 0.0,  position: new THREE.Vector3(0, 6, 22),    target: new THREE.Vector3(-4.2, 0, 2) },
  { at: 0.25, position: new THREE.Vector3(1, 5.5, 18),  target: new THREE.Vector3(-2.0, 0, 2) },
  { at: 0.5,  position: new THREE.Vector3(-1, 5, 15),   target: new THREE.Vector3(0, 0.15, 2.6) },
  { at: 0.75, position: new THREE.Vector3(0, 2.4, 5.8), target: new THREE.Vector3(0, 0.5, 6.6) },
  { at: 1.0,  position: new THREE.Vector3(0, 2.1, -7.2), target: new THREE.Vector3(0, 0.7, 9) },
]

/**
 * Positions are smoothed through a Catmull-Rom curve so the camera does not
 * visibly hinge at each pose. Targets are linearly interpolated between adjacent
 * poses instead: a curve through look-at points overshoots, and an overshooting
 * target reads as the camera glancing away and back.
 */
const positionCurve = new THREE.CatmullRomCurve3(
  CAMERA_POSES.map((pose) => pose.position),
  false,
  'catmullrom',
  0.5,
)

const scratchTarget = new THREE.Vector3()

export interface CameraSample {
  position: THREE.Vector3
  target: THREE.Vector3
}

/**
 * Samples the path at `progress`, writing into `out` rather than allocating.
 * Called once per rendered frame, so it must not produce garbage.
 */
export function sampleCameraPath(progress: number, out: CameraSample): CameraSample {
  const t = THREE.MathUtils.clamp(progress, 0, 1)

  positionCurve.getPoint(t, out.position)

  let upper = 1
  while (upper < CAMERA_POSES.length - 1 && CAMERA_POSES[upper]!.at < t) upper += 1
  const a = CAMERA_POSES[upper - 1]!
  const b = CAMERA_POSES[upper]!
  const span = b.at - a.at
  const local = span <= 0 ? 0 : (t - a.at) / span

  // Smoothstep the blend, not the whole path: it removes the velocity
  // discontinuity as the target hands off from one pose to the next.
  scratchTarget.copy(a.target).lerp(b.target, THREE.MathUtils.smoothstep(local, 0, 1))
  out.target.copy(scratchTarget)

  return out
}
