import * as THREE from 'three'
import fragmentShader from '@/shaders/particle.frag.glsl'
import vertexShader from '@/shaders/particle.vert.glsl'
import type { Project } from '@/types/project'
import { layoutFor, type ScaleMode } from '@/data/layout'
import { clusterOffsets } from '@/data/nodeMotion'
import { getQuality } from '@/utils/qualityTier'

// Particle count now comes from the shared tier (PLAN.md 2.4). This used to be
// its own hardwareConcurrency branch, one of three independent quality
// decisions that never agreed with each other.
function getParticleCount() {
  return getQuality().particleCount
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

/**
 * The aura around a node scales with the node itself, which is now derived from
 * evidence depth (PLAN.md 3.1). Previously a lookup keyed on a hand-picked
 * t-shirt size that no longer exists.
 */
function clusterRadius(projectId: string) {
  return 0.42 + layoutFor(projectId).radius * 1.9
}

function nodeClearanceRadius(project: Project) {
  // Keep ambient stars out of the node's own glow. Scales with the derived
  // radius so an evidence-heavy node clears more space, as it should.
  return 0.7 + layoutFor(project.id).radius * 1.4
}

function isInsideNodeClearance(x: number, y: number, z: number, projects: Project[]) {
  return projects.some((project) => {
    const clearance = nodeClearanceRadius(project)
    const at = layoutFor(project.id).position
    const dx = x - at.x
    const dy = y - at.y
    const dz = z - at.z

    return dx * dx + dy * dy + dz * dz < clearance * clearance
  })
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
  projects: Project[],
) {
  const positionIndex = index * 3
  let x = 0
  let y = 0
  let z = 0

  // Volume tightened from 70×34×66 to 48×28×42.
  // Same count in a smaller volume = meaningfully denser field in view.
  for (let attempt = 0; attempt < 8; attempt += 1) {
    x = (random() - 0.5) * 48
    y = (random() - 0.48) * 28
    z = -2 + random() * 42

    if (!isInsideNodeClearance(x, y, z, projects)) {
      break
    }
  }

  positions[positionIndex] = x
  positions[positionIndex + 1] = y
  positions[positionIndex + 2] = z
  clusterIndices[index] = -1

  const tier = random()

  if (tier < 0.94) {
    // Faint background field — alpha raised so particles aren't invisible
    sizes[index]      = 0.26 + random() * 0.24
    alphas[index]     = 0.12 + random() * 0.10  // was 0.07 + 0.034 (max 0.22)
    driftSpeeds[index] = 0.045 + random() * 0.04
    twinkles[index]   = 0
  } else if (tier < 0.992) {
    // Mid-brightness — clearly visible individuals
    sizes[index]      = 0.48 + random() * 0.34
    alphas[index]     = 0.18 + random() * 0.12  // was 0.13 + 0.06 (max 0.30)
    driftSpeeds[index] = 0.055 + random() * 0.045
    twinkles[index]   = 0.2 + random() * 0.2
  } else {
    // Rare bright stars
    sizes[index]      = 1.08 + random() * 0.7
    alphas[index]     = 0.48 + random() * 0.24  // was 0.36 + 0.16 (max 0.72)
    driftSpeeds[index] = 0.065 + random() * 0.045
    twinkles[index]   = 0.82 + random() * 0.18
  }

  warmth[index]  = assignStarWarmth(random, 0.975)
  phases[index]  = random() * Math.PI * 2
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
  const at = layoutFor(project.id).position
  const radius = clusterRadius(project.id)
  const theta = random() * Math.PI * 2
  const phi = Math.acos(2 * random() - 1)
  const spread = radius * (0.36 + random() * 1.04)
  const positionIndex = index * 3

  positions[positionIndex]     = at.x + Math.sin(phi) * Math.cos(theta) * spread
  positions[positionIndex + 1] = at.y + Math.sin(phi) * Math.sin(theta) * spread
  positions[positionIndex + 2] = at.z + Math.cos(phi) * spread
  clusterIndices[index] = clusterIndex

  const tier = random()

  if (tier < 0.88) {
    sizes[index]  = 0.22 + random() * 0.2
    alphas[index] = 0.036 + random() * 0.026
    twinkles[index] = 0.04 + random() * 0.08
  } else if (tier < 0.996) {
    sizes[index]  = 0.42 + random() * 0.26
    alphas[index] = 0.058 + random() * 0.034
    twinkles[index] = 0.1 + random() * 0.12
  } else {
    sizes[index]  = 0.75 + random() * 0.32
    alphas[index] = 0.22 + random() * 0.12
    twinkles[index] = 0.72 + random() * 0.22
  }

  warmth[index]      = assignStarWarmth(random, 0.96)
  phases[index]      = random() * Math.PI * 2
  driftSpeeds[index] = 0.08 + random() * 0.08
}

export function useParticleField(projects: Project[]) {
  const count = getParticleCount()
  const ambientCount = Math.floor(count * 0.88)
  const positions    = new Float32Array(count * 3)
  const clusterIndices = new Float32Array(count)
  const sizes        = new Float32Array(count)
  const alphas       = new Float32Array(count)
  const warmth       = new Float32Array(count)
  const phases       = new Float32Array(count)
  const driftSpeeds  = new Float32Array(count)
  const twinkles     = new Float32Array(count)
  const clusterBrightness = Array.from({ length: projects.length }, () => 1)
  // FROZEN SEED. The string is a retired brand name, but it is also the input
  // that determines every ambient star's position. Renaming it reshuffles the
  // entire field. It stays as-is deliberately — see CLAUDE.md on the EPHEMERIS
  // rename, which covers user-visible copy, not RNG seeds.
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
        projects,
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
  geometry.setAttribute('position',      new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('aClusterIndex', new THREE.BufferAttribute(clusterIndices, 1))
  geometry.setAttribute('aSize',         new THREE.BufferAttribute(sizes, 1))
  geometry.setAttribute('aAlpha',        new THREE.BufferAttribute(alphas, 1))
  geometry.setAttribute('aWarmth',       new THREE.BufferAttribute(warmth, 1))
  geometry.setAttribute('aPhase',        new THREE.BufferAttribute(phases, 1))
  geometry.setAttribute('aDriftSpeed',   new THREE.BufferAttribute(driftSpeeds, 1))
  geometry.setAttribute('aTwinkle',      new THREE.BufferAttribute(twinkles, 1))

  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    // Sizes the shader's uClusterBrightness array to match the JS array above.
    // Previously the shader declared a literal [9]; adding a tenth project grew
    // this array while the declaration stayed put, which fails silently.
    defines: {
      CLUSTER_COUNT: Math.max(1, clusterBrightness.length),
    },
    uniforms: {
      uTime:             { value: 0 },
      uClusterBrightness: { value: clusterBrightness },
      // Twelve vec3s per frame instead of rewriting 10,000 positions (3.2).
      uClusterOffset: { value: clusterOffsets },
      uPointSize:        { value: 3.0 },
      uHueOffset:        { value: 0 },
    },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })

  const points = new THREE.Points(geometry, material)
  points.name = 'EphemerisParticleField'
  points.frustumCulled = false

  function update(delta: number, hoveredClusterIndex: number | null, hueOffset = 0) {
    material.uniforms.uTime.value += delta
    material.uniforms.uHueOffset.value = THREE.MathUtils.lerp(
      material.uniforms.uHueOffset.value,
      hueOffset,
      0.025,
    )

    clusterBrightness.forEach((brightness, index) => {
      const target = hoveredClusterIndex === index ? 1.4 : 1
      clusterBrightness[index] = THREE.MathUtils.lerp(brightness, target, 0.08)
    })
  }

  function dispose() {
    geometry.dispose()
    material.dispose()
  }

  /**
   * Slide every aura particle from its old cluster centre to the new one when
   * the scale mode changes (PLAN.md 3.6). Ambient stars (cluster index < 0) do
   * not move — they are the backdrop, not part of any project.
   *
   * Offsets are preserved by translating rather than re-randomising, so the
   * halo a node carries stays recognisably the same halo across the toggle.
   */
  function restack(from: ScaleMode, to: ScaleMode) {
    if (from === to) return
    const attr = geometry.getAttribute('position') as THREE.BufferAttribute
    const array = attr.array as Float32Array

    for (let i = 0; i < count; i += 1) {
      const cluster = clusterIndices[i]
      if (cluster < 0) continue
      const project = projects[cluster]
      if (!project) continue
      const before = layoutFor(project.id, from).position
      const after = layoutFor(project.id, to).position
      const at = i * 3
      array[at] += after.x - before.x
      array[at + 1] += after.y - before.y
      array[at + 2] += after.z - before.z
    }

    attr.needsUpdate = true
    geometry.computeBoundingSphere()
  }

  return {
    points,
    update,
    restack,
    dispose,
  }
}
