import * as THREE from 'three'
import fragmentShader from '@/shaders/particle.frag.glsl'
import vertexShader from '@/shaders/particle.vert.glsl'
import type { Project } from '@/types/project'

const PARTICLE_COUNTS = {
  high: 10000,
  medium: 5000,
  low: 2000,
} as const

function getParticleCount() {
  if (typeof navigator === 'undefined') {
    return PARTICLE_COUNTS.low
  }

  if (navigator.hardwareConcurrency >= 12) {
    return PARTICLE_COUNTS.high
  }

  if (navigator.hardwareConcurrency >= 6) {
    return PARTICLE_COUNTS.medium
  }

  return PARTICLE_COUNTS.low
}

function seededRandom(seed: string) {
  let hash = 2166136261

  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }

  return () => {
    hash += 0x6d2b79f5
    let value = Math.imul(hash ^ (hash >>> 15), 1 | hash)
    value ^= value + Math.imul(value ^ (value >>> 7), 61 | value)
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296
  }
}

function clusterRadius(size: Project['node']['size']) {
  const radiusBySize: Record<Project['node']['size'], number> = {
    large: 2.8,
    'medium-large': 2.4,
    medium: 2,
    'medium-small': 1.7,
    small: 1.35,
    tiny: 1,
  }

  return radiusBySize[size]
}

export function useParticleField(projects: Project[]) {
  const count = getParticleCount()
  const positions = new Float32Array(count * 3)
  const clusterIndices = new Float32Array(count)
  const clusterBrightness = Array.from({ length: projects.length }, () => 1)
  const random = seededRandom('evidencebound-particles')

  for (let index = 0; index < count; index += 1) {
    const clusterIndex = index % projects.length
    const project = projects[clusterIndex]
    const radius = clusterRadius(project.node.size)
    const theta = random() * Math.PI * 2
    const phi = Math.acos(2 * random() - 1)
    const spread = radius * (0.35 + random())
    const offsetX = Math.sin(phi) * Math.cos(theta) * spread
    const offsetY = Math.sin(phi) * Math.sin(theta) * spread
    const offsetZ = Math.cos(phi) * spread
    const positionIndex = index * 3

    positions[positionIndex] = project.node.position.x + offsetX
    positions[positionIndex + 1] = project.node.position.y + offsetY
    positions[positionIndex + 2] = project.node.position.z + offsetZ
    clusterIndices[index] = clusterIndex
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('aClusterIndex', new THREE.BufferAttribute(clusterIndices, 1))

  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uTime: { value: 0 },
      uClusterBrightness: { value: clusterBrightness },
      uPointSize: { value: 1.65 },
      uColor: { value: new THREE.Color('#d8eaf0') },
    },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })

  const points = new THREE.Points(geometry, material)
  points.name = 'EvidenceBoundParticleField'
  points.frustumCulled = false

  function update(delta: number, hoveredClusterIndex: number | null) {
    material.uniforms.uTime.value += delta

    clusterBrightness.forEach((brightness, index) => {
      const target = hoveredClusterIndex === index ? 1.4 : 1
      clusterBrightness[index] = THREE.MathUtils.lerp(brightness, target, 0.08)
    })
  }

  function dispose() {
    geometry.dispose()
    material.dispose()
  }

  return {
    points,
    update,
    dispose,
  }
}
