<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useCharacterSplit } from '@/composables/useCharacterSplit'
import { aboutSignal } from '@/data/about'
import { socialLinks, type SocialLinkKind } from '@/data/socialLinks'

defineEmits<{
  close: []
}>()

const isComplete = ref(false)
const bodyText = computed(() => aboutSignal.paragraphs.join('\n\n'))
const { displayed, start, complete } = useCharacterSplit(bodyText.value, 9, () => {
  isComplete.value = true
})

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

onMounted(() => {
  if (prefersReducedMotion()) {
    complete()
    return
  }

  window.setTimeout(start, 120)
})

const socialIconLabel: Record<SocialLinkKind, string> = {
  email: '@',
  github: 'GH',
  linkedin: 'in',
  x: 'X',
}
</script>

<template>
  <article class="about-signal" aria-labelledby="about-signal-title">
    <button
      type="button"
      class="about-signal__close"
      aria-label="Close About"
      @click="$emit('close')"
    >
      [x]
    </button>

    <section class="about-signal__hero">
      <h2 id="about-signal-title">{{ aboutSignal.heading }}</h2>
      <p class="about-signal__typed" :aria-label="bodyText">
        {{ displayed }}<span v-if="!isComplete" class="about-signal__cursor" aria-hidden="true">_</span>
      </p>
    </section>

    <nav class="about-signal__links" aria-label="Social links">
      <a
        v-for="link in socialLinks"
        :key="link.kind"
        :href="link.disabled ? undefined : link.href"
        :aria-disabled="link.disabled ? 'true' : undefined"
        :tabindex="link.disabled ? -1 : undefined"
        class="about-signal__link"
        :class="`about-signal__link--${link.kind}`"
        target="_blank"
        rel="noreferrer"
      >
        <span class="about-signal__link-icon">{{ socialIconLabel[link.kind] }}</span>
        <span>
          <strong>{{ link.label }}</strong>
          <small>{{ link.value }}</small>
        </span>
      </a>
    </nav>

    <aside class="about-signal__facts" aria-label="About facts">
      <div
        v-for="line in aboutSignal.facts"
        :key="line.label"
        class="about-signal__fact"
      >
        <p>{{ line.label }}</p>
        <span v-for="output in line.output" :key="output">
          {{ output }}
        </span>
      </div>
    </aside>
  </article>
</template>

<style scoped>
.about-signal {
  position: relative;
  z-index: 1;
  display: grid;
  gap: clamp(1.8rem, 4vw, 3.8rem);
  align-content: start;
  box-sizing: border-box;
  width: min(82rem, 100%);
  min-height: calc(100vh - 5.25rem);
  padding: clamp(1.25rem, 4vw, 3rem) clamp(0.25rem, 3vw, 2rem) clamp(4rem, 9vw, 7rem);
  color: var(--ice);
}

.about-signal__close {
  position: absolute;
  top: clamp(1rem, 2vw, 1.5rem);
  right: clamp(1rem, 3vw, 2.2rem);
  border: 1px solid color-mix(in srgb, var(--ice-faint) 68%, transparent);
  background: color-mix(in srgb, var(--bg) 54%, transparent);
  color: var(--ice);
  cursor: pointer;
  font-family: 'Geist Mono', ui-monospace, SFMono-Regular, Consolas, monospace;
  font-size: var(--text-xs);
  letter-spacing: 0.12em;
  padding: 0.38rem 0.55rem;
}

.about-signal__close:hover,
.about-signal__close:focus-visible {
  border-color: var(--gold);
  color: var(--gold-glow);
  outline: none;
}

.about-signal__hero {
  display: grid;
  gap: clamp(0.9rem, 2.2vw, 1.35rem);
  max-width: 64rem;
}

.about-signal h2 {
  margin: 0;
  color: var(--ice);
  font-family: Spectral, Georgia, serif;
  font-size: clamp(4rem, 10vw, 10.5rem);
  font-weight: 300;
  letter-spacing: 0.03em;
  line-height: 0.82;
  text-shadow:
    0 0 1.8rem rgb(1 4 9 / 0.92),
    0 0 3rem rgb(11 182 214 / 0.16);
}

