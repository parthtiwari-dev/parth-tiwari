import { onMounted, onUnmounted, ref, type Ref } from 'vue'

/**
 * A scroll runway measured in pixels, resolved once and held stable across the
 * viewport resizes that mobile browser chrome causes (PLAN.md 2.7).
 *
 * The constellation section is the scroll track the camera path is scrubbed
 * against. Expressed as `400vh` it moved every time a phone's address bar hid
 * or reappeared: `vh` resolves against the *large* viewport, so the track
 * silently changed length mid-scroll and ScrollTrigger's `end: 'bottom bottom'`
 * moved with it. The symptom is the page jumping under your thumb while you
 * scroll — on the exact device this site's buyer arrives on.
 *
 * Pixels fix the unit. The threshold fixes the rest: a chrome show/hide is a
 * height change of roughly 60–120px with the width unchanged, and that must not
 * re-measure. A rotation or a real window resize changes width, or height by far
 * more, and should.
 */

/** Height deltas below this, with width unchanged, are browser chrome. */
const CHROME_DELTA_PX = 160

export function useScrollRunway(multiplier: number): Ref<string> {
  const height = ref('')

  let lastWidth = 0
  let lastHeight = 0

  function measure() {
    if (typeof window === 'undefined') return
    lastWidth = window.innerWidth
    lastHeight = window.innerHeight
    height.value = `${Math.round(lastHeight * multiplier)}px`
  }

  function onResize() {
    const widthChanged = window.innerWidth !== lastWidth
    const heightDelta = Math.abs(window.innerHeight - lastHeight)
    if (!widthChanged && heightDelta < CHROME_DELTA_PX) return
    measure()
  }

  onMounted(() => {
    measure()
    window.addEventListener('resize', onResize, { passive: true })
    window.addEventListener('orientationchange', measure)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', onResize)
    window.removeEventListener('orientationchange', measure)
  })

  return height
}
