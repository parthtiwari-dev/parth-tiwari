<script setup lang="ts">
import { computed } from 'vue'
import type { Project } from '@/types/project'

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
</script>

<template>
  <article class="panel-proof">
    <div class="proof-orbit">
      <p>proof signals</p>
      <strong>{{ proofSignalCount }}</strong>
      <span>{{ project.status }}</span>
    </div>

    <div class="panel-proof__body">
      <p class="panel-label">Proof</p>

      <div v-if="metrics.length" class="metric-grid">
        <section v-for="metric in metrics" :key="metric.label">
          <p>{{ metric.label }}</p>
          <strong>{{ metric.display }}</strong>
        </section>
      </div>

      <div v-if="milestones.length" class="milestone-list">
        <div class="milestone-progress" aria-hidden="true">
          <span :style="progressStyle"></span>
        </div>
        <section v-for="milestone in milestones" :key="milestone.label">
          <span :class="`milestone-status milestone-status--${milestone.status}`">
            {{ milestone.status }}
          </span>
          <div>
            <h3>{{ milestone.label }}</h3>
            <p v-if="milestone.detail">{{ milestone.detail }}</p>
          </div>
        </section>
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
  font-family: 'Geist Mono', ui-monospace, SFMono-Regular, Consolas, monospace;
  font-size: var(--text-xs);
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.proof-orbit strong {
  color: var(--gold-glow);
  font-family: Spectral, Georgia, serif;
  font-size: clamp(4rem, 8vw, 7rem);
  font-weight: 300;
  line-height: 0.8;
}

.panel-proof__body,
.metric-grid,
.milestone-list,
.artifact-proof {
  display: grid;
  gap: 1rem;
}

.panel-label {
  margin: 0;
  color: var(--gold);
  font-family: 'Geist Mono', ui-monospace, SFMono-Regular, Consolas, monospace;
  font-size: var(--text-xs);
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.metric-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.metric-grid section,
.milestone-list section,
.artifact-proof section {
  border-top: 1px solid color-mix(in srgb, var(--ice-faint) 58%, transparent);
  padding-top: 0.85rem;
}

.metric-grid p,
.proof-caveat {
  margin: 0;
  color: var(--ice-muted);
  line-height: 1.5;
}

.metric-grid strong {
  display: block;
  margin-top: 0.35rem;
  color: var(--gold-glow);
  font-family: Spectral, Georgia, serif;
  font-size: clamp(2rem, 3.5vw, 3.8rem);
  font-weight: 300;
  line-height: 1;
}

.milestone-progress {
  height: 2px;
  overflow: hidden;
  background: color-mix(in srgb, var(--ice-faint) 46%, transparent);
}

.milestone-progress span {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, var(--gold), var(--teal-active));
}

.milestone-list section {
  display: grid;
  gap: 1rem;
  grid-template-columns: 9rem 1fr;
}

.milestone-status {
  color: var(--ice-muted);
  font-family: 'Geist Mono', ui-monospace, SFMono-Regular, Consolas, monospace;
  font-size: var(--text-xs);
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.milestone-status--complete {
  color: var(--gold);
}

.milestone-status--active {
  color: var(--teal-active);
}

.milestone-status--roadmap {
  color: var(--ice-faint);
}

.milestone-list h3,
.artifact-proof h3 {
  margin: 0;
  color: var(--ice);
  font-family: Spectral, Georgia, serif;
  font-size: 1.55rem;
  font-weight: 400;
  line-height: 1.05;
}

.milestone-list p {
  margin: 0.35rem 0 0;
  color: var(--ice-muted);
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
  .metric-grid,
  .artifact-proof {
    grid-template-columns: 1fr;
  }

  .proof-orbit {
    max-width: 18rem;
  }

  .milestone-list section {
    grid-template-columns: 1fr;
  }
}
</style>
