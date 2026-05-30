<script setup lang="ts">
import { onMounted, onUnmounted, ref, computed } from 'vue'
import type { TresContext } from '@tresjs/core'
import * as THREE from 'three'
import { projects } from '@/data/projects'

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
let frameId = 0

function projectNode(projectId: string) {
  const context = props.context
  const project = projectById.get(projectId)
  const camera = context?.camera.value
  const renderer = context?.renderer.value

  if (!project || !camera || !renderer) {
    return null
  }

  const rect = renderer.domElement.getBoundingClientRect()

  if (rect.width <= 0 || rect.height <= 0) {
    return null
  }

  projectedPosition
    .set(project.node.position.x, project.node.position.y, project.node.position.z)
    .project(camera)

  if (projectedPosition.z < -1 || projectedPosition.z > 1) {
    return null
  }

  return {
    x: (projectedPosition.x * 0.5 + 0.5) * rect.width,
    y: (-projectedPosition.y * 0.5 + 0.5) * rect.height,
  }
}

function updateLines() {
  if (!props.paused) {
    const related = relatedToHovered.value

    lines.value = connectorPairs.map((pair) => {
      const from = projectNode(pair.fromId)
      const to = projectNode(pair.toId)
      const isActive =
        related.size > 0 &&
        related.has(pair.fromId) &&
        related.has(pair.toId)

      return {
        id: pair.id,
        x1: from?.x ?? 0,
        y1: from?.y ?? 0,
        x2: to?.x ?? 0,
        y2: to?.y ?? 0,
        visible: Boolean(from && to),
        isActive,
      }
    })
  }

  frameId = requestAnimationFrame(updateLines)
}

onMounted(() => {
  frameId = requestAnimationFrame(updateLines)
})

onUnmounted(() => {
  cancelAnimationFrame(frameId)
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