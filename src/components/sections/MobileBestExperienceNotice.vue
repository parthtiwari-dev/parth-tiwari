<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref } from 'vue'

const emit = defineEmits<{
  complete: []
}>()

const AUTO_DISMISS_MS = 3000
const FADE_DURATION_MS = 300

const continueButton = ref<HTMLButtonElement | null>(null)
const isExiting = ref(false)

let autoDismissTimer: number | null = null
let finishTimer: number | null = null
let completed = false

function clearTimers() {
  if (autoDismissTimer !== null) {
    window.clearTimeout(autoDismissTimer)
    autoDismissTimer = null
  }

  if (finishTimer !== null) {
    window.clearTimeout(finishTimer)
    finishTimer = null
  }
}

function complete() {
  if (completed) {
    return
  }

  completed = true
  clearTimers()
  emit('complete')
}

function dismiss() {
  if (isExiting.value || completed) {
    return
  }

  isExiting.value = true
  clearTimers()
  finishTimer = window.setTimeout(complete, FADE_DURATION_MS)
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key !== 'Escape' && event.key !== 'Enter') {
    return
  }

  event.preventDefault()
  dismiss()
}

onMounted(() => {
  autoDismissTimer = window.setTimeout(dismiss, AUTO_DISMISS_MS)
  window.addEventListener('keydown', handleKeydown)

  void nextTick(() => {
    continueButton.value?.focus({ preventScroll: true })
  })
})

