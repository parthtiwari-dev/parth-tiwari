<script setup lang="ts">
/**
 * The one thing that writes the camera, in either mode (PLAN.md 4.1–4.5).
 *
 * This replaces `CameraPathController`, which only knew about the scripted path.
 * The two modes were never going to survive as two components: both want to own
 * the camera transform, and the handover between them has to be seamless in the
 * same frame. One writer, one clock.
 *
 * **Guided** samples the authored pose array against scroll and applies it, with
 * the rig at identity — byte-for-byte the behaviour before Phase 4.
 *
 * **Free** leaves the camera on the +z axis looking at the origin, and rotates
 * the *rig* underneath it (DESIGN.md §4). Drag-to-orbit then costs two Euler
 * angles instead of an orbit camera that has to be reconciled with a scripted
 * one, and zoom is a field-of-view change rather than a dolly.
 */
import { onMounted, onUnmounted, watch } from 'vue'
import { useLoop, useTres } from '@tresjs/core'
import * as THREE from 'three'
import { createScrollProgress, useCameraPath } from '@/composables/useCameraPath'
import {
  advanceOrbit,
  bindOrbitInput,
  MAX_DISTANCE,
  MIN_DISTANCE,
  orbitState as orbit,
  seedOrbitFromCamera,
} from '@/composables/useFreeOrbit'
import { sampleCameraPath, type CameraSample } from '@/data/cameraPath'
import { constellationExtent } from '@/data/layout'
import { livePosition } from '@/data/nodeMotion'
import { registerSceneRig } from '@/data/sceneRig'
import { useEvidenceOverlayStore } from '@/stores/evidenceOverlayStore'
import { useNavigationStore, SCALE_DISTANCE } from '@/stores/navigationStore'
import { useOverlayStore } from '@/stores/overlayStore'
import { useScaleModeStore } from '@/stores/scaleModeStore'

const props = defineProps<{
  rig: THREE.Object3D | null
}>()

const { camera, renderer } = useTres()
const navigation = useNavigationStore()
const overlayStore = useOverlayStore()
const evidenceOverlayStore = useEvidenceOverlayStore()
const scaleModeStore = useScaleModeStore()

const progress = createScrollProgress()

// Allocated once; written every frame.
const sample: CameraSample = {
  position: new THREE.Vector3(),
  target: new THREE.Vector3(),
}
const rigOffset = new THREE.Vector3()
const rigQuaternion = new THREE.Quaternion()
const rigEuler = new THREE.Euler()

/**
 * The reveal (PLAN.md 4.9).
 *
 * "Everything in one frame" is a geometric claim, and the typed pose could not
 * keep it: the old path ended inside the ring looking outward and put four of
 * twelve nodes on screen. Containing a disc of radius R needs
 * `R / tan(halfAngle)` on whichever screen axis is narrower — and on a portrait
 * phone that is the *horizontal* one, where the half-angle is only
 * `atan(tan(vFov/2) * aspect)`. At 390x844 that is 10.8°, so a ring the desktop
 * frames comfortably at 32 units would need 70. No single typed number can be
 * right for both.
 *
 * So the last stretch of the path is framed rather than positioned: keep the
 * pose's direction, and push the camera out along it until the extent fits.
 * Where that would exceed `MAX_DISTANCE` the field of view opens instead, up to
 * a cap — a phone showing a wide establishing shot is normal, a phone showing a
 * third of the work is not.
 *
 * `REVEAL_FROM` is where the widening starts. Earlier than that the authored
 * poses are the shot and nothing should touch them.
 */
const BASE_FOV = 45
const REVEAL_FROM = 0.82
const REVEAL_MARGIN = 1.08
const MAX_REVEAL_FOV = 78

const revealDirection = new THREE.Vector3()

