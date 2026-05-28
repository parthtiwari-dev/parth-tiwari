<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import type { TresContext } from '@tresjs/core'
import * as THREE from 'three'
import type { Project } from '@/types/project'

const props = defineProps<{
  context: TresContext | null
  project: Project | null
  visible: boolean
}>()

const labelPosition = ref({
  x: 0,
  y: 0,
  visible: false,
})

const projectedPosition = new THREE.Vector3()
let frameId = 0

function updatePosition() {
  const context = props.context
  const project = props.project
  const camera = context?.camera.value
  const renderer = context?.renderer.value

  if (!props.visible || !project || !camera || !renderer) {
    labelPosition.value = { x: 0, y: 0, visible: false }
    frameId = requestAnimationFrame(updatePosition)
    return
  }

  const rect = renderer.domElement.getBoundingClientRect()

  if (rect.width <= 0 || rect.height <= 0) {
    labelPosition.value = { x: 0, y: 0, visible: false }
    frameId = requestAnimationFrame(updatePosition)
    return
  }

  projectedPosition
    .set(project.node.position.x, project.node.position.y, project.node.position.z)
    .project(camera)

  labelPosition.value = {
    x: (projectedPosition.x * 0.5 + 0.5) * rect.width,
    y: (-projectedPosition.y * 0.5 + 0.5) * rect.height,
    visible: projectedPosition.z >= -1 && projectedPosition.z <= 1,
  }

  frameId = requestAnimationFrame(updatePosition)
}

onMounted(() => {
  frameId = requestAnimationFrame(updatePosition)
})

onUnmounted(() => {
  cancelAnimationFrame(frameId)
})
</script>

<template>
  <div
    v-if="project"
    v-show="labelPosition.visible"
    class="pointer-events-none absolute left-0 top-0 max-w-[18rem] rounded border border-[color:var(--ice-faint)] bg-[rgba(12,26,32,0.72)] px-4 py-3 text-[color:var(--ice)] shadow-[0_18px_60px_rgba(0,0,0,0.35)] backdrop-blur-md"
    :style="{
      transform: `translate3d(${labelPosition.x + 18}px, ${labelPosition.y - 18}px, 0)`,
    }"
  >
    <p class="type-label text-[color:var(--gold)]">
      {{ project.name }}
    </p>
    <p class="type-body mt-1 text-[length:var(--text-sm)] leading-snug text-[color:var(--ice-muted)]">
      {{ project.tagline }}
    </p>
    <p class="type-mono mt-3 text-[length:var(--text-xs)] uppercase tracking-[0.16em] text-[color:var(--ice-faint)]">
      [ENTER -&gt;]
    </p>
  </div>
</template>
