import * as THREE from 'three'

/**
 * Drag to orbit, wheel or pinch to zoom (PLAN.md 4.2, 4.3, 4.8).
 *
 * **Nothing here is reactive, on purpose.** These values change on every pointer
 * move and every frame. Pushing them through Vue would schedule a component
 * update per tick for numbers only the render loop reads, and TresJS would diff
 * the scene graph alongside it (DESIGN.md §4). The store next door holds the
 * discrete state the DOM actually re-renders on.
 *
 * **Zoom is field of view, not a dolly** (DESIGN.md §4, after 100,000 Stars).
 * Distance does move, but the FOV narrows on approach and widens on retreat, and
 * that is what carries the sense of scale — the *amount* of FOV change is what
 * makes the whole scene read as bigger or smaller. It also sidesteps near-plane
 * clipping, which is the classic killer of a scene spanning constellation to
 * single node.
 *
 * Everything is a target plus a damped current value. Input writes targets;
 * `advanceOrbit` walks the current values toward them once per rendered frame.
 * That keeps a 120 Hz trackpad and a 30 fps handset producing the same motion,
 * and it is what makes a flick feel like weight rather than teleportation.
 */

export interface OrbitState {
  azimuth: number
  polar: number
  distance: number
  fov: number
  /** Field of view and distance at the moment control was handed over. */
  fovBase: number
  distanceBase: number
  /** Where the rig is centred, in constellation-local coordinates. */
  centre: THREE.Vector3

  targetAzimuth: number
  targetPolar: number
  targetDistance: number
  targetCentre: THREE.Vector3
}

/** Straight up and straight down both gimbal-lock the look-at; stop short. */
const POLAR_LIMIT = THREE.MathUtils.degToRad(78)

export const MIN_DISTANCE = 3
export const MAX_DISTANCE = 42

/**
 * Field of view against distance. Wide when far (the whole field in frame),
 * narrow when close (a subject, compressed, with the rest behind it).
 *
 * The near plane is 0.1 and the far plane 100, so this range never approaches
 * either — which is the point of zooming this way rather than flying the camera
 * into the node.
 */
const FOV_FAR = 52
const FOV_NEAR = 26

/**
 * Degrees of field of view per unit of distance.
 *
 * The curve is *anchored*, not absolute: field of view is defined relative to
 * wherever control was handed over, so at the instant of the first drag the FOV
 * is exactly the FOV the guided camera was already using. An absolute
 * distance→FOV mapping looked correct in isolation and produced a visible snap
 * on the very first frame of free mode, because the authored camera happens to
 * sit at 45 degrees and the curve wanted 39.7 at that distance.
 */
const FOV_PER_UNIT = (FOV_FAR - FOV_NEAR) / (MAX_DISTANCE - MIN_DISTANCE)

export function fovForDistance(state: OrbitState, distance: number): number {
  return THREE.MathUtils.clamp(
    state.fovBase + (distance - state.distanceBase) * FOV_PER_UNIT,
    FOV_NEAR,
    FOV_FAR,
  )
}

export function createOrbitState(): OrbitState {
  return {
    azimuth: 0,
    polar: 0.25,
    distance: 30,
    fov: 45,
    fovBase: 45,
    distanceBase: 30,
    centre: new THREE.Vector3(),
    targetAzimuth: 0,
    targetPolar: 0.25,
    targetDistance: 30,
    targetCentre: new THREE.Vector3(),
  }
}

/**
 * The single orbit state.
 *
 * A module singleton rather than something the controller owns privately,
 * because the DOM zoom and reset controls (4.8) live outside the canvas and
 * have to drive exactly the same numbers the gestures do. Two copies kept in
 * sync would be a second source of truth about where the camera is — the same
 * mistake `nodeMotion.ts` and `sceneRig.ts` exist to avoid. There is only ever
 * one scene.
 */
export const orbitState: OrbitState = createOrbitState()


