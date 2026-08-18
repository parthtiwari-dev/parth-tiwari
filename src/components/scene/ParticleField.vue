<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue'
import { useLoop, useTres } from '@tresjs/core'
import { projects } from '@/data/projects'
import { useParticleField } from '@/composables/useParticleField'
import { useScaleModeStore } from '@/stores/scaleModeStore'

const props = defineProps<{
  hoveredClusterIndex: number | null
  hueOffset?: number
}>()

const { scene } = useTres()
const particleField = useParticleField(projects)
const scaleModeStore = useScaleModeStore()

// Auras follow their nodes across a scale change (PLAN.md 3.6). Without this the
// halos stay where the old layout put them and every node drifts away from its
// own glow.
watch(() => scaleModeStore.mode, (to, from) => particleField.restack(from, to))

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
