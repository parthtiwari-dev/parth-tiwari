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
    large: 1.55,
    'medium-large': 1.3,
    medium: 1.05,
    'medium-small': 0.86,
    small: 0.68,
    tiny: 0.52,
  }

  return radiusBySize[size]
}

function assignStarWarmth(random: () => number, coldChance: number) {
  const roll = random()

  if (roll < coldChance) {
    return random() * 0.035
  }

  if (roll < coldChance + 0.025) {
    return 0.34 + random() * 0.18
  }

  return 0.82 + random() * 0.16
}

function assignAmbientParticle(
  index: number,
  positions: Float32Array,
  clusterIndices: Float32Array,
  sizes: Float32Array,
  alphas: Float32Array,
  warmth: Float32Array,
  phases: Float32Array,
  driftSpeeds: Float32Array,
  twinkles: Float32Array,
  random: () => number,
) {
  const positionIndex = index * 3

  positions[positionIndex] = (random() - 0.5) * 58
  positions[positionIndex + 1] = (random() - 0.48) * 27
  positions[positionIndex + 2] = -9 + random() * 45
  clusterIndices[index] = -1

  const tier = random()

  if (tier < 0.94) {
    sizes[index] = 0.3 + random() * 0.26
    alphas[index] = 0.088 + random() * 0.038
    driftSpeeds[index] = 0.045 + random() * 0.04
    twinkles[index] = 0
  } else if (tier < 0.992) {
    sizes[index] = 0.54 + random() * 0.38
    alphas[index] = 0.16 + random() * 0.065
    driftSpeeds[index] = 0.055 + random() * 0.045
    twinkles[index] = 0.2 + random() * 0.2
  } else {
    sizes[index] = 1.08 + random() * 0.7
    alphas[index] = 0.36 + random() * 0.16
    driftSpeeds[index] = 0.065 + random() * 0.045
    twinkles[index] = 0.82 + random() * 0.18
  }

  warmth[index] = assignStarWarmth(random, 0.965)
  phases[index] = random() * Math.PI * 2
}

function assignAuraParticle(
  index: number,
  auraIndex: number,
  projects: Project[],
  positions: Float32Array,
  clusterIndices: Float32Array,
  sizes: Float32Array,
  alphas: Float32Array,
  warmth: Float32Array,
  phases: Float32Array,
  driftSpeeds: Float32Array,
  twinkles: Float32Array,
  random: () => number,
) {
  const clusterIndex = auraIndex % projects.length
  const project = projects[clusterIndex]
  const radius = clusterRadius(project.node.size)
  const theta = random() * Math.PI * 2
  const phi = Math.acos(2 * random() - 1)
  const spread = radius * (0.42 + random() * 1.28)
  const positionIndex = index * 3

  positions[positionIndex] = project.node.position.x + Math.sin(phi) * Math.cos(theta) * spread
  positions[positionIndex + 1] = project.node.position.y + Math.sin(phi) * Math.sin(theta) * spread
  positions[positionIndex + 2] = project.node.position.z + Math.cos(phi) * spread
  clusterIndices[index] = clusterIndex

  const tier = random()

  if (tier < 0.88) {
    sizes[index] = 0.22 + random() * 0.2
    alphas[index] = 0.045 + random() * 0.032
    twinkles[index] = 0.04 + random() * 0.08
  } else if (tier < 0.996) {
    sizes[index] = 0.42 + random() * 0.26
    alphas[index] = 0.075 + random() * 0.04
    twinkles[index] = 0.1 + random() * 0.12
  } else {
    sizes[index] = 0.75 + random() * 0.32
    alphas[index] = 0.22 + random() * 0.12
    twinkles[index] = 0.72 + random() * 0.22
  }

  warmth[index] = assignStarWarmth(random, 0.95)
  phases[index] = random() * Math.PI * 2
  driftSpeeds[index] = 0.08 + random() * 0.08
}

export function useParticleField(projects: Project[]) {
  const count = getParticleCount()
  const ambientCount = Math.floor(count * 0.84)
  const positions = new Float32Array(count * 3)
  const clusterIndices = new Float32Array(count)
  const sizes = new Float32Array(count)
  const alphas = new Float32Array(count)
  const warmth = new Float32Array(count)
  const phases = new Float32Array(count)
  const driftSpeeds = new Float32Array(count)
  const twinkles = new Float32Array(count)
  const clusterBrightness = Array.from({ length: projects.length }, () => 1)
  const random = seededRandom('evidencebound-particles-hybrid')

  for (let index = 0; index < count; index += 1) {
    if (index < ambientCount) {
      assignAmbientParticle(
        index,
        positions,
        clusterIndices,
        sizes,
        alphas,
        warmth,
        phases,
        driftSpeeds,
        twinkles,
        random,
      )
      continue
    }

    assignAuraParticle(
      index,
      index - ambientCount,
      projects,
      positions,
      clusterIndices,
      sizes,
      alphas,
      warmth,
      phases,
      driftSpeeds,
      twinkles,
      random,
    )
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('aClusterIndex', new THREE.BufferAttribute(clusterIndices, 1))
  geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1))
  geometry.setAttribute('aAlpha', new THREE.BufferAttribute(alphas, 1))
  geometry.setAttribute('aWarmth', new THREE.BufferAttribute(warmth, 1))
  geometry.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1))
  geometry.setAttribute('aDriftSpeed', new THREE.BufferAttribute(driftSpeeds, 1))
  geometry.setAttribute('aTwinkle', new THREE.BufferAttribute(twinkles, 1))

  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uTime: { value: 0 },
      uClusterBrightness: { value: clusterBrightness },
      uPointSize: { value: 2.28 },
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