/**
 * Seeds the orbit from wherever the guided camera currently is, so handing
 * control over does not move the frame at all.
 *
 * **The rig quaternion is the inverse of the camera's orientation, exactly.**
 * That is not a tuned approximation, it falls out of the arithmetic. In free
 * mode a local point L renders at `Q·(L − centre) − (0,0,d)` where Q is the rig
 * rotation; under the guided camera at P looking at T the same point renders at
 * `Rᵛ⁻¹·(L − T) − (0,0,d)` once you substitute `d = |P − T|`. Setting
 * `centre = T` leaves `Q = Rᵛ⁻¹` as the only solution.
 *
 * Deriving it this way rather than by composing signed azimuth and elevation
 * terms is deliberate: the first attempt here hand-rolled those signs, and the
 * handover visibly snapped to a mirrored view. `lookAt` already knows the
 * convention — ask it instead of re-deriving it.
 *
 * The Euler decomposition afterwards is only so dragging has two scalars to add
 * to, and **the order has to be XYZ, not the YXZ an orbit camera would use.** A
 * roll-free `lookAt` camera is `Ry(a)·Rx(b)`, which is YXZ with a zero Z term;
 * its inverse is `Rx(−b)·Ry(−a)`, which is *XYZ* with a zero Z term. Decomposing
 * the inverse as YXZ needs a non-zero Z, and silently dropping it — which is
 * what the first version of this did — tilts the seeded view off the guided one
 * by a few degrees on every axis at once. It looks like a botched sign until you
 * write the two matrices out.
 *
 * XYZ is also the right order for the feel: `Rx·Ry` rotates about scene-up first
 * and tilts second, which is what orbiting means.
 */
const seedMatrix = new THREE.Matrix4()
const seedQuaternion = new THREE.Quaternion()
const seedEuler = new THREE.Euler()
const UP = new THREE.Vector3(0, 1, 0)

export function seedOrbitFromCamera(
  state: OrbitState,
  cameraPos: THREE.Vector3,
  target: THREE.Vector3,
  fov: number,
): void {
  const distance = THREE.MathUtils.clamp(
    cameraPos.distanceTo(target),
    MIN_DISTANCE,
    MAX_DISTANCE,
  )

  seedMatrix.lookAt(cameraPos, target, UP)
  seedQuaternion.setFromRotationMatrix(seedMatrix).invert()
  seedEuler.setFromQuaternion(seedQuaternion, 'XYZ')

  state.polar = THREE.MathUtils.clamp(seedEuler.x, -POLAR_LIMIT, POLAR_LIMIT)
  state.azimuth = seedEuler.y
  state.distance = distance
  state.distanceBase = distance
  state.fovBase = fov
  state.fov = fov
  state.centre.copy(target)

  state.targetAzimuth = state.azimuth
  state.targetPolar = state.polar
  state.targetDistance = distance
  state.targetCentre.copy(target)
}

export function orbitBy(state: OrbitState, deltaAzimuth: number, deltaPolar: number): void {
  state.targetAzimuth += deltaAzimuth
  state.targetPolar = THREE.MathUtils.clamp(
    state.targetPolar + deltaPolar,
    -POLAR_LIMIT,
    POLAR_LIMIT,
  )
}

export function zoomBy(state: OrbitState, factor: number): void {
  state.targetDistance = THREE.MathUtils.clamp(
    state.targetDistance * factor,
    MIN_DISTANCE,
    MAX_DISTANCE,
  )
}

export function zoomTo(state: OrbitState, distance: number): void {
  state.targetDistance = THREE.MathUtils.clamp(distance, MIN_DISTANCE, MAX_DISTANCE)
}

/**
 * Damps current values toward their targets. Frame-rate independent: the
 * exponent makes a 30 fps frame take exactly the step two 60 fps frames would,
 * so the same flick settles over the same wall-clock time on any device.
 */
export function advanceOrbit(state: OrbitState, delta: number): void {
  const t = 1 - Math.pow(0.0018, Math.min(delta, 0.1))

  state.azimuth += (state.targetAzimuth - state.azimuth) * t
  state.polar += (state.targetPolar - state.polar) * t
  state.distance += (state.targetDistance - state.distance) * t
  state.centre.lerp(state.targetCentre, t)
  state.fov = fovForDistance(state, state.distance)
}

