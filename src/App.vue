<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { sliderConfigs } from '@/data/projects'
import { usePlainMode } from '@/composables/usePlainMode'
import { useProjectStore } from '@/stores/projectStore'
import SceneRoot from '@/components/scene/SceneRoot.vue'
import GlassPanel from '@/components/shared/GlassPanel.vue'
import GeistChip from '@/components/shared/GeistChip.vue'
import MetricCountUp from '@/components/shared/MetricCountUp.vue'
import StatusBadge from '@/components/shared/StatusBadge.vue'
import CopiedToast from '@/components/shared/CopiedToast.vue'

const { isPlain } = usePlainMode()
const projectStore = useProjectStore()
const cursorPosition = ref({ x: -100, y: -100 })

const featuredProjects = computed(() => projectStore.projects.slice(0, 4))
const firstMetric = computed(() => projectStore.getById('querypilot')?.panels.proof.metrics?.[0])

function handlePointerMove(event: PointerEvent) {
  cursorPosition.value = { x: event.clientX, y: event.clientY }
}

onMounted(() => {
  window.addEventListener('pointermove', handlePointerMove, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('pointermove', handlePointerMove)
})
</script>

<template>
  <main
    class="min-h-screen text-[color:var(--ice)]"
    :class="{ 'plain-mode': isPlain }"
  >
    <SceneRoot />

    <section class="mx-auto flex min-h-[88vh] max-w-6xl flex-col justify-center gap-10 px-6 py-10">
      <div class="grid gap-5">
        <p class="type-mono text-[length:var(--text-xs)] uppercase tracking-[0.18em] text-[color:var(--gold)]">
          Phase 0 / Visual test surface
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
    <div
      v-if="!isPlain"
      id="custom-cursor"
      aria-hidden="true"
      :style="{ left: `${cursorPosition.x}px`, top: `${cursorPosition.y}px` }"
    >
      +
    </div>
  </main>
</template>
