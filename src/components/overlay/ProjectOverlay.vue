<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { lockBodyScroll, unlockBodyScroll } from '@/composables/useBodyScrollLock'
import { useEscapeStack } from '@/composables/useEscapeStack'
import { useFocusTrap } from '@/composables/useFocusTrap'
import { isOverlayReadyProject } from '@/data/overlayReady'
import FilmStrip, { filmStripPanelCount } from '@/components/overlay/FilmStrip.vue'
import FilmStripHeader from '@/components/overlay/FilmStripHeader.vue'
import { useOverlayStore } from '@/stores/overlayStore'
import { useProjectStore } from '@/stores/projectStore'

const overlayStore = useOverlayStore()
const projectStore = useProjectStore()
const overlayRoot = ref<HTMLElement | null>(null)
const touchStartX = ref<number | null>(null)
// Declares role="dialog" aria-modal="true", so Tab has to stay inside it and
// focus has to go back to the node or index button that opened it.
const focusTrap = useFocusTrap(overlayRoot)
let lastWheelAt = 0
let hasScrollLock = false

const activeProject = computed(() => {
  const projectId = overlayStore.activeProjectId

  if (!projectId || !isOverlayReadyProject(projectId)) {
    return null
  }

  return projectStore.getById(projectId) ?? null
})

function closeOverlay() {
  overlayStore.close()
}

useEscapeStack(computed(() => overlayStore.isOpen), closeOverlay)

function nextPanel() {
  overlayStore.nextPanel()
}

function previousPanel() {
  overlayStore.previousPanel()
}

function setBodyScrollLock(shouldLock: boolean) {
  if (shouldLock && !hasScrollLock) {
    lockBodyScroll()
    hasScrollLock = true
    return
  }

  if (!shouldLock && hasScrollLock) {
    unlockBodyScroll()
    hasScrollLock = false
  }
}

function canScrollOverlay(deltaY: number) {
  const root = overlayRoot.value
  const scrollTolerance = 2

  if (!root) {
    return false
  }

  if (deltaY > 0) {
    return root.scrollTop + root.clientHeight < root.scrollHeight - scrollTolerance
  }

  return root.scrollTop > scrollTolerance
}

/**
 * Elements that interpret arrow keys themselves. Panel navigation must not
 * preempt them.
 */
function ownsArrowKeys(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  const tag = target.tagName
  if (tag === 'TEXTAREA' || tag === 'SELECT') return true
  if (tag === 'INPUT') {
    const type = (target as HTMLInputElement).type
    return type === 'range' || type === 'number' || type === 'text' || type === 'search'
  }
  return target.isContentEditable
}

function handleKeydown(event: KeyboardEvent) {
  if (!overlayStore.isOpen) {
    return
  }

  // Escape is handled by useEscapeStack so the topmost surface wins (2.9).
  // Arrows stay here: they are panel navigation, meaningless to any other
  // surface, and only reachable while this overlay is the open one.
  //
  // Except when focus is in a control that owns arrow keys itself. The Cost of
  // Intelligence dial (3.8) is a range input inside the Proof panel, and without
  // this guard the overlay swallowed its arrows — the slider rendered, took
  // focus, and could not be moved by keyboard at all. Found by driving it in a
  // real browser; it typechecks and looks correct either way.
  if (ownsArrowKeys(event.target)) {
    return
  }

  if (event.key === 'ArrowRight') {
    event.preventDefault()
    nextPanel()
  }

  if (event.key === 'ArrowLeft') {
    event.preventDefault()
    previousPanel()
  }
}

function handleWheel(event: WheelEvent) {
  if (Math.abs(event.deltaY) < 18) {
    return
  }

  if (canScrollOverlay(event.deltaY)) {
    return
  }

  const now = window.performance.now()

  if (now - lastWheelAt < 680) {
    event.preventDefault()
    return
  }

  lastWheelAt = now
  event.preventDefault()

  if (event.deltaY > 0) {
    nextPanel()
  } else {
    previousPanel()
  }
}

