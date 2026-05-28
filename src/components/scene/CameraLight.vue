<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useRenderLoop, useTres } from '@tresjs/core'
import * as THREE from 'three'

const { camera, scene } = useTres()
const light = new THREE.PointLight('#f5e8c8', 16, 70, 1.6)
const cameraOffset = new THREE.Vector3(-2.2, 1.6, 2.4)
const worldOffset = new THREE.Vector3()

light.name = 'EvidenceBoundCameraKeyLight'

onMounted(() => {
  scene.value.add(light)
})

const loopStop = useRenderLoop().onLoop(() => {
  const activeCamera = camera.value

  if (!activeCamera) {
    return
  }

  worldOffset.copy(cameraOffset).applyQuaternion(activeCamera.quaternion)
  light.position.copy(activeCamera.position).add(worldOffset)
})

onUnmounted(() => {
  loopStop.off()
  scene.value.remove(light)
})
</script>

<template></template>
