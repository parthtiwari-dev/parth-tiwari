<script setup lang="ts">
/**
 * Reads scroll progress once per rendered frame and applies it to the camera
 * (PLAN.md 2.1, 2.2).
 *
 * The split matters: `useCameraPath` advances a number on scroll, this applies
 * it on render. Scroll rate and frame rate are no longer the same clock, so a
 * fast scroll costs one camera update per painted frame instead of one per
 * scroll event, and a paused loop costs nothing at all.
 */
import { onMounted, onUnmounted } from 'vue'
import { useLoop, useTres } from '@tresjs/core'
import * as THREE from 'three'
import { createScrollProgress, useCameraPath } from '@/composables/useCameraPath'
import { sampleCameraPath, type CameraSample } from '@/data/cameraPath'

const { camera } = useTres()

const progress = createScrollProgress()
// Allocated once. `sampleCameraPath` writes into these every frame.
const sample: CameraSample = {
  position: new THREE.Vector3(),
  target: new THREE.Vector3(),
}

let cleanup: (() => void) | null = null

// Skip the camera write when scroll has not moved since the last frame — a
// still page is the common case, and lookAt() recomputes a matrix.
let lastApplied = Number.NaN

const loop = useLoop().onBeforeRender(() => {
  const activeCamera = camera.value
  if (!activeCamera) return
  if (progress.value === lastApplied) return

  lastApplied = progress.value
  sampleCameraPath(progress.value, sample)
  activeCamera.position.copy(sample.position)
  activeCamera.lookAt(sample.target)
})

onMounted(() => {
  // Place the camera at pose 0 before the first paint, so the opening frame is
  // the composed shot rather than wherever the camera was declared.
  sampleCameraPath(0, sample)
  camera.value?.position.copy(sample.position)
  camera.value?.lookAt(sample.target)

  cleanup = useCameraPath(progress)
})

onUnmounted(() => {
  loop.off()
  cleanup?.()
})
</script>

<template></template>
