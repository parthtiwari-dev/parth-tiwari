<script setup lang="ts">
import { computed } from 'vue'
import type { ArchitectureNode, Project } from '@/types/project'

const props = defineProps<{
  project: Project
}>()

const edges = computed(() => {
  const nodesById = new Map(props.project.panels.architecture.nodes.map((node) => [node.id, node]))

  return props.project.panels.architecture.nodes.flatMap((source) => {
    return source.connections.flatMap((targetId) => {
      const target = nodesById.get(targetId)
      return target ? [{ source, target }] : []
    })
  })
})

function nodeStyle(node: ArchitectureNode) {
  return {
    left: `${node.position.x}%`,
    top: `${node.position.y}%`,
  }
}
</script>

<template>
  <article class="panel-architecture">
    <div class="panel-architecture__intro">
      <p class="panel-label">Architecture</p>
      <p>{{ project.panels.architecture.summary }}</p>
    </div>

    <div class="architecture-map" aria-label="Architecture map">
      <svg class="architecture-map__edges" viewBox="0 0 100 100" aria-hidden="true">
        <line
          v-for="edge in edges"
          :key="`${edge.source.id}-${edge.target.id}`"
          :x1="edge.source.position.x"
          :y1="edge.source.position.y"
          :x2="edge.target.position.x"
          :y2="edge.target.position.y"
        />
      </svg>

      <div
        v-for="node in project.panels.architecture.nodes"
        :key="node.id"
        class="architecture-node"
        :style="nodeStyle(node)"
      >
        <h3>{{ node.label }}</h3>
        <p>{{ node.description }}</p>
        <div v-if="node.stackChips?.length" class="architecture-node__chips">
          <span v-for="chip in node.stackChips" :key="chip">{{ chip }}</span>
        </div>
      </div>
    </div>

    <div v-if="project.artifacts?.length" class="artifact-row" aria-label="Featured artifacts">
      <section v-for="artifact in project.artifacts" :key="artifact.id">
        <p>{{ artifact.label }}</p>
        <h3>{{ artifact.name }}</h3>
        <span>{{ artifact.summary }}</span>
      </section>
    </div>
  </article>
</template>

<style scoped>
.panel-architecture {
  display: grid;
  gap: 1.25rem;
}

.panel-architecture__intro {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 2rem;
}

.panel-label {
  margin: 0;
  color: var(--gold);
  font-family: 'Geist Mono', ui-monospace, SFMono-Regular, Consolas, monospace;
  font-size: var(--text-xs);
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.panel-architecture__intro > p:last-child {
  max-width: 44rem;
  margin: 0;
  color: var(--ice-muted);
  line-height: 1.55;
}

.architecture-map {
  position: relative;
  min-height: min(32rem, 55vh);
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--ice-faint) 52%, transparent);
  background:
    linear-gradient(90deg, color-mix(in srgb, var(--ice-faint) 10%, transparent) 1px, transparent 1px),
    linear-gradient(color-mix(in srgb, var(--ice-faint) 10%, transparent) 1px, transparent 1px),
    color-mix(in srgb, var(--bg) 52%, transparent);
  background-size: 48px 48px;
}

.architecture-map__edges {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.architecture-map__edges line {
  stroke: var(--ice-faint);
  stroke-linecap: round;
  stroke-opacity: 0.58;
  stroke-width: 0.35;
}

.architecture-node {
  position: absolute;
  display: grid;
  width: min(15.5rem, 30vw);
  gap: 0.55rem;
  padding: 0.75rem;
  transform: translate(-50%, -50%);
  border: 1px solid color-mix(in srgb, var(--ice-faint) 68%, transparent);
  background: color-mix(in srgb, var(--bg) 74%, transparent);
  box-shadow: 0 1rem 3rem rgb(0 0 0 / 0.22);
  transition:
    border-color 180ms var(--ease-in-out),
    transform 180ms var(--ease-in-out);
}

.architecture-node:hover {
  border-color: var(--gold);
  transform: translate(-50%, -50%) scale(1.05);
}

.architecture-node h3 {
  margin: 0;
  color: var(--ice);
  font-family: Spectral, Georgia, serif;
  font-size: clamp(1.15rem, 1.8vw, 1.65rem);
  font-weight: 400;
  line-height: 1;
}

.architecture-node p {
  margin: 0;
  color: var(--ice-muted);
  font-size: var(--text-sm);
  line-height: 1.45;
}

.architecture-node__chips,
.artifact-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.architecture-node__chips span {
  border: 1px solid color-mix(in srgb, var(--gold) 52%, transparent);
  color: var(--gold);
  font-family: 'Geist Mono', ui-monospace, SFMono-Regular, Consolas, monospace;
  font-size: 0.58rem;
  letter-spacing: 0.1em;
  padding: 0.18rem 0.32rem;
  text-transform: uppercase;
}

.artifact-row {
  gap: 1rem;
}

.artifact-row section {
  flex: 1 1 18rem;
  border-top: 1px solid color-mix(in srgb, var(--ice-faint) 54%, transparent);
  padding-top: 0.9rem;
}

.artifact-row p {
  margin: 0 0 0.35rem;
  color: var(--gold);
  font-family: 'Geist Mono', ui-monospace, SFMono-Regular, Consolas, monospace;
  font-size: var(--text-xs);
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.artifact-row h3,
.artifact-row span {
  margin: 0;
}

.artifact-row h3 {
  color: var(--ice);
  font-family: Spectral, Georgia, serif;
  font-size: 1.6rem;
  font-weight: 400;
}

.artifact-row span {
  display: block;
  color: var(--ice-muted);
  line-height: 1.5;
}

@media (max-width: 820px) {
  .panel-architecture__intro {
    display: grid;
  }

  .architecture-map {
    display: grid;
    min-height: 0;
    gap: 0.75rem;
    padding: 0.75rem;
  }

  .architecture-map__edges {
    display: none;
  }

  .architecture-node {
    position: relative;
    left: auto !important;
    top: auto !important;
    width: auto;
    transform: none;
  }

  .architecture-node:hover {
    transform: none;
  }
}
</style>
