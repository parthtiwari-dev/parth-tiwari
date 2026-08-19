<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useEvidenceOverlayStore } from '@/stores/evidenceOverlayStore'
import { useOverlayStore } from '@/stores/overlayStore'

type CursorState = 'default' | 'enter' | 'refuse'

const overlayStore = useOverlayStore()
const evidenceOverlayStore = useEvidenceOverlayStore()

const cursorEl = ref<HTMLElement | null>(null)
const state = ref<CursorState>('default')
const isVisible = ref(false)
const isEnabled = ref(false)

const position = {
  x: -100,
  y: -100,
}

let frameId = 0
let pointerQuery: MediaQueryList | null = null
let motionQuery: MediaQueryList | null = null
let sceneIntent: CursorState | null = null

const cursorLabel = computed(() => {
  if (state.value === 'enter') {
    return 'ENTER'
  }

  return ''
})

const cursorGlyph = computed(() => {
  if (state.value === 'refuse') {
    return '⊘'
  }

  return '+'
})

function isDisabledTarget(element: Element | null) {
  if (!element) {
    return false
  }

  if (element.matches('button:disabled, input:disabled, textarea:disabled, select:disabled')) {
    return true
  }

  return element.closest('[aria-disabled="true"]') !== null
}

function getCursorState(target: EventTarget | null): CursorState {
  if (!(target instanceof Element) || isDisabledTarget(target)) {
    return sceneIntent ?? 'default'
  }

  if (target.closest('.cursor-refuse')) {
    return 'refuse'
  }

  if (
    target.closest(
      '.cursor-enter, a[href], button:not(:disabled), [role="button"], input:not(:disabled), textarea:not(:disabled), select:not(:disabled)',
    )
  ) {
    return 'enter'
  }

  return sceneIntent ?? 'default'
}

function applyPosition() {
  cursorEl.value?.style.setProperty('--cursor-x', `${position.x}px`)
  cursorEl.value?.style.setProperty('--cursor-y', `${position.y}px`)
  frameId = 0
}

function schedulePositionUpdate() {
  if (frameId) {
    return
  }

  frameId = requestAnimationFrame(applyPosition)
}

function handlePointerMove(event: PointerEvent) {
  if (!isEnabled.value || event.pointerType !== 'mouse') {
    return
  }

  position.x = event.clientX
  position.y = event.clientY
  state.value = getCursorState(event.target)
  isVisible.value = true
  schedulePositionUpdate()
}

function hideCursor() {
  isVisible.value = false
  state.value = 'default'
  sceneIntent = null
}

function handleCursorIntent(event: Event) {
  const nextState = event instanceof CustomEvent ? event.detail?.state : null

  sceneIntent = nextState === 'enter' || nextState === 'refuse' ? nextState : null
}

/**
 * What is under the pointer can change without the pointer moving.
 *
 * The state is only ever recomputed from a `pointermove` target, so opening a
 * project — which happens on click, with the pointer perfectly still — left the
 * cursor reading ENTER over the panel's body copy, and it was *still* reading
 * ENTER after the panel closed and the star it referred to was gone.
 *
 * It resets rather than re-derives, and that is deliberate. Re-resolving with
 * `elementFromPoint` was tried first and reports the *old* DOM twice over: the
 * watcher is pre-flush, and the overlay leaves through a `<Transition>`, so its
 * close button is still under the pointer and still returns `enter` well after
 * the overlay is logically gone. A cursor that makes no claim until the pointer
 * moves is correct; one that confidently names something that is no longer
 * there is not.
 */
watch(
  () => overlayStore.isOpen || evidenceOverlayStore.isOpen,
  () => {
    // Whatever the scene last reported is about a star behind a panel, or one
    // the pointer is no longer anywhere near.
    sceneIntent = null
    state.value = 'default'
  },
)

function updateEnabledState() {
  const hasFinePointer = pointerQuery?.matches ?? false
  const allowsMotion = motionQuery?.matches ?? false

  isEnabled.value = hasFinePointer && allowsMotion

  if (!isEnabled.value) {
    hideCursor()
  }
}

onMounted(() => {
  pointerQuery = window.matchMedia('(hover: hover) and (pointer: fine)')
  motionQuery = window.matchMedia('(prefers-reduced-motion: no-preference)')
  updateEnabledState()

  window.addEventListener('pointermove', handlePointerMove, { passive: true })
  window.addEventListener('pointerleave', hideCursor)
  window.addEventListener('blur', hideCursor)
  window.addEventListener('evidence-cursor-intent', handleCursorIntent)
  pointerQuery.addEventListener('change', updateEnabledState)
  motionQuery.addEventListener('change', updateEnabledState)
})

onUnmounted(() => {
  window.removeEventListener('pointermove', handlePointerMove)
  window.removeEventListener('pointerleave', hideCursor)
  window.removeEventListener('blur', hideCursor)
  window.removeEventListener('evidence-cursor-intent', handleCursorIntent)
  pointerQuery?.removeEventListener('change', updateEnabledState)
  motionQuery?.removeEventListener('change', updateEnabledState)

  if (frameId) {
    cancelAnimationFrame(frameId)
  }
})
</script>

<template>
  <div
    v-show="isEnabled"
    id="custom-cursor"
    ref="cursorEl"
    aria-hidden="true"
    :class="[
      `is-${state}`,
      { 'is-visible': isVisible },
    ]"
  >
    <span class="custom-cursor__glyph">{{ cursorGlyph }}</span>
    <span v-if="cursorLabel" class="custom-cursor__label">{{ cursorLabel }}</span>
  </div>
</template>