function frameReveal(camera: THREE.PerspectiveCamera, progress: number) {
  if (progress < REVEAL_FROM) {
    if (Math.abs(camera.fov - BASE_FOV) > 0.01) {
      camera.fov = BASE_FOV
      camera.updateProjectionMatrix()
    }
    return
  }

  const extent = constellationExtent(scaleModeStore.mode) * REVEAL_MARGIN
  const blend = THREE.MathUtils.smoothstep(progress, REVEAL_FROM, 1)

  // Narrower screen axis wins. On a desktop that is vertical; on a phone held
  // upright it is horizontal, and getting this backwards is exactly how the
  // pose came to be authored for one device.
  const halfVertical = THREE.MathUtils.degToRad(BASE_FOV) / 2
  const halfHorizontal = Math.atan(Math.tan(halfVertical) * camera.aspect)
  const halfAngle = Math.min(halfVertical, halfHorizontal)

  const needed = extent / Math.tan(halfAngle)
  const posed = sample.position.distanceTo(sample.target)
  const reach = Math.min(Math.max(posed, needed), MAX_DISTANCE)

  revealDirection.copy(sample.position).sub(sample.target)
  const posedLength = revealDirection.length()
  if (posedLength > 1e-4) {
    revealDirection.multiplyScalar(THREE.MathUtils.lerp(posed, reach, blend) / posedLength)
    camera.position.copy(sample.target).add(revealDirection)
  }

  // Still short? Open the lens for the remainder rather than cropping the work.
  let fov = BASE_FOV
  if (needed > reach) {
    const shortfall = Math.atan(extent / reach)
    const wideVertical = camera.aspect >= 1
      ? shortfall
      : Math.atan(Math.tan(shortfall) / camera.aspect)
    fov = Math.min(MAX_REVEAL_FOV, THREE.MathUtils.radToDeg(wideVertical) * 2)
  }

  const blended = THREE.MathUtils.lerp(BASE_FOV, fov, blend)
  if (Math.abs(camera.fov - blended) > 0.01) {
    camera.fov = blended
    camera.updateProjectionMatrix()
  }
}

let stopPath: (() => void) | null = null
let stopInput: (() => void) | null = null
let lastGuidedProgress = Number.NaN
let lastAspect = Number.NaN
let seeded = false

/**
 * Idle autopilot (PLAN.md 6.13).
 *
 * Someone who drags once and then stops — to read a label, or because they got
 * up — is left staring at a frozen frame, which reads as a scene that has
 * finished rather than one waiting. A slow drift keeps it alive.
 *
 * It nudges the *target* azimuth, not the current one, so it goes through the
 * same damping as a drag and can never fight one: any real input resets the
 * clock and the drift stops immediately. Guided mode is exempt — the scroll path
 * is already the motion there, and a second source moving the camera would be
 * the two-writers bug this component exists to prevent.
 */
const IDLE_AFTER_SECONDS = 12
const IDLE_DRIFT_RATE = 0.028
let idleSeconds = 0
let lastTargetAzimuth = Number.NaN
let lastTargetPolar = Number.NaN
let lastTargetDistance = Number.NaN

function overlayOwnsInput() {
  return overlayStore.isOpen || evidenceOverlayStore.isOpen
}

/**
 * Hands the guided camera's current framing to the orbit state, once, on the
 * first manipulation. Without this the first drag snaps to whatever the orbit
 * defaults happened to be.
 */
function handOver() {
  idleSeconds = 0
  if (!seeded) {
    sampleCameraPath(progress.value, sample)
    const active = camera.value as THREE.PerspectiveCamera | undefined
    seedOrbitFromCamera(orbit, sample.position, sample.target, active?.fov ?? 45)
    seeded = true
  }
  navigation.enterFree()
}

/**
 * Re-centres the rig on the focused node (PLAN.md 4.4).
 *
 * DESIGN.md §4 frames this as a float-precision fix, inherited from 100,000
 * Stars where one unit is a light year and flying inward genuinely accumulates
 * error until the scene jitters. **That reason does not apply here and this file
 * should not pretend it does**: the whole constellation spans about 34 units, so
 * float32 resolves it to roughly 4e-6 units and there is no drift to fix.
 *
 * It is kept because the *interaction* reason is real and independent — orbiting
 * a node you are inspecting has to pivot around that node, not around the origin
 * it happens to be 13 units away from. Zeroing the offset is how you get that.
 */
