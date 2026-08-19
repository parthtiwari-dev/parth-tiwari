<script setup lang="ts">
/**
 * Stack entries as satellites (PLAN.md 3.5, DESIGN.md §2).
 *
 * Each project's `stack[]` orbits it as small moons, and **a technology keeps
 * the same colour everywhere it appears** — hue is hashed from the name, so
 * Next.js is the same blue around BeatMind, Tathya, Stick and Dot and Spur Chat.
 * That recurrence is the point: it makes a stack legible as a fact about the
 * whole body of work rather than a list repeated twelve times.
 *
 * One `InstancedMesh` for every moon on the site rather than a mesh each. At
 * ~90 satellites the draw-call difference is the whole cost of the feature.
 * Skipped entirely on the low quality tier, where the budget is better spent on
 * the nodes themselves.
 */
import { onMounted, onUnmounted, watch } from 'vue'
import { useLoop, useTres } from '@tresjs/core'
import * as THREE from 'three'
import { projects } from '@/data/projects'
import { layoutFor } from '@/data/layout'
import { livePosition } from '@/data/nodeMotion'
import { useScaleModeStore } from '@/stores/scaleModeStore'
import { readToken } from '@/utils/cssTokens'
import { starMatcap } from '@/utils/matcap'

const { scene } = useTres()
const scaleModeStore = useScaleModeStore()

/** Beyond this the moons read as noise around the node rather than as a stack. */
const MAX_PER_NODE = 6

/**
 * 0.032 was invisible (PLAN.md 8.6).
 *
 * At that radius, viewed from the 15-or-so units the guided path actually sits
 * at with a 45 degree lens on a 900px-tall viewport, a moon subtends about
 * **4.6 pixels** — and it was a `MeshBasicMaterial`, so those pixels were one
 * flat colour with no shading at all. Twelve stacks of them read as stuck
 * pixels rather than as satellites, which meant the whole "a technology keeps
 * the same colour everywhere it appears" idea was being made in a language
 * nobody could see.
 *
 * 0.058 puts them at roughly 8.4px, which is where a sphere starts to read as
 * a sphere. That is still comfortably under the smallest node
 * (`MIN_VISIBLE_RADIUS` 0.13 before the 0.48 visual scale), so the hierarchy
 * the size encoding depends on is intact: a moon can never be mistaken for the
 * body it orbits.
 */
const MOON_RADIUS = 0.058

interface Moon {
  projectId: string
  /** Orbit radius around its parent, in world units. */
  distance: number
  phase: number
  speed: number
  /** Tilt of the orbital plane, so they do not all sit in one ring. */
  tilt: number
}

/** Stable 32-bit hash — the same technology must resolve to the same hue. */
function hashName(value: string): number {
  let hash = 2166136261
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

const moons: Moon[] = []
const colors: THREE.Color[] = []

for (const project of projects) {
  const parentRadius = layoutFor(project.id).radius
  project.stack.slice(0, MAX_PER_NODE).forEach((tech, index) => {
    const hash = hashName(tech)
    moons.push({
      projectId: project.id,
      distance: parentRadius * 2.1 + 0.14 + (index % 3) * 0.055,
      // Phase from the hash, not the index: a shared technology then sits at a
      // consistent point in its parent's ring, which reinforces the recurrence.
      phase: ((hash % 1000) / 1000) * Math.PI * 2,
      speed: 0.28 + ((hash >>> 10) % 100) / 420,
      tilt: (((hash >>> 17) % 100) / 100 - 0.5) * 1.1,
    })
    // Lightness up from 0.66: the matcap multiplies the instance colour, so an
    // already-mid tone came out dark once shading was applied.
    colors.push(new THREE.Color().setHSL(((hash >>> 3) % 360) / 360, 0.38, 0.78))
  })
}

// 12x8, up from 8x6. At ~8px a sphere's silhouette is visible, and an
// eight-sided one reads as a polygon. Ninety instances of 96 triangles is
// nothing next to the sky shader.
const geometry = new THREE.SphereGeometry(MOON_RADIUS, 12, 8)

/**
 * Matcap, not `MeshBasicMaterial` (PLAN.md 8.6).
 *
 * Basic material is unlit by definition, so every moon was a flat disc of
 * colour — the exact failure `utils/matcap.ts` was written to fix for the
 * nodes, still standing here. A matcap gives them a light direction and a
 * terminator for one texture lookup and no lights, which is the same bargain
 * the nodes already take.
 *
 * The texture is generated from `--ice` rather than per technology, and
 * `instanceColor` still carries the hue: the matcap supplies *shape* and the
 * per-instance colour supplies *identity*, so a technology stays recognisable
 * everywhere it appears while every moon is shaded the same way.
 */
const material = new THREE.MeshMatcapMaterial({
  matcap: starMatcap(readToken('--ice', '#d8eaf0')),
  transparent: true,
  opacity: 0.82,
})
const mesh = new THREE.InstancedMesh(geometry, material, Math.max(1, moons.length))
mesh.name = 'EphemerisNodeMoons'
mesh.frustumCulled = false
mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)

moons.forEach((_, i) => mesh.setColorAt(i, colors[i]!))
if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true

const dummy = new THREE.Object3D()
const parent = new THREE.Vector3()

function place(elapsed: number) {
  const mode = scaleModeStore.mode
  moons.forEach((moon, i) => {
    parent.copy(livePosition(moon.projectId, mode))
    const angle = moon.phase + elapsed * moon.speed
    dummy.position.set(
      parent.x + Math.cos(angle) * moon.distance,
      parent.y + Math.sin(angle) * moon.distance * moon.tilt,
      parent.z + Math.sin(angle) * moon.distance,
    )
    dummy.updateMatrix()
    mesh.setMatrixAt(i, dummy.matrix)
  })
  mesh.instanceMatrix.needsUpdate = true
}

const loopStop = useLoop().onBeforeRender(({ elapsed }) => place(elapsed))

watch(() => scaleModeStore.mode, () => place(0))

onMounted(() => {
  place(0)
  scene.value.add(mesh)
})

onUnmounted(() => {
  loopStop.off()
  scene.value.remove(mesh)
  geometry.dispose()
  material.dispose()
  mesh.dispose()
})
</script>

<template></template>
