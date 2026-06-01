<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { sliderConfigs } from '@/data/projects'
import { usePlainMode } from '@/composables/usePlainMode'
import { useProjectStore } from '@/stores/projectStore'
import BootSequence from '@/components/sections/BootSequence.vue'
import CustomCursor from '@/components/interaction/CustomCursor.vue'
import EvidenceOverlay from '@/components/evidence/EvidenceOverlay.vue'
import EvidenceTopBar from '@/components/sections/EvidenceTopBar.vue'
import HeroSection from '@/components/sections/HeroSection.vue'
import ProjectOverlay from '@/components/overlay/ProjectOverlay.vue'
import SceneRoot from '@/components/scene/SceneRoot.vue'
import GlassPanel from '@/components/shared/GlassPanel.vue'
import GeistChip from '@/components/shared/GeistChip.vue'
import MetricCountUp from '@/components/shared/MetricCountUp.vue'
import StatusBadge from '@/components/shared/StatusBadge.vue'
import CopiedToast from '@/components/shared/CopiedToast.vue'

const { isPlain } = usePlainMode()
const projectStore = useProjectStore()
const bootComplete = ref(isPlain.value)
const isDebug = ref(false)

const featuredProjects = computed(() => projectStore.projects.slice(0, 4))
const firstMetric = computed(() => projectStore.getById('querypilot')?.panels.proof.metrics?.[0])
const showPhaseZeroConsole = computed(() => isPlain.value || isDebug.value)
const showPhaseBridge = computed(() => !isPlain.value && isDebug.value)

function handleBootComplete() {
  bootComplete.value = true
}

onMounted(() => {
  const params = new URLSearchParams(window.location.search)
  isDebug.value = params.get('debug') === '1'
})
</script>

<template>
  <main
    class="min-h-screen text-[color:var(--ice)]"
    :class="{ 'plain-mode': isPlain }"
  >
    <SceneRoot />

    <BootSequence
      v-if="!isPlain && !bootComplete"
      :project-count="projectStore.projectCount"
      @complete="handleBootComplete"
    />

    <HeroSection
      v-if="bootComplete || isPlain"
      :is-plain="isPlain"
    />

    <EvidenceTopBar v-if="!isPlain && bootComplete" />

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
        <p class="type-mono text-[length:var(--text-xs)] uppercase tracking-[0.18em] text-[color:var(--gold)]">
          Phase 0 / Evidence console surface
        </p>
        <h1 class="type-display max-w-5xl leading-none tracking-[0.08em]">
          PARTH TIWARI
        </h1>
        <p class="type-thesis max-w-3xl leading-tight text-[color:var(--ice-muted)]">
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
              class="grid gap-2 border-t border-[color:var(--ice-faint)] py-3 first:border-t-0 first:pt-0"
            >
              <div class="flex flex-wrap items-center justify-between gap-3">
                <h2 class="type-section text-[length:var(--text-xl)] not-italic">
                  {{ project.name }}
                </h2>
                <StatusBadge :status="project.status" />
              </div>
              <p class="type-body text-[color:var(--ice-muted)]">
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
            <p class="type-label text-[color:var(--ice-faint)]">
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
    <CustomCursor v-if="!isPlain" />
  </main>
</template>
