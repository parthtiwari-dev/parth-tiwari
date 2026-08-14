<script setup lang="ts">
import { computed, ref, toRef, type ComponentPublicInstance } from 'vue'
import { useBootSequence } from '@/composables/useBootSequence'

const props = defineProps<{
  projectCount: number
}>()

const emit = defineEmits<{
  complete: []
}>()

const rootEl = ref<HTMLElement | null>(null)
const lineEls = ref<HTMLElement[]>([])
const skipEl = ref<HTMLElement | null>(null)
const projectCount = toRef(props, 'projectCount')

function setLineEl(el: Element | ComponentPublicInstance | null, index: number) {
  if (el instanceof HTMLElement) {
    lineEls.value[index] = el
  }
}

const { bootLines, isComplete, showSkip, skip } = useBootSequence({
  projectCount,
  rootEl,
  lineEls,
  skipEl,
  onComplete: () => emit('complete'),
})
const shouldHide = computed(() => isComplete.value)
</script>

<template>
  <section
    v-show="!shouldHide"
    ref="rootEl"
    class="boot-sequence"
    role="status"
    aria-live="polite"
    aria-label="EPHEMERIS boot sequence"
  >
    <div class="boot-sequence__field" aria-hidden="true">
      <span class="boot-sequence__aperture"></span>
      <span class="boot-sequence__scan"></span>
    </div>

    <div class="boot-sequence__terminal">
      <!-- The site is EPHEMERIS. EVIDENCEBOUND is retired (CLAUDE.md, PRD.md 10). -->
      <p class="boot-sequence__wordmark">EPHEMERIS</p>
      <p
        v-for="(line, index) in bootLines"
        :key="line"
        :ref="(el) => setLineEl(el, index)"
        class="boot-sequence__line"
      >
        {{ line }}
      </p>
    </div>

    <button
      v-if="showSkip"
      ref="skipEl"
      class="boot-sequence__skip"
      type="button"
      aria-label="Skip boot sequence"
      @click="skip"
    >
      skip
    </button>
  </section>
</template>

<style scoped>
.boot-sequence {
  position: fixed;
  inset: 0;
  z-index: 9000;
  isolation: isolate;
  overflow: hidden;
  background:
    radial-gradient(circle at 54% 42%, rgb(11 182 214 / 0.085), transparent 24rem),
    radial-gradient(circle at 18% 80%, rgb(201 168 76 / 0.06), transparent 18rem),
    linear-gradient(180deg, rgb(0 2 5 / 0.995) 0%, rgb(1 4 9 / 0.99) 100%);
}

