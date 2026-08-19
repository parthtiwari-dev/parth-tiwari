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
}

/**
 * **The path is an orbit. It must never fly through its own look-at point.**
 *
 * The previous array did exactly that. Between 70% and 78% of the scroll the
 * camera crossed its target and the look direction on z swung from -0.51 to
 * +0.76 — a 180° turn inside 8% of the runway, with the camera 2.06 units from
 * the point it was aiming at, which is where `lookAt()` loses its up vector and
 * the roll snaps. On screen every star swept across the frame and re-landed
 * somewhere else. That was the "flip".
 *
 * The fix is structural, not a nudge to a number: keep the target at or near
 * the origin for the whole path and move the camera on an arc around it. Then
 * the view direction rotates continuously by construction, there is no crossing
 * to protect against, and the guided tour becomes the same *kind* of motion as
 * free orbit — which is the motion that already felt right, and the reason the
 * handover in `NavigationController` reads as a handover rather than a cut.
 *
 * The invariant, if you edit these: every pose's camera-to-target distance
 * stays well clear of zero. Measured along the interpolated curve, not just
 * at the poses, the closest approach here is 11.48 units and the sharpest
 * turn is 1.83° per quarter-percent of scroll. The old array's numbers were
 * 2.06 units and a 180° reversal.
 */
export const CAMERA_POSES: CameraPose[] = [
  // Arrival. Target held left of centre so the constellation composes into the
  // right of frame, clear of the wordmark — the layout encodes the data, the
  // camera decides the shot.
  { at: 0.0,  position: new THREE.Vector3(-6, 7, 21),    target: new THREE.Vector3(-4.2, 0, 1.5) },
  // Swing left and close in. Target eases toward the origin as the wordmark
  // fades, so the constellation takes the centre it was giving away.
  { at: 0.25, position: new THREE.Vector3(-12, 5, 14),   target: new THREE.Vector3(-1.5, 0, 1.5) },
  // Low and behind: the ring seen almost edge-on, raking. This is the only
  // moment the plane of the constellation is legible *as* a plane.
  { at: 0.5,  position: new THREE.Vector3(-9, 1.6, -11), target: new THREE.Vector3(0, 0, 0) },
  // Continue the arc round the far side. Still an orbit, still no crossing.
  { at: 0.75, position: new THREE.Vector3(7, 3.5, -16),  target: new THREE.Vector3(0, 0, 0) },
  // The reveal: rise and pull back to look down on the whole system. The
  // distance here is a floor, not the final word — `NavigationController`
  // widens it to whatever actually contains `constellationExtent()` at the
  // live camera's aspect, because a pose typed for a 16:10 desktop frames
  // nothing on a portrait phone.
  { at: 1.0,  position: new THREE.Vector3(2, 26, 18),    target: new THREE.Vector3(0, 0, 0) },
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
