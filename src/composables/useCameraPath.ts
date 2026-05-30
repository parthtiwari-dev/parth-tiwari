import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import * as THREE from 'three'

const CAMERA_POINTS = [
  new THREE.Vector3(0, 6, 22),
  new THREE.Vector3(1, 5.5, 18), // was (2, 8, 22) — removed upward bump at scroll start
  new THREE.Vector3(-1, 5, 15),
  new THREE.Vector3(0, 2.4, 5.8),
  new THREE.Vector3(0, 2.1, -5.5),
]

const LOOK_AT_POINT = new THREE.Vector3(0, 0, 2)
const FINAL_LOOK_AT_POINT = new THREE.Vector3(0, 0.35, 5.8)

export function useCameraPath(camera: THREE.Camera | undefined) {
  if (!camera || typeof window === 'undefined') {
    return () => {}
  }

  const activeCamera = camera
  const path = new THREE.CatmullRomCurve3(CAMERA_POINTS, false, 'catmullrom', 0.5)
  const cameraProgress = { value: 0 }
  const lookTarget = new THREE.Vector3()
  const section = document.getElementById('constellation-section')

  function updateCamera() {
    const point = path.getPoint(cameraProgress.value)
    // KEY FIX: was smoothstep(t, 0.78, 1) — the old window started AFTER the camera
    // had already crossed z=2 (the lookAt target) at t≈0.83, producing a degenerate
    // lookAt matrix and the visible flip. By starting at 0.30 and finishing at 0.82,
    // the lookAt is already at FINAL_LOOK_AT_POINT (z=5.8) before the camera ever
    // reaches z=2. The end frame is identical; only the path to it is smooth.
    const finalCompositionMix = THREE.MathUtils.smoothstep(cameraProgress.value, 0.30, 0.82)
    const handoffFade = THREE.MathUtils.smoothstep(cameraProgress.value, 0.84, 1)

    activeCamera.position.copy(point)
    lookTarget.copy(LOOK_AT_POINT).lerp(FINAL_LOOK_AT_POINT, finalCompositionMix)
    activeCamera.lookAt(lookTarget)
    section?.style.setProperty('--constellation-fade', handoffFade.toFixed(3))
  }

  updateCamera()

  // Removed ease: 'power2.inOut' — adding a GSAP ease on top of ScrollTrigger scrub
  // double-eases the mid-scroll and contributed to the jolt feeling.
  // scrub 2.4 → 1.5: tighter followthrough without losing smoothness.
  const tween = gsap.to(cameraProgress, {
    value: 1,
    scrollTrigger: {
      trigger: '#constellation-section',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1.5,
    },
    onUpdate: updateCamera,
  })

  const cleanup = () => {
    section?.style.setProperty('--constellation-fade', '0')
    tween.scrollTrigger?.kill()
    tween.kill()
  }

  requestAnimationFrame(() => ScrollTrigger.refresh())
  return cleanup
}