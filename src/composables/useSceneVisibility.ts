import { onMounted, onUnmounted, ref, type Ref } from 'vue'

/**
 * Is the scene actually worth rendering right now? (PLAN.md 2.1)
 *
 * `ScenePauseController` already stopped the TresJS loop while an overlay was
 * open, but nothing stopped it when the section had scrolled out of view or the
 * tab was in the background. The scene is 10,000 particles, a sky shader at 63
 * noise evaluations per fragment, ten dynamic lights and a bloom pass — it was
 * running all of that to paint pixels nobody was looking at, four viewport
 * heights up the page or on a hidden tab.
 *
 * Two signals, both cheap and both event-driven, so this adds no polling:
 *
 * - `IntersectionObserver` on the sticky viewport. A generous `rootMargin`
 *   resumes slightly before the section scrolls back in, so the first visible
 *   frame is already correct rather than a stale one.
 * - `visibilitychange`, which covers tab switches and, on mobile, the browser
 *   being backgrounded — the case that actually drains a phone.
 */
export function useSceneVisibility(target: Ref<HTMLElement | null>): Ref<boolean> {
  // Start visible. A scene that has not been observed yet must render, or the
  // first paint is blank while the observer's initial callback is pending.
  const isVisible = ref(true)

  let observer: IntersectionObserver | null = null
  let onVisibilityChange: (() => void) | null = null
  let intersecting = true
  let documentVisible = true

  function sync() {
    isVisible.value = intersecting && documentVisible
  }

  onMounted(() => {
    if (typeof window === 'undefined') return

    documentVisible = document.visibilityState !== 'hidden'
    onVisibilityChange = () => {
      documentVisible = document.visibilityState !== 'hidden'
      sync()
    }
    document.addEventListener('visibilitychange', onVisibilityChange)

    if (target.value && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0]
          if (!entry) return
          intersecting = entry.isIntersecting
          sync()
        },
        // Resume a little before it is on screen; a threshold of 0 means any
        // sliver counts, which is what we want for a full-bleed backdrop.
        { rootMargin: '200px 0px', threshold: 0 },
      )
      observer.observe(target.value)
    }

    sync()
  })

  onUnmounted(() => {
    observer?.disconnect()
    observer = null
    if (onVisibilityChange) {
      document.removeEventListener('visibilitychange', onVisibilityChange)
      onVisibilityChange = null
    }
  })

  return isVisible
}
