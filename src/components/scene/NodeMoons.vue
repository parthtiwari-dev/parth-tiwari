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

const { scene } = useTres()
const scaleModeStore = useScaleModeStore()

/** Beyond this the moons read as noise around the node rather than as a stack. */
const MAX_PER_NODE = 6
const MOON_RADIUS = 0.032

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
    colors.push(new THREE.Color().setHSL(((hash >>> 3) % 360) / 360, 0.42, 0.66))
  })
}

const geometry = new THREE.SphereGeometry(MOON_RADIUS, 8, 6)
const material = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.72 })
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
