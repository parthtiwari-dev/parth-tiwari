<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { lockBodyScroll, unlockBodyScroll } from '@/composables/useBodyScrollLock'
import { useEscapeStack } from '@/composables/useEscapeStack'
import { useFocusTrap } from '@/composables/useFocusTrap'
import { isResumeConfigured } from '@/data/resume'
import { useEvidenceOverlayStore } from '@/stores/evidenceOverlayStore'
import { useProjectStore } from '@/stores/projectStore'
import type { EvidenceOverlayKind } from '@/stores/evidenceOverlayStore'

const MOBILE_QUERY = '(max-width: 820px)'

interface TopBarAction {
  label: string
  kind?: EvidenceOverlayKind
  disabled?: boolean
}

const evidenceOverlayStore = useEvidenceOverlayStore()
const projectStore = useProjectStore()
const scrollY = ref(0)
const revealThreshold = ref(220)
const isMobileViewport = ref(false)
const isMobileMenuOpen = ref(false)
const drawerRoot = ref<HTMLElement | null>(null)
// The drawer declares role="dialog" aria-modal="true"; the trap and the scroll
// lock are what make that declaration honest (docs/AUDIT.md H3).
const drawerFocusTrap = useFocusTrap(drawerRoot)
let mobileMediaQuery: MediaQueryList | null = null
let hasScrollLock = false

const actions: TopBarAction[] = [
  { label: 'Experience', kind: 'experience' },
  { label: 'Training', kind: 'training' },
  { label: 'Capability', kind: 'capability' },
  { label: 'About', kind: 'about' },
]

const resumeAction: TopBarAction = {
  label: 'Resume',
  kind: 'resume',
  disabled: !isResumeConfigured,
}

const brandLine = computed(() => `EPHEMERIS / ${projectStore.projectCount} SYSTEMS`)

const mobileMenuLabel = computed(() => (
  isMobileMenuOpen.value ? 'Close evidence navigation' : 'Open evidence navigation'
))

const isVisible = computed(() => {
  if (scrollY.value <= revealThreshold.value) {
    return false
  }

  if (!evidenceOverlayStore.isOpen) {
    return true
  }

  return !isMobileViewport.value && evidenceOverlayStore.activeKind === 'about'
})

function updateScrollState() {
  // The scroll lock parks the body at `position: fixed`, which drives
  // `window.scrollY` to 0 and fires a scroll event. Reading it here would drop
  // `isVisible` below the reveal threshold and unmount the drawer the instant
  // it opened, so freeze the reading for as long as the page cannot scroll.
  if (isMobileMenuOpen.value) {
    return
  }

  revealThreshold.value = window.innerHeight * 0.58
  scrollY.value = window.scrollY
}

function syncMobileViewport() {
  isMobileViewport.value = window.matchMedia(MOBILE_QUERY).matches
}

function handleAction(action: TopBarAction) {
  if (!action.kind || action.disabled) {
    return
  }

  evidenceOverlayStore.open(action.kind)
  isMobileMenuOpen.value = false
}

function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

useEscapeStack(isMobileMenuOpen, () => closeMobileMenu())

function closeMobileMenu() {
  isMobileMenuOpen.value = false
}

function setBodyScrollLock(shouldLock: boolean) {
  if (shouldLock && !hasScrollLock) {
    lockBodyScroll()
    hasScrollLock = true
    return
  }

  if (!shouldLock && hasScrollLock) {
    unlockBodyScroll()
    hasScrollLock = false
  }
}

watch(isMobileMenuOpen, (isOpen) => {
  setBodyScrollLock(isOpen)

  if (isOpen) {
    void drawerFocusTrap.activate()
    return
  }

  drawerFocusTrap.deactivate()
})

// The bar itself unmounts on scroll and on overlay open. Tear the drawer down
// with it, or the trap and the scroll lock outlive their own DOM.
watch(isVisible, (visible) => {
  if (!visible) {
    closeMobileMenu()
  }
})

onMounted(() => {
  mobileMediaQuery = window.matchMedia(MOBILE_QUERY)
  syncMobileViewport()
  updateScrollState()
  mobileMediaQuery.addEventListener('change', syncMobileViewport)
  window.addEventListener('scroll', updateScrollState, { passive: true })
  window.addEventListener('resize', updateScrollState, { passive: true })
})

onUnmounted(() => {
  mobileMediaQuery?.removeEventListener('change', syncMobileViewport)
  window.removeEventListener('scroll', updateScrollState)
  window.removeEventListener('resize', updateScrollState)
  drawerFocusTrap.deactivate()
  setBodyScrollLock(false)
})
</script>

