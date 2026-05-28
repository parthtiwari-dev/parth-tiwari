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
  const sizes = new Float32Array(count)
  const alphas = new Float32Array(count)
  const warmth = new Float32Array(count)
  const phases = new Float32Array(count)
  const driftSpeeds = new Float32Array(count)
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

    const tier = random()

    if (tier < 0.7) {
      sizes[index] = 0.4 + random() * 0.4
      alphas[index] = 0.14 + random() * 0.08
      driftSpeeds[index] = 0.18 + random() * 0.12
    } else if (tier < 0.94) {
      sizes[index] = 1 + random() * 0.8
      alphas[index] = 0.38 + random() * 0.14
      driftSpeeds[index] = 0.22 + random() * 0.16
    } else {
      sizes[index] = 2.5 + random() * 2
      alphas[index] = 0.62 + random() * 0.18
      driftSpeeds[index] = 0.28 + random() * 0.2
    }

    warmth[index] = random()
    phases[index] = random() * Math.PI * 2
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('aClusterIndex', new THREE.BufferAttribute(clusterIndices, 1))
  geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1))
  geometry.setAttribute('aAlpha', new THREE.BufferAttribute(alphas, 1))
  geometry.setAttribute('aWarmth', new THREE.BufferAttribute(warmth, 1))
  geometry.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1))
  geometry.setAttribute('aDriftSpeed', new THREE.BufferAttribute(driftSpeeds, 1))

  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uTime: { value: 0 },
      uClusterBrightness: { value: clusterBrightness },
      uPointSize: { value: 1 },
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
