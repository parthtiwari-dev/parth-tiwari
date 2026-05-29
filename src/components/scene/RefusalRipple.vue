<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useLoop, useTres } from '@tresjs/core'
import * as THREE from 'three'
import fragmentShader from '@/shaders/refusalRipple.frag.glsl'
import vertexShader from '@/shaders/refusalRipple.vert.glsl'

const { camera, scene } = useTres()
const geometry = new THREE.PlaneGeometry(7, 7)
const uniforms = {
  uTime: { value: 0 },
  uActive: { value: 0 },
}
const material = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  uniforms,
  transparent: true,
  depthWrite: false,
  blending: THREE.NormalBlending,
  side: THREE.DoubleSide,
})
const mesh = new THREE.Mesh(geometry, material)

mesh.name = 'EvidenceBoundRefusalRipple'
mesh.position.set(0, 0, 2)
mesh.renderOrder = 10

onMounted(() => {
  scene.value.add(mesh)
})

const loopStop = useLoop().onBeforeRender(({ elapsed }) => {
  const activeCamera = camera.value
  const cycleTime = elapsed % 30

  uniforms.uActive.value = cycleTime <= 3 ? 1 : 0
  uniforms.uTime.value = cycleTime

  if (activeCamera) {
    mesh.lookAt(activeCamera.position)
  }
})

onUnmounted(() => {
  loopStop.off()
  scene.value.remove(mesh)
  geometry.dispose()
  material.dispose()
})
</script>

<template></template>
