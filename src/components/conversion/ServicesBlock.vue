<script setup lang="ts">
/**
 * The offer, rendered outcome-first (PRD.md 4, 7.2).
 *
 * Ranked, not equal: the lead offer is visually dominant and the other two follow
 * it. Each offer names the projects that already prove it, so nothing here is a
 * claim without a node behind it.
 */
import { computed } from 'vue'
import { projects } from '@/data/projects'
import { services } from '@/data/services'

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
</script>

<template>
  <section class="services-block" aria-labelledby="services-block-title">
    <header class="services-block__head">
      <p class="services-block__eyebrow">What I build</p>
      <h2 id="services-block-title">I build AI products people actually use.</h2>
    </header>

    <ol class="services-block__list">
      <li
        v-for="service in services"
        :key="service.id"
        class="services-block__item"
        :class="{ 'is-lead': service.rank === 'lead' }"
      >
        <p v-if="service.rank === 'lead'" class="services-block__flag">Mostly this</p>
        <h3>{{ service.label }}</h3>
        <p class="services-block__outcome">{{ service.outcome }}</p>
        <p class="services-block__detail">{{ service.detail }}</p>
        <p class="services-block__evidence">
          <span>Evidence</span>
          {{ evidenceNames(service.evidenceProjectIds).join(' / ') }}<template v-if="service.evidenceNote"> / {{ service.evidenceNote }}</template>
        </p>
      </li>
    </ol>
  </section>
</template>

<style scoped>
.services-block {
  display: grid;
  gap: 1.5rem;
  width: 100%;
}

.services-block__head {
  display: grid;
  gap: 0.5rem;
}

.services-block__eyebrow,
.services-block__flag {
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
  line-height: 1.05;
}

.services-block h3 {
  margin: 0;
  color: var(--ice);
  font-family: var(--font-display);
  font-size: var(--text-base);
  font-weight: 400;
  line-height: 1.2;
}

.services-block__list {
  display: grid;
  gap: 1rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.services-block__item {
  display: grid;
  gap: 0.5rem;
  padding: 1.1rem 1.15rem;
  border: 1px solid color-mix(in srgb, var(--ice-faint) 44%, transparent);
  border-radius: 0.4rem;
  background: color-mix(in srgb, var(--bg) 42%, transparent);
}

.services-block__item.is-lead {
  border-color: color-mix(in srgb, var(--gold) 58%, transparent);
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--gold) 12%, transparent), transparent 58%),
    color-mix(in srgb, var(--bg) 42%, transparent);
}

.services-block__item.is-lead h3 {
  font-size: var(--text-xl);
}

.services-block__outcome,
.services-block__detail,
.services-block__evidence {
  margin: 0;
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

.services-block__evidence span {
  margin-right: 0.4rem;
  color: var(--gold);
  font-family: var(--font-mono);
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

@media (min-width: 768px) {
  .services-block__list {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .services-block__item.is-lead {
    grid-column: 1 / -1;
  }
}
</style>
