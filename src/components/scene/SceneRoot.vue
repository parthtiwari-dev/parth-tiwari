<script setup lang="ts">
import { computed, defineAsyncComponent, nextTick, onMounted, onUnmounted, shallowRef, ref, watch } from 'vue'
import { TresCanvas, type TresContext } from '@tresjs/core'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ACESFilmicToneMapping, SRGBColorSpace } from 'three'
import type * as THREE from 'three'
import { usePlainMode } from '@/composables/usePlainMode'
import { useSceneVisibility } from '@/composables/useSceneVisibility'
import { useScrollRunway } from '@/composables/useScrollRunway'
import { useEvidenceOverlayStore } from '@/stores/evidenceOverlayStore'
import { useOverlayStore } from '@/stores/overlayStore'
import { useProjectStore } from '@/stores/projectStore'
import { useScaleModeStore } from '@/stores/scaleModeStore'
import { getQuality } from '@/utils/qualityTier'
// Async + debug-gated so Tweakpane never enters the production entry (2.8).
const CameraAuthoring = defineAsyncComponent(() => import('@/components/scene/CameraAuthoring.vue'))
import CentreStar from '@/components/scene/CentreStar.vue'
import NavigationController from '@/components/scene/NavigationController.vue'
import NearFieldDust from '@/components/scene/NearFieldDust.vue'
import NavigationControls from '@/components/scene/NavigationControls.vue'
import { registerSceneRig } from '@/data/sceneRig'
import { registerScreenRegion } from '@/data/screenRegions'
import ConstellationNodes from '@/components/scene/ConstellationNodes.vue'
import IridescentBackground from '@/components/scene/IridescentBackground.vue'
import NodeLabels from '@/components/scene/NodeLabels.vue'
import NodeMoons from '@/components/scene/NodeMoons.vue'
import OrbitPaths from '@/components/scene/OrbitPaths.vue'
import ParticleField from '@/components/scene/ParticleField.vue'
import PostProcessing from '@/components/scene/PostProcessing.vue'
import ScenePauseController from '@/components/scene/ScenePauseController.vue'

const { isPlain } = usePlainMode()
const overlayStore = useOverlayStore()
const evidenceOverlayStore = useEvidenceOverlayStore()
const projectStore = useProjectStore()
const tresContext = shallowRef<TresContext | null>(null)

/**
 * The group everything in constellation space hangs off (PLAN.md 4.3).
 *
 * `shallowRef`: this holds a Three.js Object3D whose transform is rewritten
 * every frame, and a deep ref would make Vue walk the whole scene graph on each
 * change. It is registered with `data/sceneRig.ts` so the DOM label and
 * connector projectors can convert local node positions to world ones — they
 * compute screen positions by hand and would otherwise ignore the rotation
 * entirely, detaching every label from its star the moment anyone dragged.
 */
const rigRef = shallowRef<{ value?: THREE.Object3D } | THREE.Object3D | null>(null)
const sceneRig = computed<THREE.Object3D | null>(() => {
  const held = rigRef.value as (THREE.Object3D & { value?: THREE.Object3D }) | null
  if (!held) return null
  // TresJS hands back either the instance or a wrapper depending on the node.
  return (held.value ?? held) as THREE.Object3D
})

watch(sceneRig, (rig) => registerSceneRig(rig), { immediate: true })

const hoveredProjectId = ref<string | null>(null)
/** Set while the pointer is resting on a label card; see `handleHover`. */
const labelHeldProjectId = ref<string | null>(null)
const hoveredClusterIndex = ref<number | null>(null)
const selectedProjectId = ref<string | null>(null)
const particleHueOffset = ref(0)
// DPR comes from the shared quality tier (PLAN.md 2.4) rather than a constant.
// On a low-tier handset [1, 1] is roughly half the fragments of [1, 1.25].
// Four viewport-heights of scroll track, in pixels rather than vh so mobile
// browser chrome cannot resize it mid-scroll (PLAN.md 2.7).
const scaleModeStore = useScaleModeStore()
const isDebug = typeof window !== 'undefined'
  && new URLSearchParams(window.location.search).get('debug') === '1'
