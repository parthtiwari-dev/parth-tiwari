<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import ObservationLog, { type ObservationRow } from '@/components/common/ObservationLog.vue'
import type { Project, ProjectMetric } from '@/types/project'

const props = defineProps<{
  project: Project
}>()

const proof = computed(() => props.project.panels.proof)
const metrics = computed(() => proof.value.metrics ?? [])
const milestones = computed(() => proof.value.milestones ?? [])
const completedMilestones = computed(() => {
  return milestones.value.filter((milestone) => milestone.status === 'complete').length
})
const proofSignalCount = computed(() => metrics.value.length || milestones.value.length)
const animationProgress = ref(0)
const progressStyle = computed(() => {
  const explicitProgress = proof.value.progressPercent

  if (typeof explicitProgress === 'number') {
    return { width: `${explicitProgress}%` }
  }

  if (!milestones.value.length) {
    return { width: `${Math.min(100, proofSignalCount.value * 25)}%` }
  }

  return { width: `${(completedMilestones.value / milestones.value.length) * 100}%` }
})

let frameId = 0
let startTime = 0
const duration = 820

const easedProgress = computed(() => {
  return 1 - Math.pow(1 - animationProgress.value, 3)
})

const proofSignalDisplay = computed(() => {
  if (animationProgress.value >= 0.995) {
    return proofSignalCount.value
  }

  return Math.round(proofSignalCount.value * easedProgress.value)
})

function decimalsFor(value: number) {
  if (Number.isInteger(value)) {
    return 0
  }

  if (Math.abs(value) < 1) {
    return 3
  }

  if (Math.abs(value) < 10) {
    return 1
  }

  return 2
}

function formatInterimMetric(metric: ProjectMetric) {
  if (animationProgress.value >= 0.995) {
    return metric.display
  }

  const nextValue = metric.value * easedProgress.value
  const decimals = decimalsFor(metric.value)
  const formatted = decimals === 0 ? String(Math.round(nextValue)) : nextValue.toFixed(decimals)

  if (metric.unit === '$') {
    return `$${formatted}`
  }

  if (metric.unit === '%') {
    return `${formatted}%`
  }

  if (metric.unit === 'ms') {
    return `~${Math.round(nextValue)}ms`
  }

  if (metric.unit === 'min') {
    return `${Math.round(nextValue)} min`
  }

  return formatted
}

/**
 * Metrics are the one genuinely tabular surface in the panel, so they render
 * through the observation log with a real right-aligned value column
 * (`DESIGN_LOCK.md` signature element). The interim value is recomputed while
 * the count-up runs, which is why this is a computed rather than a static list.
 */
const metricRows = computed<ObservationRow[]>(() =>
  metrics.value.map((metric) => ({
    id: metric.label,
    label: metric.label,
    value: formatInterimMetric(metric),
  })),
)

const milestoneRows = computed<ObservationRow[]>(() =>
  milestones.value.map((milestone) => ({
    id: milestone.label,
    label: milestone.label,
    detail: milestone.detail,
    status: milestone.status,
    tone: milestone.status,
  })),
)

function tick(now: number) {
  if (!startTime) {
    startTime = now
  }

  animationProgress.value = Math.min(1, (now - startTime) / duration)

  if (animationProgress.value < 1) {
    frameId = requestAnimationFrame(tick)
  }
}

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    animationProgress.value = 1
    return
  }

  frameId = requestAnimationFrame(tick)
})

onUnmounted(() => {
  if (frameId) {
    cancelAnimationFrame(frameId)
  }
})
</script>

<template>
  <article class="panel-proof">
    <div class="proof-orbit">
      <p>proof signals</p>
      <strong>{{ proofSignalDisplay }}</strong>
      <span>{{ project.status }}</span>
    </div>

    <div class="panel-proof__body">
      <p class="panel-label">Proof</p>

      <ObservationLog
        v-if="metricRows.length"
        :rows="metricRows"
        label="Measured"
        value-label="Value"
      />

      <div v-if="milestoneRows.length" class="milestone-list">
        <div class="milestone-progress" aria-hidden="true">
          <span :style="progressStyle"></span>
        </div>
        <ObservationLog :rows="milestoneRows" label="Milestones" />
      </div>

      <div v-if="project.artifacts?.length" class="artifact-proof">
        <section v-for="artifact in project.artifacts" :key="artifact.id">
          <h3>{{ artifact.name }}</h3>
          <ul>
            <li v-for="item in artifact.proof" :key="item">{{ item }}</li>
          </ul>
        </section>
      </div>

      <p v-if="proof.caveat" class="proof-caveat">
        {{ proof.caveat }}
      </p>
    </div>
  </article>
</template>

<style scoped>
.panel-proof {
  display: grid;
  align-items: center;
  gap: clamp(1.5rem, 4vw, 4rem);
  grid-template-columns: minmax(14rem, 0.34fr) minmax(0, 1fr);
}

.proof-orbit {
  display: grid;
  place-items: center;
  aspect-ratio: 1;
  border: 1px solid color-mix(in srgb, var(--gold) 38%, transparent);
  border-radius: 999px;
  background:
    radial-gradient(circle, color-mix(in srgb, var(--gold) 18%, transparent), transparent 58%),
    conic-gradient(from 32deg, color-mix(in srgb, var(--gold) 64%, transparent), transparent 42%, color-mix(in srgb, var(--teal-active) 52%, transparent), transparent 74%);
  box-shadow:
    inset 0 0 4rem rgb(0 0 0 / 0.38),
    0 0 6rem color-mix(in srgb, var(--gold) 12%, transparent);
  color: var(--ice);
  text-align: center;
}

.proof-orbit p,
.proof-orbit span {
  margin: 0;
  color: var(--ice-muted);
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.proof-orbit strong {
  color: var(--gold-glow);
  font-family: var(--font-display);
  font-size: clamp(4rem, 8vw, 7rem);
  font-weight: 300;
  line-height: 0.8;
}

.panel-proof__body,
.milestone-list,
.artifact-proof {
  display: grid;
  gap: 1rem;
}

.panel-label {
  margin: 0;
  color: var(--gold);
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.artifact-proof section {
  border-top: 1px solid color-mix(in srgb, var(--ice-faint) 58%, transparent);
  padding-top: 0.85rem;
}

.proof-caveat {
  margin: 0;
  color: var(--ice-muted);
  line-height: 1.5;
}

.milestone-progress {
  height: 2px;
  overflow: hidden;
  background: color-mix(in srgb, var(--ice-faint) 46%, transparent);
}

/* Solid rather than a gradient: `DESIGN_LOCK.md` bans gradient fills in the 2D
   chrome, and the bar carries meaning, so a single accent reads it correctly. */
.milestone-progress span {
  display: block;
  height: 100%;
  background: var(--gold);
}

.artifact-proof h3 {
  margin: 0;
  color: var(--ice);
  font-family: var(--font-display);
  font-size: 1.55rem;
  font-weight: 400;
  line-height: 1.05;
}

.artifact-proof {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.artifact-proof ul {
  margin: 0.6rem 0 0;
  padding-left: 1rem;
  color: var(--ice-muted);
  line-height: 1.55;
}

@media (max-width: 900px) {
  .panel-proof,
  .artifact-proof {
    grid-template-columns: 1fr;
  }

  .proof-orbit {
    max-width: 18rem;
  }
}

/* Row entrance and reduced-motion handling now live in `ObservationLog`, which
   owns every evidence surface in the chrome. */
</style>
