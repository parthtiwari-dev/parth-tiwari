<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useLoop, useTres } from '@tresjs/core'
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

type NodeMesh = THREE.Mesh<THREE.SphereGeometry, THREE.MeshStandardMaterial>
type HaloMesh = THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>
type CoronaMesh = THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>
type GlintMesh = THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>
type HitMesh = THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial>

interface SceneNode {
  project: Project
  clusterIndex: number
  mesh: NodeMesh
  halo: HaloMesh
  corona: CoronaMesh
  glint: GlintMesh
  hitMesh: HitMesh
  localLight: THREE.PointLight | null
  baseRadius: number
  baseEmissiveIntensity: number
  atmosphereOpacity: number
  coronaOpacity: number
  glintRestOpacity: number
  runtimeState: NodeRuntimeState
}

const NODE_VISUAL_SCALE = 0.48

const radiusBySize: Record<Project['node']['size'], number> = {
  large: 0.35,
  'medium-large': 0.28,
  medium: 0.22,
  'medium-small': 0.18,
  small: 0.14,
  tiny: 0.09,
}

const colorByStatus: Record<
  ProjectStatus,
  {
    hex: string
    bodyHex: string
    emissiveIntensity: number
    atmosphereOpacity: number
    coronaOpacity: number
    glintRestOpacity: number
    state: NodeRuntimeState['colorState']
  }
> = {
  complete: {
    hex: '#d7b35a',
    bodyHex: '#3a2a14',
    emissiveIntensity: 1.72,
    atmosphereOpacity: 0.08,
    coronaOpacity: 0.012,
    glintRestOpacity: 0.12,
    state: 'gold',
  },
  active: {
    hex: '#0f9db3',
    bodyHex: '#032733',
    emissiveIntensity: 1.12,
    atmosphereOpacity: 0.072,
    coronaOpacity: 0.01,
    glintRestOpacity: 0.08,
    state: 'teal-active',
  },
  'in-progress': {
    hex: '#c78a62',
    bodyHex: '#3f2519',
    emissiveIntensity: 0.74,
    atmosphereOpacity: 0.06,
    coronaOpacity: 0.008,
    glintRestOpacity: 0.052,
    state: 'amber',
  },
  experience: {
    hex: '#76a8bc',
    bodyHex: '#06151d',
    emissiveIntensity: 0.32,
    atmosphereOpacity: 0.04,
    coronaOpacity: 0.006,
    glintRestOpacity: 0.03,
    state: 'ice-faint',
  },
}

const ringByStatus: Record<ProjectStatus, NodeRuntimeState['ringState']> = {
  complete: 'solid',
  active: 'blinking-live',
  'in-progress': 'pulsing-amber',
  experience: 'static-faint',
}

function createAtmosphereMaterial(color: string, opacity: number) {
  return new THREE.ShaderMaterial({
    vertexShader: `
      varying vec2 vUv;

      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      precision highp float;

      uniform vec3 uColor;
      uniform float uOpacity;
      varying vec2 vUv;

      void main() {
        vec2 center = vUv - vec2(0.5);
        float dist = length(center);
        float atmosphere = exp(-dist * dist * 28.0);
        float core = exp(-dist * dist * 140.0);
        float alpha = (atmosphere * 0.62 + core * 0.38) * uOpacity;

        if (alpha < 0.002) {
          discard;
        }

        gl_FragColor = vec4(uColor, alpha);
      }
    `,
    uniforms: {
      uColor: { value: new THREE.Color(color) },
      uOpacity: { value: opacity },
    },
    transparent: true,
    depthWrite: false,
    depthTest: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
  })
}

function createCoronaMaterial(color: string, opacity: number) {
  return new THREE.ShaderMaterial({
    vertexShader: `
      varying vec2 vUv;

      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      precision highp float;

      uniform vec3 uColor;
      uniform float uOpacity;
      varying vec2 vUv;

      void main() {
        vec2 center = vUv - vec2(0.5);
        float dist = length(center);
        float corona = exp(-dist * dist * 9.0);
        float falloff = 1.0 - smoothstep(0.12, 0.55, dist);
        float alpha = corona * falloff * uOpacity;

        if (alpha < 0.0006) {
          discard;
        }

        gl_FragColor = vec4(uColor, alpha);
      }
    `,
    uniforms: {
      uColor: { value: new THREE.Color(color) },
      uOpacity: { value: opacity },
    },
    transparent: true,
    depthWrite: false,
    depthTest: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
  })
}