const runwayHeight = useScrollRunway(4)
// One signal decides whether the scene runs at all (PLAN.md 2.1). Off-screen or
// a hidden tab now stops it, not just an open overlay.
const viewportEl = ref<HTMLElement | null>(null)
const sceneVisible = useSceneVisibility(viewportEl)
const quality = getQuality()
const dpr: [number, number] = quality.dpr
const postFxEnabled = quality.postFx
// Moons are the first thing to go on a phone: ~90 extra instances buys less
// than keeping the nodes themselves smooth (3.5).
const moonsEnabled = quality.tier !== 'low'
let hueMilestoneTrigger: ScrollTrigger | null = null
let hueMilestoneFrame = 0

const sceneInteractionPaused = computed(() => overlayStore.isOpen || evidenceOverlayStore.isOpen)
const sceneAnimationPaused = computed(() => {
  // Not visible outranks everything: there is no reason to render a frame that
  // cannot be seen, whatever the overlay state is.
  if (!sceneVisible.value) return true
  return overlayStore.isOpen || (evidenceOverlayStore.isOpen && evidenceOverlayStore.activeKind !== 'capability')
})
// The DOM label projector runs a per-node raycast and screen projection every
// tick, so it is the loop that most benefits from stopping when unseen.
const overlaysPaused = computed(() => sceneInteractionPaused.value || !sceneVisible.value)

function prefersReducedMotion() {
  return typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function handleReady(context: TresContext) {
  tresContext.value = context
}

function handleHover(payload: { projectId: string | null; clusterIndex: number | null }) {
  // A held card outranks the raycast (PLAN.md 8.10).
  //
  // The card covers the star it belongs to, so the pointer resting on the card
  // is usually *not* over the mesh — `pick()` returns null and clears the
  // hover, which unmounts the card, which un-hovers the pointer. `handleLabelHold`
  // exists to stop that, but it was only setting the same ref the raycast
  // writes, so whichever fired last won and the raycast fired last.
  //
  // This was latent behind a throttle that dropped every other `pointermove`
  // (8.10): half the clearing picks never ran, so the card usually survived.
  // Fixing the throttle made it deterministic, and `npm run labels` failed on
  // "card survives the pointer moving onto it" — a defect the old throttle was
  // hiding rather than one it was preventing.
  if (labelHeldProjectId.value && payload.projectId === null) return

  hoveredProjectId.value = payload.projectId
  hoveredClusterIndex.value = payload.clusterIndex

  window.dispatchEvent(new CustomEvent('evidence-cursor-intent', {
    detail: { state: payload.projectId ? 'enter' : 'default' },
  }))
}

/**
 * Keeps a star hovered while the pointer sits on its own card.
 *
 * The card is the one interactive label, and it covers the star it belongs to.
 * Without this the pointer moving off the mesh and onto the card clears the
 * hover, which unmounts the card, which un-hovers the pointer — the card
 * flickers and can never be clicked.
 */
function handleLabelHold(projectId: string | null) {
  labelHeldProjectId.value = projectId
  if (projectId) hoveredProjectId.value = projectId
}

function handleSelect(projectId: string) {
  selectedProjectId.value = projectId
  // Focus follows from the overlay opening, not from this handler — see the
  // watch in `NavigationController`. Doing it here too would have left the
  // keyboard rail and deep links without a camera move.
  overlayStore.open(projectId)
}

/**
 * Publish the chrome boxes so labels can step around them (PLAN.md 8.12).
 *
 * Same mechanism the hero uses. The reveal frame is the composition's climax —
 * every project on screen at once — and "Tathya" was rendering underneath the
 * constellation index, which is the one moment where a buried name costs the
 * most. The scale readout is registered for the same reason at the other
 * corner.
 *
 * Measured from the live elements rather than derived from the Tailwind offsets
 * they are positioned with: the legend's height depends on the project count
 * and on whether the scale disclosure is expanded, neither of which this code
 * should be re-deriving.
 */
const legendEl = ref<HTMLElement | null>(null)
const navDockEl = ref<HTMLElement | null>(null)
let regionObserver: ResizeObserver | null = null

function publishChromeRegions() {
  for (const [key, el] of [['legend', legendEl.value], ['nav-dock', navDockEl.value]] as const) {
    if (!el || isPlain.value) {
      registerScreenRegion(key, null)
      continue
    }
    const box = el.getBoundingClientRect()
    // A `display: none` element still has a rect of zeros; the legend is
    // desktop-only, so on a phone this correctly registers nothing.
    if (box.width <= 0 || box.height <= 0) {
      registerScreenRegion(key, null)
      continue
    }
    registerScreenRegion(key, {
      left: box.left,
      top: box.top,
      right: box.right,
      bottom: box.bottom,
      opacity: 1,
    })
  }
}

watch([legendEl, navDockEl, () => evidenceOverlayStore.activeKind], () => {
  void nextTick().then(publishChromeRegions)
})

onMounted(() => {
  publishChromeRegions()
  if (typeof ResizeObserver !== 'undefined') {
    regionObserver = new ResizeObserver(publishChromeRegions)
    if (legendEl.value) regionObserver.observe(legendEl.value)
    if (navDockEl.value) regionObserver.observe(navDockEl.value)
  }
  window.addEventListener('resize', publishChromeRegions, { passive: true })

  if (isPlain.value || prefersReducedMotion()) {
    return
  }

  hueMilestoneFrame = requestAnimationFrame(() => {
    hueMilestoneFrame = 0
    hueMilestoneTrigger = ScrollTrigger.create({
      trigger: '#constellation-section',
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        const milestone = Math.min(4, Math.floor(self.progress * 4))
        particleHueOffset.value = milestone * 1.4
      },
    })
  })
})

