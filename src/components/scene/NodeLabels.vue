<script setup lang="ts">
/**
 * Every label in the scene, projected by hand, once per tick
 * (PLAN.md 5.1–5.4 — DESIGN.md §6).
 *
 * This replaces `NodeLabel.vue`, which rendered exactly one card for the hovered
 * project (and later a second instance for the comparison ghost). That shape
 * could not do decluttering: `MAX_NAMES` is a decision about the whole set, and
 * a component that only knows about its own project can never make it. One
 * component, one ticker callback, one pass over twelve nodes.
 *
 * **DOM, not MSDF, and that is a considered split** (5.5). DESIGN.md wants MSDF
 * text in WebGL for in-space labels and real DOM for anything a recruiter or a
 * crawler must read. Everything rendered here is the second kind: project names
 * and taglines, in the document, selectable and readable by a screen reader. The
 * reason MSDF was wanted — correct occlusion against the stars — is solved below
 * by raycasting instead, so the remaining benefit did not justify a new
 * dependency. See PLAN.md 5.5.
 *
 * `CSS2DRenderer` is skipped for the reason DESIGN.md gives: at this node count
 * manual projection into Vue state is cheaper and far more controllable.
 */
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { gsap } from 'gsap'
import * as THREE from 'three'
import type { TresContext } from '@tresjs/core'
import { projects } from '@/data/projects'
import { decideLabels, type LabelCandidate, type LabelLod } from '@/data/labelLod'
import { overlapsChrome } from '@/data/screenRegions'
import { layoutFor } from '@/data/layout'
import { livePosition } from '@/data/nodeMotion'
import { getNodeMeshes } from '@/data/nodeMeshes'
import { toWorld } from '@/data/sceneRig'
import { useNavigationStore } from '@/stores/navigationStore'
import { useScaleModeStore } from '@/stores/scaleModeStore'

const props = defineProps<{
  context: TresContext | null
  hoveredProjectId: string | null
  paused: boolean
}>()

const emit = defineEmits<{
  /** Keeps the star hovered while the pointer sits on its card. */
  hold: [projectId: string | null]
  open: [projectId: string]
}>()

const scaleModeStore = useScaleModeStore()
const navigation = useNavigationStore()

/**
 * The card the pointer is currently resting on, frozen in place.
 *
 * Cards track their star, and stars orbit — measured at roughly 50px/s at the
 * overview. Over the time it takes to move onto a card and press, that is tens
 * of pixels of slide under the cursor. It is *just about* clickable, which is
 * the worst kind of defect: it works when you test it deliberately and feels
 * broken when you do not.
 *
 * So the moment the pointer is on a card, that card stops moving. It still
 * tracks its star up until then, so the association is never in doubt, and it
 * resumes the instant the pointer leaves.
 */
const pinnedId = ref<string | null>(null)

/** Widest a name gets, near enough. Past this from the right edge, flip it. */
const FLIP_MARGIN = 190

interface LabelView {
  id: string
  name: string
  tagline: string
  x: number
  y: number
  lod: LabelLod
  /** 1 when the star is clear, lower when something is in front of it. */
  clarity: number
  /**
   * The receding subject of a pairwise comparison (4.6).
   *
   * Carried alongside the LOD rather than as a fourth level, because it is not a
   * different *amount* of label — it is the same short name with a reason
   * attached. Losing the "Previously" eyebrow in this rewrite would have quietly
   * turned 4.6 back into an unexplained second name floating in the scene.
   */
  comparison: boolean
  /** Draw to the left of the star, because there is no room on the right. */
  flipped: boolean
}

const labels = ref<LabelView[]>(
  projects.map((project) => ({
    id: project.id,
    name: project.name,
    tagline: project.tagline,
    x: 0,
    y: 0,
    lod: 'hidden' as LabelLod,
    clarity: 1,
    comparison: false,
    flipped: false,
  })),
)

