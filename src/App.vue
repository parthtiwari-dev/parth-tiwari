<script setup lang="ts">
import { computed, defineAsyncComponent, onMounted, onUnmounted, ref } from 'vue'
import { sliderConfigs } from '@/data/projects'
import { usePlainMode } from '@/composables/usePlainMode'
import { useEvidenceOverlayStore } from '@/stores/evidenceOverlayStore'
import { useProjectStore } from '@/stores/projectStore'
import BootSequence from '@/components/sections/BootSequence.vue'
import BookingCta from '@/components/conversion/BookingCta.vue'
import CustomCursor from '@/components/interaction/CustomCursor.vue'
import EvidenceOverlay from '@/components/evidence/EvidenceOverlay.vue'
import EvidenceTopBar from '@/components/sections/EvidenceTopBar.vue'
import HeroSection from '@/components/sections/HeroSection.vue'
import MobileFooterDock from '@/components/sections/MobileFooterDock.vue'
import { useSmoothScroll } from '@/composables/useSmoothScroll'
import ProjectIndex from '@/components/sections/ProjectIndex.vue'
import ProjectOverlay from '@/components/overlay/ProjectOverlay.vue'
import PlainExperience from '@/components/sections/PlainExperience.vue'
import MobileSystemsIndex from '@/components/sections/MobileSystemsIndex.vue'
import GlassPanel from '@/components/shared/GlassPanel.vue'
import GeistChip from '@/components/shared/GeistChip.vue'
import MetricCountUp from '@/components/shared/MetricCountUp.vue'
import StatusBadge from '@/components/shared/StatusBadge.vue'
import CopiedToast from '@/components/shared/CopiedToast.vue'

/**
 * The 3D stack is code-split, not just render-gated (`docs/AUDIT.md` C1).
 *
 * `v-if` gates rendering, never the import graph — a static import here put
 * three.js + @tresjs/core (767 kB raw / 208 kB gzip) and the postprocessing
 * chain into the entry graph for every visitor, including `?plain=1`, every
 * phone, and every reduced-motion user. `defineAsyncComponent` moves both scene
 * roots behind a dynamic import so the chunk is fetched only when the matching
 * `v-if` below actually resolves true.
 */
const SceneRoot = defineAsyncComponent(() => import('@/components/scene/SceneRoot.vue'))

// Interpolated scroll, stepped from GSAP's ticker (PLAN.md 2.3). App-level
// because it owns the window scroller, and a no-op under reduced motion.
useSmoothScroll()

const MOBILE_QUERY = '(max-width: 767px)'
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

function getMediaQueryMatches(query: string) {
  return typeof window !== 'undefined' && window.matchMedia(query).matches
}

const { isPlain } = usePlainMode()
const evidenceOverlayStore = useEvidenceOverlayStore()
const projectStore = useProjectStore()
const bootComplete = ref(isPlain.value)
const isDebug = ref(false)
const isMobileViewport = ref(getMediaQueryMatches(MOBILE_QUERY))
const prefersReducedMotion = ref(getMediaQueryMatches(REDUCED_MOTION_QUERY))

const featuredProjects = computed(() => projectStore.projects.slice(0, 4))
const firstMetric = computed(() => projectStore.getById('querypilot')?.panels.proof.metrics?.[0])
const showPhaseZeroConsole = computed(() => !isPlain.value && isDebug.value)
const showPhaseBridge = computed(() => !isPlain.value && isDebug.value)
const isAboutOverlayOpen = computed(() => (
  evidenceOverlayStore.isOpen
  && evidenceOverlayStore.activeKind === 'about'
))
const experienceReady = computed(() => isPlain.value || bootComplete.value)

/**
 * One scene at every breakpoint (PLAN.md 2.5).
 *
 * There used to be two: `SceneRoot` above 820px and a separate 2D-canvas
 * `MobileStarWorld` below it. That existed because the WebGL scene was too
 * expensive for a phone — but it also meant mounting and unmounting a WebGL
 * context on every resize across the boundary, two starfields that had to be
 * kept looking alike by hand, and a dead zone between 768 and 820 where the
 * desktop scene ran behind mobile navigation.
 *
 * The quality tier (2.4) solved the original problem properly: on a handset the
 * one scene runs at 2,000 particles, DPR 1, a single sky octave and no bloom.
 * A cheaper version of the real thing beats a second thing that only resembles
 * it.
 *
 * Reduced motion still means no render loop at all rather than a slower one
 * (PRD M6) — the honest fallback is not to mount it, which, now that it is
 * async, also means never fetching the chunk.
 */
const showScene = computed(() => !isPlain.value && !prefersReducedMotion.value)
const showMobileSystemsIndex = computed(() => (
  !isPlain.value
  && isMobileViewport.value
  && experienceReady.value
  && !isAboutOverlayOpen.value
))

