import { onUnmounted, watch, type Ref } from 'vue'

/**
 * One Escape listener, LIFO. The most recently opened surface handles the key
 * and nothing below it sees the event (PLAN.md 2.9).
 *
 * Before this there were five independent `keydown` listeners each checking for
 * Escape — the project overlay, the evidence overlay, the mobile menu, the
 * project-index drawer, and the boot sequence. With more than one surface open,
 * Escape closed all of them at once, and which "all" meant depended on mount
 * order rather than on what the user was looking at. Escape should dismiss the
 * thing on top, once.
 *
 * The boot sequence deliberately does not use this: it runs before any surface
 * can be open, and its Escape means "skip", not "dismiss".
 */

type EscapeHandler = () => void

const stack: EscapeHandler[] = []
let listening = false

function onKeydown(event: KeyboardEvent) {
  if (event.key !== 'Escape') return

  const top = stack[stack.length - 1]
  if (!top) return

  // stopPropagation matters as much as the LIFO order: any listener still
  // attached elsewhere must not also fire for this press.
  event.preventDefault()
  event.stopPropagation()
  top()
}

function startListening() {
  if (listening || typeof window === 'undefined') return
  // Capture phase, so this runs before component-level listeners that have not
  // been migrated yet.
  window.addEventListener('keydown', onKeydown, true)
  listening = true
}

function stopListening() {
  if (!listening || typeof window === 'undefined') return
  window.removeEventListener('keydown', onKeydown, true)
  listening = false
}

function push(handler: EscapeHandler) {
  const existing = stack.indexOf(handler)
  if (existing !== -1) stack.splice(existing, 1)
  stack.push(handler)
  startListening()
}

function pop(handler: EscapeHandler) {
  const index = stack.indexOf(handler)
  if (index !== -1) stack.splice(index, 1)
  if (stack.length === 0) stopListening()
}

/**
 * Registers `handler` as the Escape target for as long as `isOpen` is true.
 *
 * Pass a stable function reference — an inline arrow recreated each render
 * would register a new entry and leak the old one.
 */
export function useEscapeStack(isOpen: Ref<boolean>, handler: EscapeHandler): void {
  watch(
    isOpen,
    (open) => {
      if (open) push(handler)
      else pop(handler)
    },
    { immediate: true },
  )

  onUnmounted(() => pop(handler))
}

/** Test seam. Not used in application code. */
export function __escapeStackDepth(): number {
  return stack.length
}
