<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { lockBodyScroll, unlockBodyScroll } from '@/composables/useBodyScrollLock'
import { useEscapeStack } from '@/composables/useEscapeStack'
import { useFocusTrap } from '@/composables/useFocusTrap'
import FilmStrip from '@/components/overlay/FilmStrip.vue'
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

  if (!projectId) {
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

/**
 * Panel advance on wheel — but only once the panel itself has nothing left to
 * show.
 *
 * `data-lenis-prevent` on the root is what makes the early return below mean
 * anything. Lenis binds `wheel` on `window` with `allowNestedScroll: false`, so
 * after this handler politely steps aside to let the browser scroll the
 * overlay, Lenis called `preventDefault()` further up the chain and applied the
 * delta to the page — which is scroll-locked while the overlay is open. The
 * result was an overlay with 275px of content below the fold on desktop and
 * up to 1146px on a phone, and a wheel that moved it exactly 0px. Measured, not
 * inferred: one notch moves 0px without the attribute and 100px with it.
 *
 * Touch was never affected, because Lenis runs `syncTouch: false` and returns
 * without cancelling for touch events. That asymmetry is why the bug read as
 * "the phone is fine and the desktop is broken".
 */
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
      data-lenis-prevent
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
          :total-panels="overlayStore.panelCount"
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

/**
 * The scrim, and why it stopped destroying the glass (PLAN.md 8.7).
 *
 * `.glass-panel` asks for `backdrop-filter: blur(22px) saturate(1.55)`, and it
 * was producing nothing, because this element sat underneath it at 0.64 alpha
 * with a `blur(10px)` of its own. By the time the panel's filter sampled the
 * page, the scene behind had already been flattened to a near-uniform dark
 * field — and blurring something uniform returns the same uniform thing. The
 * panel read as a dark rectangle because that is all it had to work with.
 *
 * So the scrim gives up its own blur entirely and drops to 0.38, which leaves
 * the starfield sharp and structured directly behind the panel. The panel's
 * blur then has real high-frequency detail to bend, which is the only thing
 * that has ever made a glass surface read as glass. Air's reference in the set
 * makes the same point from the other side: its glass feel comes from the
 * photograph behind the surface, not from the filter on it.
 *
 * Text contrast is not carried by this layer — `.glass-panel` has its own
 * background stack — and `npm run a11y` computes the real composited ratio for
 * every visible text node, so a regression here fails a gate rather than
 * shipping.
 */
.project-overlay__scrim {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 28% 12%, rgba(11, 182, 214, 0.10), transparent 40%),
    radial-gradient(circle at 78% 8%, rgba(232, 200, 106, 0.07), transparent 38%),
    radial-gradient(ellipse at 50% 50%, rgba(0, 0, 0, 0.30), rgba(0, 0, 0, 0.58) 78%);
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
