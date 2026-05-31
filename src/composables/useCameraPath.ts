import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import * as THREE from 'three'

const CAMERA_POINTS = [
  new THREE.Vector3(0, 6, 22),
  new THREE.Vector3(1, 5.5, 18),
  new THREE.Vector3(-1, 5, 15),
  new THREE.Vector3(0, 2.4, 5.8),
  new THREE.Vector3(0, 2.1, -7.2),
]

const LOOK_AT_POINT = new THREE.Vector3(0, 0, 2)
const FINAL_LOOK_AT_POINT = new THREE.Vector3(0, 0.7, 9)
const TURN_START = 0.48
const TURN_END = 0.82

export function useCameraPath(camera: THREE.Camera | undefined) {
  if (!camera || typeof window === 'undefined') {
    return () => {}
  }

  const activeCamera = camera
  const path = new THREE.CatmullRomCurve3(CAMERA_POINTS, false, 'catmullrom', 0.5)
  const cameraProgress = { value: 0 }
  const lookTarget = new THREE.Vector3()

  function updateCamera() {
    const point = path.getPoint(cameraProgress.value)
    const turnMix = THREE.MathUtils.smoothstep(cameraProgress.value, TURN_START, TURN_END)

    activeCamera.position.copy(point)
    lookTarget.copy(LOOK_AT_POINT).lerp(FINAL_LOOK_AT_POINT, turnMix)
    activeCamera.lookAt(lookTarget)
  }

  updateCamera()

  const tween = gsap.to(cameraProgress, {
    value: 1,
    ease: 'none',
    scrollTrigger: {
      trigger: '#constellation-section',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1.5,
    },
    onUpdate: updateCamera,
  })

  const cleanup = () => {
    tween.scrollTrigger?.kill()
    tween.kill()
  }

  requestAnimationFrame(() => ScrollTrigger.refresh())
  return cleanup
}