<template>
  <Transition name="evidence-top-bar">
    <nav
      v-if="isVisible"
      class="evidence-top-bar"
      aria-label="Evidence navigation"
    >
      <p class="evidence-top-bar__brand">
        {{ brandLine }}
      </p>

      <button
        type="button"
        class="evidence-top-bar__mobile-menu-button"
        :aria-expanded="isMobileMenuOpen"
        aria-controls="mobile-evidence-drawer"
        :aria-label="mobileMenuLabel"
        @click="toggleMobileMenu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <div class="evidence-top-bar__actions">
        <button
          v-for="action in actions"
          :key="action.label"
          type="button"
          :disabled="action.disabled"
          :aria-disabled="action.disabled ? 'true' : undefined"
          :class="{ 'is-active': evidenceOverlayStore.activeKind === action.kind }"
          @click="handleAction(action)"
        >
          {{ action.label }}
        </button>
      </div>

      <button
        type="button"
        class="evidence-top-bar__resume"
        :class="{ 'is-active': evidenceOverlayStore.activeKind === resumeAction.kind }"
        :disabled="resumeAction.disabled"
        :aria-disabled="resumeAction.disabled ? 'true' : undefined"
        @click="handleAction(resumeAction)"
      >
        {{ resumeAction.label }}
      </button>

      <Transition name="mobile-evidence-drawer">
        <div
          v-if="isMobileMenuOpen"
          ref="drawerRoot"
          class="mobile-evidence-drawer"
          role="dialog"
          aria-modal="true"
          aria-label="Evidence navigation menu"
          tabindex="-1"
        >
          <button
            type="button"
            class="mobile-evidence-drawer__scrim"
            aria-label="Close evidence navigation"
            @click="closeMobileMenu"
          ></button>

          <div id="mobile-evidence-drawer" class="mobile-evidence-drawer__panel">
            <div class="mobile-evidence-drawer__header">
              <p>Ephemeris</p>
              <button
                type="button"
                class="mobile-evidence-drawer__close"
                aria-label="Close evidence navigation"
                @click="closeMobileMenu"
              >
                <svg aria-hidden="true" viewBox="0 0 24 24">
                  <path d="m6 6 12 12M18 6 6 18" />
                </svg>
              </button>
            </div>

            <div class="mobile-evidence-drawer__items">
              <button
                v-for="action in actions"
                :key="`mobile-${action.label}`"
                type="button"
                :disabled="action.disabled"
                :aria-disabled="action.disabled ? 'true' : undefined"
                :class="{ 'is-active': evidenceOverlayStore.activeKind === action.kind }"
                @click="handleAction(action)"
              >
                {{ action.label }}
              </button>

              <button
                type="button"
                class="mobile-evidence-drawer__resume"
                :class="{ 'is-active': evidenceOverlayStore.activeKind === resumeAction.kind }"
                :disabled="resumeAction.disabled"
                :aria-disabled="resumeAction.disabled ? 'true' : undefined"
                @click="handleAction(resumeAction)"
              >
                {{ resumeAction.label }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </nav>
  </Transition>
</template>

<style scoped>
.evidence-top-bar {
  position: fixed;
  inset: 1rem 1.5rem auto;
  z-index: 50;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: start;
  pointer-events: none;
  font-family: 'Geist Mono', ui-monospace, SFMono-Regular, Consolas, monospace;
}

/*
 * A scrim, so the page can pass underneath (PLAN.md 8.9).
 *
 * The bar floats with no background of its own, which is right over the scene
 * and wrong over the DOM sections below it — captured at the foot of the page,
 * the services heading and the contact copy ran straight through the nav pills,
 * two sets of words occupying the same pixels. Padding the sections cannot fix
 * it: the bar is fixed, so content passes under it at *some* scroll position no
 * matter where it starts.
 *
 * A masked gradient rather than a filled bar. It keeps the floating look the
 * pills are designed for while giving anything scrolling beneath somewhere to
 * fade out, and the mask means there is no hard edge where the scrim stops.
 */
.evidence-top-bar::before {
  position: absolute;
  inset: -1rem -1.5rem -2.5rem;
  z-index: -1;
  pointer-events: none;
  content: '';
  background: linear-gradient(
    180deg,
    color-mix(in srgb, var(--bg) 92%, transparent),
    color-mix(in srgb, var(--bg) 62%, transparent) 52%,
    transparent
  );
}

.evidence-top-bar__brand {
  margin: 0;
  color: var(--ice-muted);
  font-size: var(--text-xs);
  letter-spacing: 0.22em;
  line-height: 2rem;
  opacity: 0.55;
  text-transform: uppercase;
  white-space: nowrap;
}

.evidence-top-bar__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  grid-column: 2;
  gap: 0.5rem;
}

.evidence-top-bar__mobile-menu-button,
.mobile-evidence-drawer {
  display: none;
}

