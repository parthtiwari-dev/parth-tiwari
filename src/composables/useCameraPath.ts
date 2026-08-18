import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/**
 * Scroll → a number. Nothing else (PLAN.md 2.2).
 *
 * This used to own the camera: GSAP's `onUpdate` wrote position and look-at
 * directly, which meant the camera moved on the scroll event's schedule rather
 * than the renderer's. Two clocks writing the same transform — a scroll burst
 * could move the camera several times between two painted frames, and a paused
 * render loop still paid for the work.
 *
 * Now this only advances `scrollProgress`, a plain mutable object that is
 * deliberately not reactive: it changes every scroll tick, and pushing that
 * through Vue's reactivity would schedule a component update per tick for a
 * value only the render loop reads. `CameraPathController` samples it once per
 * frame (`docs/PLAN.md` 2.1).
 */

export interface ScrollProgress {
  value: number
}

export function createScrollProgress(): ScrollProgress {
  return { value: 0 }
}

/**
 * Binds `progress.value` to scroll through `#constellation-section`.
 * Returns a cleanup function.
 */
export function useCameraPath(progress: ScrollProgress): () => void {
  if (typeof window === 'undefined') return () => {}

  const tween = gsap.to(progress, {
    value: 1,
    ease: 'none',
    scrollTrigger: {
      trigger: '#constellation-section',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1.5,
    },
  })

  // The runway is sized in pixels after mount (2.7), so ScrollTrigger's cached
  // start/end are stale until it re-measures.
  const refreshFrame = requestAnimationFrame(() => ScrollTrigger.refresh())

  return () => {
    cancelAnimationFrame(refreshFrame)
    tween.scrollTrigger?.kill()
    tween.kill()
  }
}
