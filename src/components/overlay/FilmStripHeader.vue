<script setup lang="ts">
import { computed } from 'vue'
import type { Project } from '@/types/project'

const props = defineProps<{
  project: Project
  panelIndex: number
  totalPanels: number
}>()

const emit = defineEmits<{
  close: []
  previous: []
  next: []
}>()

const kindLabel: Record<Project['nodeKind'], string> = {
  'personal-project': 'Personal project',
  'work-experience': 'Work experience',
  'current-build': 'Current build',
  utility: 'Utility / tooling',
}

const panelCounter = computed(() => {
  return `[${String(props.panelIndex + 1).padStart(2, '0')} / ${String(props.totalPanels).padStart(2, '0')}]`
})
</script>

<template>
  <header class="film-strip-header">
    <div class="film-strip-header__identity">
      <p class="film-strip-header__eyebrow">
        EVIDENCEBOUND / {{ kindLabel[project.nodeKind] }}
      </p>
      <h2>{{ project.name }}</h2>
    </div>

    <div class="film-strip-header__controls">
      <span aria-live="polite">{{ panelCounter }}</span>
      <button type="button" aria-label="Previous overlay panel" @click="emit('previous')">
        [<-]
      </button>
      <button type="button" aria-label="Next overlay panel" @click="emit('next')">
        [->]
      </button>
      <button type="button" aria-label="Close overlay" @click="emit('close')">
        [x]
      </button>
    </div>
  </header>
</template>

<style scoped>
.film-strip-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1.5rem;
  color: var(--ice);
  font-family: 'Geist Mono', ui-monospace, SFMono-Regular, Consolas, monospace;
  text-transform: uppercase;
}

.film-strip-header__identity {
  display: grid;
  gap: 0.35rem;
}

.film-strip-header__eyebrow {
  margin: 0;
  color: var(--gold);
  font-size: var(--text-xs);
  letter-spacing: 0.18em;
}

h2 {
  margin: 0;
  color: var(--ice);
  font-family: Spectral, Georgia, serif;
  font-size: clamp(2rem, 4.4vw, 4.8rem);
  font-weight: 300;
  letter-spacing: 0.06em;
  line-height: 0.92;
  text-transform: none;
}

.film-strip-header__controls {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  color: var(--ice-muted);
  font-size: var(--text-xs);
  letter-spacing: 0.14em;
  white-space: nowrap;
}

button {
  border: 1px solid color-mix(in srgb, var(--ice-faint) 68%, transparent);
  background: color-mix(in srgb, var(--bg) 54%, transparent);
  color: var(--ice);
  cursor: pointer;
  letter-spacing: 0.12em;
  padding: 0.38rem 0.55rem;
  transition:
    border-color 160ms var(--ease-in-out),
    color 160ms var(--ease-in-out),
    background 160ms var(--ease-in-out);
}

button:hover,
button:focus-visible {
  border-color: var(--gold);
  background: color-mix(in srgb, var(--gold) 12%, transparent);
  color: var(--gold-glow);
  outline: none;
}

@media (max-width: 760px) {
  .film-strip-header {
    flex-direction: column;
  }

  .film-strip-header__controls {
    flex-wrap: wrap;
  }
}
</style>
