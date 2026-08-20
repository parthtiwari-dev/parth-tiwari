import { gsap } from 'gsap'
import { computed, nextTick, onMounted, onUnmounted, ref, watch, type Ref } from 'vue'
import { activeLoadTasks, loadComplete } from '@/data/loadSignals'

interface UseBootSequenceOptions {
  projectCount: Ref<number>
  rootEl: Ref<HTMLElement | null>
  lineEls: Ref<HTMLElement[]>
  skipEl: Ref<HTMLElement | null>
  onComplete: () => void
}

/**
 * The boot screen used to run on a stopwatch: 2200ms, then fade, regardless of
 * whether anything had loaded. Now it waits on the real signals in
 * `data/loadSignals.ts` and leaves the moment they settle.
 *
 * Two bounds remain, and neither is a measurement pretending to be one.
 * `MIN_VISIBLE_MS` stops a warm cache flashing the terminal for one frame,
 * which reads as a glitch rather than as a screen. `MAX_WAIT_MS` is a failsafe
 * in the same spirit as `index.html`'s reveal guard: a font that never resolves
 * must not trap the visitor behind a loading screen forever.
 */
const MIN_VISIBLE_MS = 450
/*
 * 3500ms, not 6000. Waiting on the *real* scene bundle is honest but it is not
 * free: throttled to 400kbps the boot held for 10 seconds, against the 2200ms
 * the fake timer used to take. The visitor this site is built for opens a DM
 * link on mobile data between meetings, and a loading screen is the one thing
 * they will not sit through. So the honest signals decide when to leave early,
 * and this decides when to stop waiting — the hero underneath is DOM and needs
 * no bundle to be worth reading.
 */
const MAX_WAIT_MS = 3500
const SKIP_REVEAL_DELAY_MS = 500
const FADE_DURATION_SECONDS = 0.3

/** Twelve cells, filled or not. No fractions, because none are measured. */
const BAR_CELLS = 12

function bar(done: boolean) {
  return done
    ? '█'.repeat(BAR_CELLS)
    : '░'.repeat(BAR_CELLS)
}

export function useBootSequence(options: UseBootSequenceOptions) {
  const showSkip = ref(false)
  const isComplete = ref(false)
  /**
   * Each line is a fact at the moment it renders. The systems count is a count,
   * not a load — it has no bar, because nothing about it is in progress.
   */
  const bootLines = computed(() => [
    ...activeLoadTasks.value.map((task) => (
      `> ${task.label.padEnd(14)} ${bar(task.done)} ${task.done ? 'ready' : 'loading'}`
    )),
    `> ${options.projectCount.value} systems indexed`,
  ])

  let timeline: gsap.core.Timeline | null = null
  let skipTimer: number | null = null
  let completeTimer: number | null = null
  let fadeFallbackTimer: number | null = null
  let maxWaitTimer: number | null = null
  let completeDispatched = false
  let stopWatchingLoad: (() => void) | null = null

  function clearTimers() {
    if (skipTimer !== null) {
      window.clearTimeout(skipTimer)
      skipTimer = null
    }

    if (completeTimer !== null) {
      window.clearTimeout(completeTimer)
      completeTimer = null
    }

    if (fadeFallbackTimer !== null) {
      window.clearTimeout(fadeFallbackTimer)
      fadeFallbackTimer = null
    }

    if (maxWaitTimer !== null) {
      window.clearTimeout(maxWaitTimer)
      maxWaitTimer = null
    }
  }

  function complete() {
    if (completeDispatched) {
      return
    }

    completeDispatched = true
    isComplete.value = true
    stopWatchingLoad?.()
    clearTimers()
    timeline?.kill()
    options.onComplete()
  }

  function fadeOut() {
    if (completeDispatched) {
      return
    }

    clearTimers()
    timeline?.kill()

    const root = options.rootEl.value

    if (!root) {
      complete()
      return
    }

    gsap.to(root, {
      autoAlpha: 0,
      duration: FADE_DURATION_SECONDS,
      ease: 'power2.out',
      onComplete: complete,
    })

    fadeFallbackTimer = window.setTimeout(complete, FADE_DURATION_SECONDS * 1000 + 80)
  }

  function skip() {
    fadeOut()
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      skip()
    }
  }

  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }

  onMounted(() => {
    if (prefersReducedMotion()) {
      complete()
      return
    }

    const root = options.rootEl.value

    if (root) {
      gsap.set(root, { autoAlpha: 1 })
    }

    gsap.set(options.lineEls.value, { autoAlpha: 0, y: 4 })

    timeline = gsap.timeline({ delay: 0.2 })
    timeline.to(options.lineEls.value, {
      autoAlpha: 1,
      y: 0,
      duration: 0.26,
      ease: 'power2.out',
      stagger: 0.2,
    })

    skipTimer = window.setTimeout(() => {
      showSkip.value = true

      void nextTick(() => {
        const skipButton = options.skipEl.value

        if (skipButton) {
          gsap.fromTo(
            skipButton,
            { autoAlpha: 0, y: 4 },
            { autoAlpha: 1, y: 0, duration: 0.2, ease: 'power2.out' },
          )
        }
      })
    }, SKIP_REVEAL_DELAY_MS)

    const mountedAt = performance.now()

    function leaveWhenLoaded() {
      if (!loadComplete.value) return
      const held = performance.now() - mountedAt
      if (held >= MIN_VISIBLE_MS) {
        fadeOut()
        return
      }
      if (completeTimer !== null) window.clearTimeout(completeTimer)
      completeTimer = window.setTimeout(fadeOut, MIN_VISIBLE_MS - held)
    }

    stopWatchingLoad = watch(loadComplete, leaveWhenLoaded, { immediate: true })

    // Failsafe only: whichever comes first, this or the real signals.
    maxWaitTimer = window.setTimeout(fadeOut, MAX_WAIT_MS)
    window.addEventListener('keydown', handleKeydown)
  })

  onUnmounted(() => {
    clearTimers()
    stopWatchingLoad?.()
    timeline?.kill()
    window.removeEventListener('keydown', handleKeydown)
  })

  return {
    bootLines,
    isComplete,
    showSkip,
    skip,
  }
}
