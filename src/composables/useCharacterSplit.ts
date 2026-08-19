import { onUnmounted, ref } from 'vue'
import { gsap } from 'gsap'

/**
 * Reveals `text` one character at a time, over a fixed wall-clock duration
 * (PLAN.md 8.11).
 *
 * **Why this is time-derived and not a timer chain.** It used to be
 * `setTimeout(tick, msPerChar)` re-arming itself after each character, which
 * makes the total duration a function of how often the browser is willing to
 * run a timer rather than of `msPerChar`. Measured on the hero tagline — 83
 * characters at `msPerChar: 8`, so 664ms of intent — the real rate was about
 * **one character every 700ms**, a shade under a minute to finish the sentence
 * that states what the entire site is about. Timers are the lowest-priority
 * thing on the event loop and this page runs a WebGL scene on the frame budget
 * ahead of them, so on any device where a frame is slow the chain simply stops
 * advancing. The CI runner has no GPU, which is what surfaced it, but a low-end
 * phone is the same machine.
 *
 * Deriving the index from elapsed time fixes the class of bug, not the
 * instance: a slow device now skips several characters in one step and still
 * finishes on schedule, which is what "reveals over 664ms" was always supposed
 * to mean.
 *
 * `msPerChar` is kept as the parameter because it is the useful thing to think
 * in — it just multiplies out to a duration now instead of being a sleep. Zero
 * means instant, which `AboutSignal` relies on.
 *
 * The clock is `gsap.ticker`, which already steps Lenis, ScrollTrigger and the
 * DOM projectors. A bare `requestAnimationFrame` here would be a third clock
 * and would keep running while the scene is paused (CLAUDE.md, Performance).
 */
export function useCharacterSplit(
  text: string,
  msPerChar: number,
  onComplete?: () => void,
) {
  const displayed = ref('')
  const durationMs = text.length * msPerChar

  let startedAt = 0
  let ticking = false
  let notified = false

  function stopTicking() {
    if (!ticking) return
    gsap.ticker.remove(tick)
    ticking = false
  }

  function finish() {
    displayed.value = text
    stopTicking()
    if (notified) return
    notified = true
    onComplete?.()
  }

  function complete() {
    finish()
  }

  function tick() {
    const elapsed = performance.now() - startedAt

    if (durationMs <= 0 || elapsed >= durationMs) {
      finish()
      return
    }

    // `ceil` rather than `floor`: the first visible frame should already carry a
    // character, otherwise the reveal opens on an empty line with a cursor.
    const count = Math.min(text.length, Math.ceil((elapsed / durationMs) * text.length))
    const next = text.slice(0, count)

    // Vue would re-render on every assignment even when the slice is unchanged,
    // and at 120Hz most frames produce the same slice.
    if (next !== displayed.value) displayed.value = next
  }

  function start() {
    stopTicking()
    notified = false

    if (
      typeof window !== 'undefined'
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      finish()
      return
    }

    if (durationMs <= 0) {
      finish()
      return
    }

    displayed.value = ''
    startedAt = performance.now()
    gsap.ticker.add(tick)
    ticking = true
  }

  onUnmounted(stopTicking)

  return {
    displayed,
    start,
    complete,
  }
}