onUnmounted(() => {
  clearTimers()
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <section
    class="mobile-best-experience"
    :class="{ 'mobile-best-experience--exiting': isExiting }"
    role="dialog"
    aria-modal="true"
    aria-labelledby="mobile-best-experience-title"
    aria-describedby="mobile-best-experience-description"
    @wheel.prevent
    @touchmove.prevent
  >
    <div class="mobile-best-experience__field" aria-hidden="true">
      <span class="mobile-best-experience__scan"></span>
      <span class="mobile-best-experience__line mobile-best-experience__line--one"></span>
      <span class="mobile-best-experience__line mobile-best-experience__line--two"></span>
      <span class="mobile-best-experience__node mobile-best-experience__node--one"></span>
      <span class="mobile-best-experience__node mobile-best-experience__node--two"></span>
      <span class="mobile-best-experience__node mobile-best-experience__node--three"></span>
    </div>

    <div class="mobile-best-experience__content">
      <p class="mobile-best-experience__eyebrow">
        Mobile field mode
      </p>
      <h1 id="mobile-best-experience-title" class="mobile-best-experience__title">
        For the full constellation, visit on desktop.
      </h1>
      <p id="mobile-best-experience-description" class="mobile-best-experience__copy">
        This phone version keeps the evidence field alive, but the 3D constellation is built for a larger screen.
      </p>
      <button
        ref="continueButton"
        class="mobile-best-experience__button"
        type="button"
        @click="dismiss"
      >
        continue
      </button>
    </div>
  </section>
</template>

<style scoped>
.mobile-best-experience {
  position: fixed;
  inset: 0;
  z-index: 8990;
  display: grid;
  place-items: end start;
  overflow: hidden;
  padding: clamp(1.25rem, 7vw, 2rem);
  isolation: isolate;
  color: var(--ice);
  background:
    radial-gradient(circle at 76% 22%, rgb(11 182 214 / 0.11), transparent 14rem),
    radial-gradient(circle at 16% 76%, rgb(201 168 76 / 0.08), transparent 12rem),
    linear-gradient(180deg, rgb(0 2 5 / 0.98), rgb(1 7 14 / 0.995));
  opacity: 1;
  transform: translateY(0);
  transition:
    opacity 300ms ease,
    transform 300ms var(--ease-out-expo);
  overscroll-behavior: contain;
  touch-action: none;
}

.mobile-best-experience::before {
  position: absolute;
  inset: 0;
  pointer-events: none;
  content: '';
  background:
    radial-gradient(circle at 12% 18%, rgb(216 234 240 / 0.55) 0 1px, transparent 1.5px),
    radial-gradient(circle at 34% 42%, rgb(216 234 240 / 0.35) 0 1px, transparent 1.5px),
    radial-gradient(circle at 71% 31%, rgb(232 200 106 / 0.48) 0 1px, transparent 1.5px),
    radial-gradient(circle at 86% 72%, rgb(216 234 240 / 0.32) 0 1px, transparent 1.5px),
    radial-gradient(circle at 48% 82%, rgb(11 182 214 / 0.42) 0 1px, transparent 1.5px);
  opacity: 0.64;
  animation: mobile-field-twinkle 3s ease-in-out infinite;
}

.mobile-best-experience::after {
  position: absolute;
  inset: 0;
  pointer-events: none;
  content: '';
  background:
    linear-gradient(rgb(216 234 240 / 0.016) 1px, transparent 1px),
    linear-gradient(90deg, rgb(216 234 240 / 0.014) 1px, transparent 1px);
  background-size: 42px 42px;
  mask-image: radial-gradient(circle at 50% 50%, #000 0%, transparent 78%);
  opacity: 0.42;
}

.mobile-best-experience--exiting {
  opacity: 0;
  transform: translateY(0.45rem);
}

.mobile-best-experience__field {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: -1;
}

.mobile-best-experience__scan {
  position: absolute;
  top: -10%;
  bottom: -10%;
  left: 28%;
  width: 1px;
  background: linear-gradient(180deg, transparent, rgb(201 168 76 / 0.38), transparent);
  box-shadow: 0 0 2.2rem rgb(201 168 76 / 0.16);
  opacity: 0.7;
  transform: rotate(16deg);
  animation: mobile-field-scan 3s var(--ease-out-expo) forwards;
}

.mobile-best-experience__line {
  position: absolute;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgb(46 79 94 / 0.78), transparent);
  opacity: 0.64;
  transform-origin: left center;
}

.mobile-best-experience__line--one {
  top: 37%;
  left: 50%;
  width: 38vw;
  transform: rotate(-22deg);
}

.mobile-best-experience__line--two {
  top: 49%;
  left: 24%;
  width: 44vw;
  transform: rotate(18deg);
}

.mobile-best-experience__node {
  position: absolute;
  width: 0.42rem;
  aspect-ratio: 1;
  border-radius: 999px;
  background: var(--gold-glow);
  box-shadow:
    0 0 0 0.28rem rgb(201 168 76 / 0.06),
    0 0 1.4rem rgb(232 200 106 / 0.42);
}

.mobile-best-experience__node--one {
  top: 34%;
  left: 52%;
}

.mobile-best-experience__node--two {
  top: 45%;
  left: 24%;
  background: var(--bg-cyan);
  box-shadow:
    0 0 0 0.28rem rgb(11 182 214 / 0.05),
    0 0 1.4rem rgb(11 182 214 / 0.38);
}

.mobile-best-experience__node--three {
  top: 28%;
  right: 13%;
  width: 0.3rem;
  background: var(--ice);
  box-shadow: 0 0 1rem rgb(216 234 240 / 0.4);
}

.mobile-best-experience__content {
  display: grid;
  gap: 1rem;
  width: min(100%, 25rem);
  padding: 0 0 1.25rem;
}

.mobile-best-experience__eyebrow,
.mobile-best-experience__button {
  font-family: 'Geist Mono', ui-monospace, SFMono-Regular, Consolas, monospace;
  font-size: var(--text-xs);
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.mobile-best-experience__eyebrow {
  margin: 0;
  color: var(--gold-glow);
}

.mobile-best-experience__title {
  max-width: 11ch;
  margin: 0;
  font-family: Spectral, Georgia, serif;
  font-size: clamp(2.8rem, 16vw, 5rem);
  font-weight: 300;
  line-height: 0.94;
  letter-spacing: 0;
  color: var(--ice);
  text-shadow: 0 0 2rem rgb(216 234 240 / 0.14);
}

.mobile-best-experience__copy {
  max-width: 23rem;
  margin: 0;
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: var(--text-base);
  line-height: 1.65;
  color: color-mix(in srgb, var(--ice-muted) 88%, var(--ice));
}

.mobile-best-experience__button {
  justify-self: start;
  min-height: 2.5rem;
  margin-top: 0.45rem;
  padding: 0.6rem 1.05rem;
  border: 1px solid color-mix(in srgb, var(--gold-glow) 64%, transparent);
  border-radius: 999px;
  background: rgb(201 168 76 / 0.09);
  color: color-mix(in srgb, var(--gold-glow) 86%, white);
  box-shadow:
    inset 0 1px 0 rgb(255 255 255 / 0.08),
    0 0 2rem rgb(201 168 76 / 0.08);
}

.mobile-best-experience__button:focus-visible {
  outline: 1px solid var(--gold-glow);
  outline-offset: 4px;
}

@media (min-width: 768px) {
  .mobile-best-experience {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .mobile-best-experience,
  .mobile-best-experience::before,
  .mobile-best-experience__scan {
    animation: none;
    transition: none;
  }
}

@keyframes mobile-field-twinkle {
  0%,
  100% {
    opacity: 0.5;
  }

  50% {
    opacity: 0.78;
  }
}

@keyframes mobile-field-scan {
  0% {
    opacity: 0;
    transform: translateX(-18vw) rotate(16deg);
  }

  22% {
    opacity: 0.72;
  }

  100% {
    opacity: 0.2;
    transform: translateX(26vw) rotate(16deg);
  }
}
</style>
