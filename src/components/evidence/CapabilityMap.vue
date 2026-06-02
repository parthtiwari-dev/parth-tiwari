<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue'
import { capabilityGroups, normalizeCapability } from '@/data/capabilities'
import { useProjectStore } from '@/stores/projectStore'

const projectStore = useProjectStore()
const activeSkill = ref<string | null>(null)

function stackMatchesSkill(stackItem: string, skill: string) {
  const normalizedStack = normalizeCapability(stackItem)
  const normalizedSkill = normalizeCapability(skill)

  if (!normalizedStack || !normalizedSkill) {
    return false
  }

  return normalizedStack === normalizedSkill
    || normalizedStack.includes(normalizedSkill)
    || normalizedSkill.includes(normalizedStack)
}

function projectsForSkill(skill: string) {
  return projectStore.projects.filter((project) => {
    return project.stack.some((stackItem) => stackMatchesSkill(stackItem, skill))
  })
}

const activeProjects = computed(() => {
  return activeSkill.value ? projectsForSkill(activeSkill.value) : []
})

function setActiveSkill(skill: string) {
  activeSkill.value = skill
  projectStore.highlight(projectsForSkill(skill).map((project) => project.id))
}

function clearActiveSkill() {
  activeSkill.value = null
  projectStore.clearHighlight()
}

onUnmounted(() => {
  projectStore.clearHighlight()
})
</script>

<template>
  <article class="capability-map" @mouseleave="clearActiveSkill">
    <header class="capability-map__intro">
      <p class="panel-label">Skill Atlas</p>
      <h2>Capability map.</h2>
      <p>
        Hover or tap a capability to see where it is used across the constellation. The map is evidence-first: skills only light up projects when the stack data says they belong there.
      </p>
    </header>

    <div class="capability-map__layout">
      <section class="capability-map__groups" aria-label="Capability groups">
        <div
          v-for="group in capabilityGroups"
          :key="group.id"
          class="capability-group"
        >
          <div class="capability-group__header">
            <p>{{ group.label }}</p>
            <span>{{ group.summary }}</span>
          </div>

          <div class="capability-group__chips">
            <button
              v-for="skill in group.skills"
              :key="skill"
              type="button"
              :class="{ 'is-active': activeSkill === skill }"
              @focus="setActiveSkill(skill)"
              @mouseenter="setActiveSkill(skill)"
              @click="setActiveSkill(skill)"
              @blur="clearActiveSkill"
            >
              {{ skill }}
            </button>
          </div>
        </div>
      </section>

      <aside class="capability-map__readout" aria-live="polite">
        <p class="panel-label">Used In</p>
        <h3>{{ activeSkill ?? 'Select a capability' }}</h3>
        <ul v-if="activeProjects.length">
          <li v-for="project in activeProjects" :key="project.id">
            <span>{{ project.name }}</span>
            <small>{{ project.nodeKind.replace('-', ' ') }}</small>
          </li>
        </ul>
        <p v-else>
          {{ activeSkill ? 'This capability is part of the wider skill base, but no current node stack names it directly.' : 'Capability hover will highlight related constellation nodes behind this overlay.' }}
        </p>
      </aside>
    </div>
  </article>
</template>

<style scoped>
.capability-map {
  display: grid;
  gap: clamp(1.2rem, 3vw, 2.2rem);
}

.capability-map__intro {
  display: grid;
  max-width: 68rem;
  gap: 0.8rem;
}

