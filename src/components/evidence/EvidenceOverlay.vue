<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { lockBodyScroll, unlockBodyScroll } from '@/composables/useBodyScrollLock'
import AboutSignal from '@/components/evidence/AboutSignal.vue'
import CapabilityMap from '@/components/evidence/CapabilityMap.vue'
import ExperienceLog from '@/components/evidence/ExperienceLog.vue'
import ResumeOverlay from '@/components/evidence/ResumeOverlay.vue'
import TrainingData from '@/components/evidence/TrainingData.vue'
import { useEvidenceOverlayStore, type EvidenceOverlayKind } from '@/stores/evidenceOverlayStore'

const evidenceOverlayStore = useEvidenceOverlayStore()
const overlayRoot = ref<HTMLElement | null>(null)
let hasScrollLock = false

const overlayMeta: Record<EvidenceOverlayKind, { eyebrow: string; title: string; ariaLabel: string }> = {
  experience: {
    eyebrow: 'EVIDENCEBOUND / EXPERIENCE',
    title: 'Experience',
    ariaLabel: 'Experience evidence overlay',
  },
  training: {
    eyebrow: 'EVIDENCEBOUND / TRAINING',
    title: 'Training',
    ariaLabel: 'Training evidence overlay',
  },
  capability: {
    eyebrow: 'EVIDENCEBOUND / CAPABILITY',
    title: 'Capability',
    ariaLabel: 'Capability map overlay',
  },
  about: {
    eyebrow: 'EVIDENCEBOUND / ABOUT',
    title: 'About',
    ariaLabel: 'About signal overlay',
  },
  resume: {
    eyebrow: 'EVIDENCEBOUND / RESUME',
    title: 'Resume',
    ariaLabel: 'Resume overlay',
  },
}

const activeMeta = computed(() => {
  return evidenceOverlayStore.activeKind
    ? overlayMeta[evidenceOverlayStore.activeKind]
    : overlayMeta.experience
})

function closeOverlay() {
  evidenceOverlayStore.close()
}

function handleKeydown(event: KeyboardEvent) {
  if (!evidenceOverlayStore.isOpen) {
    return
  }

  if (event.key === 'Escape') {
    event.preventDefault()
    closeOverlay()
  }
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

watch(
  () => [evidenceOverlayStore.isOpen, evidenceOverlayStore.activeKind] as const,
  async (isOpen) => {
    const [isCurrentlyOpen] = isOpen

    if (isCurrentlyOpen) {
      setBodyScrollLock(true)
      await nextTick()
      overlayRoot.value?.focus()
      return
    }

    setBodyScrollLock(false)
  },
)

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  setBodyScrollLock(false)
})
</script>

<template>
  <Transition name="evidence-overlay">
    <section
      v-if="evidenceOverlayStore.isOpen"
      ref="overlayRoot"
      class="evidence-overlay"
      :class="{ 'evidence-overlay--about': evidenceOverlayStore.activeKind === 'about' }"
      role="dialog"
      aria-modal="true"
      :aria-label="activeMeta.ariaLabel"
      tabindex="-1"
    >
      <div class="evidence-overlay__scrim" aria-hidden="true" />

      <AboutSignal
        v-if="evidenceOverlayStore.activeKind === 'about'"
        @close="closeOverlay"
      />

      <div v-else :key="evidenceOverlayStore.activeKind ?? 'evidence'" class="evidence-overlay__shell glass-panel">
        <header class="evidence-overlay__header">
          <div>
            <p>{{ activeMeta.eyebrow }}</p>
            <h2>{{ activeMeta.title }}</h2>
          </div>
          <button
            type="button"
            class="evidence-overlay__close"
            :aria-label="`Close ${activeMeta.title}`"
            @click="closeOverlay"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24">
              <path d="m6 6 12 12M18 6 6 18" />
            </svg>
          </button>
        </header>

        <div class="evidence-overlay__body scroll-surface">
          <ExperienceLog v-if="evidenceOverlayStore.activeKind === 'experience'" />
          <TrainingData v-else-if="evidenceOverlayStore.activeKind === 'training'" />
          <CapabilityMap v-else-if="evidenceOverlayStore.activeKind === 'capability'" />
          <ResumeOverlay v-else-if="evidenceOverlayStore.activeKind === 'resume'" />
        </div>
      </div>
    </section>
  </Transition>
</template>

<style scoped>
.evidence-overlay {
  position: fixed;
  inset: 0;
  z-index: 82;
  display: grid;
  place-items: center;
  overscroll-behavior: contain;
  padding: clamp(0.75rem, 2vw, 1.5rem);
  color: var(--ice);
  outline: none;
}

.evidence-overlay__scrim {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 24% 10%, rgba(11, 182, 214, 0.12), transparent 36%),
    radial-gradient(circle at 76% 20%, rgba(232, 200, 106, 0.07), transparent 34%),
    rgba(0, 2, 5, 0.68);
  backdrop-filter: blur(10px) saturate(1.08);
}

.evidence-overlay--about {
  z-index: 82;
  place-items: start center;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 4.75rem 1.5rem 0;
}

