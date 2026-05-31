<script setup lang="ts">
import { computed } from 'vue'
import PanelArchitecture from '@/components/overlay/panels/PanelArchitecture.vue'
import PanelBoundary from '@/components/overlay/panels/PanelBoundary.vue'
import PanelProblem from '@/components/overlay/panels/PanelProblem.vue'
import PanelProof from '@/components/overlay/panels/PanelProof.vue'
import type { Project } from '@/types/project'

const props = defineProps<{
  project: Project
  activePanelIndex: number
}>()

const emit = defineEmits<{
  setPanel: [index: number]
}>()

const panels = [
  { label: 'Problem', component: PanelProblem },
  { label: 'Architecture', component: PanelArchitecture },
  { label: 'Proof', component: PanelProof },
  { label: 'Boundary', component: PanelBoundary },
] as const

const activePanel = computed(() => panels[props.activePanelIndex] ?? panels[0])
</script>

<script lang="ts">
export const filmStripPanelCount = 4
</script>

<template>
  <div class="film-strip">
    <nav class="film-strip__nav" aria-label="Project evidence panels">
      <button
        v-for="(panel, index) in panels"
        :key="panel.label"
        type="button"
        :class="{ 'is-active': index === activePanelIndex }"
        @click="emit('setPanel', index)"
      >
        <span>{{ String(index + 1).padStart(2, '0') }}</span>
        {{ panel.label }}
      </button>
    </nav>

    <div class="film-strip__frame">
      <component :is="activePanel.component" :project="project" />
    </div>
  </div>
</template>

<style scoped>
.film-strip {
  display: grid;
  gap: 1rem;
}

.film-strip__nav {
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
}

.film-strip__nav button {
  border: 1px solid color-mix(in srgb, var(--ice-faint) 48%, transparent);
  background: color-mix(in srgb, var(--bg) 48%, transparent);
  color: var(--ice-muted);
  cursor: pointer;
  font-family: 'Geist Mono', ui-monospace, SFMono-Regular, Consolas, monospace;
  font-size: var(--text-xs);
  letter-spacing: 0.12em;
  padding: 0.5rem 0.68rem;
  text-transform: uppercase;
}

.film-strip__nav span {
  color: var(--ice-faint);
  margin-right: 0.45rem;
}

.film-strip__nav button:hover,
.film-strip__nav button:focus-visible,
.film-strip__nav button.is-active {
  border-color: color-mix(in srgb, var(--gold) 72%, transparent);
  color: var(--ice);
  outline: none;
}

.film-strip__nav button.is-active span {
  color: var(--gold);
}

.film-strip__frame {
  position: relative;
  min-height: min(42rem, calc(100vh - 15rem));
  overflow: auto;
  padding: clamp(1.25rem, 3vw, 2.25rem);
  border: 1px solid color-mix(in srgb, var(--ice-faint) 58%, transparent);
  background:
    linear-gradient(115deg, rgba(216, 234, 240, 0.055), transparent 38%),
    color-mix(in srgb, var(--bg) 62%, transparent);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.08),
    0 1.4rem 4rem rgb(0 0 0 / 0.26);
  backdrop-filter: blur(18px) saturate(1.26);
}

@media (max-width: 720px) {
  .film-strip__frame {
    min-height: auto;
    max-height: calc(100vh - 13rem);
  }
}
</style>
