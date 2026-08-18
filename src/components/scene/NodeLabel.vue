<script setup lang="ts">
import { gsap } from 'gsap'
import { layoutFor } from '@/data/layout'
import { onMounted, onUnmounted, ref, watch } from 'vue'
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
const cachedRect = { left: 0, top: 0, width: 0, height: 0 }

let running = false
let rectDirty = true
let measuredElement: HTMLCanvasElement | null = null

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function invalidateRect() {
  rectDirty = true
}

function readRect(renderer: THREE.WebGLRenderer) {
  const element = renderer.domElement

  if (rectDirty || element !== measuredElement) {
    const rect = element.getBoundingClientRect()

    if (rect.width <= 0 || rect.height <= 0) {
      return null
    }

    cachedRect.left = rect.left
    cachedRect.top = rect.top
    cachedRect.width = rect.width
    cachedRect.height = rect.height
    measuredElement = element
    rectDirty = false
  }

  return cachedRect.width > 0 && cachedRect.height > 0 ? cachedRect : null
}

function setLabelPosition(x: number, y: number, visible: boolean) {
  const current = labelPosition.value

  if (current.x !== x) {
    current.x = x
  }

  if (current.y !== y) {
    current.y = y
  }

  if (current.visible !== visible) {
    current.visible = visible
  }
}

// gsap.ticker, not a private rAF — one clock (PLAN.md 2.1).
function updatePosition() {

  const context = props.context
  const project = props.project
  const camera = context?.camera.value
  const renderer = context?.renderer.value

  if (!props.visible || !project || !camera || !renderer) {
    setLabelPosition(0, 0, false)
    return
  }

  const rect = readRect(renderer)

  if (!rect) {
    setLabelPosition(0, 0, false)
    return
  }

  projectedPosition
    .copy(layoutFor(project.id).position)
    .project(camera)

  const projectedX = (projectedPosition.x * 0.5 + 0.5) * rect.width + rect.left
  const projectedY = (-projectedPosition.y * 0.5 + 0.5) * rect.height + rect.top

  setLabelPosition(
    clamp(projectedX + 18, 16, window.innerWidth - 320),
    clamp(projectedY - 18, 16, window.innerHeight - 152),
    projectedPosition.z >= -1 && projectedPosition.z <= 1,
  )
}

function stopLoop() {
  if (!running) return
  gsap.ticker.remove(updatePosition)
  running = false
}

function startLoop() {
  if (running) return
  gsap.ticker.add(updatePosition)
  running = true
}

watch(
  () => props.visible && Boolean(props.project),
  (active) => {
    if (active) {
      startLoop()
      return
    }

    stopLoop()
    setLabelPosition(0, 0, false)
  },
)

onMounted(() => {
  window.addEventListener('resize', invalidateRect, { passive: true })
  window.addEventListener('scroll', invalidateRect, { passive: true })

  if (props.visible && props.project) {
    startLoop()
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', invalidateRect)
  window.removeEventListener('scroll', invalidateRect)
  stopLoop()
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
        <p class="type-label text-gold">
          {{ project.name }}
        </p>
        <p class="type-body mt-1 text-[length:var(--text-sm)] leading-snug text-ice-muted">
          {{ project.tagline }}
        </p>
        <p class="type-mono mt-3 text-[length:var(--text-xs)] uppercase tracking-[0.16em] text-ice-faint">
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
