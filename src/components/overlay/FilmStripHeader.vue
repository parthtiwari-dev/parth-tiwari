<script setup lang="ts">
import { computed } from 'vue'
import type { Project } from '@/types/project'

const props = defineProps<{
  project: Project
  panelIndex: number
  totalPanels: number
}>()

const emit = defineEmits<{
  close: []
  previous: []
  next: []
}>()

const kindLabel: Record<Project['nodeKind'], string> = {
  'personal-project': 'Personal project',
  'work-experience': 'Work experience',
  'current-build': 'Current build',
  utility: 'Utility / tooling',
}

const panelCounter = computed(() => {
  return `[${String(props.panelIndex + 1).padStart(2, '0')} / ${String(props.totalPanels).padStart(2, '0')}]`
})
</script>

<template>
  <header class="film-strip-header">
    <div class="film-strip-header__identity">
      <p class="film-strip-header__eyebrow">
        EPHEMERIS / {{ kindLabel[project.nodeKind] }}
      </p>
      <h2>{{ project.name }}</h2>
    </div>

    <div class="film-strip-header__controls">
      <span class="film-strip-header__counter" aria-live="polite">{{ panelCounter }}</span>
      <button
        type="button"
        class="film-strip-header__button"
        aria-label="Previous overlay panel"
        @click="emit('previous')"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <path d="M15 5 8 12l7 7" />
        </svg>
      </button>
      <button
        type="button"
        class="film-strip-header__button"
        aria-label="Next overlay panel"
        @click="emit('next')"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <path d="m9 5 7 7-7 7" />
        </svg>
      </button>
      <button
        type="button"
        class="film-strip-header__button film-strip-header__button--close"
        aria-label="Close overlay"
        @click="emit('close')"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <path d="m6 6 12 12M18 6 6 18" />
        </svg>
      </button>
    </div>
  </header>
</template>

<style scoped>
.film-strip-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1.5rem;
  color: var(--ice);
  font-family: 'Geist Mono', ui-monospace, SFMono-Regular, Consolas, monospace;
  text-transform: uppercase;
}

.film-strip-header__identity {
  display: grid;
  gap: 0.35rem;
}

.film-strip-header__eyebrow {
  margin: 0;
  color: var(--gold);
  font-size: var(--text-xs);
  letter-spacing: 0.18em;
}

h2 {
  margin: 0;
  color: var(--ice);
  font-family: Spectral, Georgia, serif;
  font-size: clamp(2rem, 4.4vw, 4.8rem);
  font-weight: 300;
  letter-spacing: 0.06em;
  line-height: 0.92;
  text-transform: none;
}

.film-strip-header__controls {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  color: var(--ice-muted);
  font-size: var(--text-xs);
  letter-spacing: 0.14em;
  white-space: nowrap;
}

.film-strip-header__counter {
  margin-right: 0.25rem;
  color: color-mix(in srgb, var(--ice-muted) 84%, transparent);
}

.film-strip-header__button {
  position: relative;
  display: grid;
  width: 2.65rem;
  height: 2.65rem;
  place-items: center;
  border: 1px solid color-mix(in srgb, var(--ice-faint) 68%, transparent);
  border-radius: 999px;
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

.film-strip-header__button svg {
  width: 1.05rem;
  height: 1.05rem;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.8;
}

.film-strip-header__button--close {
  border-radius: 0.45rem;
}

.film-strip-header__button:hover,
.film-strip-header__button:focus-visible {
  border-color: var(--gold);
  background: color-mix(in srgb, var(--gold) 12%, transparent);
  color: var(--gold-glow);
  box-shadow:
    inset 0 1px 0 rgb(255 255 255 / 0.12),
    0 0 1.1rem rgb(232 200 106 / 0.18);
  transform: translateY(-1px);
}

/*
 * Vertical is the scarce axis on a phone, but not at any price (PLAN.md 8.8,
 * corrected in 8.14).
 *
 * 8.8 moved the controls onto the title's row to buy back vertical space, and
 * that was measured wrong. Three 2.75rem targets plus their gaps take ~150px of
 * a 390px viewport, which left the title column at ~290px — and "Stick and Dot"
 * wrapped to **three** lines while "EPHEMERIS / WORK EXPERIENCE" took another
 * three. The row saved 40px of header and spent 90px on wrapping.
 *
 * So the controls go back below the title, where they get the full width and sit
 * in one tidy row. The height comes out of the *type* instead: the eyebrow drops
 * to one line by not breaking on the slash, and the title steps down a size,
 * which is a change nobody notices and this does not have to pay for twice.
 */
@media (max-width: 760px) {
  .film-strip-header {
    flex-direction: column;
    align-items: stretch;
    gap: 0.55rem;
  }

  .film-strip-header__controls {
    flex-wrap: nowrap;
    justify-content: flex-end;
    gap: 0.4rem;
  }

  .film-strip-header__button {
    width: 2.75rem;
    height: 2.75rem;
  }

  /* One line, not three. `clamp(2rem, 4.4vw, 4.8rem)` takes its 2rem floor on a
     phone, which is 32px of Spectral at 0.06em tracking — "Stick and Dot" does
     not fit 390px minus the shell padding at that size, and a three-line title
     is the header cost this breakpoint was trying to avoid. */
  .film-strip-header h2 {
    font-size: 1.65rem;
    letter-spacing: 0.03em;
    line-height: 1.02;
  }

  /* The eyebrow was breaking after "EPHEMERIS /" and again after "WORK",
     spending three lines on a breadcrumb. It is small enough to keep whole and
     ellipsise if a longer kind ever appears. */
  .film-strip-header__eyebrow {
    overflow: hidden;
    font-size: 0.62rem;
    letter-spacing: 0.14em;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
