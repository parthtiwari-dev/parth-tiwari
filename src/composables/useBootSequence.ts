import { gsap } from 'gsap'
import { computed, nextTick, onMounted, onUnmounted, ref, type Ref } from 'vue'

interface UseBootSequenceOptions {
  projectCount: Ref<number>
  rootEl: Ref<HTMLElement | null>
  lineEls: Ref<HTMLElement[]>
  skipEl: Ref<HTMLElement | null>
  onComplete: () => void
}

const AUTO_FADE_DELAY_MS = 2200
const SKIP_REVEAL_DELAY_MS = 500
const FADE_DURATION_SECONDS = 0.3

export function useBootSequence(options: UseBootSequenceOptions) {
  const showSkip = ref(false)
  const isComplete = ref(false)
  const bootLines = computed(() => [
    '> initializing evidence field...    ████████░░  80%',
    `> loading ${options.projectCount.value} systems...              ████████████ 100%`,
    '> all gates standing by',
  ])

  let timeline: gsap.core.Timeline | null = null
  let skipTimer: number | null = null
  let completeTimer: number | null = null
  let completeDispatched = false

  function clearTimers() {
    if (skipTimer !== null) {
      window.clearTimeout(skipTimer)
      skipTimer = null
    }

    if (completeTimer !== null) {
      window.clearTimeout(completeTimer)
      completeTimer = null
    }
  }

  function complete() {
    if (completeDispatched) {
      return
    }

    completeDispatched = true
    isComplete.value = true
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

    completeTimer = window.setTimeout(fadeOut, AUTO_FADE_DELAY_MS)
    window.addEventListener('keydown', handleKeydown)
  })

  onUnmounted(() => {
    clearTimers()
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