export interface OrbitInputOptions {
  /** The canvas. Gestures are bound here, not to the window. */
  element: HTMLElement
  state: OrbitState
  /** Called on the first real manipulation, to hand authority over. */
  onManipulate: () => void
  /** True while an overlay owns input; gestures are ignored. */
  isBlocked: () => boolean
}

/**
 * Binds drag, wheel and pinch. Returns a teardown function.
 *
 * A drag is only a drag once it clears a few pixels — otherwise every tap on a
 * node would be read as a one-pixel orbit and steal the click, which is the
 * usual way this interaction breaks on touch.
 */
export function bindOrbitInput(options: OrbitInputOptions): () => void {
  const { element, state } = options

  const DRAG_THRESHOLD = 4
  const ORBIT_SPEED = 0.0055

  const pointers = new Map<number, { x: number; y: number }>()
  let dragging = false
  let moved = 0
  let lastX = 0
  let lastY = 0
  let pinchDistance = 0

  function pointerDown(event: PointerEvent) {
    if (options.isBlocked()) return
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY })

    if (pointers.size === 1) {
      dragging = true
      moved = 0
      lastX = event.clientX
      lastY = event.clientY
    } else if (pointers.size === 2) {
      const [a, b] = [...pointers.values()]
      pinchDistance = Math.hypot(a!.x - b!.x, a!.y - b!.y)
    }
  }

  function pointerMove(event: PointerEvent) {
    if (!pointers.has(event.pointerId)) return
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY })

    if (pointers.size >= 2) {
      const [a, b] = [...pointers.values()]
      const next = Math.hypot(a!.x - b!.x, a!.y - b!.y)
      if (pinchDistance > 0 && next > 0) {
        zoomBy(state, pinchDistance / next)
        options.onManipulate()
      }
      pinchDistance = next
      return
    }

    if (!dragging) return

    const dx = event.clientX - lastX
    const dy = event.clientY - lastY
    lastX = event.clientX
    lastY = event.clientY
    moved += Math.abs(dx) + Math.abs(dy)

    if (moved < DRAG_THRESHOLD) return

    options.onManipulate()
    // Dragging right should send the scene left, which is what "grabbing" the
    // world means. The rig carries the inverse of the camera orbit, so the sign
    // that reads as natural here is the un-negated one.
    orbitBy(state, dx * ORBIT_SPEED, -dy * ORBIT_SPEED)
  }

  function pointerUp(event: PointerEvent) {
    pointers.delete(event.pointerId)
    if (pointers.size < 2) pinchDistance = 0
    if (pointers.size === 0) dragging = false
  }

  function wheel(event: WheelEvent) {
    if (options.isBlocked()) return
    // Ctrl+wheel is the browser's pinch-zoom gesture on a trackpad; a plain
    // wheel over the scene is a page scroll and must stay one, because scroll is
    // the guided path's only input. Taking it here would break the tour for
    // every mouse user who never intended to leave it.
    if (!event.ctrlKey) return

    event.preventDefault()
    options.onManipulate()
    zoomBy(state, event.deltaY > 0 ? 1.08 : 0.93)
  }

  element.addEventListener('pointerdown', pointerDown)
  element.addEventListener('pointermove', pointerMove)
  element.addEventListener('pointerup', pointerUp)
  element.addEventListener('pointercancel', pointerUp)
  element.addEventListener('pointerleave', pointerUp)
  element.addEventListener('wheel', wheel, { passive: false })

  return () => {
    element.removeEventListener('pointerdown', pointerDown)
    element.removeEventListener('pointermove', pointerMove)
    element.removeEventListener('pointerup', pointerUp)
    element.removeEventListener('pointercancel', pointerUp)
    element.removeEventListener('pointerleave', pointerUp)
    element.removeEventListener('wheel', wheel)
  }
}