function handleBootComplete() {
  bootComplete.value = true
}

let mobileMediaQuery: MediaQueryList | null = null
let reducedMotionMediaQuery: MediaQueryList | null = null

function syncMediaState() {
  isMobileViewport.value = getMediaQueryMatches(MOBILE_QUERY)
  prefersReducedMotion.value = getMediaQueryMatches(REDUCED_MOTION_QUERY)
}

onMounted(() => {
  const params = new URLSearchParams(window.location.search)
  isDebug.value = params.get('debug') === '1'

  mobileMediaQuery = window.matchMedia(MOBILE_QUERY)
  reducedMotionMediaQuery = window.matchMedia(REDUCED_MOTION_QUERY)
  syncMediaState()
  mobileMediaQuery.addEventListener('change', syncMediaState)
  reducedMotionMediaQuery.addEventListener('change', syncMediaState)
})

onUnmounted(() => {
  mobileMediaQuery?.removeEventListener('change', syncMediaState)
  reducedMotionMediaQuery?.removeEventListener('change', syncMediaState)
})
</script>

<template>
  <main
    class="min-h-screen text-ice"
    :class="{ 'plain-mode': isPlain }"
  >
    <SceneRoot v-if="showScene" />

    <BootSequence
      v-if="!isPlain && !bootComplete"
      :project-count="projectStore.projectCount"
      @complete="handleBootComplete"
    />

    <HeroSection
      v-if="experienceReady"
      :is-plain="isPlain"
    />

    <EvidenceTopBar v-if="!isPlain && experienceReady" />

    <PlainExperience v-if="isPlain && experienceReady" />

    <MobileSystemsIndex v-if="showMobileSystemsIndex" />
    <MobileFooterDock v-if="showMobileSystemsIndex" />

    <!-- Keyboard and screen-reader route to all nine projects, every breakpoint. -->
    <ProjectIndex v-if="!isPlain && experienceReady" />

    <!-- Booking stays one tap from every screen, in every mode but plain. -->
    <BookingCta v-if="!isPlain && experienceReady" />

    <ProjectOverlay v-if="!isPlain" />
    <EvidenceOverlay v-if="!isPlain" />

    <div
      v-if="showPhaseBridge"
      aria-hidden="true"
      class="phase-bridge h-[118vh]"
    />

    <section
      v-if="showPhaseZeroConsole"
      class="phase-zero-console mx-auto flex min-h-[92vh] max-w-6xl flex-col justify-center gap-10 px-6 py-10"
    >
      <div class="grid gap-5">
        <p class="type-mono text-[length:var(--text-xs)] uppercase tracking-[0.18em] text-gold">
          Phase 0 / Evidence console surface
        </p>
        <h1 class="type-display max-w-5xl leading-none tracking-[0.08em]">
          PARTH TIWARI
        </h1>
        <p class="type-thesis max-w-3xl leading-tight text-ice-muted">
          Systems that act only after the evidence, schema, budget, and workflow state agree.
        </p>
      </div>

      <GlassPanel class="grid gap-8 p-6 md:grid-cols-[1.2fr_0.8fr]">
        <div class="grid gap-5">
          <div class="flex flex-wrap gap-2">
            <GeistChip label="CRYO-GOLD tokens" variant="gold" />
            <GeistChip label="typed project data" />
            <GeistChip label="plain mode ready" variant="muted" />
            <GeistChip :label="`${projectStore.projectCount} systems`" variant="status" />
          </div>

          <div class="grid gap-3">
            <div
              v-for="project in featuredProjects"
              :key="project.id"
              class="grid gap-2 border-t border-ice-faint py-3 first:border-t-0 first:pt-0"
            >
              <div class="flex flex-wrap items-center justify-between gap-3">
                <h2 class="type-section text-[length:var(--text-xl)] not-italic">
                  {{ project.name }}
                </h2>
                <StatusBadge :status="project.status" />
              </div>
              <p class="type-body text-ice-muted">
                {{ project.tagline }}
              </p>
            </div>
          </div>
        </div>

        <div class="grid content-start gap-6">
          <MetricCountUp
            v-if="firstMetric"
            :label="firstMetric.label"
            :display="firstMetric.display"
            :unit="firstMetric.unit"
          />

          <div class="grid gap-3">
            <p class="type-label text-ice-faint">
              Cost of Intelligence sliders
            </p>
            <div class="flex flex-wrap gap-2">
              <GeistChip
                v-for="slider in sliderConfigs"
                :key="slider.key"
                :label="slider.metricLabel"
                variant="gold"
              />
            </div>
          </div>
        </div>
      </GlassPanel>
    </section>

    <CopiedToast :show="false" />
    <CustomCursor v-if="!isPlain && !isMobileViewport" />
  </main>
</template>
