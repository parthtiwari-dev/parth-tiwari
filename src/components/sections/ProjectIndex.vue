<script setup lang="ts">
import { computed, onMounted, onUnmounted, nextTick, ref } from 'vue'
import ObservationLog, { type ObservationRow } from '@/components/common/ObservationLog.vue'
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

/**
 * The rail renders through the shared observation log so the index matches every
 * other evidence surface in the chrome, but as `as="list"` — it is navigation,
 * not a data table, and table roles would mislead a screen reader here.
 * `kind / status` moves into the log's status column, where the motif already
 * has a home for it.
 */
const indexRows = computed<ObservationRow[]>(() =>
  orderedProjects.value.map((project) => ({
    id: project.id,
    label: project.name,
    detail: project.tagline,
    status: `${kindLabel[project.nodeKind]} / ${statusLabel[project.status]}`,
    tone: project.status === 'complete' ? 'complete' : 'active',
  })),
)

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
      <!-- The affordance the audit asked for: without a direction cue the rail
           reads as a stray label rather than a control (DESIGN_REVIEW.md 3). -->
      <span class="project-index__toggle-chevron" aria-hidden="true">
        <svg viewBox="0 0 8 12" width="8" height="12" fill="none" aria-hidden="true">
          <path
            d="M1.5 1.5 6 6l-4.5 4.5"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
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

        <ObservationLog
          :rows="indexRows"
          label="Project index"
          as="list"
          dense
          class="project-index__log"
        >
          <template #row="{ row }">
            <button
              type="button"
              class="project-index__item"
              :aria-label="describe(row.label, row.detail ?? '')"
              @click="openProject(row.id)"
            >
              <span class="project-index__item-name">{{ row.label }}</span>
              <span class="project-index__item-tagline">{{ row.detail }}</span>
            </button>
          </template>
        </ObservationLog>

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
  /* Flat fill and a single hairline — no gradient, no drop-shadow
     (`DESIGN_LOCK.md` Banned). The gold hairline is what marks it interactive. */
  border-radius: 0 var(--radius-chrome) var(--radius-chrome) 0;
  background: color-mix(in srgb, var(--bg) 72%, transparent);
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
    padding-right 200ms var(--ease-out-expo),
    background-color 160ms var(--ease-in-out);
}

/* The rail was technically reachable but read as decoration, so a sighted user
   never tried it (DESIGN_REVIEW.md 3). The chevron plus a widen-on-hover give it
   the affordance it was missing; the count already carried the information. */
.project-index__toggle-chevron {
  display: inline-flex;
  color: var(--gold);
  opacity: 0.75;
  transition:
    opacity 160ms var(--ease-in-out),
    transform 200ms var(--ease-out-expo);
}

.project-index__toggle:hover .project-index__toggle-chevron,
.project-index__toggle:focus-visible .project-index__toggle-chevron {
  opacity: 1;
  transform: translateY(0.15rem);
}

.project-index.is-open .project-index__toggle-chevron {
  transform: rotate(180deg);
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
  background: color-mix(in srgb, var(--gold) 12%, var(--bg));
  color: var(--gold-glow);
  /* Grows toward the page, hinting that it opens outward. */
  padding-right: 0.6rem;
}

@media (prefers-reduced-motion: reduce) {
  .project-index__toggle,
  .project-index__toggle-chevron {
    transition: none;
  }
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
  border-radius: var(--radius-chrome);
  /* Flat surface, hairline ring. No gradient wash, no drop-shadow. */
  background: color-mix(in srgb, var(--bg) 92%, transparent);
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

/* Rows are the shared observation-log motif, so the button carries no border,
   no fill and no radius of its own — the log's hairline is the only structure.
   The per-kind accents this previously used (`--bg-cyan`, `--amber-glow`,
   `--utility-glow`) are removed: `DESIGN_LOCK.md` scopes those to the 3D legend
   and bans a second accent anywhere in the 2D chrome. Kind and status still
   render, in the log's own status column. */
.project-index__item {
  display: grid;
  gap: 0.18rem;
  width: 100%;
  padding: 0;
  border: 0;
  background: none;
  color: var(--ice);
  cursor: pointer;
  font-family: inherit;
  text-align: left;
  transition: color 140ms var(--ease-in-out);
}

.project-index__item:hover .project-index__item-name,
.project-index__item:focus-visible .project-index__item-name {
  color: var(--gold-glow);
}

.project-index__item-name {
  color: var(--ice);
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 300;
  letter-spacing: 0.02em;
  line-height: 1.15;
  transition: color 140ms var(--ease-in-out);
}

.project-index__item-tagline {
  color: var(--ice-muted);
  font-family: var(--font-body);
  font-size: 0.76rem;
  line-height: 1.35;
}

@media (prefers-reduced-motion: reduce) {
  .project-index__item,
  .project-index__item-name {
    transition: none;
  }
}

.project-index__close {
  min-height: 2.1rem;
  border: 1px solid color-mix(in srgb, var(--ice-faint) 54%, transparent);
  border-radius: var(--radius-chrome);
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
