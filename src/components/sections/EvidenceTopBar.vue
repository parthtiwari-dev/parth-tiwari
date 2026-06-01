<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useEvidenceOverlayStore } from '@/stores/evidenceOverlayStore'
import type { EvidenceOverlayKind } from '@/stores/evidenceOverlayStore'

interface TopBarAction {
  label: string
  kind?: EvidenceOverlayKind
  disabled?: boolean
}

const evidenceOverlayStore = useEvidenceOverlayStore()
const scrollY = ref(0)
const revealThreshold = ref(220)

const actions: TopBarAction[] = [
  { label: 'Experience', kind: 'experience' },
  { label: 'Training', disabled: true },
  { label: 'Capability', disabled: true },
  { label: 'About', disabled: true },
  { label: 'Contact', disabled: true },
]

const resumeAction: TopBarAction = { label: 'Resume', disabled: true }

const isVisible = computed(() => scrollY.value > revealThreshold.value)

function updateScrollState() {
  revealThreshold.value = window.innerHeight * 0.58
  scrollY.value = window.scrollY
}

function handleAction(action: TopBarAction) {
  if (!action.kind || action.disabled) {
    return
  }

  evidenceOverlayStore.open(action.kind)
}

onMounted(() => {
  updateScrollState()
  window.addEventListener('scroll', updateScrollState, { passive: true })
  window.addEventListener('resize', updateScrollState, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateScrollState)
  window.removeEventListener('resize', updateScrollState)
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
        EVIDENCEBOUND / 9 SYSTEMS
      </p>

      <div class="evidence-top-bar__actions">
        <button
          v-for="action in actions"
          :key="action.label"
          type="button"
          :disabled="action.disabled"
          :aria-disabled="action.disabled ? 'true' : undefined"
          @click="handleAction(action)"
        >
          {{ action.label }}
        </button>
      </div>

      <button
        type="button"
        class="evidence-top-bar__resume"
        :disabled="resumeAction.disabled"
        aria-disabled="true"
      >
        {{ resumeAction.label }}
      </button>
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
.evidence-top-bar button:focus-visible {
  border-color: color-mix(in srgb, var(--gold) 72%, transparent);
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--gold) 16%, transparent), transparent 58%),
    color-mix(in srgb, var(--bg) 50%, transparent);
  color: var(--gold-glow);
  outline: none;
  transform: translateY(-1px);
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
    inset-inline: 1rem;
    grid-template-columns: 1fr;
    gap: 0.55rem;
  }

  .evidence-top-bar__brand {
    line-height: 1.2;
  }

  .evidence-top-bar__actions {
    grid-column: 1;
    justify-content: flex-start;
  }

  .evidence-top-bar__resume {
    justify-self: start;
  }
}
</style>
