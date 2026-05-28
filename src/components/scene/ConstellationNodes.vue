<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useRenderLoop, useTres } from '@tresjs/core'
import * as THREE from 'three'
import { projects } from '@/data/projects'
import {
  CLUSTER_HOVER_BRIGHTNESS,
  NODE_HOVER_SCALE,
  type NodeMeshEntry,
  useNodeInteraction,
} from '@/composables/useNodeInteraction'
import type { NodeRuntimeState } from '@/types/node'
import type { Project, ProjectStatus } from '@/types/project'

const emit = defineEmits<{
  hover: [payload: { projectId: string | null; clusterIndex: number | null }]
  select: [projectId: string]
}>()

const { camera, renderer, scene } = useTres()
const group = new THREE.Group()

group.name = 'EvidenceBoundConstellationNodes'

type NodeMesh = THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial>

interface SceneNode {
  project: Project
  clusterIndex: number
  mesh: NodeMesh
  baseRadius: number
  runtimeState: NodeRuntimeState
}

const radiusBySize: Record<Project['node']['size'], number> = {
  large: 0.35,
  'medium-large': 0.28,
  medium: 0.22,
  'medium-small': 0.18,
  small: 0.14,
  tiny: 0.09,
}

const colorByStatus: Record<ProjectStatus, { hex: string; state: NodeRuntimeState['colorState'] }> = {
  complete: { hex: '#c9a84c', state: 'gold' },
  active: { hex: '#1a6b7a', state: 'teal-active' },
  'in-progress': { hex: '#d4956a', state: 'amber' },
  experience: { hex: '#2e4f5e', state: 'ice-faint' },
}

const ringByStatus: Record<ProjectStatus, NodeRuntimeState['ringState']> = {
  complete: 'solid',
  active: 'blinking-live',
  'in-progress': 'pulsing-amber',
  experience: 'static-faint',
}

const sceneNodes: SceneNode[] = projects.map((project, clusterIndex) => {
  const baseRadius = radiusBySize[project.node.size]
  const statusColor = colorByStatus[project.status]
  const geometry = new THREE.SphereGeometry(baseRadius, 32, 16)
  const material = new THREE.MeshBasicMaterial({
    color: statusColor.hex,
    transparent: true,
    opacity: project.status === 'experience' ? 0.62 : 0.9,
  })
  const mesh = new THREE.Mesh(geometry, material)

  mesh.name = `EvidenceBoundNode:${project.id}`
  mesh.position.set(project.node.position.x, project.node.position.y, project.node.position.z)

  group.add(mesh)

  return {
    project,
    clusterIndex,
    mesh,
    baseRadius,
    runtimeState: {
      projectId: project.id,
      scale: 1,
      colorState: statusColor.state,
      ringState: ringByStatus[project.status],
      clusterBrightness: 1,
      hovered: false,
      active: false,
    },
  }
})

const interactionEntries: NodeMeshEntry[] = sceneNodes.map((node) => ({
  projectId: node.project.id,
  clusterIndex: node.clusterIndex,
  mesh: node.mesh,
}))

const interaction = useNodeInteraction({
  getCamera: () => camera.value,
  getRenderer: () => renderer.value,
  getNodes: () => interactionEntries,
  onHover(projectId, clusterIndex) {
    sceneNodes.forEach((node) => {
      node.runtimeState.hovered = node.project.id === projectId
      node.runtimeState.clusterBrightness = node.project.id === projectId ? CLUSTER_HOVER_BRIGHTNESS : 1
    })

    emit('hover', { projectId, clusterIndex })
  },
  onSelect(projectId) {
    sceneNodes.forEach((node) => {
      node.runtimeState.active = node.project.id === projectId
    })

    emit('select', projectId)
  },
})

let stopInteraction: (() => void) | null = null

onMounted(() => {
  scene.value.add(group)
  stopInteraction = interaction.start()
})

const loopStop = useRenderLoop().onLoop(() => {
  sceneNodes.forEach((node) => {
    const targetScale = node.runtimeState.hovered ? NODE_HOVER_SCALE : 1
    node.runtimeState.scale = THREE.MathUtils.lerp(node.runtimeState.scale, targetScale, 0.14)
    node.mesh.scale.setScalar(node.runtimeState.scale)
    node.mesh.material.opacity = node.runtimeState.active ? 1 : node.project.status === 'experience' ? 0.62 : 0.9
  })
})

onUnmounted(() => {
  loopStop.off()
  stopInteraction?.()
  scene.value.remove(group)

  sceneNodes.forEach((node) => {
    node.mesh.geometry.dispose()
    node.mesh.material.dispose()
  })
})
</script>
