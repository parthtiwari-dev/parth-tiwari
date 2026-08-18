<script setup lang="ts">
import { gsap } from 'gsap'
import { layoutFor } from '@/data/layout'
import { useScaleModeStore } from '@/stores/scaleModeStore'
import { onMounted, onUnmounted, ref, computed } from 'vue'
import type { TresContext } from '@tresjs/core'
import * as THREE from 'three'
import { projects } from '@/data/projects'

const scaleModeStore = useScaleModeStore()

const props = defineProps<{
  context: TresContext | null
  paused: boolean
  hoveredProjectId: string | null  // NEW prop — pass from SceneRoot
}>()

interface ConnectorProjection {
  id: string
  x1: number
  y1: number
  x2: number
  y2: number
  visible: boolean
  isActive: boolean  // true when one of its endpoints is hovered
}

interface ConnectorPair {
  id: string
  fromId: string
  toId: string
}

const projectById = new Map(projects.map((project) => [project.id, project]))
const connectorPairs: ConnectorPair[] = []
const seenPairs = new Set<string>()

projects.forEach((project) => {
  project.node.relatedIds.forEach((relatedId) => {
    if (!projectById.has(relatedId)) {
      return
    }

    const orderedIds = [project.id, relatedId].sort()
    const pairKey = orderedIds.join(':')

    if (seenPairs.has(pairKey)) {
      return
    }

    seenPairs.add(pairKey)
    connectorPairs.push({
      id: pairKey,
      fromId: project.id,
      toId: relatedId,
    })
  })
})

const lines = ref<ConnectorProjection[]>(
  connectorPairs.map((pair) => ({
    id: pair.id,
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0,
    visible: false,
    isActive: false,
  })),
)

// Derived: set of project IDs related to the currently hovered node
const relatedToHovered = computed<Set<string>>(() => {
  const hid = props.hoveredProjectId
  if (!hid) return new Set()
  const project = projectById.get(hid)
  if (!project) return new Set()
  return new Set([hid, ...project.node.relatedIds])
})

const projectedPosition = new THREE.Vector3()
const fromPoint = { x: 0, y: 0 }
const toPoint = { x: 0, y: 0 }
const cachedRect = { width: 0, height: 0 }

let rectDirty = true
let measuredElement: HTMLCanvasElement | null = null

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

    cachedRect.width = rect.width
    cachedRect.height = rect.height
    measuredElement = element
    rectDirty = false
  }

  return cachedRect.width > 0 && cachedRect.height > 0 ? cachedRect : null
}

function projectNode(
  projectId: string,
  rect: { width: number; height: number },
  target: { x: number; y: number },
) {
  const camera = props.context?.camera.value
  const project = projectById.get(projectId)

  if (!project || !camera) {
    return false
  }

  projectedPosition
    .copy(layoutFor(project.id, scaleModeStore.mode).position)
    .project(camera)

  if (projectedPosition.z < -1 || projectedPosition.z > 1) {
    return false
  }

  target.x = (projectedPosition.x * 0.5 + 0.5) * rect.width
  target.y = (-projectedPosition.y * 0.5 + 0.5) * rect.height
  return true
}

function deactivateAll() {
  lines.value.forEach((line) => {
    if (line.isActive) {
      line.isActive = false
    }
  })
}

// Driven by gsap.ticker, which also steps Lenis and ScrollTrigger, so scroll
// interpolation and everything reading it advance on one clock (PLAN.md 2.1).
// It used to self-schedule a rAF and early-return while paused, which kept a
// frame callback alive for the whole session doing nothing — and this is the
// loop ARCHITECTURE §11 flags for reallocating an array every frame.
function updateLines() {
  if (props.paused) {
    return
  }

  const related = relatedToHovered.value

  if (related.size === 0) {
    deactivateAll()
    return
  }

  const renderer = props.context?.renderer.value

  if (!renderer) {
    deactivateAll()
    return
  }

  const rect = readRect(renderer)

  if (!rect) {
    deactivateAll()
    return
  }

  connectorPairs.forEach((pair, index) => {
    const line = lines.value[index]
    const isActive = related.has(pair.fromId) && related.has(pair.toId)

    if (!isActive) {
      if (line.isActive) {
        line.isActive = false
      }

      return
    }

    const hasFrom = projectNode(pair.fromId, rect, fromPoint)
    const hasTo = projectNode(pair.toId, rect, toPoint)
    const x1 = hasFrom ? fromPoint.x : 0
    const y1 = hasFrom ? fromPoint.y : 0
    const x2 = hasTo ? toPoint.x : 0
    const y2 = hasTo ? toPoint.y : 0

    if (line.x1 !== x1) {
      line.x1 = x1
    }

    if (line.y1 !== y1) {
      line.y1 = y1
    }

    if (line.x2 !== x2) {
      line.x2 = x2
    }

    if (line.y2 !== y2) {
      line.y2 = y2
    }

    if (line.visible !== (hasFrom && hasTo)) {
      line.visible = hasFrom && hasTo
    }

    if (!line.isActive) {
      line.isActive = true
    }
  })
}

onMounted(() => {
  window.addEventListener('resize', invalidateRect, { passive: true })
  gsap.ticker.add(updateLines)
})

onUnmounted(() => {
  window.removeEventListener('resize', invalidateRect)
  gsap.ticker.remove(updateLines)
})
</script>

<template>
  <svg
    aria-hidden="true"
    class="pointer-events-none absolute inset-0 z-20 h-full w-full overflow-visible"
    data-constellation-connectors
    style="mix-blend-mode: screen;"
  >
    <line
      v-for="line in lines"
      v-show="line.visible && line.isActive"
      :key="line.id"
      class="constellation-line"
      :x1="line.x1"
      :y1="line.y1"
      :x2="line.x2"
      :y2="line.y2"
      stroke="var(--ice-faint)"
      stroke-linecap="round"
      stroke-width="1.1"
      vector-effect="non-scaling-stroke"
      opacity="0.32"
    />
  </svg>
</template>