const byId = new Map(labels.value.map((label) => [label.id, label]))
const magnitudes = new Map(projects.map((p) => [p.id, layoutFor(p.id).magnitude]))

const projected = new THREE.Vector3()
const worldPosition = new THREE.Vector3()
const rayDirection = new THREE.Vector3()
const raycaster = new THREE.Raycaster()

const cachedRect = { left: 0, top: 0, width: 0, height: 0 }
let rectDirty = true
let measured: HTMLCanvasElement | null = null
let running = false

function invalidateRect() {
  rectDirty = true
}

function readRect(renderer: THREE.WebGLRenderer) {
  const element = renderer.domElement
  if (rectDirty || element !== measured) {
    const rect = element.getBoundingClientRect()
    if (rect.width <= 0 || rect.height <= 0) return null
    cachedRect.left = rect.left
    cachedRect.top = rect.top
    cachedRect.width = rect.width
    cachedRect.height = rect.height
    measured = element
    rectDirty = false
  }
  return cachedRect.width > 0 ? cachedRect : null
}

/**
 * Occlusion by raycast, faded rather than switched (5.2).
 *
 * DESIGN.md is explicit that this must not be the `NoBlending` hole-punch — that
 * technique writes a transparent quad into the colour buffer and breaks under
 * bloom, which this scene runs on every tier above low. A ray from the camera to
 * the star, compared against the nearest node hit, costs one intersection test
 * per *visible* label and cannot interact with the post chain at all.
 *
 * The result fades opacity instead of hiding: a label snapping off as a star
 * passes behind another is far more jarring than one dimming.
 */
function clarityFor(
  camera: THREE.Camera,
  projectId: string,
  at: THREE.Vector3,
): number {
  const meshes = getNodeMeshes()
  if (meshes.length === 0) return 1

  rayDirection.subVectors(at, camera.position)
  const distance = rayDirection.length()
  if (distance <= 0) return 1
  rayDirection.divideScalar(distance)

  raycaster.set(camera.position, rayDirection)
  raycaster.far = distance - 0.001

  const hits = raycaster.intersectObjects(meshes.map((entry) => entry.mesh), false)
  if (hits.length === 0) return 1

  // Anything in front that is not this project's own star occludes it.
  const blocker = hits.find((hit) => {
    const entry = meshes.find((candidate) => candidate.mesh === hit.object)
    return entry ? entry.projectId !== projectId : false
  })
  return blocker ? 0.22 : 1
}

