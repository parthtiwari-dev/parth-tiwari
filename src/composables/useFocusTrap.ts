import { nextTick, onScopeDispose, ref, type Ref } from 'vue'

/**
 * Focus management for modal surfaces.
 *
 * Given a template ref to a dialog container this moves focus in on activate,
 * keeps Tab / Shift+Tab cycling inside the container while active, and restores
 * focus to whatever was focused before activation on deactivate.
 *
 * Written against `docs/AUDIT.md` H3: four surfaces declare `role="dialog"`
 * and `aria-modal="true"` while Tab walks straight into the page behind the
 * scrim, and focus is never returned to the trigger.
 */

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'area[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'iframe',
  'audio[controls]',
  'video[controls]',
  'details > summary:first-of-type',
  '[contenteditable]:not([contenteditable="false"])',
  '[tabindex]:not([tabindex^="-"])',
].join(',')

export interface FocusTrapOptions {
  /**
   * Element to focus when the trap activates. Defaults to the container itself
   * when it is programmatically focusable, otherwise the first focusable
   * descendant.
   */
  initialFocus?: () => HTMLElement | null | undefined
  /** Restore focus to the previously focused element on deactivate. Default true. */
  restoreFocus?: boolean
  /**
   * Where focus should land when the element that opened this surface is no
   * longer in the document. Evaluated at deactivate time, not at activate time,
   * so it can name something that did not exist when the dialog opened.
   */
  restoreFallback?: () => HTMLElement | null
}

export function useFocusTrap(
  container: Ref<HTMLElement | null>,
  options: FocusTrapOptions = {},
) {
  const { initialFocus, restoreFocus = true } = options
  const isActive = ref(false)
  let previouslyFocused: HTMLElement | null = null

  function isRendered(element: HTMLElement) {
    return element.getClientRects().length > 0
  }

  function getFocusable(): HTMLElement[] {
    const root = container.value

    if (!root) {
      return []
    }

    return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
      .filter((element) => (
        !element.hasAttribute('disabled')
        && element.getAttribute('aria-hidden') !== 'true'
        && isRendered(element)
      ))
  }

  /**
   * The empty-focusable case: a dialog whose body is pure text still has to
   * hold focus, so the container itself becomes the fallback stop.
   */
  function makeContainerFocusable() {
    const root = container.value

    if (root && !root.hasAttribute('tabindex')) {
      root.setAttribute('tabindex', '-1')
    }
  }

  function focusInitial() {
    const root = container.value

    if (!root) {
      return
    }

    const requested = initialFocus?.()

    if (requested && root.contains(requested)) {
      requested.focus()
      return
    }

    if (root.hasAttribute('tabindex')) {
      root.focus()
      return
    }

    const focusable = getFocusable()

    if (focusable.length > 0) {
      focusable[0]?.focus()
      return
    }

    makeContainerFocusable()
    root.focus()
  }

  function handleKeydown(event: KeyboardEvent) {
    if (!isActive.value || event.key !== 'Tab' || event.altKey || event.ctrlKey || event.metaKey) {
      return
    }

    const root = container.value

    if (!root) {
      return
    }

    const focusable = getFocusable()
    const active = document.activeElement as HTMLElement | null

    if (focusable.length === 0) {
      event.preventDefault()
      makeContainerFocusable()
      root.focus()
      return
    }

    const first = focusable[0] as HTMLElement
    const last = focusable[focusable.length - 1] as HTMLElement

    if (!active || !root.contains(active)) {
      event.preventDefault()
      ;(event.shiftKey ? last : first).focus()
      return
    }

    if (event.shiftKey && (active === first || active === root)) {
      event.preventDefault()
      last.focus()
      return
    }

    if (!event.shiftKey && active === last) {
      event.preventDefault()
      first.focus()
    }
  }

  /**
   * Backstop for focus that arrives from outside the keydown path — programmatic
   * `.focus()` calls, or a click landing on background content still painted
   * behind the scrim.
   */
  function handleFocusIn(event: FocusEvent) {
    if (!isActive.value) {
      return
    }

    const root = container.value
    const target = event.target as Node | null

    if (!root || (target && root.contains(target))) {
      return
    }

    const focusable = getFocusable()

    if (focusable.length > 0) {
      focusable[0]?.focus()
      return
    }

    makeContainerFocusable()
    root.focus()
  }

  async function activate() {
    if (isActive.value) {
      return
    }

    const active = document.activeElement

    previouslyFocused = active instanceof HTMLElement && active !== document.body
      ? active
      : null

    isActive.value = true
    document.addEventListener('keydown', handleKeydown, true)
    document.addEventListener('focusin', handleFocusIn, true)

    await nextTick()

    if (isActive.value) {
      focusInitial()
    }
  }

  function deactivate() {
    if (!isActive.value) {
      return
    }

    isActive.value = false
    document.removeEventListener('keydown', handleKeydown, true)
    document.removeEventListener('focusin', handleFocusIn, true)

    const target = previouslyFocused
    previouslyFocused = null

    if (!restoreFocus) {
      return
    }

    if (target?.isConnected && typeof target.focus === 'function') {
      target.focus()
      return
    }

    /*
     * The trigger can be gone by the time we come back (PLAN.md 8.16).
     *
     * `restoreFocus` assumed the element that opened the dialog would still be
     * in the document when it closed, and for the project overlay that is
     * routinely false: choosing a project from the index rail *collapses the
     * rail*, so the button that was focused has been unmounted before the
     * overlay even finishes opening. Restoring to a detached node is a no-op,
     * which drops focus to `<body>` and strands a keyboard user at the top of
     * the document with no idea where they were.
     *
     * The fallback is the closest still-present ancestor-ish anchor: whatever
     * the caller nominates as the surface that owned the trigger. It is not a
     * perfect restoration — nothing can be, once the element is gone — but
     * landing on the control that opens that list again is the nearest true
     * thing, and it is enormously better than `<body>`.
     */
    const fallback = options.restoreFallback?.()
    if (fallback?.isConnected && typeof fallback.focus === 'function') {
      fallback.focus()
    }
  }

  onScopeDispose(() => {
    deactivate()
  })

  return {
    isActive,
    activate,
    deactivate,
    getFocusable,
  }
}
