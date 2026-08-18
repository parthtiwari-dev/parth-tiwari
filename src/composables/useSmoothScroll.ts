import { onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

/**
 * Smooth scroll, driven by GSAP's ticker rather than its own loop
 * (PLAN.md 2.3, and it closes part of 2.1).
 *
 * The reason to adopt Lenis here is not the easing. It is that the camera is
 * scrubbed against scroll position, and native scroll on Windows arrives in
 * coarse wheel jumps — roughly 100px steps. The camera therefore moved in the
 * same steps, and `scrub: 1.5` was doing the work of hiding that. Interpolated
 * scroll gives the scrub a continuous input, so the smoothing can come down and
 * the camera stops lagging behind the page.
 *
 * The clock detail matters as much: Lenis is stepped from `gsap.ticker` instead
 * of running `requestAnimationFrame` itself, so scroll interpolation, the tween
 * and ScrollTrigger all advance on one clock. Left alone it would have added a
 * fourth.
 *
 * `lagSmoothing(0)` is required, not stylistic. GSAP's default lag smoothing
 * fabricates a time jump after a slow frame, which desynchronises Lenis's
 * interpolation from the tween reading it.
 */
export function useSmoothScroll(): void {
  let lenis: Lenis | null = null
  let tick: ((time: number) => void) | null = null

  onMounted(() => {
    if (typeof window === 'undefined') return

    // Someone who asked for reduced motion did not ask for scroll inertia.
    // Native scroll is the honest fallback, and ScrollTrigger works with it.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    lenis = new Lenis({
      // Slightly quicker than the default: this page is a 4-viewport runway and
      // a long ramp makes it feel heavy rather than smooth.
      duration: 0.9,
      // Touch devices already interpolate their own scroll in the compositor.
      // Layering Lenis on top produces a floaty double-smoothing.
      syncTouch: false,
      smoothWheel: true,
    })

    lenis.on('scroll', ScrollTrigger.update)

    tick = (time: number) => {
      // gsap.ticker reports seconds; Lenis expects milliseconds.
      lenis?.raf(time * 1000)
    }
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
  })

  onUnmounted(() => {
    if (tick) {
      gsap.ticker.remove(tick)
      tick = null
    }
    gsap.ticker.lagSmoothing(500, 33)
    lenis?.destroy()
    lenis = null
  })
}