function update() {
  const renderer = props.context?.renderer?.value
  const camera = props.context?.camera?.value
  if (!renderer || !camera) return

  const rect = readRect(renderer as THREE.WebGLRenderer)
  if (!rect) return

  const mode = scaleModeStore.mode
  const candidates: LabelCandidate[] = []
  const comparisonId = navigation.isFree && navigation.focusedProjectId
    ? navigation.previousProjectId
    : null
  const screen = new Map<string, { x: number; y: number; distance: number }>()

  for (const project of projects) {
    toWorld(livePosition(project.id, mode), worldPosition)
    projected.copy(worldPosition).project(camera)

    // The cull everyone ships wrong (DESIGN.md §6). Without it, a star *behind*
    // the camera projects to a mirrored point inside the viewport and its label
    // renders on the wrong side of the screen, tracking backwards.
    const onScreen = projected.z <= 1
      && projected.x >= -1 && projected.x <= 1
      && projected.y >= -1 && projected.y <= 1

    const x = (projected.x * 0.5 + 0.5) * rect.width + rect.left
    const y = (-projected.y * 0.5 + 0.5) * rect.height + rect.top
    const distance = camera.position.distanceTo(worldPosition)

    screen.set(project.id, { x, y, distance })
    candidates.push({
      projectId: project.id,
      magnitude: magnitudes.get(project.id) ?? 0,
      distance,
      hovered: props.hoveredProjectId === project.id,
      focused: navigation.focusedProjectId === project.id,
      comparison: comparisonId === project.id,
      onScreen,
    })
  }

  const candidateFor = (id: string) => candidates.find((c) => c.projectId === id)

  for (const decision of decideLabels(candidates)) {
    const label = byId.get(decision.projectId)
    const at = screen.get(decision.projectId)
    if (!label || !at) continue

    /*
     * Step around the hero copy (PLAN.md 8.12).
     *
     * The hero is `position: fixed` over the canvas and lays out in the same
     * screen coordinates these labels do, so on a 390px phone three names were
     * printing straight through "PARTH TIWARI" and the thesis line. Demote to a
     * dot rather than hide: the star is still the invitation to scroll and
     * removing it entirely would leave the arrival frame emptier than it needs
     * to be — it is the *name* that collides, not the point.
     *
     * A pointed-at or focused label is exempt. Those are the visitor asking a
     * direct question, and the answer outranks the composition.
     */
    let lod = decision.lod
    if (
      (lod === 'name' || lod === 'card')
      && !candidateFor(decision.projectId)?.hovered
      && navigation.focusedProjectId !== decision.projectId
      && overlapsChrome(at.x, at.y)
    ) {
      lod = 'dot'
    }

    if (label.lod !== lod) label.lod = lod
    const isComparison = comparisonId === decision.projectId
    if (label.comparison !== isComparison) label.comparison = isComparison
    if (lod === 'hidden') continue

    if (pinnedId.value !== decision.projectId) {
      if (label.x !== at.x) label.x = at.x
      if (label.y !== at.y) label.y = at.y
      /*
       * Names are drawn to the right of their star, so one near the right edge
       * ran off screen — "Stick and Dot" lost its last three characters on a
       * 390px capture. Flip the whole label to the other side when there is not
       * room, which is what a star chart does and what the existing off-screen
       * cull (which only catches labels whose *anchor* has left the frame)
       * cannot do on its own.
       */
      const flipped = at.x > rect.width + rect.left - FLIP_MARGIN
      if (label.flipped !== flipped) label.flipped = flipped
    }

    // Only pay for the raycast on labels that are actually drawn.
    toWorld(livePosition(decision.projectId, mode), worldPosition)
    const clarity = clarityFor(camera, decision.projectId, worldPosition)
    if (label.clarity !== clarity) label.clarity = clarity
  }
}

function start() {
  if (running) return
  gsap.ticker.add(update)
  running = true
}

function stop() {
  if (!running) return
  gsap.ticker.remove(update)
  running = false
}

const visibleLabels = computed(() => labels.value.filter((label) => label.lod !== 'hidden'))

onMounted(() => {
  window.addEventListener('resize', invalidateRect, { passive: true })
  window.addEventListener('scroll', invalidateRect, { passive: true })
  start()
})

onUnmounted(() => {
  window.removeEventListener('resize', invalidateRect)
  window.removeEventListener('scroll', invalidateRect)
  stop()
})

// The scene pause signal (2.1) covers this too — a paused scene is not moving,
// so there is nothing for the projector to recompute.
watch(() => props.paused, (paused) => (paused ? stop() : start()))
</script>

<template>
  <!--
    `pointer-events: none` on the container, re-enabled per interactive label
    (DESIGN.md §6). Only the full card is interactive; a dot or a name is a
    readout, and making them clickable would put invisible hit targets over the
    scene the raycaster is already picking from.
  -->
  <div class="node-labels" aria-hidden="true">
    <div
      v-for="label in visibleLabels"
      :key="label.id"
      :data-project-id="label.id"
      class="node-labels__item"
      :class="[
        `node-labels__item--${label.lod}`,
        { 'node-labels__item--comparison': label.comparison },
        { 'node-labels__item--flipped': label.flipped },
      ]"
      :style="{
        transform: `translate3d(${label.x}px, ${label.y}px, 0)`,
        opacity: label.clarity,
      }"
    >
      <span v-if="label.lod === 'dot'" class="node-labels__dot" />

      <p v-else-if="label.lod === 'name'" class="node-labels__name">
        <span v-if="label.comparison" class="node-labels__eyebrow">Previously</span>
        {{ label.name }}
      </p>

      <button
        v-else
        type="button"
        class="node-labels__card"
        @pointerenter="pinnedId = label.id; emit('hold', label.id)"
        @pointerleave="pinnedId = null; emit('hold', null)"
        @click="emit('open', label.id)"
      >
        <span class="node-labels__card-name">{{ label.name }}</span>
        <span class="node-labels__card-tagline">{{ label.tagline }}</span>
        <span class="node-labels__card-cue">[CLICK &rarr; OPEN]</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.node-labels {
  position: absolute;
  inset: 0;
  z-index: 30;
  pointer-events: none;
}

