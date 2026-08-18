import { onMounted, onUnmounted, type Ref } from 'vue'

/**
 * Magnetic controls (PLAN.md 6.12).
 *
 * A control that leans very slightly toward the cursor as it approaches reads as
 * responsive before it has been touched. The whole effect is a few pixels — past
 * about six it stops feeling like attention and starts feeling like the button
 * is running away from the pointer, which is worse than nothing.
 *
 * Three constraints, all of which the naive version gets wrong:
 *
 * - **Fine pointers only.** On touch there is no hover, so the transform would
 *   only ever apply at the moment of the tap — a control that jumps as you press
 *   it, which is the one thing a button must never do.
 * - **Reduced motion opts out entirely.** This is unrequested movement.
 * - **The listener is on `window`, not the element.** The point is to react
 *   *before* the pointer arrives; a listener on the element itself cannot fire
 *   until the pointer is already inside it.
 */

export interface MagneticOptions {
  /** How far away the pull starts, in pixels beyond the element's own box. */
  radius?: number
  /** Maximum displacement, in pixels. */
  strength?: number
}

export function useMagnetic(
  target: Ref<HTMLElement | null>,
  options: MagneticOptions = {},
): void {
  const radius = options.radius ?? 90
  const strength = options.strength ?? 5

  let enabled = false

  function onPointerMove(event: PointerEvent) {
    const element = target.value
    if (!element || !enabled) return

    const rect = element.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = event.clientX - cx
    const dy = event.clientY - cy
    const distance = Math.hypot(dx, dy)

    // Measured from the element's edge, not its centre, so a wide button and a
    // small one both start pulling at the same gap.
    const reach = Math.max(rect.width, rect.height) / 2 + radius
    if (distance > reach) {
      element.style.transform = ''
      return
    }

    const pull = 1 - distance / reach
    element.style.transform =
      `translate(${(dx / reach) * strength * pull * 2}px, ${(dy / reach) * strength * pull * 2}px)`
  }

  onMounted(() => {
    if (typeof window === 'undefined') return
    enabled = window.matchMedia('(hover: hover) and (pointer: fine)').matches
      && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!enabled) return
    window.addEventListener('pointermove', onPointerMove, { passive: true })
  })

  onUnmounted(() => {
    window.removeEventListener('pointermove', onPointerMove)
    if (target.value) target.value.style.transform = ''
  })
}
