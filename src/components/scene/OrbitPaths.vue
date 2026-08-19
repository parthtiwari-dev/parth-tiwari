<script setup lang="ts">
/**
 * The path each node travels, drawn (PLAN.md 8.2 — DESIGN.md §2).
 *
 * This replaces `ConnectorLines`, and the trade is the whole point. Those lines
 * drew `relatedIds` — a hand-typed judgement that nothing on the page explained
 * — as a flat SVG hairline pinned *above* the canvas: constant width and
 * opacity whether an endpoint was four units away or twenty, drawn straight
 * over the centre star, sliding across the frame while everything else
 * parallaxed. It read as a 2D overlay pasted onto a 3D scene because that is
 * precisely what it was.
 *
 * A ring is the opposite on both counts. It is a **measurement** — `orbitRadius`
 * comes out of `layout.ts`, where radius encodes maturity — so it states
 * something true, and it is real geometry inside the rig, so it takes
 * perspective, depth and the rig's rotation like everything else in the world.
 *
 * It also does a job nothing else could. Orbital speed encodes recency, and the
 * honest speeds are slow enough that a visitor sees a still frame: even after
 * `MOTION_SCALE` the quietest project takes minutes to come round. A ring makes
 * the *path* legible when the motion is not, which is the difference between a
 * field of dots and a system — and it is why the void reads as inhabited at a
 * pixel cost of one draw call.
 *
 * One `LineSegments` for all twelve. Twelve `Line` objects would be twelve draw
 * calls to render what is conceptually one diagram.
 */
import { onMounted, onUnmounted, watch } from 'vue'
import { useTres } from '@tresjs/core'
import * as THREE from 'three'
import { projects } from '@/data/projects'
import { layoutFor } from '@/data/layout'
import { useScaleModeStore } from '@/stores/scaleModeStore'
import { readToken } from '@/utils/cssTokens'
import { getQuality } from '@/utils/qualityTier'

const { scene } = useTres()
const scaleModeStore = useScaleModeStore()

/**
 * Segments per ring. 96 is smooth at the closest the camera ever gets to a
 * ring's near edge; the low tier halves it because at 12 rings the vertex count
 * is the only thing here that scales.
 */
const SEGMENTS = getQuality().tier === 'low' ? 48 : 96

const geometry = new THREE.BufferGeometry()

/**
 * Deliberately below the threshold at which this reads as a diagram.
 *
 * These are meant to be *sensed* rather than followed. The per-vertex alpha
 * ramp in `build()` does most of that work; this is the ceiling it ramps from.
 */
const material = new THREE.LineBasicMaterial({
  // `--ice-quiet`, not `--ice-faint`. Faint is a 2.34:1 hairline colour meant
  // for a 1px border against a panel; additive against true black it barely
  // registered at any opacity worth using.
  color: new THREE.Color(readToken('--ice-quiet', '#64818f')),
  transparent: true,
  // 0.34 was invisible in a capture of the reveal frame, where twelve perfect
  // circles seen from above are the clearest statement the scene ever makes
  // about being a system. Additive blending against true black eats far more
  // than it did against the old navy.
  opacity: 0.78,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
  vertexColors: true,
})

const lines = new THREE.LineSegments(geometry, material)
lines.name = 'EphemerisOrbitPaths'
lines.renderOrder = -1
lines.frustumCulled = false

/**
 * Rebuilds every ring for the given scale mode.
 *
 * True scale spreads orbit radii out to 34 where schematic stops at 13.5, so
 * the rings have to follow the mode the same way the nodes do — a ring at the
 * schematic radius under a node at the true one would be the label-detached-
 * from-its-star failure, in a different coat.
 */
function build() {
  const mode = scaleModeStore.mode
  const positions = new Float32Array(projects.length * SEGMENTS * 2 * 3)
  const colors = new Float32Array(projects.length * SEGMENTS * 2 * 3)
  const tint = material.color

  let cursor = 0
  for (const project of projects) {
    const { orbitRadius, position, angle: restingAngle } = layoutFor(project.id, mode)
    const height = position.y

    /**
     * Brightest at the node's *resting* angle, fading around the far side.
     *
     * Baked once rather than tracked per frame, and that is the interesting
     * part rather than a shortcut. `layout.ts` derives the resting angle from
     * `started`, so the bright arc marks where the project began — and because
     * the node then orbits away from it, the gap between the glow and the star
     * is elapsed motion made visible. A uniform ring would have said less and
     * turned the starfield into an orrery diagram, which is technically more
     * informative and much worse: the stars stop being the subject.
     */
    const alphaAt = (angle: number) => {
      const delta = angle - restingAngle
      return 0.1 + 0.9 * Math.pow((1 + Math.cos(delta)) / 2, 2.4)
    }

    for (let s = 0; s < SEGMENTS; s += 1) {
      const a0 = (s / SEGMENTS) * Math.PI * 2
      const a1 = ((s + 1) / SEGMENTS) * Math.PI * 2

      for (const angle of [a0, a1]) {
        positions[cursor] = Math.cos(angle) * orbitRadius
        positions[cursor + 1] = height
        positions[cursor + 2] = Math.sin(angle) * orbitRadius

        const alpha = alphaAt(angle)
        colors[cursor] = tint.r * alpha
        colors[cursor + 1] = tint.g * alpha
        colors[cursor + 2] = tint.b * alpha
        cursor += 3
      }
    }
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  geometry.attributes.position.needsUpdate = true
  geometry.attributes.color.needsUpdate = true
}

build()
watch(() => scaleModeStore.mode, build)

onMounted(() => {
  scene.value.add(lines)
})

onUnmounted(() => {
  scene.value.remove(lines)
  geometry.dispose()
  material.dispose()
})
</script>

<template></template>
