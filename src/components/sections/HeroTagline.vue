<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useCharacterSplit } from '@/composables/useCharacterSplit'

const props = defineProps<{
  text: string
  isPlain: boolean
}>()

const isComplete = ref(props.isPlain)
const { displayed, start, complete } = useCharacterSplit(props.text, 18, () => {
  isComplete.value = true
})

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

onMounted(() => {
  if (props.isPlain || prefersReducedMotion()) {
    complete()
    return
  }

  window.setTimeout(start, 100)
})
</script>

<template>
  <p
    class="hero-tagline type-thesis"
    :aria-label="text"
  >
    {{ displayed }}<span v-if="!isComplete" aria-hidden="true" class="hero-tagline__cursor">_</span>
  </p>
</template>

<style scoped>
.hero-tagline {
  max-width: min(46rem, 82vw);
  min-height: 2.7em;
  margin: 0;
  color: color-mix(in srgb, var(--ice-muted) 88%, var(--ice));
  line-height: 1.08;
  text-shadow: 0 0 2rem rgb(11 182 214 / 0.08);
}

.hero-tagline__cursor {
  display: inline-block;
  color: var(--gold-glow);
  animation: hero-cursor 0.8s steps(1, end) infinite;
}

@keyframes hero-cursor {
  0%,
  44% {
    opacity: 1;
  }

  45%,
  100% {
    opacity: 0;
  }
}
</style>