/** How far the centre slides from the subject toward its predecessor. */
const PAIR_BIAS = 0.35
/** Breathing room so neither node sits exactly on the frame edge. */
const PAIR_MARGIN = 1.2

const previousPosition = new THREE.Vector3()

function syncFocusCentre() {
  const focused = navigation.focusedProjectId
  if (!focused) {
    orbit.targetCentre.set(0, 0, 0)
    return
  }

  const at = livePosition(focused, scaleModeStore.mode)
  orbit.targetCentre.copy(at)

  // Pairwise comparison (PLAN.md 4.6). "The previously-focused project stays in
  // frame, receding" is a framing requirement, not a label requirement: at
  // project scale the previous node is usually tens of units away and simply
  // outside the frustum, so labelling it without moving the camera would put a
  // card on empty space. Bias the centre a quarter of the way toward it and
  // open the distance enough to contain the pair — the subject still dominates
  // the frame, and the other one is visibly smaller and further off, which is
  // the comparison the legend's "bigger node = stronger evidence" needs.
  const previous = navigation.previousProjectId
  if (!previous || previous === focused) return

  previousPosition.copy(livePosition(previous, scaleModeStore.mode))

  // Bias the centre toward the subject rather than splitting the difference, so
  // the focused node still reads as *the* subject and the other one as context.
  orbit.targetCentre.lerp(previousPosition, PAIR_BIAS)

  // Then open the distance until the further of the two actually fits the
  // frustum. Guessing a multiple of the separation is what the first version
  // did, and it under-shot badly enough that the ghost label ended up clamped
  // against the bottom of the screen with its star below the viewport. Vertical
  // is the binding constraint — the viewport is wider than it is tall.
  const halfExtent = Math.max(
    orbit.targetCentre.distanceTo(at),
    orbit.targetCentre.distanceTo(previousPosition),
  )
  const halfFov = THREE.MathUtils.degToRad(orbit.fov) / 2
  const needed = (halfExtent / Math.tan(halfFov)) * PAIR_MARGIN

  orbit.targetDistance = THREE.MathUtils.clamp(
    Math.max(orbit.targetDistance, needed),
    MIN_DISTANCE,
    MAX_DISTANCE,
  )
}

/**
 * Opening a project is what focuses it — wherever the open came from.
 *
 * This started as a call inside `SceneRoot`'s scene-click handler, which meant
 * clicking a star focused it but choosing the same project from the keyboard
 * rail, or arriving on a `?project=` link, did not. The rail is the accessible
 * route to every project (0.2), so half the visitors got a camera that ignored
 * them. The overlay is the one thing all three paths agree on, so it is the one
 * thing that drives focus.
 */
watch(() => (overlayStore.isOpen ? overlayStore.activeProjectId : null), (projectId) => {
  if (projectId) navigation.focusProject(projectId)
})

watch(() => navigation.focusedProjectId, (focused) => {
  handOver()
  // Set project scale *first*: `syncFocusCentre` may widen it again to fit the
  // pair, and doing it the other way round would throw that away every time.
  if (focused) orbit.targetDistance = SCALE_DISTANCE.project
  syncFocusCentre()
})

watch(() => navigation.mode, (mode) => {
  if (mode === 'guided') {
    seeded = false
    lastGuidedProgress = Number.NaN
  }
})

