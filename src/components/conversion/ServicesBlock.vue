<script setup lang="ts">
/**
 * The offer, rendered outcome-first (PRD.md 4, 7.2).
 *
 * Ranked, not equal: the lead offer is visually dominant and the other two
 * follow it. Each offer names the projects that already prove it, so nothing
 * here is a claim without a node behind it.
 *
 * Rendered as an observation log rather than a card grid. `DESIGN_LOCK.md`
 * bans card-grid treatment for any evidence surface — the log is the signature
 * element precisely because it is not the shape every other portfolio uses, and
 * a Services block built from bordered tiles undoes that divergence. Emphasis
 * for the lead offer therefore comes from type scale and a gold ordinal, not
 * from a tinted card with a gradient wash.
 */
import { computed } from 'vue'
import ObservationLog, { type ObservationRow } from '@/components/common/ObservationLog.vue'
import { projects } from '@/data/projects'
import { engagementStages, services } from '@/data/services'

const projectNameById = computed(
  () => new Map(projects.map((project) => [project.id, project.name])),
)

/** Unknown ids are dropped rather than rendered — a renamed project must not leave a dead name. */
function evidenceNames(ids: string[]) {
  return ids.flatMap((id) => {
    const name = projectNameById.value.get(id)
    return name ? [name] : []
  })
}

/** Evidence is resolved once per service so the template stays declarative. */
const evidenceById = computed(
  () => new Map(services.map((service) => [service.id, evidenceNames(service.evidenceProjectIds)])),
)

const serviceRows = computed<ObservationRow[]>(() =>
  services.map((service) => ({
    id: service.id,
    label: service.label,
    detail: service.outcome,
    status: service.rank === 'lead' ? 'Mostly this' : undefined,
    tone: 'complete' as const,
    lead: service.rank === 'lead',
  })),
)

const engagementRows = computed<ObservationRow[]>(() =>
  engagementStages.map((stage) => ({
    id: stage.id,
    label: stage.label,
    detail: stage.detail,
  })),
)

const engagementMarkers = computed(() => engagementStages.map((stage) => stage.marker))

const serviceById = computed(() => new Map(services.map((service) => [service.id, service])))
</script>

<template>
  <section class="services-block" aria-labelledby="services-block-title">
    <header class="services-block__head">
      <p class="services-block__eyebrow">What I build</p>
      <h2 id="services-block-title">I build AI products people actually use.</h2>
    </header>

    <ObservationLog :rows="serviceRows" label="Services">
      <template #row="{ row }">
        <span class="services-block__label">{{ row.label }}</span>
        <span class="services-block__outcome">{{ row.detail }}</span>
        <span v-if="serviceById.get(row.id)?.detail" class="services-block__detail">
          {{ serviceById.get(row.id)?.detail }}
        </span>
        <span class="services-block__evidence">
          <span class="services-block__evidence-key">Evidence</span>
          {{ evidenceById.get(row.id)?.join(' / ')
          }}<template v-if="serviceById.get(row.id)?.evidenceNote">
            / {{ serviceById.get(row.id)?.evidenceNote }}</template>
        </span>
      </template>
    </ObservationLog>

    <div class="services-block__engagement">
      <p class="services-block__eyebrow">How it works</p>
      <ObservationLog
        :rows="engagementRows"
        :indices="engagementMarkers"
        label="How an engagement works"
        dense
      />
    </div>
  </section>
</template>

<style scoped>
.services-block {
  display: grid;
  gap: clamp(1.5rem, 4vw, 2.5rem);
  width: 100%;
}

.services-block__head {
  display: grid;
  gap: 0.5rem;
}

.services-block__eyebrow {
  margin: 0;
  color: var(--gold);
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.services-block h2 {
  margin: 0;
  color: var(--ice);
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: 300;
  letter-spacing: -0.01em;
  line-height: 1.05;
}

/* The lead row's emphasis is type scale alone — see the component comment. */
.services-block__label {
  color: var(--ice);
  font-family: var(--font-display);
  font-size: var(--text-base);
  font-weight: 400;
  line-height: 1.25;
}

.is-lead .services-block__label {
  font-size: var(--text-xl);
  font-weight: 300;
  letter-spacing: -0.01em;
  line-height: 1.1;
}

.services-block__outcome,
.services-block__detail,
.services-block__evidence {
  font-family: var(--font-body);
  line-height: 1.6;
}

.services-block__outcome {
  color: var(--ice);
  font-size: var(--text-base);
}

.services-block__detail {
  color: var(--ice-muted);
  font-size: var(--text-sm);
}

.services-block__evidence {
  color: var(--ice-muted);
  font-size: var(--text-xs);
}

.services-block__evidence-key {
  margin-right: 0.4rem;
  color: var(--gold);
  font-family: var(--font-mono);
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.services-block__engagement {
  display: grid;
  gap: 0.75rem;
}
</style>
