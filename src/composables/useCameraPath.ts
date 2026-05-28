import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import * as THREE from 'three'

const CAMERA_POINTS = [
  new THREE.Vector3(0, 6, 22),
  new THREE.Vector3(2, 8, 22),
  new THREE.Vector3(-1, 5, 15),
  new THREE.Vector3(0, 2, 6),
  new THREE.Vector3(0, 1, -3),
]

const LOOK_AT_POINT = new THREE.Vector3(0, 0, 2)

export function useCameraPath(camera: THREE.Camera | undefined) {
  if (!camera || typeof window === 'undefined') {
    return () => {}
  }

  const activeCamera = camera
  const path = new THREE.CatmullRomCurve3(CAMERA_POINTS, false, 'catmullrom', 0.5)
  const cameraProgress = { value: 0 }

  function updateCamera() {
    const point = path.getPoint(cameraProgress.value)
    activeCamera.position.copy(point)
    activeCamera.lookAt(LOOK_AT_POINT)
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