.boot-sequence::before {
  position: absolute;
  inset: 0;
  pointer-events: none;
  content: '';
  background:
    linear-gradient(rgb(216 234 240 / 0.022) 1px, transparent 1px),
    linear-gradient(90deg, rgb(216 234 240 / 0.018) 1px, transparent 1px),
    radial-gradient(circle at 50% 42%, rgb(216 234 240 / 0.16) 0 1px, transparent 1.5px);
  background-position:
    0 0,
    0 0,
    0 0;
  background-size:
    56px 56px,
    56px 56px,
    7.5rem 7.5rem;
  mask-image: radial-gradient(circle at center, #000 0%, transparent 74%);
  opacity: 0.5;
}

.boot-sequence::after {
  position: absolute;
  inset: 0;
  pointer-events: none;
  content: '';
  background: linear-gradient(
    180deg,
    transparent 0%,
    transparent 46%,
    rgb(201 168 76 / 0.16) 49%,
    rgb(216 234 240 / 0.24) 50%,
    rgb(201 168 76 / 0.1) 51%,
    transparent 55%,
    transparent 100%
  );
  mix-blend-mode: screen;
  opacity: 0.68;
  transform: translateY(-58vh);
  animation: boot-scan 2.1s cubic-bezier(0.18, 0.78, 0.24, 1) forwards;
}

.boot-sequence__field {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.boot-sequence__aperture {
  position: absolute;
  top: 48%;
  left: 55%;
  width: min(42rem, 58vw);
  aspect-ratio: 1;
  border-radius: 999px;
  background:
    radial-gradient(circle, rgb(216 234 240 / 0.2) 0 1px, transparent 2px),
    radial-gradient(circle, transparent 0 28%, rgb(11 182 214 / 0.06) 29%, transparent 44%),
    conic-gradient(from 18deg, transparent 0 18deg, rgb(201 168 76 / 0.11) 19deg 20deg, transparent 21deg 74deg, rgb(216 234 240 / 0.075) 75deg 76deg, transparent 77deg 360deg);
  filter: blur(0.2px);
  opacity: 0.74;
  transform: translate(-50%, -50%);
  animation: boot-aperture 2.2s ease-out forwards;
}

.boot-sequence__scan {
  position: absolute;
  top: 0;
  bottom: 0;
  left: clamp(1rem, 7vw, 7rem);
  width: 1px;
  background: linear-gradient(180deg, transparent, rgb(201 168 76 / 0.4), transparent);
  box-shadow: 0 0 2rem rgb(201 168 76 / 0.18);
  opacity: 0.65;
}

.boot-sequence__terminal {
  position: absolute;
  bottom: clamp(5.25rem, 14vh, 9rem);
  left: clamp(1rem, 7vw, 7rem);
  z-index: 1;
  display: grid;
  gap: 0.82rem;
  width: min(47rem, calc(100vw - 2rem));
  padding: 0.85rem 0 0.95rem 1.35rem;
  border-left: 1px solid color-mix(in srgb, var(--gold-glow) 76%, transparent);
  background:
    linear-gradient(90deg, rgb(201 168 76 / 0.13), transparent 64%),
    linear-gradient(180deg, rgb(1 8 15 / 0.5), rgb(1 4 9 / 0.2));
  box-shadow:
    -0.8rem 0 2.4rem rgb(201 168 76 / 0.075),
    0 1.5rem 4rem rgb(0 0 0 / 0.18);
  backdrop-filter: blur(6px) saturate(1.05);
}

.boot-sequence__terminal::before {
  position: absolute;
  top: 0;
  left: 0;
  width: min(22rem, 52vw);
  height: 1px;
  content: '';
  background: linear-gradient(90deg, var(--gold-glow), transparent);
  opacity: 0.42;
}

.boot-sequence__wordmark,
.boot-sequence__line,
.boot-sequence__skip {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.boot-sequence__wordmark {
  margin: 0 0 0.2rem;
  color: var(--gold-glow);
  letter-spacing: 0.42em;
}

.boot-sequence__line {
  margin: 0;
  overflow-wrap: anywhere;
  color: var(--ice);
  text-shadow:
    0 0 0.75rem rgb(216 234 240 / 0.26),
    0 0 1.8rem rgb(11 182 214 / 0.1);
  white-space: pre-wrap;
}

/* The wordmark is the terminal's first child, so the three boot lines are its
   last three children. Indexed from the end to stay correct if the header changes. */
.boot-sequence__line:nth-last-child(3) {
  color: color-mix(in srgb, var(--ice) 84%, var(--ice-muted));
}

.boot-sequence__line:nth-last-child(2) {
  color: color-mix(in srgb, var(--gold-glow) 92%, white);
}

.boot-sequence__line:nth-last-child(1) {
  color: color-mix(in srgb, var(--utility-glow) 82%, var(--ice));
}

.boot-sequence__skip {
  position: absolute;
  right: clamp(1rem, 3vw, 2rem);
  bottom: clamp(1rem, 3vw, 2rem);
  z-index: 2;
  padding: 0.55rem 0;
  border: 0;
  border-bottom: 1px solid color-mix(in srgb, var(--gold) 58%, transparent);
  background: transparent;
  color: color-mix(in srgb, var(--gold-glow) 88%, var(--ice));
  text-transform: uppercase;
}

.boot-sequence__skip:focus-visible {
  outline: 1px solid var(--gold-glow);
  outline-offset: 4px;
}

@media (max-width: 640px) {
  .boot-sequence__terminal {
    gap: 0.8rem;
    right: 1rem;
    bottom: 5.5rem;
    left: 1rem;
    width: auto;
    padding: 0.85rem 0 0.85rem 1rem;
  }

  .boot-sequence__wordmark,
  .boot-sequence__line,
  .boot-sequence__skip {
    font-size: 0.625rem;
    letter-spacing: 0.08em;
  }

  .boot-sequence__wordmark {
    letter-spacing: 0.3em;
  }
}

@media (prefers-reduced-motion: reduce) {
  .boot-sequence::after,
  .boot-sequence__aperture {
    animation: none;
  }
}

@keyframes boot-scan {
  0% {
    transform: translateY(-58vh);
  }

  100% {
    transform: translateY(58vh);
  }
}

@keyframes boot-aperture {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.94) rotate(-3deg);
  }

  38% {
    opacity: 0.78;
  }

  100% {
    opacity: 0.42;
    transform: translate(-50%, -50%) scale(1.04) rotate(3deg);
  }
}
</style>
