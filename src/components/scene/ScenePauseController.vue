<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue'
import { useLoop } from '@tresjs/core'

const props = defineProps<{
  paused: boolean
}>()

const loop = useLoop()

function applyPauseState(paused: boolean) {
  if (paused) {
    loop.pause()
    loop.pauseRender()
    return
  }

  loop.resume()
  loop.resumeRender()
}

watch(() => props.paused, applyPauseState, { immediate: true })

onMounted(() => {
  applyPauseState(props.paused)
})

onUnmounted(() => {
  loop.resume()
  loop.resumeRender()
})
</script>

<template></template>