onUnmounted(() => {
  regionObserver?.disconnect()
  regionObserver = null
  window.removeEventListener('resize', publishChromeRegions)
  registerScreenRegion('legend', null)
  registerScreenRegion('nav-dock', null)

  if (hueMilestoneFrame) {
    cancelAnimationFrame(hueMilestoneFrame)
    hueMilestoneFrame = 0
  }

  hueMilestoneTrigger?.kill()
  hueMilestoneTrigger = null
})
</script>

<template>
  <section
    v-if="!isPlain"
    id="constellation-section"
    class="relative"
    :style="{ height: runwayHeight || '400vh' }"
    :data-selected-project-id="selectedProjectId ?? undefined"
  >
    <div
      ref="viewportEl"
      class="constellation-viewport sticky top-0 h-screen overflow-hidden bg-bg"
    >
      <TresCanvas
        class="absolute inset-0 z-0 h-full w-full"
        :alpha="true"
        :antialias="false"
        clear-color="#000000"
        :dpr="dpr"
        :enable-provide-bridge="false"
        :output-color-space="SRGBColorSpace"
        power-preference="high-performance"
        render-mode="always"
        :tone-mapping="ACESFilmicToneMapping"
        @ready="handleReady"
      >
        <TresPerspectiveCamera
          :args="[45, 1, 0.1, 100]"
          :position="[0, 6, 22]"
        />
        <ScenePauseController :paused="sceneAnimationPaused" />
        <NavigationController :rig="sceneRig" />
        <CameraAuthoring v-if="isDebug" />
        <!--
          No lights. Nothing in this scene responds to one any more: the star
          bodies are matcaps (6.8), the halos, coronas, glints, particles and sky
          are all shader materials, and the moons are `MeshBasicMaterial`. The
          twelve per-node PointLights, the camera key light and the ambient were
          all still being uploaded and iterated per fragment for no output.
        -->
        <IridescentBackground />

        <!--
          The rig (PLAN.md 4.3). Free-orbit rotates the scene rather than the
          camera, so everything positioned in constellation space hangs off this
          group and inherits the rotation for free. `IridescentBackground` is
          deliberately *outside* it — it is the sky, and a sky that rotates with
          the thing you are orbiting stops reading as a backdrop.

          `ref` rather than a bound `:rotation`: the transform changes every
          frame and binding it would make TresJS diff the graph each time
          (DESIGN.md §4). The controller mutates the object directly.
        -->
        <TresGroup ref="rigRef">
          <!-- The origin every derived position is measured from (6.7). Inside
               the rig, so it stays the centre of the thing you are orbiting. -->
          <CentreStar />
          <!-- Close to the viewer, so camera motion is legible at all (6.10). -->
          <NearFieldDust />
          <!--
            The path each node travels (8.2). Replaces `ConnectorLines`, which
            drew a hand-typed relationship as a flat SVG hairline *above* the
            canvas. This is real geometry inside the rig, so it takes
            perspective and depth, and what it draws is a measurement: the
            orbit `layout.ts` derived.
          -->
          <OrbitPaths />
          <ParticleField
            :hovered-cluster-index="hoveredClusterIndex"
            :hue-offset="particleHueOffset"
          />
          <NodeMoons v-if="moonsEnabled" />
          <ConstellationNodes
            :interaction-paused="sceneInteractionPaused"
            :highlighted-project-ids="projectStore.highlightedProjectIds"
            @hover="handleHover"
            @select="handleSelect"
          />
        </TresGroup>
        <!--
          Bloom runs a full extra composer pass over the frame. On a low-tier
          handset that is the difference between a scene that scrolls and one
          that stutters, and it is the least missed of the effects (PLAN.md 2.4).
        -->
        <PostProcessing v-if="postFxEnabled" />
      </TresCanvas>

      <!--
        One projector for every label (PLAN.md 5.1–5.4). It replaces two
        single-project `NodeLabel` instances: the name budget in `labelLod.ts` is
        a decision about the whole set, and a component that only knows its own
        project can never make it.
      -->
      <NodeLabels
        v-if="!sceneInteractionPaused"
        :context="tresContext"
        :hovered-project-id="hoveredProjectId"
        :paused="overlaysPaused"
        @hold="handleLabelHold"
        @open="handleSelect"
      />

      <!--
        Bottom-left is the only clear corner: ProjectIndex rails the left edge at
        50% height, BookingCta docks bottom-right, and the legend sits above it.
      -->
      <!--
        On phones this sits *above* the booking dock rather than beside it: at
        390px the row and the CTA share the bottom band and the zoom-out button
        ended up underneath "Book a call". Booking is never the thing that moves
        (CLAUDE.md), so this does.
      -->
      <div
        v-if="!sceneInteractionPaused"
        ref="navDockEl"
        class="nav-controls-dock absolute bottom-20 left-16 z-30 md:bottom-6 md:left-6"
      >
        <NavigationControls />
      </div>

      <!-- bottom-24, not bottom-6: BookingCta.vue also docks bottom-right (fixed,
           z-90) and would otherwise sit on top of this legend's last two lines. -->
      <!--
        Scene chrome hides while an overlay owns the screen (8.14). These are
        controls for a scene that is paused, and they were reading through the
        project panel's glass — "CONSTELLATION + −" and "SHOW TRUE SCALE"
        legible underneath the copy. A control for something you cannot
        currently touch is not chrome, it is noise.
      -->
      <div
        v-if="evidenceOverlayStore.activeKind !== 'about' && !sceneInteractionPaused"
        ref="legendEl"
        class="constellation-index absolute bottom-24 right-6 z-30 hidden md:block"
      >
        <p class="constellation-index__title">CONSTELLATION INDEX</p>
        <p><span class="constellation-index__dot constellation-index__dot--personal"></span> personal project</p>
        <p><span class="constellation-index__dot constellation-index__dot--work"></span> work experience</p>
        <p><span class="constellation-index__dot constellation-index__dot--current"></span> currently building</p>
        <p><span class="constellation-index__dot constellation-index__dot--utility"></span> utility / tooling</p>
        <p class="constellation-index__note">bigger node = stronger evidence</p>

        <!--
          The scale disclosure (PLAN.md 3.6). Not a settings control tucked in a
          menu — which mode you are looking at is part of the information, so it
          sits in the legend that explains the rest of it.
        -->
        <div class="constellation-index__scale">
          <p class="constellation-index__scale-state">
            <span aria-hidden="true">◐</span>
            {{ scaleModeStore.mode === 'schematic' ? 'schematic scale' : 'true scale' }}
          </p>
          <p class="constellation-index__scale-note">
            {{ scaleModeStore.mode === 'schematic'
              ? 'spacing evened out for legibility'
              : 'spaced by real elapsed time' }}
          </p>
          <button
            type="button"
            class="constellation-index__scale-toggle"
            @click="scaleModeStore.toggle()"
          >
            show {{ scaleModeStore.mode === 'schematic' ? 'true' : 'schematic' }} scale
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.constellation-index {
  min-width: 12.5rem;
  padding: 0.75rem 0.85rem;
  border: 1px solid color-mix(in srgb, var(--ice-faint) 56%, transparent);
  border-radius: 0.375rem;
  background: color-mix(in srgb, var(--bg) 58%, transparent);
  box-shadow:
    inset 0 1px 0 color-mix(in srgb, var(--ice) 10%, transparent),
    0 1rem 2.5rem rgb(0 0 0 / 0.22);
  backdrop-filter: blur(14px) saturate(1.24);
  color: var(--ice-muted);
  font-family: 'Geist Mono', ui-monospace, SFMono-Regular, Consolas, monospace;
  font-size: 0.625rem;
  letter-spacing: 0.16em;
  line-height: 1.7;
  opacity: 0.74;
  text-transform: uppercase;
}

