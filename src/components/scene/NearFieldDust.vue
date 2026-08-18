<script setup lang="ts">
/**
 * A thin layer of dust close to the viewer (PLAN.md 6.10 — DESIGN.md §5).
 *
 * From `neal.fun/deep-sea`: **in empty space, motion is invisible without
 * something close to the camera.** The existing particle field is all mid and
 * far, so orbiting moved a field of distant points by a few pixels and the sense
 * of travel was almost entirely carried by the nodes themselves.
 *
 * **Why it lives inside the rig.** Free mode rotates the scene rather than the
 * camera (4.3), so anything parented to the camera would be nailed to the screen
 * and parallax nothing. Inside the rig, dust placed in a shell out near the
 * camera's own orbit distance sweeps across the view several times faster than
 * the constellation at radius 4–13 — which is parallax, obtained for free from
 * the geometry rather than faked with a second transform.
 *
 * Deliberately sparse and dim. This is a depth cue, not a snowstorm; the moment
 * it becomes legible as particles it stops reading as space and starts reading
 * as weather.
 */
import { onMounted, onUnmounted } from 'vue'
import { useLoop, useTres } from '@tresjs/core'
import * as THREE from 'three'
import { getQuality } from '@/utils/qualityTier'

const { scene } = useTres()

/** Scaled with the tier like everything else; the low tier gets none at all. */
const COUNT = { high: 220, medium: 130, low: 0 }[getQuality().tier]

const INNER = 15
const OUTER = 27

const geometry = new THREE.BufferGeometry()
const positions = new Float32Array(Math.max(COUNT, 1) * 3)
const drift = new Float32Array(Math.max(COUNT, 1))

for (let i = 0; i < COUNT; i += 1) {
  // Even distribution over a spherical shell. `acos(2u - 1)` rather than a
  // uniform polar angle, which would bunch points at the poles.
  const theta = Math.random() * Math.PI * 2
  const phi = Math.acos(2 * Math.random() - 1)
  const radius = INNER + Math.random() * (OUTER - INNER)

  positions[i * 3] = Math.sin(phi) * Math.cos(theta) * radius
  positions[i * 3 + 1] = Math.cos(phi) * radius * 0.55
  positions[i * 3 + 2] = Math.sin(phi) * Math.sin(theta) * radius
  drift[i] = 0.2 + Math.random() * 0.8
}

geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

const material = new THREE.PointsMaterial({
  size: 0.055,
  sizeAttenuation: true,
  color: new THREE.Color('#cfe3ea'),
  transparent: true,
  opacity: 0.3,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
})

const points = new THREE.Points(geometry, material)
points.name = 'EphemerisNearFieldDust'
points.frustumCulled = false

onMounted(() => {
  if (COUNT > 0) scene.value.add(points)
})

const loopStop = useLoop().onBeforeRender(({ delta }) => {
  if (COUNT === 0) return
  const array = geometry.attributes.position.array as Float32Array

  // A slow independent drift on top of the parallax, so the layer is never
  // completely static when the camera is not moving either.
  for (let i = 0; i < COUNT; i += 1) {
    array[i * 3 + 1] += drift[i]! * delta * 0.06
    if (array[i * 3 + 1]! > OUTER * 0.55) array[i * 3 + 1] = -OUTER * 0.55
  }
  geometry.attributes.position.needsUpdate = true
})

onUnmounted(() => {
  loopStop.off()
  scene.value.remove(points)
  geometry.dispose()
  material.dispose()
})
</script>

<template></template>
