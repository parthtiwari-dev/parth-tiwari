<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useTres } from '@tresjs/core'
import { useCameraPath } from '@/composables/useCameraPath'

const { camera } = useTres()
let cleanupCameraPath: (() => void) | null = null

onMounted(() => {
  cleanupCameraPath = useCameraPath(camera.value)
})

onUnmounted(() => {
  cleanupCameraPath?.()
})
</script>

<template></template>
