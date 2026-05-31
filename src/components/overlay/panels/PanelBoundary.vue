<script setup lang="ts">
import { computed } from 'vue'
import type { Project } from '@/types/project'

const props = defineProps<{
  project: Project
}>()

const willItems = computed(() => {
  return props.project.panels.boundary.items.filter((item) => item.side === 'will')
})
const refuseItems = computed(() => {
  return props.project.panels.boundary.items.filter((item) => item.side === 'refuses')
})
</script>

<template>
  <article class="panel-boundary">
    <div>
      <p class="panel-label">Boundary</p>
      <h3>What this evidence can and cannot claim.</h3>
      <p>
        The portfolio treats boundaries as proof. These are the explicit claims the node is allowed to make, and the ones it refuses.
      </p>
    </div>

    <div class="boundary-columns">
      <section>
        <p>will</p>
        <ul>
          <li v-for="item in willItems" :key="item.text">{{ item.text }}</li>
        </ul>
      </section>

      <section>
        <p>refuses</p>
        <ul>
          <li v-for="item in refuseItems" :key="item.text">{{ item.text }}</li>
        </ul>
      </section>
    </div>

    <div v-if="project.artifacts?.length" class="artifact-boundary">
      <section v-for="artifact in project.artifacts" :key="artifact.id">
        <h4>{{ artifact.name }}</h4>
        <ul>
          <li v-for="item in artifact.boundary" :key="item">{{ item }}</li>
        </ul>
      </section>
    </div>
  </article>
</template>

<style scoped>
.panel-boundary {
  display: grid;
  gap: clamp(1.5rem, 4vw, 3rem);
}

.panel-label {
  margin: 0 0 0.9rem;
  color: var(--gold);
  font-family: 'Geist Mono', ui-monospace, SFMono-Regular, Consolas, monospace;
  font-size: var(--text-xs);
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

h3,
h4 {
  margin: 0;
  color: var(--ice);
  font-family: Spectral, Georgia, serif;
  font-weight: 300;
}

h3 {
  max-width: 54rem;
  font-size: clamp(2.4rem, 5vw, 5.2rem);
  letter-spacing: 0.02em;
  line-height: 0.98;
}

h4 {
  font-size: 1.6rem;
}

.panel-boundary > div > p:not(.panel-label) {
  max-width: 42rem;
  margin: 1rem 0 0;
  color: var(--ice-muted);
  line-height: 1.55;
}

.boundary-columns,
.artifact-boundary {
  display: grid;
  gap: 1.25rem;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.boundary-columns section,
.artifact-boundary section {
  border-top: 1px solid color-mix(in srgb, var(--ice-faint) 58%, transparent);
  padding-top: 1rem;
}

.boundary-columns p {
  margin: 0 0 0.7rem;
  color: var(--gold);
  font-family: 'Geist Mono', ui-monospace, SFMono-Regular, Consolas, monospace;
  font-size: var(--text-xs);
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

ul {
  display: grid;
  gap: 0.75rem;
  margin: 0;
  padding-left: 1rem;
  color: var(--ice-muted);
  line-height: 1.55;
}

.artifact-boundary {
  color: var(--ice-muted);
}

.artifact-boundary h4 {
  margin-bottom: 0.65rem;
}

@media (max-width: 820px) {
  .boundary-columns,
  .artifact-boundary {
    grid-template-columns: 1fr;
  }
}
</style>