function createGlintMaterial(color: string) {
  return new THREE.ShaderMaterial({
    vertexShader: `
      varying vec2 vUv;

      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      precision highp float;

      uniform vec3 uColor;
      uniform float uOpacity;
      varying vec2 vUv;

      void main() {
        vec2 center = vUv - vec2(0.5);
        float core = exp(-dot(center, center) * 180.0);
        float rayX = exp(-abs(center.y) * 92.0) * smoothstep(0.48, 0.03, abs(center.x));
        float rayY = exp(-abs(center.x) * 92.0) * smoothstep(0.48, 0.03, abs(center.y));
        float alpha = (core + (rayX + rayY) * 0.34) * uOpacity;

        if (alpha < 0.002) {
          discard;
        }

        gl_FragColor = vec4(uColor, alpha);
      }
    `,
    uniforms: {
      uColor: { value: new THREE.Color(color) },
      uOpacity: { value: 0.0 },
    },
    transparent: true,
    depthWrite: false,
    depthTest: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
  })
}

const sceneNodes: SceneNode[] = projects.map((project, clusterIndex) => {
  const baseRadius = radiusBySize[project.node.size]
  const visualRadius = baseRadius * NODE_VISUAL_SCALE
  const statusColor = colorByStatus[project.status]
  const geometry = new THREE.SphereGeometry(visualRadius, 48, 24)
  const material = new THREE.MeshStandardMaterial({
    color: statusColor.bodyHex,
    emissive: statusColor.hex,
    emissiveIntensity: statusColor.emissiveIntensity,
    metalness: project.status === 'complete' ? 0.5 : 0.9,
    roughness: project.status === 'complete' ? 0.35 : 0.16,
    transparent: true,
    opacity: project.status === 'experience' ? 0.48 : 0.96,
  })
  const atmosphereSize = visualRadius * 5.2
  const haloGeometry = new THREE.PlaneGeometry(atmosphereSize, atmosphereSize, 1, 1)
  const haloMaterial = createAtmosphereMaterial(statusColor.hex, statusColor.atmosphereOpacity)
  const coronaSize = visualRadius * (project.status === 'complete' || project.status === 'active' ? 12 : 10)
  const coronaGeometry = new THREE.PlaneGeometry(coronaSize, coronaSize, 1, 1)
  const coronaMaterial = createCoronaMaterial(statusColor.hex, statusColor.coronaOpacity)
  const glintGeometry = new THREE.PlaneGeometry(visualRadius * 5.6, visualRadius * 5.6, 1, 1)
  const glintMaterial = createGlintMaterial(statusColor.hex)
  const hitRadius = Math.max(baseRadius * 1.35, visualRadius + 0.14)
  const hitGeometry = new THREE.SphereGeometry(hitRadius, 16, 8)
  const hitMaterial = new THREE.MeshBasicMaterial({
    transparent: true,
    opacity: 0,
    depthWrite: false,
    depthTest: false,
  })
  const mesh = new THREE.Mesh(geometry, material)
  const halo = new THREE.Mesh(haloGeometry, haloMaterial)
  const corona = new THREE.Mesh(coronaGeometry, coronaMaterial)
  const glint = new THREE.Mesh(glintGeometry, glintMaterial)
  const hitMesh = new THREE.Mesh(hitGeometry, hitMaterial)
  const localLightIntensity = project.status === 'complete' ? 0.3 : project.status === 'active' ? 0.06 : 0
  const localLight = localLightIntensity > 0
    ? new THREE.PointLight(statusColor.hex, localLightIntensity, project.status === 'complete' ? 2.4 : 1.6, 2)
    : null

  mesh.name = `EvidenceBoundNode:${project.id}`
  halo.name = `EvidenceBoundNodeHalo:${project.id}`
  corona.name = `EvidenceBoundNodeCorona:${project.id}`
  glint.name = `EvidenceBoundNodeGlint:${project.id}`
  hitMesh.name = `EvidenceBoundNodeHit:${project.id}`
  mesh.position.set(project.node.position.x, project.node.position.y, project.node.position.z)
  halo.position.copy(mesh.position)
  corona.position.copy(mesh.position)
  glint.position.copy(mesh.position)
  hitMesh.position.copy(mesh.position)
  corona.renderOrder = 3
  halo.renderOrder = 4
  glint.renderOrder = 6
  hitMesh.renderOrder = 5

  if (localLight) {
    localLight.name = `EvidenceBoundNodeLight:${project.id}`
    localLight.position.copy(mesh.position)
  }

  group.add(corona)
  group.add(halo)
  group.add(mesh)
  group.add(glint)
  group.add(hitMesh)

  if (localLight) {
    group.add(localLight)
  }

  return {
    project,
    clusterIndex,
    mesh,
    halo,
    corona,
    glint,
    hitMesh,
    localLight,
    baseRadius,
    baseEmissiveIntensity: statusColor.emissiveIntensity,
    atmosphereOpacity: statusColor.atmosphereOpacity,
    coronaOpacity: statusColor.coronaOpacity,
    glintRestOpacity: statusColor.glintRestOpacity,
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
  mesh: node.hitMesh,
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

// Stable per-node phase offset so each star pulses at a different rhythm
const nodePhaseOffsets = sceneNodes.map((_, i) => i * 1.37 + 0.42)

const loopStop = useLoop().onBeforeRender(({ elapsed }) => {
  const activeCamera = camera.value

  sceneNodes.forEach((node, i) => {
    const pulseWave = Math.sin(elapsed * 0.9 + nodePhaseOffsets[i])
    const targetScale = node.runtimeState.hovered ? NODE_HOVER_SCALE : 1
    node.runtimeState.scale = THREE.MathUtils.lerp(node.runtimeState.scale, targetScale, 0.14)
    const microBreathScale = 1 + 0.015 * pulseWave
    const visualScale = node.runtimeState.scale * microBreathScale
    const atmosphereScale = node.runtimeState.scale * (1 + 0.012 * pulseWave)

    node.mesh.material.emissiveIntensity = THREE.MathUtils.lerp(
      node.mesh.material.emissiveIntensity,
      node.baseEmissiveIntensity * (1 + 0.28 * pulseWave),
      0.06,
    )
    node.mesh.scale.setScalar(visualScale)
    node.corona.scale.setScalar(THREE.MathUtils.lerp(node.corona.scale.x, atmosphereScale, 0.08))
    node.halo.scale.setScalar(THREE.MathUtils.lerp(node.halo.scale.x, atmosphereScale, 0.1))
    node.glint.scale.setScalar(THREE.MathUtils.lerp(node.glint.scale.x, atmosphereScale, 0.12))
    node.hitMesh.scale.setScalar(node.runtimeState.scale)
    node.corona.material.uniforms.uOpacity.value = THREE.MathUtils.lerp(
      node.corona.material.uniforms.uOpacity.value,
      (node.runtimeState.hovered ? node.coronaOpacity * 1.4 : node.coronaOpacity) * (1 + 0.1 * pulseWave),
      0.08,
    )
    node.halo.material.uniforms.uOpacity.value = THREE.MathUtils.lerp(
      node.halo.material.uniforms.uOpacity.value,
      (node.runtimeState.hovered ? node.atmosphereOpacity * 1.25 : node.atmosphereOpacity) * (1 + 0.12 * pulseWave),
      0.08,
    )
    node.glint.material.uniforms.uOpacity.value = THREE.MathUtils.lerp(
      node.glint.material.uniforms.uOpacity.value,
      node.runtimeState.hovered ? 0.22 : node.glintRestOpacity,
      0.08,
    )
    node.mesh.material.opacity = node.runtimeState.active ? 1 : node.project.status === 'experience' ? 0.48 : 0.96

    if (activeCamera) {
      node.corona.quaternion.copy(activeCamera.quaternion)
      node.halo.quaternion.copy(activeCamera.quaternion)
      node.glint.quaternion.copy(activeCamera.quaternion)
      node.glint.rotateZ(elapsed * 0.3 + nodePhaseOffsets[i])
    }
  })
})

onUnmounted(() => {
  loopStop.off()
  stopInteraction?.()
  scene.value.remove(group)

  sceneNodes.forEach((node) => {
    node.mesh.geometry.dispose()
    node.mesh.material.dispose()
    node.corona.geometry.dispose()
    node.corona.material.dispose()
    node.halo.geometry.dispose()
    node.halo.material.dispose()
    node.glint.geometry.dispose()
    node.glint.material.dispose()
    node.hitMesh.geometry.dispose()
    node.hitMesh.material.dispose()
  })
})
</script>

<template></template>
