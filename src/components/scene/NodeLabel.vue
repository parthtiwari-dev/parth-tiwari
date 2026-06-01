<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import type { TresContext } from '@tresjs/core'
import * as THREE from 'three'
import type { Project } from '@/types/project'

const props = defineProps<{
  context: TresContext | null
  project: Project | null
  visible: boolean
  canOpen: boolean
}>()

const nodeKindLabel: Record<Project['nodeKind'], string> = {
  'personal-project': 'PERSONAL PROJECT',
  'work-experience': 'WORK EXPERIENCE',
  'current-build': 'CURRENT BUILD',
  utility: 'UTILITY / TOOLING',
}

const labelPosition = ref({
  x: 0,
  y: 0,
  visible: false,
})

const projectedPosition = new THREE.Vector3()
let frameId = 0

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

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

  const projectedX = (projectedPosition.x * 0.5 + 0.5) * rect.width + rect.left
  const projectedY = (-projectedPosition.y * 0.5 + 0.5) * rect.height + rect.top

  labelPosition.value = {
    x: clamp(projectedX + 18, 16, window.innerWidth - 320),
    y: clamp(projectedY - 18, 16, window.innerHeight - 152),
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
  <Transition name="node-label">
    <div
      v-if="project && labelPosition.visible"
      :key="project.id"
      class="node-label pointer-events-none absolute left-0 top-0 z-30"
      :style="{
        transform: `translate3d(${labelPosition.x}px, ${labelPosition.y}px, 0)`,
      }"
    >
      <div class="node-label__card">
        <p class="type-label text-[color:var(--gold)]">
          {{ project.name }}
        </p>
        <p class="type-body mt-1 text-[length:var(--text-sm)] leading-snug text-[color:var(--ice-muted)]">
          {{ project.tagline }}
        </p>
        <p class="type-mono mt-3 text-[length:var(--text-xs)] uppercase tracking-[0.16em] text-[color:var(--ice-faint)]">
          {{ canOpen ? '[CLICK -> OPEN]' : nodeKindLabel[project.nodeKind] }}
        </p>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.node-label {
  max-width: 18rem;
}

.node-label__card {
  position: relative;
  overflow: hidden;
  padding: 0.75rem 1rem;
  border: 1px solid color-mix(in srgb, var(--ice-faint) 72%, transparent);
  border-radius: 0.25rem;
  background:
    linear-gradient(115deg, color-mix(in srgb, var(--ice) 8%, transparent), transparent 44%),
    rgba(2, 6, 11, 0.82);
  box-shadow:
    inset 0 1px 0 color-mix(in srgb, var(--ice) 12%, transparent),
    0 18px 60px rgba(0, 0, 0, 0.45),
    0 0 2rem color-mix(in srgb, var(--gold) 8%, transparent);
  color: var(--ice);
  backdrop-filter: blur(14px) saturate(1.18);
}

.node-label__card::before,
.node-label__card::after {
  position: absolute;
  pointer-events: none;
  content: '';
}

.node-label__card::before {
  top: 0;
  bottom: 0;
  left: 0;
  width: 1px;
  background: linear-gradient(180deg, transparent, var(--gold-glow), transparent);
  box-shadow: 0 0 1rem color-mix(in srgb, var(--gold) 42%, transparent);
  transform: translateY(-100%);
  animation: node-label-hairline 520ms var(--ease-out-expo) forwards;
}

.node-label__card::after {
  top: 0;
  right: 0;
  width: 42%;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--gold-glow));
  box-shadow: 0 0 0.9rem color-mix(in srgb, var(--gold) 36%, transparent);
  opacity: 0;
  transform: scaleX(0);
  transform-origin: right;
  animation: node-label-edge-glint 520ms var(--ease-out-expo) 80ms forwards;
}

.node-label-enter-active,
.node-label-leave-active {
  transition:
    opacity 130ms var(--ease-in-out),
    filter 160ms var(--ease-in-out);
}

.node-label-enter-from,
.node-label-leave-to {
  opacity: 0;
  filter: blur(3px);
}

.node-label-enter-active .node-label__card {
  animation: node-label-wipe 180ms var(--ease-out-expo) forwards;
  clip-path: inset(0 100% 0 0);
}

@media (prefers-reduced-motion: reduce) {
  .node-label-enter-active,
  .node-label-leave-active {
    transition: none;
  }

  .node-label-enter-from,
  .node-label-leave-to {
    opacity: 1;
    filter: none;
  }

  .node-label-enter-active .node-label__card,
  .node-label__card::before,
  .node-label__card::after {
    animation: none;
  }

  .node-label-enter-active .node-label__card {
    clip-path: none;
  }

  .node-label__card::before {
    transform: none;
  }

  .node-label__card::after {
    opacity: 0.62;
    transform: scaleX(1);
  }
}

@keyframes node-label-wipe {
  to {
    clip-path: inset(0 0 0 0);
  }
}

@keyframes node-label-hairline {
  to {
    transform: translateY(100%);
  }
}

@keyframes node-label-edge-glint {
  0% {
    opacity: 0;
    transform: scaleX(0);
  }

  38% {
    opacity: 0.75;
  }

  100% {
    opacity: 0.42;
    transform: scaleX(1);
  }
}
</style>
