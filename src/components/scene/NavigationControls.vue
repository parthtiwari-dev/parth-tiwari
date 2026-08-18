<script setup lang="ts">
/**
 * Explicit navigation, alongside the gestures (PLAN.md 4.2, 4.5, 4.8).
 *
 * Gestures alone are a guess about the visitor. Drag-to-orbit and pinch-to-zoom
 * are discoverable if you already expect them to be there; on a phone, from a
 * cold-outreach link, most people will not try. So the same three moves exist as
 * buttons — and unlike the gestures they are reachable by keyboard and announced
 * to a screen reader, which is what makes free mode part of the site rather than
 * a bonus for people with a mouse and a hunch.
 *
 * The scale readout is not a control. It reports which of the three zoom scales
 * the camera is currently in (4.5), derived from distance, so it cannot disagree
 * with where the camera actually is.
 *
 * "Resume tour" appears only in free mode. Handing control back is the quiet
 * affordance DESIGN.md §3 asks for — no modal, no mode picker, and nothing on
 * screen at all until the visitor has actually left the tour.
 */
import { computed } from 'vue'
import {
  MAX_DISTANCE,
  MIN_DISTANCE,
  orbitState,
  zoomBy,
  zoomTo,
} from '@/composables/useFreeOrbit'
import { SCALE_DISTANCE, SCALE_ORDER, useNavigationStore, type ZoomScale } from '@/stores/navigationStore'

const navigation = useNavigationStore()

const SCALE_LABEL: Record<ZoomScale, string> = {
  galaxy: 'constellation',
  system: 'neighbourhood',
  project: 'single system',
}

/**
 * Read from the store, not from `orbitState`.
 *
 * `orbitState` is a deliberately non-reactive plain object — it changes every
 * frame and Vue must not track it (DESIGN.md §4). A computed over it would be
 * evaluated once and then never invalidate, so these buttons would enable and
 * disable based on whatever the distance was when the component mounted. The
 * store carries the one reactive copy, pushed from the render loop only when it
 * has actually moved.
 */
const canZoomIn = computed(() => navigation.distance > MIN_DISTANCE + 0.5)
const canZoomOut = computed(() => navigation.distance < MAX_DISTANCE - 0.5)

/**
 * Buttons step between the three named scales rather than nudging by a fixed
 * amount. A zoom control that moves an arbitrary distance leaves the viewer
 * somewhere unnamed; stepping means every press lands somewhere the readout can
 * describe.
 */
function step(direction: -1 | 1) {
  navigation.enterFree()
  const current = SCALE_ORDER.indexOf(navigation.zoomScale)
  const next = SCALE_ORDER[current + direction]
  if (next) zoomTo(orbitState, SCALE_DISTANCE[next])
  else zoomBy(orbitState, direction > 0 ? 0.82 : 1.22)
}

function reset() {
  navigation.resumeGuided()
}
</script>

<template>
  <div class="nav-controls" role="group" aria-label="Scene navigation">
    <p class="nav-controls__scale">
      <span class="nav-controls__scale-label">Scale</span>
      <span class="nav-controls__scale-value">{{ SCALE_LABEL[navigation.zoomScale] }}</span>
    </p>

    <div class="nav-controls__buttons">
      <button
        type="button"
        :disabled="!canZoomIn"
        aria-label="Zoom in one scale"
        @click="step(1)"
      >
        <span aria-hidden="true">+</span>
      </button>
      <button
        type="button"
        :disabled="!canZoomOut"
        aria-label="Zoom out one scale"
        @click="step(-1)"
      >
        <span aria-hidden="true">−</span>
      </button>
    </div>

    <button
      v-if="navigation.isFree"
      type="button"
      class="nav-controls__resume"
      @click="reset"
    >
      Resume tour
    </button>
    <p v-else class="nav-controls__hint">Drag to look around</p>
  </div>
</template>

<style scoped>
/* The same glass panel the legend uses. Not decoration: the hero copy is
   `position: fixed` and passes underneath this, and at 390px the readout was
   landing directly on top of the tagline. A panel makes that read as layering
   rather than collision, which is what the legend already solved. */
.nav-controls {
  display: grid;
  gap: 0.5rem;
  justify-items: start;
  padding: 0.6rem 0.7rem;
  border: 1px solid color-mix(in srgb, var(--ice-faint) 56%, transparent);
  border-radius: 0.375rem;
  background: color-mix(in srgb, var(--bg) 58%, transparent);
  box-shadow:
    inset 0 1px 0 color-mix(in srgb, var(--ice) 10%, transparent),
    0 1rem 2.5rem rgb(0 0 0 / 0.22);
  backdrop-filter: blur(14px) saturate(1.24);
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.nav-controls__scale {
  display: grid;
  gap: 0.15rem;
  margin: 0;
}

.nav-controls__scale-label {
  color: var(--ice-quiet);
}

.nav-controls__scale-value {
  color: var(--gold);
}

.nav-controls__buttons {
  display: flex;
  gap: 0.35rem;
}

.nav-controls button {
  border: 1px solid var(--ice-faint);
  background: color-mix(in srgb, var(--bg) 70%, transparent);
  color: var(--ice-muted);
  cursor: pointer;
  font-family: inherit;
  font-size: inherit;
  letter-spacing: inherit;
  text-transform: inherit;
  transition: border-color 160ms ease, color 160ms ease;
}

.nav-controls__buttons button {
  /* 44px: the interactive target stays thumb-sized even though the glyph is
     small, which is the whole reason these exist on a phone. */
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 0.35rem;
  font-size: 1rem;
}

.nav-controls__resume {
  padding: 0.45rem 0.8rem;
  border-radius: 999px;
  border-color: var(--gold);
  color: var(--gold);
}

.nav-controls button:hover:not(:disabled),
.nav-controls button:focus-visible {
  border-color: var(--gold);
  color: var(--ice);
}

.nav-controls button:focus-visible {
  outline: 2px solid var(--gold-glow);
  outline-offset: 2px;
}

.nav-controls button:disabled {
  opacity: 0.35;
  cursor: default;
}

.nav-controls__hint {
  margin: 0;
  color: var(--ice-quiet);
}

/*
 * Phones: one row, not a column.
 *
 * `ProjectIndex` rails the left edge at 50% height and `BookingCta` docks
 * bottom-right, so the free width at 390px is a band between them. A vertical
 * stack ate the whole lower-left corner and sat on both. The word "scale" goes —
 * the value alone reads fine — and the hint goes with it, because the hero
 * already says "scroll to enter the field" two lines above.
 */
@media (max-width: 767px) {
  .nav-controls {
    grid-auto-flow: column;
    align-items: center;
    gap: 0.5rem;
    padding: 0.45rem 0.55rem;
  }

  .nav-controls__scale-label,
  .nav-controls__hint {
    display: none;
  }

  /* Stays 44px. It is the documented minimum touch target, and these buttons
     exist specifically for the visitor who will not discover the gesture. */
  .nav-controls__buttons button {
    width: 2.75rem;
    height: 2.75rem;
  }

  .nav-controls__resume {
    padding: 0.4rem 0.6rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .nav-controls button {
    transition: none;
  }
}
</style>
