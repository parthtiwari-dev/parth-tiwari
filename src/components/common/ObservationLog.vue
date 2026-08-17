<script setup lang="ts">
/**
 * The observation log — this project's signature element (`DESIGN_LOCK.md`).
 *
 * Every chrome surface that presents evidence renders through here: the Proof
 * panel's metrics and milestones, `ServicesBlock`, the `ProjectIndex` rail, and
 * any future outcome or testimonial list. One shape, used consistently, is the
 * whole point — a card grid for data undoes the divergence work in the lock,
 * which is why card-grid treatment of evidence is explicitly banned.
 *
 * The name is literal rather than decorative. An ephemeris is a table of
 * computed positions, so the UI for proof reads like one: a monospace index
 * column, hairline row dividers, right-aligned values, and no background fill.
 * The hairlines alone carry the structure — per the lock's elevation rule,
 * there is no drop-shadow and no surface tint.
 *
 * Semantics: `role="table"` rather than a real `<table>`, because rows carry
 * multi-line composite content (an outcome plus a detail plus an evidence line)
 * that does not decompose into honest cells. Where content genuinely is tabular
 * the roles still describe it correctly to a screen reader.
 *
 * `as="list"` renders the same motif as a plain `<ul>` with no table roles at
 * all. That exists for surfaces which are navigation rather than data — the
 * project index rail is a list of controls, and announcing it as a table would
 * make it *worse* for a screen reader while looking identical. The lock governs
 * the visual shape; it does not get to override correct semantics.
 */
import { computed } from 'vue'

export type ObservationTone = 'complete' | 'active' | 'roadmap' | 'neutral'

export interface ObservationRow {
  /** Stable key. */
  id: string
  /** Primary line. */
  label: string
  /** Optional second line, muted. */
  detail?: string
  /** Right-aligned value. Numerals sit in a tabular figure column. */
  value?: string
  /** Small uppercase status word rendered beside the index. */
  status?: string
  /** Colour role for `status`. Stays within the single-accent discipline. */
  tone?: ObservationTone
  /** Marks the row as the emphasised one (e.g. the lead service offer). */
  lead?: boolean
}

const props = withDefaults(
  defineProps<{
    rows: ObservationRow[]
    /** Accessible name for the table. */
    label: string
    /** Column heading above the value column, when values are present. */
    valueLabel?: string
    /**
     * Override the auto-generated `01`, `02` index. Supply one entry per row —
     * a short coordinate, timestamp, or count.
     */
    indices?: string[]
    /** Tightens vertical rhythm for dense surfaces like the index rail. */
    dense?: boolean
    /**
     * `table` for data surfaces, `list` for navigation. See the file comment —
     * this picks the semantics, never the appearance.
     */
    as?: 'table' | 'list'
  }>(),
  {
    valueLabel: undefined,
    indices: undefined,
    dense: false,
    as: 'table',
  },
)

const isTable = computed(() => props.as === 'table')
const rootTag = computed(() => (isTable.value ? 'div' : 'ul'))
const rowTag = computed(() => (isTable.value ? 'div' : 'li'))

const hasValueColumn = computed(() => props.rows.some((row) => row.value !== undefined))

/**
 * Zero-padded so the column stays a fixed width and the rows read as a log
 * rather than an ordered list. Falls back to the caller's own indices when
 * a coordinate is more meaningful than a counter.
 */
function indexFor(position: number) {
  return props.indices?.[position] ?? String(position + 1).padStart(2, '0')
}
</script>

<template>
  <component
    :is="rootTag"
    class="observation-log"
    :class="{ 'observation-log--dense': dense, 'observation-log--valued': hasValueColumn }"
    :role="isTable ? 'table' : undefined"
    :aria-label="isTable ? label : undefined"
  >
    <div v-if="isTable && hasValueColumn && valueLabel" class="observation-log__head" role="row">
      <span role="columnheader" class="observation-log__index-head" aria-hidden="true"></span>
      <span role="columnheader" class="observation-log__label-head">{{ label }}</span>
      <span role="columnheader" class="observation-log__value-head">{{ valueLabel }}</span>
    </div>

    <component
      :is="rowTag"
      v-for="(row, position) in rows"
      :key="row.id"
      class="observation-log__row"
      :class="{ 'is-lead': row.lead }"
      :style="{ '--row-index': String(position) }"
      :role="isTable ? 'row' : undefined"
    >
      <span class="observation-log__index" :role="isTable ? 'cell' : undefined">
        <span class="observation-log__ordinal">{{ indexFor(position) }}</span>
        <span
          v-if="row.status"
          class="observation-log__status"
          :class="`observation-log__status--${row.tone ?? 'neutral'}`"
        >{{ row.status }}</span>
      </span>

      <span class="observation-log__body" :role="isTable ? 'cell' : undefined">
        <slot name="row" :row="row" :index="position">
          <span class="observation-log__label">{{ row.label }}</span>
          <span v-if="row.detail" class="observation-log__detail">{{ row.detail }}</span>
        </slot>
      </span>

      <span
        v-if="hasValueColumn"
        class="observation-log__value"
        :role="isTable ? 'cell' : undefined"
      >{{ row.value }}</span>
    </component>
  </component>
