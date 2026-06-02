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

const socialIconPaths: Record<SocialLinkKind, string> = {
  email: 'M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-.5a.5.5 0 0 0-.5.5v.217l6.5 3.9 6.5-3.9V4a.5.5 0 0 0-.5-.5H2Zm12.5 2.383-4.708 2.825 4.708 2.9V5.883Zm-.034 6.13-5.64-3.471L8 9.018l-.826-.476-5.64 3.47A.5.5 0 0 0 2 12.5h12a.5.5 0 0 0 .466-.487ZM1.5 11.608l4.708-2.9L1.5 5.883v5.725Z',
  github: 'M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82A7.7 7.7 0 0 1 8 3.86c.68 0 1.36.09 2 .27 1.53-1.03 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z',
  linkedin: 'M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708C16 15.487 15.474 16 14.825 16H1.175C.526 16 0 15.487 0 14.854V1.146Zm4.943 12.248V6.169H2.542v7.225h2.401Zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.225 2.4 3.934c0 .694.521 1.248 1.327 1.248h.016Zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4Z',
  x: 'M12.6.75h2.454L9.694 6.892 16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.6.75Zm-.86 13.028h1.36L4.323 2.145H2.865l8.875 11.633Z',
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
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="m6 6 12 12M18 6 6 18" />
      </svg>
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
        <span class="about-signal__link-icon">
          <svg
            aria-hidden="true"
            class="about-signal__link-svg"
            viewBox="0 0 16 16"
          >
            <path :d="socialIconPaths[link.kind]" />
          </svg>
        </span>
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
  display: grid;
  width: 2.65rem;
  height: 2.65rem;
  place-items: center;
  border: 1px solid color-mix(in srgb, var(--ice-faint) 68%, transparent);
  border-radius: 0.45rem;
  background:
    radial-gradient(circle at 50% 0%, rgb(216 234 240 / 0.08), transparent 58%),
    color-mix(in srgb, var(--bg) 34%, transparent);
  box-shadow:
    inset 0 1px 0 rgb(255 255 255 / 0.08),
    0 0.65rem 1.5rem rgb(0 0 0 / 0.18);
  color: var(--ice);
  cursor: pointer;
  padding: 0;
  animation: about-signal-enter 220ms var(--ease-out-expo) 80ms both;
  transition:
    border-color 160ms var(--ease-in-out),
    color 160ms var(--ease-in-out),
    background 160ms var(--ease-in-out),
    box-shadow 160ms var(--ease-in-out),
    transform 160ms var(--ease-in-out);
}

.about-signal__close svg {
  width: 1.05rem;
  height: 1.05rem;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.8;
}

.about-signal__close:hover,
.about-signal__close:focus-visible {
  border-color: var(--gold);
  background: color-mix(in srgb, var(--gold) 12%, transparent);
  color: var(--gold-glow);
  box-shadow:
    inset 0 1px 0 rgb(255 255 255 / 0.12),
    0 0 1.1rem rgb(232 200 106 / 0.18);
  outline: none;
  transform: translateY(-1px);
}

.about-signal__hero {
  display: grid;
  gap: clamp(0.9rem, 2.2vw, 1.35rem);
  max-width: 64rem;
  animation: about-signal-enter 320ms var(--ease-out-expo) both;
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
  gap: 0.85rem;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  width: min(62rem, 100%);
  animation: about-signal-enter 300ms var(--ease-out-expo) 150ms both;
}

.about-signal__link {
  position: relative;
  display: flex;
  min-height: 5.6rem;
  align-items: center;
  gap: 0.8rem;
  overflow: hidden;
  padding: 0.85rem 0.95rem;
  border: 1px solid color-mix(in srgb, var(--ice-faint) 30%, transparent);
  border-radius: 999px;
  background:
    radial-gradient(circle at 18% 50%, color-mix(in srgb, currentColor 20%, transparent), transparent 32%),
    linear-gradient(135deg, color-mix(in srgb, var(--ice) 7%, transparent), transparent 58%),
    color-mix(in srgb, var(--bg) 20%, transparent);
  box-shadow:
    inset 0 1px 0 color-mix(in srgb, var(--ice) 10%, transparent),
    inset 0 -1px 0 rgb(0 0 0 / 0.28),
    0 1.1rem 2.4rem rgb(0 0 0 / 0.16);
  color: var(--ice);
  text-decoration: none;
  text-shadow: 0 0.1rem 0.7rem rgb(1 4 9 / 0.88);
  transition:
    border-color 170ms var(--ease-in-out),
    color 170ms var(--ease-in-out),
    transform 170ms var(--ease-in-out),
    background 170ms var(--ease-in-out);
}

