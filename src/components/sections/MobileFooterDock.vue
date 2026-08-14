<script setup lang="ts">
import { computed } from 'vue'
import { isResumeConfigured } from '@/data/resume'
import { socialLinks } from '@/data/socialLinks'
import { useEvidenceOverlayStore, type EvidenceOverlayKind } from '@/stores/evidenceOverlayStore'
import { useProjectStore } from '@/stores/projectStore'

interface DockAction {
  label: string
  kind: EvidenceOverlayKind
  primary?: boolean
  disabled?: boolean
}

const evidenceOverlayStore = useEvidenceOverlayStore()
const projectStore = useProjectStore()

// Derived, not typed in prose — the count and the year both went stale here
// while `projectStore.projectCount` sat one import away (docs/AUDIT.md S8).
const metaLine = computed(() => (
  `${projectStore.projectCount} systems / public-safe evidence / ${new Date().getFullYear()}`
))

const primaryActions: DockAction[] = [
  {
    label: 'Resume',
    kind: 'resume',
    primary: true,
    disabled: !isResumeConfigured,
  },
  {
    label: 'About',
    kind: 'about',
  },
]

const secondaryActions: DockAction[] = [
  {
    label: 'Training',
    kind: 'training',
  },
  {
    label: 'Capability',
    kind: 'capability',
  },
  {
    label: 'Experience',
    kind: 'experience',
  },
]

function openOverlay(kind: EvidenceOverlayKind, disabled?: boolean) {
  if (disabled) {
    return
  }

  evidenceOverlayStore.open(kind)
}
</script>

<template>
  <footer class="mobile-footer-dock" aria-label="Final contact dock">
    <p class="mobile-footer-dock__signal">
      <span>Still here?</span>
      Good. Open the resume, check the proof, or send the signal.
    </p>

    <div class="mobile-footer-dock__primary" aria-label="Primary actions">
      <button
        v-for="action in primaryActions"
        :key="action.label"
        type="button"
        :disabled="action.disabled"
        :aria-disabled="action.disabled ? 'true' : undefined"
        :class="{ 'is-primary': action.primary }"
        @click="openOverlay(action.kind, action.disabled)"
      >
        {{ action.label }}
      </button>
    </div>

    <nav class="mobile-footer-dock__socials" aria-label="Social links">
      <a
        v-for="link in socialLinks"
        :key="link.kind"
        :href="link.disabled ? undefined : link.href"
        :aria-disabled="link.disabled ? 'true' : undefined"
        :tabindex="link.disabled ? -1 : undefined"
        target="_blank"
        rel="noreferrer"
      >
        <span>{{ link.label }}</span>
        <small>{{ link.value }}</small>
      </a>
    </nav>

    <div class="mobile-footer-dock__secondary" aria-label="Evidence shortcuts">
      <button
        v-for="action in secondaryActions"
        :key="action.label"
        type="button"
        @click="openOverlay(action.kind)"
      >
        {{ action.label }}
      </button>
    </div>

    <p class="mobile-footer-dock__meta">
      {{ metaLine }}
    </p>
  </footer>
</template>

<style scoped>
.mobile-footer-dock {
  position: relative;
  z-index: 35;
  display: none;
  gap: 0.75rem;
  margin: 0;
  padding: 1rem 1rem max(3rem, env(safe-area-inset-bottom));
  border-top: 1px solid color-mix(in srgb, var(--ice-faint) 34%, transparent);
  background:
    linear-gradient(180deg, rgb(216 234 240 / 0.055), transparent 42%),
    linear-gradient(180deg, rgb(1 4 9 / 0.22), rgb(1 4 9 / 0.58));
  box-shadow:
    inset 0 1px 0 rgb(255 255 255 / 0.08),
    0 -1.25rem 4rem rgb(0 0 0 / 0.18);
  color: var(--ice);
  pointer-events: auto;
  backdrop-filter: blur(10px) saturate(1.1);
}

.mobile-footer-dock__signal {
  margin: 0;
  color: color-mix(in srgb, var(--ice-muted) 90%, var(--ice));
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.88rem;
  line-height: 1.45;
}

.mobile-footer-dock__signal span,
.mobile-footer-dock__meta,
.mobile-footer-dock button,
.mobile-footer-dock__socials span,
.mobile-footer-dock__socials small {
  font-family: 'Geist Mono', ui-monospace, SFMono-Regular, Consolas, monospace;
  text-transform: uppercase;
}

.mobile-footer-dock__signal span {
  color: var(--gold-glow);
  letter-spacing: 0.13em;
}

.mobile-footer-dock__primary,
.mobile-footer-dock__secondary {
  display: grid;
  gap: 0.55rem;
}

.mobile-footer-dock__primary {
  grid-template-columns: 1.15fr 0.85fr;
}

.mobile-footer-dock__secondary {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.mobile-footer-dock button {
  min-height: 2.45rem;
  border: 1px solid color-mix(in srgb, var(--ice-faint) 46%, transparent);
  border-radius: 999px;
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--ice) 7%, transparent), transparent 58%),
    rgb(1 4 9 / 0.2);
  color: var(--ice-muted);
  font-size: 0.62rem;
  letter-spacing: 0.11em;
  padding: 0.48rem 0.66rem;
}

.mobile-footer-dock button.is-primary {
  border-color: color-mix(in srgb, var(--gold) 62%, transparent);
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--gold) 22%, transparent), transparent 58%),
    rgb(1 4 9 / 0.24);
  box-shadow: 0 0 1rem color-mix(in srgb, var(--gold) 10%, transparent);
  color: var(--gold-glow);
}

.mobile-footer-dock button:disabled {
  opacity: 0.5;
}

.mobile-footer-dock button:focus-visible,
.mobile-footer-dock button:hover,
.mobile-footer-dock__socials a:focus-visible,
.mobile-footer-dock__socials a:hover {
  border-color: var(--gold);
  color: var(--gold-glow);
  outline: none;
}

.mobile-footer-dock__socials {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
}

.mobile-footer-dock__socials a {
  display: inline-flex;
  min-height: 2.1rem;
  align-items: center;
  gap: 0.32rem;
  padding: 0.4rem 0.58rem;
  border: 1px solid color-mix(in srgb, var(--ice-faint) 32%, transparent);
  border-radius: 999px;
  background: rgb(1 4 9 / 0.18);
  color: var(--ice-muted);
  text-decoration: none;
}

.mobile-footer-dock__socials span {
  color: currentColor;
  font-size: 0.58rem;
  letter-spacing: 0.1em;
}

.mobile-footer-dock__socials small {
  display: none;
}

.mobile-footer-dock__meta {
  margin: 0.1rem 0 0;
  color: color-mix(in srgb, var(--ice-faint) 74%, transparent);
  font-size: 0.54rem;
  letter-spacing: 0.12em;
  text-align: center;
}

@media (max-width: 767px) {
  .mobile-footer-dock {
    display: grid;
  }
}
</style>