/* The drawer takes programmatic focus on open so the dialog is announced;
   suppress the ring only for that, keep a real one for keyboard focus. */
.mobile-evidence-drawer:focus:not(:focus-visible) {
  outline: none;
}

.mobile-evidence-drawer:focus-visible {
  outline: 2px solid var(--gold-glow);
  outline-offset: -4px;
}

.evidence-top-bar button,
.evidence-top-bar__resume {
  min-height: 2rem;
  border: 1px solid color-mix(in srgb, var(--ice-faint) 54%, transparent);
  border-radius: 999px;
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--ice) 8%, transparent), transparent 58%),
    color-mix(in srgb, var(--bg) 56%, transparent);
  box-shadow:
    inset 0 1px 0 color-mix(in srgb, var(--ice) 12%, transparent),
    0 0.75rem 1.8rem rgb(0 0 0 / 0.18);
  color: var(--ice-muted);
  cursor: pointer;
  font-family: inherit;
  font-size: var(--text-xs);
  letter-spacing: 0.02em;
  padding: 0.36rem 0.78rem;
  pointer-events: auto;
  text-transform: none;
  backdrop-filter: blur(14px) saturate(1.18);
  transition:
    background 160ms var(--ease-in-out),
    border-color 160ms var(--ease-in-out),
    color 160ms var(--ease-in-out),
    opacity 160ms var(--ease-in-out),
    transform 160ms var(--ease-in-out);
}

.evidence-top-bar button:hover,
.evidence-top-bar button:focus-visible,
.evidence-top-bar button.is-active {
  border-color: color-mix(in srgb, var(--gold) 72%, transparent);
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--gold) 22%, transparent), transparent 58%),
    color-mix(in srgb, var(--bg) 46%, transparent);
  box-shadow:
    inset 0 1px 0 color-mix(in srgb, var(--gold) 20%, transparent),
    0 0.85rem 1.8rem rgb(0 0 0 / 0.22),
    0 0 1.4rem color-mix(in srgb, var(--gold) 18%, transparent);
  color: var(--gold-glow);
  padding-inline: 1rem;
  transform: translateY(-1px) scale(1.06);
}

.evidence-top-bar button:disabled {
  cursor: default;
  opacity: 0.5;
}

.evidence-top-bar button:disabled:hover {
  border-color: color-mix(in srgb, var(--ice-faint) 54%, transparent);
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--ice) 8%, transparent), transparent 58%),
    color-mix(in srgb, var(--bg) 56%, transparent);
  color: var(--ice-muted);
  transform: none;
}

.evidence-top-bar__resume {
  border-color: color-mix(in srgb, var(--gold) 46%, transparent);
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--gold) 14%, transparent), transparent 58%),
    color-mix(in srgb, var(--bg) 54%, transparent);
  color: var(--gold-glow);
  justify-self: end;
}

.evidence-top-bar__resume:disabled {
  opacity: 0.72;
}

.evidence-top-bar__resume:disabled:hover {
  border-color: color-mix(in srgb, var(--gold) 46%, transparent);
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--gold) 14%, transparent), transparent 58%),
    color-mix(in srgb, var(--bg) 54%, transparent);
  color: var(--gold-glow);
}

.evidence-top-bar-enter-active,
.evidence-top-bar-leave-active {
  transition:
    opacity 180ms linear,
    transform 220ms var(--ease-out-expo);
}

.evidence-top-bar-enter-from,
.evidence-top-bar-leave-to {
  opacity: 0;
  transform: translateY(-0.45rem);
}

.evidence-top-bar-enter-to,
.evidence-top-bar-leave-from {
  opacity: 1;
  transform: translateY(0);
}