.about-signal__link::after {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: linear-gradient(110deg, transparent 8%, color-mix(in srgb, var(--ice) 16%, transparent) 45%, transparent 70%);
  content: '';
  opacity: 0;
  transform: translateX(-42%);
  transition:
    opacity 170ms var(--ease-in-out),
    transform 280ms var(--ease-out-expo);
}

.about-signal__link:hover,
.about-signal__link:focus-visible {
  border-color: color-mix(in srgb, var(--gold) 68%, transparent);
  background:
    radial-gradient(circle at 18% 50%, color-mix(in srgb, currentColor 34%, transparent), transparent 34%),
    linear-gradient(135deg, color-mix(in srgb, var(--gold) 13%, transparent), transparent 60%),
    color-mix(in srgb, var(--bg) 26%, transparent);
  box-shadow:
    inset 0 1px 0 color-mix(in srgb, var(--gold) 18%, transparent),
    inset 0 -1px 0 rgb(0 0 0 / 0.24),
    0 1.25rem 2.6rem rgb(0 0 0 / 0.22),
    0 0 1.8rem color-mix(in srgb, currentColor 22%, transparent);
  color: var(--gold-glow);
  outline: none;
  transform: translateY(-0.18rem) scale(1.015);
}

.about-signal__link:hover::after,
.about-signal__link:focus-visible::after {
  opacity: 1;
  transform: translateX(42%);
}

.about-signal__link[aria-disabled='true'] {
  cursor: default;
  opacity: 0.48;
  pointer-events: none;
}

.about-signal__link-icon {
  flex: 0 0 auto;
  display: grid;
  width: 3rem;
  aspect-ratio: 1;
  place-items: center;
  border: 1px solid color-mix(in srgb, currentColor 82%, transparent);
  border-radius: 999px;
  background:
    radial-gradient(circle, color-mix(in srgb, currentColor 18%, transparent), transparent 62%),
    color-mix(in srgb, var(--bg) 38%, transparent);
  box-shadow:
    inset 0 1px 0 color-mix(in srgb, var(--ice) 14%, transparent),
    0 0 1.15rem color-mix(in srgb, currentColor 34%, transparent);
  font-family: 'Geist Mono', ui-monospace, SFMono-Regular, Consolas, monospace;
  font-size: 0.9rem;
  font-weight: 700;
  letter-spacing: 0;
}

.about-signal__link-svg {
  display: block;
  width: 1.15rem;
  height: 1.15rem;
  fill: currentColor;
}

.about-signal__link--github {
  color: color-mix(in srgb, var(--ice) 92%, white);
}

.about-signal__link--linkedin {
  color: color-mix(in srgb, var(--teal-active) 78%, var(--ice));
}

.about-signal__link--email {
  color: color-mix(in srgb, var(--gold) 74%, var(--ice));
}

.about-signal__link--x {
  color: var(--ice-muted);
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
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.about-signal__link small {
  display: block;
  margin-top: 0.14rem;
  color: color-mix(in srgb, currentColor 68%, var(--ice-muted));
  letter-spacing: 0.04em;
  overflow-wrap: anywhere;
}

.about-signal__facts {
  display: grid;
  gap: 0.7rem;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  max-width: 70rem;
  text-shadow: 0 0.08rem 0.65rem rgb(1 4 9 / 0.9);
  animation: about-signal-enter 300ms var(--ease-out-expo) 220ms both;
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
    min-height: calc(100svh - 4.75rem);
    gap: 1.8rem;
    padding: 4.4rem 0.4rem 4rem;
  }

  .about-signal__close {
    position: fixed;
    top: max(0.95rem, env(safe-area-inset-top));
    right: 1rem;
    z-index: 2;
    width: 2.85rem;
    height: 2.85rem;
  }

  .about-signal h2 {
    max-width: 9ch;
    font-size: clamp(4.2rem, 22vw, 6.2rem);
  }

  .about-signal__typed {
    min-height: 16em;
    font-size: clamp(1.22rem, 6.4vw, 1.72rem);
    line-height: 1.42;
  }

  .about-signal__links,
  .about-signal__facts {
    grid-template-columns: 1fr;
  }

  .about-signal__links {
    gap: 0.7rem;
  }

  .about-signal__link {
    min-height: 4.7rem;
    padding: 0.65rem 0.7rem;
  }

  .about-signal__link-icon {
    width: 2.65rem;
  }

  .about-signal__facts {
    gap: 0.45rem;
  }

  .about-signal__fact {
    grid-template-columns: minmax(7.8rem, 0.42fr) minmax(0, 1fr);
    align-items: baseline;
    gap: 0.7rem;
    padding: 0.7rem 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .about-signal__close,
  .about-signal__hero,
  .about-signal__links,
  .about-signal__facts,
  .about-signal__cursor {
    animation: none;
  }
}

@keyframes about-signal-enter {
  from {
    opacity: 0;
    transform: translateY(0.55rem);
  }

  to {
    opacity: 1;
    transform: translateY(0);
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