.about-signal__typed {
  max-width: 56rem;
  min-height: 12em;
  margin: 0;
  color: color-mix(in srgb, var(--ice) 82%, var(--ice-muted));
  font-family: Spectral, Georgia, serif;
  font-size: clamp(1.15rem, 2vw, 1.72rem);
  line-height: 1.48;
  text-shadow:
    0 0.08rem 0.65rem rgb(1 4 9 / 0.94),
    0 0 1.4rem rgb(1 4 9 / 0.8);
  text-wrap: pretty;
  white-space: pre-line;
}

.about-signal__cursor {
  color: var(--gold-glow);
  animation: about-cursor 0.8s steps(1, end) infinite;
}

.about-signal__links {
  display: grid;
  gap: 0.7rem;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  width: min(62rem, 100%);
}

.about-signal__link {
  display: grid;
  gap: 0.65rem;
  min-height: 7.4rem;
  align-content: space-between;
  padding: 0.8rem;
  border: 1px solid color-mix(in srgb, var(--ice-faint) 42%, transparent);
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--ice) 7%, transparent), transparent 58%),
    color-mix(in srgb, var(--bg) 28%, transparent);
  box-shadow:
    inset 0 1px 0 color-mix(in srgb, var(--ice) 10%, transparent),
    0 1.1rem 2.4rem rgb(0 0 0 / 0.18);
  color: var(--ice);
  text-decoration: none;
  text-shadow: 0 0.1rem 0.7rem rgb(1 4 9 / 0.88);
  transition:
    border-color 170ms var(--ease-in-out),
    color 170ms var(--ease-in-out),
    transform 170ms var(--ease-in-out),
    background 170ms var(--ease-in-out);
}

.about-signal__link:hover,
.about-signal__link:focus-visible {
  border-color: color-mix(in srgb, var(--gold) 78%, transparent);
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--gold) 15%, transparent), transparent 58%),
    color-mix(in srgb, var(--bg) 34%, transparent);
  color: var(--gold-glow);
  outline: none;
  transform: translateY(-0.16rem);
}

.about-signal__link[aria-disabled='true'] {
  cursor: default;
  opacity: 0.48;
  pointer-events: none;
}

.about-signal__link-icon {
  display: grid;
  width: 2.5rem;
  aspect-ratio: 1;
  place-items: center;
  border: 1px solid currentColor;
  border-radius: 999px;
  box-shadow: 0 0 1rem color-mix(in srgb, currentColor 32%, transparent);
  font-family: 'Geist Mono', ui-monospace, SFMono-Regular, Consolas, monospace;
  font-size: 0.9rem;
  font-weight: 700;
  letter-spacing: 0;
}

.about-signal__link strong,
.about-signal__link small,
.about-signal__fact p,
.about-signal__fact span {
  margin: 0;
  font-family: 'Geist Mono', ui-monospace, SFMono-Regular, Consolas, monospace;
  font-size: var(--text-xs);
  line-height: 1.55;
}

.about-signal__link strong {
  display: block;
  letter-spacing: 0.13em;
  text-transform: uppercase;
}

.about-signal__link small {
  display: block;
  margin-top: 0.14rem;
  color: var(--ice-muted);
  letter-spacing: 0.04em;
  overflow-wrap: anywhere;
}

.about-signal__facts {
  display: grid;
  gap: 0.7rem;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  max-width: 70rem;
  text-shadow: 0 0.08rem 0.65rem rgb(1 4 9 / 0.9);
}

.about-signal__fact {
  display: grid;
  align-content: start;
  gap: 0.32rem;
  padding-top: 0.8rem;
  border-top: 1px solid color-mix(in srgb, var(--ice-faint) 28%, transparent);
}

.about-signal__fact p {
  color: var(--gold-glow);
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.about-signal__fact span {
  color: var(--ice-muted);
  letter-spacing: 0.08em;
}

@media (max-width: 900px) {
  .about-signal {
    padding-top: 4.5rem;
  }

  .about-signal__links,
  .about-signal__facts {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 620px) {
  .about-signal {
    padding-top: 5.5rem;
  }

  .about-signal__links,
  .about-signal__facts {
    grid-template-columns: 1fr;
  }
}

@keyframes about-cursor {
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