.panel-label {
  margin: 0;
  color: var(--gold);
  font-family: 'Geist Mono', ui-monospace, SFMono-Regular, Consolas, monospace;
  font-size: var(--text-xs);
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.capability-map h2,
.capability-map h3 {
  margin: 0;
  color: var(--ice);
  font-family: Spectral, Georgia, serif;
  font-weight: 300;
}

.capability-map h2 {
  font-size: clamp(2.8rem, 6.6vw, 6.5rem);
  letter-spacing: 0.03em;
  line-height: 0.9;
}

.capability-map h3 {
  font-size: clamp(1.7rem, 3.5vw, 3.5rem);
  line-height: 0.95;
}

.capability-map__intro > p:not(.panel-label),
.capability-group__header span,
.capability-map__readout > p:not(.panel-label),
.capability-map__readout small {
  margin: 0;
  color: var(--ice-muted);
  line-height: 1.55;
}

.capability-map__layout {
  display: grid;
  gap: 1rem;
  grid-template-columns: minmax(0, 1fr) minmax(18rem, 0.34fr);
  align-items: start;
}

.capability-map__groups {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.capability-group,
.capability-map__readout {
  border: 1px solid color-mix(in srgb, var(--ice-faint) 54%, transparent);
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--ice) 5%, transparent), transparent 42%),
    color-mix(in srgb, var(--bg) 58%, transparent);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.08),
    0 1rem 2.4rem rgb(0 0 0 / 0.18);
}

.capability-group {
  display: grid;
  align-content: start;
  gap: 1rem;
  min-height: 13rem;
  padding: clamp(0.9rem, 1.8vw, 1.2rem);
}

.capability-group__header {
  display: grid;
  gap: 0.45rem;
}

.capability-group__header p {
  margin: 0;
  color: var(--ice);
  font-family: 'Geist Mono', ui-monospace, SFMono-Regular, Consolas, monospace;
  font-size: var(--text-xs);
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.capability-group__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
}

.capability-group__chips button {
  border: 1px solid color-mix(in srgb, var(--ice-faint) 58%, transparent);
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--ice) 6%, transparent), transparent 58%),
    color-mix(in srgb, var(--bg) 54%, transparent);
  color: var(--ice-muted);
  cursor: pointer;
  font-family: 'Geist Mono', ui-monospace, SFMono-Regular, Consolas, monospace;
  font-size: var(--text-xs);
  letter-spacing: 0.09em;
  padding: 0.34rem 0.52rem;
  text-transform: uppercase;
  transition:
    border-color 150ms var(--ease-in-out),
    color 150ms var(--ease-in-out),
    transform 150ms var(--ease-in-out);
}

.capability-group__chips button:hover,
.capability-group__chips button:focus-visible,
.capability-group__chips button.is-active {
  border-color: color-mix(in srgb, var(--gold) 76%, transparent);
  color: var(--gold-glow);
  outline: none;
  transform: translateY(-1px);
}

.capability-map__readout {
  position: sticky;
  top: 0;
  display: grid;
  gap: 0.9rem;
  padding: clamp(0.95rem, 2vw, 1.25rem);
}

.capability-map__readout ul {
  display: grid;
  gap: 0.6rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.capability-map__readout li {
  display: grid;
  gap: 0.15rem;
  border-left: 1px solid color-mix(in srgb, var(--gold) 58%, transparent);
  padding-left: 0.7rem;
}

.capability-map__readout li span {
  color: var(--ice);
  font-family: Spectral, Georgia, serif;
  font-size: clamp(1.2rem, 1.8vw, 1.6rem);
}

.capability-map__readout small {
  font-family: 'Geist Mono', ui-monospace, SFMono-Regular, Consolas, monospace;
  font-size: var(--text-xs);
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

@media (max-width: 1040px) {
  .capability-map__layout,
  .capability-map__groups {
    grid-template-columns: 1fr;
  }

  .capability-map__readout {
    position: relative;
  }
}

@media (max-width: 620px) {
  .capability-map {
    gap: 1.15rem;
  }

  .capability-map h2 {
    font-size: clamp(2.6rem, 15vw, 4.25rem);
  }

  .capability-map__intro {
    gap: 0.65rem;
  }

  .capability-group,
  .capability-map__readout {
    padding: 0.85rem;
  }

  .capability-group {
    min-height: auto;
  }

  .capability-group__chips button {
    min-height: 2.45rem;
    padding: 0.48rem 0.62rem;
  }

  .capability-map__readout {
    gap: 0.7rem;
    order: -1;
  }
}
</style>