@media (max-width: 820px) {
  .evidence-top-bar {
    inset: max(0.85rem, env(safe-area-inset-top)) 0 auto;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: center;
    padding-inline: 1rem;
  }

  .evidence-top-bar__brand {
    font-size: 0.625rem;
    letter-spacing: 0.2em;
    line-height: 1.2;
    max-width: calc(100vw - 5.5rem);
    opacity: 0.54;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .evidence-top-bar__actions,
  .evidence-top-bar__resume {
    display: none;
  }

  .evidence-top-bar__mobile-menu-button {
    display: inline-grid;
    place-items: center;
    justify-self: end;
    width: 2.35rem;
    min-height: 2.35rem;
    padding: 0;
    border-color: color-mix(in srgb, var(--ice-faint) 46%, transparent);
    border-radius: 999px;
    background:
      radial-gradient(circle at 50% 10%, color-mix(in srgb, var(--ice) 12%, transparent), transparent 58%),
      color-mix(in srgb, var(--bg) 48%, transparent);
    backdrop-filter: blur(18px) saturate(1.18);
  }

  .evidence-top-bar__mobile-menu-button span {
    display: block;
    width: 0.86rem;
    height: 1px;
    margin-block: 0.12rem;
    background: color-mix(in srgb, var(--ice-muted) 86%, var(--ice));
    box-shadow: 0 0 0.8rem color-mix(in srgb, var(--ice-muted) 28%, transparent);
  }

  .evidence-top-bar__mobile-menu-button:hover,
  .evidence-top-bar__mobile-menu-button:focus-visible,
  .evidence-top-bar__mobile-menu-button[aria-expanded='true'] {
    border-color: color-mix(in srgb, var(--gold) 66%, transparent);
    color: var(--gold-glow);
    transform: none;
  }

  .evidence-top-bar__mobile-menu-button[aria-expanded='true'] span {
    background: var(--gold-glow);
  }

  .mobile-evidence-drawer {
    position: fixed;
    inset: 0;
    z-index: 70;
    display: block;
    pointer-events: auto;
  }

  .mobile-evidence-drawer__scrim {
    position: absolute;
    inset: 0;
    width: 100%;
    min-height: 100%;
    padding: 0;
    border: 0;
    border-radius: 0;
    background: rgb(0 3 8 / 0.035);
    backdrop-filter: blur(0.25px);
  }

  .mobile-evidence-drawer__panel {
    position: absolute;
    top: 0;
    right: 0;
    display: grid;
    align-content: start;
    gap: 1.2rem;
    width: min(19.5rem, calc(100vw - 2rem));
    min-height: 100%;
    min-height: 100svh;
    padding: max(1.1rem, env(safe-area-inset-top)) 1rem 1rem;
    border-left: 1px solid color-mix(in srgb, var(--ice-faint) 48%, transparent);
    background:
      radial-gradient(circle at 20% 12%, color-mix(in srgb, var(--gold) 7%, transparent), transparent 12rem),
      linear-gradient(180deg, rgb(4 16 29 / 0.34), rgb(1 4 9 / 0.28));
    box-shadow:
      -1rem 0 3rem rgb(0 0 0 / 0.12),
      inset 1px 0 0 color-mix(in srgb, var(--ice) 10%, transparent);
    backdrop-filter: blur(8px) saturate(1.18);
  }

  .mobile-evidence-drawer__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }

  .mobile-evidence-drawer__header p {
    margin: 0;
    color: var(--gold-glow);
    font-size: 0.625rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
  }

  .mobile-evidence-drawer__close {
    display: grid;
    width: 2rem;
    min-height: 2rem;
    place-items: center;
    padding: 0;
    border-radius: 0.125rem;
    color: var(--ice);
  }

  .mobile-evidence-drawer__close svg {
    width: 0.95rem;
    height: 0.95rem;
    fill: none;
    stroke: currentColor;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: 1.8;
  }

  .mobile-evidence-drawer__items {
    display: grid;
    gap: 0.6rem;
    padding-top: 0.35rem;
  }

  .mobile-evidence-drawer__items button {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    min-height: 3rem;
    padding: 0.78rem 0.85rem;
    border-radius: 0.375rem;
    font-size: 0.75rem;
    letter-spacing: 0.12em;
    text-align: left;
    text-transform: uppercase;
    background:
      linear-gradient(135deg, color-mix(in srgb, var(--ice) 5%, transparent), transparent 64%),
      rgb(1 4 9 / 0.2);
  }

  .mobile-evidence-drawer__items button::after {
    color: color-mix(in srgb, var(--ice-muted) 54%, transparent);
    content: '->';
  }

  .mobile-evidence-drawer__items button.is-active::after,
  .mobile-evidence-drawer__items button:focus-visible::after {
    color: var(--gold-glow);
  }

  .mobile-evidence-drawer__resume {
    margin-top: 0.3rem;
    border-color: color-mix(in srgb, var(--gold) 58%, transparent);
    background:
      linear-gradient(135deg, color-mix(in srgb, var(--gold) 18%, transparent), transparent 64%),
      rgb(1 4 9 / 0.22);
    color: var(--gold-glow);
  }
}

.mobile-evidence-drawer-enter-active,
.mobile-evidence-drawer-leave-active {
  transition: opacity 180ms linear;
}

.mobile-evidence-drawer-enter-active .mobile-evidence-drawer__panel,
.mobile-evidence-drawer-leave-active .mobile-evidence-drawer__panel {
  transition: transform 260ms var(--ease-out-expo);
}

.mobile-evidence-drawer-enter-from,
.mobile-evidence-drawer-leave-to {
  opacity: 0;
}

.mobile-evidence-drawer-enter-from .mobile-evidence-drawer__panel,
.mobile-evidence-drawer-leave-to .mobile-evidence-drawer__panel {
  transform: translateX(100%);
}
</style>
