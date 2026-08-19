/**
 * Where the DOM chrome currently is, in viewport pixels (PLAN.md 8.12).
 *
 * The label layer projects stars into screen space and the hero is
 * `position: fixed` on top of it, so the two lay out in the same coordinate
 * system and neither knew about the other. On a 390px phone that showed as
 * "QueryPilot", "UPI Fraud Engine" and "Tathya" printed straight through
 * "PARTH TIWARI" and the thesis line — two sets of words in the same pixels,
 * on the first frame anybody sees.
 *
 * The legend does the same thing at the other end of the scroll: the reveal
 * frame is the composition's climax and "Tathya" was rendering underneath the
 * constellation index.
 *
 * Suppressing labels globally while chrome is up would be the easy fix and the
 * wrong one: the stars *are* the invitation to explore, and hiding their names
 * removes the reason to. So each surface publishes its box, the projector
 * demotes only the labels that actually overlap one, and everything clear of
 * them keeps its name.
 *
 * Deliberately a plain module rather than a store, for the same reason
 * `sceneRig` and the orbit state are: it is read once per frame from a ticker
 * callback and reactivity would buy nothing but overhead.
 */

export interface ScreenRegion {
  left: number
  top: number
  right: number
  bottom: number
  /** 0 when the hero has faded out; the projector ignores the box below ~0.1. */
  opacity: number
}

const regions = new Map<string, ScreenRegion>()

/**
 * Keyed, because there is more than one obstacle and they appear and disappear
 * independently. The hero fades on scroll; the legend is desktop-only and hides
 * behind the About overlay; the scale readout is always there.
 */
export function registerScreenRegion(key: string, next: ScreenRegion | null): void {
  if (next) regions.set(key, next)
  else regions.delete(key)
}

/**
 * True when a label anchored here would land any of its text on visible chrome.
 *
 * **The extent matters, not the anchor.** The first version tested the anchor
 * point with 12px of padding, and "Tathya" still rendered underneath the
 * constellation index: its star sat 25px to the *left* of the panel — outside
 * the box, so no overlap — while the name it draws to the right ran 90px
 * straight into it. A label is a run of text beside a point, so the test has to
 * be the run.
 *
 * `reach` is how far the text extends in its drawing direction, and `flipped`
 * says which direction that is. Both come from the projector, which is the only
 * thing that knows whether this label flipped to clear the right edge.
 */
export function overlapsChrome(
  x: number,
  y: number,
  reach = 0,
  flipped = false,
): boolean {
  const left = flipped ? x - reach : x
  const right = flipped ? x : x + reach
  const padding = 12

  for (const region of regions.values()) {
    if (region.opacity < 0.1) continue
    if (
      right >= region.left - padding
      && left <= region.right + padding
      && y >= region.top - padding
      && y <= region.bottom + padding
    ) return true
  }
  return false
}