const loop = useLoop().onBeforeRender(({ delta }) => {
  const activeCamera = camera.value as THREE.PerspectiveCamera | undefined
  if (!activeCamera) return

  if (navigation.mode === 'guided') {
    if (props.rig) {
      props.rig.rotation.set(0, 0, 0)
      props.rig.position.set(0, 0, 0)
      props.rig.updateMatrixWorld(true)
    }
    // A still page is the common case and `lookAt` recomputes a matrix. Aspect
    // is part of the key because the reveal is framed against it — resize the
    // window at the end of the scroll and progress never changes, so keying on
    // progress alone would leave the frame sized for the old viewport.
    if (progress.value === lastGuidedProgress && activeCamera.aspect === lastAspect) return
    lastGuidedProgress = progress.value
    lastAspect = activeCamera.aspect

    sampleCameraPath(progress.value, sample)
    activeCamera.position.copy(sample.position)
    // Widens the last stretch until the whole constellation fits this screen.
    // Writes `position` and `fov`; must run before `lookAt`.
    frameReveal(activeCamera, progress.value)
    activeCamera.lookAt(sample.target)
    // The scale readout claims to describe where the camera is, so it has to be
    // fed in guided mode as well — otherwise it reports the free-orbit default
    // for the entire scripted path and contradicts the view on screen.
    navigation.setDistance(activeCamera.position.distanceTo(sample.target))
    return
  }

  // --- free orbit -----------------------------------------------------------
  //
  // Idle is detected from the targets changing, not from a callback on each
  // input. Gestures, the zoom buttons, focusing a project and the deep link all
  // move the camera by different routes, and a hand-wired "I am an input" call
  // on each of them is a list that the next control will be missing from. The
  // targets are the one thing every route has to touch.
  if (
    Math.abs(orbit.targetAzimuth - lastTargetAzimuth) > 1e-6
    || Math.abs(orbit.targetPolar - lastTargetPolar) > 1e-6
    || Math.abs(orbit.targetDistance - lastTargetDistance) > 1e-4
  ) {
    idleSeconds = 0
  }

  idleSeconds += delta
  if (idleSeconds > IDLE_AFTER_SECONDS && !overlayOwnsInput()) {
    // Ease in over the second after the threshold rather than snapping to full
    // speed, which would read as the page grabbing the camera back.
    const ramp = Math.min((idleSeconds - IDLE_AFTER_SECONDS) / 1.5, 1)
    orbit.targetAzimuth += IDLE_DRIFT_RATE * delta * ramp
  }

  lastTargetAzimuth = orbit.targetAzimuth
  lastTargetPolar = orbit.targetPolar
  lastTargetDistance = orbit.targetDistance

  syncFocusCentre()
  advanceOrbit(orbit, delta)

  if (props.rig) {
    // XYZ, matching `seedOrbitFromCamera` — see the note there.
    rigEuler.set(orbit.polar, orbit.azimuth, 0, 'XYZ')
    rigQuaternion.setFromEuler(rigEuler)
    props.rig.quaternion.copy(rigQuaternion)

    // Put the orbit centre at the world origin, so the camera on +z is looking
    // straight at whatever the viewer chose to look at.
    rigOffset.copy(orbit.centre).applyQuaternion(rigQuaternion).negate()
    props.rig.position.copy(rigOffset)
    props.rig.updateMatrixWorld(true)
  }

  activeCamera.position.set(0, 0, orbit.distance)
  activeCamera.lookAt(0, 0, 0)

  if (Math.abs(activeCamera.fov - orbit.fov) > 0.01) {
    activeCamera.fov = orbit.fov
    activeCamera.updateProjectionMatrix()
  }

  navigation.setDistance(orbit.distance)
})

onMounted(() => {
  sampleCameraPath(0, sample)
  camera.value?.position.copy(sample.position)
  camera.value?.lookAt(sample.target)

  stopPath = useCameraPath(progress)

  const element = renderer.value?.domElement
  if (element) {
    stopInput = bindOrbitInput({
      element,
      state: orbit,
      onManipulate: handOver,
      isBlocked: overlayOwnsInput,
    })
  }
})

onUnmounted(() => {
  loop.off()
  stopPath?.()
  stopInput?.()
  registerSceneRig(null)
})
</script>

<template></template>
