<script setup lang="ts">
import { ref } from 'vue'
import { useMagnetic } from '@/composables/useMagnetic'

/**
 * The persistent booking action.
 *
 * Mounted once, globally, above every other surface. A stranger arriving from cold
 * outreach must be one tap from a conversation on any screen, at any breakpoint,
 * in any mode — the universe impresses, it must never be the toll booth
 * (CLAUDE.md, PRD.md 5, DESIGN.md 2b).
 *
 * Deliberately small: it sits in the bottom corner, clears the mobile safe area,
 * and never spans enough of the viewport to occlude the scene or an open overlay.
 */
import { computed } from 'vue'
import {
  BOOKING_URL,
  CONTACT_EMAIL_HREF,
  IS_BOOKING_CONFIRMED,
} from '@/config/site'

const props = withDefaults(
  defineProps<{
    /** Visible label. Overridden automatically when booking falls back to email. */
    label?: string
    /** `corner` floats above the page; `inline` sits in normal flow (plain mode, panels). */
    placement?: 'corner' | 'inline'
  }>(),
  {
    label: 'Book a call',
    placement: 'corner',
  },
)

/**
 * Until the booking handle is confirmed live, this points at email instead.
 * See `IS_BOOKING_CONFIRMED` in `@/config/site` — a booking button that 404s costs
 * more than not having one.
 */
const href = computed(() => (IS_BOOKING_CONFIRMED ? BOOKING_URL : CONTACT_EMAIL_HREF))
const isExternal = computed(() => IS_BOOKING_CONFIRMED)
const label = computed(() => (IS_BOOKING_CONFIRMED ? props.label : 'Email Parth'))
const ariaLabel = computed(() =>
  IS_BOOKING_CONFIRMED
    ? 'Book a call with Parth Tiwari, opens the booking page in a new tab'
    : 'Email Parth Tiwari to start a conversation',
)

/**
 * The booking control leans toward the cursor (6.12). It is the one action on
 * the page that matters commercially, so it is the one that earns the extra
 * few pixels of attention.
 */
const ctaRef = ref<HTMLElement | null>(null)
useMagnetic(ctaRef, { radius: 110, strength: 6 })
</script>

<template>
  <a
    ref="ctaRef"
    class="booking-cta"
    :class="`booking-cta--${props.placement}`"
    :href="href"
    :target="isExternal ? '_blank' : undefined"
    :rel="isExternal ? 'noreferrer' : undefined"
    :aria-label="ariaLabel"
  >
    <span class="booking-cta__dot" aria-hidden="true"></span>
    <span class="booking-cta__label">{{ label }}</span>
  </a>
</template>

<style scoped>
.booking-cta {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  min-height: 2.75rem;
  padding: 0.6rem 1rem;
  border: 1px solid color-mix(in srgb, var(--gold) 66%, transparent);
  border-radius: 999px;
  /*
   * Opaque, and haloed (PLAN.md 8.14).
   *
   * This is `position: fixed` and it must never move (CLAUDE.md: booking stays
   * one tap from every screen), so page content passes underneath it at some
   * scroll position no matter what the sections do about padding. At 78% the
   * body copy behind was legible *through* the pill — "your users can open in a
   * browser" reading straight across the label. A floating action that hides
   * what is behind it is normal; one you can read two things through is a bug.
   *
   * The shadow is kept tight on purpose. A wide one reads as a scrim and was
   * fading three words of perfectly good body copy on either side, which trades
   * one legibility problem for a subtler one — a clean edge says "something is
   * on top of this", a soft gradient says "this text is broken".
   */
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--gold) 24%, transparent), transparent 62%),
    var(--bg);
  box-shadow:
    0 0.5rem 1.75rem var(--bg),
    0 0 1.25rem 0.4rem color-mix(in srgb, var(--bg) 72%, transparent);
  color: var(--gold-glow);
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  letter-spacing: 0.13em;
  text-decoration: none;
  text-transform: uppercase;
  backdrop-filter: blur(10px) saturate(1.1);
  transition:
    border-color 0.24s var(--ease-out-expo),
    box-shadow 0.24s var(--ease-out-expo),
    transform 0.24s var(--ease-out-expo);
}

/* Floats above overlays (80-82) so contact is reachable while a project is open,
   and below the boot sequence (9000) and cursor (10000). */
.booking-cta--corner {
  position: fixed;
  right: clamp(0.75rem, 3vw, 2rem);
  bottom: max(clamp(0.75rem, 3vw, 2rem), env(safe-area-inset-bottom));
  z-index: 90;
}

.booking-cta__dot {
  width: 0.4rem;
  height: 0.4rem;
  border-radius: 999px;
  background: var(--gold-glow);
  box-shadow: 0 0 0.5rem var(--gold-glow);
  animation: booking-cta-pulse 2.8s var(--ease-in-out) infinite;
}

.booking-cta:hover,
.booking-cta:focus-visible {
  border-color: var(--gold-glow);
  box-shadow: 0 0.5rem 2rem color-mix(in srgb, var(--gold) 26%, transparent);
  transform: translateY(-1px);
}

/* Never `outline: none` without a replacement — this is the replacement. */
.booking-cta:focus-visible {
  outline: 2px solid var(--gold-glow);
  outline-offset: 3px;
}

@media (max-width: 767px) {
  .booking-cta--corner {
    font-size: 0.625rem;
    letter-spacing: 0.1em;
  }
}

/* Real fallback: the final state is shown immediately, with no motion at all. */
@media (prefers-reduced-motion: reduce) {
  .booking-cta {
    transition: none;
  }

  .booking-cta:hover,
  .booking-cta:focus-visible {
    transform: none;
  }

  .booking-cta__dot {
    animation: none;
    opacity: 1;
  }
}

@media print {
  .booking-cta--corner {
    display: none;
  }
}

@keyframes booking-cta-pulse {
  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.45;
  }
}
</style>
