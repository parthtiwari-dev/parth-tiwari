<script setup lang="ts">
/**
 * Cost of Intelligence — the tradeoff dial inside the Proof panel (PLAN.md 3.8).
 *
 * Every system here sits at a chosen point between two things it cannot both
 * maximise: permissive vs bounded, fast vs accurate, cheap vs rich, autonomous
 * vs supervised. The dial shows where that point was set and what was measured
 * there.
 *
 * **It refuses to interpolate.** Drag away from the measured setting and the
 * metric does not scale to a plausible-looking number — it withdraws, and says
 * it was not measured there. Inventing a value would be the exact failure this
 * site argues against, and a slider that quietly fabricates as you drag is the
 * most persuasive way to do it. The refusal is the feature: the same behaviour
 * as MedRAG declining a question its documents cannot support.
 */
import { computed } from 'vue'
import { sliderConfigs } from '@/data/projects'
import { useSliderStore } from '@/stores/sliderStore'
import type { Project } from '@/types/project'

const props = defineProps<{ project: Project }>()

const sliderStore = useSliderStore()

const config = computed(() =>
  sliderConfigs.find((entry) => entry.affectedProjectId === props.project.id) ?? null,
)

/** Where the real measurement was taken. 0.5 is the store's resting default. */
const MEASURED_AT = 0.5
/** How far the dial can move before the metric is no longer honestly claimable. */
const TOLERANCE = 0.08

const value = computed({
  get: () => (config.value ? sliderStore.values[config.value.key] : MEASURED_AT),
  set: (next: number) => {
    if (config.value) sliderStore.setValue(config.value.key, next)
  },
})

const atMeasuredPoint = computed(() => Math.abs(value.value - MEASURED_AT) <= TOLERANCE)

const towards = computed(() => {
  if (!config.value || atMeasuredPoint.value) return ''
  return value.value < MEASURED_AT ? config.value.labelLeft : config.value.labelRight
})

function reset() {
  if (config.value) sliderStore.setValue(config.value.key, MEASURED_AT)
}
</script>

<template>
  <section v-if="config" class="coi">
    <header>
      <p class="coi__eyebrow">Cost of intelligence</p>
      <p class="coi__question">
        {{ config.labelLeft }} or {{ config.labelRight }}? This one was set here.
      </p>
    </header>

    <label class="coi__control">
      <span class="coi__end">{{ config.labelLeft }}</span>
      <input
        v-model.number="value"
        class="coi__range"
        type="range"
        min="0"
        max="1"
        step="0.01"
        :aria-label="`${config.labelLeft} to ${config.labelRight} for ${project.name}`"
        :aria-valuetext="atMeasuredPoint
          ? `Measured setting. ${config.metricLabel} ${config.metricValue}, ${config.metricContext}.`
          : `Moved towards ${towards}. Not measured at this setting.`"
      >
      <span class="coi__end coi__end--right">{{ config.labelRight }}</span>
    </label>

    <div class="coi__readout" :class="{ 'is-unmeasured': !atMeasuredPoint }">
      <template v-if="atMeasuredPoint">
        <p class="coi__metric">{{ config.metricValue }}</p>
        <p class="coi__metric-label">
          {{ config.metricLabel }} — {{ config.metricContext }}
        </p>
      </template>
      <template v-else>
        <p class="coi__metric coi__metric--withheld">not measured here</p>
        <p class="coi__metric-label">
          Moving towards <strong>{{ towards }}</strong> changes this number, but it was
          never measured at that setting, so there is nothing honest to show.
          <button type="button" class="coi__reset" @click="reset">
            Back to the measured point
          </button>
        </p>
      </template>
    </div>
  </section>
</template>

<style scoped>
.coi {
  display: grid;
  gap: 0.75rem;
  padding: 0.9rem 1rem 1rem;
  border: 1px solid color-mix(in srgb, var(--ice-faint) 52%, transparent);
  border-radius: 0.4rem;
  background: color-mix(in srgb, var(--bg-lift) 62%, transparent);
}

.coi__eyebrow {
  color: var(--gold-glow);
  font-family: var(--font-mono);
  font-size: 0.62rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.coi__question {
  margin-top: 0.25rem;
  color: var(--ice-muted);
  font-size: 0.86rem;
}

.coi__control {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 0.7rem;
}

.coi__end {
  color: var(--ice-quiet);
  font-family: var(--font-mono);
  font-size: 0.6rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.coi__end--right {
  text-align: right;
}

.coi__range {
  width: 100%;
  accent-color: var(--gold);
  cursor: grab;
}

.coi__range:focus-visible {
  outline: 2px solid var(--gold-glow);
  outline-offset: 4px;
}

.coi__readout {
  min-height: 4.25rem;
}

.coi__metric {
  color: var(--gold-glow);
  font-family: var(--font-mono);
  font-size: 1.5rem;
  line-height: 1.1;
}

.coi__metric--withheld {
  color: var(--ice-quiet);
  font-size: 1rem;
  font-style: italic;
}

.coi__metric-label {
  margin-top: 0.3rem;
  color: var(--ice-muted);
  font-size: 0.78rem;
  line-height: 1.5;
}

.coi__reset {
  display: inline;
  margin-left: 0.35rem;
  border: 0;
  background: none;
  color: var(--gold-glow);
  cursor: pointer;
  font: inherit;
  text-decoration: underline;
  text-underline-offset: 0.2em;
}

.is-unmeasured .coi__metric-label strong {
  color: var(--ice);
}

@media (prefers-reduced-motion: reduce) {
  .coi__range {
    cursor: pointer;
  }
}
</style>
