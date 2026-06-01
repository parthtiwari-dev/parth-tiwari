<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useLoop, useTres } from '@tresjs/core'
import { projects } from '@/data/projects'
import { useParticleField } from '@/composables/useParticleField'

const props = defineProps<{
  hoveredClusterIndex: number | null
  hueOffset?: number
}>()

const { scene } = useTres()
const particleField = useParticleField(projects)

onMounted(() => {
  scene.value.add(particleField.points)
})

const loopStop = useLoop().onBeforeRender(({ delta }) => {
  particleField.update(delta, props.hoveredClusterIndex, props.hueOffset ?? 0)
})

onUnmounted(() => {
  loopStop.off()
  scene.value.remove(particleField.points)
  particleField.dispose()
})
</script>

<template></template>
