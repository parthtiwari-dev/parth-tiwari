<script setup lang="ts">
import { computed, onMounted, onUnmounted, nextTick, ref } from 'vue'
import { useOverlayStore } from '@/stores/overlayStore'
import { useProjectStore } from '@/stores/projectStore'
import type { ProjectNodeKind, ProjectStatus, ProjectWeight } from '@/types/project'

/**
 * The DOM half of the constellation.
 *
 * `useNodeInteraction` binds `pointermove` / `pointerdown` only, so on desktop
 * the nine projects have no keyboard or screen-reader path at all
 * (`docs/AUDIT.md` C2). This rail is that path: real buttons, real focus order,
 * the same `overlayStore.open(id)` the raycaster calls. It stays collapsed so it
 * complements the scene rather than competing with it, but it is always
 * rendered, always reachable, on every breakpoint.
 */

const overlayStore = useOverlayStore()
const projectStore = useProjectStore()

const isOpen = ref(false)
const toggleRef = ref<HTMLButtonElement | null>(null)
const panelRef = ref<HTMLElement | null>(null)

const weightRank: Record<ProjectWeight, number> = {
  flagship: 0,
  major: 1,
  minor: 2,
}

const kindLabel: Record<ProjectNodeKind, string> = {
  'personal-project': 'Personal project',
  'work-experience': 'Work experience',
  'current-build': 'Currently building',
  utility: 'Utility / tooling',
}

const statusLabel: Record<ProjectStatus, string> = {
  complete: 'Complete',
  active: 'Active',
  'in-progress': 'In progress',
  experience: 'Experience',
}

const orderedProjects = computed(() => {
  return [...projectStore.projects].sort((a, b) => {
    const weightDelta = weightRank[a.weight] - weightRank[b.weight]

    if (weightDelta !== 0) {
      return weightDelta
    }

    return a.name.localeCompare(b.name)
  })
})

function describe(projectName: string, tagline: string) {
  return `${projectName}. ${tagline}. Open evidence panels.`
}

async function openPanel() {
  isOpen.value = true
  await nextTick()
  panelRef.value?.querySelector<HTMLButtonElement>('button')?.focus()
}

function closePanel(returnFocus = true) {
  if (!isOpen.value) {
    return
  }

  isOpen.value = false

  if (returnFocus) {
    toggleRef.value?.focus()
  }
}

function togglePanel() {
  if (isOpen.value) {
    closePanel(false)
    return
  }

  void openPanel()
}

function openProject(projectId: string) {
  // Leave focus alone: ProjectOverlay's focus trap takes it from here and
  // restores to the button that opened it on close.
  isOpen.value = false
  overlayStore.open(projectId)
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && isOpen.value) {
    closePanel()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <nav class="project-index" :class="{ 'is-open': isOpen }" aria-label="Project index">
    <button
      ref="toggleRef"
      type="button"
      class="project-index__toggle"
      :aria-expanded="isOpen"
      aria-controls="project-index-panel"
      :aria-label="isOpen
        ? 'Close project index'
        : `Open project index, ${projectStore.projectCount} systems`"
      @click="togglePanel"
    >
      <span class="project-index__toggle-count" aria-hidden="true">
        {{ projectStore.projectCount }}
      </span>
      <span class="project-index__toggle-label" aria-hidden="true">
        Systems index
      </span>
    </button>

    <Transition name="project-index-panel">
      <div
        v-if="isOpen"
        id="project-index-panel"
        ref="panelRef"
        class="project-index__panel"
      >
        <div class="project-index__intro">
          <p class="project-index__eyebrow">
            Project index
          </p>
          <p class="project-index__hint">
            {{ projectStore.projectCount }} systems. Same evidence panels as the
            constellation — problem, architecture, proof, boundary, links.
          </p>
        </div>

        <ul class="project-index__list">
          <li
            v-for="project in orderedProjects"
            :key="project.id"
          >
            <button
              type="button"
              class="project-index__item"
              :class="`project-index__item--${project.nodeKind}`"
              :aria-label="describe(project.name, project.tagline)"
              @click="openProject(project.id)"
            >
              <span class="project-index__item-name">{{ project.name }}</span>
              <span class="project-index__item-tagline">{{ project.tagline }}</span>
              <span class="project-index__item-meta">
                {{ kindLabel[project.nodeKind] }} / {{ statusLabel[project.status] }}
              </span>
            </button>
          </li>
        </ul>

        <button
          type="button"
          class="project-index__close"
          @click="closePanel()"
        >
          Close index
        </button>
      </div>
    </Transition>
  </nav>
</template>

<style scoped>
.project-index {
  position: fixed;
  top: 50%;
  left: 0;
  z-index: 45;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  transform: translateY(-50%);
  font-family: var(--font-mono);
  pointer-events: none;
}

.project-index__toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  min-width: 2.1rem;
  min-height: 2.1rem;
  padding: 0.85rem 0.35rem;
  border: 1px solid color-mix(in srgb, var(--ice-faint) 62%, transparent);
  border-left: 0;
  border-radius: 0 0.4rem 0.4rem 0;
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--ice) 8%, transparent), transparent 62%),
    color-mix(in srgb, var(--bg) 66%, transparent);
  box-shadow:
    inset 0 1px 0 color-mix(in srgb, var(--ice) 12%, transparent),
    0 0.75rem 1.8rem rgb(0 0 0 / 0.24);
  color: var(--ice-muted);
  cursor: pointer;
  font-family: inherit;
  font-size: var(--text-xs);
  letter-spacing: 0.18em;
  pointer-events: auto;
  text-transform: uppercase;
  writing-mode: vertical-rl;
  backdrop-filter: blur(14px) saturate(1.18);
  transition:
    border-color 160ms var(--ease-in-out),
    color 160ms var(--ease-in-out),
    background 160ms var(--ease-in-out);
}

