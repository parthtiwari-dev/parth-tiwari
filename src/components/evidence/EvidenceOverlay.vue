<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { lockBodyScroll, unlockBodyScroll } from '@/composables/useBodyScrollLock'
import CapabilityMap from '@/components/evidence/CapabilityMap.vue'
import ContactOverlay from '@/components/evidence/ContactOverlay.vue'
import ExperienceLog from '@/components/evidence/ExperienceLog.vue'
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
  contact: {
    eyebrow: 'EVIDENCEBOUND / CONTACT',
    title: 'Contact',
    ariaLabel: 'Contact overlay',
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
  () => evidenceOverlayStore.isOpen,
  async (isOpen) => {
    if (isOpen) {
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
      role="dialog"
      aria-modal="true"
      :aria-label="activeMeta.ariaLabel"
      tabindex="-1"
    >
      <div class="evidence-overlay__scrim" aria-hidden="true" />
      <div class="evidence-overlay__shell glass-panel">
        <header class="evidence-overlay__header">
          <div>
            <p>{{ activeMeta.eyebrow }}</p>
            <h2>{{ activeMeta.title }}</h2>
          </div>
          <button type="button" :aria-label="`Close ${activeMeta.title}`" @click="closeOverlay">
            [x]
          </button>
        </header>

        <div class="evidence-overlay__body scroll-surface">
          <ExperienceLog v-if="evidenceOverlayStore.activeKind === 'experience'" />
          <TrainingData v-else-if="evidenceOverlayStore.activeKind === 'training'" />
          <CapabilityMap v-else-if="evidenceOverlayStore.activeKind === 'capability'" />
          <ContactOverlay v-else-if="evidenceOverlayStore.activeKind === 'contact'" />
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
}

.evidence-overlay__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1.5rem;
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

.evidence-overlay__header button {
  border: 1px solid color-mix(in srgb, var(--ice-faint) 68%, transparent);
  background: color-mix(in srgb, var(--bg) 54%, transparent);
  color: var(--ice);
  cursor: pointer;
  font-family: 'Geist Mono', ui-monospace, SFMono-Regular, Consolas, monospace;
  font-size: var(--text-xs);
  letter-spacing: 0.12em;
  padding: 0.38rem 0.55rem;
}

.evidence-overlay__header button:hover,
.evidence-overlay__header button:focus-visible {
  border-color: var(--gold);
  color: var(--gold-glow);
  outline: none;
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
    padding: 0.5rem;
  }

  .evidence-overlay__shell {
    max-height: calc(100vh - 1rem);
  }

  .evidence-overlay__header {
    flex-direction: column;
  }
}
</style>
