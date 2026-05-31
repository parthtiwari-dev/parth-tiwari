<script setup lang="ts">
import BrokenFlowDiagram from '@/components/overlay/BrokenFlowDiagram.vue'
import type { Project } from '@/types/project'

defineProps<{
  project: Project
}>()
</script>

<template>
  <article class="panel-problem">
    <div class="panel-problem__quote">
      <p class="panel-label">Problem frame</p>
      <blockquote>
        {{ project.panels.problem.quote }}
      </blockquote>
      <p class="panel-problem__tagline">
        {{ project.tagline }}
      </p>
    </div>

    <div class="panel-problem__diagram">
      <BrokenFlowDiagram :id="project.panels.problem.brokenFlowId" />
    </div>
  </article>
</template>

<style scoped>
.panel-problem {
  display: grid;
  align-items: center;
  gap: clamp(1.5rem, 4vw, 4rem);
  grid-template-columns: minmax(0, 1fr) minmax(18rem, 0.9fr);
  min-height: min(35rem, 58vh);
}

.panel-label {
  margin: 0 0 1rem;
  color: var(--gold);
  font-family: 'Geist Mono', ui-monospace, SFMono-Regular, Consolas, monospace;
  font-size: var(--text-xs);
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

blockquote {
  margin: 0;
  color: var(--ice);
  font-family: Spectral, Georgia, serif;
  font-size: clamp(2.4rem, 5vw, 5.4rem);
  font-style: italic;
  font-weight: 300;
  letter-spacing: 0.01em;
  line-height: 0.98;
}

.panel-problem__tagline {
  max-width: 42rem;
  margin: 1.4rem 0 0;
  color: var(--ice-muted);
  font-size: clamp(1rem, 1.25vw, 1.25rem);
  line-height: 1.55;
}

.panel-problem__diagram {
  border-left: 1px solid color-mix(in srgb, var(--ice-faint) 60%, transparent);
  padding-left: clamp(1rem, 3vw, 2.5rem);
}

@media (max-width: 900px) {
  .panel-problem {
    grid-template-columns: 1fr;
  }

  .panel-problem__diagram {
    border-left: 0;
    border-top: 1px solid color-mix(in srgb, var(--ice-faint) 60%, transparent);
    padding-left: 0;
    padding-top: 1.25rem;
  }
}
</style>