.project-index__toggle-count {
  color: var(--gold-glow);
  font-size: 0.68rem;
  letter-spacing: 0.12em;
}

.project-index__toggle-label {
  font-size: 0.58rem;
}

.project-index__toggle:hover,
.project-index__toggle:focus-visible,
.project-index.is-open .project-index__toggle {
  border-color: color-mix(in srgb, var(--gold) 72%, transparent);
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--gold) 18%, transparent), transparent 62%),
    color-mix(in srgb, var(--bg) 56%, transparent);
  color: var(--gold-glow);
}

.project-index__toggle:focus-visible,
.project-index__item:focus-visible,
.project-index__close:focus-visible {
  outline: 2px solid var(--gold-glow);
  outline-offset: 3px;
}

.project-index__panel {
  display: grid;
  align-content: start;
  gap: 0.75rem;
  width: min(22rem, calc(100vw - 4.5rem));
  max-height: min(34rem, 78vh);
  padding: 0.9rem;
  overflow-y: auto;
  overscroll-behavior: contain;
  border: 1px solid color-mix(in srgb, var(--ice-faint) 58%, transparent);
  border-radius: 0.5rem;
  background:
    radial-gradient(circle at 18% 0%, color-mix(in srgb, var(--gold) 7%, transparent), transparent 12rem),
    linear-gradient(135deg, color-mix(in srgb, var(--ice) 5%, transparent), transparent 58%),
    color-mix(in srgb, var(--bg) 88%, transparent);
  box-shadow:
    inset 0 1px 0 color-mix(in srgb, var(--ice) 10%, transparent),
    0 1rem 3rem rgb(0 0 0 / 0.34);
  color: var(--ice);
  pointer-events: auto;
  backdrop-filter: blur(16px) saturate(1.18);
}

.project-index__intro {
  display: grid;
  gap: 0.3rem;
}

.project-index__eyebrow {
  margin: 0;
  color: var(--gold-glow);
  font-size: 0.6rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.project-index__hint {
  margin: 0;
  color: var(--ice-muted);
  font-family: var(--font-body);
  font-size: 0.78rem;
  letter-spacing: 0;
  line-height: 1.45;
  text-transform: none;
}

.project-index__list {
  display: grid;
  gap: 0.35rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.project-index__item {
  --index-accent: var(--gold-glow);
  display: grid;
  gap: 0.18rem;
  width: 100%;
  padding: 0.55rem 0.6rem;
  border: 1px solid color-mix(in srgb, var(--ice-faint) 44%, transparent);
  border-left: 2px solid color-mix(in srgb, var(--index-accent) 62%, transparent);
  border-radius: 0.3rem;
  background: color-mix(in srgb, var(--bg) 58%, transparent);
  color: var(--ice);
  cursor: pointer;
  font-family: inherit;
  text-align: left;
  transition:
    border-color 140ms var(--ease-in-out),
    background 140ms var(--ease-in-out);
}

.project-index__item--work-experience {
  --index-accent: var(--bg-cyan);
}

.project-index__item--current-build {
  --index-accent: var(--amber-glow);
}

.project-index__item--utility {
  --index-accent: var(--utility-glow);
}

.project-index__item:hover,
.project-index__item:focus-visible {
  border-color: color-mix(in srgb, var(--index-accent) 72%, transparent);
  background: color-mix(in srgb, var(--index-accent) 10%, var(--bg));
}

.project-index__item-name {
  color: var(--ice);
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 300;
  letter-spacing: 0.02em;
  line-height: 1.15;
}

.project-index__item-tagline {
  color: var(--ice-muted);
  font-family: var(--font-body);
  font-size: 0.76rem;
  line-height: 1.35;
}

.project-index__item-meta {
  color: color-mix(in srgb, var(--index-accent) 82%, var(--ice));
  font-size: 0.55rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.project-index__close {
  min-height: 2.1rem;
  border: 1px solid color-mix(in srgb, var(--ice-faint) 54%, transparent);
  border-radius: 999px;
  background: color-mix(in srgb, var(--bg) 54%, transparent);
  color: var(--ice-muted);
  cursor: pointer;
  font-family: inherit;
  font-size: 0.6rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.project-index__close:hover,
.project-index__close:focus-visible {
  border-color: color-mix(in srgb, var(--gold) 68%, transparent);
  color: var(--gold-glow);
}

.project-index-panel-enter-active,
.project-index-panel-leave-active {
  transition:
    opacity 180ms var(--ease-in-out),
    transform 240ms var(--ease-out-expo);
}

.project-index-panel-enter-from,
.project-index-panel-leave-to {
  opacity: 0;
  transform: translateX(-0.75rem);
}

@media (max-width: 767px) {
  .project-index {
    top: auto;
    bottom: max(5.5rem, calc(env(safe-area-inset-bottom) + 5.5rem));
    transform: none;
  }

  .project-index__panel {
    width: min(20rem, calc(100vw - 3.5rem));
    max-height: min(26rem, 60vh);
  }
}

@media (prefers-reduced-motion: reduce) {
  .project-index__toggle,
  .project-index__item,
  .project-index__close {
    transition: none;
  }

  .project-index-panel-enter-active,
  .project-index-panel-leave-active {
    transition: none;
  }

  .project-index-panel-enter-from,
  .project-index-panel-leave-to {
    opacity: 1;
    transform: none;
  }
}
</style>
