<script setup lang="ts">
import { computed, defineAsyncComponent, onMounted, onUnmounted, shallowRef, ref } from 'vue'
import { TresCanvas, type TresContext } from '@tresjs/core'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ACESFilmicToneMapping, SRGBColorSpace } from 'three'
import { usePlainMode } from '@/composables/usePlainMode'
import { useSceneVisibility } from '@/composables/useSceneVisibility'
import { useScrollRunway } from '@/composables/useScrollRunway'
import { isOverlayReadyProject } from '@/data/overlayReady'
import { projects } from '@/data/projects'
import { useEvidenceOverlayStore } from '@/stores/evidenceOverlayStore'
import { useOverlayStore } from '@/stores/overlayStore'
import { useProjectStore } from '@/stores/projectStore'
import { getQuality } from '@/utils/qualityTier'
// Async + debug-gated so Tweakpane never enters the production entry (2.8).
const CameraAuthoring = defineAsyncComponent(() => import('@/components/scene/CameraAuthoring.vue'))
import CameraPathController from '@/components/scene/CameraPathController.vue'
import CameraLight from '@/components/scene/CameraLight.vue'
import ConstellationNodes from '@/components/scene/ConstellationNodes.vue'
import ConnectorLines from '@/components/scene/ConnectorLines.vue'
import IridescentBackground from '@/components/scene/IridescentBackground.vue'
import NodeLabel from '@/components/scene/NodeLabel.vue'
import ParticleField from '@/components/scene/ParticleField.vue'
import PostProcessing from '@/components/scene/PostProcessing.vue'
import RefusalRipple from '@/components/scene/RefusalRipple.vue'
import ScenePauseController from '@/components/scene/ScenePauseController.vue'

const { isPlain } = usePlainMode()
const overlayStore = useOverlayStore()
const evidenceOverlayStore = useEvidenceOverlayStore()
const projectStore = useProjectStore()
const tresContext = shallowRef<TresContext | null>(null)
const hoveredProjectId = ref<string | null>(null)
const hoveredClusterIndex = ref<number | null>(null)
const selectedProjectId = ref<string | null>(null)
const particleHueOffset = ref(0)
// DPR comes from the shared quality tier (PLAN.md 2.4) rather than a constant.
// On a low-tier handset [1, 1] is roughly half the fragments of [1, 1.25].
// Four viewport-heights of scroll track, in pixels rather than vh so mobile
// browser chrome cannot resize it mid-scroll (PLAN.md 2.7).
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
let hueMilestoneTrigger: ScrollTrigger | null = null
let hueMilestoneFrame = 0

const hoveredProject = computed(() => {
  return projects.find((project) => project.id === hoveredProjectId.value) ?? null
})
const hoveredProjectCanOpen = computed(() => {
  return hoveredProject.value ? isOverlayReadyProject(hoveredProject.value.id) : false
})
const sceneInteractionPaused = computed(() => overlayStore.isOpen || evidenceOverlayStore.isOpen)
const sceneAnimationPaused = computed(() => {
  // Not visible outranks everything: there is no reason to render a frame that
  // cannot be seen, whatever the overlay state is.
  if (!sceneVisible.value) return true
  return overlayStore.isOpen || (evidenceOverlayStore.isOpen && evidenceOverlayStore.activeKind !== 'capability')
})
// ConnectorLines reallocates an array of objects every frame (ARCHITECTURE §11),
// so it is the loop that most benefits from stopping when unseen.
const connectorsPaused = computed(() => sceneInteractionPaused.value || !sceneVisible.value)

function prefersReducedMotion() {
  return typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function handleReady(context: TresContext) {
  tresContext.value = context
}

function handleHover(payload: { projectId: string | null; clusterIndex: number | null }) {
  hoveredProjectId.value = payload.projectId
  hoveredClusterIndex.value = payload.clusterIndex

  window.dispatchEvent(new CustomEvent('evidence-cursor-intent', {
    detail: { state: payload.projectId ? 'enter' : 'default' },
  }))
}

function handleSelect(projectId: string) {
  selectedProjectId.value = projectId

  if (isOverlayReadyProject(projectId)) {
    overlayStore.open(projectId)
  }
}

onMounted(() => {
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
        clear-color="#010409"
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
        <TresAmbientLight :intensity="0.12" />
        <ScenePauseController :paused="sceneAnimationPaused" />
        <CameraPathController />
        <CameraAuthoring v-if="isDebug" />
        <CameraLight />
        <IridescentBackground />
        <ParticleField
          :hovered-cluster-index="hoveredClusterIndex"
          :hue-offset="particleHueOffset"
        />
        <RefusalRipple />
        <ConstellationNodes
          :interaction-paused="sceneInteractionPaused"
          :highlighted-project-ids="projectStore.highlightedProjectIds"
          @hover="handleHover"
          @select="handleSelect"
        />
        <!--
          Bloom runs a full extra composer pass over the frame. On a low-tier
          handset that is the difference between a scene that scrolls and one
          that stutters, and it is the least missed of the effects (PLAN.md 2.4).
        -->
        <PostProcessing v-if="postFxEnabled" />
      </TresCanvas>

      <!-- Pass hoveredProjectId so lines only show for related nodes -->
      <ConnectorLines
        :context="tresContext"
        :paused="connectorsPaused"
        :hovered-project-id="hoveredProjectId"
      />
      <NodeLabel
        :context="tresContext"
        :project="hoveredProject"
        :visible="Boolean(hoveredProject)"
        :can-open="hoveredProjectCanOpen"
      />

      <!-- bottom-24, not bottom-6: BookingCta.vue also docks bottom-right (fixed,
           z-90) and would otherwise sit on top of this legend's last two lines. -->
      <div
        v-if="evidenceOverlayStore.activeKind !== 'about'"
        class="constellation-index pointer-events-none absolute bottom-24 right-6 z-30 hidden md:block"
      >
        <p class="constellation-index__title">CONSTELLATION INDEX</p>
        <p><span class="constellation-index__dot constellation-index__dot--personal"></span> personal project</p>
        <p><span class="constellation-index__dot constellation-index__dot--work"></span> work experience</p>
        <p><span class="constellation-index__dot constellation-index__dot--current"></span> currently building</p>
        <p><span class="constellation-index__dot constellation-index__dot--utility"></span> utility / tooling</p>
        <p class="constellation-index__note">bigger node = stronger evidence</p>
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

.constellation-index__note {
  color: color-mix(in srgb, var(--ice-muted) 70%, transparent);
  margin-top: 0.2rem;
}
</style>
