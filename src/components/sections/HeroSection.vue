<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
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

function updateScroll() {
  scrollY.value = window.scrollY
}

function markInteracted() {
  hasInteracted.value = true
}

onMounted(() => {
  if (props.isPlain) {
    return
  }

  updateScroll()
  window.addEventListener('scroll', updateScroll, { passive: true })
  window.addEventListener('wheel', markInteracted, { passive: true, once: true })
  window.addEventListener('touchmove', markInteracted, { passive: true, once: true })
})

onUnmounted(() => {
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
    <div class="hero-section__content">
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

.hero-section__content {
  display: grid;
  gap: clamp(1rem, 2.2vh, 1.55rem);
  width: min(56rem, calc(100vw - 2rem));
  padding: 0 clamp(1rem, 7vw, 7rem) clamp(6.2rem, 16vh, 10rem);
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

@media (max-width: 720px) {
  .hero-section__content {
    padding-bottom: 5.5rem;
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