.evidence-overlay--about .evidence-overlay__scrim {
  background: transparent;
  backdrop-filter: none;
}

.evidence-overlay__shell {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  width: min(86rem, calc(100vw - 1.5rem));
  max-height: min(50rem, calc(100vh - 1.5rem));
  gap: 1rem;
  overflow: hidden;
  padding: clamp(1rem, 2.2vw, 1.75rem);
  animation: evidence-shell-content-enter 260ms var(--ease-out-expo) both;
}

.evidence-overlay__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1.5rem;
  opacity: 0;
  transform: translateY(0.45rem);
  animation: evidence-content-enter 260ms var(--ease-out-expo) 70ms forwards;
}

.evidence-overlay__header p {
  margin: 0 0 0.35rem;
  color: var(--gold);
  font-family: 'Geist Mono', ui-monospace, SFMono-Regular, Consolas, monospace;
  font-size: var(--text-xs);
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.evidence-overlay__header h2 {
  margin: 0;
  color: var(--ice);
  font-family: Spectral, Georgia, serif;
  font-size: clamp(2rem, 4.4vw, 4.8rem);
  font-weight: 300;
  letter-spacing: 0.06em;
  line-height: 0.92;
}

.evidence-overlay__close {
  display: grid;
  width: 2.65rem;
  height: 2.65rem;
  flex: 0 0 auto;
  place-items: center;
  border: 1px solid color-mix(in srgb, var(--ice-faint) 68%, transparent);
  border-radius: 0.45rem;
  background:
    radial-gradient(circle at 50% 0%, rgb(216 234 240 / 0.08), transparent 58%),
    color-mix(in srgb, var(--bg) 44%, transparent);
  box-shadow:
    inset 0 1px 0 rgb(255 255 255 / 0.08),
    0 0.65rem 1.5rem rgb(0 0 0 / 0.18);
  color: var(--ice);
  cursor: pointer;
  padding: 0;
  transition:
    border-color 160ms var(--ease-in-out),
    color 160ms var(--ease-in-out),
    background 160ms var(--ease-in-out),
    box-shadow 160ms var(--ease-in-out),
    transform 160ms var(--ease-in-out);
}

.evidence-overlay__close svg {
  width: 1.05rem;
  height: 1.05rem;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.8;
}

.evidence-overlay__close:hover,
.evidence-overlay__close:focus-visible {
  border-color: var(--gold);
  background: color-mix(in srgb, var(--gold) 12%, transparent);
  color: var(--gold-glow);
  box-shadow:
    inset 0 1px 0 rgb(255 255 255 / 0.12),
    0 0 1.1rem rgb(232 200 106 / 0.18);
  outline: none;
  transform: translateY(-1px);
}

.evidence-overlay__body {
  min-height: 0;
  overflow: auto;
  overscroll-behavior: contain;
  padding: clamp(1rem, 2vw, 1.5rem);
  border: 1px solid color-mix(in srgb, var(--ice-faint) 52%, transparent);
  background:
    linear-gradient(115deg, rgba(216, 234, 240, 0.045), transparent 38%),
    color-mix(in srgb, var(--bg) 54%, transparent);
  opacity: 0;
  transform: translateY(0.65rem);
  animation: evidence-content-enter 300ms var(--ease-out-expo) 130ms forwards;
}

.evidence-overlay-enter-active,
.evidence-overlay-leave-active {
  transition:
    opacity 260ms var(--ease-in-out),
    clip-path 320ms var(--ease-out-expo);
}

.evidence-overlay-enter-from,
.evidence-overlay-leave-to {
  opacity: 0;
  clip-path: inset(100% 0 0 0);
}

.evidence-overlay-enter-to,
.evidence-overlay-leave-from {
  opacity: 1;
  clip-path: inset(0 0 0 0);
}

@media (max-width: 720px) {
  .evidence-overlay {
    align-items: stretch;
    padding: max(0.45rem, env(safe-area-inset-top)) 0.45rem 0.45rem;
  }

  .evidence-overlay__shell {
    width: 100%;
    max-height: calc(100svh - 0.9rem);
    gap: 0.75rem;
    padding: 0.85rem;
  }

  .evidence-overlay__header {
    align-items: flex-start;
    gap: 0.8rem;
  }

  .evidence-overlay__header p {
    font-size: 0.62rem;
    letter-spacing: 0.16em;
  }

  .evidence-overlay__header h2 {
    max-width: calc(100vw - 5.5rem);
    font-size: clamp(2.35rem, 13vw, 4.4rem);
    letter-spacing: 0.035em;
  }

  .evidence-overlay__close {
    position: absolute;
    top: 0.85rem;
    right: 0.85rem;
    width: 2.85rem;
    height: 2.85rem;
  }

  .evidence-overlay__body {
    padding: 0.9rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .evidence-overlay__shell,
  .evidence-overlay__header,
  .evidence-overlay__body {
    animation: none;
  }

  .evidence-overlay__header,
  .evidence-overlay__body {
    opacity: 1;
    transform: none;
  }
}

@keyframes evidence-shell-content-enter {
  from {
    filter: brightness(0.9);
  }

  to {
    filter: brightness(1);
  }
}

@keyframes evidence-content-enter {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