</template>

<style scoped>
.observation-log {
  display: grid;
  width: 100%;
  /* Reset for the `as="list"` case; harmless on the div root. */
  margin: 0;
  padding: 0;
  list-style: none;
}

/* The leading column is fixed-width so ordinals align down the page like a
   coordinate column. `auto` on the value column lets the widest numeral set it. */
.observation-log__head,
.observation-log__row {
  display: grid;
  align-items: baseline;
  gap: clamp(0.75rem, 2vw, 1.5rem);
  grid-template-columns: 4.5rem minmax(0, 1fr);
}

.observation-log--valued .observation-log__head,
.observation-log--valued .observation-log__row {
  grid-template-columns: 4.5rem minmax(0, 1fr) auto;
}

.observation-log__head {
  padding-bottom: 0.5rem;
  color: var(--ice-muted);
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.observation-log__value-head {
  text-align: right;
}

/* Hairline dividers are the only structure. No fill, no shadow, no card. */
.observation-log__row {
  border-top: 1px solid color-mix(in srgb, var(--ice-faint) 58%, transparent);
  padding-block: 1rem;
}

.observation-log--dense .observation-log__row {
  padding-block: 0.6rem;
}

.observation-log__index {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.12em;
}

.observation-log__ordinal {
  color: var(--ice-faint);
}

.is-lead .observation-log__ordinal {
  color: var(--gold);
}

.observation-log__status {
  text-transform: uppercase;
}

.observation-log__status--neutral {
  color: var(--ice-muted);
}

/* Tone stays inside the single-accent discipline: gold is the one interactive
   colour, and everything else is an ink weight rather than a second hue. */
.observation-log__status--complete {
  color: var(--gold);
}

.observation-log__status--active {
  color: var(--ice);
}

.observation-log__status--roadmap {
  color: var(--ice-faint);
}

.observation-log__body {
  display: grid;
  gap: 0.35rem;
  min-width: 0;
}

.observation-log__label {
  color: var(--ice);
  font-family: var(--font-display);
  font-size: var(--text-base);
  font-weight: 400;
  line-height: 1.25;
}

.is-lead .observation-log__label {
  font-size: var(--text-xl);
  line-height: 1.1;
}

.observation-log__detail {
  color: var(--ice-muted);
  font-family: var(--font-body);
  font-size: var(--text-sm);
  line-height: 1.55;
}

/* Right-aligned tabular numerals: the column reads as measured, not decorative. */
.observation-log__value {
  color: var(--gold-glow);
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-variant-numeric: tabular-nums;
  font-weight: 300;
  line-height: 1;
  text-align: right;
  white-space: nowrap;
}

/**
 * Entrance is per-row and staggered, within the lock's 150-300ms budget.
 *
 * The hidden state lives *inside* the keyframes with `backwards` fill, never as
 * a standalone `opacity: 0` rule. That ordering is load-bearing: `plain.css`
 * kills every animation with `animation: none !important`, and a row that
 * depends on an animation to become visible would stay invisible forever in
 * plain mode — which is the crawlable, accessible backstop the whole site
 * falls back to. Written this way, stripping the animation simply reveals the
 * row at its natural opacity.
 */
@media (prefers-reduced-motion: no-preference) {
  .observation-log__row {
    animation: observation-row-enter 260ms var(--ease-out-expo) backwards;
    animation-delay: calc(var(--row-index) * 60ms);
  }
}

@keyframes observation-row-enter {
  from {
    opacity: 0;
    transform: translateY(0.4rem);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 767px) {
  .observation-log__head,
  .observation-log__row {
    grid-template-columns: 3rem minmax(0, 1fr);
  }

  /* The value column drops under the body rather than crushing it. */
  .observation-log--valued .observation-log__head,
  .observation-log--valued .observation-log__row {
    grid-template-columns: 3rem minmax(0, 1fr);
  }

  .observation-log__value-head {
    display: none;
  }

  .observation-log__value {
    grid-column: 2;
    text-align: left;
  }
}
</style>
