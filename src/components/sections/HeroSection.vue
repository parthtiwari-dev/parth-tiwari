<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { registerScreenRegion } from '@/data/screenRegions'
import { useEvidenceOverlayStore } from '@/stores/evidenceOverlayStore'
import HeroName from '@/components/sections/HeroName.vue'
import HeroTagline from '@/components/sections/HeroTagline.vue'

const props = defineProps<{
  isPlain: boolean
}>()

const tagline = 'Systems that act only after the evidence, schema, budget, and workflow state agree.'
const evidenceOverlayStore = useEvidenceOverlayStore()
const scrollY = ref(0)
const hasInteracted = ref(false)

const heroOpacity = computed(() => {
  if (evidenceOverlayStore.isOpen) {
    return 0
  }

  if (props.isPlain || typeof window === 'undefined') {
    return 1
  }

  const isMobileViewport = window.matchMedia('(max-width: 767px)').matches
  const fadeDistance = window.innerHeight * (isMobileViewport ? 0.42 : 0.58)
  return Math.max(0, Math.min(1, 1 - scrollY.value / fadeDistance))
})

const showScrollCue = computed(() => {
  return !props.isPlain && !hasInteracted.value && heroOpacity.value > 0.35
})

const contentEl = ref<HTMLElement | null>(null)

/**
 * Publish the copy's box so the label projector can step around it (8.12).
 *
 * Measured from the live element rather than computed from the padding rules,
 * because the box depends on how the tagline wrapped and how tall the wordmark
 * came out at this viewport — both of which are font-dependent and neither of
 * which this file can predict.
 */
function publishRegion() {
  const el = contentEl.value
  if (!el || props.isPlain) {
    registerScreenRegion('hero', null)
    return
  }

  const box = el.getBoundingClientRect()
  registerScreenRegion('hero', {
    left: box.left,
    top: box.top,
    // The content box includes the bottom padding that clears the scale
    // readout, and there is no copy down there — measuring to the visual
    // bottom of the text keeps the exclusion zone honest.
    right: box.right,
    bottom: box.bottom - parseFloat(getComputedStyle(el).paddingBottom || '0'),
    opacity: heroOpacity.value,
  })
}

function updateScroll() {
  scrollY.value = window.scrollY
  publishRegion()
}

function markInteracted() {
  hasInteracted.value = true
}

watch(heroOpacity, publishRegion)

/**
 * Re-measure whenever the copy's own box changes.
 *
 * Scroll and resize are not enough. The tagline types itself in over ~1.5s, so
 * the block grows line by line after mount while the page is perfectly still —
 * and the first measurement, taken against one line of text, left "QueryPilot"
 * sitting on the wordmark because the box had not reached it yet. Web fonts
 * settling do the same thing.
 */
let resizeObserver: ResizeObserver | null = null

onMounted(() => {
  if (props.isPlain) {
    return
  }

  updateScroll()
  if (contentEl.value && typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(publishRegion)
    resizeObserver.observe(contentEl.value)
  }
  window.addEventListener('resize', publishRegion, { passive: true })
  window.addEventListener('scroll', updateScroll, { passive: true })
  window.addEventListener('wheel', markInteracted, { passive: true, once: true })
  window.addEventListener('touchmove', markInteracted, { passive: true, once: true })
})

onUnmounted(() => {
  resizeObserver?.disconnect()
  resizeObserver = null
  registerScreenRegion('hero', null)
  window.removeEventListener('resize', publishRegion)
  window.removeEventListener('scroll', updateScroll)
  window.removeEventListener('wheel', markInteracted)
  window.removeEventListener('touchmove', markInteracted)
})
</script>

<template>
  <section
    class="hero-section"
    :class="{ 'hero-section--plain': isPlain }"
    :style="{ '--hero-opacity': heroOpacity }"
    aria-label="Portfolio hero"
  >
    <div ref="contentEl" class="hero-section__content">
      <HeroName />
      <HeroTagline :text="tagline" :is-plain="isPlain" />
      <p v-show="showScrollCue" class="hero-section__cue type-mono">
        ↓ scroll to enter the field
      </p>
    </div>
  </section>
</template>

<style scoped>
.hero-section {
  position: fixed;
  inset: 0;
  z-index: 40;
  display: flex;
  align-items: flex-end;
  pointer-events: none;
  opacity: var(--hero-opacity);
  transition: opacity 180ms linear;
}

/* The bottom padding clears the scale readout, which docks at `bottom-6` and
   is about 8rem tall with its buttons. At the old `clamp(6.2rem, 16vh, 10rem)`
   a 900px-tall desktop landed on 10rem and the scroll cue printed straight
   across the top of that panel — visible in the very first captured frame. */
.hero-section__content {
  display: grid;
  gap: clamp(1rem, 2.2vh, 1.55rem);
  width: min(56rem, calc(100vw - 2rem));
  padding: 0 clamp(1rem, 7vw, 7rem) clamp(9rem, 18vh, 12rem);
}

.hero-section__cue {
  margin: 0;
  color: var(--ice-quiet);
  font-size: var(--text-xs);
  letter-spacing: 0.16em;
  text-transform: uppercase;
  animation: hero-cue-pulse 2s ease-in-out infinite;
}

.hero-section--plain {
  position: relative;
  min-height: 54vh;
  align-items: center;
  color: #111111;
  background: #ffffff;
  opacity: 1;
}

.hero-section--plain .hero-section__content {
  padding-top: 6rem;
  padding-bottom: 4rem;
}

/*
 * Clear the controls band (PLAN.md 8.9).
 *
 * At 390px the arrival frame was a pile-up: the tagline, the scroll cue, the
 * scale readout with its two 44px buttons and the systems-index rail were all
 * inside the same 150px of the lower third, printing over one another. The
 * controls are the ones that cannot move — the zoom buttons exist precisely for
 * the visitor who will not discover the gesture, and `BookingCta` is never the
 * thing that gives way (CLAUDE.md) — so the hero does.
 *
 * 11rem clears the dock at `bottom-20` plus its own height. The left padding
 * clears the index rail, which is ~2.1rem of tab railed against the edge at
 * 50% height and was printing through the wordmark's descenders.
 */
@media (max-width: 720px) {
  .hero-section__content {
    padding-right: 1rem;
    padding-bottom: 11rem;
    padding-left: 3.25rem;
  }
}

/* Short phones in landscape have no room for an 11rem gutter; there the cue is
   the thing that goes, since the scroll it describes is the one gesture nobody
   needs telling about on a touch screen. */
@media (max-width: 720px) and (max-height: 680px) {
  .hero-section__content {
    padding-bottom: 8rem;
  }

  .hero-section__cue {
    display: none;
  }
}

@keyframes hero-cue-pulse {
  0%,
  100% {
    opacity: 0.4;
  }

  50% {
    opacity: 1;
  }
}
</style>