.node-labels__item {
  position: absolute;
  left: 0;
  top: 0;
  will-change: transform, opacity;
  /* Fade, never `display: none` (DESIGN.md §6) — including the occlusion fade,
     which changes every time a star passes behind another. */
  transition: opacity 220ms ease;
}

/*
 * Mirrored about the anchor, so the text runs back toward the middle of the
 * frame instead of off the edge.
 *
 * `translateX(-100%)` on the *child* rather than a second transform on the
 * item: the item's transform carries the projected position and is rewritten
 * every frame, so anything composed into it would have to be recomputed in JS
 * for what is a purely presentational offset.
 */
.node-labels__item--flipped .node-labels__name,
.node-labels__item--flipped .node-labels__card {
  transform: translateX(-100%);
  text-align: right;
}

.node-labels__dot {
  display: block;
  width: 0.3rem;
  height: 0.3rem;
  margin: -0.15rem 0 0 -0.15rem;
  border-radius: 50%;
  background: var(--ice-muted);
  opacity: 0.7;
}

.node-labels__eyebrow {
  display: block;
  color: var(--ice-quiet);
  font-size: 0.85em;
  letter-spacing: 0.18em;
}

.node-labels__item--comparison .node-labels__name {
  padding: 0.35rem 0.5rem;
  border: 1px dashed color-mix(in srgb, var(--ice-faint) 70%, transparent);
  border-radius: 0.3rem;
  background: color-mix(in srgb, var(--bg) 70%, transparent);
}

.node-labels__name {
  margin: 0;
  transform: translate(0.75rem, -0.6rem);
  color: var(--ice-muted);
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  text-shadow: 0 0 0.75rem var(--bg), 0 0 0.25rem var(--bg);
  white-space: nowrap;
}

.node-labels__card {
  display: grid;
  gap: 0.25rem;
  transform: translate(1rem, -1rem);
  width: max-content;
  max-width: 17rem;
  padding: 0.7rem 0.85rem;
  border: 1px solid color-mix(in srgb, var(--ice-faint) 62%, transparent);
  border-radius: 0.375rem;
  background: color-mix(in srgb, var(--bg) 72%, transparent);
  box-shadow:
    inset 0 1px 0 color-mix(in srgb, var(--ice) 10%, transparent),
    0 1rem 2.5rem rgb(0 0 0 / 0.28);
  backdrop-filter: blur(14px) saturate(1.2);
  cursor: pointer;
  pointer-events: auto;
  text-align: left;
}

.node-labels__card:focus-visible {
  outline: 2px solid var(--gold-glow);
  outline-offset: 2px;
}

.node-labels__card-name {
  color: var(--gold);
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.node-labels__card-tagline {
  color: var(--ice-muted);
  font-family: var(--font-body);
  font-size: var(--text-sm);
  line-height: 1.35;
}

.node-labels__card-cue {
  margin-top: 0.35rem;
  color: var(--ice-quiet);
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  letter-spacing: 0.16em;
}

@media (prefers-reduced-motion: reduce) {
  .node-labels__item {
    transition: none;
  }
}

@media (max-width: 767px) {
  .node-labels__card {
    max-width: 13rem;
  }

  .node-labels__card-tagline {
    display: none;
  }
}
</style>
