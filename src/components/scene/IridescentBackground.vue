<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useLoop, useTres } from '@tresjs/core'
import * as THREE from 'three'
import fragmentShader from '@/shaders/iridescent.frag.glsl'
import vertexShader from '@/shaders/iridescent.vert.glsl'
import { getQuality } from '@/utils/qualityTier'

const { camera, scene } = useTres()
const geometry = new THREE.SphereGeometry(90, 48, 24)
const uniforms = {
  uTime: { value: 0 },
  uHueShift: { value: 0 },
}
const material = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  // Tiers the most expensive shader in the app instead of running it flat out
  // on every device that can load it (PLAN.md 2.4).
  defines: {
    SKY_OCTAVES: getQuality().skyOctaves,
  },
  uniforms,
  depthTest: false,
  depthWrite: false,
  side: THREE.BackSide,
})
const mesh = new THREE.Mesh(geometry, material)

mesh.name = 'EphemerisIridescentBackground'
mesh.renderOrder = -100
mesh.frustumCulled = false

onMounted(() => {
  scene.value.add(mesh)
})

const loopStop = useLoop().onBeforeRender(({ delta }) => {
  const activeCamera = camera.value

  if (!activeCamera) {
    return
  }

  uniforms.uTime.value += delta
  uniforms.uHueShift.value = (uniforms.uHueShift.value + (delta / 8) * 360) % 360
  mesh.position.copy(activeCamera.position)
})

onUnmounted(() => {
  loopStop.off()
  scene.value.remove(mesh)
  geometry.dispose()
  material.dispose()
})
</script>

<template></template>