.constellation-index__title {
  color: var(--gold-glow);
  margin-bottom: 0.25rem;
}

.constellation-index__dot {
  aspect-ratio: 1;
  border-radius: 999px;
  box-shadow: 0 0 0.55rem currentColor;
  display: inline-block;
  margin-right: 0.45rem;
  transform: translateY(0.04rem);
  width: 0.42rem;
}

.constellation-index__dot--personal {
  background: var(--node-personal);
  color: var(--node-personal);
}

.constellation-index__dot--work {
  background: var(--node-work);
  color: var(--node-work);
}

.constellation-index__dot--current {
  background: var(--node-build);
  color: var(--node-build);
}

.constellation-index__dot--utility {
  background: var(--node-utility);
  color: var(--node-utility);
}

.constellation-index p:not(.constellation-index__scale-toggle) {
  pointer-events: none;
}

.constellation-index__scale {
  margin-top: 0.55rem;
  padding-top: 0.5rem;
  border-top: 1px solid color-mix(in srgb, var(--ice-faint) 40%, transparent);
}

.constellation-index__scale-state {
  color: var(--gold-glow);
  letter-spacing: 0.1em;
}

.constellation-index__scale-note {
  color: color-mix(in srgb, var(--ice-muted) 70%, transparent);
}

.constellation-index__scale-toggle {
  margin-top: 0.3rem;
  padding: 0.2rem 0;
  border: 0;
  background: none;
  color: var(--ice-muted);
  cursor: pointer;
  font: inherit;
  letter-spacing: 0.1em;
  pointer-events: auto;
  text-decoration: underline;
  text-transform: uppercase;
  text-underline-offset: 0.25em;
}

.constellation-index__scale-toggle:hover,
.constellation-index__scale-toggle:focus-visible {
  color: var(--gold-glow);
}

.constellation-index__scale-toggle:focus-visible {
  outline: 2px solid var(--gold-glow);
  outline-offset: 3px;
}

.constellation-index__note {
  color: color-mix(in srgb, var(--ice-muted) 70%, transparent);
  margin-top: 0.2rem;
}
</style>