function handleTouchStart(event: TouchEvent) {
  touchStartX.value = event.touches[0]?.clientX ?? null
}

function handleTouchEnd(event: TouchEvent) {
  const startX = touchStartX.value
  const endX = event.changedTouches[0]?.clientX

  touchStartX.value = null

  if (startX === null || typeof endX !== 'number') {
    return
  }

  const deltaX = endX - startX

  if (Math.abs(deltaX) < 50) {
    return
  }

  if (deltaX < 0) {
    nextPanel()
  } else {
    previousPanel()
  }
}

watch(
  () => overlayStore.isOpen,
  (isOpen) => {
    if (isOpen) {
      setBodyScrollLock(true)
      void focusTrap.activate()
      return
    }

    setBodyScrollLock(false)
    focusTrap.deactivate()
  },
)

watch(activeProject, (project) => {
  if (overlayStore.isOpen && !project) {
    overlayStore.close()
  }
})

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  setBodyScrollLock(false)
  focusTrap.deactivate()
})
</script>

<template>
  <Transition name="project-overlay">
    <section
      v-if="overlayStore.isOpen && activeProject"
      ref="overlayRoot"
      class="project-overlay"
      role="dialog"
      aria-modal="true"
      :aria-label="`${activeProject.name} evidence overlay`"
      tabindex="-1"
      @wheel="handleWheel"
      @touchstart.passive="handleTouchStart"
      @touchend="handleTouchEnd"
    >
      <div class="project-overlay__scrim" aria-hidden="true" />
      <div class="project-overlay__shell glass-panel">
        <FilmStripHeader
          :project="activeProject"
          :panel-index="overlayStore.activePanelIndex"
          :total-panels="filmStripPanelCount"
          @close="closeOverlay"
          @previous="previousPanel"
          @next="nextPanel"
        />

        <FilmStrip
          :project="activeProject"
          :active-panel-index="overlayStore.activePanelIndex"
          @set-panel="overlayStore.setPanel"
        />
      </div>
    </section>
  </Transition>
</template>

<style scoped>
.project-overlay {
  position: fixed;
  inset: 0;
  z-index: 80;
  display: block;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: clamp(0.75rem, 2vw, 1.5rem);
  color: var(--ice);
}

/* The shell takes programmatic focus on open; suppress the ring only for that
   case, and keep a real, visible one for anything keyboard-driven. */
.project-overlay:focus:not(:focus-visible) {
  outline: none;
}

.project-overlay:focus-visible {
  outline: 2px solid var(--gold-glow);
  outline-offset: -3px;
}

.project-overlay__scrim {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 28% 12%, rgba(11, 182, 214, 0.12), transparent 36%),
    radial-gradient(circle at 78% 12%, rgba(232, 200, 106, 0.08), transparent 34%),
    rgba(0, 2, 5, 0.64);
  backdrop-filter: blur(10px) saturate(1.08);
}

.project-overlay__shell {
  position: relative;
  z-index: 1;
  display: grid;
  width: min(92rem, calc(100vw - 1.5rem));
  min-height: min(50rem, calc(100vh - 1.5rem));
  gap: 1rem;
  margin: 0 auto;
  padding: clamp(1rem, 2.2vw, 1.75rem);
}

.project-overlay-enter-active,
.project-overlay-leave-active {
  transition:
    opacity 260ms var(--ease-in-out),
    clip-path 320ms var(--ease-out-expo);
}

.project-overlay-enter-from,
.project-overlay-leave-to {
  opacity: 0;
  clip-path: inset(100% 0 0 0);
}

.project-overlay-enter-to,
.project-overlay-leave-from {
  opacity: 1;
  clip-path: inset(0 0 0 0);
}

@media (max-width: 720px) {
  .project-overlay {
    padding: 0.5rem;
  }

  .project-overlay__shell {
    min-height: calc(100vh - 1rem);
  }
}
</style>
